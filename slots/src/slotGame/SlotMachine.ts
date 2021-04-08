class SlotMachine extends egret.DisplayObjectContainer {

	public static GENERIC_MODAL_LOADED: string = "gameLoaded";
	
	public preLoader: RES.PromiseTaskReporter;

	protected assetName: string;
	private gameConfigFile: string;
	protected languageObjectName: string = "forSlot_tx";
	protected gameToolBar: SlotGameToolbar;
	protected topbar: Topbar;
	protected betBar: Betbar;
	protected dinero: number;
	protected gameCoins: number;
	protected freeSpin: number;

	private static currentGame: SlotMachine;
	public static currentGameId: number;

	protected soundManager: GameSoundManager;

	protected assetStr( str: string ): string{
		return this.assetName + "_json." + str;
	}

	public static getAssetStr( str: string ): string{
		return this.currentGame.assetStr( str );
	}

	public connectReady: boolean = false;
	public assetReady: boolean = false;
	public betListReady: boolean = false;

	public static inRound: boolean = false;

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super();
	}

	protected resetGameToolBarStatus(){
		this.gameToolBar.setBet( GameData.currentBet, LineManager.maxLines, GameData.currentBet == GameData.maxBet );
	}

	public static sendCommand(cmd: string) {
		trace( "ToolBarCommand:" + cmd );
		if( cmd == GameCommands.help ){
			this.currentGame.dispatchEvent( new egret.Event( "showHelp" ) );
		}
		else if (cmd == GameCommands.play) {
			if( Number( this.currentGame.gameCoins ) < GameData.currentBet * LineManager.maxLines ){
				if( this.currentGame.gameToolBar.autoPlaying ){
					this.currentGame.gameToolBar.autoPlaying = false;
					this.currentGame.gameToolBar.unlockAllButtonsAfterOOC();
					this.currentGame.resetGameToolBarStatus();
				}
				this.currentGame.dispatchEvent(new egret.Event("out_of_coins_game_id"));
				return;
			}
			this.currentGame.startPlay();
			this.currentGame.gameToolBar.lockAllButtons();
			this.currentGame.sendPlayRequest();
			// CardManager.clearCardsStatus();
			// PayTableManager.clearPaytablesStatus();
			this.currentGame.gameToolBar.showTip( cmd );
			this.currentGame.dispatchEvent( new egret.Event( "onGamePlay" ) );
		}
		else if( cmd == GameCommands.stop ){
			this.currentGame.gameToolBar.enabledStopButton();
		}
		else if( cmd == GameCommands.showMini ){
			// this.currentGame.showMiniGame();
		}
		else if( cmd == GameCommands.startAuto ){
			this.currentGame.gameToolBar.autoPlaying = true;
		}
		else if( cmd == GameCommands.stopAuto ){
			this.currentGame.gameToolBar.autoPlaying = false;
			clearTimeout( this.currentGame.autoPlayTimeoutId );
		}
		else{//the rest commands are relatied to bet and card enabled
			if( cmd == GameCommands.decreseBet ){
				GameData.betDown();
				this.currentGame.betChanged( -1 );
			}
			else if( cmd == GameCommands.increaseBet ){
				GameData.betUp();
				this.currentGame.betChanged( 1 );
			}
			else if( cmd == GameCommands.maxBet ){
				GameData.setBetToMax();
				this.currentGame.betChanged( 0 );
			}
			else if (cmd == GameCommands.minBet) {
				GameData.setBetToMin();
				this.currentGame.betChanged( 0 );
			}	
			else throw new Error( "hehe" );
			this.currentGame.resetGameToolBarStatus();
			this.currentGame.jackpotArea.tryJackpotMinBet();
		}
	}

	protected betChanged( type: number ){
		this.dispatchEvent(new egret.Event("betChanged", false, false, { type: type }));
		this.jackpotArea.changebet();

		this.gameToolBar.updateFreeSpinCount( GameData.currentBet == GameData.minBet && this.freeSpin );
		this.betBar.setBet( GameData.currentBet );
	}

	private autoPlayTimeoutId: number;

	private aotoNextRound(){
		if( this.waitingForEffect ) this.autoPlayTimeoutId = setTimeout( this.aotoNextRound.bind(this), 500 );
		else this.gameToolBar.autoPlaying = true;
	}

	protected waitingForEffect: boolean;

	protected waitForEffect( callback: Function ){
		this.waitingForEffect = false;
		if( callback )callback();
	}

	protected sendPlayRequest() {
		ISlotServer.playCallback = this.onPlay.bind( this );
		ISlotServer.play( GameData.currentBet, LineManager.maxLines, CardManager.groupNumber, GameData.currentBetIndex );
		SlotMachine.inRound = true;
	}

	/**
	 * quick play
	 */
	public quickPlay(): void {
		this.gameToolBar.quickPlay();
	}

	protected startPlay(): void {
		this.stopAllSound();
		CardManager.stopAllBlink();
	}

/******************************************************************************************/

	protected jackpotArea: JackpotLayer;

	protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
		// override
	}

	public static get jackpotMin(): number{
		if( this.currentGame && this.currentGame.jackpotArea ) return this.currentGame.jackpotArea.jackpotMinBet;
		else return 0;
	}

/***********************************************************************************************************************************/

	public stopAutoPlay(){
		if( this.gameToolBar.autoPlaying ) this.gameToolBar.autoPlaying = false;
	}
}
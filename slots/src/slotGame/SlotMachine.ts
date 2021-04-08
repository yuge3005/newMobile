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

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super();
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
			CardManager.clearCardsStatus();
			PayTableManager.clearPaytablesStatus();
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

	/**
	 * quick play
	 */
	public quickPlay(): void {
		this.gameToolBar.quickPlay();
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
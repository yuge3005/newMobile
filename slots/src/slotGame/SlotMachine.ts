class SlotMachine extends egret.Sprite {

	public static GENERIC_MODAL_LOADED: string = "gameLoaded";
	
	public preLoader: RES.PromiseTaskReporter;

	protected assetName: string;
	private gameConfigFile: string;
	protected languageObjectName: string = "forSlot_tx";
	protected slotIconArea: SlotIconLayer;
	protected payTableArea: PaytableLayer;
	protected gameToolBar: SlotGameToolbar;
	protected topbar: Topbar;
	protected betBar: Betbar;
	protected dinero: number;
	protected gameCoins: number;
	protected freeSpin: number;

	protected connetKeys: Object;
	protected tokenObject: Object;

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
	// public betListReady: boolean = false;

	public static inRound: boolean = false;

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super();

		this.connetKeys = { zona: "Zona" + gameId, sala: "Sala" + gameId };
		this.tokenObject = {};
		this.tokenObject["value"] = { tipo:"jogar", version: PlayerConfig.serverVertion, token: "" };
		this.tokenObject["key"] = "login";
		SlotMachine.currentGameId = gameId;

		this.gameConfigFile = gameConfigFile;

		this.assetName = egret.getDefinitionByName( egret.getQualifiedClassName(this) ).classAssetName;
		SlotMachine.currentGame = this;
		this.soundManager = new GameSoundManager();

		RES.getResByUrl( configUrl, this.analyse, this );

		this.loginToServer();
	}

	private onConfigLoadComplete():void{
		var obj: Object = RES.getRes( this.gameConfigFile.replace( ".", "_" ) );
		SlotBackGroundSetting.getBackgroundData( obj["backgroundColor"], obj["backgroundItems"] );

		
		LineManager.getPayTableData( obj["payTables"] );

		// CardManager.startBlinkTimer();
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);

		LineManager.fitEffectNameList = obj["payTablesFitEffect"];
		LineManager.soundObject = obj["payTablesSound"];
		MuLang.txt = this.getLanguageObject();
	}

	protected getLanguageObject(): Object{
		let txtObj: Object = RES.getRes( "forSlot_tx" );
		if( this.languageObjectName != "forSlot_tx" ){
			let spObj: Object = RES.getRes( this.languageObjectName );
			for( let ob in spObj ){
				txtObj[ob] = spObj[ob];
			}
		}
		return txtObj;
	}

	protected getSoundName( paytalbeName: string ): string{
		if( LineManager.soundObject ){
			let name: string = LineManager.soundObject[paytalbeName];
			if( name ) return name.replace( ".", "_" );
		}
		return "";
	}

	protected onRemove( event: egret.Event ): void{
		// CardManager.stopBlinkTimer();
		ISlotServer.jackpotCallbak = null;
		ISlotServer.jackpotWinCallbak = null;
		this.removedFromStage();
	}

	private analyse( result: string ){
		this.loadAsset( this.assetName );
	}
	
	private loadAsset( assetName: string ){
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loaded, this );
		try{
			let group: Object = RES["config"].config.groups;
			group[assetName] = ( group[assetName] as Array<string> ).concat( group["allGameAssets"] );
		}
		catch( e ){
			egret.error(e);
		}
		RES.loadGroup( assetName, 0, this.preLoader );
	}
	
	private loaded( event: RES.ResourceEvent ){
		if( event.groupName != this.assetName )return;
		RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loaded, this );

		this.assetReady = true;
		this.testReady();
	}

	protected init(){
		this.dispatchEvent( new egret.Event( SlotMachine.GENERIC_MODAL_LOADED ) );
		this.preLoader = null;

		this.scaleX = SlotBackGroundSetting.gameSize.x / SlotBackGroundSetting.gameMask.width;
		this.scaleY = SlotBackGroundSetting.gameSize.y / SlotBackGroundSetting.gameMask.height;
		this.mask = SlotBackGroundSetting.gameMask;

		MDS.mcFactory = SlotBackGroundSetting.initBackground( this );

		this.addPayTables();
		this.addIcons();
		
		this.sendInitDataRequest();

		// this.addEventListener("bingo", this.winBingo, this);
		this.addEventListener( "betChanged", this.onBetChanged, this );
		// this.tellTounamentCurrentBet();
	}

	protected addPayTables(){
		this.payTableArea = eval( "new LineManager.layerType()" );
		this.addChild( this.payTableArea );
		this.payTableArea.addPaytableUI();
	}

	protected addIcons(){
		// sub class override
	}

    private loginToServer(){
		if( ISlotServer.connected ){
			ISlotServer.loginTo( this.connetKeys["zona"], this.connetKeys["sala"], this.onJoinRoomCallback.bind(this) );
			// GameData.getBetList( this.betListCallback.bind( this ), ( this.connetKeys["zona"] as string ).replace( /\D/g, "" ) );
		}
        else setTimeout( this.loginToServer.bind(this), 200 );
    }

	private onJoinRoomCallback() {
		this.connectReady = true;
		this.testReady();
    }

	// private betListCallback( success: boolean ){
	// 	this.betListReady = true;
	// 	this.testReady();
	// }

	private testReady(){
		// if( this.connectReady && this.assetReady && this.betListReady ){
		if( this.connectReady && this.assetReady ){
			this.onConfigLoadComplete();
			this.init();
		}
	}
    
	protected sendInitDataRequest(): void {
		ISlotServer.gameInitCallback = this.onServerData.bind( this );
		// ISlotServer.tounamentCallback = this.onTounamentData.bind( this );
		ISlotServer.sendMessage( this.tokenObject["key"], this.tokenObject["value"] );
	}

	protected onServerData( data: Object ){
		ISlotServer.gameInitCallback = null;

		this.showJackpot( data["acumulado"], data["jackpot_min_bet"], data["betConfig"] );
		ISlotServer.jackpotCallbak = this.jackpotArea.setJackpotNumber.bind(this.jackpotArea);
		ISlotServer.jackpotWinCallbak = this.jackpotArea.jackpotWinCallback.bind( this.jackpotArea );

		this.initToolbar();
		this.initBetbar(data["jackpot_min_bet"]);
		this.updateCredit( data );

		this.resetGameToolBarStatus();

		this.dispatchEvent( new egret.Event( "connected_to_server" ) );
		
		this.freeSpin = data["freeSpin"];
		if( this.freeSpin > 0 ) SlotMachine.sendCommand( GameCommands.minBet );

		this.loadOtherGroup();
	}

	private loadOtherGroup(){
		RES.loadGroup( "gameSettings" );
	}

	protected initToolbar(){
		this.gameToolBar = new SlotGameToolbar;
		Com.addObjectAt( this, this.gameToolBar, 0, SlotGameToolbar.toolBarY );
		this.gameToolBar.showTip( "" );
		this.gameToolBar.addEventListener( XpBar.LEVEL_UP_BONUS, this.onLevelUpBonus, this );

		this.topbar = new Topbar;
		this.addChild( this.topbar );
		
		this.topbar.scaleX = this.gameToolBar.scaleX = SlotBackGroundSetting.gameMask.width / 2000;
		this.topbar.scaleY = this.gameToolBar.scaleY = SlotBackGroundSetting.gameMask.height / 1125;
	}

	protected initBetbar(jackpotMinBet:number){
		this.betBar = new Betbar(jackpotMinBet);
		Com.addObjectAt( this, this.betBar, 0, SlotGameToolbar.toolBarY - 5 );
		this.betBar.setBet( GameData.currentBet );
	}

	protected resetGameToolBarStatus(){
		this.gameToolBar.setBet( GameData.currentBet, LineManager.maxLines, GameData.currentBet == GameData.maxBet );
	}

	public static endSlotRunning (){
		if( !this.currentGame.tipoBonus ) this.currentGame.sendRoundOverRequest();
		else SlotMachine.sendCommand( GameCommands.showMini );
		this.currentGame.gameToolBar.lockAllButtons();
	}

	protected sendRoundOverRequest(){
		ISlotServer.roundOverCallback = this.onRoundOver.bind( this );
		ISlotServer.roundOver();
	}

	protected stopAllSound(): void {
		this.soundManager.stopAll();
	}

	protected removedFromStage(): void {
		this.soundManager.stopAll();
	}

/******************************************************************************************/

	protected tipoBonus: number;
	protected ganho: number;

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
			this.currentGame.slotIconArea.clearIconStatus();
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

	public onPlay( data: Object, hotData: any = null ){
		ISlotServer.playCallback = null;

		if (!data) {//out of coins
			this.stopAutoPlay();
			this.dispatchEvent(new egret.Event("out_of_coins_game_id"));
			return;
		}

		this.updateCredit( data );

		this.gameToolBar.showStop( true );
		this.gameToolBar.showWinResult( 0 );

		this.ganho = data["ganho"];

		this.tipoBonus = data["tipoBonus"];
		this.startRunning( data["figuras"], data["linhasPremiadas"], data["figurasPremiadas"] );
	}

	protected updateCredit( data: Object ): void{
		this.gameCoins = Math.round( data["credito"] );
		if( !isNaN( data["secondCurrency"] ) )this.dinero = data["secondCurrency"];
		if( this.gameToolBar ){
			this.gameToolBar.updateCoinsAndDinero( this.gameCoins, this.dinero == null ? PlayerConfig.player( "score.chips" ) : this.dinero );
			// if( !isNaN(data["xp"]) ) this.gameToolBar.updateXp( data["xp"] );
		}
	}

	public onRoundOver( data: Object ){
		ISlotServer.roundOverCallback = null;
		
		this.roundOver();

		this.gameToolBar.showStop( false );
		this.gameToolBar.unlockAllButtons();
		if( data["ganho"] != "unexpress" )this.gameToolBar.showWinResult( data["ganho"] );
		else this.gameToolBar.showWinResult( this.ganho );

		this.updateCredit( data );

		if( data["freeSpin"] != null )this.checkFreeSpin( data["freeSpin"] );

		// this.updateNewDatas( data );
	}

	protected checkFreeSpin( freeSpin: number ): void{
		this.freeSpin = freeSpin;
		if( GameData.minBet == GameData.currentBet && this.freeSpin > 0 ){
			if( this.gameToolBar.autoPlaying ) this.gameToolBar.autoPlaying = false;
			this.gameToolBar.updateFreeSpinCount( this.freeSpin );
		}
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
		ISlotServer.play( GameData.currentBet, GameData.currentBetIndex, LineManager.lineFormat() );
		SlotMachine.inRound = true;
	}

	/**
	 * quick play
	 */
	public quickPlay(): void {
		this.gameToolBar.quickPlay();
	}

	protected onBetChanged( event: egret.Event ): void{
        // override
	}

	protected roundOver(): void {
		SlotMachine.inRound = false;
    }

	protected startPlay(): void {
		this.stopAllSound();
	}

	protected startRunning( figuras: Array<number>, figlinhasPremiadas: Array<number>, figurasPremiadas: Array<number> ){
		// override
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

	protected onLevelUpBonus( event: egret.Event ){
		let bonus: number = event.data;
		if( !isNaN(bonus) ){
			this.gameCoins += bonus;
			this.gameToolBar.updateCoinsAndDinero( this.gameCoins, this.dinero );
		}
	}
}
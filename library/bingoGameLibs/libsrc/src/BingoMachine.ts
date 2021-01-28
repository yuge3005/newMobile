class BingoMachine extends GameUIItem{

	public static GENERIC_MODAL_LOADED: string = "gameLoaded";
	
	public preLoader: RES.PromiseTaskReporter;

	protected assetName: string;
	private gameConfigFile: string;
	protected languageObjectName: string = "forAll_tx";
	protected megaName: string;

	protected ballArea: BallManager;
	protected cardArea: egret.DisplayObjectContainer;
	protected arrowArea: CardArrowLayer;
	protected payTableArea: PaytableLayer;
	protected gameToolBar: BingoGameToolbar;
	protected topbar: Topbar;

	protected betText: TextLabel;
	protected creditText: TextLabel;
	protected dinero: number;
	protected _gameCoins: number;
	protected get gameCoins(): number{
		return this._gameCoins;
	}
	protected set gameCoins( value: number ){
		this._gameCoins = value;
		if( this.creditText ) this.creditText.setText( Utils.formatCoinsNumber( value ) );
	}
	protected freeSpin: number;

	protected connetKeys: Object;
	protected tokenObject: Object;

	private static currentGame: BingoMachine;
	public static currentGameId: number;

	protected soundManager: GameSoundManager;
	protected ballRunforStop: boolean;

	protected assetStr( str: string ): string{
		return this.assetName + "_json." + str;
	}

	public static getAssetStr( str: string ): string{
		return this.currentGame.assetStr( str );
	}
	
	protected runningBallUI: egret.Sprite;
	protected runningBallContainer: egret.DisplayObjectContainer;
	protected coverRunningBall: egret.DisplayObject;

	protected currentBallIndex: number;
	protected ballCountText: egret.TextField;

	protected needSmallWinTimesOnCard: boolean;

	protected needListenToolbarStatus: boolean;
	protected tipStatusText: TextLabel;
	protected tipStatusTextPosition: egret.Rectangle;
	protected tipStatusTextColor: number;
	protected prizeText: egret.TextField;

	public connectReady: boolean = false;
	public assetReady: boolean = false;
	public betListReady: boolean = false;

	protected ganhoCounter: GanhoCounter;

	public static inRound: boolean = false;

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super();

		this.connetKeys = { zona: "Zona" + gameId, sala: "Sala" + gameId };
		this.tokenObject = {};
		this.tokenObject["value"] = { tipo:"jogar", version: PlayerConfig.serverVertion };
		BingoMachine.currentGameId = gameId;

		this.gameConfigFile = gameConfigFile;
		this.ballArea = new BallManager;

		this.assetName = egret.getDefinitionByName( egret.getQualifiedClassName(this) ).classAssetName;

		BingoMachine.currentGame = this;
		this.soundManager = new GameSoundManager();

		RES.getResByUrl( configUrl, this.analyse, this );

		this.loginToServer();
	}

	private onConfigLoadComplete():void{
		var obj: Object = RES.getRes( this.gameConfigFile.replace( ".", "_" ) );
		BingoBackGroundSetting.getBackgroundData( obj["backgroundColor"], obj["backgroundItems"] );

		this.ballArea.getBallSettings( obj["balls"], obj["ballSize"], obj["ballTextSize"] );
		
		this.extraUIName = obj["extraUIName"];

		PayTableManager.getPayTableData( obj["payTables"] );
		CardManager.getCardData( obj["card"] );

		CardManager.startBlinkTimer();
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);

		GameCard.fitEffectNameList = obj["payTablesFitEffect"];
		PaytableFilter.filterObject = obj["payTablesFilter"];
		PaytableFilter.soundObject = obj["payTablesSound"];
		MuLang.txt = this.getLanguageObject();
	}

	protected getLanguageObject(): Object{
		let txtObj: Object = RES.getRes( "forAll_tx" );
		if( this.languageObjectName != "forAll_tx" ){
			let spObj: Object = RES.getRes( this.languageObjectName );
			for( let ob in spObj ){
				txtObj[ob] = spObj[ob];
			}
		}
		return txtObj;
	}

	protected getSoundName( paytalbeName: string ): string{
		if( PaytableFilter.soundObject ){
			let name: string = PaytableFilter.soundObject[paytalbeName];
			if( name ) return name.replace( ".", "_" );
		}
		return "";
	}

	protected onRemove( event: egret.Event ): void{
		CardManager.stopBlinkTimer();
		IBingoServer.jackpotCallbak = null;
		IBingoServer.jackpotWinCallbak = null;
		this.ballArea.onRemove();
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
		this.dispatchEvent( new egret.Event( BingoMachine.GENERIC_MODAL_LOADED ) );
		this.preLoader = null;

		this.scaleX = BingoBackGroundSetting.gameSize.x / BingoBackGroundSetting.gameMask.width;
		this.scaleY = BingoBackGroundSetting.gameSize.y / BingoBackGroundSetting.gameMask.height;
		this.mask = BingoBackGroundSetting.gameMask;

		MDS.mcFactory = BingoBackGroundSetting.initBackground( this );

		this.addChild( this.ballArea );
		this.addPayTables();

		this.sendInitDataRequest();

		this.cardArea = new egret.DisplayObjectContainer;
		this.addChild(this.cardArea);
		CardGridUISettings.initGridAssets();

		if( this.extraUIName ){
			this.extraUIObject = this.getChildByName( this.assetStr( this.extraUIName ) );
			if( this.extraUIObject )this.extraUIObject.visible = false;
		}

		this.addEventListener("bingo", this.winBingo, this);
		this.addEventListener( "betChanged", this.onBetChanged, this );
		this.tellTounamentCurrentBet();
	}

	protected addPayTables(){
		this.payTableArea = eval( "new PayTableManager.layerType()" );
		this.addChild( this.payTableArea );
		this.payTableArea.addPaytableUI();
	}

    private loginToServer(){
		if( IBingoServer.connected ){
			IBingoServer.loginTo( this.connetKeys["zona"], this.connetKeys["sala"], this.onJoinRoomCallback.bind(this) );
			GameData.getBetList( this.betListCallback.bind( this ), ( this.connetKeys["zona"] as string ).replace( /\D/g, "" ) );
		}
        else setTimeout( this.loginToServer.bind(this), 200 );
    }

	private onJoinRoomCallback() {
		this.connectReady = true;
		this.testReady();
    }

	private betListCallback( success: boolean ){
		this.betListReady = true;
		this.testReady();
	}

	private testReady(){
		if( this.connectReady && this.assetReady && this.betListReady ){
			this.onConfigLoadComplete();
			this.init();
		}
	}
    
	protected sendInitDataRequest(): void {
		IBingoServer.gameInitCallback = this.onServerData.bind( this );
		IBingoServer.tounamentCallback = this.onTounamentData.bind( this );
		IBingoServer.sendMessage( this.tokenObject["key"], this.tokenObject["value"] );
	}

	protected onServerData( data: Object ){
		IBingoServer.gameInitCallback = null;

		this.setCardDatasWithNumeros( data["numerosCartelas"], data["cartela"] );

		this.showJackpot( data["acumulado"], data["jackpot_min_bet"], data["betConfig"] );
		IBingoServer.jackpotCallbak = this.jackpotArea.setJackpotNumber.bind(this.jackpotArea);
		IBingoServer.jackpotWinCallbak = this.jackpotArea.jackpotWinCallback.bind( this.jackpotArea );

		this.initToolbar();
		this.updateCredit( data );

		this.resetGameToolBarStatus();

		this.dispatchEvent( new egret.Event( "connected_to_server" ) );

		this.setLetras( data["letras"] );

		if( this.needListenToolbarStatus )this.listenToGameToolbarStatus();
		
		this.freeSpin = data["freeSpin"];
		if( this.freeSpin > 0 ) BingoMachine.sendCommand( GameCommands.minBet );

		this.loadOtherGroup();
	}

	private loadOtherGroup(){
		RES.loadGroup( "generic" );
		RES.loadGroup( "gameSettings" );
		if( this.megaName ){
			if( !localStorage.getItem( this.megaName ) ){
				try{
					RES.loadGroup( "megaForFirst_" + MuLang.language );
				}catch(e){}
			}
		}
	}

	protected initToolbar(){
		this.gameToolBar = new BingoGameToolbar;
		Com.addObjectAt( this, this.gameToolBar, 0, BingoGameToolbar.toolBarY );
		this.gameToolBar.showTip( "" );
		this.gameToolBar.addEventListener( XpBar.LEVEL_UP_BONUS, this.onLevelUpBonus, this );

		this.topbar = new Topbar;
		this.addChild( this.topbar );
		
		this.topbar.scaleX = this.gameToolBar.scaleX = BingoBackGroundSetting.gameMask.width / 2000;
		this.topbar.scaleY = this.gameToolBar.scaleY = BingoBackGroundSetting.gameMask.height / 1125;
	}

	protected listenToGameToolbarStatus(): void{
		this.gameToolBar.addEventListener( "winChange", this.winChange, this );
		this.gameToolBar.addEventListener( "tipStatus", this.tipStatus, this );

		if( this.tipStatusTextPosition ){
			let rect: egret.Rectangle = this.tipStatusTextPosition;
			this.tipStatusText = MDS.addGameText( this, rect.x, rect.y, rect.height, this.tipStatusTextColor, "bet", false, rect.width );
			this.tipStatusText.textAlign = "center";
			this.tipStatusText.text = MuLang.getText("press play");
		}
	}

	protected tipStatus( e: egret.Event, textDoubleLine: boolean = false ): void{
        switch( e["status"] ){
			case GameCommands.play:
                this.tipStatusText.text = MuLang.getText("good luck");
			    break;
			case GameCommands.extra:
				let extraStr: string = MuLang.getText("extra ball");
				extraStr += textDoubleLine ? "\r\n" : ": ";
                if( e["extraPrice"] ) extraStr += Utils.formatCoinsNumber( e["extraPrice"] );
				else extraStr += MuLang.getText("free");
				this.tipStatusText.setText( extraStr );
                this.lockWinTip = true;
                setTimeout( () => { this.lockWinTip = false }, 10 );
			    break;
			default:
				this.tipStatusText.text = MuLang.getText("press play");
			    break;
		}
    }

    private lockWinTip: boolean = false;

    protected winChange( e: egret.Event, textDoubleLine: boolean = false ): void{
        if( e["winCoins"] && !this.lockWinTip )this.tipStatusText.text = MuLang.getText("win") + ( textDoubleLine ? "\r\n" : ": " ) + e["winCoins"];
    }

	private setCardDatasWithNumeros(numeros: Array<number>, cartela: number){
		let cards: Array<GameCard> = CardManager.cards;
		let numbersOnCards: number = numeros.length / cards.length;

		for( let i: number = 0; i < cards.length; i++ ){
			cards[i].x = GameCardUISettings.cardPositions[i]["x"];
			cards[i].y = GameCardUISettings.cardPositions[i]["y"];
			this.cardArea.addChild( cards[i] );
			cards[i].getNumbers( numeros.slice( i * numbersOnCards, ( i+1 ) * numbersOnCards ) );
		}

		this.changeCardsBg();
		CardManager.groupNumber = cartela;
	}

	protected resetGameToolBarStatus(){
		this.gameToolBar.setBet( GameData.currentBet, CardManager.enabledCards, GameData.currentBet == GameData.maxBet );
		this.betText.setText( Utils.formatCoinsNumber( CardManager.setCardBet( GameData.currentBet ) ) );
	}

	public static runningBall( ballIndex: number ): void{
		this.currentGame.showLastBall( ballIndex );
	}

	public static betweenBallRunning(): Array<Object>{
		return this.currentGame.lightCheck();
	}

	public static runningAnimation( callback: Function, lightResult: Array<Object>, isLastBall: boolean ): void{
		this.currentGame.runningWinAnimation( callback, lightResult, isLastBall );
	}

	public static endBallRunning(){
		this.currentGame.ballRunforStop = false;
		let breakChecked: boolean = this.currentGame.getResultListToCheck();
		if( breakChecked ) return;

		if (this.currentGame.btExtra) {
			this.currentGame.hasExtraBallFit();
			this.currentGame.gameToolBar.unlockAllButtons();
			this.currentGame.gameToolBar.showExtra( true, this.currentGame.valorextra );
			this.currentGame.gameToolBar.showWinResult( this.currentGame.ganho );

			if( this.currentGame.gameToolBar.autoPlaying || this.currentGame.gameToolBar.buyAllExtra ){
				setTimeout(	this.sendCommand.bind(this), 500, GameCommands.extra );
			}

			this.currentGame.showExtraUI();
		}
		else{
			this.currentGame.sendRoundOverRequest();
			this.currentGame.gameToolBar.showExtra( false );
			this.currentGame.gameToolBar.lockAllButtons();
		}
	}

	protected sendRoundOverRequest(){
		IBingoServer.roundOverCallback = this.onRoundOver.bind( this );
		IBingoServer.roundOver();
	}

	protected lightCheck(): Array<Object>{
		let checkingString: Array<string> = CardManager.getCheckingStrings();
		let payTablesDictionary: Object = PayTableManager.payTablesDictionary;

		let resultList: Array<Object> = [];
		let hasFit: boolean = false;
		for( let i: number = 0; i < checkingString.length; i++ ){
			resultList[i] = {};
			for( let ob in payTablesDictionary ){
				let result: Array<number> = payTablesDictionary[ob].lightCheck( checkingString[i] );
				if( result.length > 0 ){
					hasFit = true;
					resultList[i][ob] = result;
				}
			}
		}
		return hasFit ? resultList : [];
	}

	protected inLightCheck: boolean;

	protected getResultListToCheck( inLightCheck: boolean = false ): boolean{
		this.inLightCheck = inLightCheck;
		let checkingString: Array<string> = CardManager.getCheckingStrings();
		let payTablesDictionary: Object = PayTableManager.payTablesDictionary;
		let resultList: Array<Object> = [];
		for( let i: number = 0; i < checkingString.length; i++ ){
			resultList[i] = {};
			for( let ob in payTablesDictionary ){
				let result: PaytableCheckResult = payTablesDictionary[ob].check( checkingString[i] );
				resultList[i][ob] = result;
			}
		}
		this.paytableResultFilter( resultList );
		this.afterCheck( resultList );
		return false;
	}

	protected paytableResultFilter( resultList: Array<Object> ): void{
		
	}

	protected showExtraUI( show: boolean = true ){
		if( this.extraUIObject )this.extraUIObject.visible = show;
	}

	protected clearRunningBallUI(): void{
		if( this.runningBallUI && this.runningBallContainer.contains( this.runningBallUI ) )this.runningBallContainer.removeChild( this.runningBallUI );
	}

	protected setLetras( letrasData: string ): void{
		//only for pachinko
	}

	protected playSound(soundName: string, repeat: number = 1, callback: Function = null ): void {
		this.soundManager.play(soundName, repeat, callback );
	}

	protected stopSound(soundName: string): void {
		this.soundManager.stop(soundName);
	}

	protected stopAllSound(): void {
		this.soundManager.stopAll();
	}

	protected removedFromStage(): void {
		this.soundManager.stopAll();
	}

	protected tileBg(): boolean{
        let bg: egret.Bitmap = this.getChildAt( 0 ) as egret.Bitmap;
        if( bg ){
            bg.fillMode = egret.BitmapFillMode.REPEAT;
            bg.width = BingoBackGroundSetting.gameMask.width;
            bg.height = BingoBackGroundSetting.gameMask.height;
            return true;
        }
        return false;
    }

/******************************************************************************************/

	protected btExtra: boolean;
	protected ganho: number;
	protected valorextra: number;

	public static sendCommand(cmd: string) {
		trace( "ToolBarCommand:" + cmd );
		if( cmd == GameCommands.help ){
			this.currentGame.dispatchEvent( new egret.Event( "showHelp" ) );
		}
		else if (cmd == GameCommands.changeNumber) {
			this.currentGame.changeNumberSound();
			CardManager.clearCardsStatus();
			if( this.currentGame instanceof V1Game ){
				this.currentGame.setCardDatasWithNumeros( this.currentGame["getCardsGroup"]( CardManager.groupNumber ), CardManager.groupNumber < 100 ? CardManager.groupNumber + 1 : 1 );
				return;
			}
			this.currentGame.gameToolBar.lockAllButtons();
			IBingoServer.changeNumberCallback = this.currentGame.onChangeNumber.bind( this.currentGame );
			GameCard.changeingCard = true;
			IBingoServer.changeNumber();
		}
		else if (cmd == GameCommands.play) {
			if( Number( this.currentGame.gameCoins ) < GameData.currentBet * CardManager.enabledCards ){
				if( this.currentGame.gameToolBar.autoPlaying ){
					this.currentGame.gameToolBar.autoPlaying = false;
					this.currentGame.gameToolBar.unlockAllButtonsAfterOOC();
					this.currentGame.resetGameToolBarStatus();
				}
				this.currentGame.dispatchEvent(new egret.Event("out_of_coins_game_id"));
				alert( "out of coins" );
				return;
			}
			this.currentGame.startPlay();
			this.currentGame.gameToolBar.lockAllButtons();
			this.currentGame.sendPlayRequest();
			CardManager.clearCardsStatus();
			PayTableManager.clearPaytablesStatus();
			this.currentGame.gameToolBar.showTip( cmd );
			this.currentGame.ballArea.clearBalls();
			this.currentGame.showExtraUI( false );
			this.currentGame.dispatchEvent( new egret.Event( "onGamePlay" ) );
		}
		else if( cmd == GameCommands.stop ){
			this.currentGame.ballRunforStop = true;
			this.currentGame.gameToolBar.enabledStopButton();
			this.currentGame.ballArea.stopBallRunning();
		}
		else if (cmd == GameCommands.collect) {
			this.currentGame.collectExtraBall();
			this.currentGame.sendCancelExtraReuqest();
			this.currentGame.gameToolBar.lockAllButtons();
			this.currentGame.gameToolBar.showTip( "" );
			this.currentGame.clearRunningBallUI();
		}
		else if (cmd == GameCommands.extra) {
			let isOOC: boolean = this.currentGame.checkOOCWhenExtra();
			if( isOOC )return;
			this.currentGame.gameToolBar.lockAllButtons();
			this.currentGame.sendExtraRequest();
			this.currentGame.getExtraBallFit();
		}
		else if( cmd == GameCommands.saving ){
			this.currentGame.gameToolBar.lockAllButtons();
			this.currentGame.sendExtraRequest( true );
			this.currentGame.getExtraBallFit();
		}
		else if( cmd == GameCommands.showMini ){
			this.currentGame.showMiniGame();
		}
		else if( cmd == GameCommands.startAuto ){
			this.currentGame.gameToolBar.autoPlaying = true;
		}
		else if( cmd == GameCommands.stopAuto ){
			this.currentGame.gameToolBar.autoPlaying = false;
			clearTimeout( this.currentGame.autoPlayTimeoutId );
		}
		else if( cmd == GameCommands.buyAll ){
			this.currentGame.gameToolBar.buyAllExtra = true;
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
			this.currentGame.changeCardsBg();
			this.currentGame.jackpotArea.tryJackpotMinBet();
			this.currentGame.tellTounamentCurrentBet();
		}
	}

	protected betChanged( type: number ){
		this.dispatchEvent(new egret.Event("betChanged", false, false, { type: type }));
		this.jackpotArea.changebet();

		this.gameToolBar.updateFreeSpinCount( GameData.currentBet == GameData.minBet && this.freeSpin );
	}

	protected checkOOCWhenExtra(): boolean{
		let isOOC: boolean;
		if( this.isMegaBall ) isOOC = Number( this.dinero ) < this.valorextra;
		else isOOC = Number( this.gameCoins ) < this.valorextra;
		
		if( isOOC ){
			if( this.gameToolBar.autoPlaying ){
				this.gameToolBar.autoPlaying = false;
				this.gameToolBar.unlockAllButtonsAfterOOCExtra();
			}
			if( this.gameToolBar.buyAllExtra ) this.gameToolBar.buyAllExtra = false;
			if( this.isMegaBall ) this.dispatchEvent(new egret.Event("out_of_dinero"));
			else this.dispatchEvent(new egret.Event("out_of_coins_game_id"));
		}
		return isOOC;
	}

	private tellTounamentCurrentBet(){
		let betData: Object = {};
		betData["currentBet"] = GameData.currentBet;
		betData["betProgress"] = (GameData.currentBetIndex + 1) / GameData.bets.length;
		this.dispatchEvent(new egret.Event("BET_CHANGED", false, false, betData ));
	}

	public changeCardsBg(){
		CardManager.changeCardsBgColor();
	}

	public onChangeNumber( data: Object ){
		IBingoServer.changeNumberCallback = null;
		GameCard.changeingCard = false;

		this.setCardDatasWithNumeros( data["numerosCartelas"], data["cartela"] );
		this.gameToolBar.unlockAllButtons();
		this.changeCardsBg();
	}

	public onPlay( data: Object, hotData: any = null ){
		IBingoServer.playCallback = null;
		this.firstHaveExtraBall = true;
		this.lastLightResult = [];
		this.isMegaBall = false;

		if (!data) {//out of coins
			this.stopAutoPlay();
			this.dispatchEvent(new egret.Event("out_of_coins_game_id"));
			return;
		}

		this.updateCredit( data );

		this.gameToolBar.showStop( true );
		this.gameToolBar.showWinResult( 0 );

		this.currentBallIndex = 0;
		this.btExtra = data["btextra"];
		this.ganho = data["ganho"];
		if( data["ebPrice"] ) this.valorextra = data["ebPrice"];
		else this.valorextra = data["valorextra"];
		this.gratisNumber = data["gratis"] > 0 ? data["gratis"] + data["bolas"].length : 0;
		if( data["bolas"] && data["bolas"].length ){
			this.ballArea.runBalls( data["bolas"] );
		}
	}

	protected updateCredit( data: Object ): void{
		this.gameCoins = Math.round( data["credito"] );
		if( !isNaN( data["secondCurrency"] ) )this.dinero = data["secondCurrency"];
		if( this.gameToolBar ){
			this.gameToolBar.updateCoinsAndDinero( this.gameCoins, this.dinero );
			if( !isNaN(data["xp"]) ) this.gameToolBar.updateXp( data["xp"] );
		}
	}

	public onRoundOver( data: Object ){
		IBingoServer.roundOverCallback = null;
		
		this.roundOver();

		this.gameToolBar.showStop( false );
		this.gameToolBar.unlockAllButtons();
		if( data["ganho"] != "unexpress" )this.gameToolBar.showWinResult( data["ganho"] );
		else this.gameToolBar.showWinResult( this.ganho );

		this.updateCredit( data );

		if( data["freeSpin"] != null )this.checkFreeSpin( data["freeSpin"] );
		this.checkAuto();

		this.updateNewDatas( data );
	}

	protected checkAuto(){
		if( !this.gameToolBar.autoPlaying )this.resetGameToolBarStatus();
		if (this.gameToolBar.buyAllExtra) this.gameToolBar.buyAllExtra = false;
		if (this.gameToolBar.autoPlaying){
			this.gameToolBar.lockAllButtons();
			this.autoPlayTimeoutId = setTimeout( this.aotoNextRound.bind(this), 1000 );
		}
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

	public onCancelExtra( data: Object ){
		IBingoServer.cancelExtraCallback = null;
		this.gameToolBar.unlockAllButtons();
		this.gameToolBar.showExtra(false);
		
		this.roundOver();

		this.updateCredit( data );
		
		if( data["freeSpin"] != null )this.checkFreeSpin( data["freeSpin"] );

		this.resetGameToolBarStatus();

		this.showMissExtraBall( data["extrasnaocompradas"] );

		this.updateNewDatas( data );
	}

	public onExtra( data: Object ){
		IBingoServer.extraCallback = null;

		data["btextra"] = data["btextra"] || data["isMegaBall"];
		this.isMegaBall = data["isMegaBall"];

		if (!data) {//out of coins
			let needChangeCollectBtnStatus: boolean = this.gameToolBar.autoPlaying;
			this.stopAutoPlay();
			this.dispatchEvent( new egret.Event( "out_of_coins_game_id" ) );
			if( needChangeCollectBtnStatus )this.gameToolBar.showCollectButtonAfterOOC();
			return;
		}

		this.updateCredit( data );

		this.btExtra = data["btextra"];
		this.ganho = data["ganho"];
		if( data["ebPrice"] ) this.valorextra = data["ebPrice"];
		else this.valorextra = data["valorextra"];

		if( data["extra"] ){
			this.ballArea.runExtra( data["extra"] );
		}

		CardManager.stopAllBlink();
	}

	protected showMissExtraBall( balls: Array<number> ){
		this.ballArea.runMissExtra( balls );
	}

	protected sendPlayRequest() {
		IBingoServer.playCallback = this.onPlay.bind( this );
		IBingoServer.play( GameData.currentBet, CardManager.enabledCards, CardManager.groupNumber, GameData.currentBetIndex );
		BingoMachine.inRound = true;
	}

	protected sendExtraRequest( saving: boolean = false ){
		IBingoServer.extraCallback = this.onExtra.bind( this );
		IBingoServer.extra();
	}

	protected sendCancelExtraReuqest(){
		IBingoServer.cancelExtraCallback = this.onCancelExtra.bind( this );
		IBingoServer.cancelExtra();
	}

	protected showLastBallAt( ballIndex: number, x: number, y: number, scale: number = 1 ): void{
		if( this.runningBallUI && ( this.runningBallContainer ).contains( this.runningBallUI ) ){
			( this.runningBallContainer ).removeChild( this.runningBallUI );
		}
		this.runningBallUI = this.ballArea.getABigBall( ballIndex );
		this.runningBallUI.scaleX = this.runningBallUI.scaleY = scale;
		Com.addObjectAt( this.runningBallContainer, this.runningBallUI, x, y );
	}

	protected afterCheck( resultList: Array<Object> ): void{

		let fitItemOnCard: Array<Array<Object>> = [];

		let blinkGridOnCard: Array<Array<number>> = [];
		let blinkGridOnPaytable: Object = {};
		let hasBingo: boolean;

		CardManager.clearCardsEffect();
		PayTableManager.clearPaytablesStatus();
		for( let i: number = 0; i < resultList.length; i++ ){
			fitItemOnCard[i] = [];
			blinkGridOnCard[i] = [];
			for( let ob in PayTableManager.payTablesDictionary ){
				let result: PaytableCheckResult = resultList[i][ob];
				if( result.fit || result.fits ){
					fitItemOnCard[i].push( { paytalbe:ob,fit:result.fit, fits: result.fits} );
				}

				if( result.unfitIndex >= 0 ){
					blinkGridOnCard[i].push( result.unfitIndex );
					if( !blinkGridOnPaytable[ob] )blinkGridOnPaytable[ob] = [];
					blinkGridOnPaytable[ob].push( result.unfitIndex );
				}
				else if( result.unfitIndexs ){
					for( let unfitItem in result.unfitIndexs ){
						blinkGridOnCard[i].push( result.unfitIndexs[unfitItem] );
						if( !blinkGridOnPaytable[ob] )blinkGridOnPaytable[ob] = [];
						blinkGridOnPaytable[ob].push( result.unfitIndexs[unfitItem] );
					}
				}
			}
		}

		if( PaytableFilter.filterObject ){
			for( let i: number = 0; i < fitItemOnCard.length; i++ )PaytableFilter.paytableConfixFilter( fitItemOnCard[i], true );
		}

		for( let i: number = 0; i < fitItemOnCard.length; i++ ){
			for( let j: number = 0; j < fitItemOnCard[i].length; j++ ){
				let paytableObject: Object = fitItemOnCard[i][j];
				let paytableName: string = paytableObject["paytalbe"];
				PayTableManager.payTablesDictionary[paytableName].ui.showFit();
				if( fitItemOnCard[i][j] == "bingo" )hasBingo = true;
				CardManager.showPaytableResult(i, paytableName, paytableObject["fit"], paytableObject["fits"] );
			}
		}

		if (this.ballArea.needLightCheck) CardManager.stopAllBlink();
		CardManager.letCardBlink( blinkGridOnCard );

		for( let ptObj in blinkGridOnPaytable )PayTableManager.payTablesDictionary[ptObj].showBlinkAt( blinkGridOnPaytable[ptObj] );

		if( this.needSmallWinTimesOnCard )this.showSmallWinTimes( resultList );
	}

	protected winBingo(): void {
		this.stopAutoPlay();
		if( this.jackpotArea.jackpotBonus ){
			let ev: egret.Event = new egret.Event( "JACKPOT_WIN" );
			ev.data = { bonus: this.jackpotArea.jackpotNumber };
			this.dispatchEvent( ev );
			this.jackpotArea.jackpotBonus = false;
			this.jackpotArea.jackpotNumber = 0;
		}
		else this.dispatchEvent(new egret.Event("winbingo", false, false, { coins: this.ganho }));
	}

	protected showSmallWinTimes( resultList: Array<Object> ): void{
		for( let i: number = 0; i < resultList.length; i++ ){
			let blinkGrids: Object = {};
			for( let ob in PayTableManager.payTablesDictionary ){
				let result: PaytableCheckResult = resultList[i][ob];

				if( result.unfitIndex >= 0 ){
					if( !blinkGrids[result.unfitIndex] )blinkGrids[result.unfitIndex] = [];
					blinkGrids[result.unfitIndex].push( ob );
				}
				else if( result.unfitIndexs ){
					for( let unfitItem in result.unfitIndexs ){
						if( !blinkGrids[result.unfitIndexs[unfitItem]] )blinkGrids[result.unfitIndexs[unfitItem]] = [];
						blinkGrids[result.unfitIndexs[unfitItem]].push( ob );
					}
				}
			}

			this.showSmallWinResult( i, blinkGrids );
		}
	}

	protected showSmallWinResult( cardIndex: number, blinkGrids: Object ): void{
		for( let index in blinkGrids ){
			let winTimes: number = 0;
			for( let j: number = 0; j < blinkGrids[index].length; j++ ){
				let winTimesTxt: string = PayTableManager.payTablesDictionary[blinkGrids[index][j]].ui["tx"].text;
				winTimes += parseFloat( winTimesTxt.replace( /\D/, "" ) );
			}
			CardManager.setSmallWinTime( cardIndex, parseInt( index ), winTimes );
		}
	}

	/**
	 * quick play
	 */
	public quickPlay(): void {
		this.gameToolBar.quickPlay();
	}

	/**
	 * stop quick play
	 */
	public stopQuickPlay(): void {
	}

	/**
	 * collect credito
	 */
	public collectCredit(): void {
		this.gameToolBar.collect();
	}
	
	protected firstHaveExtraBall: boolean;
	protected lastLightResult: Array<Object>;

	protected runningWinAnimation(callback: Function, lightResult: Array<Object>, isLastBall: boolean): void{
		let paytableName = "";
		let multiple = 0;
		for( let i = 0; i < lightResult.length; i++ ){
			for (let ob in lightResult[i]) {
				if (!this.lastLightResult[i] || !this.lastLightResult[i][ob] || this.lastLightResult[i][ob].length < lightResult[i][ob].length) {
					if (multiple < PayTableManager.payTablesDictionary[ob].multiple) {
						multiple = PayTableManager.payTablesDictionary[ob].multiple;
						paytableName = PayTableManager.payTablesDictionary[ob].payTableName;
						if ( paytableName == PayTableManager.bingoPaytableName ) this.dispatchEvent(new egret.Event("bingo"));
					}
				}
			}
		}

        this.lastLightResult = lightResult;
        if(paytableName !== "") {
            if (!isLastBall) {
                this.getResultListToCheck( true );
                this.getPaytablesFit(paytableName, callback);
            } else {
                this.getPaytablesFit(paytableName);
                callback();
            }
        } else callback();
	}

	protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = this.getSoundName( paytabledName );
        if (soundName !== "") {
            this.waitingForEffect = true;
            if( SoundManager.soundEfOn ){
                this.playSound(soundName, 1, this.waitForEffect.bind(this, callback));
            }
            else{
                setTimeout( this.waitForEffect.bind(this, callback), 1500 );
            }
        } else {
            if( callback )callback();
        }
	}

	protected onBetChanged( event: egret.Event ): void{
        // override
	}

	protected hasExtraBallFit(): void {
		// override
	}

	protected getExtraBallFit(): void {
		// override
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
		// override
	}

	protected roundOver(): void {
		BingoMachine.inRound = false;
    }

	protected startPlay(): void {
		this.stopAllSound();
		CardManager.stopAllBlink();
		if( this.superExtraBg && this.superExtraBg.visible ) this.superExtraBg.visible = false;
		this.gameToolBar.megeExtraOnTop( false );
		if( this.ganhoCounter ) this.ganhoCounter.clearGanhoData();
	}

	protected showLastBall( ballIndex: number ): void{
		this.currentBallIndex++;
		if( this.ballCountText ) this.ballCountText.text = "" + this.currentBallIndex;
	}

	protected paytableRuleFilter( blinkGrids ): void{
		
	}

	protected showMiniGame(): void{

	}

	protected showWinAnimationAt(cardId: number, win: number): void{
		// override
	}

	protected dropCoinsAt( ptX: number, ptY: number, coinsLevel: number = 1 ){
		Com.addObjectAt(this, new DropCoins( coinsLevel ), ptX - 100, ptY - 100 );
	}

    protected showNoBetAndCredit(){
        this.creditText = new TextLabel;
        this.betText = new TextLabel;
    }

/******************************************************************************************/

	protected jackpotArea: JackpotLayer;

	protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
		// override
	}

	public refreshGameCoins( coins: number ): void{
		this.gameCoins = Math.round( coins );
	}

	public refreshGameDinero( dinero: number ): void{
		this.dinero = dinero;
	}

	public static get jackpotMin(): number{
		if( this.currentGame && this.currentGame.jackpotArea ) return this.currentGame.jackpotArea.jackpotMinBet;
		else return 0;
	}

/***********************************************************************************************************************************/

	protected superExtraBg: egret.Bitmap;
	protected isMegaBall: boolean;

	protected buildSuperEbArea( superEbBgName: string, superEbAreaX: number, superEbAreaY: number ): void{
		this.superExtraBg = Com.addBitmapAt( this, this.assetStr( superEbBgName ), superEbAreaX, superEbAreaY );
		this.superExtraBg.visible = false;
		this.setChildIndex( this.superExtraBg, this.getChildIndex( this.ballArea ) );
	}

	protected tryFirstMega( rect: egret.Rectangle ){
		if( !this.megaName ) return;
		if( localStorage.getItem( this.megaName ) ) return;
		else{
			localStorage.setItem( this.megaName, "true" );
			this.stopAutoPlay();
			let ev: egret.Event = new egret.Event( "megaFirst" );
			ev.data = rect;
			this.dispatchEvent( ev );
		}
	}

	public stopAutoPlay(){
		if( this.gameToolBar.autoPlaying ) this.gameToolBar.autoPlaying = false;
		else if( this.gameToolBar.buyAllExtra ) this.gameToolBar.buyAllExtra = false;
	}

/**************************************************************************************************************/

	protected tounamentBar: TounamentLayer;

	public onTounamentData( cmd: string, data: any ){
		let tmData: Object = TounamentDataFormat.parse( cmd, data );

		if( cmd == "trm.start" ) {
			if( this.tounamentBar ) return;
			let initData: ITounamentInitData = tmData as ITounamentInitData;
			if( initData.isGold )this.tounamentBar = new GoldTounamentLayer( initData );
			else this.tounamentBar = new TounamentLayer( initData );
			Com.addObjectAt( this, this.tounamentBar, -235, 117 );
			TweenerTool.tweenTo( this.tounamentBar, {x: 0}, 600, 1000 );
		}
		else if( cmd == "trm.update" ){
			let updateData: ITounamentData = tmData as ITounamentData;
			if( this.tounamentBar ) this.tounamentBar.updata( updateData );
		}
		else if( cmd == "trm.end" ){
			
		}
		else{
			trace( cmd );
			egret.error( "tounament command error!" );
		}
	}

	protected onLevelUpBonus( event: egret.Event ){
		let bonus: number = event.data;
		if( !isNaN(bonus) ){
			this.gameCoins += bonus;
			this.gameToolBar.updateCoinsAndDinero( this.gameCoins, this.dinero );
		}
	}

/**************************************************************************************************************/

	protected updateNewDatas( data: Object ){
		this.gameToolBar.updateMissionData( data["missionValue"], data["missionTarget"], data["missionId"] );
	}
}
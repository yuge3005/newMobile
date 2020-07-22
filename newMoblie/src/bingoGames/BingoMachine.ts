class BingoMachine extends GameUIItem{

	public static GENERIC_MODAL_LOADED: string = "gameLoaded";

	protected assetName: string;
	protected static assetLoaded: Object = {};
	public inited: boolean = false;
	private configUrl: string;
	private gameConfigFile: string;
	protected ptFilterConfig: string;
	protected _mcf: egret.MovieClipDataFactory;

	protected ballArea: BallManager;
	protected cardArea: egret.DisplayObjectContainer;
	protected payTableArea: egret.DisplayObjectContainer;
	protected gameToolBar: GameToolBar;

	protected betText: egret.TextField;
	protected creditText: egret.TextField;
	protected dinero: number;
	protected _gameCoins: number;
	protected get gameCoins(): number{
		return this._gameCoins;
	}
	protected set gameCoins( value: number ){
		this._gameCoins = value;
		if( this.creditText ) this.creditText.text = Utils.formatCoinsNumber( value );
	}

	protected connetKeys: Object;
	protected tokenObject: Object;
	protected cardPositions: Array<Object>;

	private static currentGame: BingoMachine;

	public static soundManager: GameSoundManager;
	protected soundManager: GameSoundManager;

	protected get cardNumbers(): number{
		return this.cardPositions.length;
	}

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
	protected tipStatusText: egret.TextField;
	protected tipStatusTextPosition: egret.Rectangle;
	protected tipStatusTextColor: number;
	protected prizeText: egret.TextField;

	public connectReady: boolean = false;
	public assetReady: boolean = false;

	protected ganhoCounter: GanhoCounter;

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super();

		this.connetKeys = { zona: "Zona" + gameId, sala: "Sala" + gameId };
		this.tokenObject = {};
		this.tokenObject["value"] = { tipo:"jogar", version: GlobelSettings.serverVertion };

		BingoDefaultSetting.defaultSetting();

		this.gameConfigFile = gameConfigFile;
		this.configUrl = configUrl;
		this.ballArea = new BallManager;

		this.assetName = egret.getDefinitionByName( egret.getQualifiedClassName(this) ).classAssetName;

		BingoMachine.currentGame = this;
		if (!BingoMachine.soundManager) BingoMachine.soundManager = new GameSoundManager();
		this.soundManager = BingoMachine.soundManager;

		if( BingoMachine.assetLoaded[this.assetName] )this.assetReady = true;
		else RES.getResByUrl( this.configUrl, this.analyse, this );

		this.loginToServer();
	}

	private onConfigLoadComplete():void{
		var obj: Object = RES.getRes( this.gameConfigFile.replace( ".", "_" ) );
		BingoBackGroundSetting.getBackgroundData( obj["backgroundColor"], obj["backgroundItems"], this.assetName );

		this.ballArea.getBallSettings( obj["balls"], obj["ballSize"], obj["ballTextSize"] );
		
		this.extraUIName = obj["extraUIName"];

		PayTableManager.getPayTableData( obj["payTables"] );
		this.cardPositions = obj["card"].cardPositions;
		CardManager.getCardData( obj["card"], this.cardNumbers );

		CardManager.startBlinkTimer();
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);

		GameCard.fitEffectNameList = this.getFitEffectNameList();
		PaytableFilter.filterObject = this.getPaytableFilterObject();
	}

	protected getPaytableFilterObject(): Object{
		return RES.getRes( this.ptFilterConfig );
	}

	protected onRemove( event: egret.Event ): void{
		CardManager.stopBlinkTimer();
		IBingoServer.jackpotCallbak = null;
		IBingoServer.jackpotWinCallbak = null;
		this.ballArea.onRemove();
		this.removedFromStage();
	}

	private analyse( result: string ){
		// RES.parseConfig( result, this.configUrl.replace( "default.res.json", "" ) );
		this.loadAsset( this.assetName );
	}
	
	private loadAsset( assetName: string ){
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loaded, this );
		RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.loadSoundsProgress, this);
		RES.loadGroup( assetName );
	}
	
	private loaded( event: RES.ResourceEvent ){
		if( event.groupName != this.assetName )return;
		BingoMachine.assetLoaded[this.assetName] = true;
		RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.loadSoundsProgress, this);
		RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loaded, this );

		this.assetReady = true;
		this.testReady();
	}

	private _assetLoaded: number = 0;
	public get assetLoaded(): number{
		let loadedPart: number = 0;
		if( this.assetReady )loadedPart += 0.9;
		else loadedPart += this._assetLoaded * 0.9;
		if( this.connectReady ) loadedPart += 0.1;
		return loadedPart;
	}

	/**
	 * init sounds
	 */
	private loadSoundsProgress(event: RES.ResourceEvent): void {
		if( event.groupName != this.assetName )return;
		this._assetLoaded = event.itemsLoaded / event.itemsTotal;
		let resName = event.resItem.name;
		if (resName.match(/mp3$/) || resName.match(/wav$/)) {
			this.soundManager.pushSound(resName);
		}
	}
	protected init(){
		this.inited = true;
		this.dispatchEvent( new egret.Event( BingoMachine.GENERIC_MODAL_LOADED ) );

		this.scaleX = BingoBackGroundSetting.gameScale.x;
		this.scaleY = BingoBackGroundSetting.gameScale.y;
		this.mask = BingoBackGroundSetting.gameMask;

		this._mcf = BingoBackGroundSetting.initBackground( this );

		PayTableManager.getPayTableUI();

		this.addChild( this.ballArea );

		this.addPayTables();

		this.sendInitDataRequest();

		this.cardArea = new egret.DisplayObjectContainer;
		this.addChild(this.cardArea);

		if( this.extraUIName ){
			this.extraUIObject = this.getChildByName( this.assetStr( this.extraUIName ) );
			if( this.extraUIObject )this.extraUIObject.visible = false;
		}

		this.addEventListener("bingo", this.winBingo, this);
		this.addEventListener( "betChanged", this.onBetChanged, this );
		this.tellTounamentCurrentBet();
	}

	protected getFitEffectNameList(): Object{
		return null;
	}

	protected addPayTables(){
		this.payTableArea = new egret.DisplayObjectContainer;
		this.addChild( this.payTableArea );
		let pts: Object = PayTableManager.payTablesDictionary;
		for( let ob in pts ){
			this.payTableArea.addChild( pts[ob].UI );
		}

		for( let payTable in PayTableManager.payTablesDictionary ){
			let pos: Object = PayTableManager.payTablesDictionary[payTable].position;
			pts[payTable].UI.x = pos["x"];
			pts[payTable].UI.y = pos["y"];
		}
	}

    private loginToServer(){
		if( IBingoServer.connected ){
			IBingoServer.loginTo( this.connetKeys["zona"], this.connetKeys["sala"], this.onJoinRoomCallback.bind(this) );
		}
        else setTimeout( this.loginToServer.bind(this), 200 );
    }

	private onJoinRoomCallback() {
		this.connectReady = true;
		this.testReady();
    }

	private testReady(){
		if( this.connectReady && this.assetReady ){
			this.onConfigLoadComplete();
			this.init();
		}
	}
    
	protected sendInitDataRequest(): void {
		IBingoServer.gameInitCallback = this.onServerData.bind( this );
		IBingoServer.sendMessage( this.tokenObject["key"], this.tokenObject["value"] );
	}

	protected onServerData( data: Object ){
		IBingoServer.gameInitCallback = null;

		this.setCardDatasWithNumeros( data["numerosCartelas"] );
		CardManager.groupNumber = data["cartela"];

		this.updateCredit( data );

		if( !this.gameToolBar )this.gameToolBar = new GameToolBar;
		Com.addObjectAt( this, this.gameToolBar, 0, GameToolBar.toolBarY );
		this.gameToolBar.scaleX = 1 / BingoBackGroundSetting.gameScale.x;
		this.gameToolBar.scaleY = 1 / BingoBackGroundSetting.gameScale.y;
		this.gameToolBar.showTip( "" );

		this.resetGameToolBarStatus();

		this.dispatchEvent( new egret.Event( "connected_to_server" ) );

		this.setLetras( data["letras"] );
		if( data["save"] != null )this.setSave( parseInt( data["save"] ) );

		this.showJackpot( data["acumulado"], data["jackpot_min_bet"], data["betConfig"] );
		IBingoServer.jackpotCallbak = this.jackpotArea.setJackpotNumber.bind(this.jackpotArea);
		IBingoServer.jackpotWinCallbak = this.jackpotArea.jackpotWinCallback.bind( this.jackpotArea );

		if( this.needListenToolbarStatus )this.listenToGameToolbarStatus();
	}

	protected listenToGameToolbarStatus(): void{
		let gameToolbar: GameToolBar = this["gameToolBar"];
		gameToolbar.addEventListener( "winChange", this.winChange, this );
		gameToolbar.addEventListener( "tipStatus", this.tipStatus, this );

		if( this.tipStatusTextPosition ){
			let rect: egret.Rectangle = this.tipStatusTextPosition;
			this.tipStatusText = this.addGameText( rect.x, rect.y, rect.height, this.tipStatusTextColor, "bet", false, rect.width );
			this.tipStatusText.textAlign = "center";
			this.tipStatusText.text = GameToolBar.languageText["press play"][GlobelSettings.language];
		}
	}

	protected tipStatus( e: egret.Event, textDoubleLine: boolean = false ): void{
        switch( e["status"] ){
			case GameCommands.play:
                this.tipStatusText.text = GameToolBar.languageText["good luck"][GlobelSettings.language];
			    break;
			case GameCommands.extra:
				let extraStr: string = GameToolBar.languageText["extra ball"][GlobelSettings.language];
				extraStr += textDoubleLine ? "\r\n" : ": ";
                if( e["extraPrice"] ) extraStr += Utils.formatCoinsNumber( e["extraPrice"] ) + ( textDoubleLine ? "" : " " + GameToolBar.languageText["credits"][GlobelSettings.language] );
				else extraStr += GameToolBar.languageText["free"][GlobelSettings.language];
				this.tipStatusText.text = extraStr;
                this.lockWinTip = true;
                setTimeout( () => { this.lockWinTip = false }, 10 );
			    break;
			default:
				this.tipStatusText.text = GameToolBar.languageText["press play"][GlobelSettings.language];
			    break;
		}
    }

    private lockWinTip: boolean = false;

    protected winChange( e: egret.Event, textDoubleLine: boolean = false ): void{
        if( e["winCoins"] && !this.lockWinTip )this.tipStatusText.text = GameToolBar.languageText["win"][GlobelSettings.language] + ( textDoubleLine ? "\r\n" : ": " ) + e["winCoins"];
    }

	private setCardDatasWithNumeros(numeros: Array<number>){
		let cards: Array<GameCard> = CardManager.cards;
		let numbersOnCards: number = numeros.length / cards.length;

		for( let i: number = 0; i < cards.length; i++ ){
			cards[i].x = this.cardPositions[i]["x"];
			cards[i].y = this.cardPositions[i]["y"];
			this.cardArea.addChild( cards[i] );
			cards[i].getNumbers( numeros.slice( i * numbersOnCards, ( i+1 ) * numbersOnCards ) );
		}

		this.changeCardsBg();
	}

	protected resetGameToolBarStatus(){
		this.gameToolBar.setBet( GameData.currentBet, CardManager.enabledCards, GameData.currentBet == GameData.maxBet, CardManager.enabledCards == CardManager.cards.length );
		this.betText.text = Utils.formatCoinsNumber( CardManager.setCardBet( GameData.currentBet ) );
	}

	public static runningBall( ballIndex: number ): void{
		this.currentGame.showLastBall( ballIndex );
	}

	public static betweenBallRunning(): Array<Object>{
		return this.currentGame.lightCheck();
	}

	public static runningAnimation( callback: Function, lightResult: Array<Object> ): void{
		this.currentGame.runningWinAnimation( callback, lightResult );
	}

	public static endBallRunning(){
		let breakChecked: boolean = this.currentGame.getResultListToCheck();
		if( breakChecked ) return;

		if (this.currentGame.btExtra) {
			this.currentGame.hasExtraBallFit();
			this.currentGame.gameToolBar.showStop( false );
			this.currentGame.gameToolBar.unlockAllButtons();
			this.currentGame.gameToolBar.showExtra( true, this.currentGame.valorextra );
			this.currentGame.gameToolBar.showWinResult( this.currentGame.ganho );

			if( this.currentGame.gameToolBar.autoPlaying ){
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
				// trace( result.toString() );
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

	protected gameUnderLine(){
		let redLine: egret.Shape = new egret.Shape;
		GraphicTool.drawRect( redLine, new egret.Rectangle( 0, 0, 800, 3 ), 0xFF0000 );
		redLine.y = 600;
		this.addChild( redLine );
	}

	protected setLetras( letrasData: string ): void{
		//only for pachinko
	}

	protected setSave( saveNumber: number ): void{
		
	}

	protected playSound(soundName: string, repeat: number = 1, callback: Function = null, thisObject: Object = null): void {
		this.soundManager.play(soundName, repeat, callback, thisObject);
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
			if( this.currentGame instanceof V1Game ){
				CardManager.groupNumber += 1;
				if( CardManager.groupNumber > 100 )CardManager.groupNumber = 1;
				this.currentGame.setCardDatasWithNumeros( this.currentGame["getCardsGroup"]( CardManager.groupNumber ) );
				return;
			}
			else if( this.currentGame instanceof SuperLotto ){
				( this.currentGame as SuperLotto ).changeRamdonNumbers();
				return;
			}
			this.currentGame.gameToolBar.lockAllButtons();
			IBingoServer.changeNumberCallback = this.currentGame.onChangeNumber.bind( this.currentGame );
			IBingoServer.changeNumber();
		}
		else if (cmd == GameCommands.play) {
			if( Number( this.currentGame.gameCoins ) < GameData.currentBet * CardManager.enabledCards ){
				if( this.currentGame.gameToolBar.autoPlaying ){
					this.currentGame.gameToolBar.autoPlaying = false;
					this.currentGame.gameToolBar.unlockAllButtonsAfterOOC();
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
			this.currentGame.ballArea.clearBalls();
			this.currentGame.showExtraUI( false );
			this.currentGame.dispatchEvent( new egret.Event( "onGamePlay" ) );
		}
		else if( cmd == GameCommands.stop ){
			this.currentGame.gameToolBar.enabledStopButton();
			this.currentGame.ballArea.stopBallRunning();
		}
		else if( cmd == GameCommands.onTurbo ){
			BallManager.turbo = true;
			this.currentGame.gameToolBar.showTurboButton( false );
		}
		else if( cmd == GameCommands.offTurbo ){
			BallManager.turbo = false;
			this.currentGame.gameToolBar.showTurboButton( true );
		}
		else if (cmd == GameCommands.collect) {
			this.currentGame.collectExtraBall();
			this.currentGame.sendCancelExtraReuqest();
			this.currentGame.gameToolBar.lockAllButtons();
			// this.currentGame.showExtraUI( false );
			
			// CardManager.clearCardsStatus();
			// PayTableManager.clearPaytablesStatus();
			this.currentGame.gameToolBar.showTip( "" );
			// this.currentGame.ballArea.clearBalls();
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
		}
		else{//the rest commands are relatied to bet and card enabled
			if( cmd == GameCommands.closeCard ){
				CardManager.cards[CardManager.enabledCards - 1].enabled = false;
			}
			else if( cmd == GameCommands.openCard ){
				CardManager.cards[CardManager.enabledCards].enabled = true;
			}
			else if( cmd == GameCommands.decreseBet ){
				GameData.betDown();
				this.currentGame.betChanged( -1 );
			}
			else if( cmd == GameCommands.increaseBet ){
				GameData.betUp();
				this.currentGame.betChanged( 1 );
			}
			else if( cmd == GameCommands.maxBet ){
				CardManager.enabledAllCards();
				GameData.setBetToMax();
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

		this.setCardDatasWithNumeros( data["numerosCartelas"] );
		CardManager.groupNumber = data["cartela"];
		this.gameToolBar.unlockAllButtons();
		this.changeCardsBg();
	}

	public onPlay( data: Object, hotData: any = null ){
		IBingoServer.playCallback = null;
		this.firstHaveExtraBall = true;
		this.lastLightResult = [];
		this.isMegaBall = false;

		if (!data) {//out of coins
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
		this.dispatchEvent(new egret.Event("updateCoinsAndXp", false, true, data));
	}

	public onRoundOver( data: Object ){
		IBingoServer.roundOverCallback = null;
		
		this.roundOver();

		this.gameToolBar.showStop( false );
		this.gameToolBar.unlockAllButtons();
		if( data["ganho"] != "unexpress" )this.gameToolBar.showWinResult( data["ganho"] );
		else this.gameToolBar.showWinResult( this.ganho );

		this.updateCredit( data );

		if( !this.gameToolBar.autoPlaying )this.resetGameToolBarStatus();
		if (this.gameToolBar.autoPlaying) this.gameToolBar.autoPlaying = true;
	}


	public onCancelExtra( data: Object ){
		IBingoServer.cancelExtraCallback = null;
		this.gameToolBar.unlockAllButtons();
		this.gameToolBar.showExtra(false);
		
		this.roundOver();

		this.updateCredit( data );

		this.resetGameToolBarStatus();

		this.showMissExtraBall( data["extrasnaocompradas"] );
	}

	public onExtra( data: Object ){
		IBingoServer.extraCallback = null;

		data["btextra"] = data["btextra"] || data["isMegaBall"];
		this.isMegaBall = data["isMegaBall"];

		if (!data) {//out of coins
			let needChangeCollectBtnStatus: boolean = this.gameToolBar.autoPlaying;
			this.gameToolBar.autoPlaying = false;
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
		this.runningBallUI = this.ballArea.getABall( ballIndex );
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

	protected runningWinAnimation(callback: Function, lightResult: Array<Object>): void{
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
        if (SoundManager.soundOn && paytableName !== "") {
            if (this.ballArea.needLightCheck) {
                this.getResultListToCheck( true );
                this.getPaytablesFit(paytableName, callback);
            } else {
                this.getPaytablesFit(paytableName);
                callback();
            }
        } else callback();
	}

	protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		//sub class override
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
		// CardManager.stopAllBlink();
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
}
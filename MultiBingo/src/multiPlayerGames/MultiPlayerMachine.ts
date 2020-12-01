class MultiPlayerMachine extends egret.Sprite{

	public static GENERIC_MODAL_LOADED: string = "gameLoaded";

	public preLoader: RES.PromiseTaskReporter;

	protected assetName: string;
	protected static assetLoaded: Object = {};
	public inited: boolean = false;
	private configUrl: string;
	protected gameConfigFile: string;
	protected _mcf: egret.MovieClipDataFactory;
	protected languageObjectName: string;

	protected ballArea: MultiGameBallLayer;
	protected cardArea: MultiCardLayer;

	protected dinero: number;
	protected _gameCoins: number;
	protected get gameCoins(): number{
		return this._gameCoins;
	}
	protected set gameCoins( value: number ){
		this._gameCoins = value;
	}

	protected connetKeys: Object;

	protected static currentGame: MultiPlayerMachine;

	protected assetStr( str: string ): string{
		return this.assetName + "_json." + str;
	}

	public static getAssetStr( str: string ): string{
		return this.currentGame.assetStr( str );
	}

	protected currentBallIndex: number;
	protected ballCountText: egret.TextField;

	public connectReady: boolean = false;
	public assetReady: boolean = false;

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super();

		this.gameConfigFile = gameConfigFile;
		this.configUrl = configUrl;
		this.ballArea = new MultiGameBallLayer;
		this.cardArea = new MultiCardLayer;

		this.assetName = egret.getDefinitionByName( egret.getQualifiedClassName(this) ).classAssetName;

		MultiPlayerMachine.currentGame = this;

		RES.getResByUrl( configUrl, this.analyse, this );

		this.loginToServer();
	}

	protected onConfigLoadComplete():void{
		var obj: Object = RES.getRes( this.gameConfigFile.replace( ".", "_" ) );
		BingoBackGroundSetting.getBackgroundData( obj["backgroundColor"], obj["backgroundItems"], this.assetName );

		this.ballArea.getBallSettings( obj["balls"], obj["ballSize"], obj["ballTextSize"] );

		MultiPayTable.getPayTableData( obj["payTables"] );
		this.cardArea.getCardData( obj["card"] );

		this.cardArea.startBlinkTimer();
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
		
		MuLang.txt = this.getLanguageObject();
	}

	protected getLanguageObject(): Object{
		return RES.getRes( this.languageObjectName );
	}

	protected onRemove( event: egret.Event ): void{
		this.cardArea.stopBlinkTimer();
		this.ballArea.onRemove();
		this.removeCallbacks();
	}

	private analyse( result: string ){
		this.loadAsset( this.assetName );
	}
	
	private loadAsset( assetName: string ){
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loaded, this );
		RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.loadSoundsProgress, this);
		RES.loadGroup( assetName, 0, this.preLoader );
	}
	
	private loaded( event: RES.ResourceEvent ){
		if( event.groupName != this.assetName )return;
		MultiPlayerMachine.assetLoaded[this.assetName] = true;
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
	}

	protected init(){
		this.inited = true;
		this.dispatchEvent( new egret.Event( MultiPlayerMachine.GENERIC_MODAL_LOADED ) );

		this.mask = BingoBackGroundSetting.gameMask;

		this._mcf = BingoBackGroundSetting.initBackground( this );

		this.addChild( this.ballArea );
		this.addChild( this.cardArea );
	}

    private loginToServer(){
		if( MultiServer.connected && this.connetKeys ){
			this.addCallbacks();
			MultiServer.loginTo( this.connetKeys["zona"], this.connetKeys["sala"], this.onJoinRoomCallback.bind(this) );
		}
        else setTimeout( this.loginToServer.bind(this), 200 );
    }

	protected onJoinRoomCallback() {
		this.connectReady = true;
		this.testReady();
    }

	private testReady(){
		if( this.connectReady && this.assetReady ){
			this.onConfigLoadComplete();
			this.init();
		}
	}

	protected setCardDatasWithNumeros(numeros: Array<number>){
		let cards: Array<MultiPlayerCard> = this.cardArea.cards;
		let numbersOnCards: number = numeros.length / cards.length;

		for( let i: number = 0; i < cards.length; i++ ){
			this.cardArea.addChild( cards[i] );
			cards[i].getNumbers( numeros.slice( i * numbersOnCards, ( i+1 ) * numbersOnCards ) );
		}
	}

	public static runningBall( ballIndex: number ): void{
		this.currentGame.showLastBall( ballIndex );
	}

	public static endBallRunning(){
		this.currentGame.getResultListToCheck();
	}

	protected getResultListToCheck(){
		let checkingString: Array<string> = this.cardArea.getCheckingStrings();
		let payTablesDictionary: Object = MultiPayTable.payTablesDictionary;
		let resultList: Array<Object> = [];
		for( let i: number = 0; i < checkingString.length; i++ ){
			resultList[i] = {};
			for( let ob in payTablesDictionary ){
				let result: PaytableCheckResult = payTablesDictionary[ob].check( checkingString[i] );
				resultList[i][ob] = result;
			}
		}
		this.afterCheck( resultList );
	}

/******************************************************************************************/

	protected updateCredit( data: Object ): void{
		this.gameCoins = Math.round( data["credito"] );
		if( !isNaN( data["secondCurrency"] ) )this.dinero = data["secondCurrency"];
		this.dispatchEvent(new egret.Event("updateCoinsAndXp", false, true, data));
	}

	protected afterCheck( resultList: Array<Object> ): void{

		let fitItemOnCard: Array<Array<Object>> = [];
		let blinkGridOnCard: Array<Array<number>> = [];

		this.cardArea.clearCardsEffect();
		for( let i: number = 0; i < resultList.length; i++ ){
			fitItemOnCard[i] = [];
			blinkGridOnCard[i] = [];
			for( let ob in MultiPayTable.payTablesDictionary ){
				let result: PaytableCheckResult = resultList[i][ob];
				if( result.fit || result.fits ){
					fitItemOnCard[i].push( { paytalbe:ob,fit:result.fit, fits: result.fits} );
				}

				if( result.unfitIndex >= 0 ){
					blinkGridOnCard[i].push( result.unfitIndex );
				}
				else if( result.unfitIndexs ){
					for( let unfitItem in result.unfitIndexs ){
						blinkGridOnCard[i].push( result.unfitIndexs[unfitItem] );
					}
				}
			}
		}

		for( let i: number = 0; i < fitItemOnCard.length; i++ ){
			for( let j: number = 0; j < fitItemOnCard[i].length; j++ ){
				let paytableObject: Object = fitItemOnCard[i][j];
				let paytableName: string = paytableObject["paytalbe"];
				this.cardArea.showPaytableResult(i, paytableName, paytableObject["fit"], paytableObject["fits"] );
			}
		}

		this.cardArea.letCardBlink( blinkGridOnCard );
	}

	protected startPlay(): void {

	}

	protected showLastBall( ballIndex: number ): void{
		this.currentBallIndex++;
		if( this.ballCountText ) this.ballCountText.text = "" + this.currentBallIndex;
	}

/******************************************************************************************/
	public refreshGameCoins( coins: number ): void{
		this.gameCoins = Math.round( coins );
	}

	public refreshGameDinero( dinero: number ): void{
		this.dinero = dinero;
	}

/*************************************************************************************************************************************/

	protected getRoomVariables( varName: string, varValue: any ){
		//sub class override
	}

	protected onSelectNumber( data: Object ){
		//sub class override
	}

	protected triggerpowerUp( data: Object ){
		//sub class override
	}

	protected callBingo( data: Object ){
		//sub class override
	}

	protected existCard( data: Object ){
		//sub class override
	}

	protected otherJoinRoom( userName: string, fbId: string, userId: string ){
		//sub class override
	}
	
	protected getMessage( userName: string, message: string, fbId: string ){
		//sub class override
	}

	protected cardsAndPlayersUpdate( data: Object ){
		//sub class override
	}

	protected removeCallbacks(){
		MultiServer.coinsChangeCallback = null;
		MultiServer.selectNumberCallback = null;
		MultiServer.multiPlayerCallback = null;
		MultiServer.triggerpowerUpCallback = null;
		MultiServer.callBingoCallback = null;
		MultiServer.existCardCallback = null;
		MultiServer.otherJoinRoomCallback = null;
		MultiServer.roomMessageCallback = null;
		MultiServer.cardsAndPlayersCallback = null;
		MultiServer.buyCardCallback = null;
	}

	protected addCallbacks(){
		MultiServer.coinsChangeCallback = this.updateCredit.bind( this );
		MultiServer.selectNumberCallback = this.onSelectNumber.bind( this );
		MultiServer.multiPlayerCallback = this.getRoomVariables.bind( this );
		MultiServer.triggerpowerUpCallback = this.triggerpowerUp.bind( this );
		MultiServer.callBingoCallback = this.callBingo.bind( this );
		MultiServer.existCardCallback = this.existCard.bind( this );
		MultiServer.otherJoinRoomCallback = this.otherJoinRoom.bind( this );
		MultiServer.roomMessageCallback = this.getMessage.bind(this);
		MultiServer.cardsAndPlayersCallback = this.cardsAndPlayersUpdate.bind(this);
	}

	protected showHelp( event: egret.TouchEvent ){
		this.dispatchEvent( new egret.Event( "showHelp" ) );
	}

	protected onTimePlan( isLocked: boolean ){
		this.currentBallIndex = 0;
		if( this.chatBar ) this.chatBar.roundStart();
		if( this.waitingForStart && isLocked === false ){
			this.startPlay();
		}
	}

/******************************************************************************************************************************/

	protected dailogLayer: egret.DisplayObjectContainer;
	protected chatAndMiniGameLayer: egret.DisplayObjectContainer;

	protected waitingForStart: boolean;
	protected waitingBar: WaitingBar;
	protected roundEndBar: RoundEndBar;
	protected bingoInfo: MultyBingoInfoBar;
	protected chatBar: MultiChatBar;
	protected allPaytables: Object;
	protected miniGame: egret.DisplayObjectContainer;

	protected enterGameState: string;

	public static cardPrice: number;
	public static cardPrize: number;

	public static oneCardPrize: number;

	protected currentPaytableRules: Array<string>;

	protected letsWait(): void{
		//sub class override
	}

	protected buildWaitingBar(): void{
		//sub class override
	}

	protected onBuyCard( event: egret.Event ){
		//sub class override
	}

	protected buyCardCallback( data: Array<Object> ){
		//sub class override
	}

	protected recordPaytalbes(){
		this.allPaytables = MultiPayTable.payTablesDictionary;
	}

	protected getRoundPattens( varValue: Array<Object> ){
		MultiPayTable.payTablesDictionary = {};
		this.currentPaytableRules = [];
		for( let i: number = 0; i < varValue.length; i++ ){
			let patternName: string = varValue[i]["patternName"];
			if( this.allPaytables[patternName] == null ){
				console.error( "error paytable name" );
				continue;
			}
			MultiPayTable.payTablesDictionary[patternName] = this.allPaytables[patternName];
			if( this.allPaytables[patternName].rule ){
				this.currentPaytableRules.push( this.allPaytables[patternName].rule );
			}
			else{
				this.currentPaytableRules = this.currentPaytableRules.concat( this.allPaytables[patternName].rules );
			}
		}

		this.bingoInfo.currentPaytableRules = this.currentPaytableRules;
	}

	protected showGetCoinsOnCard( uuid: string, gridIndex: number, coins: number ){
		let cardIndex: number = this.cardArea.getIndexByUUID( uuid );
		let pos: egret.Point = this.cardArea.positionOnCard( cardIndex, gridIndex );
		MDS.dropCoinsAt( this, pos, coins );
	}
}
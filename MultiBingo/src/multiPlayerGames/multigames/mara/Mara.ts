class Mara extends Multi75Super{

	protected static get classAssetName(){
		return "mara_" + MuLang.language;
	}

    protected static get animationAssetName(){
		return "maraAnimation";
	}

	protected assetStr( str: string ): string{
		return "mara_json." + str;
	}

	public constructor( assetsPath: string ) {
		super( "mara.conf", assetsPath );
		this.languageObjectName = "mara_text_tx";

		this.connetKeys = { zona: "MultiplayerZone", sala: "Multi72" };

		this.ballArea = new MaraBallLayer;
		this.ballArea.mask = new egret.Rectangle( 480, 130, 850, 126 );

		MultiCardLayer.cardType = MaraCard;
		MultiCardLayer.gridType = MaraGrid;

		CardGridUISettings.zeroUIName = "zero_grid";

		CardGridColorAndSizeSettings.defaultNumberSize = 40;

		this.cardClickMode( false );
	}

	protected init(){
		super.init();

		this.ballCountText = MDS.addGameText( this, 1387, 150, 36, 0xda4d28, "ball", false, 90 );
		this.ballCountText.textAlign = "center";
		this.ballCountText.text = "";
		MDS.addGameText( this, 1388, 190, 28, 0xda4d28, "ball", false, 90 ).textAlign = "center";

		this.letsWait();
	}
	
	protected addCallbacks() {
		super.addCallbacks();
		MultiServer.onCardPriceCallback = this.onCardPriceCallback.bind(this);
		MultiServer.onResumeCallback = this.onResumeCallback.bind(this);
		MultiServer.onEnterCallback = this.onEnterCallback.bind(this);
	}

	protected removeCallbacks() {
		super.removeCallbacks();
		MultiServer.onCardPriceCallback = null;
		MultiServer.onResumeCallback = null;
		MultiServer.onEnterCallback = null;
	}

	protected getResultListToCheck(){
		let checkingString: Array<string> = [];
		for( let i: number = 0; i < this.cardArea.cards.length; i++ ){
			checkingString.push( ( this.cardArea.cards[i] as MaraCard ).getCollectedString() );
		}
		let payTablesDictionary: Object = MultiPayTable.payTablesDictionary;
		let resultList: Array<Object> = [];
		for( let i: number = 0; i < checkingString.length; i++ ){
			resultList[i] = {};
			for( let ob in payTablesDictionary ){
				let result: PaytableCheckResult = payTablesDictionary[ob].check( checkingString[i] );
				resultList[i][ob] = result;
			}
		}
		super.afterCheck( resultList );
	}

/************************************************************************************************************************************************/

	private cardDisabledBgs: Array<egret.Bitmap>;
	private chooseBit: egret.Bitmap;

	protected letsWait(): void{
		this.setCardDatasWithNumeros(MDS.fakeArr(100));

		let bg: egret.Bitmap = this.getChildByName( this.assetStr( "bg" ) ) as egret.Bitmap;
		bg.texture = RES.getRes( "mara_bg_png" );

		let cards: Array<MultiPlayerCard> = this.cardArea.cards;
		this.cardDisabledBgs = [];
		for( let i: number = 0; i < cards.length; i++ ){
			cards[i].visible = false;
			cards[i].enabled = false;
			cards[i].addEventListener( "checkMultiBingo", this.checkMultiBingo, this );
			cards[i].addEventListener( "checkSpecialBingo", this.checkSpecialBingo, this );
			cards[i].addEventListener( "clickOnCard", this.chooseCardForFeature, this );
			cards[i].addEventListener( "jellyFishPosion", this.jellyFishPosion, this );
			cards[i].addEventListener( "onShark", this.onShark, this );
			cards[i].addEventListener( "onPearl", this.onPearl, this );
			this.cardDisabledBgs[i] = Com.addBitmapAt( this.cardArea, this.assetStr("gray"), cards[i].x, cards[i].y );
			this.cardArea.addChildAt( this.cardDisabledBgs[i], 0 );
			this.cardDisabledBgs[i].visible = false;
		}

		this.chooseBit = Com.addBitmapAt( this.cardArea, "mara_" + MuLang.language + "_json.choose", 265, 305 );
		this.chooseBit.visible = false;

		this.dispatchEvent( new egret.Event( "connected_to_server" ) );

		this.currentBallIndex = 0;
		this.recordPaytalbes();

		this.bingoCounterBar = new MaraBingoCounterBar;
		Com.addObjectAt( this, this.bingoCounterBar, 0, 0 );

		this.dailogLayer = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.dailogLayer, 0, 0 );

		this.buildWaitingBar();

		this.bingoInfo = new MaraBingoInfoBar;
		Com.addObjectAt( this, this.bingoInfo, 1468, 131 );
		this.startBingoInfoTick();

		this.avatarList = new MaraAvatarArea;
		Com.addObjectAt( this, this.avatarList, 1564, 252 );

		this.chatAndMiniGameLayer = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.chatAndMiniGameLayer, 0, 0 );

		this.chatBar = new MaraChatBar;
		Com.addObjectAt( this.chatAndMiniGameLayer, this.chatBar, 1519, 593 );

		this.tipTxt = new MaraFeatureTip;
		Com.addObjectAt( this, this.tipTxt, 0, 770 );

		this.featureAnimationLayer = new MaraAnimationManager;
		this.addChild( this.featureAnimationLayer );

		SoundManager.play( "mara_BGM_mp3", true );

		this.firstTimePlayShowTutorail();

		let infoButton: TouchDownButton = Com.addDownButtonAt( this, this.assetStr("I"), this.assetStr("I"), 272, 1017, this.showInfo.bind(this), true );
		infoButton.scaleX = infoButton.scaleY = 2;
	}

	public showInfo( event: egret.TouchEvent ){
		this.dispatchEvent( new egret.Event( "showHelp" ) );
	}

	private firstTimePlayShowTutorail(){
		if( localStorage.getItem( "Mara" ) ) return;
		else{
			localStorage.setItem( "Mara", "true" );
			this.dispatchEvent( new egret.Event( "new_game_tutorail" ) );
		}
	}

	protected buildWaitingBar(){
		this.waitingBar = new MaraWaitingBar;
		Com.addObjectAt( this.dailogLayer, this.waitingBar, 493, 309 );
		this.waitingBar.scaleX = this.waitingBar.scaleY = 0.9;
		this.waitingBar.addEventListener( "waitingBarBuyCard", this.onBuyCard, this );
		this.waitingBar.addEventListener( "prizeChanged", this.onPrizeChange, this );
	}

	protected removeWaitingBar(){
		if( this.waitingBar ){
			if( this.dailogLayer.contains( this.waitingBar ) )this.dailogLayer.removeChild( this.waitingBar );
			this.waitingBar.removeEventListener( "waitingBarBuyCard", this.onBuyCard, this );
			this.waitingBar.removeEventListener( "prizeChanged", this.onPrizeChange, this );
			this.waitingBar = null;
		}
	}

	protected onBuyCard( event: egret.Event ){
		let priceObj: Object = MaraWaitingBar.cardPriceConfig[ event.data.multiple - 1 ][ event.data.amount - 1 ];
		let data: Object = { type: priceObj["coinsType"] == 1 ? "coins" : "dinero", price: priceObj["price"] };
		let isOOC = this.checkOOCByData( data );
		if( isOOC )return;

		MultiServer.buyCard( event.data.amount, event.data.multiple );
		MultiServer.buyCardCallback = this.buyCardCallback.bind( this );
		MultiServer.buyCardFeatureCallback = this.buyCardFeatureCallback.bind( this );
		this.waitingBar.hideBottomBtns( event.data.amount );
		MultiServer.existCardCallback = null;
	}

	protected onPrizeChange( event: egret.Event ){
		if( this.bingoInfo ) ( this.bingoInfo as MaraBingoInfoBar ).resetPrize( ( this.waitingBar as MaraWaitingBar ).winPrize * this.patternValue );
		if( this.chatBar ) ( this.chatBar as MaraChatBar ).resetNextPrize( ( this.waitingBar as MaraWaitingBar ).winPrize * this._currentTreasureHuntPrize );
	}

	protected getRoomVariables( varName: string, varValue: any ){
		if( varName == "timePlan" && varValue.isLocked == true ){
			alert( "the room is locked" );
		}
		if( varName == "cardPrice" ) MultiPlayerMachine.cardPrice = varValue;
		if( varName == "cardPrize" ) MultiPlayerMachine.cardPrize = varValue;
		if( varName == "enterGameState" ) this.enterGameState = varValue;
		if( varName == "patternValue" ) this.patternValue = varValue;
		if( varName == "current_treasure_hunt_prize" ) this.currentTreasureHuntPrize = varValue;
		if( varName == "tournament_multi_on_call_bingo" ) this.tmocb = varValue;
		if( varName == "treasure_hunt_pattern_format" ) this.specialPattern = varValue;
		if( !this.inited ) return;
		switch( varName ){
			case "calledBingoNumbers":
				let ballNum: number = varValue[varValue.length-1]["lastBall"];
				this.recordOverTimeTip( ballNum );
				if( !this.currentBallIndex ){
					let balls: Array<number> = this.calledBingoNumbers( varValue );
					this.ballArea.runBalls( balls );
					this.ballArea.stopBallRunning();
				}
				else{
					if( this.waitingForBalls ){
						this.waitingForBalls = false;
						let balls: Array<number> = this.calledBingoNumbers( varValue );
						this.fillBallInNewCard( balls );
					}
					this.ballArea.runExtra( ballNum );
					if( this.observeBar ) this.observeBar.checkLuckNum( ballNum );
					if( this.inPlayerRound ){
						SoundManager.play( "mara_sound_" + MuLang.language + "_" + ballNum + "_mp3" );
						this.showOverTimeTip();
					}
					else{
						if( !Mara.durringSpecial && MultiServer.totalWinCount == 0 ){
							this.specialUI();
						}
					}
				}
				break;
			case "countDown":
				if( this.waitingBar )this.waitingBar.showCountDown( varValue );
				break;
			case "timePlan":
				this.onTimePlan( varValue.isLocked );
				break;
			case "gamePattern":
				this.getRoundPattens( varValue );
				break;
			case "gameState":
				if( varValue == "idle" ) this.getFinalWinner();
				break;
			case "totalWinCount":
				trace( "totalWinCount:" + varValue );
				if( varValue <= 0 && this.lastTotalWinCount > 0 ){
					if( this.inPlayerRound ){
						this.changeGameMode();
						this.featureAnimationLayer.changeModeAnimation();
					}
					this.specialUI();
				}
				this.lastTotalWinCount = varValue;
				break;
		}
	}

	protected buyCardCallback( data: Array<Object> ){
		MultiServer.buyCardCallback = null;
		trace( data );
		let cards: Array<MultiPlayerCard> = this.cardArea.cards;

		for( let i: number = 0; i < cards.length; i++ ){
			if( data.length > i ) {
				cards[i].enabled = true;
				cards[i].getNumbers( data[i]["numbers"] );
				let freeGrids: Array<number> = data[i]["free"];
				for( let j: number = 0; j < freeGrids.length; j++ ){
					( cards[i] as MaraCard ).setFree( freeGrids[j] );
				}
				( cards[i] as MaraCard ).uuid = data[i]["uuid"];
			}
			else{
				cards[i].enabled = false;
			}
		}

		if( data.length == 1 ){
			cards[0].scaleX = cards[0].scaleY = 2.05;
			Mara.oneCardMode = true;
		}
		else{
			cards[0].scaleX = cards[0].scaleY = 1;
			Mara.oneCardMode = false;
		}

		this.waitingForStart = true;
	}

	protected startPlay(){
		this.cardArea.clearCardsStatus();
		this.sharkChoosing = false;
		this.ballArea.clearBalls();
		this.dispatchEvent( new egret.Event( "onGamePlay" ) );

		this.removeWaitingBar();
		this.hideMaskOfFeature();
		this.bingoInfo.startShowPaytalbe();

		let cards: Array<MultiPlayerCard> = this.cardArea.cards;
		for( let i: number = 0; i < cards.length; i++ ){
			if( cards[i].enabled ){
				cards[i].visible = true;
				cards[i].inTurnMode = true;
				this.cardDisabledBgs[i].visible = true;
			}
		}

		SoundManager.play( "mpb_round_start_mp3" );
		SoundManager.play( "blank_sound_mp3", true );

		this.waitingForStart = false;
		this.overTimeBalls = null;
		if( !this.lastTotalWinCount ) this.lastTotalWinCount = MultiServer.totalWinCount;
	}

	protected triggerpowerUp( data: Object ){
		let type: string = data["powerUpType"];
		if( data["redPrize"] > 0 && type == MaraGrid.AWARDTYPE_RED_BAIT ){
			let uuid: string = data["uuid"];
			let gridIndex: number = data["numberIdx"];
			this.showGetMacaroonOnCard( uuid, gridIndex, data["redPrize"], "red" );
			SoundManager.play( "macaroon_card_mp3" );
		}
		if( data["greenPrize"] > 0 && type == MaraGrid.AWARDTYPE_GREEN_BAIT ){
			let uuid: string = data["uuid"];
			let gridIndex: number = data["numberIdx"];
			this.showGetMacaroonOnCard( uuid, gridIndex, data["greenPrize"], "green" );
			SoundManager.play( "macaroon_card_mp3" );
		}
		if( data["orangePrize"] > 0 && type == MaraGrid.AWARDTYPE_ORANGE_BAIT ){
			let uuid: string = data["uuid"];
			let gridIndex: number = data["numberIdx"];
			this.showGetMacaroonOnCard( uuid, gridIndex, data["orangePrize"], "white" );
			SoundManager.play( "macaroon_card_mp3" );
		}
		if( data["refreshCard"] && type == "fishingNet" ){
			trace( "change card" );
		}
		if( type == "pearl" && data["pearlGrids"] ){
			trace( data["pearlGrids"] );
			for( let uuid in data["pearlGrids"] ){
				let cardIndex: number = this.cardArea.getIndexByUUID( uuid );
				let ar: Array<number> = data["pearlGrids"][uuid];
				( this.cardArea.cards[cardIndex] as MaraCard ).hardGetNumbers( ar );
				this.showPearlGrid( ar, cardIndex );
			}
		}
		if( data["guessNumPrize"] > 0 && type == "guessNum" ){
			this.getGuessNumPrize( data["guessNumPrize"] );
		}
	}

	protected existCard( data: Object ){
		MultiServer.existCardCallback = null;
		
		if( this.waitingBar ){
			if( data["cards"] ){
				if( this.enterGameState == "idle" ){
					this.waitingBar.existCardIdle( data["selected_multi"], data["amount"] );
					this.waitingBar.hideBottomBtns( data["amount"] );
					this.buyCardCallback( data["cards"] );
				}
				else if( this.enterGameState == "PLAYING" ){
					this.buyCardCallback( data["cards"] );
					this.currentBallIndex = 0;
					this.getRoundPattens( MultiServer.multiPlayerPattens );
					MultiPlayerMachine.oneCardPrize = MultiPlayerMachine.cardPrize * MultiServer.userMultiplier * data["amount"];
					this.startPlay();
					this.checkResumeBingo( data["cards"] );
					if( !this.maskOfFeature ) this.exitCardAndWaitingForMaskOfFeature = true;
				}
			}
			else{
				if( data["selected_multi"] ){
					this.waitingBar.existCard( data["selected_multi"], data["amount"] );
					MultiServer.buyCardCallback = this.buyCardCallback.bind( this );
				}
			}
		}
		else setTimeout( this.existCard.bind( this, data ), 100 );
	}

	protected getFinalWinner(){
		super.getFinalWinner();

		if( this.observeBar ){
			this.removeChild( this.observeBar );
			this.observeBar = null;
		}

		this.resetCardsStatus();
		this.hideAllDisabledBgs();
		if( !this.waitingBar ){
			this.buildWaitingBar();
			this.featureAnimationLayer.roundOver();
			this.refreshFeature();

			SoundManager.play( "mara_BGM_mp3", true );
		}

		this.normalUI();
		if( this.resumeTimeoutId )clearTimeout( this.resumeTimeoutId );
	}

	private startBingoInfoTick(){
		if( !isNaN(MultiServer.totalWinCount) && MultiServer.multiPlayerPattens ){
			this.getRoundPattens( MultiServer.multiPlayerPattens );
			this.bingoInfo.startShowPaytalbe();
		}
		else setTimeout( this.startBingoInfoTick.bind(this), 300 );
	}

	protected showGetMacaroonOnCard( uuid: string, gridIndex: number, coins: number, type: string ){
		let cardIndex: number = this.cardArea.getIndexByUUID( uuid );
		let pos: egret.Point = this.cardArea.positionOnCard( cardIndex, gridIndex );
		let card: MultiPlayerCard = this.cardArea.cards[cardIndex];
		if( Mara.oneCardMode ){
			let cardPt: egret.Point = new egret.Point( card.x, card.y );
			pos = pos.subtract( cardPt );
			pos = new egret.Point( pos.x * 2.05, pos.y * 2.05 );
			pos = pos.add( cardPt );
		}
		this.featureAnimationLayer.playGetMacaroon( type, card.x, card.y, coins );
		setTimeout( this.flyCoins.bind(this), 1200, pos, type );
		( card as MaraCard ).getMacaroonAt( type, gridIndex );
	}

	private flyCoins( pos: egret.Point, type: string ){
		if( !this.stage ) return;
		if( type == "white" ) return;
		
		if( this.parent && this.parent.parent && this.parent.parent.parent ){
			let flyCoins: FlyingCoins = new FlyingCoins();
			let offsetX: number = this.parent.parent.x + this.parent.x + this.x;
			let offsetY: number = this.parent.parent.y + this.parent.y + this.y;
			if( type == "red" )flyCoins.fly( 10, new egret.Point( pos.x + offsetX, pos.y + offsetY ), new egret.Point(670, 230), new egret.Point( 800, 600 ), 0.15, 0.1, 0.3 );
			else if( type == "green" )flyCoins.flyDenero( 10, new egret.Point( pos.x + offsetX, pos.y + offsetY ), new egret.Point(865, 230), new egret.Point( 800, 600 ), 0.15, 0.1, 0.3 );
			this.parent.parent.parent.addChild( flyCoins );
		}
	}

	protected callBingo( data: Object ){
		let isFake: boolean = data["is_fake"];

		MaraChatBar.isTopThree = ( this.avatarList as MaraAvatarArea ).showHead( data["fbId"] );
		if( !isFake ) super.callBingo( data );

		if( data["isMe"] ){
			let cards: Array<MultiPlayerCard> = this.cardArea.cards;
			for( let i: number = 0; i < cards.length; i++ ){
				if( cards[i].uuid == data["uuid"] ){
					( cards[i] as MaraCard ).confirmBingo();
					if( Mara.durringSpecial ) this.featureAnimationLayer.showSpecialBingo();
				}
			}
		}
	}

	protected onTimePlan( isLocked: boolean ){
		super.onTimePlan( isLocked );
		( this.avatarList as MaraAvatarArea ).clearHead();
	}

/************************************************************************************************************************/

	private featureLayer: MaraFeatureLayer;
	private specialPattern: string;
	private observeBar: MaraObserveBar;
	private maskOfFeature: egret.Bitmap;

	private exitCardAndWaitingForMaskOfFeature: boolean;

	private lastTotalWinCount: number;

	private nextRoundFeatures: Array<Object>;

	protected buyCardFeatureCallback( data: Object ){
		MultiServer.buyCardFeatureCallback = null;
		if( !this.featureLayer ){
			this.featureLayer = new MaraFeatureLayer;
			this.addChild( this.featureLayer );
			this.featureLayer.addEventListener( "featureEvent", this.buyFeatrue, this );
			this.featureLayer.addEventListener( "featureTip", this.featureTip, this );
			this.featureLayer.addEventListener( "featureCancel", this.featureCancel, this );

			this.maskOfFeature = Com.addBitmapAt( this, this.assetStr( "skill gray" ), 21, 238 );
			this.maskOfFeature.touchEnabled = true;

			if( this.exitCardAndWaitingForMaskOfFeature && !Mara.durringSpecial ){
				this.hideMaskOfFeature();
				this.exitCardAndWaitingForMaskOfFeature = false;
			}
		}

		this.featureLayer.getNewFeatureItems( data["availableFeatures"] );

		if (this.waitingBar) this.waitingBar.updateFreeCardAfterBuycard( data["freeCard"] );
	}

	private buyFeatrue( event: egret.Event ){
		let data: Object = event.data;
		let isOOC = this.checkOOCByData( data );
		if( isOOC )return;

		if( data["name"] == "star" || data["name"] == "fishingNet" || data["name"] == "swirl" ){
			this.chooseCardToGetUUID( data );
		}
		else this.sendBuyFeatureRequest( data["name"] );
	}

	private tipTxt: MaraFeatureTip;

	private featureTip( event: egret.Event ){
		this.tipTxt.showTip( event.data["name"] );
	}

	private featureCancel( event: egret.Event ){
		this.cardClickMode( false );
		this.buyingFeatureData = null;
	}

	private checkOOCByData( data: Object ): boolean{
		let compareNumber: number;
		let eventString: string;
		if( data["type"] == "coins" ){
			compareNumber = this.gameCoins;
			eventString = "out_of_coins_game_id";
		}
		else if( data["type"] == "dinero" ){
			compareNumber = this.dinero;
			eventString = "out_of_dinero";
		}
		else{
			alert( "typeError" );
			return true;
		}
		if( compareNumber < data["price"] ){
			this.dispatchEvent(new egret.Event(eventString));
			return true;
		}
		return false
	}

	private sendBuyFeatureRequest( featureName: string ){
		MultiServer.buyFeature( featureName );
		MultiServer.buyFeatureCallback = this.buyFeatrueCallback.bind(this);
	}

	private buyFeatrueCallback( data: Object ){
		trace( data );
		if( !data || !data["success"] ) return;
		this.nextRoundFeatures = data["availableFeatures"];
		switch( data["powerUp"] ){
			case "cylinder":
				this.cylinder( data["cylinder_ebs"] );
				break;
			case "jellyFish":
				this.jellyFish( data["jelly_luck_random_pos"] );
				break;
			case "redBait":
				this.redBait( data["red_bait_luck_pos"] );
				break;
			case "greenBait":
				this.greenBait( data["green_bait_luck_pos"] );
				break;
			case "orangeBait":
				this.orangeBait( data["orange_bait_luck_pos"] );
				break;
			case "camera":
				this.camera( data["luck_pos_per_card"] );
				break;
			case "pearl":
				this.pearl( data["pearl_luck_main_pos"], data["pearl_luck_pos"] );
				break;
			case "shark":
				this.shark();
				break;
			case "star":
				this.star();
				break;
			default:
				return;
		}
		this.featureLayer.lockCardFeature( data["powerUp"] );
	}

	private changeGameMode(){
		let cards: Array<MultiPlayerCard> = this.cardArea.cards;
		let hasBingo: boolean = false;
		for( let i: number = 0; i < cards.length; i++ ){
			if( !cards[i].enabled ) continue;
			hasBingo = (cards[i] as MaraCard).changeMode( this.specialPattern ) || hasBingo;
		}

		if( !hasBingo ) {
			this.observeMode();
			this.hideAllDisabledBgs();
		}
		else{
			this.bingoInfo.currentPaytableRules = [this.specialPattern];
		}

		this.quitInturnMode();
		this.showMaskOfFeature();
	}

	public static durringSpecial: boolean;

	private specialUI(){
		( this.chatBar as MaraChatBar ).specialUI();
		( this.bingoInfo as MaraBingoInfoBar ).specialUI();
		if( this.avatarList )this.avatarList.visible = false;
		if( this.bingoInfo ) ( this.bingoInfo as MaraBingoInfoBar ).resetPrize( MaraWaitingBar.cardPriceConfig[0][0]["price"] * Mara.betStep * this._currentTreasureHuntPrize, false );
		this.cardClickMode( false );
		Mara.durringSpecial = true;
	}

	private normalUI(){
		( this.chatBar as MaraChatBar ).normalUI();
		( this.bingoInfo as MaraBingoInfoBar ).normalUI();
		if( this.avatarList )this.avatarList.visible = true;
		if( this.bingoInfo ) ( this.bingoInfo as MaraBingoInfoBar ).resetPrize( MaraWaitingBar.cardPriceConfig[0][0]["price"] * Mara.betStep * this.patternValue );
		Mara.durringSpecial = false;
	}

	private checkSpecialBingo( event: egret.Event ){
		let card: MaraCard = event.target;
		let checkString: string = card.getCollectedString();
		let ptString: string = this.specialPattern;
		let isFit: boolean = true;
		for( let j: number = 0; j < ptString.length; j++ ){
			if( ptString.charAt(j) == "1" && checkString.charAt(j) != "1" ){
				isFit = false;
				break;
			}
		}
		if( isFit ){
			card.treatureBingo();
		}
	}

	private observeMode(){
		this.observeBar = new MaraObserveBar;
		MultiServer.luckNumberCallback = this.waitForLuckyNumber.bind( this );
		Com.addObjectAt( this, this.observeBar, 0, 0 );
		this.addChildAt( this.observeBar, this.getChildIndex( this.cardArea ) + 1 );
	}

	private showMaskOfFeature(){
		if( this.maskOfFeature ) this.maskOfFeature.visible = true;
	}

	private hideMaskOfFeature(){
		if( this.maskOfFeature ) this.maskOfFeature.visible = false;
	}

	private waitForLuckyNumber( luckNums: Array<number> ){
		MultiServer.luckNumberCallback = null;
		let balls: Array<egret.Sprite> = [];
		for( let i: number = 0; i < luckNums.length; i++ ){
			balls[i] = ( this.ballArea as MaraBallLayer ).getABall( luckNums[i] );
			balls[i].name = "" + luckNums[i];
			balls[i].scaleX = balls[i].scaleY = 1.375;
		}
		this.observeBar.showLuckNums( balls );
	}

	private getGuessNumPrize( prize: number ){
		if( this.observeBar ) this.observeBar.showLuckPrize( prize );
	}

/**************************************************************************************************************************************/

	private featureAnimationLayer: MaraAnimationManager;

	private cylinder( extras: Array<number> ){
		( this.ballArea as MaraBallLayer ).lafayette( extras );
		this.featureAnimationLayer.playLafayette();
		SoundManager.play( "lafayette_mp3" );
	}

	private jellyFish( ob: Object ){
		let cards: Array<MaraCard> = this.cardArea.cards as Array<MaraCard>;
		let obj: Object = {};
		for( let i: number = 0; i < cards.length; i++ ){
			let num: number = ob[cards[i].uuid];
			let cow: number = num % 6;
			let line: number = Math.floor( num / 6 );
			let pos: egret.Point = new egret.Point;
			pos.x = cards[i].x;
			pos.y = cards[i].y;
			pos.x += GameCardUISettings.gridInitPosition.x + cow * CardGridColorAndSizeSettings.gridSpace.x;
			pos.y += GameCardUISettings.gridInitPosition.y + line * CardGridColorAndSizeSettings.gridSpace.y;
			let powerUpIcon: egret.Bitmap = Com.addBitmapAt( this, this.assetStr( "cicon_jellyFish" ), 200, -50 );
			TweenerTool.tweenTo( powerUpIcon, { x: pos.x, y: pos.y }, 300, 0, MDS.removeSelf.bind( this, powerUpIcon ) );
			setTimeout( cards[i].jellyBomb.bind(cards[i], cow, line ), 300 );
		}
		SoundManager.play( "mara_cheese_mp3" );
	}

	private redBait( ob: Object ){
		this.addMacaroonOnCard( ob, "red_macaroon" );
		setTimeout( this.addAwardOnCard.bind(this), 1200, ob, "cicon_redBait", MaraGrid.AWARDTYPE_RED_BAIT );
	}

	private greenBait( ob: Object ){
		this.addMacaroonOnCard( ob, "green_macaroon" );
		setTimeout( this.addAwardOnCard.bind(this), 1200, ob, "cicon_greenBait", MaraGrid.AWARDTYPE_GREEN_BAIT );
	}

	private orangeBait( ob: Object ){
		this.addMacaroonOnCard( ob, "white_macaroon" );
		setTimeout( this.addAwardOnCard.bind(this), 1200, ob, "cicon_orangeBait", MaraGrid.AWARDTYPE_ORANGE_BAIT );
	}

	private camera( ob: Object ){
		this.addCameraOnCard( ob );
	}

	private addMacaroonOnCard( ob: Object, animationName: string ){
		let cards: Array<MaraCard> = this.cardArea.cards as Array<MaraCard>;
		for( let i: number = 0; i < cards.length; i++ ){
			let arr: Array<number> = ob[cards[i].uuid];
			if( arr.length ) this.featureAnimationLayer.playMacaroon( animationName, cards[i].x, cards[i].y );
		}
		SoundManager.play( "macaroon_mp3" );
	}

	private addCameraOnCard( ob: Object ){
		let cards: Array<MaraCard> = this.cardArea.cards as Array<MaraCard>;
		for( let i: number = 0; i < cards.length; i++ ){
			let arr: Array<number> = ob[cards[i].uuid];
			for( let k: number = 0; k < arr.length; k++ ){
				let cardIndex: number = i;
				let gridIndex: number = arr[k];
				let startPosition: egret.Point = this.cardArea.positionOnCard( cardIndex, 12 );
				let pos: egret.Point = this.cardArea.positionOnCard( cardIndex, gridIndex );
				
				this.featureAnimationLayer.playCamera( pos, cards[i].x, cards[i].y );
			}
			setTimeout( cards[i].setCoinsAward.bind(cards[i], arr, MaraGrid.AWARDTYPE_CAMARA ), 600 );
		}
		SoundManager.play( "mara_paining_mp3" );
	}

	private pearl( ob1: Object, ob2: Object ){
		this.addAwardOnCard( ob2, "cicon_pearl_small", MaraGrid.AWARDTYPE_PEARL_PER );
		for( let ob in ob1 ) ob1[ob] = [ob1[ob]];
		this.addAwardOnCard( ob1, "cicon_pearl_big", MaraGrid.AWARDTYPE_PEARL_MAIN );
		SoundManager.play( "mara_perfume_mp3" );
	}

	private shark(){
		this.sharkChoosing = true;
	}

	private star(){
		let card: MultiPlayerCard = this.cardArea.cards[this.changeCardId];
		this.featureAnimationLayer.playStar( card.x, card.y );
		( card as MaraCard ).star();
		SoundManager.play( "mara_sandwich_mp3" );
	}

	private addAwardOnCard( ob: Object, iconStr: string, awardType: String ){
		let cards: Array<MaraCard> = this.cardArea.cards as Array<MaraCard>;
		for( let i: number = 0; i < cards.length; i++ ){
			let arr: Array<number> = ob[cards[i].uuid];
			for( let k: number = 0; k < arr.length; k++ ){
				let cardIndex: number = i;
				let gridIndex: number = arr[k];
				let startPosition: egret.Point = this.cardArea.positionOnCard( cardIndex, 12 );
				let pos: egret.Point = this.cardArea.positionOnCard( cardIndex, gridIndex );
				if( Mara.oneCardMode ){
					startPosition = new egret.Point( 232, 224 );
					let onecardPosition: egret.Point = new egret.Point( 158, 142 );
					pos = pos.subtract( onecardPosition );
					pos = new egret.Point( pos.x * 2.05, pos.y * 2.05 );
					pos = pos.add( onecardPosition );
				}
				let powerUpIcon: egret.Bitmap = Com.addBitmapAt( this, this.assetStr( iconStr ), startPosition.x, startPosition.y );
				TweenerTool.tweenTo( powerUpIcon, { x: pos.x, y: pos.y }, 300, 0, MDS.removeSelf.bind( this, powerUpIcon ) );
			}
			setTimeout( cards[i].setCoinsAward.bind(cards[i], arr, awardType ), 300 );
		}
	}

	private fishingNetChangeCards( data: Array<Object> ){
		MultiServer.buyCardCallback = null;
		trace( data );

		let cardIndex: number = this.changeCardId;
		let card: MaraCard = this.cardArea.cards[cardIndex] as MaraCard;
		card.clearMultiStatus();
		card.getNumbers( data[cardIndex]["numbers"] );
		let freeGrids: Array<number> = data[cardIndex]["free"];
		for( let j: number = 0; j < freeGrids.length; j++ ){
			card.setFree( freeGrids[j] );
		}
		card.uuid = data[cardIndex]["uuid"];
		this.waitingForBalls = true;

		if( this.buyingFeatureData["name"] == "fishingNet" ){
			this.featureAnimationLayer.redWine( card.x, card.y );
			SoundManager.play( "red_wine_mp3" );
		}
		else if( this.buyingFeatureData["name"] == "swirl" ){
			this.featureAnimationLayer.bread( card.x, card.y );
			SoundManager.play( "bread_mp3" );
		}
		this.featureLayer.lockGridFeature( this.buyingFeatureData["name"] );
	}

	private chooseCardToGetUUID( data: Object ){
		this.cardClickMode( true );
		this.buyingFeatureData = data;
		this.featureLayer.waitForChoose( data );
	}

	private buyingFeatureData: Object;
	private changeCardId: number;
	private waitingForBalls: boolean;
	private swirlColectedNumbers: Array<number>;

	private chooseCardForFeature( event: egret.Event ){
		let uuid: string = ( event.target as MaraCard ).uuid;
		let isOOC = this.checkOOCByData( this.buyingFeatureData );
		if( isOOC )return;

		if( this.buyingFeatureData["name"] == "fishingNet" || this.buyingFeatureData["name"] == "swirl" ){
			MultiServer.buyCardCallback = this.fishingNetChangeCards.bind( this );
			if( this.buyingFeatureData["name"] == "swirl" ){
				this.swirlColectedNumbers = ( event.target as MaraCard ).getCollectedNumbers();
			}
			else this.swirlColectedNumbers = null;
		}
		this.changeCardId = this.cardArea.getIndexByUUID( uuid );
		MultiServer.buyFeature( this.buyingFeatureData["name"], uuid );
		MultiServer.buyFeatureCallback = this.buyFeatrueCallback.bind(this);

		this.cardClickMode( false );
	}

	private fillBallInNewCard( balls: Array<number> ){
		let card: MaraCard = this.cardArea.cards[this.changeCardId] as MaraCard;
		for( let i: number = 0; i < balls.length - 1; i++ ){
			card.checkNumber( balls[i] );
			if( i < balls.length - 2 )card.overTimeCheck( balls[i] );
		}
		if( this.swirlColectedNumbers ){//for swirl
			card.swirlGotNumbers( this.swirlColectedNumbers );
			this.swirlColectedNumbers = null;
		}
	}

	protected onCardPriceCallback(data: Object): void {
		if (data) {
			MaraWaitingBar.cardPriceConfig = data["cardPriceConfig"];

			if (this.waitingBar) this.waitingBar.updateFreeCardCountText(data["freeCard"]);
		}
	}

	private resumeTimeoutId: number;

	private onResumeCallback( data: Object ): void{
		if( !data ) return;
		if( !this.inPlayerRound || !this.inited ) {
			this.resumeTimeoutId = setTimeout( this.onResumeCallback.bind( this ), 200, data );
			return;
		}
		this.resumeTimeoutId = NaN;
		if( data["status"] == "luck_guess_nums" ){
			this.changeGameMode();
			if( data["luck_guess_nums"] ){
				this.waitForLuckyNumber( data["luck_guess_nums"] );
				if( data["guess_num"] ) this.observeBar.getNumFromServer( data["guess_num"] );
			}
			this.specialUI();
		}
		else if( data["status"] == "treasure_hunt" ){
			this.specialPattern = data["treasure_hunt_pattern_format"];
			this.changeGameMode();
			this.specialUI();
		}
		else if( data["status"] == "normal" ){
			let resumeFeature: Object = MaraPayForBingoDataFormat.getFeatureData( data["data"] );
			trace( resumeFeature );
			if( resumeFeature["green_bait_luck_pos"] )this.greenBait( resumeFeature["green_bait_luck_pos"] );
			if( resumeFeature["red_bait_luck_pos"] )this.redBait( resumeFeature["red_bait_luck_pos"] );
			if( resumeFeature["orange_bait_luck_pos"] )this.orangeBait( resumeFeature["orange_bait_luck_pos"] );
			if( resumeFeature["luck_pos_per_card"] )this.camera( resumeFeature["luck_pos_per_card"] );
			if( resumeFeature["cylinder_ebs"] )this.cylinder( resumeFeature["cylinder_ebs"] );
			if( resumeFeature["jelly_luck_random_pos"] )this.jellyFish( resumeFeature["jelly_luck_random_pos"] );
			if( resumeFeature["pearl_luck_main_pos"] && resumeFeature["pearl_luck_pos"] )this.pearl( resumeFeature["pearl_luck_main_pos"], resumeFeature["pearl_luck_pos"] );

			if( resumeFeature["red_bait_have_got_pos"] ) this.haveGotPos( resumeFeature["red_bait_have_got_pos"] );
			if( resumeFeature["green_bait_have_got_pos"] ) this.haveGotPos( resumeFeature["green_bait_have_got_pos"] );
			if( resumeFeature["orange_bait_have_got_pos"] ) this.haveGotPos( resumeFeature["orange_bait_have_got_pos"] );
			if( resumeFeature["pearl_have_got_luck_pos"] ) this.haveGotPos( resumeFeature["pearl_have_got_luck_pos"] );

			if( resumeFeature["shark_mark_pos"] && resumeFeature["shark_mark_card_uuid"] ) this.haveGotShark( resumeFeature["shark_mark_pos"], resumeFeature["shark_mark_card_uuid"] );
		}
	}

	private haveGotPos( ob: Object ){
		let cards: Array<MaraCard> = this.cardArea.cards as Array<MaraCard>;
		for( let i: number = 0; i < cards.length; i++ ){
			let arr: Array<number> = ob[cards[i].uuid];
			if( arr ) cards[i].hardGetNumbers( arr );
		}
	}

	private haveGotShark( gridIndex: number, uuid: string ){
		let cards: Array<MaraCard> = this.cardArea.cards as Array<MaraCard>;
		for( let i: number = 0; i < cards.length; i++ ){
			if( cards[i].uuid == uuid ) cards[i].hardGetNumber( gridIndex );
		}
	}

	private onEnterCallback( data: Object ): void{
		if( this.assetReady ){
			this.nextRoundFeatures = data["availableFeatures"];
			let lockNames: Array<string> = [];
			if( data["havePaidFeatures"] ){
				for( let i: number = 0; i < data["havePaidFeatures"].length; i++ ){
					lockNames.push(data["havePaidFeatures"][i]["name"]);
				}
				data["availableFeatures"] = data["havePaidFeatures"];
				for( let i: number = 0; i < this.nextRoundFeatures.length; i++ ){
					if( data["availableFeatures"].length == 3 ) break;
					let equal: boolean = false;
					for( let j: number = 0; j < data["availableFeatures"].length; j++ ){
						if( this.nextRoundFeatures[i]["name"] == data["availableFeatures"][j]["name"] ){
							equal = true;
							break;
						}
					}
					if( !equal ) {
						data["availableFeatures"].push( this.nextRoundFeatures[i] );
					}
				}
			}
			this.buyCardFeatureCallback( data );
			if( lockNames.length ){
				for( let i: number = 0; i < lockNames.length; i++ ){
					if( lockNames[i] == "fishingNet" || lockNames[i] == "swirl" ) this.featureLayer.lockGridFeature( lockNames[i] );
					else this.featureLayer.lockCardFeature( lockNames[i] );
				}
			}
		}
		else setTimeout( this.onEnterCallback.bind(this), 200, data );
	}

	private jellyFishPosion( event: egret.Event ){
		let jbi: number = event.data.jellyBombIndex;
		let cardId: number = event.data.cardId;
		let card: MultiPlayerCard = this.cardArea.cards[cardId];
		this.featureAnimationLayer.jellyFish( jbi, card.x, card.y );
		SoundManager.play( "cheese_card_mp3" );
	}

	private onShark( event: egret.Event ){
		this.checkMultiBingo( event );
		let card: MaraCard = event.target as MaraCard;
		let cardIndex: number = card["cardId"];
		let gridIndex: number = event.data;
		let startPosition: egret.Point = this.cardArea.positionOnCard( cardIndex, 12 );
		let endPosition: egret.Point = this.cardArea.positionOnCard( cardIndex, gridIndex );
		this.featureAnimationLayer.playShark( startPosition, endPosition, card.x, card.y );
		SoundManager.play( "mara_croissant_mp3" );
		this.sharkChoosing = false;
	}

	private onPearl( event: egret.Event ){
		let card: MaraCard = event.target as MaraCard;
		let cardIndex: number = card["cardId"];
		let gridIndex: number = event.data;
		let pearlMainPoint: egret.Point = this.cardArea.positionOnCard( cardIndex, gridIndex );
		this.featureAnimationLayer.playPearlMain( pearlMainPoint, card.x, card.y );
		SoundManager.play( "perfume_card_mp3" );
	}

	private showPearlGrid( nums: Array<number>, cardIndex: number ){
		for( let i: number = 0; i < nums.length; i++ ){
			let pearlPoint: egret.Point = this.cardArea.positionOnCard( cardIndex, nums[i] );
			this.featureAnimationLayer.playPearl( pearlPoint );
		}
	}

/**************************************************************************************************************/

	private _currentTreasureHuntPrize: number;
	private set currentTreasureHuntPrize( value: number ){
		this._currentTreasureHuntPrize = value;
		this.resetNextPrize();
	}

	private resetNextPrize(){
		if( this.chatBar && MaraWaitingBar.cardPriceConfig ){
			( this.chatBar as MaraChatBar ).resetNextPrize( MaraWaitingBar.cardPriceConfig[0][0]["price"] * Mara.betStep * this._currentTreasureHuntPrize );
		}
		else setTimeout( this.resetNextPrize.bind(this), 300 );
	}

	protected patternValue: number;
	public static oneCardMode: boolean;

	private static _betStep: number = 1;
	public static set betStep( value: number ){
		this._betStep = value;
		let fl: MaraFeatureLayer = ( MultiPlayerMachine["currentGame"] as Mara ).featureLayer;
		if( fl ) fl.betStepPrice();
	}
	public static get betStep(): number{
		return this._betStep;
	}

	private _tmocb: Array<number>;
	private set tmocb( value: Array<number> ){
		this._tmocb = value;
		this.setTmocb();
	}

	private setTmocb(){
		if( this.avatarList ) ( this.avatarList as MaraAvatarArea ).setTmocb( this._tmocb );
		else setTimeout( this.setTmocb.bind( this ), 300 );
	}

	private refreshFeature(){
		this.featureLayer.getNewFeatureItems( this.nextRoundFeatures );
	}

	private overTimeBalls: Array<number>;

	private recordOverTimeTip( num: number ){
		if( !this.overTimeBalls ) this.overTimeBalls = [];
		this.overTimeBalls.push( num );
	}

	private showOverTimeTip(){
		let overTimeBall: number = -1;
		while ( this.overTimeBalls.length >= 3 ){
			overTimeBall = this.overTimeBalls.shift();
		}
		if( overTimeBall != -1 ){
			let cards: Array<MultiPlayerCard> = this.cardArea.cards;
			for( let i: number = 0; i < cards.length; i++ ){
				if( !cards[i].enabled ) continue;
				 (cards[i] as MaraCard).overTimeCheck( overTimeBall );
			}
		}
	}

	public hideAllDisabledBgs(){
		for( let i: number = 0; i < 4; i++ ){
			this.cardDisabledBgs[i].visible = false;
		}
	}

	public checkResumeBingo( data: Array<Object> ){
		let cards: Array<MultiPlayerCard> = this.cardArea.cards;

		for( let i: number = 0; i < data.length; i++ ){
			if( data[i]["bingo"] ){
				( cards[i] as MaraCard ).resumeBingo();
			}
		}
	}

	private _sharkChoosing: boolean;
	private set sharkChoosing( value: boolean ){
		this._sharkChoosing = value;
		if( this.chooseBit ) this.chooseBit.visible = value;
		let cards: Array<MultiPlayerCard> = this.cardArea.cards;
		for( let i: number = 0; i < cards.length; i++ ){
			( cards[i] as MaraCard ).sharkChoosing( value );
		}
	}

	private cardClickMode( value: boolean ){
		MaraCard.cardClickMode = value;
		if( this.chooseBit ) this.chooseBit.visible = value;
		let cards: Array<MultiPlayerCard> = this.cardArea.cards;
		if( !cards ) return;
		for( let i: number = 0; i < cards.length; i++ ){
			( cards[i] as MaraCard ).cardClickMode( value );
		}
	}
}
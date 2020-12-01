class Blackout extends Multi75Super{

	protected static get classAssetName(){
		return "blackout_" + MuLang.language;
	}

	protected static get animationAssetName(){
		return "blackoutAnimation";
	}

	protected assetStr( str: string ): string{
		return "blackout_json." + str;
	}

	public constructor( assetsPath: string ) {
		super( "blackout.conf", assetsPath );
		this.languageObjectName = "blackout_text_tx";

		this.connetKeys = { zona: "MultiplayerZone75", sala: "Multi75" };

		this.ballArea = new BlackoutBallLayer;
		this.ballArea.mask = new egret.Rectangle( 130, 15, 625, 130 );

		MultiCardLayer.cardType = BlackoutCard;
		MultiCardLayer.gridType = BlackoutGrid;
		MultiPlayerCard.useRedEffect = false;

		MultiPlayerGrid.blink1PicName = "white";
		MultiPlayerGrid.blink2PicName = "white";
		MultiPlayerGrid.defaultBgPicName = "white";
		MultiPlayerGrid.onEffBgPicName = "white";
		MultiPlayerGrid.linePicName = "green";
		MultiPlayerGrid.zeroUIName = "yellow";

		MultiPlayerGrid.defaultNumberSize = 40;
	}

	protected addCallbacks() {
		super.addCallbacks();
		MultiServer.onZoneCallback = this.onZoneCallback.bind(this);
		MultiServer.powerUpCallback = this.onPoworup.bind(this);
		MultiServer.onPastJoinedRoomCallback = this.pastJoinedRoomData.bind(this);
	}

	protected removeCallbacks() {
		super.removeCallbacks();
		MultiServer.onZoneCallback = null;
		MultiServer.onEnterCallback = null;
		MultiServer.onBlackoutBallCallback = null;
		MultiServer.powerUpCallback = null;
		MultiServer.onPastJoinedRoomCallback = null;
	}

	protected onZoneCallback( data: Object ){
		MultiServer.onZoneCallback = null;
		if( this.assetReady ) this.blackoutInit( data );
		else setTimeout( this.onZoneCallback.bind( this, data ), 200 );
	}

	protected blackoutInit( data: Object ){
		this.inited = true;
		this.dispatchEvent( new egret.Event( MultiPlayerMachine.GENERIC_MODAL_LOADED ) );

		this.mask = BingoBackGroundSetting.gameMask;
		MuLang.txt = this.getLanguageObject();

		BlackoutRoomItem.championAwardBase = data["championAwardBase"];
		this.preBuyCardBar = new BlackPreBuyCard( data["cardPriceConfig"], data["pastJoinedRooms"] );
		this.addChild( this.preBuyCardBar );
		SoundManager.play( "blackout_bgm_mp3", true );
		this.preBuyCardBar.addEventListener(BlackoutRoomItem.CHOOSE_CARD, this.preBuyCardChoose, this);

		this.firstTimePlayShowTutorail();

		setTimeout(this.reportConnect.bind(this), 100);
	}

	private reportConnect() {
		this.dispatchEvent( new egret.Event( "connected_to_server" ) );
	}

	protected preBuyCardChoose( event: egret.Event ){
		let isOOC = this.checkOOCByData( event.data );
		if( isOOC )return;

		this.sendPreBuyCard( event.data["index"] + 1 );
	}

	private checkOOCByData( data: Object ): boolean{
		let compareNumber: number;
		let eventString: string;
		if( data["type"] == 1 ){
			compareNumber = this.gameCoins;
			eventString = "out_of_coins_game_id";
		}
		else if( data["type"] == 2 ){
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

	private sendPreBuyCard( multiple: number ){
		MultiServer.sendPreBuyCard( multiple );
		MultiServer.onPreBuyCard = this.onPreBuyCard.bind(this);
		MultiServer.onBlackoutMatching = this.matching.bind(this);
	}

	private onPreBuyCard( data: Object ){
		if( !this.vsBar ){
			this.vsBar = new BlackoutVs;
			this.addChild( this.vsBar );
		}
		this.vsBar.gotPlayer( data );
	}

	private matching( data: Object ){
		MultiServer.onPreBuyCard = null;
		MultiServer.onBlackoutMatching = null;
		if( data["roomName"] ){
			this.getInRoom( data["roomName"] );
			MultiServer.onEnterCallback = this.onEnterCallback.bind(this);
		}
		else if( !data["result"] ) {
			if (this.vsBar && this.contains(this.vsBar)) {
				this.removeChild(this.vsBar);
				this.vsBar = null;
			}
		}
	}

	private getInRoom( roomName: string ){
		MultiServer.blackoutGetInRoom( roomName );
	}

	protected onJoinRoomCallback() {
		this.firstJoinRoom();

		SoundManager.play( "blank_sound_mp3", true );
    }

	private firstJoinRoom(){
		if( this.contains( this.preBuyCardBar ) ) this.removeChild( this.preBuyCardBar );
		this.onConfigLoadComplete();
		BingoBackGroundSetting.assetName = "blackout";
		this._mcf = BingoBackGroundSetting.initBackground( this );

		this.addChild( this.ballArea );
		this.addChild( this.cardArea );

		MDS.mcFactory = this._mcf;

		this.letsWait();
	}

	private onEnterCallback( data: Object ): void{
		this.buyRealCard( data["multiplier"] ? data["multiplier"] : 4 );
		this.resetGameTime( data["timeLeft"] );
		this.addEventListener( egret.Event.ENTER_FRAME, this.frameTime, this );
		if (this.vsBar && this.contains(this.vsBar)) {
			this.removeChild(this.vsBar);
			this.vsBar = null;
		}
	}

	private resetGameTime( leftTime: number ){
		this.timeLeft = leftTime;
		this.roundStartTime = egret.getTimer();
	}

	private timeLeftNumber: number;

	private frameTime( event: egret.Event ){
		let isTimeStuck: boolean = this.checkGoldBallProcess();
		this.checkDoublePoint();
		if( this.freezeUI ){
			isTimeStuck = this.freezeUI.checkFreeze() || isTimeStuck;
		}

		if( !isTimeStuck && !this.waitingForStart ){
			let timePassed: number = Math.floor( ( egret.getTimer() - this.roundStartTime ) / 1000 );
			let leftTime: number = Math.max( 0, this.timeLeft - timePassed );
			if( this.timeLeftNumber != leftTime ){
				this.timeLeftNumber = leftTime;
				let timeStr: string = Utils.secondToHour( leftTime );
				this.timeTex.text = timeStr.substr( 3 );
			}
		}
	}

	protected getResultListToCheck(){
		let checkingString: Array<string> = [];
		for (let i: number = 0; i < this.cardArea.cards.length; i++){
			if (!this.cardArea.cards[i].enabled) break;
			checkingString.push( ( this.cardArea.cards[i] as BlackoutCard ).getCollectedString() );
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
		this.afterCheck( resultList );
	}

	protected afterCheck( resultList: Array<Object> ): void{
		this.cardArea.clearCardsEffect();
		for( let i: number = 0; i < resultList.length; i++ ){
			for( let ob in MultiPayTable.payTablesDictionary ){
				let result: PaytableCheckResult = resultList[i][ob];
				if( result.fit || result.fits ){
					if( BlackoutPaytableGot.paytableGotten ){
						let hasNew: boolean = BlackoutPaytableGot.check( this.cardArea.cards[i].uuid, ob, result.fit, result.fits );
						if( hasNew ){
							this.bingoButton.enable = true;
							break;
						}
					}
					else{
						this.bingoButton.enable = true;
					}
				}
			}
		}
	}

/************************************************************************************************************************************************/

	private energyBar: BlackoutEnergy;
	private preBuyCardBar: BlackPreBuyCard;
	private vsBar: BlackoutVs;
	private bingoButton: BlackoutBingoButton;
	private timeLeft: number;
	private roundStartTime: number;
	private doublePointTime: number;
	private timeTex: egret.TextField;
	private scoreTex: egret.TextField;
	private scoreBg: egret.Bitmap;
	private gold: BlackoutGold;
	private freezeUI: BlackoutFreezeUI;
	private resultBar: BlackoutResult;
	private otherPlayers: BlackoutOtherPlayers;
	private countDown: BlackoutBallCountDown;
	private passBallBar: BlackoutPassBallBar;
	private ballStatusButton: egret.Shape;
	private freezeChangeBallPassStatus: boolean;

	private exitCardPlaying: boolean;
	public static ballSpeed: number;
	public static _markingState: string;
	public static get markingState(): string{
		return this._markingState;
	}
	public static set markingState( value: string ){
		this._markingState = value;
		let bk: Blackout = MultiPlayerMachine.currentGame as Blackout;
		if( bk.energyBar ){
			bk.energyBar.showMark( value != null );
		}
	}

	protected letsWait(): void{
		this.setCardDatasWithNumeros(MDS.fakeArr(100));

		let cards: Array<MultiPlayerCard> = this.cardArea.cards;
		for( let i: number = 0; i < cards.length; i++ ){
			cards[i].visible = false;
			cards[i].enabled = false;
			cards[i].addEventListener( "mark_grid", this.markGrid, this );
		}

		this.currentBallIndex = 0;
		this.recordPaytalbes();

		this.bingoInfo = new BlackoutInfoBar;

		this.energyBar = new BlackoutEnergy;
		Com.addObjectAt( this, this.energyBar, 618, 266 );
		this.energyBar.addEventListener( "useEnergy", this.useEnergy, this );

		this.bingoButton = new BlackoutBingoButton;
		Com.addObjectAt( this, this.bingoButton, 618, 513 );

		this.timeTex = Com.addTextAt( this, 660, 160, 94, 25, 25, false, true );
		this.timeTex.textColor = 0xCFF4FD;
		this.timeBreath();
		this.scoreBg = Com.addBitmapAt( this, this.assetStr( "double_points" ), 615, 207 );
		this.scoreBg.visible = false;
		this.scoreTex = Com.addTextAt( this, 640, 220, 94, 25, 25, false, true );
		this.scoreTex.textColor = 0xFFCF01;
		this.scoreTex.text = "0";

		this.otherPlayers = new BlackoutOtherPlayers();
		this.addChild( this.otherPlayers );
		this.otherPlayers.getRoomMate();

		this.countDown = new BlackoutBallCountDown( this.getChildByName( this.assetStr("time") ) );
		this.passBallBar = new BlackoutPassBallBar;
		Com.addObjectAt( this, this.passBallBar, 146, 0 );

		this.ballStatusButton = new egret.Shape;
		GraphicTool.drawRect( this.ballStatusButton, new egret.Rectangle( 0, 0, this.passBallBar.width, this.passBallBar.height ), 0, false, 0.01 );
		Com.addObjectAt( this, this.ballStatusButton, this.passBallBar.x, this.passBallBar.y );
		this.ballStatusButton.touchEnabled = true;
		this.ballStatusButton.addEventListener( egret.TouchEvent.TOUCH_TAP, this.ballAndPassStatus, this );
		
		this.ballAndPassStatus( null );

		this.addFreeze();
	}

	private firstTimePlayShowTutorail(){
		if( localStorage.getItem( "Blackout" ) ) return;
		else{
			localStorage.setItem( "Blackout", "true" );
			this.dispatchEvent( new egret.Event( "new_game_tutorail" ) );
		}
	}

	private ballAndPassStatus( event: egret.TouchEvent ){
		let currentVs: boolean = this.passBallBar.visible;
		this.passBallBar.visible = !currentVs;
		this.ballArea.visible = currentVs;
		this.countDown.visible = currentVs;
	}

	protected buyRealCard( multiplier ){
		MultiServer.buyCard( 1, multiplier );
		MultiServer.buyCardCallback = this.buyCardCallback.bind( this );
		MultiServer.existCardCallback = null;
	}

	protected getRoomVariables( varName: string, varValue: any ){
		if( varName == "timePlan" && varValue.isLocked == true ){
			alert( "the room is locked" );
		}
		if( varName == "cardPrice" ) MultiPlayerMachine.cardPrice = varValue;
		if( varName == "cardPrize" ) MultiPlayerMachine.cardPrize = varValue;
		if( varName == "enterGameState" ) this.enterGameState = varValue;
		if( varName == "ballSpeed" ) Blackout.ballSpeed = varValue;
		if( !this.inited ) return;
		switch( varName ){
			case "calledBingoNumbers":
				throw new Error( "wrong ball item" );
			case "countDown":
				this.countDown.countDownText( varValue );
				break;
			case "timePlan":
				// this.onTimePlan( varValue.isLocked );
				break;
			case "gamePattern":
				this.getRoundPattens( varValue );
				break;
			case "gameState":
				if( varValue == "idle" ) this.getFinalWinner();
				else if( varValue == "PLAYING" ) this.onTimePlan( false );
				break;
			case "awardByPlayer":
				this.roundEndAwardDatas( varValue );
				break;
			case "pointsByPlayer":
				this.roundEndPlayerList( varValue );
				break;
		}
	}

	private blackoutBall( varValue: Array<Object> ){
		if( !this.currentBallIndex ){
			let balls: Array<number> = this.calledBingoNumbers( varValue );
			this.passBallBar.getBalls( balls );
			this.ballArea.runBalls( balls );
			this.ballArea.stopBallRunning();
			this.countDown.count();
		}
		else{
			this.ballArea.runExtra( varValue[varValue.length-1]["lastBall"] );
			this.passBallBar.getBall( varValue[varValue.length-1]["lastBall"] );
			this.countDown.count();
		}
		if( MuLang.language == "en" ) SoundManager.play( varValue[varValue.length-1]["lastBall"] + "_mp3" );
		else SoundManager.play( "mara_sound_" + MuLang.language + "_" + varValue[varValue.length-1]["lastBall"] + "_mp3" );
	}

	protected onSelectNumber( data: Object ){
		if( data["userId"] == PlayerConfig.player("user.id") ){
			if( this.energyBar )this.energyBar.showEnergy( data );
			this.scoreTex.text = "" + data["points"];
			if( !this.gold )this.resetGameTime( data["timeLeft"] );
			this.pointChangeAnimation( data["currentPoints"] );

			if( data["powerupId"] ) SoundManager.play( "blackout_powerup_mp3" );
			else SoundManager.play( "blackout_select_number_mp3" );
		}

		this.otherPlayers.selectNumber( data );
	}

	private pointChangeAnimation( currentPoints: number ){
		if( currentPoints > 0 ){
			let currentScoreTex: egret.TextField = Com.addTextAt( this, 640, 195, 94, 25, 25, false, true );
			currentScoreTex.text = "+" + currentPoints;
			currentScoreTex.textColor = 0xFFCF01;
			TweenerTool.tweenTo( currentScoreTex, {y: 180, alpha: 0.2}, 800, 0, MDS.removeSelf.bind( this, currentScoreTex ) );
		}
		else if( currentPoints < 0 ){
			let currentScoreTex: egret.TextField = Com.addTextAt( this, 640, 245, 94, 25, 25, false, true );
			currentScoreTex.text = "" + currentPoints;
			currentScoreTex.textColor = 0xFF0101;
			TweenerTool.tweenTo( currentScoreTex, {y: 260, alpha: 0.2}, 800, 0, MDS.removeSelf.bind( this, currentScoreTex ) );
		}
	}

	protected buyCardCallback( data: Array<Object> ){
		MultiServer.buyCardCallback = null;
		MultiServer.onBlackoutBallCallback = this.blackoutBall.bind(this);

		let cards: Array<MultiPlayerCard> = this.cardArea.cards;

		for( let i: number = 0; i < cards.length; i++ ){
			if( data.length > i ) {
				cards[i].enabled = true;
				cards[i].visible = true;
				cards[i].getNumbers( data[i]["numbers"] );
				let freeGrids: Array<number> = data[i]["free"];
				for( let j: number = 0; j < freeGrids.length; j++ ){
					( cards[i] as BlackoutCard ).setFree( freeGrids[j] );
				}
				( cards[i] as BlackoutCard ).uuid = data[i]["uuid"];
			}
			else{
				cards[i].enabled = false;
			}
		}

		this.waitingForStart = true;
		this.exitCardPlaying = false;
		this.countDown.countProgress = 1;
	}

	protected startPlay(){
		this.cardArea.clearCardsStatus();
		this.ballArea.clearBalls();
		this.dispatchEvent( new egret.Event( "onGamePlay" ) );
		this.bingoButton.enable = false;

		let cards: Array<MultiPlayerCard> = this.cardArea.cards;
		for( let i: number = 0; i < cards.length; i++ ){
			if( cards[i].enabled ){
				cards[i].visible = true;
			}
		}

		SoundManager.play( "mpb_round_start_mp3" );

		this.waitingForStart = false;
		this.resetGameTime( this.timeLeft );
	}

	protected useEnergy( event: egret.Event ){
		MultiServer.blackPowerUp( event.data["name"], event.data["id"] );
	}

	protected onPoworup( data: Object ){
		if( !data || !data["state"] ) return;

		if( data["userId"] == PlayerConfig.player( "user.id" ) ){
			if( data["powerUpType"] == BlackoutEnergy.FREEZE_TIME ){
				this.freezeUI.freeze();
				this.resetGameTime( data["timeLeft"] );
				SoundManager.play( "blackout_freeze_mp3" );
				if( !this.passBallBar.visible ){
					this.ballAndPassStatus( null );
					this.freezeChangeBallPassStatus = true;
				}
			}
			else if( data["powerUpType"] == BlackoutEnergy.DOUBLE_POINTS ){
				this.scoreBg.visible = true;
				this.scoreBg.alpha = 0;
				this.doublePointTime = egret.getTimer();
				TweenerTool.tweenTo( this.scoreBg, { alpha: 1 }, 2000, 0 );
				let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "double_fire", 615 - 20, 207 - 11 );
				mc.play( 1 );
				TweenerTool.tweenTo( mc, {alpha: 0}, 500, 2200, MDS.removeSelf.bind( mc, mc ) );
				SoundManager.play( "blackout_double_mp3" );
			}
			else if( data["powerUpType"] == BlackoutEnergy.EXTEND_TIME ){
				this.resetGameTime( data["timeLeft"] );
				this.extendTime();
				SoundManager.play( "blackout_time_mp3" );
			}
			else if( data["powerUpType"] == BlackoutEnergy.MANUAL_MARK ){
				Blackout.markingState = data["powerUpId"];
				SoundManager.play( "blackout_star_mp3" );
			}
			else if( data["powerUpType"] == BlackoutEnergy.CHOOSE_ONE_FROM_MULTI ){
				this.gold = new BlackoutGold( data["luckNumbers"], this.ballArea as BlackoutBallLayer, data["powerUpId"] );
				this.addChild( this.gold );
				this.gold.addEventListener( "chooseBall", this.onBallChoosed, this );

				this.resetGameTime( data["timeLeft"] );
				SoundManager.play( "blackout_gold_mp3" );
			}
			if( data["luckFeatures"] ) this.energyBar.showEnergy( data );
		}

		if( this.otherPlayers )this.otherPlayers.powerUp( data );
	}

	protected triggerpowerUp( data: Object ){
		if( data["powerUpType"] == "manualMark" ){
			this.getResultListToCheck();
		}
	}

	private onBallChoosed( event: egret.Event ): void{
		this.gold.showResult( event.data, this.cardArea );

		let ballNum: number = parseInt( event.data.name );
		this.ballArea.runExtra( ballNum );
		MultiServer.blackoutGoldTriggerPowerUp( BlackoutEnergy.CHOOSE_ONE_FROM_MULTI, ballNum, event.target["powerUpId"] );
	}

	private checkGoldBallProcess(): boolean{
		if( this.gold ){
			if( egret.getTimer() - this.roundStartTime > 7000 ){
				if( this.gold && this.contains( this.gold ) ) this.removeChild( this.gold );
				this.gold = null;
				if( this.resultBar ){
					let resultBarIndex: number = this.getChildIndex(this.resultBar);
					if( resultBarIndex >= 0 ) this.addChildAt( this.cardArea, resultBarIndex );
					else this.addChild(this.cardArea);
				}
				else this.addChild(this.cardArea);
				this.resetGameTime( this.timeLeft );
			}
			return true;
		}
		return false;
	}

	private checkDoublePoint(){
		if( this.scoreBg && this.scoreBg.visible ){
			if( egret.getTimer() - this.doublePointTime > 5000 ){
				this.scoreBg.visible = false;
			}
		}
	}

	protected existCard( data: Object ){
		MultiServer.existCardCallback = null;
		
		if( this.waitingBar ){
			if( data["cards"] ){
				if( this.enterGameState == "idle" ){
					this.waitingBar.existCardIdle( data["selected_multi"], data["amount"] );
					this.waitingBar.hideBottomBtns();
					this.buyCardCallback( data["cards"] );
				}
				else if( this.enterGameState == "PLAYING" ){
					this.exitCardPlaying = true;
					this.buyCardCallback( data["cards"] );
					this.currentBallIndex = 0;
					this.getRoundPattens( MultiServer.multiPlayerPattens );
					MultiPlayerMachine.oneCardPrize = MultiPlayerMachine.cardPrize * MultiServer.userMultiplier * data["amount"];
					this.startPlay();
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
	}

	private addFreeze(){
		let bg: egret.Bitmap = this.getChildByName(this.assetStr("bg")) as egret.Bitmap;
		let freezeBg: egret.Bitmap = Com.addBitmapAt(this, this.assetStr("freez_bg"), 0, 0);
		this.addChildAt(freezeBg, this.getChildIndex(bg) + 1 );
		this.freezeUI = new BlackoutFreezeUI( freezeBg );
		this.freezeUI.addEventListener( "endFreeze", this.onFreezeEnd, this );
		this.addChild( this.freezeUI );
	}

	private onFreezeEnd(){
		this.resetGameTime( this.timeLeft );
		if( this.freezeChangeBallPassStatus && this.passBallBar.visible ){
			this.ballAndPassStatus( null );
			this.freezeChangeBallPassStatus = false;
		}
	}

	protected callBingo( data: Object ){
		trace( data )
		if( data["userId"] == PlayerConfig.player("user.id") ){
			this.scoreTex.text = "" + data["points"];
			this.markCards( data["patternsByUUID"] );
			BlackoutPaytableGot.getNew( data["patternsByUUID"] );
			this.bingoButton.enable = false;
			this.pointChangeAnimation( data["currentPoints"] );
		}
		this.otherPlayers.callBingo( data );
	}

	private markCards( patternsByUUID: Array<Object> ){
		let cards: Array<MultiPlayerCard> = this.cardArea.cards;
		for( let i: number = 0; i < patternsByUUID.length; i++ ){
			for( let j: number = 0; j < cards.length; j++ ){
				if( cards[j].uuid == patternsByUUID[i]["uuid"] ){
					( cards[j] as BlackoutCard ).markCard( patternsByUUID[i]["patterns"] );
					break;
				}
			}
		}
	}

	private roundEndPlayerList( playerList: Array<Object> ){
		for( let i: number = 0; i < playerList.length; i++ ){
			if( playerList[i]["userId"] == PlayerConfig.player( "user.id" ) ){
				this.buildResult();
				this.resultBar.setList( playerList );
				break;
			}
		}
	}

	private roundEndAwardDatas( awardInfo: Object ){
		setTimeout( this.delayShowResult.bind( this ), 100, awardInfo );
	}

	private delayShowResult( awardInfo: Object ){
		this.resultBar.setAward( awardInfo );
	}

	private buildResult(){
		if( !this.resultBar ){
			this.resultBar = new BlackoutResult( this.otherPlayers.otherPlayerInfo );
			this.addChild( this.resultBar );
			this.resultBar.addEventListener( "closeResultBar", this.resultClose, this );
			SoundManager.play( "blackout_round_over_mp3" );
		}
	}

	private resultClose( event: egret.Event ){
		this.resultBar.removeEventListener( "closeResultBar", this.resultClose, this );
		this.removeChild( this.resultBar );
		this.resultBar = null;
		MultiServer.leaveRoom();
		this.addChild( this.preBuyCardBar );
		SoundManager.play( "blackout_bgm_mp3", true );
		this.preBuyCardBar.addLastRecord();
		SFSConnector["joinRoomCallback"] = this.rejoinRoom.bind(this);

		this.resetCardsStatus();
		BlackoutPaytableGot.clear();
		this.passBallBar.clear();
		this.bingoButton.enable = false;
		Blackout.markingState = null;
		if( this.passBallBar.visible ) this.ballAndPassStatus( null );
	}

	private rejoinRoom(){
		if( this.contains( this.preBuyCardBar ) ) this.removeChild( this.preBuyCardBar );

		this.currentBallIndex = 0;
		this.scoreTex.text = "0";
		this.cardArea.clearCardsStatus();
		this.ballArea.clearBalls();
		this.energyBar.clearSkills();
		this.otherPlayers.clearPlayers();
		this.otherPlayers.getRoomMate();

		SoundManager.play( "blank_sound_mp3", true );
	}

	protected otherJoinRoom( userName: string, fbId: string, userId: string ){
		this.otherPlayers.addUser( userName, fbId, userId );
	}

	public static joinedRoomData: Object;

	public pastJoinedRoomData( data: Object ){
		trace( data )
		Blackout.joinedRoomData = data;
	}

	public markGrid( event: egret.Event ){
		let pt: egret.Point = this.cardArea.positionOnCard( event.target.cardId, event.data );
		let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "star_down", pt.x + 15, pt.y - 185 );
		mc.play( 1 );
		TweenerTool.tweenTo( mc, { alpha: 0 }, 200, 1500, MDS.removeSelf.bind( mc, mc ) );
		let star: egret.Bitmap = Com.addBitmapAtMiddle( this, this.assetStr("star"), pt.x + 45, pt.y - 185 );
		star.scaleX = star.scaleY = 0.1;
		TweenerTool.tweenTo( star, { scaleX: 1.1, scaleY: 1.1, x: pt.x + 45, y: pt.y + 37.5 }, 500, 0, this.continueStar.bind( this, star ) );
	}

	private continueStar( star: egret.Bitmap ){
		TweenerTool.tweenTo( star, { scaleX: 1, scaleY: 1 }, 100, 1100, MDS.removeSelf.bind( star, star ) );
	}

	private extendTime(){
		let addtimeTex: egret.TextField = Com.addTextAt( this, 660, 135, 94, 25, 25, false, true );
		addtimeTex.textColor = 0xCFF4FD;
		addtimeTex.text = "   +10";
		TweenerTool.tweenTo( addtimeTex, { alpha: 1, y: 120 }, 600, 0, MDS.removeSelf.bind( this, addtimeTex ), { alpha: 0.4 }, egret.Ease.circOut );

		let addTimeBig: egret.Sprite = new egret.Sprite;
		let addtimeTexBig: egret.TextField = Com.addTextAt( addTimeBig, 0, BrowserInfo.textUp, 300, 30, 24, false, true );
		addtimeTexBig.verticalAlign = "middle";
		addtimeTexBig.text = MuLang.getText("time_bosst", 1).replace( "[T]", "10" );
		GraphicTool.drawRect( addTimeBig, new egret.Rectangle( 300 - addtimeTexBig.textWidth >> 1, 0, addtimeTexBig.textWidth, 30 ), 0x5BC6C2, false, 1, 10 );
		Com.addObjectAt( this, addTimeBig, 227, 340 );
		addTimeBig.alpha = 0.2;
		TweenerTool.tweenTo( addTimeBig, { y: 285, alpha: 1 }, 300, 0, this.extendTimeStep2.bind( this, addTimeBig ), null, egret.Ease.circOut );
	}

	private extendTimeStep2( addTimeBig: egret.Sprite ){
		TweenerTool.tweenTo( addTimeBig, { y: 230, alpha: 0.2 }, 300, 200, MDS.removeSelf.bind( addTimeBig, addTimeBig ), null, egret.Ease.circIn );

		let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "time_clock", 755, 0 );
		mc.stop();
		mc.alpha = 0;
		TweenerTool.tweenTo( mc, { x: 755 - 192 >> 1, y: 600 - 194 >> 1, alpha: 1 }, 400, 500, this.extendTimeStep3.bind( this, mc ) );
	}

	private extendTimeStep3( mc: egret.MovieClip ){
		mc.play( 1 );
		TweenerTool.tweenTo( mc, { alpha: 0 }, 100, 500, MDS.removeSelf.bind( mc, mc ) );
	}

	private timeBreath(){
		let targetScale: number = 1;
		if( this.timeLeft > 0 && this.timeLeft <= 30 ) {
			if( this.timeTex.scaleX < 1.02 ) targetScale = 1.06;
		}
		if( !this.stage ) return;
		TweenerTool.tweenTo( this.timeTex, { scaleX: targetScale, scaleY: targetScale }, 600, 0, this.timeBreath.bind(this) );
	}
}
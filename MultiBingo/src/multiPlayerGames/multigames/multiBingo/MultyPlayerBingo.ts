class MultyPlayerBingo extends Multi75Super{

	protected static get classAssetName(){
		return "multiPlayerBingo";
	}

    protected static get animationAssetName(){
		return "multiPlayerBingoAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "multiPlayerBingo.conf", assetsPath );
		this.languageObjectName = "multiPlayerBingo_tx";

		this.connetKeys = { zona: "MultiplayerZone", sala: "Multi67" };

		this.ballArea = new MultiBingoBallLayer;

		MultiCardLayer.cardType = MultiPlayerBingoCard;
		MultiCardLayer.gridType = MultiPlayerBingoGrid;
		MultiPlayerCard.useRedEffect = false;

		CardGridUISettings.zeroUIName = "12";

		CardGridColorAndSizeSettings.defaultNumberSize = 55;
	}

	protected init(){
        super.init();

		this.ballCountText = MDS.addGameText( this, 300, 274, 40, 0xFFFFFF, "ball", false, 165 );
		this.ballCountText.textAlign = "center";
		this.ballCountText.text = "";
		MDS.addGameText( this, 300, 327, 40, 0xFFFFFF, "ball", false, 165 ).textAlign = "center";

		this.letsWait();
	}

/************************************************************************************************************************************************/

	private energyBar: MultiPlayerEnergy;

	private luckyBall: egret.DisplayObjectContainer;

	public static callBingoTimes: number;
	public static powerUpTimes: number;
	public static openBoxTimes: number;
	public static powerUpCoins: number;

	private exitCardPlaying: boolean;

	protected letsWait(): void{
		this.setCardDatasWithNumeros(MDS.fakeArr(100));

		let bg: egret.Bitmap = this.getChildByName( this.assetStr( "BG2" ) ) as egret.Bitmap;
		bg.texture = RES.getRes( "multiBingo_bg_png" );

		let cards: Array<MultiPlayerCard> = this.cardArea.cards;
		for( let i: number = 0; i < cards.length; i++ ){
			cards[i].visible = false;
			cards[i].enabled = false;
			cards[i].addEventListener( "checkMultiBingo", this.checkMultiBingo, this );
		}

		this.dispatchEvent( new egret.Event( "connected_to_server" ) );

		this.currentBallIndex = 0;
		this.recordPaytalbes();

		this.energyBar = new MultiPlayerEnergy;
		Com.addObjectAt( this, this.energyBar, 293, 656 );
		this.energyBar.addEventListener( "useEnergy", this.useEnergy, this );

		this.bingoInfo = new MultiPlayerBingoInfoBar;
		Com.addObjectAt( this, this.bingoInfo, 1503, 246 );

		this.dailogLayer = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.dailogLayer, 0, 0 );

		this.chatAndMiniGameLayer = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.chatAndMiniGameLayer, 0, 0 );

		this.buildWaitingBar();

		this.chatBar = new MultiPlayerBingoChatBar;
		Com.addObjectAt( this.chatAndMiniGameLayer, this.chatBar, 1500, 588 );

		Com.addDownButtonAt( this, this.assetStr( "power_up_info" ), this.assetStr( "power_up_info" ), 1565, 123, this.showHelp, true );
	}

	protected buildWaitingBar(){
		this.waitingBar = new MultiPlayerBingoWaitingBar;
		this.dailogLayer.addChild( this.waitingBar );
		this.waitingBar.addEventListener( "waitingBarBuyCard", this.onBuyCard, this );
	}

	protected onBuyCard( event: egret.Event ){
		if( this.gameCoins < event.data.amount * event.data.multiple * MultiPlayerMachine.cardPrice * MultiServer.userMultiplier ){
			this.dispatchEvent(new egret.Event("out_of_coins_game_id"));
			return;
		}
		MultiServer.buyCard( event.data.amount, event.data.multiple );
		MultiServer.buyCardCallback = this.buyCardCallback.bind( this );
		this.waitingBar.hideBottomBtns();
		MultiServer.existCardCallback = null;
	}

	protected onRoundEndContinue( event: egret.Event ){
		if( this.roundEndBar ){
			if( this.contains( this.roundEndBar ) )this.removeChild( this.roundEndBar );
			this.roundEndBar.removeEventListener( "roundEndBarContinue", this.onRoundEndContinue, this );
			this.roundEndBar = null;
		}
		if( this.bingoPlayerHeadsContainer && this.contains( this.bingoPlayerHeadsContainer ) ){
			this.removeChild( this.bingoPlayerHeadsContainer );
		}
		this.resetCardsStatus();
		this.buildWaitingBar();

		this.clearLuckyBall();

		this.hideBallForWinPanel( false );
	}

	private clearLuckyBall(){
		if( this.luckyBall ){
			if( this.luckyBall.parent ) this.luckyBall.parent.removeChild( this.luckyBall );
			this.luckyBall = null;
		}
	}

	protected getRoomVariables( varName: string, varValue: any ){
		if( varName == "timePlan" && varValue.isLocked == true ){
			alert( "the room is locked" );
		}
		if( varName == "cardPrice" ) MultiPlayerMachine.cardPrice = varValue;
		if( varName == "cardPrize" ) MultiPlayerMachine.cardPrize = varValue;
		if( varName == "enterGameState" ) this.enterGameState = varValue;
		if( !this.inited ) return;
		switch( varName ){
			case "calledBingoNumbers":
				if( !this.currentBallIndex ){
					let balls: Array<number> = this.calledBingoNumbers( varValue );
					this.ballArea.runBalls( balls );
					this.ballArea.stopBallRunning();
				}
				else{
					this.ballArea.runExtra( varValue[varValue.length-1]["lastBall"] );
				}
				if( this.inPlayerRound ) SoundManager.play( varValue[varValue.length-1]["lastBall"] + "_mp3" );
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
		}
	}

	protected onSelectNumber( data: Object ){
		if( this.energyBar )this.energyBar.showEnergy( data );
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
					( cards[i] as MultiPlayerBingoCard ).setFree( freeGrids[j] );
				}
				( cards[i] as MultiPlayerBingoCard ).uuid = data[i]["uuid"];
				if( !this.exitCardPlaying )( cards[i] as MultiPlayerBingoCard ).setCoinBoxs( data[i]["coinsNumber"] );
			}
			else{
				cards[i].enabled = false;
			}
		}

		if( data.length == 1 ){
			cards[0].scaleX = cards[0].scaleY = 1.4;
		}
		else{
			cards[0].scaleX = cards[0].scaleY = 0.7;
		}

		this.waitingForStart = true;
		this.exitCardPlaying = false;
	}

	protected startPlay(){
		this.cardArea.clearCardsStatus();
		this.ballArea.clearBalls();
		this.dispatchEvent( new egret.Event( "onGamePlay" ) );

		this.removeWaitingBar();
		this.bingoInfo.startShowPaytalbe();

		let cards: Array<MultiPlayerCard> = this.cardArea.cards;
		for( let i: number = 0; i < cards.length; i++ ){
			if( cards[i].enabled ){
				cards[i].visible = true;
				( cards[i] as MultiPlayerBingoCard ).flyBox();
			}
		}

		SoundManager.play( "mpb_round_start_mp3" );

		MultyPlayerBingo.callBingoTimes = 0;
		MultyPlayerBingo.powerUpTimes = 0;
		MultyPlayerBingo.openBoxTimes = 0;
		MultyPlayerBingo.powerUpCoins = 0;

		this.waitingForStart = false;

		this.bingoInfo.resetWinText( this.cardArea.enabledCards );
	}

	protected useEnergy( event: egret.Event ){
		MultiServer.powerUp( event.data );
		MultiServer.powerUpCallback = this.onPoworup.bind(this);
	}

	protected onPoworup( data: Object ){
		MultiServer.powerUpCallback = null;
		trace( data );
		if( !data || !data["state"] ) return;

		if( data["powerUpType"] == MultiPlayerBingoGrid.AWARDTYPE_COINSBALL ){
			this.clearLuckyBall();
			this.luckyBall = new egret.DisplayObjectContainer;
			Com.addObjectAt( this, this.luckyBall, 366, 607 );
			Com.addBitmapAtMiddle( this.luckyBall, this.assetStr("lucky_ball"), 0, 0 );
			let txt: egret.TextField = Com.addTextAt(this, -32, -32, 64, 64, 55, true, false);
			this.luckyBall.addChild( txt );
			txt.verticalAlign = "middle";
			txt.fontFamily = "Righteous";
			txt.stroke = 1;
			txt.text = "" + data["luckyBall"];
			this.luckyBall.name = "" + data["luckyBall"];

			TweenerTool.tweenTo( this.luckyBall, { y: 475 }, 200 );
		}
		else if( data["powerUpType"] == MultiPlayerBingoGrid.AWARDTYPE_MARKNUMBER || data["powerUpType"] == MultiPlayerBingoGrid.AWARDTYPE_COINSAWARDTHREE ){
			for( let i: number = 0; i < data["cards"].length; i++ ){
				for( let j: number = 0; j < this.cardArea.cards.length; j++ ){
					if( this.cardArea.cards[j].enabled && ( this.cardArea.cards[j] as MultiPlayerBingoCard ).uuid == data["cards"][i]["uuid"] ){
						let iconStr: string = data["powerUpType"] == MultiPlayerBingoGrid.AWARDTYPE_MARKNUMBER ? "12_alpha" : "36";
						let arr: Array<number> = data["cards"][i]["indexes"];
						for( let k: number = 0; k < arr.length; k++ ){
							let powerUpIcon: egret.Bitmap = Com.addBitmapAt( this, this.assetStr( iconStr ), 10, 235 );
							let cardIndex: number = j;
							let gridIndex: number = arr[k];
							let pos: egret.Point = this.cardArea.positionOnCard( cardIndex, gridIndex );
							TweenerTool.tweenTo( powerUpIcon, { x: pos.x, y: pos.y }, 300, 0, MDS.removeSelf.bind( this, powerUpIcon ) );
						}
						setTimeout( ( this.cardArea.cards[j] as MultiPlayerBingoCard ).setCoinsAward.bind(this.cardArea.cards[j], data["cards"][i]["indexes"], data["powerUpType"] ), 300 );
					}
				}
			}
		}
	}

	protected triggerpowerUp( data: Object ){
		let coins: number = data["coins"];
		if( coins > 0 ){
			MultyPlayerBingo.powerUpCoins += coins;

			let type: string = data["powerUpType"];
			if( type == "coinsBox" || type == "coinsAwardThree" && data["statusCode"] == 0 ){
				let uuid: string = data["uuid"];
				let gridIndex: number = data["numberIdx"];
				this.showGetCoinsOnCard( uuid, gridIndex, Math.floor( coins * MultiPlayerMachine.oneCardPrize / MultiPlayerMachine.cardPrize ) );
			}
			else if( type == "coinsBall" ){
				MDS.dropCoinsAt( this, new egret.Point( 10, 150 ), Math.floor( coins * MultiPlayerMachine.oneCardPrize / MultiPlayerMachine.cardPrize ) );
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

	protected showLastBall( ballIndex: number ): void{
		super.showLastBall( ballIndex );
		if( this.luckyBall && this.luckyBall.name == "" + ballIndex ){
			MultiServer.triggerPowerUp( MultiPlayerBingoGrid.AWARDTYPE_COINSBALL );
			this.clearLuckyBall();
		}
	}

	protected checkMultiBingo( event: egret.Event ){
		super.checkMultiBingo( event );

		let cardIndex: number = this.cardArea.cards.indexOf( event.target );
		let gridIndex: number = event.data;
		this.powerUpAnimation( cardIndex, gridIndex );
	}

	private powerUpAnimation( cardIndex: number, gridIndex: number ): void{
		let pos: egret.Point = this.cardArea.positionOnCard( cardIndex, gridIndex );
		let charger: egret.Bitmap = Com.addBitmapAt( this, this.assetStr( "charger-icon" ), pos.x, pos.y );
		let tw: egret.Tween = egret.Tween.get( charger );
		tw.to( { x: 300, y: 537 }, 400, egret.Ease.sineIn );
		tw.call( this.endPowerLight.bind( this ) );
		tw.to( { alpha: 0 }, 133 );
		tw.call( MDS.removeSelf.bind( this, charger ) );
	}

	private endPowerLight(){
		let light1: egret.Bitmap = Com.addBitmapAt( this, this.assetStr( "bg light" ), 365, 607 );
		let light2: egret.Bitmap = Com.addBitmapAt( this, this.assetStr( "bg light" ), 365, 607 );
		light2.anchorOffsetX = light1.anchorOffsetX = 91;
		light2.anchorOffsetY = light1.anchorOffsetY = 54;
		light2.scaleY = light1.scaleY = light2.scaleX = light1.scaleX = 2;
		TweenerTool.tweenTo( light1, { rotation: 360 }, 500, 0, MDS.removeSelf.bind( this, light1 ), null, egret.Ease.sineInOut );
		TweenerTool.tweenTo( light2, { rotation: -360 }, 500, 0, MDS.removeSelf.bind( this, light2 ), null, egret.Ease.sineInOut );
	}

	protected getFinalWinner(){
		super.getFinalWinner();

		if( !this.inPlayerRound ) return;

		this.showBingoHeads( this.bingoPlayerHeads );
		this.roundEndBar = new RoundEndBar;
		this.addChild( this.roundEndBar );
		this.roundEndBar.addEventListener( "roundEndBarContinue", this.onRoundEndContinue, this );
		this.bingoPlayerHeads = [];

		this.hideBallForWinPanel( true );

		SoundManager.play( "mpb_round_end_mp3" );
	}

	private hideBallForWinPanel( hide: boolean ){
		this.energyBar.visible = !hide;
		this.ballArea.visible = !hide;
		this.getChildByName( this.assetStr( "charger bar" ) ).visible = !hide;
		this.getChildByName( this.assetStr( "chargerbar_01_bg" ) ).visible = !hide;
	}

	private bingoPlayerHeads: Array<string> = [];
	private bingoPlayerHeadsContainer: egret.DisplayObjectContainer;

	protected callBingo( data: Object ){
		super.callBingo( data );
		this.bingoPlayerHeads.push( data["fbId"] );
	}

	private showBingoHeads( heads: Array<string> ){
		this.bingoPlayerHeadsContainer = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.bingoPlayerHeadsContainer, 20, 240 );
		Com.addBitmapAt( this.bingoPlayerHeadsContainer, this.assetStr( "alphaBg" ), 0, 0 );
		let winnerTitle: egret.Bitmap = Com.addBitmapAt( this.bingoPlayerHeadsContainer, this.assetStr( "bingo_winner" ), 32, 60 );
		winnerTitle.width = 440;
		winnerTitle.height = 72;
		for( let i: number = 0; i < heads.length; i++ ){
			let userHead: egret.Bitmap;
			if( i >= 15 ) break;
			let offsetX: number = 140 * ( i % 3 );
			let offsetY: number = Math.floor( i / 3 ) * 140;
			Com.addBitmapAt( this.bingoPlayerHeadsContainer, this.assetStr( "bingo_winner_bg" ), 64 + offsetX, 166 + offsetY );
			userHead = Com.addBitmapAt( this.bingoPlayerHeadsContainer, this.assetStr( "head_icon" ), 77 + offsetX, 179 + offsetY );
			userHead.width = userHead.height = 100;
			if( heads[i] != "" ){
				FacebookBitmap.downloadBitmapDataByFacebookID( heads[i], 100, 100, MDS.onUserHeadLoaded.bind( this, userHead, 100 ), this );
			}
		}
		this.bingoPlayerHeadsContainer.cacheAsBitmap = true;
	}
}
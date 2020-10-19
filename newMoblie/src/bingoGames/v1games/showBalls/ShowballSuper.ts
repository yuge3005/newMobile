class ShowballSuper extends V1Game{

	protected showballLogo: egret.Bitmap;

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super( gameConfigFile, configUrl, gameId );
		this.languageObjectName = "showball3_tx";

		GameCard.showTitleShadow = new egret.GlowFilter( 0, 1, 4, 4, 4, 2 );
		GameCard.gridOnTop = true;

		CardManager.cardType = ShowballCard;
		CardManager.gridType = ShowballGrid;

		CardGrid.defaultNumberSize = 60;

		this.needSmallWinTimesOnCard = true;
		this.ballArea.needLightCheck = true;
		
		// this.needListenToolbarStatus = true;

		PayTableManager.bingoPaytableName = "pt_bingo";
		PaytableUI.textBold = true;
	}

	protected init(){
		super.init();

		this.showNoBetAndCredit();

		// this.showTipStatus();

		this.ganhoCounter = new GanhoCounter( this.showWinAnimationAt.bind( this ) );
	}

	protected buildBallCountText(){
		let ballText: TextLabel = MDS.addGameTextCenterShadow( this, 1603, 52, 32, 0x0, "ball", false, 125, true, false );
		ballText.fontFamily = "Righteous";

		this.ballCountText = MDS.addGameTextCenterShadow( this, 1603, 85, 100, 0x88FF88, "ball", false, 125, true, false );
		this.ballCountText.fontFamily = "Righteous";
		this.ballCountText.text = "";
	}

	protected showLastBall( ballIndex: number ): void{
		super.showLastBall( ballIndex );
		this.showLastBallAt( ballIndex, 0, 0 );

		let ballLotto: egret.MovieClip = this.getChildByName( this.assetStr("showball_bolas") ) as egret.MovieClip;
		if( ballLotto.visible ){
			ballLotto.stop();
			ballLotto.visible = false;
		}

		this.playSound("shb_ball_mp3");
	}

	protected showLastBallAt( ballIndex: number, x: number, y: number, scale: number = 1 ): void{
		if( this.runningBallUI && ( this.runningBallContainer ).contains( this.runningBallUI ) ){
			( this.runningBallContainer ).removeChild( this.runningBallUI );
		}
		this.runningBallUI = this.ballArea.getABigBall( ballIndex );
		Com.addObjectAt( this.runningBallContainer, this.runningBallUI, x, y );
	}

	protected collectExtraBall(): void {
		this.clearHeartAnimation();
	}

	protected clearRunningBallUI(): void{
		super.clearRunningBallUI();
		this.ballCountText.text = "";
		let ballLotto: egret.MovieClip = this.getChildByName( this.assetStr("showball_bolas") ) as egret.MovieClip;
		ballLotto.play();
		ballLotto.visible = true;
	}

	// protected tipStatus( event: egret.Event ): void{
	// 	switch( event["status"] ){
	// 		case "play":
	// 			this.showShuffling();
	// 			break;
	// 		case "extra":
	// 			this.showExtraPrice( event["extraPrice"] );
	// 			break;
	// 		case "ready":
	// 			this.showPressPlay();
	// 			break;
	// 	}
	// }

	private extraBallText: egret.TextField;
	private creditTipText: egret.TextField;
	private extraPriceText: egret.TextField;

	private showTipStatus(): void{
		this.extraBallText = Com.addTextAt( this, 30, 130, 97, 18, 15, true );
		this.extraBallText.textColor = 0xFFFF00;
		this.extraBallText.text = MuLang.getText("extra ball");
		this.creditTipText = Com.addTextAt( this, 30, 170, 97, 18, 12, true );
		this.creditTipText.textColor = 0xFFFF00;
		this.creditTipText.text = MuLang.getText("credit");
		this.extraPriceText = Com.addTextAt( this, 30, 147, 97, 20, 18, true );
		this.extraPriceText.verticalAlign = "middle";

		this.showPressPlay();
	}

	protected onRemove( event: egret.Event ): void{
		super.onRemove( event );
	}

	private showPressPlay(): void{
		this.isShowingExtra( false );
	}

	private showShuffling(): void{
		this.isShowingExtra( false );
	}

	protected showExtraPrice( price: number ): void{
		this.isShowingExtra( true );
		this.extraPriceText.text = Utils.formatCoinsNumber( price );
	}

	private isShowingExtra( isShow: boolean ): void{
		this.extraBallText.visible = isShow;
		this.creditTipText.visible = isShow;
		this.extraPriceText.visible = isShow;
	}

	protected afterCheck( resultList: Array<Object> ): void{
		super.afterCheck( resultList );

		if( !this.inLightCheck ){
			if( PaytableResultListOprator.missOneCounter( resultList, "pt_bingo" ) ){
				this.showHeart();
                this.playSound("shb_1to_bingo_mp3", -1);
			}
		}

		this.ganhoCounter.countGanhoAndPlayAnimation(resultList);
	}

	protected showWinAnimationAt(cardId: number, win: number): void{
        ( CardManager.cards[cardId] as ShowballCard ).showWinCount( win * GameData.currentBet );
    }

	protected changeNumberSound(): void {
		this.clearCardWinTimes();
		this.playSound("shb_card_mp3");
	}

	protected startPlay(): void {
		super.startPlay();
		this.clearCardWinTimes();
	}

	protected onBetChanged( event: egret.Event ): void{
		super.onBetChanged( event );
        this.clearCardWinTimes();
		if (event.data["type"] !== 0) this.playSound("shb_bet_mp3");
	}

	private clearCardWinTimes(): void{
		for( let i: number = 0; i < CardManager.cards.length; i++ ){
			( CardManager.cards[i] as ShowballCard ).showWinCount( 0 );
		}
	}

	protected showSmallWinResult( cardIndex: number, blinkGrids: Object ): void{
		this.paytableRuleFilter( blinkGrids );

		super.showSmallWinResult( cardIndex, blinkGrids );
	}

	protected paytableRuleFilter( blinkGrids ): void{
		for( let gridId in blinkGrids ){
			let blinkGridsArray: Array<string> = blinkGrids[gridId] as Array<string>;
			if( blinkGridsArray.length > 1 ){
				let newArr: Array<string> = [];
				let bingoIndex: number = blinkGridsArray.indexOf( "pt_bingo" );
				if( bingoIndex >= 0 ){
					newArr.push( "pt_bingo" );
					blinkGridsArray.length = 0;
				}

				if( blinkGridsArray.length > 1 ){
					PaytableFilter.paytableConfixFilter( blinkGridsArray );
				}
				
				blinkGrids[gridId] = newArr.concat( blinkGridsArray );
			}
		}
	}

	private heartAnimation: egret.MovieClip;

	private showHeart(): void{
		this.clearHeartAnimation();

		if( !this.heartAnimation ){
			this.heartAnimation = Com.addMovieClipAt( this, MDS.mcFactory, "showball_heart", 355, 320 );
		}
	}

	private clearHeartAnimation(): void{
		if( this.heartAnimation ){
			if( this.contains( this.heartAnimation ) )this.removeChild( this.heartAnimation );
			this.heartAnimation.stop();
			this.heartAnimation = null;
		}
	}

	public onRoundOver( data: Object ){
        super.onRoundOver( data );

		this.clearHeartAnimation();
	}

	protected roundOver(): void {
		super.roundOver();

		// this.showPressPlay();

		this.stopSound("shb_ball_mp3");
        this.stopSound("shb_1to_bingo_mp3");

		ExtraBlinkGrid.extraBink = false;
	}

	protected hasExtraBallFit(): void {
		this.stopSound("shb_ball_mp3");
		if (this.firstHaveExtraBall) {
			this.firstHaveExtraBall = false;
			this.playSound("shb_have_extra_ball_wav");
		}

		if( this.isMegaBall ){
			this.superExtraBg.visible = true;
			this.gameToolBar.megeExtraOnTop( true );

			this.tryFirstMega( new egret.Rectangle( 280, 102, 54, 54 ) );
		}

		ExtraBlinkGrid.extraBink = true;
	}

	protected getExtraBallFit(): void {
		this.playSound("shb_extra_ball_mp3");
	}

	protected winBingo(): void {
		super.winBingo();
		this.clearHeartAnimation();
	}
}
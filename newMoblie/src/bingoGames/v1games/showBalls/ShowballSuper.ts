class ShowballSuper extends V1Game{

	private winText: TextLabel;

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super( gameConfigFile, configUrl, gameId );
		this.languageObjectName = "showball3_tx";

		GameCard.showTitleShadow = new egret.GlowFilter( 0, 1, 4, 4, 4, 2 );
		GameCard.gridOnTop = true;

		CardManager.cardType = ShowballCard;
		CardManager.gridType = TowerGrid;

		CardGrid.defaultBgColor = 0xFFFFFF;
		CardGrid.defaultNumberSize = 25;

		this.needSmallWinTimesOnCard = true;
		this.ballArea.needLightCheck = true;
		
		this.needListenToolbarStatus = true;

		BallManager.ballOffsetY = 5;

		BingoBackGroundSetting.defaultScale = false;
		BingoBackGroundSetting.gameMask = new egret.Rectangle( 0, 0, 2000, 1125 );

		PayTableManager.bingoPaytableName = "pt_bingo";
	}
   
    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = this.getSoundName( paytabledName );
        if (SoundManager.soundOn && soundName !== "") {
            this.playSound(soundName, 1, callback);
        } else {
            callback();
        }
	}

	protected combinString( str: string ){
		return "card_pt_" + str;
	}

	protected init(){
		super.init();

		let t1: egret.TextField = this.addGameTextCenterShadow( 10, 13, 14, 0xFFFFFF, "credit", false, 130, true, false );
		let t2: egret.TextField = this.addGameTextCenterShadow( 10, 48, 14, 0xFFFFFF, "bet", false, 130, true, false );
		let t3: egret.TextField = this.addGameTextCenterShadow( 10, 83, 14, 0xFFFFFF, "win", false, 130, true, false );
		t1.scaleX = t2.scaleX = t3.scaleX = 1;
		t1.scaleY = t2.scaleY = t3.scaleY = 0.85;
		t1.fontFamily = t2.fontFamily = t3.fontFamily = "Arial";
		t1.stroke = t2.stroke = t3.stroke = 1;

		this.betText = this.addGameTextCenterShadow( 10, 60, 17, 0xFEFE00, "bet", false, 130, true, false );
		this.betText.scaleX = 1;
		this.betText.fontFamily = "Arial";
		this.betText.bold = true;
		this.creditText = this.addGameTextCenterShadow( 10, 25, 15, 0xFEFE00, "credit", false, 130, true, false );
		this.creditText.scaleX = 1;
		this.creditText.fontFamily = "Arial";
		this.creditText.bold = true;

		this.winText = this.addGameTextCenterShadow( 10, 97, 19, 0xFEFE00, "win", false, 130, true, false );
		this.winText.scaleX = 1;
		this.winText.fontFamily = "Arial";
		this.winText.bold = true;
		this.winText.text = "0";

		this.addGameText( 510, 20, 15, 0xFFFFFF, "ball", true, 60 ).textAlign = "center";
		let jackpotText: TextLabel = this.addGameText( 171, 120, 10, 0xFE0000, "", true, 10 );
		jackpotText.textAlign = "center";
		jackpotText.height = 105;
		jackpotText.filters = [new egret.GlowFilter( 0xFFFF00, 0.5, 4, 4, 2 )];
		this.addChildAt( jackpotText, this.getChildIndex( this.ballArea ) );
		jackpotText.text = MuLang.getText( "jackpot" );

		this.ballCountText = this.addGameText( 515, 48, 22, 0x88FF88, "ball", false, 50 );
		this.ballCountText.textAlign = "center";
		this.ballCountText.text = "";

		this.runningBallContainer = new egret.Sprite;
		Com.addObjectAt( this, this.runningBallContainer, 1395, 28 );

		this.buildSuperEbArea( "mega_" + GlobelSettings.language, 371, 8 );

		this.showTipStatus();

		this.ganhoCounter = new GanhoCounter( this.showWinAnimationAt.bind( this ) );
	}

	protected showLastBall( ballIndex: number ): void{
		super.showLastBall( ballIndex );
		this.showLastBallAt( ballIndex, 0, 0 );

		let ballLotto: egret.MovieClip = this.getChildByName( this.assetStr("showball_bolas") ) as egret.MovieClip;
		if( ballLotto.visible ){
			ballLotto.stop();
			ballLotto.visible = false;
		}
	}

	protected showLastBallAt( ballIndex: number, x: number, y: number, scale: number = 1 ): void{
		if( this.runningBallUI && ( this.runningBallContainer ).contains( this.runningBallUI ) ){
			( this.runningBallContainer ).removeChild( this.runningBallUI );
		}
		this.runningBallUI = this.ballArea.getABigBall( ballIndex, "_small", 67 );
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

	protected winChange( event: egret.Event ): void{
		this.winText.text = Utils.formatCoinsNumber( event["winCoins"] );
	}

	protected tipStatus( event: egret.Event ): void{
		switch( event["status"] ){
			case "play":
				this.showShuffling();
				break;
			case "extra":
				this.showExtraPrice( event["extraPrice"] );
				break;
			case "ready":
				this.showPressPlay();
				break;
		}
	}

	private pressText: egret.TextField;
	private playText: egret.TextField;

	private extraBallText: egret.TextField;
	private creditTipText: egret.TextField;
	private extraPriceText: egret.TextField;

	private timer: egret.Timer;

	private showTipStatus(): void{
		this.pressText = Com.addTextAt( this, 20, 133, 112, 25, 19, false, true );
		this.pressText.verticalAlign = "middle";
		this.playText = Com.addTextAt( this, 20, 158, 112, 25, 19, false, true );
		this.playText.verticalAlign = "middle";
		this.pressText.scaleY = this.playText.scaleY = 0.82;

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
		this.resetTimer();
	}

	private showPressPlay(): void{
		this.resetTimer();
		this.isShowingExtra( false );

		this.setTipText( this.pressText, 18, true, 0xFFFF00, "press" );
		this.setTipText( this.playText, 18, true, 0xFFFF00, "play" );

		this.timer = new egret.Timer( 500, 0 );
		this.timer.addEventListener( egret.TimerEvent.TIMER, this.onTimer, this );
		this.timer.start();
	}

	private resetTimer(): void{
		if( this.timer ){
			this.timer.reset();
			this.timer.stop();
			this.timer.removeEventListener( egret.TimerEvent.TIMER, this.onTimer, this );
		}
	}

	private onTimer( event: egret.TimerEvent ): void{
		if( ( event.target as egret.Timer ).currentCount & 1 ){
			this.pressText.textColor = 0xFFFF00;
			this.playText.textColor = 0xFFFF00;
			this.pressText.filters = [];
			this.playText.filters = [];
		}
		else{
			this.pressText.textColor = 0;
			this.playText.textColor = 0;
			this.pressText.filters = [ new egret.GlowFilter( 0xFFFF00, 1, 10, 10, 1, 1 ) ];
			this.playText.filters = [ new egret.GlowFilter( 0xFFFF00, 1, 10, 10, 1, 1 ) ];
		}
	}

	private showShuffling(): void{
		this.resetTimer();
		this.isShowingExtra( false );

		this.setTipText( this.pressText, 14, true, 0xFFFF00, "shuffling" );
		this.setTipText( this.playText, 14, true, 0xFFFF00, "balls" );
	}

	protected showExtraPrice( price: number ): void{
		this.resetTimer();
		this.isShowingExtra( true );
		this.extraPriceText.text = Utils.formatCoinsNumber( price );
	}

	private isShowingExtra( isShow: boolean ): void{
		this.pressText.visible = !isShow;
		this.playText.visible = !isShow;

		this.extraBallText.visible = isShow;
		this.creditTipText.visible = isShow;
		this.extraPriceText.visible = isShow;
	}

	private setTipText( target: egret.TextField, size: number, visible: boolean, color: number, text: string ){
		target.size = size;
		target.visible = visible;
		target.textColor = color;
		target.filters = [new egret.GlowFilter( 0xFFFF00, 1, 10, 10, 1, 1 )];
		target.text = MuLang.getText(text);
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
	}

	protected startPlay(): void {
		super.startPlay();
		this.clearCardWinTimes();
	}

	protected onBetChanged( event: egret.Event ): void{
		super.onBetChanged( event );
        this.clearCardWinTimes();
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
			this.heartAnimation = Com.addMovieClipAt( this, this._mcf, "showball_heart", 355, 320 );
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

		this.showPressPlay();
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

			if( localStorage.getItem( this.assetStr( "mega" ) ) ) return;
			else{
				localStorage.setItem( this.assetStr( "mega" ), "true" );
				let ev: egret.Event = new egret.Event( "megaFirst" );
				ev.data = new egret.Rectangle( 536, 148, 43, 35 );
				this.dispatchEvent( ev );
			}
		}
	}

	protected winBingo(): void {
		super.winBingo();
		this.clearHeartAnimation();
	}

	protected getFitEffectNameList(): Object{
        let firList: Object = {}
        firList["pt_line"] = [];
        firList["pt_line"][0] = this.combinString( "line1" );
        firList["pt_line"][1] = this.combinString( "line2" );
        firList["pt_line"][2] = this.combinString( "line3" );
        firList["double_line"] = [];
        firList["double_line"][0] = this.combinString( "dbline1" );
        firList["double_line"][1] = this.combinString( "dbline2" );
        firList["double_line"][2] = this.combinString( "dbline3" );
        firList["pt_v"] = [];
        firList["pt_v"][0] = this.combinString( "v" );
        firList["pt_v"][1] = this.combinString( "v2" );
        firList["pt_trangle"] = [];
        firList["plus"] = "card_plus";
        firList["pt_trangle"][0] = this.combinString( "trangle" );
        firList["pt_trangle"][1] = this.combinString( "trangle2" );
        firList["pt_mouse"] = this.combinString( "mouse" );
        firList["pt_x"] = "Bitma1";
        firList["pt_m"] = [];
        firList["pt_m"][0] = this.combinString( "m" );
        firList["pt_m"][1] = this.combinString( "w" );
        firList["pt_fly"] = this.combinString( "fly" );
        firList["pt_xx"] = this.combinString( "xx" );
        firList["pt_round"] = this.combinString( "round" );
        firList["pt_bingo"] = this.combinString( "bingo" );
		return firList;
	}

/******************************************************************************************************************************************************************/    

	protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
		this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 617, -2 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 2, 23 ), new egret.Rectangle( 0, 26, 120, 20 ), 20, 0xFF0000, new egret.Rectangle( 0, 10, 120, 14 ), 14, 0xFFFFFF ) );
		this.jackpotArea.tip.fontFamily = "verdana";
		this.jackpotArea.tip.bold = true;
		this.jackpotArea.tip.text = Utils.toFirstUpperCase(this.jackpotArea.tip.text);

		this.jackpotArea["jackpotText"].fontFamily = "Quicksand Bold";
	}
}
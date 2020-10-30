class BonusBingo extends V2Game{

    protected static get classAssetName(){
		return "bonusBingo";
	}

    protected static get animationAssetName(){
		return "bonusBingoAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "bonusBingo.conf", assetsPath, 65 );
        this.languageObjectName = "bonusBingo_tx";

        this.blinkSpArray = new Array<egret.Sprite>();
        this.superWinMcArray = new Array<egret.MovieClip>();

        PaytableUI.textBold = true;
        PayTableManager.paytableUIType = BonusBingoPaytableUI;

        GameCard.zeroUI = "card_center";

        CardManager.cardType = BonusBingoCard;
        CardManager.gridType = ForkGrid;

        CardGrid.defaultNumberSize = 36;
        BallManager.ballOffsetY = 4;

        this.ballArea.needLightCheck = true;

        BallManager.normalBallInterval = 70;
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();
        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, this.runningBallContainer, 978, 725 );

        this.letsBonus();

        this.ganhoCounter = new GanhoCounter( this.showWinAnimationAt.bind( this ) );
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        this.showLastBallAt( ballIndex, 0, 0, 182 / 88 );

        this.removeLuckMultiAnimations();

        if( this.currentBallIndex > 44 )this.playSound("bonusBingo_EB_mp3");
        else this.playSound("bonusBingo_ball_fall_mp3");
	}

/******************************************************************************************************************************************************************/

    private bonusLetter: BonusLetterLayer;

    private luckMultiCardId: number;

    private chooseCardButtons: Array<TouchDownButton>;

    private letsBonus(): void{
        this.bonusLetter = new BonusLetterLayer;
        this.addChild( this.bonusLetter );
        this.bonusLetter.getBonusLetes();
        this.bonusLetter.getCovers();

        this.chooseCardButtons = [];
        for( let i: number = 0; i < 4; i++ ){
            let offsetX: number = this.cardPositions[i]["x"];
            let offsetY: number = this.cardPositions[i]["y"];
            this.chooseCardButtons[i] = Com.addDownButtonAt( this, this.assetStr( "card_front" ), this.assetStr( "card_front" ), offsetX, offsetY, this.onCardChoose, true );
            this.chooseCardButtons[i].filters = [ MatrixTool.colorMatrixPure( 0xffc200 ), new egret.GlowFilter( 0xffc200, 1, 15, 15, 5, 2 ) ];
            this.addChildAt( this.chooseCardButtons[i], 1 );
        }
        this.superGame( false );
        this.givePlayerChanceToChooseCard( false );

        this.firstTimePlayShowTutorail();
    }

    private firstTimePlayShowTutorail(){
        if( localStorage.getItem( "BonusBingoTT" ) ) return;
        else{
            localStorage.setItem( "BonusBingoTT", "true" );
            this.dispatchEvent( new egret.Event( "new_game_tutorail" ) );
        }
    }

    private onCardChoose( e: egret.TouchEvent ){
        let index: number = this.chooseCardButtons.indexOf( e.target );
        this.luckMultiCardId = index + 1;
        this.givePlayerChanceToChooseCard( false );
        this.showLuckTimeAt( index );
        this.autoPlayWaitingForUseChooseCard = this.waitingDuration * this.waitingTime;
    }

    private fiveBallBlinkId: number;

    private _isSuper: boolean;
    private get isSuper(): boolean{
        return this._isSuper;
    }
    private set isSuper( value: boolean ){
        this._isSuper = value;
        if( value ){
            clearInterval( this.fiveBallBlinkId );
            this.fiveBallBlinkId = setInterval( this.fiveBallBlink.bind( this ), 2004 );
            this.playSound( "bgm_bounes_mode_mp3", -1 );
        }
        else this.stopSound( "bgm_bounes_mode_mp3" );
    }

    private fiveBallBlink(): void{
        if( !this.stage )clearInterval( this.fiveBallBlinkId );
        if( this.bonusLetter.bonusLight.visible ){
            this.setAlphaFromTo( this.bonusLetter.bonusLight, 1, 0.5 );
            for( let i: number = 0; i < 4; i++ ){
                this.setAlphaFromTo( (CardManager.cards[i] as BonusBingoCard).cardBgLight, 1, 0.5 );
            }
        }
    }

    private setAlphaFromTo( target: egret.DisplayObject, fromAlpha: number, toAlpha: number, duration: number = 1000, backToOrigin: boolean = true ): void{
        let tw: egret.Tween = egret.Tween.get( target );
        target.alpha = fromAlpha;
        tw.to( { alpha: toAlpha }, duration );
        if( backToOrigin ) tw.to( { alpha: fromAlpha }, duration );
    }

    private superGame( status: boolean ): void{
        this.bonusLetter.superMode( status );
        for( let i: number = 0; i < 4; i++ ){
            let card: BonusBingoCard = CardManager.cards[i] as BonusBingoCard;
            card.cardBgLight.visible = status;
            card.clearWinTimesTip();
            if( status ) card.showWinTimesTip( "x50_small" );
        }
        for( let j: number = 0; j < CardManager.cards.length; j++ ){
            ( CardManager.cards[j] as BonusBingoCard ).useSuperBg( status );
        }
        this.isSuper = status;
    }

    protected onServerData( data: Object ){
		super.onServerData( data );
        this.bonusLetter.getServerData( data["bonusBalls"], data["bonusRounds"], data["luckmultis"] );
        this.setbonusByBet();
        this.checkLuckMulti( this.bonusLetter.luckMultiTimes );
	}

    private setbonusByBet(): void{
        let bonusRoundLeft: number = this.bonusLetter.betBonusRounds[ GameData.currentBet ];
        if( bonusRoundLeft ){
            this.superGame( true );
            this.bonusLetter.setBonusLetters( true, bonusRoundLeft );
        }
        else{
            this.superGame( false );
            this.bonusLetter.setBonusLetters( false, bonusRoundLeft );
        }
    }

    public onExtra( data: Object ){
        super.onExtra( data );
        if( data && data["bonusBall"] ){
            let bonusPregress: Array<boolean> = this.bonusLetter.betProgress[ GameData.currentBet ];
            if( !bonusPregress ) bonusPregress = [ false, false, false, false, false ];
            let bonusBallIndex: number = parseInt(data["bonusBall"]) - 1;
            bonusPregress[ bonusBallIndex ] = true;
            this.bonusLetter.betProgress[ GameData.currentBet ] = bonusPregress;
            this.setbonusByBet();
            
            this.playSound( "bonusBingo_get_ball_wav" );

            this.bonusLetter.letLetterBlink( bonusBallIndex );
        }
    }

    private bonusResultFilter( resultList: Array<Object> ): void{
        for( let i: number = 0; i < resultList.length; i++ ){
            let fitsArr: Array<boolean> = resultList[i]["single_line"].fits;
            if( fitsArr ){
                let fitCount: number = 0;
                let firstlineFit: boolean = false;
                let secondlineFit: boolean = false;
                let fourthlineFit: boolean = false;
                let lastlineFit: boolean = false;
                for( let j: number = 0; j < fitsArr.length; j++ ){
                    if( fitsArr[j] ){
                        fitCount ++;
                        if( j == 0 ) firstlineFit = true;
                        if( j == 1 ) secondlineFit = true;
                        if( j == 3 ) fourthlineFit = true;
                        if( j == 4 ) lastlineFit = true;
                    }
                }
                if( fitCount <= 1 )resultList[i]["single_line"].fits = null;
                else{
                    if( firstlineFit && lastlineFit ){
                        resultList[i]["four_corners"].fit = false;
                        if( secondlineFit && fourthlineFit ){
                            if( resultList[i]["letter_t"].fit ) resultList[i]["letter_t"].fit = false;
                        }
                    }
                }
            }
        }
    }

    protected onBetChanged( event: egret.Event ): void{
        this.setbonusByBet();
        this.checkLuckMulti( this.bonusLetter.luckMultiTimes );
        super.onBetChanged(event);
    }

    public onRoundOver( data: Object ){
        this.checkLuckMulti( data["luckMulti"] );

        if( this.resetCurrentBetBonusRound( data["bonusRound"], data["ganho"] ) ){
            super.onRoundOver( data );
            this.setbonusByBet();
        }
        else{
            this.showSpuerModeAnimation();
            if( this.gameToolBar.autoPlaying ){
                IBingoServer.roundOverCallback = null;
                this.gameToolBar.autoPlaying = false;
                this.roundOver();

                this.gameToolBar.showStop( true );
                this.gameToolBar.unlockAllButtons();
                this.gameToolBar.showWinResult( data["ganho"] );
                // this.gameToolBar["enableAllButtons"]( true );
                // this.gameToolBar["stopAutoBtn"].visible = false;

                this.updateCredit( data );

                this.showAnimationWhenAutoPlaying = true;
                // this.resetGameToolBarStatus();
            }
            else super.onRoundOver( data );
        }
    }

    private showAnimationWhenAutoPlaying: boolean;

    public onCancelExtra( data: Object ){
        this.checkLuckMulti( data["luckMulti"] );

        if( this.resetCurrentBetBonusRound( data["bonusRound"], data["ganho"] ) ){
            super.onCancelExtra( data );
            this.setbonusByBet();
        }
        else{
            this.showSpuerModeAnimation();
            super.onCancelExtra( data );
        }
    }

    private showSpuerModeAnimation(){
        this.canQuickPay = false;
        this.forbidTouchEvent = true;
        let doctorAnimation: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "bonusBingo_doctor", 1100, 574 );
        doctorAnimation.anchorOffsetX = 275;
        doctorAnimation.anchorOffsetY = 200;
        doctorAnimation.scaleX = doctorAnimation.scaleY = 2;
        doctorAnimation.addEventListener( egret.Event.ENTER_FRAME, this.dtAnimationFrameCounter, this );
        doctorAnimation.mask = new egret.Rectangle( 110, 54, 335, 210 );
        this.playSound( "bonusBingo_get_all_mp3" );
        this.waitForAnimation = true;
    }

    private waitForAnimation: boolean;
    private waitForCurtain1Animation: boolean;
    private waitForCurtain2Animation: boolean;

    private dtAnimationFrameCounter( event: egret.Event ): void{
        let doctorAnimation: egret.MovieClip = event.currentTarget as egret.MovieClip;
        if( doctorAnimation.currentFrame == doctorAnimation.totalFrames ){
            doctorAnimation.removeEventListener( egret.Event.ENTER_FRAME, this.dtAnimationFrameCounter, this );
            if( doctorAnimation.parent ){
                doctorAnimation.parent.removeChild( doctorAnimation );
            }
        }
        if( doctorAnimation.currentFrame == 20 && this.waitForAnimation ){
            this.showCurtainAnimation();
            this.waitForAnimation = false;
        }
    }

    private curtains1: Array<egret.MovieClip>;
	private curtains2: Array<egret.MovieClip>;

	private showCurtain2Animation(): void{
        let curtains: Array<egret.MovieClip> = [];
        this.setbonusByBet();
        for( let i: number = 0; i < 4; i++ ){
            let offsetX: number = this.cardPositions[i]["x"];
            let offsetY: number = this.cardPositions[i]["y"];
            curtains[i] = Com.addMovieClipAt( this, MDS.mcFactory, "bonusBingo_curtains_02", offsetX, offsetY );
            curtains[i].gotoAndPlay(1);
            if( this.curtains1[i].parent ){
                this.curtains1[i].parent.removeChild( this.curtains1[i] );
            }
        }
        curtains[0].addEventListener( egret.Event.ENTER_FRAME, this.curtain2AnimationFrameCounter, this );
        this.curtains2 = curtains;
        this.waitForCurtain2Animation = true;
    }

	private curtain2AnimationFrameCounter( event: egret.Event ): void{
        let curtains2: egret.MovieClip = event.currentTarget as egret.MovieClip;
        if( curtains2.currentFrame == 25 && this.waitForCurtain2Animation ){
            this.waitForCurtain2Animation = false;
            for( let i: number = 0; i < 4; i++ ){
                if( this.curtains2[i].parent ){
                    this.curtains2[i].stop();
                    this.curtains2[i].parent.removeChild( this.curtains2[i] );
                }
            }
            curtains2.removeEventListener( egret.Event.ENTER_FRAME, this.curtain2AnimationFrameCounter, this );
            this.returnToNormalGame();
        }
    }

    private showCurtainAnimation(): void{
        let curtains: Array<egret.MovieClip> = [];
        for( let i: number = 0; i < 4; i++ ){
            let offsetX: number = this.cardPositions[i]["x"];
            let offsetY: number = this.cardPositions[i]["y"];
            curtains[i] = Com.addMovieClipAt( this, MDS.mcFactory, "bonusBingo_curtains_01", offsetX, offsetY );
            curtains[i].gotoAndPlay(1);
        }
        curtains[0].addEventListener( egret.Event.ENTER_FRAME, this.curtain1AnimationFrameCounter, this );
        this.curtains1 = curtains;
        this.waitForCurtain1Animation = true;
    }

    private curtain1AnimationFrameCounter( event: egret.Event ): void{
        let curtains1: egret.MovieClip = event.currentTarget as egret.MovieClip;
        if( curtains1.currentFrame == 20 && this.waitForCurtain1Animation ){
            this.bonusLetter.showLightLetters( 500, this.showCurtain2Animation.bind( this ) );
            this.waitForCurtain1Animation = false;
            curtains1.removeEventListener( egret.Event.ENTER_FRAME, this.curtain1AnimationFrameCounter, this );
            for( let i: number = 0; i < 4; i++ ){
                if( this.curtains1[i] )this.curtains1[i].stop();
            }
        }
    }

    private returnToNormalGame(): void{
        this.canQuickPay = true;
        this.forbidTouchEvent = false;
        if( this.showAnimationWhenAutoPlaying ){
            this.showAnimationWhenAutoPlaying = false;
            this.gameToolBar.autoPlaying = true;
        }
    }

    private touchArea: egret.Shape;
    private set forbidTouchEvent( value: boolean ){
        if( !this.touchArea ){
            this.touchArea = new egret.Shape;
            GraphicTool.drawRect( this.touchArea, new egret.Rectangle( 0, 0, 755, 700 ), 0, false, 0.0 );
            this.touchArea.touchEnabled = true;
        }
        if( value ){
            this.addChild( this.touchArea );
            this.gameToolBar.filters = [MatrixTool.colorMatrixLighter( 0.3 )];
        }
        else{
            if( this.contains( this.touchArea ) ) this.removeChild( this.touchArea );
            this.gameToolBar.filters = [];
        }
    }

    private checkLuckMulti( luckMulti: number ){
        if( luckMulti ){
            this.showLuckMulti( luckMulti );
            this.luckMultiCardId = Math.floor( Math.random() * 4 ) + 1;
            this.givePlayerChanceToChooseCard( true );
            this.playSound( "bonusBingo_mutiplay_mp3" );
        }
        else{
            this.luckMultiCardId = 0;
            this.bonusLetter.luckMultiTimes = 0;
            this.givePlayerChanceToChooseCard( false );
        }
    }

    private resetCurrentBetBonusRound( bonusRoundLeft: number, ganho: number ): boolean{
        if( this.isSuper ){
            if( bonusRoundLeft != this.bonusLetter.betBonusRounds[ GameData.currentBet ] - 1 ) console.error( "bonusRoundLeft did not match: " + this.bonusLetter.betBonusRounds[ GameData.currentBet ] );
            if( bonusRoundLeft ){
                this.bonusLetter.betBonusRounds[ GameData.currentBet ] = bonusRoundLeft;
            }
            else{
                this.bonusLetter.betProgress[ GameData.currentBet ] = [ false, false, false, false, false ];
                this.bonusLetter.betBonusRounds[ GameData.currentBet ] = 0;
            }
            if( !ganho ) this.playSound( "bonusBingo_super_miss_mp3" );
        }
        else{
            if( bonusRoundLeft && bonusRoundLeft != 5 ) console.error( "bonusRoundLeft did not match: " + 5 );
            if( bonusRoundLeft ){
                this.bonusLetter.betBonusRounds[ GameData.currentBet ] = bonusRoundLeft;
                return false;
            }
        }

        return true;        
    }

    protected afterCheck( resultList: Array<Object> ): void{
        this.bonusResultFilter( resultList );
        super.afterCheck( resultList );

        if( !this.inLightCheck ){
            if( PaytableResultListOprator.missOneCounter( resultList, "bingo" ) + PaytableResultListOprator.missOneCounter( resultList, "round" ) + PaytableResultListOprator.missOneCounter( resultList, "four_line" ) ){
                this.playSound("bonusBingo_missone_mp3");
			}
		}

        this.ganhoCounter.countGanhoAndPlayAnimation(resultList);
    }

    private blinkSpArray: Array<egret.Sprite>;
    private superWinMcArray: Array<egret.MovieClip>;

    protected showWinAnimationAt(cardId: number, win: number): void{
        let blinkSp: egret.Sprite = new egret.Sprite;
        Com.addObjectAt( this, blinkSp, CardManager.cards[cardId].x, CardManager.cards[cardId].y );
        Com.addBitmapAt( blinkSp, BingoMachine.getAssetStr( "card_head_bg" ), 0, 0 );
        let lightEf: egret.Bitmap = Com.addBitmapAt( blinkSp, BingoMachine.getAssetStr( "card_head_outerlight" ), -15, -15 );
        let tx: egret.TextField = Com.addTextAt( blinkSp, 12, 12, 300, 30, 30, false, true );
        tx.textAlign = "left";
        tx.scaleX = 0.9;
        let winTimes: number = 1;
        if( this.isSuper ) winTimes = 50;
        else if( this.bonusLetter.luckMultiTimes && cardId == this.luckMultiCardId - 1 ) winTimes = this.bonusLetter.luckMultiTimes;
        tx.text = MuLang.getText( "win" ) + " " + ( win * GameData.currentBet * winTimes );
        this.blinkSpArray.push(blinkSp);
        tx.textColor = 0;
        let tw: egret.Tween = egret.Tween.get( lightEf );
        for( let i: number = 0; i < 5; i++ ){
            tw.to( { alpha: 0.5 }, 500 );
            tw.to( { alpha: 1 }, 500 );
        }
        tw.to( { alpha: 0 }, 500 );
        // tw.call( () => { blinkSp.parent.removeChild( blinkSp ) } );

        if( this.isSuper ){
            let dtAnimation: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "bonusBingo_doctor", CardManager.cards[cardId].x + 164, CardManager.cards[cardId].y + 206 );
            dtAnimation.anchorOffsetX = 275;
            dtAnimation.anchorOffsetY = 200;
            let dtTw: egret.Tween = egret.Tween.get( dtAnimation );
            dtTw.wait( 3000 );
            dtTw.call( () => { dtAnimation.stop() } );

            if( this.superWinMcArray[cardId] && this.superWinMcArray[cardId].parent ) this.superWinMcArray[cardId].parent.removeChild( this.superWinMcArray[cardId] );
            
            this.superWinMcArray[cardId] = dtAnimation;
        }
    }

    private luckMultiAnimation: BonusLuckMultiAnimation;

    private showLuckMulti( luckMultiTimes: number ): void{
        this.bonusLetter.luckMultiTimes = luckMultiTimes;
        this.luckMultiAnimation = new BonusLuckMultiAnimation( luckMultiTimes );
        Com.addObjectAt( this, this.luckMultiAnimation, 750, 563 );
        this.showFourLuckMultis( luckMultiTimes );
    }

    private showFourLuckMultis( luckMultiTimes: number ): void{
        for( let i: number = 0; i < 4; i++ ){
            ( CardManager.cards[i] as BonusBingoCard ).showCardMultiTimes( luckMultiTimes, i );
        }
    }

    private showLuckTimeAt( luckMultiCardIndex: number ){
        let card: BonusBingoCard = CardManager.cards[luckMultiCardIndex] as BonusBingoCard;
        card.clearWinTimesTip();
        card.showWinTimesTip( "x" + this.bonusLetter.luckMultiTimes + "_small" );
    }

    private givePlayerChanceToChooseCard( letPlayerChoose: boolean ): void{
        for( let i: number = 0; i < 4; i++ ){
            this.chooseCardButtons[i].visible = letPlayerChoose;
            CardManager.cards[i].touchEnabled = !letPlayerChoose;
        }
        if( !letPlayerChoose ){
            this.removeLuckMultiAnimations();
        }
    }

    private removeLuckMultiAnimations(){
        if( this.luckMultiAnimation && this.contains( this.luckMultiAnimation ) ) this.removeChild( this.luckMultiAnimation );
        for( let i: number = 0; i < 4; i++ ){
            ( CardManager.cards[i] as BonusBingoCard ).removeLuckMultiOnCard();
        }
    }

    private autoPlayWaitingForUseChooseCard: number = 0;
    private waitingDuration: number = 500;//check waiting function excute every per mutiseconds
    private waitingTime: number = 12;//waiting time seconds

    protected sendPlayRequest() {
        if( this.luckMultiCardId ){
            if( this.gameToolBar.autoPlaying ){
                if( this.autoPlayWaitingForUseChooseCard < this.waitingTime * 1000 / this.waitingDuration ){
                    this.autoPlayWaitingForUseChooseCard ++;
                    setTimeout( this.sendPlayRequest.bind( this ), this.waitingDuration );
                    return;
                }
            }
		    IBingoServer.playCallback = this.onPlay.bind( this );
            IBingoServer.playWithCardId( GameData.currentBet, CardManager.enabledCards, CardManager.groupNumber, GameData.currentBetIndex, this.luckMultiCardId );
            this.showLuckTimeAt( this.luckMultiCardId - 1 );
            this.autoPlayWaitingForUseChooseCard = 0;
            this.givePlayerChanceToChooseCard( false );
        }
        else super.sendPlayRequest();
	}

/******************************************************************************************************************************************************************/
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1443, 26 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 25, 0, 300, 55 ), 30, 0xFFFFFF ) );
        this.jackpotArea.jackpotText.textAlign = "left";
    }

    protected hasExtraBallFit(): void {
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
        }
    }

    protected startPlay(): void {
        super.startPlay();
        
        for (let i = 0; i < this.blinkSpArray.length; i++) {
            if (this.blinkSpArray[i]) {
                egret.Tween.removeTweens(this.blinkSpArray[i]);
                if (this.blinkSpArray[i].parent) {
                    this.blinkSpArray[i].parent.removeChild(this.blinkSpArray[i]);
                }
                this.blinkSpArray[i] = null;
            }
        }
        this.blinkSpArray = new Array<egret.Sprite>();

        for (let i = 0; i < this.superWinMcArray.length; i++) {
            if (this.superWinMcArray[i]) {
                egret.Tween.removeTweens(this.superWinMcArray[i]);
                if (this.superWinMcArray[i].parent) {
                    this.superWinMcArray[i].parent.removeChild(this.superWinMcArray[i]);
                }
                this.superWinMcArray[i] = null;
            }
        }
        this.superWinMcArray = new Array<egret.MovieClip>();
	}

    private canQuickPay: boolean = true;

    public quickPlay(): void {
        if( this.canQuickPay )super.quickPlay();
	}
}
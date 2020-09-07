class BonusBingo extends V2Game{

    protected static get classAssetName(){
		return "bonusBingo";
	}

    protected static get animationAssetName(){
		return "bonusBingoAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "bonusBingo.conf", assetsPath, 65 );
        this.ptFilterConfig = "bonusBingo_filt";

        this.blinkSpArray = new Array<egret.Sprite>();
        this.superWinMcArray = new Array<egret.MovieClip>();

        PaytableUI.textBold = true;
        PaytableUI.effectWithBg = "highlight";

        GameCard.bgRound = 20;

        GameCard.betTexPosition = new egret.Point( 8, 4 );
        GameCard.texSize = 15;
        GameCard.texColor = 0x0;
        GameCard.zeroUI = "card_center";
        GameCard.usefork = "fork";

        GameCard.gridOnTop = true;
        GameCard.useRedEffect = true;
        GameCard.fitEffectRedLine = false;

        CardManager.cardType = BonusBingoCard;
        CardManager.gridType = ForkGrid;

        CardGrid.defaultBgColor = 0xFFFFFF;
        CardGrid.defaultNumberSize = 18;

        CardGrid.blinkColors1 = 0x92E4A8;
        CardGrid.blinkColors2 = 0x92E4A8;

        this.needSmallWinTimesOnCard = true;
        this.ballArea.needLightCheck = true;

        BallManager.normalBallInterval = 70;

        let languageText = GameUIItem.languageText;
        languageText["choose a card"] = { en: "Choose a card", es: "Elija una Tarjeta", pt: "Escolha uma Cartela" };
        languageText["win multiplier"] = { en: "You've won a Multiplier!", es: "Usted Ganó Multiplicado por!", pt: "Você Ganhou Multiplicado por!" };

        languageText["win"] = { en: "WIN", es: "CANADO", pt: "CANHO" };

        GameToolBar.toolBarY = 474;
        BingoBackGroundSetting.defaultScale = false;
	}

    protected init(){
        super.init();

        this.addGameTextCenterShadow( 298, 2, 16, 0xFEFEFE, "bet", true, 200, true, false );
        this.addGameTextCenterShadow( 42, 3, 16, 0xFEFEFE, "credit", true, 200, true, false );

        this.betText = this.addGameTextCenterShadow( 298, 24, 15, 0xFEFEFE, "bet", true, 200, true, false );
        this.creditText = this.addGameTextCenterShadow( 42, 24, 15, 0xFEFEFE, "credit", true, 200, true, false );

        this.runningBallContainer = new egret.DisplayObjectContainer;

        this.letsBonus();

        this.ganhoCounter = new GanhoCounter( this.showWinAnimationAt.bind( this ) );
    }

    protected getFitEffectNameList(): Object{        
        let firList: Object = {}
		firList["bingo"] = "line_x3000";
		firList["round"] = "line_x250";
		firList["letter_x"] = "line_x8";
		firList["letter_t"] = "line_x10";
		firList["four_corners"] = "line_x2";
		firList["diagonal_0"] = "line_x1";
		firList["diagonal_2"] = "line_x1_02";
        firList["single_line"] = [];
        firList["single_line"][0] = "line_1th";
        firList["single_line"][1] = "line_2th";
        firList["single_line"][2] = "line_3th";
        firList["single_line"][3] = "line_4th";
        firList["single_line"][4] = "line_5th";
		return firList;
	}

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        this.showLastBallAt( ballIndex, 0, 0 );
        Com.addObjectAt( this, this.runningBallContainer, 327, 290 );

        this.removeLuckMultiAnimations();

        if( this.currentBallIndex > 44 )this.playSound("bonusBingo_EB_mp3");
        else this.playSound("bonusBingo_ball_fall_mp3");
	}

    protected showLastBallAt( ballIndex: number, x: number, y: number, scale: number = 1 ): void{
		if( this.runningBallUI && ( this.runningBallContainer ).contains( this.runningBallUI ) ){
			( this.runningBallContainer ).removeChild( this.runningBallUI );
		}
		this.runningBallUI = this.ballArea.getABigBall( ballIndex, "31", 60 );
		Com.addObjectAt( this.runningBallContainer, this.runningBallUI, x, y );
	}

    protected clearRunningBallUI(): void{
        if( this.runningBallContainer && this.contains( this.runningBallContainer ) )this.removeChild( this.runningBallContainer );
	}

/******************************************************************************************************************************************************************/

    private static bonusString: string = "BONUS"
    private bonusLetters: Array<egret.Bitmap>;
    private bonusLightLetters: Array<egret.Bitmap>;
    private bonusLetterContainer: egret.DisplayObjectContainer;

    private betProgress: Object;
    private betBonusRounds: Object;
    private betLuckMultis: Object;

    private luckMultiCardId: number;

    private bonusCoverBgYellow: egret.Bitmap;
    private bonusCoverUpYellow: egret.Bitmap;
    private bonusCoverUpRed: egret.Bitmap;
    private bonusLightBg: egret.Bitmap;
    private bonusLight: egret.Bitmap;

    private chooseCardButtons: Array<ScaleAbleButton>;
    private cardBgLight: Array<egret.Bitmap>;
    private winTimesTip: Array<egret.DisplayObjectContainer>;

    private letsBonus(): void{
        this.getBonusLetes();
        this.bonusLetterContainer = new egret.DisplayObjectContainer;
        this.addChild( this.bonusLetterContainer );

        this.bonusCoverBgYellow = this.getChildByName( this.assetStr( "fiveball_bg_special" ) ) as egret.Bitmap;
        this.bonusCoverUpRed = this.getChildByName( this.assetStr( "fiveball_bg_cover" ) ) as egret.Bitmap;
        this.bonusLetterContainer.addChild( this.bonusCoverUpRed );
        this.bonusCoverUpYellow = this.getChildByName( this.assetStr( "fiveball_bg_special_cover" ) ) as egret.Bitmap;
        this.bonusLetterContainer.addChild( this.bonusCoverUpYellow );
        this.bonusLightBg = this.getChildByName( this.assetStr( "light_bg" ) ) as egret.Bitmap;
        this.bonusLight = this.getChildByName( this.assetStr( "fiveball_light" ) ) as egret.Bitmap;

        this.cardBgLight = [];
        this.chooseCardButtons = [];
        this.winTimesTip = [];
        for( let i: number = 0; i < 4; i++ ){
            let offsetX: number = ( i & 1 ) ? 553 : 31;
            let offsetY: number = Math.floor( i / 2 ) ? 254 : 55;
            this.cardBgLight[i] = Com.addBitmapAt( this, this.assetStr( "card_outlight" ), ( 167 - 238 ) * 0.5 + offsetX, ( 189 - 268 ) * 0.5 + offsetY );
            this.addChildAt( this.cardBgLight[i], 1 );
            this.chooseCardButtons[i] = Com.addButtonAt( this, this.assetStr( "card_light" ), 167 * 0.5 + offsetX, 189 * 0.5 + offsetY, this.onCardChoose, 1, 1 );
            this.addChildAt( this.chooseCardButtons[i], 1 );
            this.chooseCardButtons[i].filters = [ MatrixTool.colorMatrixPure( 0xffc200 ) ];
            this.winTimesTip[i] = new egret.DisplayObjectContainer;
            Com.addObjectAt( this, this.winTimesTip[i], 62 + offsetX, 82 + offsetY );
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
    
    private getBonusLetes(): void{
        this.bonusLetters = [];
        this.bonusLightLetters = [];
        for( let i: number = 0; i < 5; i++ ){
            let bonusLetter: egret.Bitmap = this.getChildByName( this.assetStr( "light_" + BonusBingo.bonusString[i] ) ) as egret.Bitmap;
            bonusLetter.visible = false;
            bonusLetter.anchorOffsetX = bonusLetter.width >> 1;
            bonusLetter.x += bonusLetter.width >> 1;
            bonusLetter.anchorOffsetY = bonusLetter.height >> 1;
            bonusLetter.y += bonusLetter.height >> 1;
            this.bonusLetters[i] = bonusLetter;
            let bonusLightLetter: egret.Bitmap = this.getChildByName( this.assetStr( "light_" + BonusBingo.bonusString[i] + "_02" ) ) as egret.Bitmap;
            bonusLightLetter.visible = false;
            this.bonusLightLetters[i] = bonusLightLetter;
        }
    }

    private onCardChoose( e: egret.TouchEvent ){
        let index: number = this.chooseCardButtons.indexOf( e.target );
        this.luckMultiCardId = index + 1;
        this.givePlayerChanceToChooseCard( false );
        this.showLuckTimeAt( index );
        this.autoPlayWaitingForUseChooseCard = this.waitingDuration * this.waitingTime;
    }

    private showCardMultiTimes( luckMultiTimes: number, cardIndex: number ): egret.DisplayObjectContainer{
        let luckMultiOnCard: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, luckMultiOnCard, this.chooseCardButtons[cardIndex].x, this.chooseCardButtons[cardIndex].y + 9 );
        Com.addBitmapAt( luckMultiOnCard, this.assetStr( "card_center02" ), 0, 0 );
        let tx: egret.TextField = Com.addTextAt( luckMultiOnCard, 0, 0, 50, 20, 20, false, true );
        tx.text = "X" + luckMultiTimes;
        tx.textColor = 0xFFFF00;
        luckMultiOnCard.anchorOffsetX = luckMultiOnCard.width >> 1;
        luckMultiOnCard.anchorOffsetY = luckMultiOnCard.height >> 1;
        luckMultiOnCard.scaleX = luckMultiOnCard.scaleY = 0.1;
        let tw: egret.Tween = egret.Tween.get( luckMultiOnCard );
        tw.to( { scaleX: 1, scaleY: 1 }, 300 );
        tw.to( { scaleX: 0.6, scaleY: 0.6 }, 400, egret.Ease.bounceOut );
        for( let i: number = 0; i < 250; i++ ){
            tw.to( { scaleX: 0.4, scaleY: 0.4 }, 200 );
            tw.to( { scaleX: 0.6, scaleY: 0.6 }, 200 );
        }
        return luckMultiOnCard;
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
        if( this.bonusLight.visible ){
            this.setAlphaFromTo( this.bonusLight, 1, 0.5 );
            this.setAlphaFromTo( this.cardBgLight[0], 1, 0.5 );
            this.setAlphaFromTo( this.cardBgLight[1], 1, 0.5 );
            this.setAlphaFromTo( this.cardBgLight[2], 1, 0.5 );
            this.setAlphaFromTo( this.cardBgLight[3], 1, 0.5 );
        }
    }

    private setAlphaFromTo( target: egret.DisplayObject, fromAlpha: number, toAlpha: number, duration: number = 1000, backToOrigin: boolean = true ): void{
        let tw: egret.Tween = egret.Tween.get( target );
        target.alpha = fromAlpha;
        tw.to( { alpha: toAlpha }, duration );
        if( backToOrigin ) tw.to( { alpha: fromAlpha }, duration );
    }

    private superGame( status: boolean ): void{
        this.bonusLightBg.visible = status;
        this.bonusLight.visible = status;
        this.bonusCoverBgYellow.visible = status;
        this.bonusCoverUpYellow.visible = status;
        for( let i: number = 0; i < 4; i++ ){
            this.cardBgLight[i].visible = status;
            this.winTimesTip[i].removeChildren();
            if( status ) Com.addBitmapAt( this.winTimesTip[i], this.assetStr( "x50_small" ), 0, 0 );
            if( i > CardManager.enabledCards - 1 )this.winTimesTip[i].visible = false;
        }
        for( let j: number = 0; j < CardManager.cards.length; j++ ){
            ( CardManager.cards[j] as BonusBingoCard ).useSuperBg( status );
        }
        this.isSuper = status;
    }

    protected onServerData( data: Object ){
		super.onServerData( data );
        this.betProgress = this.getProgressData( data["bonusBalls"] );
        this.betBonusRounds = this.getBonusRounds( data["bonusRounds"] );
        this.betLuckMultis = this.getLuckMultis( data["luckmultis"] );
        this.setbonusByBet();
        this.checkLuckMulti( this.luckMultiTimes );
	}

    private getProgressData( bonusBalls: string ): Object {
        let bonusBallsArr: Array<string> = bonusBalls.split( ";" );
        let betProgress: Object = {};
        for( let i: number = 0; i < bonusBallsArr.length; i++ ){
            let tempAr: Array<string> = bonusBallsArr[i].split( "-" );
            if( tempAr.length == 2 ){
                let lettersAready: Array<string> = tempAr[1].split( "," );
                betProgress[tempAr[0]] = [];
                for( let j: number = 0; j < lettersAready.length; j++ ){
                    betProgress[tempAr[0]][parseInt( lettersAready[j] )] = true;
                }
            }
        }
        return betProgress;
    }

    private getBonusRounds( bonusRounds: string ): Object {
        let bonusRoundArr: Array<string> = bonusRounds.split( ";" );
        let betBonusRounds: Object = {};
        for( let i: number = 0; i < bonusRoundArr.length; i++ ){
            let tempAr: Array<string> = bonusRoundArr[i].split( "-" );
            if( tempAr.length == 2 ){
                betBonusRounds[tempAr[0]] = parseInt( tempAr[1] );
            }
        }
        return betBonusRounds;
    }

    private getLuckMultis( luckmultis: string ): Object{
        let luckmultiArr: Array<string> = luckmultis.split( ";" );
        let betLuckMultis: Object = {};
        for( let i: number = 0; i < luckmultiArr.length; i++ ){
            let tempAr: Array<string> = luckmultiArr[i].split( "-" );
            if( tempAr.length == 2 ){
                betLuckMultis[tempAr[0]] = parseInt( tempAr[1] );
            }
        }
        return betLuckMultis;
    }

    private setbonusByBet(): void{
        let bonusRoundLeft: number = this.betBonusRounds[ GameData.currentBet ];
        if( bonusRoundLeft ){
            this.superGame( true );
            this.setBonusLetters( true, bonusRoundLeft );
        }
        else{
            this.superGame( false );
            this.setBonusLetters( false, bonusRoundLeft );
        }
    }

    private setBonusLetters( status: boolean, bonusRoundLeft: number ): void{
        if( status ){
            for( let i: number = 0; i < 5; i++ ){
                if( i < bonusRoundLeft )this.bonusLetters[i].visible = this.bonusLightLetters[i].visible = true;
                else this.bonusLetters[i].visible = this.bonusLightLetters[i].visible = false;
            }
        }
        else{
            let bonusPregress: Array<boolean> = this.betProgress[ GameData.currentBet ];
            if( !bonusPregress ) bonusPregress = [ false, false, false, false, false ];
            for( let j: number = 0; j < 5; j++ ){
                if( bonusPregress[j] )this.bonusLetters[j].visible = true;
                else this.bonusLetters[j].visible = false;
                this.bonusLightLetters[j].visible = false;
            }
        }
    }

    public onExtra( data: Object ){
        super.onExtra( data );
        if( data && data["bonusBall"] ){
            let bonusPregress: Array<boolean> = this.betProgress[ GameData.currentBet ];
            if( !bonusPregress ) bonusPregress = [ false, false, false, false, false ];
            let bonusBallIndex: number = parseInt(data["bonusBall"]) - 1;
            bonusPregress[ bonusBallIndex ] = true;
            this.betProgress[ GameData.currentBet ] = bonusPregress;
            this.setbonusByBet();
            
            this.playSound( "bonusBingo_get_ball_wav" );

            this.letLetterBlink( bonusBallIndex );
        }
    }

    private letLetterBlink( bonusBallIndex: number ){
        this.addChild( this.bonusLetters[ bonusBallIndex ] );
        this.addChild( this.bonusLightLetters[ bonusBallIndex ] );
        let tw: egret.Tween = egret.Tween.get( this.bonusLetters[ bonusBallIndex ] );
        tw.to( { scaleX : 3, scaleY : 3 }, 300 );
        tw.to( { scaleX : 1, scaleY : 1 }, 300 );
        tw.to( { scaleX : 3, scaleY : 3 }, 300 );
        tw.to( { scaleX : 1, scaleY : 1 }, 300 );
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
        this.checkLuckMulti( this.luckMultiTimes );
        super.onBetChanged(event);

        // if (event.data["type"] !== 0) this.playSound("pck_bet_mp3");
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
        let doctorAnimation: egret.MovieClip = Com.addMovieClipAt( this, this._mcf, "bonusBingo_doctor", 100, - 54 );
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

    private showCurtainAnimation(): void{
        let curtains: Array<egret.MovieClip> = [];
        for( let i: number = 0; i < 4; i++ ){
            let offsetX: number = ( i & 1 ) ? 553 : 31;
            let offsetY: number = Math.floor( i / 2 ) ? 254 : 55;
            curtains[i] = Com.addMovieClipAt( this, this._mcf, "bonusBingo_curtains_01", offsetX, offsetY );
            curtains[i].gotoAndPlay(1);
        }
        curtains[0].addEventListener( egret.Event.ENTER_FRAME, this.curtain1AnimationFrameCounter, this );
        this.curtains1 = curtains;
        this.waitForCurtain1Animation = true;
    }

    private curtain1AnimationFrameCounter( event: egret.Event ): void{
        let curtains1: egret.MovieClip = event.currentTarget as egret.MovieClip;
        if( curtains1.currentFrame == 20 && this.waitForCurtain1Animation ){
            this.showLightLetters();
            this.waitForCurtain1Animation = false;
            curtains1.removeEventListener( egret.Event.ENTER_FRAME, this.curtain1AnimationFrameCounter, this );
            for( let i: number = 0; i < 4; i++ ){
                if( this.curtains1[i] )this.curtains1[i].stop();
            }
        }
    }

    private showLightLetters(): void{
        let tw: egret.Tween = egret.Tween.get( this );
        let letterDelay: number = 500;
        for( let i: number = 0; i < 5; i++ ){
            tw.wait( letterDelay );
            tw.call( () => { this.bonusLightLetters[i].visible = true } );
        }
        tw.wait( letterDelay );
        tw.call( this.showCurtain2Animation.bind( this ) );
    }

    private curtains2: Array<egret.MovieClip>;

    private showCurtain2Animation(): void{
        let curtains: Array<egret.MovieClip> = [];
        this.setbonusByBet();
        for( let i: number = 0; i < 4; i++ ){
            let offsetX: number = ( i & 1 ) ? 553 : 31;
            let offsetY: number = Math.floor( i / 2 ) ? 254 : 55;
            curtains[i] = Com.addMovieClipAt( this, this._mcf, "bonusBingo_curtains_02", offsetX, offsetY );
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
            this.luckMultiTimes = 0;
            this.givePlayerChanceToChooseCard( false );
        }
    }

    private resetCurrentBetBonusRound( bonusRoundLeft: number, ganho: number ): boolean{
        if( this.isSuper ){
            if( bonusRoundLeft != this.betBonusRounds[ GameData.currentBet ] - 1 ) console.error( "bonusRoundLeft did not match: " + this.betBonusRounds[ GameData.currentBet ] );
            if( bonusRoundLeft ){
                this.betBonusRounds[ GameData.currentBet ] = bonusRoundLeft;
            }
            else{
                this.betProgress[ GameData.currentBet ] = [ false, false, false, false, false ];
                this.betBonusRounds[ GameData.currentBet ] = 0;
            }
            if( !ganho ) this.playSound( "bonusBingo_super_miss_mp3" );
        }
        else{
            if( bonusRoundLeft && bonusRoundLeft != 5 ) console.error( "bonusRoundLeft did not match: " + 5 );
            if( bonusRoundLeft ){
                this.betBonusRounds[ GameData.currentBet ] = bonusRoundLeft;
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
        Com.addBitmapAt( blinkSp, BingoMachine.getAssetStr( "card_head_bg" ), 2, 0 );
        let lightEf: egret.Bitmap = Com.addBitmapAt( blinkSp, BingoMachine.getAssetStr( "card_head_outerlight" ), -6, -7 );
        let tx: egret.TextField = Com.addTextAt( blinkSp, 5, 4, 220, 14, 14, false, true );
        tx.textAlign = "left";
        tx.scaleX = 0.9;
        let winTimes: number = 1;
        if( this.isSuper ) winTimes = 50;
        else if( this.luckMultiTimes && cardId == this.luckMultiCardId - 1 ) winTimes = this.luckMultiTimes;
        tx.text = GameUIItem.languageText["win"][GlobelSettings.language] + " " + ( win * GameData.currentBet * winTimes );
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
            let dtAnimation: egret.MovieClip = Com.addMovieClipAt( this, this._mcf, "bonusBingo_doctor", CardManager.cards[cardId].x + 85, CardManager.cards[cardId].y + 200 );
            dtAnimation.anchorOffsetX = 280;
            dtAnimation.anchorOffsetY = 275;
            let dtTw: egret.Tween = egret.Tween.get( dtAnimation );
            dtTw.wait( 3000 );
            dtTw.call( () => { dtAnimation.stop() } );

            if( this.superWinMcArray[cardId] && this.superWinMcArray[cardId].parent ) this.superWinMcArray[cardId].parent.removeChild( this.superWinMcArray[cardId] );
            
            this.superWinMcArray[cardId] = dtAnimation;
        }
    }

    private luckMultiAnimation: egret.DisplayObjectContainer;
    private luckMultiOnCards: Array<egret.DisplayObjectContainer>;
    private get luckMultiTimes(){
        if( this.betLuckMultis[ GameData.currentBet ] )return this.betLuckMultis[ GameData.currentBet ];
        else return 0;
    }
    private set luckMultiTimes( value: number ){
        if( value )this.betLuckMultis[ GameData.currentBet ] = value;
        else this.betLuckMultis[ GameData.currentBet ] = 0;
    }

    private showLuckMulti( luckMultiTimes: number ): void{
        this.luckMultiTimes = luckMultiTimes;
        let dtContainer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, dtContainer, 320, 350 );
        dtContainer.mask = new egret.Rectangle( -110, -50, 335, 172 );
        let dtAnimation: egret.Sprite = new egret.Sprite;
        Com.addObjectAt( dtContainer, dtAnimation, 0, 140 );
        GraphicTool.drawRect( dtAnimation, new egret.Rectangle( -110, 0, 335, 140 ), 0, false, 0.5 );
        Com.addBitmapAt( dtAnimation, this.assetStr( "doctor_multiplier" ), 0, 0 );
        let tx1: egret.TextField = this.addGameTextCenterShadow( -50, 104, 18, 0xFFFFFF, "choose a card", false, 260, true, false );
        dtAnimation.addChild( tx1 );
        Com.addBitmapAt( dtAnimation, this.assetStr( "txt_bg" ), -110, -40 );
        let tx2: egret.TextField = Com.addTextAt( dtAnimation, -40, 0, 100, 40, 40, false, true );
        tx2.textColor = 0xFEFE00;
        tx2.text = "X" + luckMultiTimes;
        let tx3: egret.TextField = this.addGameTextCenterShadow( -110, -27, 22, 0x0, "win multiplier", false, 415, true, false );
        dtAnimation.addChild( tx3 );
        let tw: egret.Tween = egret.Tween.get( dtAnimation );
        tw.to( { y: 0 }, 600, egret.Ease.bounceOut );
        this.luckMultiAnimation = dtContainer;

        this.showFourLuckMultis( luckMultiTimes );
    }

    private showFourLuckMultis( luckMultiTimes: number ): void{
        this.luckMultiOnCards = [];
        for( let i: number = 0; i < 4; i++ ){
            this.luckMultiOnCards[i] = this.showCardMultiTimes( luckMultiTimes, i );
        }
    }

    private showLuckTimeAt( luckMultiCardIndex: number ){
        this.winTimesTip[ luckMultiCardIndex ].removeChildren();
        Com.addBitmapAt( this.winTimesTip[ luckMultiCardIndex ], this.assetStr( "x" + this.luckMultiTimes + "_small" ), 0, 2 );
    }

    private givePlayerChanceToChooseCard( letPlayerChoose: boolean ): void{
        this.chooseCardButtons[0].visible = letPlayerChoose;
        this.chooseCardButtons[1].visible = letPlayerChoose;
        this.chooseCardButtons[2].visible = letPlayerChoose;
        this.chooseCardButtons[3].visible = letPlayerChoose;
        if( !letPlayerChoose ){
            this.removeLuckMultiAnimations();
        }
    }

    private removeLuckMultiAnimations(){
        if( this.luckMultiAnimation && this.contains( this.luckMultiAnimation ) ) this.removeChild( this.luckMultiAnimation );
        if( this.luckMultiOnCards && this.luckMultiOnCards.length ){
            for( let i: number = 0; i < 4; i++ ){
                if( this.luckMultiOnCards[i] && this.luckMultiOnCards[i].parent )this.luckMultiOnCards[i].parent.removeChild( this.luckMultiOnCards[i] );
            }
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

    protected showSmallWinResult( cardIndex: number, blinkGrids: Object ): void{
        for( let item in blinkGrids ){
            if( blinkGrids[item].length == 1 && blinkGrids[item][0] == "single_line" ){
                CardManager.setSmallWinTime( cardIndex, parseInt( item ), 0 );
            }
        }
    }

    public changeCardsBg(){
        super.changeCardsBg();
        for( let i: number = 0; i < 4; i++ ){
            if( i > CardManager.enabledCards - 1 )this.winTimesTip[i].visible = false;
            else this.winTimesTip[i].visible = true;
        }
    }

/******************************************************************************************************************************************************************/
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 530, 4 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 25, 16 ), new egret.Rectangle( 0, 20, 200, 20 ), 16, 0xFEFEFE, new egret.Rectangle( 0, 0, 200, 20 ), 16, 0xFEFEFE ) );
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "letter_x": soundName = "bonusBingo_1_mp3";break;
            case "letter_t": soundName = "bonusBingo_1_mp3";break;
            case "four_corners": soundName = "bonusBingo_10_mp3";break;
            case "diagonal_0": soundName = "bonusBingo_10_mp3";break;
            case "diagonal_2": soundName = "bonusBingo_10_mp3";break;
            case "double_line": soundName = "bonusBingo_10_mp3";break;
            case "triple_line": soundName = "bonusBingo_40_mp3";break;
            case "round": soundName = "bonusBingo_250_mp3";break;
            case "four_line": soundName = "bonusBingo_500_mp3";break;
            case "bingo": soundName = "bonusBingo_3000_mp3"; break;
            default: break;
        }
        if (SoundManager.soundOn && soundName !== "") {
            this.playSound(soundName, 1, callback);
        } else {
            callback();
        }
	}

    protected hasExtraBallFit(): void {
        // this.stopSound("t90_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
        }
    }

	protected getExtraBallFit(): void {
		// this.playSound("t90_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
		// this.playSound("t90_card_mp3");
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
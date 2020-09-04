class Hotbingo extends V2Game{

    private superLineAnimation: egret.MovieClip;
    private lastLineUI: HotbingoLastLineBg;

	protected static get classAssetName(){
		return "hotbingo";
	}

    protected static get animationAssetName(){
		return "turbo90Animation";
	}

	public constructor( assetsPath: string ) {
		super( "hotbingo.conf", assetsPath, 54 );
        this.languageObjectName = "hotbingo_tx";

        PaytableUI.textBold = true;
        PayTableManager.layerType = HotbingoPaytalbeLayer;

        CardManager.cardType = HotbingoCard;
        CardManager.gridType = ForkGrid;

        GameCard.showTitleShadow = new egret.GlowFilter(0, 1, 4, 4, 4 );
        CardGrid.defaultNumberSize = 55;

        GameCard.gridOnTop = true;
        BallManager.ballOffsetY = 4;

        this.needListenToolbarStatus = true;
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();

        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt(this, this.runningBallContainer, 901, 170);
        
        this.addChildAt( this.getChildByName( this.assetStr("Backdrop_ENG-1-1") ), this.getChildIndex( this.ballArea ) + 1 );
        this.playingUI( false );
        
        let superLineAnimationFactory = new egret.MovieClipDataFactory(RES.getRes("superline_animation_json"), RES.getRes("superline_animation_png"));
        this.superLineAnimation = new egret.MovieClip(superLineAnimationFactory.generateMovieClipData("superline_animation"));
        this.superLineAnimation.visible = false;
        Com.addObjectAt(this, this.superLineAnimation, 300, 386);

        this.lastLineUI = new HotbingoLastLineBg;
        Com.addObjectAt( this, this.lastLineUI, 420, 845 );
        this.setChildIndex( this.lastLineUI, this.getChildIndex( this.ballArea ) );

        this.ballArea.needLightCheck = true;
        
        this.addLineArrows();
    }

    private playingUI( isPlaying: boolean ){
        this.getChildByName( this.assetStr("Backdrop_ENG-1-1") ).visible = isPlaying;
        this.getChildByName( this.assetStr("lotto_balls") ).visible = !isPlaying;
        this.getChildByName( this.assetStr("lotto_balls_up") ).visible = !isPlaying;
    }

    protected getFitEffectNameList(): Object{
        let firList: Object = {}
        firList["line"] = [];
        firList["line"][0] = "hotbingo_1";
        firList["line"][1] = "hotbingo_2";
        firList["line"][2] = "hotbingo_3";
        firList["double line"] = [];
        firList["double line"][0] = "hotbingo_D_1";
        firList["double line"][1] = "hotbingo_D_2";
        firList["double line"][2] = "hotbingo_D_3";
		return firList;
	}

    private arrowMcs: Array<Array<egret.MovieClip>>;

    private addLineArrows(): void{
        this.arrowMcs = [];
        for( let i: number = 0; i < 4; i++ ){
            this.arrowMcs[i] = [];
            for( let j: number = 0; j < 3; j++ ){
                let arrowAnimation: egret.MovieClip = Com.addMovieClipAt( this, this._mcf, "arrowAnimationInT90", this.cardPositions[i]["x"] - 47, this.cardPositions[i]["y"] + 64 * ( j + 1 ) );
                arrowAnimation.scaleX = 0.92;
                arrowAnimation.stop();
                arrowAnimation.visible = false;
                this.arrowMcs[i][j] = arrowAnimation;
            }
        }
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 0, 0, 199/66 );
        
        this.hotLastBallIndex = ballIndex;
        this.playSound("hb_ball_mp3");
	}

    protected tipStatus( e: egret.Event ): void{
    }

    protected winChange( e: egret.Event ): void{
    }
    
    /**
     * show super line animation
     * @param multiple the multiple of coins.(2 5 10 25)
     */
    private showSuperLineAnimation(multiple: number): void {
        if ([2, 5, 10, 25].indexOf(multiple) === -1) return;
        this.superLineAnimation.once(egret.Event.COMPLETE, this.showSuperLineMultiple.bind(this, multiple), this);
        this.superLineAnimation.gotoAndPlay(1);
        this.superLineAnimation.visible = true;

        this.showSuperLineOnCard();
    }

    private superLineUI: egret.Bitmap;

    private showSuperLineOnCard(): void{
        let checkingString: Array<string> = CardManager.getCheckingStrings();
        let superLineCardIndex: number;
        let superLineLineIndex: number;
        for( let i: number = 0; i < checkingString.length; i++ ){
            superLineCardIndex = i;
            if( checkingString[i].substr( 0, 5 ) == "11111" ){
                superLineLineIndex = 0;
                break;
            }
            else if( checkingString[i].substr( 5, 5 ) == "11111" ){
                superLineLineIndex = 1;
                break;
            }
            else if( checkingString[i].substr( 10 ) == "11111" ){
                superLineLineIndex = 2;
                break;
            }
        }
        if( isNaN(superLineCardIndex) || isNaN(superLineLineIndex) ){
            alert( "no superLine" );
        }
        else{
            let cardPosition: egret.Point = new egret.Point( this.cardPositions[superLineCardIndex]["x"], this.cardPositions[superLineCardIndex]["y"] );
            this.superLineUI = Com.addBitmapAt( this, this.assetStr("super_line"), cardPosition.x + 14, cardPosition.y + superLineLineIndex * 37 + 40 );
            this.superLineUI.alpha = 0.2;
            let tw: egret.Tween = egret.Tween.get( this.superLineUI );
            tw.to( {alpha: 1}, 300 );
            tw.wait( 500 );
            tw.to( {alpha: 0.2}, 200 );
            tw.to( {alpha: 1}, 300 );
            tw.wait( 500 );
            tw.to( {alpha: 0.2}, 200 );
            tw.to( {alpha: 1}, 300 );
        }
    }

    /**
     * show super line multiple
     */
    private showSuperLineMultiple(multiple: number): void {
        let stopPosition = 1;
        switch (multiple) {
            case 2: stopPosition = 30; break;
            case 5: stopPosition = 45;break;
            case 10: stopPosition = 60;break;
            case 25: stopPosition = 75; break;
            default: break;
        }
        this.superLineAnimation.gotoAndStop(stopPosition);
        egret.setTimeout(function () {
            this.superLineAnimation.visible = false;
        }, this, 500);
    }

    protected afterCheck( resultList: Array<Object> ): void{
        this.payTableArea.clearPaytableFgs();
        super.afterCheck( resultList );
        this.clearArrow();
        for( let i: number = 0; i < 4; i++ ){
            if( resultList[i]["line"] && resultList[i]["line"]["unfitIndexs"] ){
                for( let line in resultList[i]["line"]["unfitIndexs"] ){
                    let arrow: egret.MovieClip = this.arrowMcs[i][line];
                    arrow.visible = true;
                    arrow.gotoAndPlay(1);
                }
            }
        }
    }

    private clearArrow(): void{
        for( let i: number = 0; i < 4; i++ ){
            for( let j: number = 0; j < 3; j++ ){
                let arrow: egret.MovieClip = this.arrowMcs[i][j];
                arrow.visible = false;
                arrow.stop();
            }
        }
    }

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayerForHotbingo( new egret.Point( 192, 30 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 86, 92, 437, 40 ), 40, 0xFFFFFF ) );
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
        super.getPaytablesFit( paytabledName, callback );
        if( paytabledName == "line" ) this.testSuperLine();
	}

    protected testSuperLine(): void{
        if( this.currentBallIndex <= 18 ){
            let strArr: Array<string> = this.hotbingoData.getUtfStringArray( "" + this.hotLastBallIndex );
            let item: string;
            for( let i: number = 0; i < strArr.length; i++ ){
                if( strArr[i].indexOf( "superlinha" ) >= 0 ){
                    item = strArr[i];
                    break;
                }
            }
            item = item.substr( 0, item.indexOf( ")" ) );
            item = item.substr( item.indexOf( "(" ) + 1 );
            this.showSuperLineAnimation( parseInt( item ) );
        }
    }

	protected onBetChanged( event: egret.Event ): void{
        if (event.data["type"] !== 0) this.playSound("hb_bet_mp3");
	}

    protected hasExtraBallFit(): void {
        this.stopSound("hb_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("hb_extra_loop_mp3", -1);
            this.playSound("hb_have_extra_ball_mp3");
        }
    }

    private hotbingoData: any;
    private hotLastBallIndex: number;

    public onPlay( data: Object, hotData: any ){
        super.onPlay( data );
        this.hotbingoData = hotData;
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("hb_ball_mp3");
        this.stopSound("hb_extra_loop_mp3");
        this.playingUI( false );
        ( this.jackpotArea as JackpotLayerForHotbingo ).running( false );
    }

    protected getExtraBallFit(): void {
		this.playSound("hb_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
		this.playSound("hb_card_mp3");
	}

    protected startPlay(): void {
        super.startPlay();
        this.clearArrow();
        this.playingUI( true );
        ( this.jackpotArea as JackpotLayerForHotbingo ).running( true );
        this.payTableArea.clearPaytableFgs();
        if( this.superLineUI && this.contains( this.superLineUI ) )this.removeChild( this.superLineUI );
	}
}
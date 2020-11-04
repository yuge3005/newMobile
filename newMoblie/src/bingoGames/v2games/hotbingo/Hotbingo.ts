class Hotbingo extends V2Game{

    private superLineUI: SuperLineUI;
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

        GameCardUISettings.showTitleShadow = new egret.GlowFilter(0, 1, 4, 4, 4 );
        CardGridColorAndSizeSettings.defaultNumberSize = 55;

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
        
        this.superLineUI = new SuperLineUI;
        Com.addObjectAt(this, this.superLineUI, 1000, 575);

        this.lastLineUI = new HotbingoLastLineBg;
        Com.addObjectAt( this, this.lastLineUI, 420, 845 );
        this.setChildIndex( this.lastLineUI, this.getChildIndex( this.ballArea ) );

        this.ballArea.needLightCheck = true;

        this.arrowArea = new CardArrowLayer( MDS.mcFactory, "arrowAnimationInT90", new egret.Point( -47, 64 ), 64, 0.92 );
        this.addChild( this.arrowArea );
    }

    private playingUI( isPlaying: boolean ){
        this.getChildByName( this.assetStr("Backdrop_ENG-1-1") ).visible = isPlaying;
        this.getChildByName( this.assetStr("lotto_balls") ).visible = !isPlaying;
        this.getChildByName( this.assetStr("lotto_balls_up") ).visible = !isPlaying;
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
    private showSuperLineAnimation(multiple: number, callback: Function): void {
        if ([2, 5, 10, 25].indexOf(multiple) === -1) return;
        this.showSuperLineOnCard();
        this.superLineUI.playWheel(multiple, callback);
    }

    private superLineIcon: egret.Bitmap;

    private showSuperLineOnCard(): void{
        let pt: egret.Point = this.superLineUI.getLinePosition( CardManager.getCheckingStrings() );

        if( pt ){
            let linePosition: egret.Point = GameCardUISettings.positionOnCard( pt.x, pt.y );
            this.superLineIcon = Com.addBitmapAt( this, this.assetStr("super_line"), linePosition.x, linePosition.y );
            this.superLineIcon.alpha = 0.2;
            let tw: egret.Tween = egret.Tween.get( this.superLineIcon );
            tw.to( {alpha: 1}, 300 );
            tw.wait( 500 );
            tw.to( {alpha: 0.2}, 200 );
            tw.to( {alpha: 1}, 300 );
            tw.wait( 500 );
            tw.to( {alpha: 0.2}, 200 );
            tw.to( {alpha: 1}, 300 );
        }
        else{
            alert( "super line index error" );
        }
    }

    protected afterCheck( resultList: Array<Object> ): void{
        this.payTableArea.clearPaytableFgs();
        super.afterCheck( resultList );
        this.arrowArea.arrowBlink(resultList);
    }

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayerForHotbingo( new egret.Point( 192, 30 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 86, 92, 437, 40 ), 40, 0xFFFFFF ) );
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
        if( paytabledName == "line" && this.currentBallIndex <= 18 ) this.playSuperLine( callback );
        else super.getPaytablesFit( paytabledName, callback );
	}

    protected playSuperLine( callback: Function ): void{
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
        this.showSuperLineAnimation( parseInt( item ), callback );
        this.playSound( "hb_super_line_wav" );
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
        this.arrowArea.clearArrow();
        this.playingUI( true );
        ( this.jackpotArea as JackpotLayerForHotbingo ).running( true );
        this.payTableArea.clearPaytableFgs();
        if( this.superLineIcon && this.contains( this.superLineIcon ) )this.removeChild( this.superLineIcon );
	}
}
class Pachinko2 extends V2Game{

    protected static get classAssetName(){
		return "pachinko2";
	}

    protected static get animationAssetName(){
		return "pachinko2Animation";
	}

	public constructor( assetsPath: string ) {
        super( "pachinko2.conf", assetsPath, 61 );
        this.languageObjectName = "forAll_tx";

        CardManager.cardType = ExtraBlinkCard;
		CardManager.gridType = Pachinko2Grid;
        GameCard.useRedEffect = true;
        CardGrid.defaultNumberSize = 55;
        BallManager.textBold = true;

        PayTableManager.paytableUIType = Pachinko2PaytableUI;
        BallManager.ballOffsetY = 5;

        this.needSmallWinTimesOnCard = true;
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();

        if( this.extraUIObject ) this.extraUIShowNumber();
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 45, 16, 190 / 96 );

        this.playSound("ball_come_out_mp3");

        this.delayRemoveRunningBallUI();
	}

    private delayTimeoutId = 0;
    private delayRemoveRunningBallUI(){
        clearTimeout( this.delayTimeoutId );
        this.delayTimeoutId = setTimeout( this.removeRunningBallUI.bind(this), 3000 );
    }

    private removeRunningBallUI(){
        if( this.runningBallUI && this.runningBallContainer && ( this.runningBallContainer ).contains( this.runningBallUI ) ){
			( this.runningBallContainer ).removeChild( this.runningBallUI );
		}
    }

    protected clearRunningBallUI(): void{
	}

    protected extraUIShowNumber(){
        this.extraUIObject.visible = true;
        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.runningBallContainer.x = this.extraUIObject.x;
        this.runningBallContainer.y = this.extraUIObject.y;
        this.addChildAt( this.runningBallContainer, this.getChildIndex( this.extraUIObject ) );
        Com.addObjectAt( this.runningBallContainer, this.extraUIObject, 0, 0 );

        Com.addMovieClipAt( this.runningBallContainer, MDS.mcFactory, "pachinko2_cat", 927 - this.runningBallContainer.x, 125 - this.runningBallContainer.y );
        this.extraUIObject = Com.addMovieClipAt( this, MDS.mcFactory, "pachinko2Extra", 851, 344 );
        this.extraUIObject.visible = false;
        this.addChildAt( this.extraUIObject, this.getChildIndex( this.ballArea ) );
        this.addChildAt( this.runningBallContainer, this.getChildIndex( this.ballArea ) + 1 );
        ( this.extraUIObject as egret.MovieClip ).stop();
    }

    protected showExtraUI( show: boolean = true ){
        if( this.extraUIObject ){
            let extraUI : egret.MovieClip = this.extraUIObject as egret.MovieClip;
            if( extraUI.visible != show ){
                extraUI.visible = show;
                if( show ) extraUI.gotoAndPlay( 1, 1 );
            }
        }
	}

/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1290, 55 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 10, 20, 420, 48 ), 48, 0xFFFFFF, new egret.Rectangle( 0, -44, 430, 36 ), 36, 0xFFFFFF ) );
        this.jackpotArea.jackpotText.textAlign = "left";
        this.jackpotArea.jackpotText.fontFamily = "Arail";
    }

    protected hasExtraBallFit(): void {
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("extra_mode_start_mp3");
        }

        ExtraBlinkGrid.extraBink = true;
    }

    public onRoundOver( data: Object ){
        super.onRoundOver( data );
        if( data["ganho"] ) this.playSound( "CASH_Any_Win_End_of_Round_mp3" );
    }

    protected roundOver(): void {
		super.roundOver();
        
        ExtraBlinkGrid.extraBink = false;
    }

	protected getExtraBallFit(): void {
		this.playSound("extra_ball_come_out_mp3");
	}

	protected collectExtraBall(): void {
		this.playSound("CASH_Any_Win_End_of_Round_mp3");
	}

	protected changeNumberSound(): void {
		this.playSound("change_cards_mp3");
	}
}
class Goldball extends GoldSilverSuper{
	protected static get classAssetName(){
        return "goldball";
    }

    protected static get animationAssetName(){
        return "lotto";
    }

	public constructor( assetsPath: string ) {
		super( "goldball.conf", assetsPath, 56 );

        PayTableManager.layerType = GoldBallPaytableLayer;

        CardGrid.defaultNumberSize = 52;
	}

    protected init() {
        super.init();

        this.showNoBetAndCredit();
    }

    protected showExtraUI( show: boolean = true ){
        if( this.extraUIObject ){
            let tw: egret.Tween = egret.Tween.get( this.extraUIObject );
            if( !show )tw.to( { scaleX: 1, scaleY: 1 }, 500 );
            else{
                tw.to( { scaleX: 0.76, scaleY: 0.76 }, 500 );
            }
        }
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt(ballIndex, 0, 0);
        this.runningBallUI.anchorOffsetX = this.runningBallUI.width >> 1;
        this.runningBallUI.anchorOffsetY = this.runningBallUI.height >> 1;
        
        this.playSound("gb_ball_mp3");
	}

    protected extraUIShowNumber(){
        this.extraUIObject.visible = true;
        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.runningBallContainer.x = 1000;
        this.runningBallContainer.y = 290;
        this.addChildAt( this.runningBallContainer, this.getChildIndex( this.ballArea ) + 1 );
        this.extraUIObject.anchorOffsetX = this.extraUIObject.width >> 1;
        this.extraUIObject.anchorOffsetY = this.extraUIObject.height >> 1;
        Com.addObjectAt( this.runningBallContainer, this.extraUIObject, 0, 0 );
        this.extraUIObject = this.runningBallContainer;
    }

/******************************************************************************************************************************************************************/
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1297, 104 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 0, 40, 550, 36 ), 36, 0xff0000, new egret.Rectangle( 0, -50, 550, 40 ), 40, 0x3d2312, true ) );
    }

	protected onBetChanged( event: egret.Event ): void{
        super.onBetChanged(event);
	}

    protected hasExtraBallFit(): void {
        this.stopSound("gb_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("gb_have_extra_ball_wav");
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("gb_ball_mp3");
    }

	protected getExtraBallFit(): void {
		this.playSound("gb_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
		this.playSound("gb_card_mp3");
	}
}
class Aztec extends AztecPharosSuper{

	protected static get classAssetName(){
		return "aztec";
	}

    protected static get animationAssetName(){
		return "pharosAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "aztec.conf", assetsPath, 50 );

        PayTableManager.layerType = AztecPaytableLayer;
        CardGridColorAndSizeSettings.defaultNumberSize = 45;

        BallManager.ballOffsetY = 5;
        BallManager.textBold = true;

        this.extraPosition1 = -220;
        this.extraPosition2 = -380;
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 613, 39 );

        SoundManager.play( "azt14_wav" );
        if (this.btExtra && (this.currentBallIndex === this.gratisNumber - 1)) this.playSound("azt3_wav");
	}

    protected getGratisUI(): egret.DisplayObject{
        return Com.addBitmapAt( this, this.assetStr( "FreeEB" ), 0, 0 );
    }

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 60, 360 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 0, 0, 397, 119 ), 36, 0xFFEC80, new egret.Rectangle( 0, -50, 397, 36 ), 36, 0xFEEB82, true ) );
    }
    
    protected hasExtraBallFit(): void {
        this.stopSound("azt14_wav");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("azt5_wav");
            this.showFreeExtraPosition();
        }
    }

    protected roundOver(): void {
        super.roundOver();
        this.stopSound("azt14_wav");
    }

	protected getExtraBallFit(): void {
		this.playSound("azt13_wav");
	}
}
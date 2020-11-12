class Aztec extends AztecPharosSuper{

	protected static get classAssetName(){
		return "aztec";
	}

    protected static get animationAssetName(){
		return "pharosAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "aztec.conf", assetsPath, 50 );

        CardGridColorAndSizeSettings.defaultNumberSize = 45;

        BallManager.ballOffsetY = 5;
        BallManager.textBold = true;

        this.extraPosition1 = -220;
        this.extraPosition2 = -380;
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();

        // this.addGameText( 35, 352, 16, 0xE8D4AF, "bingo",false, 200 );
        // this.addGameText( 35, 379, 16, 0xE8D4AF, "three side",false, 200 );
        // this.addGameText( 35, 406, 16, 0xE8D4AF, "two side",false, 200 );
        // this.addGameText( 35, 433, 16, 0xE8D4AF, "one side",false, 200 );
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
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 20, 205 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 2, 18 ), new egret.Rectangle( 0, 45, 165, 20 ), 20, 0xd6c576, new egret.Rectangle( 0, 0, 165, 20 ), 20, 0xeddb93 ) );
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
class Prakaramba extends V2Game{

    protected static get classAssetName(){
		return "prakaramba";
	}

    protected static get animationAssetName(){
		return "showballAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "prakaramba.conf", assetsPath, 48 );
        this.languageObjectName = "forAll_tx";

        GameCard.gridOnTop = true;
        CardGrid.defaultNumberSize = 48;
        GameCard.useRedEffect = true;

        this.needSmallWinTimesOnCard = true;
        this.ballArea.needLightCheck = true;

        PayTableManager.bingoPaytableName = "pra_bingo";
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();

        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.runningBallContainer.scaleX = this.runningBallContainer.scaleY = 0.8;
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 0, 0 );
        Com.addObjectAt(this, this.runningBallContainer, 114, 272);
        
        this.playSound("prak3_wav");
	}

    protected clearRunningBallUI(): void{
        if( this.runningBallContainer && this.contains( this.runningBallContainer ) )this.removeChild( this.runningBallContainer );
	}

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 53, 10 ), jackpot, jackpotMinBet, betConfig, new egret.Point( -6, 7 ), new egret.Rectangle( 0, 25, 120, 14 ), 14, 0xFEFEFE, new egret.Rectangle( 0, 0, 120, 14 ), 14, 0xFEFE00 ) );
    }

    protected hasExtraBallFit(): void {
        this.stopSound("prak3_wav");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("prak29_mp3");
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("prak3_wav");
    }

	protected getExtraBallFit(): void {
		this.playSound("prak9_mp3");
	}

	protected collectExtraBall(): void {
		this.playSound("prak8_mp3");
	}
}
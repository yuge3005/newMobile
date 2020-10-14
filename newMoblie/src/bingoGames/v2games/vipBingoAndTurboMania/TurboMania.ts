class TurboMania extends VipManiaSuper{

    protected static get classAssetName(){
		return "turbomania";
	}

    protected static get animationAssetName(){
		return "turbomaniaAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "turbomania.conf", assetsPath, 51 );
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();

        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, this.runningBallContainer, 880, 258 );
    }

    protected hasExtraBallFit(): void {
        this.stopSound("tb16_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("tb15_mp3", -1);
            this.playSound("tb7_mp3");
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("tb16_mp3");
        this.stopSound("tb15_mp3");
    }

	protected getExtraBallFit(): void {
        this.playSound("tb13_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
        this.playSound("tb9_mp3");
	}
    
    protected startPlay(): void {
        super.startPlay();
        this.stopSound("tb2_mp3");
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall(ballIndex);

        this.playSound("tb16_mp3");
	}
}
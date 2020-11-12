class Vipbingo extends VipManiaSuper{

    protected static get classAssetName(){
		return "vipbingo";
	}

    protected static get animationAssetName(){
		return "vipbingoAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "vipbingo.conf", assetsPath, 52 );
	}

    protected init(){
        super.init();

        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, this.runningBallContainer, 900, 279 );
    }

    protected hasExtraBallFit(): void {
        this.stopSound("vb16_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("vb15_mp3", -1);
            this.playSound("vb7_mp3");
        }
    }
    
    protected roundOver(): void{
        super.roundOver();
        this.stopSound("vb15_mp3");
        this.stopSound("vb16_mp3");
    }

	protected getExtraBallFit(): void {
        this.playSound("vb13_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}
    
    protected startPlay(): void {
        super.startPlay();
        this.stopSound("vb2_mp3");
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall(ballIndex);

        this.playSound("vb16_mp3");
	}
}
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

    protected combinString( str: string ){
        return "card_" + str;
    }

    protected init(){
        super.init();

        MDS.addGameTextCenterShadow( this,  312, 10, 18, 0xFEFE00, "credit", true, 160, true, false );
        MDS.addGameTextCenterShadow( this,  312, 58, 18, 0xFEFE00, "bet", true, 160, true, false );
        MDS.addGameTextCenterShadow( this,  312, 114, 18, 0xFEFE00, "prize", true, 160, true, false );

        this.creditText = MDS.addGameTextCenterShadow( this,  312, 30, 17, 0xFEFE00, "credit", true, 160, true, false );
        this.betText = MDS.addGameTextCenterShadow( this,  312, 80, 18, 0xFFFFFF, "bet", true, 160, true, false );
        this.prizeText = MDS.addGameTextCenterShadow( this,  312, 135, 18, 0xFFFFFF, "prize", true, 160, true, false );
        this.prizeText.text = "0";

        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, this.runningBallContainer, 878, 258 );

        this.ballArea.needLightCheck = true;
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
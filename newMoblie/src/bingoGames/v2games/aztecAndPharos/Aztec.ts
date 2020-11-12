class Aztec extends AztecPharosSuper{

	protected static get classAssetName(){
		return "aztec";
	}

    protected static get animationAssetName(){
		return "pharosAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "aztec.conf", assetsPath, 50 );

        CardGridColorAndSizeSettings.defaultNumberSize = 50;

        BallManager.ballOffsetY = 8;
        BallManager.textBold = true;
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
        super.showLastBallAt( ballIndex, 119, 22 );

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

    protected getPaytablesFit(paytabledName: string, callback: Function = null): void{
        let soundName = "";
        switch (paytabledName) {
            case "one side": soundName = "azt10_wav"; break;
            case "two side": soundName = "azt9_wav"; break;
            case "three side": soundName = "azt2_wav"; break;
            case "bingo": soundName = "azt6_wav";break;
            default: break;
        }
        if (SoundManager.soundOn && soundName !== "") {
            this.playSound(soundName, 1, callback);
        } else {
            callback();
        }
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
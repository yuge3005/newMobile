class SilverBall extends GoldSilverSuper{
    protected static get classAssetName(){
		return "silver_ball";
	}

    protected static get animationAssetName(){
		return "silver_animation";
	}

    public constructor(assetsPath: string) {
        super("silver_ball.conf", assetsPath, 49 );

        CardManager.gridType = TowerGrid;

        TowerGrid.blink1PicName = "Mark_Green";
        TowerGrid.blink2PicName = "Mark_Orange";
        TowerGrid.defaultBgPicName = "Mark_White";
        TowerGrid.onEffBgPicName = "Mark_Blue";
        TowerGrid.linePicName = "Mark_Red";

        GameCard.cardTextRect = new egret.Rectangle( 30, 27, 220, 40 );
        GameCard.betTextRect = new egret.Rectangle( 300, 27, 300, 40 );
        GameCard.texColor = 0xFFFFFF;

        CardGrid.defaultBgColor = 0xE9E9E9;
        CardGrid.defaultNumberSize = 52;

        BallManager.ballOffsetY = 10;

        CardGrid.blinkColors1 = 0xC4770D;
	    CardGrid.blinkColors2 = 0xE9E9E9;

        this.needListenToolbarStatus = true;
        this.tipStatusTextPosition = new egret.Rectangle( 512, 80, 288, 18 );
        this.tipStatusTextColor = 0xF9CC15;
    }

    protected init() {
        super.init();

        let bingo = this.addGameText(22, 9, 18, 0xF9CC15, "bingo", false, 120);
        let double = this.addGameText(22, 30, 18, 0xF9CC15, "double", false, 120);
        let line = this.addGameText(22, 51, 18, 0xF9CC15, "line", false, 120);

        this.addGameText(22, 80, 18, 0x585858, "extraball", false, 120);
        this.addGameText(22, 111, 18, 0xF9CC15, "bet", false, 120);
        this.addGameText(522, 111, 18, 0xF9CC15, "credit", false, 120);

        this.betText = this.addGameText(116, 111, 18, 0xF9CC15, "bet", false, 150);
        this.betText.textAlign = "right";
        this.creditText = this.addGameText(580, 111, 18, 0xF9CC15, "credit", false, 200);
        this.creditText.textAlign = "right";

        let mc: egret.MovieClip = this.getChildByName( "silver_ball_json.silverball" ) as egret.MovieClip;
        mc.scaleX = mc.scaleY = 1.3;
        mc.x = 790;
        mc.y = 25;
    }

    protected showExtraUI( show: boolean = true ){
        // do nothing
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt(ballIndex, 0, 0, 23/13 );
        
        this.playSound("slb_ball_wav");
	}

/******************************************************************************************************************************************************************/
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 527, 10 ), jackpot, jackpotMinBet, betConfig, new egret.Point( -20, -6 ), new egret.Rectangle( 0, 35, 200, 22 ), 20, 0x00FF00, new egret.Rectangle( 0, 0, 200, 26 ), 24, 0x00FF00 ) );
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "line": soundName = "slb_1line_mp3"; break;
            case "double": soundName = "slb_2line_mp3"; break;
            case "bingo": soundName = "slb_bingo_mp3";break;    
            default: break;
        }
        if (SoundManager.soundOn && soundName !== "") {
            this.playSound(soundName, 1, callback);
        } else {
            callback();
        }
	}

	protected onBetChanged( event: egret.Event ): void{
        super.onBetChanged(event);
	}

    protected hasExtraBallFit(): void {
        this.stopSound("slb_ball_wav");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("slb_have_extra_ball_wav");
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("slb_ball_wav");
    }

	protected getExtraBallFit(): void {
		this.playSound("slb_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
		this.playSound("slb_crad_wav");
	}
}
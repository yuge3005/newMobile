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

    protected combinString( str: string ){
        return "mania_card_" + str;
    }

    protected init(){
        super.init();

        this.addGameTextCenterShadow( 335, 15, 18, 0xFEFE00, "credit", true, 140, true, false );
        this.addGameTextCenterShadow( 335, 65, 18, 0xFEFE00, "bet", true, 140, true, false );
        this.addGameTextCenterShadow( 335, 118, 18, 0xFEFE00, "prize", true, 140, true, false );

        this.creditText = this.addGameTextCenterShadow( 335, 36, 16, 0xFEFE00, "credit", false, 140, true, false );
        this.betText = this.addGameTextCenterShadow( 335, 86, 17, 0xFFFFFF, "bet", false, 140, true, false );
        this.prizeText = this.addGameTextCenterShadow( 335, 140, 17, 0xFFFFFF, "prize", false, 140, true, false );
        this.prizeText.text = "0";

        this.runningBallContainer = new egret.DisplayObjectContainer;
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
        let soundName = "";
        switch (paytabledName) {
            case "vip_v": soundName = "tb4_mp3"; break;
            case "vip_t": soundName = "tb3_mp3"; break;
            case "vip_l": soundName = "tb14_mp3"; break;
            case "vip_v2": soundName = "tb4_mp3"; break;
            case "vip_round": soundName = "tb5_mp3"; break;
            case "vip_line": soundName = "tb2_mp3"; break;
            case "vip_h": soundName = "tb17_mp3"; break;
            case "vip_corner": soundName = "tb8_mp3"; break;
            case "vip_double_line": soundName = "tb2_mp3"; break;
            case "vip_bingo": soundName = "tb10_mp3"; break;
            case "vip_gun": soundName = "tb14_mp3"; break;
            case "vip_mouse": soundName = "tb5_mp3"; break;
            default: break;    
        }
        if (SoundManager.soundOn && soundName !== "") {
            this.playSound(soundName, 1, callback);
        } else {
            callback();
        }
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
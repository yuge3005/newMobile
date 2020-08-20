class Showball3 extends ShowballSuper{

    protected static get classAssetName(){
		return "showball3";
	}

    protected static get animationAssetName(){
		return "showballAnimation";
	}

    public constructor( assetsPath: string ) {
        super( "showball3.conf", assetsPath, 20 );
        this.ptFilterConfig = "showball3_filt";
        this.languageObjectName = "showball3_tx";
    }
    
    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "pt_x": 
            case "pt_v": 
            case "plus": 
            case "pt_line": 
            case "pt_mouse": 
            case "pt_trangle": soundName = "shb_win_wav"; break;
            case "pt_bingo": soundName = "shb_bingo_mp3"; break;
            case "pt_xx": soundName = "shb_2trangle_wav"; break;
            case "pt_m": soundName = "shb_m_mp3"; break;
            case "pt_fly": soundName = "shb_m_w_mp3"; break; 
            case "pt_round": soundName = "shb_round_wav"; break;
            case "double_line": soundName = "shb_double_line_mp3"; break; 
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

        if (event.data["type"] !== 0) this.playSound("shb_bet_mp3");
	}
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("shb_ball_mp3");
        this.stopSound("shb_1to_bingo_mp3");
    }

	protected getExtraBallFit(): void {
		this.playSound("shb_extra_ball_mp3");
	}

	protected changeNumberSound(): void {
        super.changeNumberSound();
		this.playSound("shb_card_wav");
	}

	protected showLastBall( ballIndex: number ): void{
        super.showLastBall(ballIndex);
        
        this.playSound("shb_ball_mp3");
	}
}
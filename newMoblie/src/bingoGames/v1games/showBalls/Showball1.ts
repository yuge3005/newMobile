class Showball1 extends ShowballSuper{

    protected static get classAssetName(){
		return "showball1";
	}

    protected static get animationAssetName(){
		return "showballAnimation";
	}

    public constructor( assetsPath: string ) {
        super( "showball1.conf", assetsPath, 22 );
        this.ptFilterConfig = "showball3_filt";
    }
    
	protected getFitEffectNameList(): Object{
        let firList: Object = {}
        firList["pt_line"] = [];
        firList["pt_line"][0] = this.combinString( "line1" );
        firList["pt_line"][1] = this.combinString( "line2" );
        firList["pt_line"][2] = this.combinString( "line3" );
        firList["double_line"] = [];
        firList["double_line"][0] = this.combinString( "dbline1" );
        firList["double_line"][1] = this.combinString( "dbline2" );
        firList["double_line"][2] = this.combinString( "dbline3" );
        firList["pt_v"] = [];
        firList["pt_v"][0] = this.combinString( "v" );
        firList["pt_v"][1] = this.combinString( "v2" );
        firList["pt_trangle"] = [];
        firList["plus"] = "card_plus";
        firList["pt_trangle"][0] = this.combinString( "trangle" );
        firList["pt_trangle"][1] = this.combinString( "trangle2" );
        firList["pt_mouse"] = this.combinString( "mouse" );
        firList["pt_x"] = "Bitma1";
        firList["pt_m"] = [];
        firList["pt_m"][0] = this.combinString( "m" );
        firList["pt_m"][1] = this.combinString( "w" );
        firList["pt_fly"] = this.combinString( "fly" );
        firList["pt_xx"] = this.combinString( "xx" );
        firList["pt_round"] = this.combinString( "round" );
        firList["pt_bingo"] = this.combinString( "bingo" );
		return firList;
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
            case "pt_w": soundName = "shb_w_mp3"; break;    
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
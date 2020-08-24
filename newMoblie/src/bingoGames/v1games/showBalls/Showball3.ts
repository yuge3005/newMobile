class Showball3 extends ShowballSuper{

    protected static get classAssetName(){
		return "showball3";
	}

    protected static get animationAssetName(){
		return "showballAnimation";
	}

    public constructor( assetsPath: string ) {
        super( "showball3.conf", assetsPath, 20 );
        this.languageObjectName = "showball3_tx";
    }
    
    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
        let soundName = this.getSoundName( paytabledName );
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
class Goldball extends GoldSilverSuper{
	protected static get classAssetName(){
        return "goldball";
    }

    protected static get animationAssetName(){
        return "lotto";
    }

	public constructor( assetsPath: string ) {
		super( "goldball.conf", assetsPath, 56 );

        GameCard.texColor = 0xFFFFFF;

        CardGrid.defaultNumberSize = 52;
	}

    protected init() {
        super.init();

        this.addGameText( 15, 16, 15, 0xF6E28B, "bingo",false, 200 ).italic = true;
        this.addGameText( 15, 36, 15, 0xF6E28B, "double",false, 200 ).italic = true;
        this.addGameText( 15, 56, 15, 0xF6E28B, "line",false, 200 ).italic = true;

        let bet: egret.TextField = this.addGameText( 15, 123, 17, 0xF6E28B, "bet", true, 100 );
        bet.italic = true;
        bet.text = Utils.toFirstUpperCase( bet.text );
        let credit: egret.TextField = this.addGameText( 535, 123, 17, 0xF6E28B, "credit", true, 100 );
        credit.italic = true;
        credit.text = Utils.toFirstUpperCase( credit.text );

        this.betText = this.addGameTextCenterShadow( 75, 123, 17, 0xFFFFFF, "bet", false, 180, true, false );
	    this.betText.textAlign = "right";
        this.creditText = this.addGameTextCenterShadow( 596, 123, 17, 0xFFFFFF, "credit", false, 180, true, false );
	    this.creditText.textAlign = "right";
    }

    protected showExtraUI( show: boolean = true ){
        if( this.extraUIObject ){
            let tw: egret.Tween = egret.Tween.get( this.extraUIObject );
            if( !show )tw.to( { x: 306, y: 19, scaleX: 1, scaleY: 1 }, 500 );
            else{
                tw.to( { x: 328, y: 43, scaleX: 0.70, scaleY: 0.70 }, 500 );
            }
        }
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt(ballIndex, 0, 0);
        
        this.playSound("gb_ball_mp3");
	}

/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 538, 18 ), jackpot, jackpotMinBet, betConfig, new egret.Point( -11, -8 ), new egret.Rectangle( 0, 25, 200, 26 ), 20, 0xff0000, new egret.Rectangle( 0, 0, 200, 14), 14, 0x3d2312 ) );
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "line": soundName = "gb_1line_mp3"; break;
            case "double": soundName = "gb_2line_mp3"; break;
            case "bingo": soundName = "gb_bingo_mp3";break;    
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
        this.stopSound("gb_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("gb_have_extra_ball_wav");
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("gb_ball_mp3");
    }

	protected getExtraBallFit(): void {
		this.playSound("gb_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
		this.playSound("gb_card_mp3");
	}
}
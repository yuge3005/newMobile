class DoubleTurbo90 extends V2Game{

    protected static get classAssetName(){
		return "doubleTurbo90";
	}

    protected static get animationAssetName(){
		return "turbo90Animation";
	}

	public constructor( assetsPath: string ) {
		super( "doubleTurbo90.conf", assetsPath, 57 );
        this.languageObjectName = "turbo90_tx";

        PaytableUI.textBold = true;

		GameCard.gridOnTop = true;

        CardManager.cardType = DoubleTurbo90Card;
        CardManager.gridType = Turbo90Grid;
        
        CardGrid.defaultNumberSize = 32;

        CardGrid.blinkColors1 = 0xFFFFFF;
	    CardGrid.blinkColors2 = 0xFF00FF;
        GameCard.useRedEffect = true;

        this.ballArea.needLightCheck = true;

        this.needListenToolbarStatus = true;
        this.tipStatusTextPosition = new egret.Rectangle( 30, 487, 306, 18 );
        this.tipStatusTextColor = 0xFEFE00;

        BingoBackGroundSetting.gameMask = new egret.Rectangle( 0, 0, 2000, 1125 );
    }

    protected init(){
        super.init();

        this.addGameText( 315, 16, 16, 0x46C8F5, "bingo",false, 200 );
        this.addGameText( 315, 36, 16, 0x46C8F5, "double line",false, 200 );
        this.addGameText( 315, 56, 16, 0x46C8F5, "line",false, 200 );
        this.addGameText( 315, 76, 16, 0x46C8F5, "four corners",false, 200 );

        this.addGameText( 30, 412, 18, 0xFEFE00, "bet", true, 100 );
        this.addGameText( 30, 433, 18, 0xFEFE00, "credit", true, 100 );

        this.betText = this.addGameTextCenterShadow( 120, 412, 18, 0xFFFFFF, "bet", true, 190, true, false );
        this.creditText = this.addGameTextCenterShadow( 120, 432, 18, 0xFEFE00, "credit", true, 190, true, false );
        this.betText.textAlign = "right";
        this.creditText.textAlign = "right";

        let cardAreaBg: egret.Bitmap = Com.addBitmapAt( this, "cards_background_png", 814, 127 );
        this.setChildIndex( cardAreaBg, this.getChildIndex( this.cardArea ) );
        cardAreaBg.width = 968;
        cardAreaBg.height = 810;

        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addBitmapAt( this.runningBallContainer, this.assetStr( "lotto_gate" ), 0, 0 );
        this.coverRunningBall = Com.addBitmapAt( this.runningBallContainer, this.assetStr( "lotto_gate_front" ), 0, 0 );
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 19, -10 );
        Com.addObjectAt( this.runningBallContainer, this.coverRunningBall, 0, 0 );
        Com.addObjectAt(this, this.runningBallContainer, 128, 0);
        
        this.playSound("dt_ball_mp3");
	}

    protected clearRunningBallUI(): void{
        if( this.runningBallContainer && this.contains( this.runningBallContainer ) )this.removeChild( this.runningBallContainer );
	}

/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 567, 15 ), jackpot, jackpotMinBet, betConfig, new egret.Point( -20, -9 ), new egret.Rectangle( 0, 40, 200, 26 ), 22, 0xd6c576, new egret.Rectangle( 0, 0, 200, 24), 24, 0xd6c576 ) );
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "line": soundName = "dt_1line_mp3"; break;
            case "double line": soundName = "dt_2line_mp3"; break;
            case "four corners": soundName = "dt_4corners_mp3"; break;
            case "bingo": soundName = "dt_bingo_mp3"; break;
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

        if (event.data["type"] !== 0) this.playSound("dt_bet_mp3");
	}

    protected hasExtraBallFit(): void {
        this.stopSound("dt_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("dt_extra_loop_mp3", -1);
            this.playSound("dt_have_extra_ball_mp3");
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.playSound("dt_round_over_mp3");
        this.stopSound("dt_ball_mp3");
        this.stopSound("dt_extra_loop_mp3");
    }

    protected getExtraBallFit(): void {
		this.playSound("dt_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
		this.playSound("dt_card_mp3");
	}
}
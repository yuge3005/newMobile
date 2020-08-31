class DoubleTurbo90 extends V2Game{

    protected static get classAssetName(){
		return "doubleTurbo90";
	}

    protected static get animationAssetName(){
		return "turbo90Animation";
	}

	public constructor( assetsPath: string ) {
		super( "doubleTurbo90.conf", assetsPath, 57 );
        this.languageObjectName = "doubleTurbo90_tx";

        PaytableUI.textBold = true;

		GameCard.gridOnTop = true;

        CardManager.cardType = DoubleTurbo90Card;
        CardManager.gridType = Turbo90Grid;
        
        CardGrid.defaultNumberSize = 32;

        CardGrid.blinkColors1 = 0xFFFFFF;
	    CardGrid.blinkColors2 = 0xFF00FF;
        GameCard.useRedEffect = true;

        this.ballArea.needLightCheck = true;
        BallManager.ballOffsetY = 3;
        BallManager.textBold = true;

        BingoBackGroundSetting.gameMask = new egret.Rectangle( 0, 0, 2000, 1125 );
    }

    protected init(){
        super.init();

        let paytableBg: DoubleTurbo90PTBG = new DoubleTurbo90PTBG;
        Com.addObjectAt( this, paytableBg, 283, 16 );

        this.addDouble90GameText( 34, "bingo");
        this.addDouble90GameText( 74, "double line");
        this.addDouble90GameText( 110, "line");
        this.addDouble90GameText( 150, "four corners");

        this.showNoBetAndCredit();

        let cardAreaBg: egret.Bitmap = Com.addBitmapAt( this, "cards_background_png", 814, 127 );
        this.setChildIndex( cardAreaBg, this.getChildIndex( this.cardArea ) );
        cardAreaBg.width = 968;
        cardAreaBg.height = 810;

        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.coverRunningBall = Com.addBitmapAt( this.runningBallContainer, this.assetStr( "ball_eject" ), 0, 0 );
    }

    private addDouble90GameText( yPos: number, textItem: string ){
        let tx: TextLabel = this.addGameText( 315, yPos, 30, 0x46C8F5, textItem, false, 200, "", 0.9 );
        tx.fontFamily = "Arial";
        tx.bold = true;
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 24, 5, 2.8 );
        Com.addObjectAt( this.runningBallContainer, this.coverRunningBall, 0, 0 );
        Com.addObjectAt(this, this.runningBallContainer, 401, 252);
        
        this.playSound("dt_ball_mp3");
	}

    protected clearRunningBallUI(): void{
        if( this.runningBallContainer && this.contains( this.runningBallContainer ) )this.removeChild( this.runningBallContainer );
	}

/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayerForDoubleTurbo90( new egret.Point( 1300, 0 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 76, 80, 320, 50 ), 40, 0xFFC123 ) );
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
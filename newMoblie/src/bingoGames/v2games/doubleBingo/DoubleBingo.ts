class DoubleBingo extends V2Game{

    protected static get classAssetName(){
		return "doubleBingo";
	}

    protected static get animationAssetName(){
		return "lotto";
	}

	public constructor( assetsPath: string ) {
		super( "doubleBingo.conf", assetsPath, 45 );
        this.languageObjectName = "forAll_tx";

		CardManager.cardType = DoubleBingoCard;

        CardGridColorAndSizeSettings.defaultNumberSize = 50;
        GameCardUISettings.useRedEffect = true;

        this.ballArea.needLightCheck = true;

        this.needListenToolbarStatus = true;
        this.tipStatusTextPosition = new egret.Rectangle( 342, 108, 150, 18 );
        this.tipStatusTextColor = 0xFEFE00;

        BallManager.ballOffsetY = 12;
	}

    protected init(){
        super.init();

        this.extraUIObject.visible = true;
        this.extraUIObject.alpha = 0;

        MDS.addGameText( this, 625, 45, 20, 0xFEFE00, "bingo", true, 200 );
        MDS.addGameText( this, 640, 85, 20, 0xFEFE00, "double", true, 200 );
        MDS.addGameText( this, 645, 130, 20, 0xFEFE00, "line", true, 200 );

        MDS.addGameText( this, 90, 85, 20, 0xFEFE00, "bet", true, 100 );
        MDS.addGameText( this, 100, 45, 20, 0xFEFE00, "credit", true, 100 );
        MDS.addGameText( this, 90, 128, 20, 0xFEFE00, "prize", true, 100 );

        this.betText = MDS.addGameText( this, 180, 90, 17, 0xFEFE00, "bet", false, 150 );
        this.betText.textAlign = "right";
        this.creditText = MDS.addGameText( this, 200, 47, 17, 0xFEFE00, "credit", false, 140 );
        this.creditText.textAlign = "right";
        this.prizeText = MDS.addGameText( this, 162, 132, 17, 0xFEFE00, "prize", false, 160 );
        this.prizeText.textAlign = "right";
        this.prizeText.text = "0";

        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt(this, this.runningBallContainer, 884, 107);
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 0, 0 );
        
        this.playSound("db_ball_wav");
	}

    protected tipStatus( e: egret.Event ): void{
        this.tipStatusText.height = 40;
        super.tipStatus( e, true );
    }

    protected winChange( e: egret.Event ): void{
        this.prizeText.text = "" + e["winCoins"];
    }

    protected showExtraUI( show: boolean = true ){
        if( show ) TweenerTool.tweenTo( this.extraUIObject, { alpha: 1 }, 300 );
        else TweenerTool.tweenTo( this.extraUIObject, { alpha: 0 }, 300 );
    }

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 342, 48 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 1, 14 ), new egret.Rectangle( 0, 25, 120, 12 ), 16, 0xffcc00, new egret.Rectangle( 0, 0, 120, 10), 10, 0x93c448 ) );
    }

    protected hasExtraBallFit(): void {
        this.stopSound("db_ball_wav");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("db6_mp3");
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("db_ball_wav");
    }

	protected getExtraBallFit(): void {
		this.playSound("db8_mp3");
    }
    
    protected collectExtraBall(): void {
        this.playSound("db7_mp3");
    }
}
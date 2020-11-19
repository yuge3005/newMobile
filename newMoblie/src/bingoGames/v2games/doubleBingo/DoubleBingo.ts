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

        BallManager.ballOffsetY = 12;
	}

    protected init(){
        super.init();

        this.extraUIObject.visible = true;
        this.extraUIObject.alpha = 0;

        this.doubleBingoText( 1548, 58, "bingo", true );
        this.doubleBingoText( 1564, 124, "double", true );
        this.doubleBingoText( 1586, 196, "line", true );

        this.doubleBingoText( 90, 124, "bet", true );
        this.doubleBingoText( 90, 196, "prize", true );

        this.betText = MDS.addGameText( this, 180, 90, 17, 0xFEFE00, "bet", false, 150 );
        this.betText.textAlign = "right";
        this.creditText = new TextLabel;
        this.creditText.visible = false;
        this.prizeText = MDS.addGameText( this, 162, 132, 17, 0xFEFE00, "prize", false, 160 );
        this.prizeText.textAlign = "right";
        this.prizeText.text = "0";

        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt(this, this.runningBallContainer, 884, 107);
    }

    private doubleBingoText( x: number, y: number, str: string, isLeft: boolean ){
        let lb: TextLabel = MDS.addGameText( this, x, y, 36, 0xFEFE00, str, true, 200 );
        lb.stroke = 2;
        lb.text = lb.text.toUpperCase();
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
        this.addChild( this.jackpotArea = new DoubleBingoJackpotLayer( new egret.Point( 468, 37 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 0, 21, 250, 36 ), 36, 0xFEFE00, new egret.Rectangle( -170, 21, 170, 36 ), 36, 0xFEFE00 ) );
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
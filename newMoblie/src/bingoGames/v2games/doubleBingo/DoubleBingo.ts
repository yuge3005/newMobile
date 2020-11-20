class DoubleBingo extends V2Game{

    protected static get classAssetName(){
		return "doubleBingo";
	}

    protected static get animationAssetName(){
		return "doubleBingoAnimation";
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

        this.extraUIObject = new DoubleBingoExtraUIObject( this.extraUIObject );

        this.doubleBingoText( 1548, 58, "bingo", true );
        this.doubleBingoText( 1564, 124, "double", true );
        this.doubleBingoText( 1586, 196, "line", true );

        this.doubleBingoText( 218, 124, "bet", false );
        this.doubleBingoText( 234, 196, "prize", false );

        this.betText = this.doubleBingoNumberText( 518, 126 );
        this.creditText = new TextLabel;
        this.prizeText = this.doubleBingoNumberText( 510, 200 );
        this.prizeText.text = "0";

        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt(this, this.runningBallContainer, 884, 107);

        this.arrowArea = new DoubleBingoCardArrowLayer( MDS.mcFactory, "", new egret.Point(0, 5), 55 );
        this.addChild( this.arrowArea );
    }

    private doubleBingoText( x: number, y: number, str: string, isLeft: boolean ): TextLabel{
        let lb: TextLabel = MDS.addGameText( this, x, y, 36, 0xFEFE00, str, true, 200 );
        lb.stroke = 2;
        lb.text = lb.text.toUpperCase();
        lb.scaleX = 0.9;
        if( !isLeft ) lb.textAlign = "right";
        return lb;
    }

    private doubleBingoNumberText( x: number, y: number, ): TextLabel{
        let lb: TextLabel = Com.addLabelAt( this, x, y, 200, 36, 36 );
        lb.textColor = 0xFEFE00;
        lb.scaleX = 0.9;
        lb.textAlign = "right";
        return lb;
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 0, 0 );
        
        this.playSound("db_ball_wav");
	}

    protected tipStatus( e: egret.Event ): void{
    }
    protected winChange( e: egret.Event ): void{
        ( this.prizeText as TextLabel ).setText( Utils.formatCoinsNumber( e["winCoins"] ) );
    }

    protected showExtraUI( show: boolean = true ){
        ( this.extraUIObject as DoubleBingoExtraUIObject ).showExtraUI( show );
    }

    protected afterCheck( resultList: Array<Object> ): void{
        super.afterCheck( resultList );
        this.arrowArea.arrowBlink(resultList);

        if( !this.inLightCheck ){
			if( PaytableResultListOprator.missOneCounter( resultList, "bingo" ) ){
                this.shack( 15 );
			}
		}
    }

    protected startPlay(): void {
        super.startPlay();
        this.arrowArea.clearArrow();

        clearTimeout( this.clearArrowTimeoutId );
    }

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new DoubleBingoJackpotLayer( new egret.Point( 468, 37 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 0, 21, 250, 36 ), 36, 0xFEFE00, new egret.Rectangle( -170, 21, 170, 36 ), 36, 0xFEFE00, true ) );
    }

    protected hasExtraBallFit(): void {
        this.stopSound("db_ball_wav");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("db6_mp3");
        }
    }

    private clearArrowTimeoutId: number;
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("db_ball_wav");

        this.clearArrowTimeoutId = setTimeout( this.delayClearArrow.bind(this), 1500 );
    }

	protected getExtraBallFit(): void {
		this.playSound("db8_mp3");
    }
    
    protected collectExtraBall(): void {
        this.playSound("db7_mp3");
    }

    private delayClearArrow(){
        this.arrowArea.clearArrow();
        ( this.extraUIObject as DoubleBingoExtraUIObject ).showExtraUI( false );
    }

    private shakeProgess: number;

    private shack( shakeTime: number = 0 ){
        if( shakeTime ) this.shakeProgess = shakeTime;
        this.x = Math.random() * 20 - 10;
        if( this.shakeProgess-- > 0 ) TweenerTool.tweenTo( this, { y: 0 }, 33, 0, this.shack.bind(this) );
        else this.x = 0;
    }
}
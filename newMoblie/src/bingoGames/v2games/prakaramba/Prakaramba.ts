class Prakaramba extends V2Game{

    protected static get classAssetName(){
		return "prakaramba";
	}

    protected static get animationAssetName(){
		return "showballAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "prakaramba.conf", assetsPath, 48 );

        GameCard.gridOnTop = true;
        CardGrid.defaultNumberSize = 48;
        GameCard.useRedEffect = true;

        this.needSmallWinTimesOnCard = true;
        this.ballArea.needLightCheck = true;

        this.needListenToolbarStatus = true;
        this.tipStatusTextPosition = new egret.Rectangle( 57, 225, 142, 14 );
        this.tipStatusTextColor = 0xFEFEFE;

        PayTableManager.bingoPaytableName = "pra_bingo";
	}

    protected init(){
        super.init();

        this.addGameTextCenterShadow( 57, 68, 17, 0xFEFE00, "bet", false, 140, true, false );
        this.addGameTextCenterShadow( 57, 113, 17, 0xFEFE00, "credit", false, 140, true, false );
        this.addGameTextCenterShadow( 57, 158, 17, 0xFEFE00, "prize", true, 140, true, false );

        this.betText = this.addGameTextCenterShadow( 57, 89, 17, 0xFEFEFE, "bet", false, 140, true, false );
        this.creditText = this.addGameTextCenterShadow( 57, 137, 16, 0xFEFEFE, "credit", false, 140, true, false );
        this.prizeText = this.addGameTextCenterShadow( 57, 184, 17, 0xFFFFFF, "prize", false, 140, true, false );
        this.prizeText.text = "0";

        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.runningBallContainer.scaleX = this.runningBallContainer.scaleY = 0.8;
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 0, 0 );
        Com.addObjectAt(this, this.runningBallContainer, 114, 272);
        
        this.playSound("prak3_wav");
	}

    protected clearRunningBallUI(): void{
        if( this.runningBallContainer && this.contains( this.runningBallContainer ) )this.removeChild( this.runningBallContainer );
	}

    protected listenToGameToolbarStatus(): void{
        super.listenToGameToolbarStatus();
        this.tipStatusText.verticalAlign = "middle";
        this.tipStatusText.height = 28;
    }

    protected tipStatus( e: egret.Event ): void{
        super.tipStatus( e, true );
    }

    protected winChange( e: egret.Event ): void{
        // super.winChange( e, true );
        this.prizeText.text = "" + e["winCoins"];
    }

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 53, 10 ), jackpot, jackpotMinBet, betConfig, new egret.Point( -6, 7 ), new egret.Rectangle( 0, 25, 120, 14 ), 14, 0xFEFEFE, new egret.Rectangle( 0, 0, 120, 14 ), 14, 0xFEFE00 ) );
    }

    protected hasExtraBallFit(): void {
        this.stopSound("prak3_wav");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("prak29_mp3");
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("prak3_wav");
    }

	protected getExtraBallFit(): void {
		this.playSound("prak9_mp3");
	}

	protected collectExtraBall(): void {
		this.playSound("prak8_mp3");
	}
}
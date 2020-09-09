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
        PayTableManager.layerType = DoubleTurbo90PTLayer;

		GameCard.gridOnTop = true;

        CardManager.cardType = DoubleTurbo90Card;
        CardManager.gridType = ForkGrid;
        
        CardGrid.defaultNumberSize = 32;
        GameCard.useRedEffect = true;

        this.ballArea.needLightCheck = true;
        BallManager.ballOffsetY = 3;
        BallManager.textBold = true;
    }

    protected init(){
        super.init();

        this.showNoBetAndCredit();

        let cardAreaBg: egret.Bitmap = Com.addBitmapAt( this, "cards_background_png", 814, 127 );
        this.setChildIndex( cardAreaBg, this.getChildIndex( this.cardArea ) );
        cardAreaBg.width = 968;
        cardAreaBg.height = 810;

        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.coverRunningBall = Com.addBitmapAt( this.runningBallContainer, this.assetStr( "ball_eject" ), 0, 0 );
        Com.addObjectAt(this, this.runningBallContainer, 401, 252);
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 24, 5, 2.8 );
        Com.addObjectAt( this.runningBallContainer, this.coverRunningBall, 0, 0 );
        
        this.playSound("t90_ball_mp3");
	}

    protected afterCheck( resultList: Array<Object> ): void{
        this.payTableArea.clearPaytableFgs();
        super.afterCheck( resultList );
    }

    protected startPlay(): void {
        super.startPlay();
        this.payTableArea.clearPaytableFgs();
    }

/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayerForDoubleTurbo90( new egret.Point( 1300, 0 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 76, 80, 320, 50 ), 40, 0xFFC123 ) );
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
        super.getPaytablesFit( paytabledName, callback );
        switch (paytabledName) {
            case "line": this.dropCoinsAt( 516, 128, 1 ); break;
            case "double line": this.dropCoinsAt( 516, 90, 2 ); break;
            case "four corners": this.dropCoinsAt( 516, 168, 1 ); break;
            case "bingo": this.dropCoinsAt( 516, 51, 3 ); break;
            default: break;
        }
	}

	protected onBetChanged( event: egret.Event ): void{
        super.onBetChanged(event);

        if (event.data["type"] !== 0) this.playSound("t90_bet_mp3");
	}

    protected hasExtraBallFit(): void {
        this.stopSound("t90_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("t90_extra_loop_mp3", -1);
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("t90_extra_loop_mp3");
    }

    protected getExtraBallFit(): void {
		this.playSound("t90_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
		this.playSound("t90_card_mp3");
	}
}
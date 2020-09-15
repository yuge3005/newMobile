class Turbo90 extends V2Game{

    protected static get classAssetName(){
		return "turbo90";
	}

    protected static get animationAssetName(){
		return "turbo90Animation";
	}

	public constructor( assetsPath: string ) {
		super( "turbo90.conf", assetsPath, 39 );
        this.languageObjectName = "turbo90_tx";
        this.megaName = "turbo90_mega";

        PaytableUI.textBold = true;
        PaytableUI.needBlink = false;
        PayTableManager.layerType = Turbo90PaytableLayer;

        CardManager.cardType = Turbo90Card;
        CardManager.gridType = ForkGrid;

        GameCard.showTitleShadow = new egret.GlowFilter(0, 1, 2, 2, 4 );
        CardGrid.defaultNumberSize = 55;

        BallManager.ballOffsetY = 2;
        BallManager.rotateBall = true;
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();
        this.addChild( this.getChildByName( this.assetStr( "path_tip" ) ) );

        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.addChild( this.runningBallContainer );
        this.runningBallContainer.mask = new egret.Rectangle( 255, 68, 270, 270 );
        this.coverRunningBall = this.getChildByName( this.assetStr("wheel_eject") );

        this.buildSuperEbArea( "mega_" + GlobelSettings.language, 447, 222 );

        this.arrowArea = new CardArrowLayer( this._mcf, "arrowAnimationInT90", this.cardPositions, new egret.Point( -52, 65 ), 72 );
        this.addChild( this.arrowArea );
    }

    protected buildSuperEbArea( superEbBgName: string, superEbAreaX: number, superEbAreaY: number ): void{
        this.superExtraBg = Com.addBitmapAt( this.runningBallContainer, this.assetStr( superEbBgName ), superEbAreaX, superEbAreaY );
        this.superExtraBg.width = 68;
        this.superExtraBg.height = 68;
        this.superExtraBg.visible = false;
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        this.showLastBallAt( ballIndex, 289, 68 );

        if( !this.ballRunforStop )this.playSound("t90_ball_mp3");
	}

    protected showLastBallAt( ballIndex: number, x: number, y: number, scale: number = 1 ): void{
		this.clearRunningBallUI();
		this.runningBallUI = this.ballArea.getABall( ballIndex );
        this.runningBallUI.scaleX = this.runningBallUI.scaleY = 200 / 68;
		Com.addObjectAt( this.runningBallContainer, this.runningBallUI, x, y );

        this.runningBallContainer.addChild( this.coverRunningBall );

        clearTimeout( this.timeoutId );
        this.timeoutId = setTimeout( this.clearRunningBallUI.bind( this ), 3000 );
	}

    private timeoutId: number;

    protected afterCheck( resultList: Array<Object> ): void{
        this.payTableArea.clearPaytableFgs();
        super.afterCheck( resultList );
        this.arrowArea.arrowBlink(resultList);
    }

    protected startPlay(): void {
        super.startPlay();
        this.arrowArea.clearArrow();
        this.payTableArea.clearPaytableFgs();
    }

/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1318, -2 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 110, 50, 300, 40 ), 40, 0xFFC609 ) );
        this.jackpotArea.textBold = false;
        this.jackpotArea.jackpotText.textAlign = "left";
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		super.getPaytablesFit( paytabledName, callback );
        switch (paytabledName) {
            case "double line": this.dropCoinsAt( 1036, 560, 2 ); break;
            case "four corners": this.dropCoinsAt( 1036, 815, 1 ); break;
            case "bingo": this.dropCoinsAt( 1036, 428, 3 ); break;
            case "line": this.dropCoinsAt( 1036, 685, 1 ); break;
            default: break;
        }
	}

    protected onBetChanged(event: egret.Event): void{
        super.onBetChanged(event);
        
        if (event.data["type"] !== 0) this.playSound("t90_bet_mp3");
	}

    protected hasExtraBallFit(): void {
        this.stopSound("t90_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("t90_extra_loop_mp3");
        }

        if( this.isMegaBall ){
            this.superExtraBg.visible = true;
            this.gameToolBar.megeExtraOnTop( true );

            this.tryFirstMega( new egret.Rectangle( 245, 226, 33, 33 ) );
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("t90_ball_mp3");
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
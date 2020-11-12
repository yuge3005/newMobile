class Pharos extends AztecPharosSuper{

	protected static get classAssetName(){
		return "pharos";
	}

    protected static get animationAssetName(){
		return "pharosAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "pharos.conf", assetsPath, 42 );
        this.megaName = "pharo_mega";

        PayTableManager.layerType = PharosPaytableLayer;
        CardGridColorAndSizeSettings.defaultNumberSize = 50;

        BallManager.ballOffsetY = 8;
        BallManager.textBold = true;

        this.needListenToolbarStatus = true;
        this.tipStatusTextPosition = new egret.Rectangle( 430, 85, 169, 45 );
        this.tipStatusTextColor = 0x0;
	}

    protected init(){
        super.init();

        let betTip: TextLabel = MDS.addGameText( this, 295, 678, 36, 0xE8D4AF, "bet", true, 150, "", 0.9 );
        betTip.fontFamily = "Arial";
        betTip.bold = true;

        this.betText = MDS.addGameTextCenterShadow( this, 425, 678, 36, 0xE8D4AF, "bet", true, 178, true, false );
        this.betText.textAlign = "right";
        this.betText.fontFamily = "Arial";
        this.betText.bold = true;
        this.betText.scaleX = 0.9;
        this.creditText = new TextLabel;

        this.buildSuperEbArea( "mega_" + MuLang.language, 427, 16 );
    }

    protected buildSuperEbArea( superEbBgName: string, superEbAreaX: number, superEbAreaY: number ): void{
        this.superExtraBg = Com.addBitmapAt( this.runningBallContainer, this.assetStr( superEbBgName ), superEbAreaX, superEbAreaY );
        this.superExtraBg.width = 174;
        this.superExtraBg.height = 174;
        this.superExtraBg.visible = false;
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt(ballIndex, 427, 16);
        
        if( !this.ballRunforStop )this.playSound("pr_ball_mp3");
        if (this.btExtra && (this.currentBallIndex === this.gratisNumber - 1)) this.playSound("pr_free_extra_ball_mp3");
	}

    protected getGratisUI(): egret.DisplayObject{
        return Com.addMovieClipAt( this, MDS.mcFactory, "pharos", 0, 0 );
    }

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 261, 374 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 70, 30, 260, 38 ), 30, 0xFFFFE3 ) );
        this.jackpotArea.textBold = false;
    }

    protected onBetChanged(event: egret.Event): void{
        super.onBetChanged(event);
        
        if (event.data["type"] !== 0) this.playSound("pr_bet_mp3");
	}

    protected hasExtraBallFit(): void {
        this.stopSound("pr_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("pr_have_extra_ball_mp3");
            this.showFreeExtraPosition();
        }

        if( this.isMegaBall ){
            this.superExtraBg.visible = true;
            this.gameToolBar.megeExtraOnTop( true );
            this.runningBallContainer.addChild( this.superExtraBg );

            this.tryFirstMega( new egret.Rectangle( 74, 85, 88, 88 ) );
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("pr_ball_mp3");

        CardManager.stopAllBlink();
    }

	protected getExtraBallFit(): void {
		this.playSound("pr_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		this.playSound("pr_collect_mp3");
	}

	protected changeNumberSound(): void {
		this.playSound("pr_card_mp3");
	}

    protected showFreeExtraPosition(){
        super.showFreeExtraPosition();
        this.addChildAt( this.gratisUI, this.getChildIndex( this.ballArea ) );
    }
}
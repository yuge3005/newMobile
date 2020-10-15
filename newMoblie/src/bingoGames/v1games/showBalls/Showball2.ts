class Showball2 extends ShowballSuper{

    protected static get classAssetName(){
		return "showball2";
	}

    protected static get animationAssetName(){
		return "showballAnimation";
	}

    public constructor( assetsPath: string ) {
        super( "showball2.conf", assetsPath, 21 );
        this.megaName = "showball2_mega";

        BallManager.ballOffsetY = 15;
    }

    protected init(){
        super.init();
        this.tileBg();

        this.buildBallCountText();

        this.runningBallContainer = new egret.Sprite;
		Com.addObjectAt( this, this.runningBallContainer, 1362, 24 );

		this.buildSuperEbArea( "mega_" + GlobelSettings.language, 371, 8 );
    }

    protected buildBallCountText(){
		let ballText: TextLabel = MDS.addGameTextCenterShadow( this, 1614, 120, 32, 0xFFFFFF, "ball", false, 140, true, false );
		ballText.fontFamily = "Righteous";
        ballText.stroke = 3;

		this.ballCountText = MDS.addGameTextCenterShadow( this, 1614, 158, 40, 0x88FF88, "ball", false, 140, true, false );
		this.ballCountText.fontFamily = "Righteous";
		this.ballCountText.text = "";
	}

    protected showExtraPrice( price: number ): void{
		super.showExtraPrice( price );

        if( price == 0 ){
            this.showFreeExtraAinimation();
        }
	}

    private showFreeExtraAinimation(): void{
        let sp: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
        Com.addBitmapAt( sp, this.assetStr( "arrow_08" ), 0, 0 );
        sp.anchorOffsetY = sp.height >> 1;
        Com.addObjectAt( this, sp, 140, 180 + sp.anchorOffsetY );

        let tx: egret.TextField = Com.addTextAt( sp, 40, 24, 100, 18, 18, true );
        tx.textColor = 0x0000FF;
        tx.text = MuLang.getText("free");

        sp.scaleY = 0.2
        let tw: egret.Tween = egret.Tween.get( sp );
        tw.to( { scaleY: 1 }, 800, egret.Ease.backInOut );
        tw.wait( 500 );
        tw.to( { alpha: 0 }, 800 );
        tw.call( () => { sp.parent.removeChild( sp ) } );
    }

	protected onBetChanged( event: egret.Event ): void{
        super.onBetChanged(event);

        if (event.data["type"] !== 0) this.playSound("shb_bet_mp3");
	}
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("shb_ball_mp3");
        this.stopSound("shb_1to_bingo_mp3");
    }

	protected getExtraBallFit(): void {
		this.playSound("shb_extra_ball_mp3");
	}

	protected changeNumberSound(): void {
        super.changeNumberSound();
		this.playSound("shb_card_wav");
	}

	protected showLastBall( ballIndex: number ): void{
        super.showLastBall(ballIndex);
        
        this.playSound("shb_ball_mp3");
	}

/******************************************************************************************************************************************************************/    

	protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
		this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1302, 275 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 0, 0, 318, 75 ), 36, 0xFFFFFF, new egret.Rectangle( 0, -45, 318, 36 ), 36, 0xFFFFFF, true ) );
		this.jackpotArea.jackpotText.fontFamily = "Arial";
	}
}
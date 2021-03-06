class Showball1 extends ShowballSuper{

    protected static get classAssetName(){
		return "showball1";
	}

    protected static get animationAssetName(){
		return "showball1Animation";
	}

    public constructor( assetsPath: string ) {
        super( "showball1.conf", assetsPath, 22 );
        this.megaName = "showball1_mega";

		PayTableManager.paytableUIType = ShowballPaytableUI;
		
		BallManager.ballOffsetY = 5;

		this.heartPosition = new egret.Point( 760, 550 );
    }

	protected init(){
		super.init();

		this.buildBallCountText();

		this.runningBallContainer = new egret.Sprite;
		Com.addObjectAt( this, this.runningBallContainer, 1395, 28 );

		this.buildSuperEbArea( "mega_" + MuLang.language, 528, 8 );
		this.superExtraBg.scaleX = this.superExtraBg.scaleY = 65 / 34;

		this.showballLogo = this.getChildByName( this.assetStr("logo_rails") ) as egret.Bitmap;
	}

	protected startPlay(): void {
		super.startPlay();
		( this.jackpotArea as JackpotLayerForShowball1 ).jackpotPlay( true );
	}

	protected roundOver(): void {
		super.roundOver();
		( this.jackpotArea as JackpotLayerForShowball1 ).jackpotPlay( false );
	}

/******************************************************************************************************************************************************************/    

	protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
		this.addChild( this.jackpotArea = new JackpotLayerForShowball1( new egret.Point( 1305, 181 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 66, 38, 312, 48 ), 48, 0xF6C8CB ) );
		this.jackpotArea.jackpotText.fontFamily = "Arial";
	}

	protected showExtraUI( show: boolean = true ){
		super.showExtraUI( show );
		this.showballLogo.alpha = show ? 0.5 : 1;
	}
}
class Showball3 extends ShowballSuper{

    protected static get classAssetName(){
		return "showball3";
	}

    protected static get animationAssetName(){
		return "showballAnimation";
	}

    public constructor( assetsPath: string ) {
        super( "showball3.conf", assetsPath, 20 );
        this.megaName = "showball3_mega";

        PayTableManager.paytableUIType = ShowballPaytableUI;

		BallManager.ballOffsetY = 5;

		this.heartPosition = new egret.Point( 893, 550 );
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

/******************************************************************************************************************************************************************/    

	protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
		this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1297, 191 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 90, 40, 325, 42 ), 42, 0xF6C8CB ) );
        this.jackpotArea.jackpotText.fontFamily = "Arial";
    }

    protected showExtraUI( show: boolean = true ){
		super.showExtraUI( show );
		this.showballLogo.alpha = show ? 0.5 : 1;
	}
}
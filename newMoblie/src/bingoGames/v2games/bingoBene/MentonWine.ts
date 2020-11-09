class MentonWine extends egret.DisplayObjectContainer {

    private mc: egret.MovieClip;
    private textBit: egret.Bitmap;

    private ball: egret.Sprite;

	public constructor( bigBall: egret.Sprite, paytableName: string ) {
		super();

		this.mc = Com.addMovieClipAt( this, MDS.mcFactory, "menton_wine_effect" );
        this.mc.x = -322;
        this.mc.y = -476;
        this.mc.scaleX = this.mc.scaleY = 1;
        this.mc.gotoAndPlay( 1, 1 );

        let paytableStr: string = "wineText_json.wine_" + MuLang.language;
        switch (paytableName) {
            case "columns_3": paytableStr += "_03";
                break;
            case "line_2": paytableStr += "_02";
                break;
            case "columns_4": paytableStr += "_04";
                break;
            case "columns_2_2": paytableStr += "_05";
                break;
            case "bingo": paytableStr += "_01";
                break;
            default: console.error( "paytable sound error" );
        }
        this.textBit = Com.addBitmapAt(this, paytableStr, 320, 290 );
        this.textBit.scaleX = this.textBit.scaleY = 2;

        TweenerTool.tweenTo( this, { alpha: 1 }, 1200, 0, this.alphaGo.bind(this) );
        TweenerTool.tweenTo( this.textBit, { x: 500 }, 1200 );

        if( bigBall ){
            this.ball = bigBall;
            bigBall.anchorOffsetX = bigBall.width >> 1;
            bigBall.anchorOffsetY = bigBall.height >> 1;
            this.addChild( bigBall );
            TweenerTool.tweenTo( bigBall, { scaleX: 1, scaleY: 1, x: 850 }, 400, 0, this.ballContinueMove.bind(this), { scaleX: 0.2, scaleY:0.2, x: 0, y: 310 } );
        }
	}

    private alphaGo(){
        TweenerTool.tweenTo( this, { alpha: 0 }, 500, 0, MDS.removeSelf.bind( this, this ) );
    }

    private ballContinueMove(){
        TweenerTool.tweenTo( this.ball, { x: 1000 }, 800 );
    }
}
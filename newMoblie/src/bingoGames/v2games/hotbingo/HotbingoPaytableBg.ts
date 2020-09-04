class HotbingoPaytableBg extends egret.DisplayObjectContainer{

	private light: egret.Bitmap;
	private index: number;
	private tpFitBg: egret.Bitmap;

	public set fit( value: boolean ){
		this.tpFitBg.visible = value;
	}

	public constructor( index: number ) {
		super()

		this.index = index;

		Com.addBitmapAt( this, BingoMachine.getAssetStr("Paytable_body_blue"), 0, 0 );
		this.mask = new egret.Rectangle( 3, 3, 448, 31 );

		this.light = Com.addBitmapAtMiddle( this, BingoMachine.getAssetStr("Shiny_flow"), -100, 18 );
		this.light.scaleX = this.light.scaleY = 0.5;
		TweenerTool.tweenTo( this.light, { x: 550 }, 400, this.index * 500, this.continueLight.bind(this) );

		this.tpFitBg = Com.addBitmapAt( this, BingoMachine.getAssetStr("Paytable_body"), 0, 0 );
		this.tpFitBg.visible = false;
	}

	private continueLight(){
		if( !this.stage ) return;
		this.light.x = -100;
		TweenerTool.tweenTo( this.light, { x: 500 }, 600, 3000, this.continueLight.bind(this) );
	}
}
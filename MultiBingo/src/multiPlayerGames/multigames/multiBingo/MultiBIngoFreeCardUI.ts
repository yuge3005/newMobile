class MultiBIngoFreeCardUI extends FreeCardUI{
	public constructor() {
		super();

		let freeBase: egret.Bitmap = Com.addBitmapAt( this, "freeCardUI_json.free base", 2, 4 );
		freeBase.width = 115;
		freeBase.height = 50;

		let base: egret.Bitmap = Com.addBitmapAt( this, "freeCardUI_json.base", -132, -20 );
		base.scale9Grid = new egret.Rectangle( 10, 10, 20, 83 );
		base.scaleY = -1;
		base.width = 255;
		base.height = 90;

		let arrow: egret.Bitmap = Com.addBitmapAt( this, "freeCardUI_json.arrow", 52, -3 );
		arrow.scaleY = -1;

		Com.addBitmapAt( this, "freeCardUI_json.FREE CARD", -128, -105 );

		this.countTx = MDS.addGameText( this, 37, -95, 68, 0xFFFF00, "", true, 100, "", 0.75 );
		if( FreeCardUI.freeCardCount ) this.setFreeCardCount( FreeCardUI.freeCardCount );
	}
}
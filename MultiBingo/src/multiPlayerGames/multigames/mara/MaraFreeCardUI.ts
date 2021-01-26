class MaraFreeCardUI extends FreeCardUI{
	public constructor() {
		super();

		let freeBase: egret.Bitmap = Com.addBitmapAt( this, "freeCardUI_json.free base", 7, 4 );
		freeBase.width = 66;
		freeBase.height = 50;

		let base: egret.Bitmap = Com.addBitmapAt( this, "freeCardUI_json.base", -19, 77 );
		base.scale9Grid = new egret.Rectangle( 80, 10, 10, 83 );
		base.width = 267;

		let arrow: egret.Bitmap = Com.addBitmapAt( this, "freeCardUI_json.arrow", 15, 55 );

		Com.addBitmapAt( this, "freeCardUI_json.FREE CARD", -12, 87 );

		this.countTx = MDS.addGameText( this, 153, 103, 68, 0xFEFF57, "", true, 118, "", 0.75 );
		this.countTx.textAlign = "left";
		if( FreeCardUI.freeCardCount ) this.setFreeCardCount( FreeCardUI.freeCardCount );
	}
}
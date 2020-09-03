class HotbingoPaytableBg extends egret.DisplayObjectContainer{
	public constructor() {
		super()

		Com.addBitmapAt( this, BingoMachine.getAssetStr("Paytable_body_blue"), 0, 0 );
	}
}
class BlackStarGrid extends ExtraBlinkGrid{
	public constructor() {
		super();
	}

	protected getBlinkBg(): egret.Bitmap{
		return Com.createBitmapByName( BingoMachine.getAssetStr( TowerGrid.blink2PicName ) );
	}
}
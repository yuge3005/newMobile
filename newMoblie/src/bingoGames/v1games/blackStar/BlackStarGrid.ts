class BlackStarGrid extends ExtraBlinkGrid{
	public constructor() {
		super();
	}

	protected getBlinkBg(): egret.Bitmap{
		return Com.createBitmapByName( BingoMachine.getAssetStr( CardGridUISettings.blink2PicName ) );
	}

	protected buildSmallWinText(){
		this.extraBlinkNumTxt = Com.addLabelAt( this.extraBinkSp, 0, 3, CardGridColorAndSizeSettings.gridSize.x, 30, 30, false, true );
		this.smallWinTimesText = Com.addLabelAt( this.extraBinkSp, 0, 30, CardGridColorAndSizeSettings.gridSize.x, 40, 35 );
		this.smallWinTimesText.textColor = 0xFF0000;
	}
}
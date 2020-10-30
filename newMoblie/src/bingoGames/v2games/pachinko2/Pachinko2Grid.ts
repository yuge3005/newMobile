class Pachinko2Grid extends ExtraBlinkGrid{

	public constructor() {
		super();
	}

	protected buildSmallWinText(){
		this.extraBlinkNumTxt = Com.addLabelAt( this.extraBinkSp, 0, 8, CardGridColorAndSizeSettings.gridSize.x, 30, 30, false, true );
		this.smallWinTimesText = Com.addLabelAt( this.extraBinkSp, 0, 35, CardGridColorAndSizeSettings.gridSize.x, 40, 35 );
		this.smallWinTimesText.textColor = 0xFFFF00;
	}

	protected getBlinkBg(): egret.Bitmap{
		return Com.createBitmapByName( BingoMachine.getAssetStr( CardGridUISettings.linePicName ) );
	}
}
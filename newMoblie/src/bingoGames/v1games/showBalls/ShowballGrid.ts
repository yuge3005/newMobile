class ShowballGrid extends ExtraBlinkGrid{

	public constructor() {
		super();
	}

	protected buildSmallWinText(){
		this.extraBlinkNumTxt = Com.addLabelAt( this.extraBinkSp, 0, 3, CardGrid.gridSize.x, 30, 30, false, true );
		this.smallWinTimesText = Com.addLabelAt( this.extraBinkSp, 0, 27, CardGrid.gridSize.x, 40, 35 );
		this.smallWinTimesText.textColor = 0xFFFF00;
	}

	protected getBlinkBg(): egret.Bitmap{
		return this.linePic;
	}
}
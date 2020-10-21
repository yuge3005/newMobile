class PrakarambaGrid extends ExtraBlinkGrid{
	public constructor() {
		super();
	}

	protected getBlinkBg(): egret.Bitmap{
		return Com.MaddMovieClipAt( this, MDS.mcFactory, BingoMachine.getAssetStr( "mark_green" ) );
	}

	protected buildSmallWinText(){
		this.extraBlinkNumTxt = Com.addLabelAt( this.extraBinkSp, 0, 3, CardGrid.gridSize.x, 30, 30, false, true );
		this.extraBlinkNumTxt.textColor = 0;
		this.smallWinTimesText = Com.addLabelAt( this.extraBinkSp, 0, 28, CardGrid.gridSize.x, 35, 30 );
		this.smallWinTimesText.textColor = 0xFFFF00;
	}
}
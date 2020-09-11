class DoubleManiaGrid extends ExtraBlinkGrid{

	private forkUI: egret.Bitmap;

	public constructor() {
		super();
	}

	protected buildSmallWinText(){
		this.extraBlinkNumTxt = Com.addLabelAt( this.extraBinkSp, 0, 5, CardGrid.gridSize.x, 30, 40, false, true );
		this.smallWinTimesText = Com.addLabelAt( this.extraBinkSp, 0, 33, CardGrid.gridSize.x, 40, 25 );
		this.smallWinTimesText.textColor = 0xFFFF00;
	}

	protected getBlinkBg(): egret.Bitmap{
		return Com.createBitmapByName( BingoMachine.getAssetStr( TowerGrid.linePicName ) );
	}

	public showEffect( isShow: boolean ){
		if( this.blink )this.blink = false;
		this._isChecked = isShow;
		if( isShow ){
			if( !this.forkUI ) this.forkUI = Com.createBitmapByName( BingoMachine.getAssetStr( GameCard.usefork ) );
			Com.addObjectAt( this, this.forkUI, CardGrid.gridSize.x - this.forkUI.width >> 1, CardGrid.gridSize.y - this.forkUI.height >> 1 );
		}
		else {
			this.removeFork();
		}
	}

	public removeFork(){
		if( this.forkUI && this.contains( this.forkUI ) )this.removeChild( this.forkUI );
	}
}
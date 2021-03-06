class ForkGrid extends TowerGrid{

	private forkUI: egret.Bitmap;

	public constructor() {
		super();
	}

	public showEffect( isShow: boolean ){
		super.showEffect( isShow );
		if( isShow ){
			if( !this.forkUI ) this.forkUI = Com.createBitmapByName( BingoMachine.getAssetStr( CardGridUISettings.usefork ) );
			Com.addObjectAt( this, this.forkUI, CardGridColorAndSizeSettings.gridSize.x - this.forkUI.width >> 1, CardGridColorAndSizeSettings.gridSize.y - this.forkUI.height >> 1 );
		}
		else {
			this.removeFork();
		}
	}

	public removeFork(){
		if( this.forkUI && this.contains( this.forkUI ) )this.removeChild( this.forkUI );
	}
}
class BlackoutBingoButton extends egret.DisplayObjectContainer {

	private callBingoButton: TouchDownButton;
	private callBingoButtonDisable: egret.Bitmap;

	public constructor() {
		super()

		this.callBingoButton = Com.addDownButtonAt( this, MultiPlayerMachine.getAssetStr( "bingo_button" ), MultiPlayerMachine.getAssetStr( "bingo_button" ), 68, 35, this.callBlackoutBingo.bind(this), true );
		this.callBingoButtonDisable = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "bingo_button_green" ), 0, 0 );

		this.enable = false;
	}

	private callBlackoutBingo(){
		MultiServer.blackoutBingo();
	}

	public set enable( value: boolean ){
		this.callBingoButtonDisable.visible = !value;
		this.callBingoButton.visible = value;
	}
}
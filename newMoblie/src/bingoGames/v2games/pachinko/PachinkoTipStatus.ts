class PachinkoTipStatus extends egret.DisplayObjectContainer{

	private catBitmap: egret.Bitmap;

	public constructor() {
		super();

		this.catBitmap = Com.addBitmapAt( this, BingoMachine.getAssetStr("pachinko_lotto_cat"), 22, 6 )
	}

	public clearTexts(){
		this.removeChildren();
	}

	public showStatus( extraPrice: number ){
		if( !extraPrice ){
			this.addChild( this.catBitmap );
			return;
		}

		let extraStr: string = Utils.formatCoinsNumber( extraPrice );

		let tipStatusText: TextLabel = MDS.addGameTextCenterShadow( this, 18, 93, 28, 0xFFFFFF, "credit", true, 136, true, false );
		tipStatusText.setText( extraStr );
		tipStatusText.scaleX = 1;
		let tipStatusTopText: TextLabel = MDS.addGameTextCenterShadow( this, 18, 45, 20, 0xFFFD00, "extraball", false, 136, true, false );
		tipStatusTopText.scaleX = 1;
		tipStatusTopText.height = 42;
		tipStatusTopText.setText( tipStatusTopText.text.replace( " ", "\n" ) );
	}
}
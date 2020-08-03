class GameToolbarMaskButton extends TouchDownButton{

	private maskBit: egret.Bitmap;

	public constructor( assetsString: string ) {
		super( assetsString, assetsString );

		this.maskBit = Com.addBitmapAt( this, assetsString, 0, 0 );
		this.mask = this.maskBit;
	}
}
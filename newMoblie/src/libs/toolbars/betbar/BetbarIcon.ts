class BetbarIcon extends egret.DisplayObjectContainer{

	private icon: egret.Bitmap;
	private iconLayer: egret.DisplayObjectContainer;

	private maskBitmap: egret.Bitmap;

	private isMaxIcon: boolean;

	public constructor( iconStr: string ) {
		super();

		this.iconLayer = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.iconLayer, 0, 0 );
		this.icon = Com.addBitmapAtMiddle( this.iconLayer, "betBar_json." + iconStr, 0, 0 );

		this.maskBitmap = Com.addBitmapAtMiddle( this, "betBar_json.bright", 0, 0 );
		this.iconLayer.mask = this.maskBitmap;

		this.isMaxIcon = this.icon.width < 200;
		if( !this.isMaxIcon ){
			let side: egret.Bitmap = Com.addBitmapAtMiddle( this, "betBar_json.icon_side_long", 0, 0 );
		}
	}
}
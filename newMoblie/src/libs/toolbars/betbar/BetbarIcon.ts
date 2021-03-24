class BetbarIcon extends egret.DisplayObjectContainer{

	private icon: egret.Bitmap;
	private iconLayer: egret.DisplayObjectContainer;

	private maskBitmap: egret.Bitmap;

	private isMaxIcon: boolean;

	private lockUI: egret.Bitmap;
	private blackMask: egret.Bitmap;

	public constructor( iconStr: string ) {
		super();

		this.iconLayer = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.iconLayer, 0, 0 );
		this.icon = Com.addBitmapAtMiddle( this.iconLayer, "betBar_json." + iconStr, 0, 0 );

		this.isMaxIcon = this.icon.width < 200;
		if( !this.isMaxIcon ){
			let side: egret.Bitmap = Com.addBitmapAtMiddle( this, "betBar_json.icon_side_long", 0, 0 );
			this.maskBitmap = Com.addBitmapAtMiddle( this, "betBar_json.bright", 0, 0 );
		}
		else{
			this.maskBitmap = Com.addBitmapAtMiddle( this, "betBar_json." + iconStr, 0, 0 );
		}
		this.iconLayer.mask = this.maskBitmap;

		this.lockUI = Com.addBitmapAtMiddle( this, "betBar_json.Lock", 0, 0 );
		this.lockUI.visible = false;

		this.blackMask = Com.addBitmapAtMiddle( this.iconLayer, "betBar_json.icon_shadow", 0, 0 );
		this.blackMask.visible = false;
	}

	public unlock(){
	}

	public lock(){
		this.blackMask.visible = true;
		this.blackMask.alpha = 1;

		TweenerTool.tweenTo( this.blackMask, { alpha: 0.5 }, 500, 500 );

		this.lockUI.visible = true;
		this.addChild( this.lockUI );
		this.lockUI.scaleX = this.lockUI.scaleY = 1;
		TweenerTool.tweenTo( this.lockUI, { scaleX: 0.3, scaleY: 0.3 }, 500, 0, MDS.removeSelf.bind( this, this.lockUI ), null, egret.Ease.bounceOut );
	}
}
class ScaleAbleButton extends egret.DisplayObjectContainer{

	protected normalScale: number;
	protected touchedScale: number;
	protected touchedFilter: egret.Filter;

	private buttonBg: egret.Bitmap;

	public constructor( textureName: string, normalScale: number, touchedScale: number, touchedFilter: egret.Filter = null ) {
		super();

		this.buttonBg = Com.addBitmapAt( this, textureName, 0, 0 );
		this.scaleX = normalScale;
		this.scaleY = normalScale;
		this.normalScale = normalScale;
		this.touchedScale = touchedScale;
		this.touchedFilter = touchedFilter;

		this.anchorOffsetX = this.buttonBg.width >> 1;
		this.anchorOffsetY = this.buttonBg.height >> 1;

		this.touchEnabled = true;
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
	}

	public changeBackground(bg: egret.Texture): void {
		this.buttonBg.texture = bg;
	}

	private onTouchTap(event:egret.TouchEvent){
		if( GlobelSettings.isRightClick ){
			event.stopImmediatePropagation();
			return;
		}
		SoundManager.play( "open_list_mp3" );
	}
}
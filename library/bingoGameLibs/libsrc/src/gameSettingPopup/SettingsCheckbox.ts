class SettingsCheckbox extends egret.DisplayObjectContainer{

	private bg: egret.Bitmap;
	private bar: egret.Bitmap;

	private callback: Function;

	private _radioOn: boolean; 
	public set RadioOn( value: boolean ){
		this._radioOn = value;
		if( value ){
			this.bg.texture = RES.getRes( "gameSettings_json.bg_slider_on" );
			this.bar.x = 77;
		}
		else{
			this.bg.texture = RES.getRes( "gameSettings_json.bg_slider_off" );
			this.bar.x = 0;
		}
	}
	public get RadioOn(): boolean{
		return this._radioOn;
	}

	public constructor( callback: Function ) {
		super();

		this.bg = Com.addBitmapAt( this, "gameSettings_json.bg_slider_on", 0, 0 );
		this.bar = Com.addBitmapAt( this, "gameSettings_json.slider_switch", 77, 2 );

		this.touchChildren = false;
		this.touchEnabled = true;

		this.x = 855;
		this.y = 32;

		this.callback = callback;

		this.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this );
	}

	private onTap( e: egret.TouchEvent ){
		this.callback();
	}
}
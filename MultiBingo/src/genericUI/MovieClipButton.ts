class MovieClipButton extends egret.MovieClip {

	public get enabled(){
		return this.touchEnabled;
	}
	public set enabled( value : boolean ){
		this.touchEnabled = value;
		if( value ){
			this.filters = [];
		}
		else{
			this.filters = [ MatrixTool.colorMatrix( 0.5, 0.1, 1 ) ];
		}
	}

	public constructor( mcData: egret.MovieClipData ) {
		super( mcData );

		this.touchEnabled = true;
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.beginToPlay, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
	}

	private beginToPlay(event: egret.TouchEvent){
		this.play(-1);
		this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
	}

	private onTouchEnd(event:egret.TouchEvent){
		this.gotoAndStop(1);
		event.currentTarget.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
	}

	private onTouchTap(event:egret.TouchEvent){
		SoundManager.play( "open_list_mp3" );
	}
}
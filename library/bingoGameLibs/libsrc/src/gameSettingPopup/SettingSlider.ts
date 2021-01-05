class SettingSlider extends egret.DisplayObjectContainer{

	private slider: egret.Bitmap;
	private sliderRange: number = 850;

	private dragStarStageY: number;
	private dragStarSliderY: number;

	public constructor() {
		super()

		let bg: egret.Bitmap = Com.addBitmapAt( this, "gameSettings_json.scroll_bar", 0, 0 );
		bg.height = this.sliderRange;

		this.slider = Com.addBitmapAtMiddle( this, "gameSettings_json.scroll_bar_handle", 10, 0 );
		this.slider.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.onSliderStartDrag, this );
		this.slider.touchEnabled = true;
	}

	public setSliderPosition( topMax: number, scrollTop: number ){
		if( scrollTop < 0 ) scrollTop = 0;
		if( scrollTop > topMax ) scrollTop = topMax;
		this.slider.y = scrollTop / topMax * this.sliderRange;
	}

	private onSliderStartDrag( event: egret.TouchEvent ){
		this.stage.addEventListener( egret.TouchEvent.TOUCH_END, this.onSliderStopDrag, this );
		this.stage.addEventListener( egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onSliderStopDrag, this );
		this.stage.addEventListener( egret.TouchEvent.TOUCH_MOVE, this.onMove, this );
		this.dispatchEvent( new egret.Event( "startDrag" ) );

		this.dragStarStageY = event.stageY;
		this.dragStarSliderY = this.slider.y;
		this.dragSliderPosition( event.stageY );
	}

	private onSliderStopDrag( event: egret.TouchEvent ){
		this.stage.removeEventListener( egret.TouchEvent.TOUCH_END, this.onSliderStopDrag, this );
		this.stage.removeEventListener( egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onSliderStopDrag, this );
		this.stage.removeEventListener( egret.TouchEvent.TOUCH_MOVE, this.onMove, this );
		this.dispatchEvent( new egret.Event( "stopDrag" ) );
	}

	private dragSliderPosition( y: number ){
		y -= this.dragStarStageY;
		y /= this.parent.scaleY;
		y += this.dragStarSliderY;
		let p: number = y;
		if( p < 0 ) p = 0;
		if( p > this.sliderRange ) p = this.sliderRange;
		this.slider.y = p;
	}

	public get scrollTop(): number{
		return this.slider.y / this.sliderRange;
	}

	private onMove( event: egret.TouchEvent ){
		this.dragSliderPosition( event.stageY );
	}
}
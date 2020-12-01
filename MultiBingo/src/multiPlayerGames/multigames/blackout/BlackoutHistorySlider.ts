class BlackoutHistorySlider extends egret.DisplayObjectContainer{

	private slider: egret.Bitmap;
	private sliderRange: number;

	private dragOffsetY: number;

	public constructor() {
		super();

		this.slider = Com.addBitmapAt( this, "blackout_room_json.draw_slip", 0, 0 );

		this.sliderRange = 371 - this.slider.height;
		this.slider.visible = false;

		this.touchEnabled = true;
		this.touchChildren = false;
		this.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this );
	}

	public setScrollSlider( scrollNum: number, rangeNum: number, scrollTop: number ){
		if( scrollNum < rangeNum && this.slider.visible ) this.slider.visible = false;
		if( scrollNum > rangeNum ){
			if( !this.slider.visible ) this.slider.visible = true;
			this.slider.y = this.sliderRange * scrollTop / ( scrollNum - rangeNum );
		}
	}

	public get sliderPosition(): number{
		return this.slider.y / this.sliderRange;
	}

	private onTouchBegin( event: egret.TouchEvent ){
		this.dispatchEvent( new egret.Event( "startDrag" ) );
		this.stage.addEventListener( egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this );
		this.stage.addEventListener( egret.TouchEvent.TOUCH_END, this.onTouchEnd, this );
		this.dragOffsetY = event.stageY - event.localY;
		this.setSliderPosition( event.stageY );
		this.dispatchEvent( new egret.Event( "sliderPosition" ) );
	}

	private onTouchMove( event: egret.TouchEvent ){
		this.setSliderPosition( event.stageY );
		this.dispatchEvent( new egret.Event( "sliderPosition" ) );
	}

	private onTouchEnd( event: egret.TouchEvent ){
		this.dispatchEvent( new egret.Event( "stopDrag" ) );
		this.stage.removeEventListener( egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this );
		this.stage.removeEventListener( egret.TouchEvent.TOUCH_END, this.onTouchEnd, this );
	}

	private setSliderPosition( y: number ){
		y -= this.dragOffsetY;
		let p: number = y - this.slider.height * 0.5;
		if( p < 0 ) p = 0;
		if( p > this.sliderRange ) p = this.sliderRange;
		this.slider.y = p;
	}
}
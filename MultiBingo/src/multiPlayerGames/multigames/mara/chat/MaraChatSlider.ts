class MaraChatSlider extends egret.DisplayObjectContainer{

	private slider: egret.Bitmap;
	private sliderRange: number;

	private dragStarStageY: number;
	private dragStarSliderY: number;

	public constructor() {
		super();

		let bg: egret.Bitmap = Com.addBitmapAt( this, "mara_chat_box_json.Bottom frame", 0, 0 );
		this.slider = Com.addBitmapAt( this, "mara_chat_box_json.Slide", 1, 0 );

		this.sliderRange = bg.height - this.slider.height;
		this.slider.visible = false;

		this.touchEnabled = true;
		this.touchChildren = false;
		this.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this );
	}

	public setScrollSlider( scrollNum: number, rangeNum: number ){
		if( scrollNum < rangeNum && this.slider.visible ) this.slider.visible = false;
		if( scrollNum > rangeNum ){
			if( !this.slider.visible ) this.slider.visible = true;
			this.slider.y = this.sliderRange;
		}
	}

	public get sliderPosition(): number{
		return this.slider.y / this.sliderRange;
	}

	private onTouchBegin( event: egret.TouchEvent ){
		this.dispatchEvent( new egret.Event( "startDrag" ) );
		this.stage.addEventListener( egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this );
		this.stage.addEventListener( egret.TouchEvent.TOUCH_END, this.onTouchEnd, this );
		this.dragStarStageY = event.stageY;
		this.dragStarSliderY = this.slider.y;
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
		y -= this.dragStarStageY;
		y /= 0.54;
		y += this.dragStarSliderY;
		let p: number = y;
		if( p < 0 ) p = 0;
		if( p > this.sliderRange ) p = this.sliderRange;
		this.slider.y = p;
	}
}
class MentonTomatoAnimation extends egret.DisplayObjectContainer {

	private fromPosition: egret.Point;

	public constructor( fromPoint: egret.Point ) {
		super();

		this.fromPosition = fromPoint;
		this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );
		this.addEventListener( egret.Event.REMOVED_FROM_STAGE, this.onRemove, this );
	}

	private tomato1: egret.Bitmap;
	private tomato2: egret.Bitmap;
	private tomato3: egret.Bitmap;
	private tomatoBg: egret.Bitmap;
	private juice: egret.Bitmap;

	private onAdd( event: egret.Event ): void{
		this.tomato1 = Com.addBitmapAt( this, "tomatoAnimation_json.tomato_01", 0, 0 );
		this.anchorMiddle( this.tomato1 );
		TweenerTool.tweenTo( this, {x: this.x + 121, y: this.y + 80, alpha: 1 }, 300, 0, this.showJuice.bind(this), {x: this.fromPosition.x, y: this.fromPosition.y, alpha: 0, scaleX: 1.1, scaleY: 1.1}, egret.Ease.sineOut );
	}

	private onRemove( event: egret.Event ): void{
		this.removeEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );
		this.removeEventListener( egret.Event.REMOVED_FROM_STAGE, this.onRemove, this );
		this.removeChildren();
	}

	private showJuice(){
		this.juice = Com.addBitmapAt( this, "tomatoAnimation_json.tomato_juice", 0, 0 );
		this.anchorMiddle( this.juice );
		this.tomatoBg = Com.addBitmapAt( this, "tomatoAnimation_json.tomato_bg", 0, 0 );
		this.anchorMiddle( this.tomatoBg );
		this.addChildAt( this.tomatoBg, 0 );
		TweenerTool.tweenTo( this.tomatoBg, { scaleX: 1, scaleY: 1, alpha: 0.85 }, 125, 0, null, { scaleX: 0.8, scaleY: 0.8, alpha: 0.4 } );
		TweenerTool.tweenTo( this.tomato1, { rotation: 15 }, 125 );
		TweenerTool.tweenTo( this.juice, { scaleX: 1, scaleY: 1 }, 160, 0, this.showOpenTomato.bind(this), { scaleX: 0.5, scaleY: 0.5 } );
	}

	private anchorMiddle( target: egret.DisplayObject ){
		target.anchorOffsetX = target.width >> 1;
		target.anchorOffsetY = target.height >> 1;
	}

	private showOpenTomato(){
		this.tomato2 = Com.addBitmapAt( this, "tomatoAnimation_json.tomato_02", 0, 0 );
		this.anchorMiddle( this.tomato2 );
		this.removeChild( this.tomato1 );
		this.tomato3 = Com.addBitmapAt( this, "tomatoAnimation_json.tomato_03", -45, 0 );
		TweenerTool.tweenTo( this.tomato2, { alpha: 1 }, 60, 0, this.shake1.bind( this ), { alpha: 0.2, rotation: 15, scaleX: 1.1, scaleY: 1.1 } );
		TweenerTool.tweenTo( this.juice, { alpha: 0 }, 350 );
	}

	private shake1(){
		TweenerTool.tweenTo( this.tomato2, { x: this.tomato2.x + 1, y: this.tomato2.y - 1 }, 30 );
		TweenerTool.tweenTo( this.tomato3, { x: this.tomato3.x - 1, y: this.tomato3.y + 1 }, 33, 0, this.shake2.bind( this ) );
	}

	private shake2(){
		TweenerTool.tweenTo( this.tomato2, { x: this.tomato2.x - 1, y: this.tomato2.y + 1 }, 30 );
		TweenerTool.tweenTo( this.tomato3, { x: this.tomato3.x + 1, y: this.tomato3.y - 1 }, 33, 0, this.endShake.bind( this ) );
	}

	private endShake(){
		TweenerTool.tweenTo( this.tomato2, { alpha: 0 }, 60 );
		TweenerTool.tweenTo( this.tomato3, { alpha: 0 }, 60 );
	}
}
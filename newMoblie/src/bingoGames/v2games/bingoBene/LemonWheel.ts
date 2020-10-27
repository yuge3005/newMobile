class LemonWheel extends egret.DisplayObjectContainer {

	private buffId: number;

	private pointIcon: egret.Bitmap;

	public constructor( buffId: number ) {
		super();

		this.buffId = buffId;
	}

	private runWheel(){
		let tw: egret.Tween = egret.Tween.get( this.pointIcon );
		let buffOffset: number = this.buffId > 0 ? this.buffId * 2 : ( Math.round( Math.random() * 3 ) * 2 + 1 );
		let an: number = buffOffset * 60 - Math.random() * 40 - 10;
		tw.to( {rotation: 1050 + an}, 2500, egret.Ease.cubicOut );
		tw.wait( 2500 );
		tw.call( this.closeWheel.bind( this ) );
	}

	public showOff(): void{
		let bell: egret.Bitmap = Com.addBitmapAt( this, "mentonWheel_json.bell", 0, -60 );
		bell.anchorOffsetX = 132;
		bell.anchorOffsetY = 82;

		let tw: egret.Tween = egret.Tween.get( bell );
		tw.to( { rotation: -15 }, 100 );
		tw.to( { rotation: 15 }, 200 );
		tw.to( { rotation: -15 }, 200 );
		tw.to( { rotation: 15 }, 200 );
		tw.to( { rotation: -15 }, 200 );
		tw.to( { rotation: 15 }, 200 );
		tw.to( { rotation: -15 }, 200 );
		tw.to( { rotation: 15 }, 200 );
		tw.call( this.showWheel.bind( this ) );
		tw.wait( 1000 );
		tw.call( this.runWheel.bind( this ) );
	}

	private showWheel(){
		this.removeChildren();

		Com.addBitmapAtMiddle( this, "mentonWheel_json.wheel", 0, 0 );

		this.pointIcon = Com.addBitmapAt( this, "mentonWheel_json.wheel_pointer", 0, 0 );
		this.pointIcon.anchorOffsetX = 100;
		this.pointIcon.anchorOffsetY = 160;
	}

	private closeWheel():void{
		this.dispatchEvent( new egret.Event("wheelEnd") );
	}

	private x2Bitmap: egret.Bitmap;

	public showDoubleBonus(){
		let container: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		container.anchorOffsetX = 87;
		container.anchorOffsetY = 84;
		Com.addBitmapAt( container, "mentonWheel_json.wheel_fan_shaped", 0, 0 ).alpha = 0.5;
		Com.addBitmapAt( container, "mentonWheel_json.x2_small", 45, 62 );
		Com.addObjectAt( this, container, 87 + 187, -50 + 187 );

		this.setChildIndex( container, this.getChildIndex( this.pointIcon ) );

		this.newBg = Com.addBitmapAt( this, "mentonWheel_json.wheel_x2bg", 0, 0 );
		this.newBg.alpha = 0;
		this.setChildIndex( this.newBg, this.getChildIndex( container ) );

		this.counter = 0;
		this.continueScale( container );

		this.container = container;
	}

	private counter: number;
	private newBg: egret.Bitmap;
	private container: egret.DisplayObjectContainer;

	private continueScale( container: egret.DisplayObject ){
		if( this.counter >= 6 ){
			this.moveToTop();
			return;
		}
		let scale: number = container.scaleX;
		if( scale <= 1 )scale = 1.1
		else scale = 1;
		this.counter++;
		TweenerTool.tweenTo( container, { scaleX: scale, scaleY: scale }, 200, 0, this.continueScale.bind(this, container ) );
	}

	private moveToTop(){
		TweenerTool.tweenTo( this.newBg, { alpha: 1 }, 400 );
		TweenerTool.tweenTo( this.pointIcon, { alpha: 0 }, 400 );
		this.container.removeChildAt(0);
		TweenerTool.tweenTo( this.container, { scaleX: 2.5, scaleY: 2.5, x: 200, y: 160 }, 420, 0, this.moveToSmallWheel.bind(this) );
	}

	private moveToSmallWheel(){
		TweenerTool.tweenTo( this, { scaleX: 0.182, scaleY: 0.182, x: 236, y: 35 }, 420 );
	}

	// public leave(){
	// 	this.removeChildren();
	// 	this.addChild( this.container );
	// 	TweenerTool.tweenTo( this, { scaleX: 0.4, scaleY: 0.4, y: 490 }, 300, 0, this.endMove.bind(this) );
	// }

	public endMove(){
		if( this.parent ) this.parent.removeChild( this );
	}
}
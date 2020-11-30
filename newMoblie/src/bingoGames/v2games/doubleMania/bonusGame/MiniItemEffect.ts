class MiniItemEffect extends egret.DisplayObjectContainer {
	public constructor() {
		super();

		let mask: egret.Bitmap = Com.addBitmapAt( this, "doublemania_mini_json.outline", 0, 0 );

		let bit: egret.Bitmap = Com.addBitmapAtMiddle( this, "doublemania_mini_json.outline_bg", mask.width >> 1, mask.height >> 1 );
		bit.mask = mask;

		this.rotateFire( bit, false );
	}

	private rotateFire( bit: egret.Bitmap, checkOnStage: boolean = true ){
		if( checkOnStage && !this.stage ) return;

		bit.rotation = 0
		TweenerTool.tweenTo( bit, { rotation: 360 }, 1500, 0, this.rotateFire.bind( this, bit ) );
	}
}
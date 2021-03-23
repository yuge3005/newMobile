class Betbar extends egret.DisplayObjectContainer{

	private processBar: egret.Bitmap;

	public constructor() {
		super();

		let bg: egret.Bitmap = Com.addBitmapAt( this, "betBar_json.bar_bg", 0, 0 );
		bg.scale9Grid = new egret.Rectangle( 18, 10, 60, 29 );
		bg.width = 820;

		this.processBar = Com.addBitmapAt( this, "betBar_json.bar_progress", 4, 4 );
		this.processBar.scale9Grid = new egret.Rectangle( 16, 8, 56, 15 );
		this.processBar.width = 32;

		this.visible = false;
	}

	public setBet( bet: number ){
		egret.Tween.removeTweens( this );
		this.visible = true;
		TweenerTool.tweenTo( this, { alpha: 1 }, 500, 0, this.waitThis.bind(this) );
	}

	private waitThis(){
		TweenerTool.tweenTo( this, { alpha: 0 }, 500, 1500, this.waitThis.bind(this) );
	}

	private hideThis(){
		this.visible = false;
	}
}
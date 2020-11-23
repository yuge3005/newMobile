class DoubleBingoExtraUIObject extends egret.DisplayObjectContainer{

	private bg: egret.Bitmap;
	private redBallBgs: Array<egret.Bitmap>;

	public constructor( oldUI: egret.DisplayObject ) {
		super();

		oldUI.visible = true;
		this.bg = oldUI as egret.Bitmap;

        this.alpha = 0;

		let uiIndex: number = oldUI.parent.getChildIndex( this.bg );
		oldUI.parent.addChildAt( this, uiIndex );
		this.addChild( this.bg );

		this.redBallBgs = [];
		for( let i: number = 0; i < 12; i++ ){
			let pt: egret.Point = BallManager.getBallLastPosition( i + 31 );
			this.redBallBgs[i] = Com.addBitmapAt( this, BingoMachine.getAssetStr("red_ballpng"), pt.x + 2, pt.y + 2 );
		}
	}

	public showExtraUI( show: boolean = true ){
		TweenerTool.tweenTo( this, { alpha: show ? 1 : 0 }, 300 );
	}

	public showRedBallsAnimation(){
		let interval: number = 100;
		for( let i: number = 0; i < 12; i++ ){
			this.redBallBgs[i].visible = true;
			this.redBallBgs[i].alpha = 0;
			let tw: egret.Tween = egret.Tween.get( this.redBallBgs[i] );
			tw.wait( i * interval );
			tw.to( { alpha: 1 }, 33 );
			tw.wait( ( 12 - i ) * interval * 2 );
			tw.to( { alpha: 0 }, 33 );
		}
	}
}
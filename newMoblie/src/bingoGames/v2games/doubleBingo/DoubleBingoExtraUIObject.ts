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
	}

	public showExtraUI( show: boolean = true ){
		if( show ){
			TweenerTool.tweenTo( this, { alpha: 1 }, 300 );
		}
        else TweenerTool.tweenTo( this, { alpha: 0 }, 300 );
	}
}
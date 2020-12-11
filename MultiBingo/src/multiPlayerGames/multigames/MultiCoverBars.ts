class MultiCoverBars extends egret.Sprite{
	public constructor() {
		super();

		let shadow: egret.Shape = new egret.Shape;
		GraphicTool.drawRect( shadow, new egret.Rectangle( 0, 0, BingoBackGroundSetting.gameMask.width, BingoBackGroundSetting.gameMask.height ), 0, false, 0.6 );
		this.addChild( shadow );
		shadow.touchEnabled = true;
	}
}
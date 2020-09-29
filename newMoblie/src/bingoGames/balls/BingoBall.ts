class BingoBall extends egret.Sprite{

	public static ballUIs: Array<egret.Sprite>;

	public constructor( index: number, ballSize: number = 0 ) {
		super();

		let ren: egret.RenderTexture = new egret.RenderTexture;
		let newBall: egret.Sprite = BingoBall.ballUIs[index];
		ren.drawToTexture( newBall, new egret.Rectangle( 0, 0, newBall.width, newBall.height ), ballSize ? ballSize / newBall.height : 1 );
		let bmp = new egret.Bitmap( ren );
		this.addChild( bmp );
	}
}
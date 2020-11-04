class BingoBall extends egret.Sprite{

	public static BALL_MOVE_END: string = "ballMoveEnd";

	public static ballUIs: Array<egret.Sprite>;
	private ballSize: number;
	private pts: Array<egret.Point>;

	public constructor( index: number, ballSize: number = 0 ) {
		super();

		this.ballSize = ballSize;

		let ren: egret.RenderTexture = new egret.RenderTexture;
		let newBall: egret.Sprite = BingoBall.ballUIs[index];
		ren.drawToTexture( newBall, new egret.Rectangle( 0, 0, newBall.width, newBall.height ), ballSize ? ballSize / newBall.height : 1 );
		let bmp = new egret.Bitmap( ren );
		this.addChild( bmp );
	}

	public startRun( pts: Array<egret.Point> ){
		if( BallManager.rotateBall ){
			let half: number = this.ballSize >> 1;
			this.anchorOffsetX = half;
			this.anchorOffsetY = half;
			this.x = pts[0]["x"] + half;
			this.y = pts[0]["y"] + half;
		}
		else{
			this.x = pts[0]["x"];
			this.y = pts[0]["y"];
		}

		this.pts = pts;
		this.moveToNextPoint();
	}

	private moveToNextPoint():void{
		var curruntPoint: egret.Point = this.pts.shift();
		if( !this.pts.length ){
			this.dispatchEvent( new egret.Event( BingoBall.BALL_MOVE_END ) );
			return;
		}
		var targetPoint : egret.Point = this.pts[0];
		var distance: number = egret.Point.distance( curruntPoint, targetPoint );
		let tw: egret.Tween = egret.Tween.get( this );
		if( BallManager.rotateBall ){
			let half: number = this.ballSize >> 1;
			tw.to( { x:targetPoint.x + half, y:targetPoint.y + half, rotation: this.rotation + 360 }, distance * 0.5 );
		}
		else tw.to( { x:targetPoint.x, y:targetPoint.y }, distance * 0.5 );
		tw.call( this.moveToNextPoint, this );
	}
}
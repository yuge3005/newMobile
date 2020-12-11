class Multi75BallLayer extends MultiGameBallLayer {

	protected bingoStr: Array<string> = ["B","I","N","G","O"];
	protected ballNormalSize: number;
	protected ballBigSize: number;

	protected get ballMoveDuration(): number{
		return 930;
	}

	protected get ballStartScale(): number{
		return 0.75;
	}

	public constructor() {
		super();
	}

	protected setBallLetter( ball: egret.Sprite, num: number, anchorOffet: number, txSize: number, txY: number ){
		ball.anchorOffsetX = ball.anchorOffsetY = anchorOffet;

		var tx: egret.TextField = new egret.TextField;
		tx.width = ball.width;
		tx.size = txSize;
		tx.bold = true;
		tx.textAlign = "center";
		tx.textColor = 0;
		tx.text = "" + this.bingoStr[ Math.floor((num - 1)/15) ];
		tx.y = txY;
		ball.addChild( tx );
	}

	private moveAndScaleToNarmolSize( sp: egret.Sprite, targetPoint: egret.Point ){
		egret.Tween.removeTweens( sp );
		let tw2: egret.Tween = egret.Tween.get( sp );
		tw2.to( { x:targetPoint.x, y:targetPoint.y, scaleX: this.ballNormalSize, scaleY: this.ballNormalSize }, this.ballMoveDuration );
	}

	private moveNewBall( sp: egret.Sprite, pts:Array<egret.Point> ){
		sp.scaleX = sp.scaleY = this.ballStartScale;
		let tw: egret.Tween = egret.Tween.get( sp );
		tw.to( { scaleX: this.ballBigSize, scaleY: this.ballBigSize }, this.ballMoveDuration );
		if( sp.parent )sp.parent.addChildAt( sp, 0 );
		sp["pts"] = pts;
		this.runAllOtherBalls();
	}

	private runAllOtherBalls(){
		for( let i: number = 1; i < this.numChildren; i++ ){
			let ball: egret.Sprite = this.getChildAt(i) as egret.Sprite;
			this.moveToNextPoint( ball, ball["pts"] );
			if( ball["pts"].length == 0 ){
				this.removeChild( ball );
			}
		}
	}

	protected moveToNextPoint(sp:egret.Sprite, pts:Array<egret.Point>):void{
		var curruntPoint: egret.Point = pts.shift();
		if( !pts.length )return;
		var targetPoint : egret.Point = pts[0];
		var distance: number = egret.Point.distance( curruntPoint, targetPoint );
		if( distance == 0 ){
			this.moveNewBall( sp, pts );
		}
		else{
			this.moveAndScaleToNarmolSize( sp, targetPoint );
		}
	}
}
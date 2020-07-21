package gameUI{
	import com.greensock.TweenMax;
	
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.utils.setTimeout;
	
	import settings.EditorEvent;
	import settings.GameConfigObject;
	import settings.GameRes;
	
	public class BallLayer extends GameArea{

		private var ballIndexs:Array;

		private var extraBalls:Array;
		
		private var ballOrder: int;
		
		public function BallLayer(){
			super();
		}
		
		public function addBall(index:int, pt:Point):void{
			var sp: Sprite = GameRes.buildBallWithIndex( index, this.numChildren + 1 );
			addGameAreaItem( sp, pt, EditorEvent.PATH_CHANGE );
		}
		
		protected override function onGameAreaItemEndDrag(event:MouseEvent):void{
			super.onGameAreaItemEndDrag( event );
			report( EditorEvent.PATH_CHANGE );
		}
		
		public function clearBalls():void{
			removeChildren();
			report( EditorEvent.PATH_CHANGE );
		}
		
		public function runBalls():void{
			removeChildren();
			var count: int = GameConfigObject.ballNumber;
			var numIndex: int;
			var ar: Array = [];
			ballIndexs = [];
			extraBalls = [];
			for( var i:int = 0; i<90; i++ ){
				ar[i] = i;
			}
			while( count ){
				numIndex = Math.random() * ar.length;
				ballIndexs.push( ar[numIndex] );
				ar.splice( numIndex, 1 );
				count --;
			}
			ballOrder = 0;
			beginRun();
		}
		
		private function beginRun():void{
			if( !ballIndexs.length )return;
			var index: int = ballIndexs.shift();
			var path: Array = GameConfigObject.balls[ballOrder++].path;
			var pts: Array = [];
			for( var i:int = 0; i<path.length; i++ ){
				pts[i] = new Point( path[i].x, path[i].y );
			}
			var sp: Sprite = addItemAt( GameRes.buildBallWithIndex( index, index + 1 ), pts[0].x, pts[0].y ) as Sprite;
			this.moveToNextPoint( sp, pts );
			setTimeout( beginRun, 100 );
		}
		
		private function moveToNextPoint(sp:Sprite, pts:Array):void{
			var curruntPoint: Point = pts.shift();
			if( !pts.length )return;
			var targetPoint : Point = pts[0];
			var distance: int = Point.distance( curruntPoint, targetPoint );
			TweenMax.to( sp, distance/2000, {x:targetPoint.x, y:targetPoint.y, onComplete:moveToNextPoint, onCompleteParams:[sp, pts] } );
		}
	}
}
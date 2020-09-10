package controler{
	import flash.display.Sprite;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.ui.Keyboard;
	
	import fl.controls.List;
	
	import settings.EditorEvent;
	import settings.GameConfigObject;
	import settings.GameRes;

	public class BallInfo extends ItemInfo{
		
		private var ball: Sprite;
		
		private var positionBalls: Vector.<Sprite>;
		
		private var currentIndex: int;
		
		private var pathList: List;
		
		private var ballForDrag: Sprite;
		
		public function BallInfo(){
			pathList = addItemAt( new List, 160, 0, 140 ) as List;
			pathList.visible = false;
			pathList.height = 200;
			pathList.addEventListener( KeyboardEvent.KEY_DOWN, onItemKeyDown );
		}
		
		protected function onItemKeyDown(event:KeyboardEvent):void{
			var selectedIndex: int = ( event.target as List ).selectedIndex;
			if( selectedIndex < 0 )return;
			
			var path: Array = GameConfigObject.balls[currentIndex].path;
			if( [ Keyboard.A, Keyboard.S, Keyboard.F, Keyboard.W ].indexOf( event.keyCode ) >= 0 ){
				var movePoint: Object = path[selectedIndex];
				if( event.keyCode == Keyboard.A )movePoint.x += -1;
				else if( event.keyCode == Keyboard.W )movePoint.y += -1;
				else if( event.keyCode == Keyboard.F )movePoint.x += 1;
				else if( event.keyCode == Keyboard.S )movePoint.y += 1;
				showBallInfo( currentIndex );
				( event.target as List ).selectedIndex = selectedIndex;
			}
			else if( event.keyCode == Keyboard.DELETE ){
				path.splice( selectedIndex, 1 );
				showBallInfo( currentIndex );
			}
		}
		
		public function showBallInfo(index:int):void{
			currentIndex = index;
			if( ball && this.contains( ball ) )this.removeChild( ball );
			ball = addItemAt( GameRes.buildBallWithIndex( index, 0, false ), 0, 0 ) as Sprite;
			this.setChildIndex( ball, 0 )
			pathList.visible = true;
			
			if( ballForDrag && this.contains( ballForDrag ) )this.removeChild( ballForDrag );
			ballForDrag = addItemAt( GameRes.buildBallWithIndex( index ), 0, 128 ) as Sprite;
			ballForDrag.buttonMode = true;
			ballForDrag.addEventListener( MouseEvent.MOUSE_DOWN, onDrag );
			
			var path: Array = GameConfigObject.balls[ currentIndex ].path;
			report( EditorEvent.CLEAR_PATH );
			if( path ){
				for( var i: int = 0; i < path.length; i++ ){
					report( EditorEvent.ADD_PATH_POINT, {index: currentIndex, point: new Point( path[i].x, path[i].y )} );
				}
			}
		}
		
		protected override function onDragEnd(event:MouseEvent):void{
			super.onDragEnd( event );
			if( dragEndPosition )report( EditorEvent.ADD_PATH_POINT, {index: currentIndex, point: dragEndPosition } );
		}

		public function refreshBallPathList(pathPositions:Array):void{
			GameConfigObject.clearBallPath( currentIndex );
			pathList.removeAll();
			for( var i:int = 0; i < pathPositions.length; i++ ){
				GameConfigObject.addPathPoint( currentIndex, pathPositions[i] );
				pathList.addItem( {label: (i+1) + "(x=" + pathPositions[i].x +",y=" + pathPositions[i].y + ")",data:{}} );
			}
		}
	}
}
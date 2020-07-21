package controler{
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	
	import gameUI.GameArea;
	
	import settings.EditorItem;
	
	public class ItemInfo extends EditorItem{
		
		private var dragItem: Sprite;
		private var dragStartPosition: Point;
		protected var dragEndPosition:Point;
		
		public function ItemInfo(){
			super();
		}
		
		protected function onDrag(event:MouseEvent):void{
			dragItem = event.currentTarget as Sprite;
			dragStartPosition = new Point( dragItem.x, dragItem.y );
			
			dragItem.startDrag( false );
			stage.addEventListener( MouseEvent.MOUSE_UP, onDragEnd );
		}
		
		protected function onDragEnd(event:MouseEvent):void{
			dragItem.stopDrag();
			
			var pt: Point = this.localToGlobal( new Point( dragItem.x, dragItem.y ) );
			if( pt.x < GameArea.gameAreaWidth && pt.y < GameArea.gameAreaHeight ) dragEndPosition = pt;
			else dragEndPosition = null;
			
			dragItem.x = dragStartPosition.x;
			dragItem.y = dragStartPosition.y;			
		}
	}
}
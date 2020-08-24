package paytable.paytableFilter{
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	
	public class PaytableItem extends PaytableFilterUI{
		
		private var dragStartPosition: Point;
		
		public function PaytableItem( ptName: String ){
			super( ptName );
			
			this.x = 20;
			this.addEventListener( MouseEvent.MOUSE_DOWN, onDrag );
		}
		
		protected function onDrag(event:MouseEvent):void{
			dragStartPosition = new Point( this.x, this.y );
			
			this.startDrag( false );
			stage.addEventListener( MouseEvent.MOUSE_UP, onDragEnd );
		}
		
		protected function onDragEnd(event:MouseEvent):void{
			stage.removeEventListener( MouseEvent.MOUSE_UP, onDragEnd );
			this.stopDrag();

			if( this.x > 120 && this.x < 480 )	this.dispatchEvent( new Event( "dragEnd" ) );

			this.x = dragStartPosition.x;
			this.y = dragStartPosition.y;			
		}
	}
}
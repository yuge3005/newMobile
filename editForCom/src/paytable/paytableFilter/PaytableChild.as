package paytable.paytableFilter{
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	public class PaytableChild extends PaytableFilterUI{
		
		public function PaytableChild( ptName: String ){
			super( ptName );
			
			this.doubleClickEnabled = true;
			this.addEventListener( MouseEvent.DOUBLE_CLICK, onDelete );
			this.addEventListener( Event.REMOVED_FROM_STAGE, onRemove );
		}
		
		private function onDelete( event: MouseEvent ): void{
			this.dispatchEvent( new Event( "deleteItem" ) );
		}
		
		private function onRemove( event: Event ): void{
			this.removeEventListener( MouseEvent.DOUBLE_CLICK, onDelete );
			this.removeEventListener( Event.REMOVED_FROM_STAGE, onRemove );
		}
	}
}
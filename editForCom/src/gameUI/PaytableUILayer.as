package gameUI{
	import flash.events.MouseEvent;
	import flash.geom.Point;
	
	import paytable.PaytableUI;
	
	import settings.GameConfigObject;
	
	public class PaytableUILayer extends GameArea{
		
		private var paytableUIObjects: Object = {};
		
		public function PaytableUILayer(){
			super();
		}
		
		public function addPaytable( paytableName: String, pt: Point, paytableObject: Object ): void{
			
			if( paytableUIObjects[paytableName] && this.contains( paytableUIObjects[paytableName] ) )this.removeChild( paytableUIObjects[paytableName] );
			paytableUIObjects[paytableName] = new PaytableUI( paytableObject.useBckgroundPicture );
			paytableUIObjects[paytableName].setText( paytableObject.UItext, paytableObject.textColor, paytableObject.textSize );
			paytableUIObjects[paytableName].setBackground( paytableObject.bgPicture );
			paytableUIObjects[paytableName].addEventListener( MouseEvent.MOUSE_DOWN, onGameAreaItemDrag );
			paytableUIObjects[paytableName].name = paytableName;
			addItemAt( paytableUIObjects[paytableName], pt.x, pt.y );
			resetPaytableUIPosition( paytableName, pt );
		}
		
		protected override function onGameAreaItemEndDrag(event:MouseEvent): void{
			resetPaytableUIPosition( currentItem.name, new Point( currentItem.x, currentItem.y ) );
			super.onGameAreaItemEndDrag( event );
		}
		
		private function resetPaytableUIPosition( name: String, pt: Point ): void{
			GameConfigObject.payTables[name].position = new Point( pt.x, pt.y );
			trace( pt );
		}
	}
}
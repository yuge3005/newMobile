package settings{
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	
	import fl.controls.LabelButton;
	
	public class EditorItem extends Sprite{
		
		public function EditorItem(){
			super();
		}
		
		protected function addItemAt( item: DisplayObject, x: int, y: int, width: int = 0, labelString: String = null ):DisplayObject{
			item.x = x;
			item.y = y;
			this.addChild( item );
			if( width )item.width = width;
			if( labelString )(item as LabelButton).label = labelString;
			return item;
		}
		
		protected function report( eventType: String, data: * = null ):void{
			var ev: EditorEvent = new EditorEvent( eventType );
			ev.data = data;
//			trace( getQualifiedClassName( this ) + ":  " + eventType );
			dispatchEvent( ev );
		}
	}
}
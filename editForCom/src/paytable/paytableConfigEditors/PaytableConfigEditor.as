package paytable.paytableConfigEditors{
	import flash.events.MouseEvent;
	
	import fl.controls.Button;
	
	import settings.EditorItem;
	import settings.GameConfigObject;
	
	public class PaytableConfigEditor extends EditorItem{
		
		protected var closeBtn: Button;
		protected var loadBtn: Button;
		protected var saveBtn: Button;
		protected var deleteBtn: Button;
		
		public function PaytableConfigEditor(){
			graphics.beginFill( 0xFFFFFF );
			graphics.drawRect( 0, 0, editForCom.editorWidth, editForCom.editorHeight );
			graphics.endFill();
			
			getPaytables();			
			buildButtons();
		}
		
		protected function getPaytables(): void{
			
		}
		
		protected function buildButtons(): void{
			closeBtn = addItemAt( new Button, editForCom.editorWidth - 140, 20, 120, "close" ) as Button;
			closeBtn.addEventListener( MouseEvent.CLICK, onClose );
			loadBtn = addItemAt( new Button, editForCom.editorWidth - 140, 60, 120, "load" ) as Button;
			loadBtn.addEventListener( MouseEvent.CLICK, onLoad );
			saveBtn = addItemAt( new Button, editForCom.editorWidth - 140, 100, 120, "save" ) as Button;
			saveBtn.addEventListener( MouseEvent.CLICK, onSave );
			deleteBtn = addItemAt( new Button, editForCom.editorWidth - 140, 140, 120, "delete" ) as Button;
			deleteBtn.addEventListener( MouseEvent.CLICK, onDeleteFilter );
		}
		
		protected function onClose( event: MouseEvent ): void{
			this.parent.removeChild( this );
		}
		
		protected function onSave( event: MouseEvent ): void{
			//need be override by sub class
		}
		
		protected function onLoad( event: MouseEvent ): void{
			//need be override by sub class
		}
		
		protected function onDeleteFilter( event: MouseEvent ): void{
			//need be override by sub class
		}
	}
}
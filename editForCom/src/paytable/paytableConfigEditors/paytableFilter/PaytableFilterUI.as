package paytable.paytableConfigEditors.paytableFilter{
	import flash.text.TextField;
	
	import settings.EditorItem;
	
	public class PaytableFilterUI extends EditorItem{
		
		public function PaytableFilterUI(  ptName: String ){
			super();
			
			var tx: TextField = new TextField;
			tx.text = ptName;
			tx.x = 5;
			
			this.name = ptName;
			
			this.addChild( tx );
			this.graphics.beginFill( 0x999999 );
			this.graphics.drawRect( 0, 0, 100, 20 );
			this.graphics.endFill();
			
			this.mouseChildren = false;
		}
	}
}
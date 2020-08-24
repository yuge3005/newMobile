package paytable.paytableFilter{
	import flash.display.Sprite;
	import flash.text.TextField;
	
	public class PaytableFilterUI extends Sprite{
		
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
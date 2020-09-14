package paytable.paytableConfigEditors.paytableFitEffect
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import fl.controls.TextInput;
	
	import paytable.paytableConfigEditors.paytableFilter.PaytableFilterUI;
	
	import settings.FilesLoader;
	
	public class RuleItem extends PaytableFilterUI
	{
		private var tx: TextInput;
		
		public function RuleItem(ptName:String)
		{
			super(ptName);
			
			var sp: Sprite = new Sprite;
			sp.graphics.beginFill( 0, 0 );
			sp.graphics.drawRect( 0, 0, 100, 20 );
			sp.graphics.endFill();
			this.addChild( sp );
			this.hitArea = sp;
			
			this.addEventListener( MouseEvent.CLICK, onClick );
			this.addEventListener( MouseEvent.RIGHT_CLICK, onRightClick );
				
			tx = addItemAt( new TextInput, 120, 0, 120 ) as TextInput;
			tx.enabled = false;
		}
		
		protected function onClick( event: MouseEvent ): void{
			new FilesLoader().selectFile( onEffectFileSellect, "png" );
		}
		
		protected function onEffectFileSellect(event:Event): void{
			tx.text = event.target.name;
		}
		
		protected function onRightClick(event:MouseEvent): void{
			tx.text = "";
		}
		
		public function get fitEffect(): String{
			if( tx.text == "" ) return null;
			return tx.text;
		}
		
		public function set fitEffect( value: String ): void{
			if( value && value != "" )tx.text = value;
			else tx.text = "";
		}
	}
}
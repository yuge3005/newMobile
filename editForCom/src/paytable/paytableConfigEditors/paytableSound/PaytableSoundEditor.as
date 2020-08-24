package paytable.paytableConfigEditors.paytableSound{
	import flash.display.Sprite;
	
	import paytable.paytableConfigEditors.PaytableConfigEditor;
	
	import settings.GameConfigObject;
	
	public class PaytableSoundEditor extends PaytableConfigEditor{
		
		private var paytablesRulesList: Vector.<Vector.<String>>;
		private var paytablesRulesListUIContainer: Vector.<Sprite>;
		
		public function PaytableSoundEditor(){
		}
		
		protected override function getPaytables():void{
			var paytableData: Object = GameConfigObject.payTables;
			var i: int = 0;
			paytables = new Vector.<String>;
			paytablesRulesList = new Vector.<Vector.<String>>;
			paytablesRulesListUIContainer = new Vector.<Sprite>;
			for( var ob: String in paytableData ){
				var sp: PaytableSoundItem = new PaytableSoundItem( ob );
				sp.y = 20 + 40 * i;
				this.addChild( sp );
				//				sp.addEventListener( "dragEnd", onDragEnd );
				paytables[i] = ob;
				paytablesRulesList[i] = new Vector.<String>;
				paytablesRulesListUIContainer[i] = new Sprite;
				i++;
			}
		}
	}
}
package paytable.paytableConfigEditors.paytableSound{
	import flash.events.Event;
	
	import fl.controls.TextInput;
	
	import paytable.paytableConfigEditors.PaytableConfigEditor;
	
	import settings.EditorEvent;
	import settings.GameConfigObject;
	
	public class PaytableSoundEditor extends PaytableConfigEditor{
		
		private var paytablesSoundNamest: Vector.<TextInput>;
		
		public function PaytableSoundEditor(){
		}
		
		protected override function getPaytables():void{
			var paytableData: Object = GameConfigObject.payTables;
			var i: int = 0;
			paytables = new Vector.<String>;
			paytablesSoundNamest = new Vector.<TextInput>;
			for( var ob: String in paytableData ){
				var sp: PaytableSoundItem = new PaytableSoundItem( ob );
				sp.y = 20 + 40 * i;
				this.addChild( sp );
				sp.addEventListener( EditorEvent.PAYTABLE_SOUND_CHOSEN, onSoundChosen );
				sp.addEventListener( "deleteItem", onDelete );
				paytables[i] = ob;
				paytablesSoundNamest[i] = addItemAt( new TextInput, 150, sp.y, 150 );
				paytablesSoundNamest[i].enabled = false;
				i++;
			}
		}
		
		private function onSoundChosen( event: EditorEvent ): void{
			var ptSound: PaytableSoundItem = event.target as PaytableSoundItem;
			var index: int = ( ptSound.y + 1 ) / 40;
			paytablesSoundNamest[index].text = event.data;
		}
		
		private function onDelete( event: Event ): void{
			var ptSound: PaytableSoundItem = event.target as PaytableSoundItem;
			var index: int = ( ptSound.parent.y + 1 ) / 40;
			var childIndex: int = paytablesSoundNamest[index].text = "";
		}
	}
}
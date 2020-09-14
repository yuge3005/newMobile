package paytable.paytableConfigEditors.paytableSound{
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import fl.controls.TextInput;
	
	import paytable.paytableConfigEditors.PaytableConfigEditor;
	
	import settings.EditorEvent;
	import settings.GameConfigObject;
	
	public class PaytableSoundEditor extends PaytableConfigEditor{
		
		private var paytablesSoundNames: Vector.<TextInput>;
		
		public function PaytableSoundEditor(){
		}
		
		protected override function getPaytables():void{
			var paytableData: Object = GameConfigObject.payTables;
			var i: int = 0;
			paytables = new Vector.<String>;
			paytablesSoundNames = new Vector.<TextInput>;
			for( var ob: String in paytableData ){
				var sp: PaytableSoundItem = new PaytableSoundItem( ob );
				sp.y = 20 + 40 * i;
				this.addChild( sp );
				sp.addEventListener( EditorEvent.PAYTABLE_SOUND_CHOSEN, onSoundChosen );
				sp.addEventListener( "deleteItem", onDelete );
				paytables[i] = ob;
				paytablesSoundNames[i] = addItemAt( new TextInput, 150, sp.y, 150 );
				paytablesSoundNames[i].enabled = false;
				i++;
			}
		}
		
		private function onSoundChosen( event: EditorEvent ): void{
			var ptSound: PaytableSoundItem = event.target as PaytableSoundItem;
			var index: int = ( ptSound.y + 1 ) / 40;
			paytablesSoundNames[index].text = event.data;
		}
		
		private function onDelete( event: Event ): void{
			var ptSound: PaytableSoundItem = event.target as PaytableSoundItem;
			var index: int = ( ptSound.y + 1 ) / 40;
			var childIndex: int = paytablesSoundNames[index].text = "";
		}
		
		protected override function onSave( event: MouseEvent ): void{
			var soundObject: Object = {};
			for( var i: int = 0; i < paytables.length; i++ ){
				if( paytablesSoundNames[i].text != "" ){
					soundObject[paytables[i]] = paytablesSoundNames[i].text;
				}
			}
			GameConfigObject.payTablesSound = soundObject;
		}
		
		protected override function onLoad( event: MouseEvent ): void{
			if( GameConfigObject.payTablesSound ){
				var soundObject: Object = GameConfigObject.payTablesSound;
				for( var ob: String in soundObject ){
					var index: int = paytables.indexOf( ob );
					paytablesSoundNames[index].text = soundObject[ob];
				}
			}
		}
		
		protected override function onDeleteFilter( event: MouseEvent ): void{
			GameConfigObject.payTablesSound = null;
		}
	}
}
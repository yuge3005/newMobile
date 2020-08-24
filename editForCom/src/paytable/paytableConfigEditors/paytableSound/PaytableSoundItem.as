package paytable.paytableConfigEditors.paytableSound{
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import paytable.paytableConfigEditors.paytableFilter.PaytableFilterUI;
	
	import settings.EditorEvent;
	import settings.FilesLoader;

	public class PaytableSoundItem extends PaytableFilterUI{
		
		public function PaytableSoundItem( ptName: String ){
			super( ptName );
			
			this.x = 20;
			this.addEventListener( MouseEvent.CLICK, onClick );
			this.addEventListener( MouseEvent.RIGHT_CLICK, onRightClick );
		}
		
		protected function onClick( event: MouseEvent ): void{
			new FilesLoader().selectFile( onSoundFileSellect, "mp3,wav" );
		}
		
		protected function onSoundFileSellect(event:Event): void{
			report( EditorEvent.PAYTABLE_SOUND_CHOSEN, event.target.name );
		}
		
		protected function onRightClick(event:MouseEvent): void{
			report( "deleteItem" );
		}
	}
}
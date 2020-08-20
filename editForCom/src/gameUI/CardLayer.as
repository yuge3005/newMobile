package gameUI{
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	
	import settings.EditorEvent;
	import settings.GameConfigObject;
	import settings.GameRes;
	
	public class CardLayer extends GameArea{
		
		public function CardLayer(){
			super();
		}
		
		public function addCardPosition( data: Point ):void{
			var sp: Sprite = GameRes.buildItemByName( GameConfigObject.card.cardBg );
			addGameAreaItem( sp, data, EditorEvent.CARD_POSITION_CHANGE );
		}
		
		override protected function onGameAreaItemEndDrag(event:MouseEvent):void{
			super.onGameAreaItemEndDrag(event);
			report( EditorEvent.CARD_POSITION_CHANGE );
		}		
		
		public function clearPostion():void{
			this.removeChildren();
			report( EditorEvent.CARD_POSITION_CHANGE );
		}
	}
}
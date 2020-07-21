package controler{
	import flash.display.Sprite;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.ui.Keyboard;
	
	import fl.controls.List;
	
	import settings.EditorEvent;
	import settings.GameConfigObject;
	import settings.GameRes;
	
	public class CardPositionInfo extends ItemInfo{
		
		private var cardUI: Sprite;
		
		private var cardPositionList: List;
		
		/**
		 * 卡背景
		 * @return
		 */		
		public function get cardBg(): String{
			return GameConfigObject.card.cardBg ? GameConfigObject.card.cardBg : "";
		}
		
		public function get disabledBg(): String{
			return GameConfigObject.card.disabledBg ? GameConfigObject.card.disabledBg : "";
		}
		
		public function CardPositionInfo(){
			cardPositionList = addItemAt( new List, 0, 85, 130 ) as List;
			cardPositionList.height = 70;
			cardPositionList.addEventListener( KeyboardEvent.KEY_DOWN, onItemKeyDown );
		}
		
		protected function onItemKeyDown(event:KeyboardEvent):void{
			var selectedIndex: int = ( event.target as List ).selectedIndex;
			if( selectedIndex < 0 )return;
			
			var ar: Array;
			if( [ Keyboard.A, Keyboard.S, Keyboard.F, Keyboard.W ].indexOf( event.keyCode ) >= 0 ){
				ar = getCardPostions();
				var movePoint: Object = ar[selectedIndex];
				if( event.keyCode == Keyboard.A )movePoint.x += -1;
				else if( event.keyCode == Keyboard.W )movePoint.y += -1;
				else if( event.keyCode == Keyboard.F )movePoint.x += 1;
				else if( event.keyCode == Keyboard.S )movePoint.y += 1;
				reAddCardPosition( ar );
				( event.target as List ).selectedIndex = selectedIndex;
			}
			else if( event.keyCode == Keyboard.DELETE ){
				ar = getCardPostions();
				ar.splice( selectedIndex, 1 );
				reAddCardPosition( ar );
			}
		}
		
		private function getCardPostions():Array{
			var pts: Array = [];
			for( var i: int = 0; i < cardPositionList.length; i++ ){
				cardPositionList.selectedIndex = i;
				var str: String = cardPositionList.selectedItem.label;
				var ar: Array = str.match( /(?<==)(\d+)/g );
				pts.push( new Point( ar[0], ar[1] ) );
			}
			return pts;
		}
		
		private function reAddCardPosition( pts: Array ):void	{
			report( EditorEvent.CLEAR_CARD_POSITIONS );
			for( var i: int = 0; i < pts.length; i++ ){
				report( EditorEvent.ADD_CARD_POSITION, pts[i] );
			}
		}
		
		public function showEnalbedUI( show: Boolean ): void{
			if( cardUI && this.contains( cardUI ) ){
				cardUI.removeEventListener( MouseEvent.MOUSE_DOWN, onDrag );
				removeChild( cardUI );
			}
			
			if( show )
				showBg( GameConfigObject.card.cardBg );
			else
				showBg( GameConfigObject.card.disabledBg );
		}
		
		private function showBg( name: String ): void{
			if( !name )return;
			
			cardUI = GameRes.buildItemByName( name );
			cardUI.width = 130;
			cardUI.height = 80;
			cardUI.addEventListener( MouseEvent.MOUSE_DOWN, onDrag );
			addChild( cardUI );
		}
		
		protected override function onDragEnd(event:MouseEvent):void{
			super.onDragEnd( event );
			if( dragEndPosition )report( EditorEvent.ADD_CARD_POSITION, dragEndPosition );
		}
		
		public function refreshCardPositionList( positionList: Array ):void{
			GameConfigObject.card.cardPositions = [];
			cardPositionList.removeAll();
			for( var i:int = 0; i < positionList.length; i++ ){
				GameConfigObject.card.cardPositions.push( {x:positionList[i].x,y:positionList[i].y} );
				cardPositionList.addItem( {label: (i+1) + "(x=" + positionList[i].x +",y=" + positionList[i].y + ")",data:{}} );
			}
		}
	}
}
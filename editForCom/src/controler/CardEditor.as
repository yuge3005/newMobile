package controler{
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.ui.Keyboard;
	
	import fl.controls.CheckBox;
	import fl.controls.ColorPicker;
	import fl.controls.List;
	import fl.controls.NumericStepper;
	import fl.controls.TextInput;
	import fl.events.ColorPickerEvent;
	
	import settings.EditorEvent;
	import settings.GameConfigObject;
	
	public class CardEditor extends EditorControl	{
		
		private var bgPicture: TextInput;
		
		private var defaultBgPicture: TextInput;
		private var onEffBgPicture: TextInput;
		private var linePicNamePicture: TextInput;
		private var blink1PicPicture: TextInput;
		private var blink2PicPicture: TextInput;
		private var useforkPicture: TextInput;
		
		private var numberColor:ColorPicker;
		private var numberColorOnEffect:ColorPicker;
		private var numberBackgroundColorOnEffect:ColorPicker;
		
		private var colorNumberOnEffect:CheckBox;
		private var colorNumberBackgroundOnEffect:CheckBox;
		
		private var vertSize:NumericStepper;
		private var horzSize:NumericStepper;
		private var horzGap:NumericStepper;
		private var vertGap:NumericStepper;
		
		private var numberInitialPositionX:NumericStepper;
		private var numberInitialPositionY:NumericStepper;
		private var numberSizeY:NumericStepper;
		private var numberSizeX:NumericStepper;
		
		private var cardTitleColors: ColorPicker;
		private var colorList: List;
		
		private var cardPositionInfo: CardPositionInfo;
		
		public function CardEditor(){
			drawBackground( 0xFFFFEE, new Rectangle( 0, 0, 960, 220 ) );
			
			textureList = createComboBox( 20, 20 );
			animationList = createComboBox( 20, 60 );
			
			bgPicture = addTextInputWithLabel( 20, 140, 130, "normal bg:" );
			
			defaultBgPicture = addTextInputWithLabel( 800, 20, 130, "defaultBg:" );
			onEffBgPicture = addTextInputWithLabel( 800, 60, 130, "onEffBg:" );
			linePicNamePicture = addTextInputWithLabel( 800, 100, 130, "linePicName:" );
			blink1PicPicture = addTextInputWithLabel( 800, 140, 130, "blink1Pic:" );
			blink2PicPicture = addTextInputWithLabel( 800, 180, 130, "blink2Pic:" );
			useforkPicture = addTextInputWithLabel( 350, 180, 130, "usefork:" );
			
			numberColor = addColorChooser( 170, 20, 146, "numColor:", onColorChange );
			
			numberColorOnEffect = addColorChooser( 166, 60, 150, "", onColorChange );
			colorNumberOnEffect = addCheckBox( 166, 60, 150, "numColorOnEff", onCheckBoxClick );
			
			numberBackgroundColorOnEffect = addColorChooser( 166, 100, 150, "", onColorChange );
			colorNumberBackgroundOnEffect = addCheckBox( 166, 100, 150, "numBgColorOnEff", onCheckBoxClick );
			
			vertSize = addNumericStepper( 510, 20, 120, "vertSize:", onSetSize );
			horzSize = addNumericStepper( 510, 60, 120, "horzSize:", onSetSize );
			horzGap = addNumericStepper( 510, 100, 120, "horzGap:", onSetSize );
			vertGap = addNumericStepper( 510, 140, 120, "vertGap:", onSetSize );
			
			numberInitialPositionY = addNumericStepper( 170, 140, 146, "", onSetSize, 200 );
			numberInitialPositionX = addNumericStepper( 170, 140, 106, "initPosXY", onSetSize, 200 );
			numberInitialPositionX.minimum = -20;
			numberInitialPositionY.minimum = -20;
			numberSizeY = addNumericStepper( 170, 180, 146, "", onSetSize, 200 );
			numberSizeX = addNumericStepper( 170, 180, 106, "numSizeWH", onSetSize, 200 );
			
			cardTitleColors = addColorChooser( 350, 20, 130, "cardTitleColors", onTitleColorAdd );
			colorList = addItemAt( new List, 350, 60, 130 ) as List;
			colorList.height = 80;
			colorList.addEventListener( KeyboardEvent.KEY_DOWN, onColorListKeyDown );
			
			cardPositionInfo = addItemAt( new CardPositionInfo, 650, 50 ) as CardPositionInfo;
			cardPositionInfo.addEventListener( EditorEvent.ADD_CARD_POSITION, bubbleEvent );
			cardPositionInfo.addEventListener( EditorEvent.CLEAR_CARD_POSITIONS, bubbleEvent );
		}
		
		private function onSetSize( event: Event ):void{
			if( !GameConfigObject.card.size )GameConfigObject.card.size = {};
			var sizeObj: Object = GameConfigObject.card.size;
			sizeObj.vertSize = vertSize.value;
			sizeObj.horzSize = horzSize.value;
			sizeObj.horzGap = horzGap.value;
			sizeObj.vertGap = vertGap.value;
			sizeObj.numberInitialPositionY = numberInitialPositionY.value;
			sizeObj.numberInitialPositionX = numberInitialPositionX.value;
			sizeObj.numberSizeY = numberSizeY.value;
			sizeObj.numberSizeX = numberSizeX.value;
		}
		
		private function onCheckBoxClick( event: Event ):void{
			setColorDatas();
		}
		
		private function onColorChange( event: ColorPickerEvent ):void{
			setColorDatas();
		}
		
		private function setColorDatas():void	{
			if( !GameConfigObject.card.colors )GameConfigObject.card.colors = {};
			var colorObject: Object = GameConfigObject.card.colors;
			colorObject.numberColor = numberColor.selectedColor;
			colorObject.numberColorOnEffect = numberColorOnEffect.selectedColor;
			colorObject.numberBackgroundColorOnEffect = numberBackgroundColorOnEffect.selectedColor;
			colorObject.colorNumberOnEffect = colorNumberOnEffect.selected;
			colorObject.colorNumberBackgroundOnEffect = colorNumberBackgroundOnEffect.selected;
		}
		
		private function refreshTileColorList():void{
			colorList.removeAll();
			var titleColors: Array = GameConfigObject.card.titleColors;
			if( !titleColors )return;
			for( var i:int = 0; i < titleColors.length; i++ ){
				colorList.addItem( { label: "#_" + titleColors[i].toString( 16 ) } );
			}
		}
		
		override protected function onTextureItemSellect(event:Event):void{
			GameConfigObject.card.cardBg = textureList.selectedItem.label;
			resetBg();
		}
		
		private function onTitleColorAdd( event: ColorPickerEvent ):void{
			if( !GameConfigObject.card.titleColors )GameConfigObject.card.titleColors = [];
			var titleColors: Array = GameConfigObject.card.titleColors;
			titleColors.push( event.color );
			refreshTileColorList();
		}
		
		protected function onColorListKeyDown(event:KeyboardEvent):void{
			var selectIndex: int = ( event.target as List ).selectedIndex;
			if( selectIndex < 0 )return;
			var titleColors: Array = GameConfigObject.card.titleColors;
			if( event.keyCode == Keyboard.DELETE ){				
				titleColors.splice( selectIndex, 1 );
				refreshTileColorList();
			}
			else if( event.keyCode == Keyboard.ENTER ){
				cardTitleColors.selectedColor = titleColors[selectIndex];
			}
		}
		
		public function showCardInfo():void{
			refreshTileColorList();
			resetSizeNumbers();
			resetColor();
			resetBg();
			resetCardPositions();
		}
		
		private function resetCardPositions():void{
			if( GameConfigObject.card.cardPositions ){
				var ar: Array = GameConfigObject.card.cardPositions;
				for( var i: int = 0; i < ar.length; i++ ){
					report( EditorEvent.ADD_CARD_POSITION, new Point( ar[i].x, ar[i].y ) );
				}
			}
		}
		
		private function resetColor():void{
			if( !GameConfigObject.card.colors )return;
			var colorObject: Object = GameConfigObject.card.colors;
			numberColor.selectedColor = colorObject.numberColor;
			numberColorOnEffect.selectedColor = colorObject.numberColorOnEffect;
			numberBackgroundColorOnEffect.selectedColor = colorObject.numberBackgroundColorOnEffect;
			colorNumberOnEffect.selected = colorObject.colorNumberOnEffect;
			colorNumberBackgroundOnEffect.selected = colorObject.colorNumberBackgroundOnEffect;
		}
		
		private function resetBg():void{
			bgPicture.text = cardPositionInfo.cardBg;
			cardPositionInfo.showEnalbedUI();
		}
		
		private function resetSizeNumbers():void{
			if( !GameConfigObject.card.size )return;
			var sizeObj: Object = GameConfigObject.card.size;
			vertSize.value = sizeObj.vertSize;
			horzSize.value = sizeObj.horzSize;
			horzGap.value = sizeObj.horzGap;
			vertGap.value = sizeObj.vertGap;
			numberInitialPositionY.value = sizeObj.numberInitialPositionY;
			numberInitialPositionX.value = sizeObj.numberInitialPositionX;
			numberSizeY.value = sizeObj.numberSizeY;
			numberSizeX.value = sizeObj.numberSizeX;
		}
		
		public function refreshCardPositionList( positionList: Array ):void{
			cardPositionInfo.refreshCardPositionList( positionList );
		}
		
		protected override function addTextInputWithLabel( x: int, y: int, width: int, labelText: String, textInputWidth: int = 70 ) : TextInput{
			var ti: TextInput = super.addTextInputWithLabel( x, y, width, labelText, 60 );
			ti.enabled = false;
			return ti;
		}
	}
}
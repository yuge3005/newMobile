package controler{
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Rectangle;
	import flash.text.TextField;
	
	import fl.controls.Button;
	import fl.controls.CheckBox;
	import fl.controls.ColorPicker;
	import fl.controls.ComboBox;
	import fl.controls.Label;
	import fl.controls.NumericStepper;
	import fl.controls.Slider;
	import fl.controls.TextInput;
	import fl.events.ColorPickerEvent;
	import fl.events.ComponentEvent;
	
	import settings.EditorEvent;
	import settings.EditorItem;
	import settings.GameRes;
	
	public class EditorControl extends EditorItem{
		
		/**素材名表*/		
		protected var textureList: ComboBox;
		/**动画素材名表*/
		protected var animationList: ComboBox;
		
		public function EditorControl(){
		}
		
		protected function drawBackground( color: uint, rect: Rectangle ):void{
			graphics.beginFill( color );
			graphics.drawRect( rect.x, rect.y, rect.width, rect.height );
			graphics.endFill();
		}
		
		public function onTextureLoaded():void{
			if( !GameRes.textureData )return;
			var frames: Object = GameRes.textureData;
			textureList.removeAll();
			for( var ob: Object in frames ){
				textureList.addItem( { label:ob, data:frames[ob] } );
			}
			textureList.addEventListener(ComponentEvent.ENTER, onTextureItemSellect );
			textureList.enabled = true;
		}
		
		public function onAnimationFileLoaded():void{			
			var movieClips: Object = GameRes.movieClipFrameData;
			animationList.removeAll();
			for( var ob: Object in movieClips ){
				animationList.addItem( { label: ob } );
			}
			animationList.addEventListener(ComponentEvent.ENTER, onAnimationComboxItemSellect );
			animationList.addEventListener(Event.CHANGE, onAnimationComboxItemSellect );
		}
		
		protected function onTextureItemSellect(event:Event):void{
			//need be override by sub class
		}
		
		protected function onAnimationComboxItemSellect(event:Event):void{
			//TODO Auto-generated method stub
		}
		
		public function enableAnimationList():void{
			animationList.enabled = true;
		}
		
		protected function bubbleEvent(event:EditorEvent):void{
			report( event.type, event.data );
		}
		
/****************************************************************************************************************************************************************/
		
		protected function createComboBox( x: int, y: int, width: int = 130 ):ComboBox{
			var combo: ComboBox = addItemAt( new ComboBox, x, y, width ) as ComboBox;
			combo.enabled = false;
			return combo;
		}
		
		protected function addButtonAt( x: int, y: int, width: int, label: String, callback: Function ): Button{
			var btn: Button = addItemAt( new Button, x, y, width, label ) as Button;
			btn.addEventListener( MouseEvent.CLICK, callback );
			return btn;
		}
		
		protected function addColorChooser( x: int, y: int, width: int, labelText: String, callback: Function ): ColorPicker{
			addLabel( x, y, labelText );
			var colorChooser: ColorPicker = addItemAt( new ColorPicker, x + width - 26, y ) as ColorPicker;
			colorChooser.addEventListener( ColorPickerEvent.CHANGE, callback );
			return colorChooser;
		}
		
		protected function addNumericStepper( x: int, y: int, width: int, labelText: String, callback: Function, max: int = 0 ): NumericStepper{
			addLabel( x, y, labelText );
			var numberSet: NumericStepper = addItemAt( new NumericStepper, x + width - 40, y, 40 ) as NumericStepper;
			if( max )numberSet.maximum = max;
			numberSet.addEventListener( Event.CHANGE, callback );
			return numberSet;
		}
		
		protected function addTextInputWithLabel( x: int, y: int, width: int, labelText: String, textInputWidth: int = 70 ) : TextInput{
			addLabel( x, y, labelText );
			var textInput: TextInput = addItemAt( new TextInput, x + width - textInputWidth, y, textInputWidth ) as TextInput;
			return textInput;
		}
		
		protected function addSlider( x: int, y: int, width: int, labelText: String, callback: Function ):Slider{
			addLabel( x, y, labelText );
			var slider: Slider = addItemAt( new Slider, x + width - 50, y + 10, 50 ) as Slider;
			return slider;
		}
		
		protected function addTipAt( x: int, y: int, width: int, labelText: String, height: int ): void{
			var tipLabel: TextField = addItemAt( new TextField, x, y, width ) as TextField;
			tipLabel.height = height;
			tipLabel.multiline = true;
			tipLabel.wordWrap = true;
			tipLabel.text = labelText;
			tipLabel.selectable = false;
			tipLabel.mouseEnabled = false;
		}
		
		protected function addCheckBox( x: int, y: int, width: int, labelText: String, callback: Function ): CheckBox{
			var check: CheckBox = addItemAt( new CheckBox, x, y, width, labelText ) as CheckBox;
			if( callback )check.addEventListener(Event.CHANGE, callback );
			return check;
		}
		
		private function addLabel( x: int, y: int, labelText: String ):void{
			var tip: Label = addItemAt( new Label, x, y + 2 ) as Label;
			tip.text = labelText;
		}
	}
}
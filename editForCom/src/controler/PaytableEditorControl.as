package controler{
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.ui.Keyboard;
	
	import fl.controls.Button;
	import fl.controls.CheckBox;
	import fl.controls.ColorPicker;
	import fl.controls.List;
	import fl.controls.NumericStepper;
	import fl.controls.Slider;
	import fl.controls.TextInput;
	
	import settings.EditorEvent;
	import settings.GameConfigObject;
	
	public class PaytableEditorControl extends EditorControl{
		
		/**名称*/
		private var nameTxt: TextInput;
		/**规则*/
		private var ruleTxt1: TextInput;
		private var ruleTxt2: TextInput;
		private var ruleTxt3: TextInput;
		private var ruleTxt4: TextInput;
		private var ruleTxt5: TextInput;
		private var ruleTxt6: TextInput;
		private var ruleTxt7: TextInput;
		private var ruleTxt8: TextInput;
		private var ruleTxt9: TextInput;
		private var ruleTxt10: TextInput;
		/**规则表*/
		private var paytableList: List;
		/**规则文本*/
		private var paytableUITxt: TextInput;
		/**是否使用背景图，不使用则用文本*/
		private var useBg: CheckBox;
		/**小方块规则文本*/
		private var gridRuleTxt: TextInput;
		/**文字颜色*/
		private var textColor: ColorPicker;
		/**文字大小*/
		private var textSize: NumericStepper;
		/**闪烁1颜色*/
		private var blinkColor1: ColorPicker;
		/**闪烁1不透明度*/
		private var blinkAlpha1: Slider;
		/**闪烁2颜色*/
		private var blinkColor2: ColorPicker;
		/**闪烁2不透明度*/
		private var blinkAlpha2: Slider;
		
		private var paytableInfo: PaytableInfo;
		
		private var filterEditorButton: Button;
		private var soundEditorButton: Button;
		private var fitEffectEditorButton: Button;
		
		public function PaytableEditorControl(){
			drawBackground( 0xEEEEFF, new Rectangle( -20, 0, 960, 340 ) );
			
			textureList = createComboBox( 0, 20 );
			
			paytableList = addItemAt( new List, 180, 20, 120 ) as List;
			paytableList.height = 160;
			paytableList.addEventListener( KeyboardEvent.KEY_DOWN, onPaytableListKeyDown );
			
			paytableUITxt = addTextInputWithLabel( 0, 60, 130, "UI text:", 80 );
			
			useBg = addCheckBox( 0, 90, 130, "use text or picture", null );
			
			nameTxt = addTextInputWithLabel( 0, 120, 130, "name:", 80 );
			
			addButtonAt( 0, 160, 130, "save paytable rule", onAddRule );
			
			textColor = addColorChooser( 320, 20, 130, "textColor:", onColorChange );
			textSize = addNumericStepper( 470, 20, 130, "textSize", onSizeChange, 50 );
			blinkColor1 = addColorChooser( 320, 55, 130, "blinkColor1:", onColorChange );
			blinkAlpha1 = addSlider( 470, 55, 130, "blinkAlpha1:", onColorChange );
			blinkColor2 = addColorChooser( 320, 90, 130, "blinkColor2:", onColorChange );
			blinkAlpha2 = addSlider( 470, 90, 130, "blinkAlpha2:", onColorChange );
			
			gridRuleTxt = addTextInputWithLabel( 320, 125, 130, "rule for grid", 60 );
			
			ruleTxt1 = addRuleTextInputAt( 470, 125, "rule1:" );			
			ruleTxt2 = addRuleTextInputAt( 320, 158, "rule2:" );
			ruleTxt3 = addRuleTextInputAt( 470, 158, "rule3:" );			
			ruleTxt4 = addRuleTextInputAt( 620, 125, "rule4:" );			
			ruleTxt5 = addRuleTextInputAt( 620, 158, "rule5:" );
			ruleTxt6 = addRuleTextInputAt(   0, 192, "rule6:" );
			ruleTxt7 = addRuleTextInputAt( 160, 192, "rule7:" );
			ruleTxt8 = addRuleTextInputAt( 320, 192, "rule8:" );
			ruleTxt9 = addRuleTextInputAt( 470, 192, "rule9:" );
			ruleTxt10 = addRuleTextInputAt( 620, 192, "rule10:" );
			
			paytableInfo = addItemAt( new PaytableInfo, 620, 20 ) as PaytableInfo;
			paytableInfo.visible = false;
			paytableInfo.addEventListener( EditorEvent.ADD_PAYTABLE_UI, bubbleEvent );
			
			filterEditorButton = addItemAt( new Button, 780, 20, 120, "paytableFilter" ) as Button;
			filterEditorButton.addEventListener( MouseEvent.CLICK, onFilterButtonClick );
			soundEditorButton = addItemAt( new Button, 780, 53, 120, "paytableSound" ) as Button;
			soundEditorButton.addEventListener( MouseEvent.CLICK, onSoundButtonClick );
			fitEffectEditorButton = addItemAt( new Button, 780, 86, 120, "paytablefitEffect" ) as Button;
			fitEffectEditorButton.addEventListener( MouseEvent.CLICK, onFitEffectButtonClick );
		}
		
		private function addRuleTextInputAt( x: int, y: int, lebalString: String ): TextInput{
			var textInput: TextInput = addTextInputWithLabel( x, y, 130, lebalString, 95 );
			textInput.restrict = "0123456789ABCDEF";
			return textInput;
		}
		
		private function onColorChange( event: Event ):void{
			// do nothing
		}
		
		private function onSizeChange( event: Event ):void{
			// do nothing
		}
		
		protected function onAddRule(event:MouseEvent):void{
			var name: String = nameTxt.text;
			if( !name )return;
			var obj: Object = {};
			obj.rule = [];
			if( ruleTxt1.text )obj.rule.push( ruleTxt1.text );
			if( ruleTxt2.text )obj.rule.push( ruleTxt2.text );
			if( ruleTxt3.text )obj.rule.push( ruleTxt3.text );
			if( ruleTxt4.text )obj.rule.push( ruleTxt4.text );
			if( ruleTxt5.text )obj.rule.push( ruleTxt5.text );
			if( ruleTxt6.text )obj.rule.push( ruleTxt6.text );
			if( ruleTxt7.text )obj.rule.push( ruleTxt7.text );
			if( ruleTxt8.text )obj.rule.push( ruleTxt8.text );
			if( ruleTxt9.text )obj.rule.push( ruleTxt9.text );
			if( ruleTxt10.text )obj.rule.push( ruleTxt10.text );
			obj.UItext = paytableUITxt.text;
			obj.useBckgroundPicture = useBg.selected;
			obj.bgPicture = textureList.selectedItem.label;
			obj.gridRule = gridRuleTxt.text;
			obj.textColor = textColor.selectedColor;
			obj.textSize = textSize.value;
			obj.blinkColor1 = blinkColor1.selectedColor;
			obj.blinkColor2 = blinkColor2.selectedColor;
			obj.blinkAlpha1 = blinkAlpha1.value / blinkAlpha1.maximum;
			obj.blinkAlpha2 = blinkAlpha2.value / blinkAlpha2.maximum;
			GameConfigObject.editPaytable( name, obj );
			refreshPaytableList();
		}
		
		private function refreshPaytableList():void{
			var obj: Object = GameConfigObject.payTables;
			paytableList.removeAll();
			for( var ob: Object in obj ){
				paytableList.addItem( { label: ob } );
				if( obj[ob].position ){
					var position: Object = obj[ob].position;
					report( EditorEvent.ADD_PAYTABLE_UI, { paytableName: ob, point: new Point( position.x, position.y ), paytableObject: obj[ob] } );
				}
			}
		}
		
		public function showPaytableInfo():void{
			refreshPaytableList();
		}
		
		protected function onPaytableListKeyDown(event:KeyboardEvent):void{
			var selectObj: Object = ( event.currentTarget as List ).selectedItem;
			if( !selectObj )return;
			var selectItemName: String = selectObj.label;
			if( event.keyCode == Keyboard.ENTER ){
				nameTxt.text = selectItemName;
				var paytableObject: Object = GameConfigObject.payTables[selectItemName];
				paytableUITxt.text = paytableObject.UItext;
				useBg.selected = paytableObject.useBckgroundPicture;				
				gridRuleTxt.text = paytableObject.gridRule;
				textColor.selectedColor = paytableObject.textColor;
				textSize.value = paytableObject.textSize;
				blinkColor1.selectedColor = paytableObject.blinkColor1;
				blinkColor2.selectedColor = paytableObject.blinkColor2;
				blinkAlpha1.value = paytableObject.blinkAlpha1 * blinkAlpha1.maximum;
				blinkAlpha2.value = paytableObject.blinkAlpha2 * blinkAlpha2.maximum;
				var rules: Array = paytableObject.rule;
				getTextByRule( rules[0], ruleTxt1 );
				getTextByRule( rules[1], ruleTxt2 );
				getTextByRule( rules[2], ruleTxt3 );
				getTextByRule( rules[3], ruleTxt4 );
				getTextByRule( rules[4], ruleTxt5 );
				getTextByRule( rules[5], ruleTxt6 );
				getTextByRule( rules[6], ruleTxt7 );
				getTextByRule( rules[7], ruleTxt8 );
				getTextByRule( rules[8], ruleTxt9 );
				getTextByRule( rules[9], ruleTxt10 );
				paytableInfo.getPaytable( paytableObject, selectItemName );
				for( var i: int = 0; i< textureList.length; i++ ){
					if( textureList.getItemAt( i ).label == paytableObject.bgPicture ){
						textureList.selectedIndex = i;
						break;
					}
				}
			}
			else if( event.keyCode == Keyboard.DELETE ){
				GameConfigObject.deletePaytable( selectItemName );
				refreshPaytableList();
			}
			else if( [ Keyboard.A, Keyboard.S, Keyboard.F, Keyboard.W ].indexOf( event.keyCode ) >= 0 ){
				if( paytableInfo.paytableName == selectObj.label ){
					var uiPosition: Point =  GameConfigObject.payTables[selectObj.label].position;
					if( uiPosition ){
						if( event.keyCode == Keyboard.A )uiPosition.x += -1;
						else if( event.keyCode == Keyboard.W )uiPosition.y += -1;
						else if( event.keyCode == Keyboard.F )uiPosition.x += 1;
						else if( event.keyCode == Keyboard.S )uiPosition.y += 1;
						report( EditorEvent.ADD_PAYTABLE_UI, { paytableName: selectObj.label, point: uiPosition, paytableObject: GameConfigObject.payTables[selectObj.label] } );
					}
				}
			}
		}
		
		private function getTextByRule( rule: String, txt: TextInput ):void{
			if( rule )txt.text = rule;
			else txt.text = "";
		}
		
		private function onFilterButtonClick( event: MouseEvent ): void{
			report( EditorEvent.OPEN_PAYTABLE_FILTER_EDITOR );
		}
		
		private function onSoundButtonClick( event: MouseEvent ): void{
			report( EditorEvent.OPEN_PAYTABLE_SOUND_EDITOR );
		}
		
		private function onFitEffectButtonClick( event: MouseEvent ): void{
			report( EditorEvent.OPEN_PAYTABLE_FIT_EFFECT_EDITOR );
		}
	}
}
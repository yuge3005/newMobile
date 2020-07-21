package controler{
	import flash.events.MouseEvent;
	import flash.filters.ColorMatrixFilter;
	
	import paytable.Paytable;
	import paytable.PaytableUI;
	
	import settings.EditorEvent;
	
	public class PaytableInfo extends ItemInfo{
		
		public var table: Paytable;
		
		private var tableUI: PaytableUI;
		
//		private var testingRuleTxt: TextInput;
		
		internal var paytableName: String;
		
		private var paytableObject: Object;
		
		public function PaytableInfo(){
//			testingRuleTxt = addTextInputWithLabel( 0, 45, 130, "testing rule:", 65 );
//			addButtonAt( 0, 70, 130, "test", onTestButtonClick );
		}
		
		public function getPaytable( paytableObject:Object, paytableName: String ):void{
			visible = true;
			
			this.paytableName = paytableName;
			this.paytableObject = paytableObject;
			
			table = new Paytable;
			table.ui = new PaytableUI( paytableObject.useBckgroundPicture );
			table.ui.setText( paytableObject.UItext, paytableObject.textColor, paytableObject.textSize );
			table.ui.setBackground( paytableObject.bgPicture );
			table.ui.addEventListener( MouseEvent.MOUSE_DOWN, onDrag );
			
			if( tableUI && this.contains( tableUI ) )removeChild( tableUI );
			tableUI = table.ui;
			addChild( tableUI );
			
			var effect1: ColorMatrixFilter = getColorMatrix( paytableObject.blinkColor1, paytableObject.blinkAlpha1 );
			var effect2: ColorMatrixFilter = getColorMatrix( paytableObject.blinkColor2, paytableObject.blinkAlpha2 );
			
			tableUI.winEffects = [ effect1, effect2 ];
			tableUI.setGrids( paytableObject.gridRule );
			
			var rules: Array = paytableObject.rule;
			if( rules.length == 1 )table.checkGate = rules[0];
			else table.checkGates = rules;
		}
		
		private function getColorMatrix( color: uint, alpha: Number ):ColorMatrixFilter{		
			var effect: ColorMatrixFilter = new ColorMatrixFilter( [
				0, 0, 0, 0, color >> 8,
				0, 0, 0, 0, color >> 4 & 255,
				0, 0, 0, 0, color & 255,
				0, 0, 0, alpha, 0,
			] );
			return effect;
		}
		
//		private function onTestButtonClick( event: MouseEvent ):void{
//			table.check( testingRuleTxt.text );
//		}
		
		protected override function onDragEnd(event:MouseEvent):void{
			super.onDragEnd( event );
			if( dragEndPosition ) report( EditorEvent.ADD_PAYTABLE_UI, { paytableName: paytableName, point: dragEndPosition, paytableObject: paytableObject } );
		}
	}
}
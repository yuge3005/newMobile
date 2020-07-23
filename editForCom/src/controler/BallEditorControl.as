package controler{
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.geom.Rectangle;
	import flash.ui.Keyboard;
	
	import fl.controls.ComboBox;
	import fl.controls.List;
	import fl.controls.NumericStepper;
	import fl.controls.TextInput;
	import fl.events.ColorPickerEvent;
	
	import settings.EditorEvent;
	import settings.GameConfigObject;
	
	public class BallEditorControl extends EditorControl{
		
		/**背景物体表*/
		private var ballsItems: List;
		
		/**球的详细信息*/
		private var ballInfo: BallInfo;
		
		/**球规则信息*/
		private var ballRule: TextInput;

		/**球尺寸的数字框*/		
		private var btSize:NumericStepper;
		/**球上文字的数字框*/		
		private var btBallTextSize:NumericStepper;

		private var numberSet:NumericStepper;
		
		public function BallEditorControl(){
			addBallUIChooser();
			
			drawBackground( 0xEEFFEE, new Rectangle( -20, 0, 800, 400 ) );
			addColorChooser( 0, 100, 130, "ball text color:", onColorChange );
			
			addTipAt( 560, 240, 130, "PS: ui comes with number, path comes with order", 60 );
			
			ballInfo = addItemAt( new BallInfo, 400, 20 ) as BallInfo;
			ballInfo.addEventListener( EditorEvent.ADD_PATH_POINT, bubbleEvent );
			ballInfo.addEventListener( EditorEvent.CLEAR_PATH, bubbleEvent );			
			
			addTextOffsetButton();
			
			addTipAt( 0, 260, 130, "write a rule to make ball path list: only + - *", 60 );
			
			ballRule = addItemAt( new TextInput, 0, 300, 130 ) as TextInput;
			
			addButtonAt( 0, 340, 130, "follow the rule", onMakeRule );
			
			addTestButton();
		}
		
		protected function onColorChange(event:ColorPickerEvent):void{
			var color: uint = event.color;
			for( var i:int = 0; i < ballsItems.selectedIndices.length; i++ ){
				var index: int = ballsItems.selectedIndices[i];
				var data: Object = GameConfigObject.balls[index];
				data.color = color;
				ballsItems.removeItemAt( index );
				ballsItems.addItemAt( getDataByIndex( index ), index );
			}
		}
		
		private function addBallUIChooser():void{	
			textureList = createComboBox( 0, 20 );
			
			addButtonAt( 0, 60, 130, "create ball pool", onCreateButton );
			
			ballsItems = addItemAt( new List, 180, 20, 200 ) as List;
			ballsItems.height = 340;
			ballsItems.allowMultipleSelection = true;
			ballsItems.addEventListener( KeyboardEvent.KEY_DOWN, onItemKeyDown );
		}
		
		override protected function onTextureItemSellect(event:Event):void{
			var ui: String = ( event.target as ComboBox ).selectedItem.label;
			for( var i:int = 0; i < ballsItems.selectedIndices.length; i++ ){
				var index: int = ballsItems.selectedIndices[i];
				var data: Object = GameConfigObject.balls[index];
				data.ui = ui;
				ballsItems.removeItemAt( index );
				ballsItems.addItemAt( getDataByIndex( index ), index );
			}
		}
		
		protected function onCreateButton(event:MouseEvent):void{
			GameConfigObject.createBalls();
			showBallsInfo();
		}
		
		public function showBallsInfo():void{
			ballsItems.removeAll();
			for( var i:int = 0; i < GameConfigObject.balls.length; i++ ){
				var data: Object = GameConfigObject.balls[i];
				ballsItems.addItem( getDataByIndex( i ) );
			}
			if( GameConfigObject.ballSize ) btSize.value = GameConfigObject.ballSize;
			if( GameConfigObject.ballTextSize ) btBallTextSize.value = GameConfigObject.ballTextSize;
			if( GameConfigObject.ballNumber ) numberSet.value = GameConfigObject.ballNumber;
		}
		
		private function getDataByIndex( index: int ): Object{
			var data: Object = GameConfigObject.balls[index];
			var object: Object = {};
			object.data = data;
			var str: String = "b";
			str += data.index + 1;
			if( data.ui )str += "_" + data.ui;
			if( data.color is Number )str += "_#" + data.color.toString(16);
			if( data.offsetX is Number )str += "_off" + data.offsetX.toString( 10 );
			object.label = str;
			return object;
		}
		
		protected function onItemKeyDown(event:KeyboardEvent):void{
			if( event.keyCode != Keyboard.ENTER )return;
			ballInfo.showBallInfo( ( event.currentTarget as List ).selectedIndex );
		}
		
		private function addTextOffsetButton():void{
			addNumericStepper( 0, 140, 130, "number offset", onSetOffset, 20 ).minimum = -20;
			btSize = addNumericStepper( 0, 180, 130, "ball size", onSetSize, 300 );
			btSize.width = 60
			btBallTextSize = addNumericStepper( 0, 220, 130, "ball text size", onSetBallTextSize, 100 );
		}
		
		private function addTestButton():void	{
			addButtonAt( 400, 240, 130, "test ball path", onTestButton );
			
			numberSet = addNumericStepper( 400, 280, 130, "balls number", onBallNumberChange, 90 );
		}
		
		protected function onBallNumberChange(event:Event):void{
			GameConfigObject.ballNumber = event.target.value;
		}
		
		protected function onSetOffset(event:Event):void{
			var offsetX: int = event.target.value;
			for( var i:int = 0; i < ballsItems.selectedIndices.length; i++ ){
				var index: int = ballsItems.selectedIndices[i];
				var data: Object = GameConfigObject.balls[index];
				data.offsetX = offsetX;
				ballsItems.removeItemAt( index );
				ballsItems.addItemAt( getDataByIndex( index ), index );
			}
		}
		
		protected function onSetSize(event:Event):void{
			GameConfigObject.ballSize = event.target.value;
		}
		
		protected function onSetBallTextSize(event:Event):void{
			GameConfigObject.ballTextSize = event.target.value;
		}
		
		protected function onTestButton(event:Event):void{
			report( EditorEvent.TEST_BALL_PATH );
		}
		
		public function refreshBallPathList(pathList:Array):void{
			ballInfo.refreshBallPathList( pathList );
		}
		
		protected function onMakeRule(event:MouseEvent):void{
			"i=4, index=index-2, x=x-47, y=y";
			var ruleString: String = ballRule.text.replace( / /g, "" );
			var rules: Array = ruleString.split(",");
			var i: int;
			var ruleObj: Object = {};
			for( i = 0; i < rules.length; i++ ){
				var rule: Array = rules[i].split("=");
				ruleObj[ rule[0] ] = rule[1];
			}
			var balls: Array = GameConfigObject.balls;
			for( i = 0; i < ballsItems.selectedIndices.length; i++ ){
				var index: int = ballsItems.selectedIndices[i];
				var ballObject: Object = balls[ index ];
				if( !ballObject.path )ballObject.path = [];
				var itemIndex: int = parseInt( ruleObj["i"] ) - 1;
				if( !ballObject.path[itemIndex] )ballObject.path[itemIndex] = {};
				var toObject: Object = ballObject.path[itemIndex];
				var fromObject: Object = balls[ index + parseInt( ruleObj["index"].replace( "index", "" ) ) ].path[itemIndex];
				toObject.x = eval( ruleObj["x"], "x", fromObject.x );
				toObject.y = eval( ruleObj["y"], "y", fromObject.y );
			}
		}
		
		private function eval( str: String, mainPart: String, mainPartValue: int ) : int{
			var index: int, str1 : String, str2 : String;
			if( str.indexOf( "+" ) > 0 ){
				index = str.indexOf( "+" );
				str1 = str.substr( 0, index );
				str2 = str.substr( index + 1 );
				return eval( str1, mainPart, mainPartValue ) + eval( str2, mainPart, mainPartValue );
			}
			else if( str.indexOf( "-" ) >= 0 ){
				index = str.indexOf( "-" );
				str1 = str.substr( 0, index );
				str2 = str.substr( index + 1 );
				return eval( str1, mainPart, mainPartValue ) - eval( str2, mainPart, mainPartValue );
			}
			else if( str.indexOf( "*" ) > 0 ){
				index = str.indexOf( "*" );
				str1 = str.substr( 0, index );
				str2 = str.substr( index + 1 );
				return eval( str1, mainPart, mainPartValue ) * eval( str2, mainPart, mainPartValue );
			}
			else if( str == "" ){
				return 0;
			}
			else if( isNaN( Number( str ) ) == false ){
				return Number( str );
			}
			else if( str == mainPart ){
				return mainPartValue;
			}
			return 0;
		}
	}
}
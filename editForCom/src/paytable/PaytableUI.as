package paytable {
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	import settings.GameRes;
	
	public class PaytableUI extends Sprite{
		
		private var useBg: Boolean;
		
		private var tx: TextField;
		private var bg: Sprite;
		/**砖块*/
		private var grids: Array;
		/**闪烁的砖块的索引*/		
		private var blinkGridsIndexs: Array;
		
		private var textColor: Number;
		
		private var _winEffects: Array;
		private var currentEffect: int;
		
		private var _blink: Boolean;
		public function set blink(value:Boolean):void{
			_blink = value;
			currentEffect = 0;
			if( value ){
				this.addEventListener( Event.ENTER_FRAME, onFrame );
				if( useBg ){
					for( var i: int = 0; i < blinkGridsIndexs.length; i++ ){
						addChild( grids[blinkGridsIndexs[i]] );
					}
				}
			}
			else{
				if( !useBg )tx.filters = [];
				else{
					removeChildren();
					addChild( bg );
				}
				this.removeEventListener( Event.ENTER_FRAME, onFrame );
			}
		}
		
		public function PaytableUI( useBg: Boolean ){
			this.useBg = useBg;
			this.mouseChildren = false;
			
			this.addEventListener( Event.REMOVED_FROM_STAGE, onRemove );
		}
		
		protected function onRemove(event:Event):void{
			this.removeEventListener( Event.ENTER_FRAME, onFrame );
		}
		
		public function setText( text: String, color: uint = 0, size: int = 28, bold: Boolean = true ):void{
			if( useBg )return;
			textColor = color;
			var tf: TextFormat = new TextFormat;
			tf.color = color;
			tf.size = size;
			tf.bold = true;
			
			tx = new TextField;
			tx.defaultTextFormat = tf;
			tx.text = text;
			this.addChild( tx );
		}
		
		public function setBackground( assetsName: String ):void{
			if( !useBg )return;
			bg = GameRes.buildItemByName( assetsName );
			addChild( bg );
		}
		
		public function set winEffects( value: Array ):void{
			_winEffects = value;
		}
		
		protected function onFrame(event:Event):void{
			currentEffect++;
			if( !useBg ){
				tx.filters = [ _winEffects[(currentEffect>>3)%_winEffects.length] ];
			}
			else{
				for( var i: int = 0; i < blinkGridsIndexs.length; i++ ){
					grids[blinkGridsIndexs[i]].filters = [ _winEffects[(currentEffect>>3)%_winEffects.length] ];
				}
			}
		}
		
		public function setGrids( ruleString: String ):void{
			if( !ruleString )return;
			var ar: Array = ruleString.split( "*" );
			var row: int = ar[0];
			var line: int = ar[1];
			var num: int = row * line;
			var width: Number = bg.width / row;
			var height: Number = bg.height / line;
			grids = [];
			for( var i:int = 0; i < num; i++ ){
				grids[i] = new Shape;
				grids[i].x = i % row * width;
				grids[i].y = Math.floor( i / row ) * height;
				grids[i].graphics.beginFill(0);
				grids[i].graphics.drawRect( 0, 0, width, height );
				grids[i].graphics.endFill();
			}
		}
		
		internal function showResult( result : PaytableCheckResult ):void{
			this.blink = false;
			if( !useBg){
				if( result.fit )this.blink = true;
			}
			else{
				if( result.unfitIndexs.length ){
					blinkGridsIndexs = result.unfitIndexs;
					this.blink = true
				}
			}				
		}
	}
}
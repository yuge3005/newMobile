package paytable.paytableFilter{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.net.FileReference;
	import flash.ui.Keyboard;
	
	import fl.controls.Button;
	
	import settings.EditorItem;
	import settings.FilesLoader;
	import settings.GameConfigObject;

	public class PaytableFilterEditor extends EditorItem{
		
		private var paytables: Vector.<String>;
		private var paytablesChildList: Vector.<Vector.<String>>;
		private var paytablesChildListUIContainer: Vector.<Sprite>;
		
		private var fileName: String;
		
		private var closeBtn: Button;
		private var deleteBtn: Button;
		private var saveBtn: Button;
		
		public function PaytableFilterEditor(){
			graphics.beginFill( 0xFFFFFF );
			graphics.drawRect( 0, 0, editForCom.editorWidth, editForCom.editorHeight );
			graphics.endFill();
			
			getPaytables();
			
			closeBtn = addItemAt( new Button, editForCom.editorWidth - 140, 20, 120, "close" ) as Button;
			closeBtn.addEventListener( MouseEvent.CLICK, onClose );
			deleteBtn = addItemAt( new Button, editForCom.editorWidth - 140, 60, 120, "delete" ) as Button;
			saveBtn = addItemAt( new Button, editForCom.editorWidth - 140, 100, 120, "save" ) as Button;
		}
		
		protected function getPaytables():void{
			var paytableData: Object = GameConfigObject.payTables;
			var i: int = 0;
			paytables = new Vector.<String>;
			paytablesChildList = new Vector.<Vector.<String>>;
			paytablesChildListUIContainer = new Vector.<Sprite>;
			for( var ob: String in paytableData ){
				var sp: PaytableItem = new PaytableItem( ob );
				sp.y = 20 + 40 * i;
				this.addChild( sp );
				sp.addEventListener( "dragEnd", onDragEnd );
				paytables[i] = ob;
				paytablesChildList[i] = new Vector.<String>;
				paytablesChildListUIContainer[i] = new Sprite;
				i++;
			}
		}
		
		private function onDragEnd( event: Event ): void{
			var ptItem: PaytableItem = event.target as PaytableItem;
			var index: int = ptItem.y / 40;
			paytablesChildList[index].push( ptItem.name );
			this.rebuildChildListUIContainer( index );
		}
		
		private function rebuildChildListUIContainer( index: int ): void{
			paytablesChildListUIContainer[index].removeChildren();
			paytablesChildListUIContainer[index].x = 130;
			paytablesChildListUIContainer[index].y = 20 + 40 * index;
			this.addChild( paytablesChildListUIContainer[index] );
			for( var i: int = 0; i < paytablesChildList[index].length; i++ ){
				var ptChild: PaytableChild = new PaytableChild( paytablesChildList[index][i] );
				ptChild.x = 10 + i * 110;
				paytablesChildListUIContainer[index].addChild( ptChild );
				ptChild.addEventListener( "deleteItem", onDelete );
			}
		}
		
		private function onDelete( event: Event ): void{
			var ptChild: PaytableChild = event.target as PaytableChild;
			var index: int = ( ptChild.parent.y + 1 ) / 40;
			var childIndex: int = paytablesChildList[index].indexOf( ptChild.name );
			paytablesChildList[index].splice( childIndex, 1 );
			this.rebuildChildListUIContainer( index );
		}
		
		private function onKey( event: KeyboardEvent ): void{
			if( event.keyCode == Keyboard.S && event.ctrlKey ){
				var filterObj: Object = {};
				for( var i: int = 0; i < paytablesChildList.length; i++ ){
					if( paytablesChildList[i].length > 0 ){
						filterObj[paytables[i]] = paytablesChildList[i];
					}
				}
				var str: String = JSON.stringify( filterObj );
				var file: FileReference = new FileReference;
				file.save( str, fileName.replace( ".conf", "" ) + ".filt" );
			}
			else if( event.keyCode == Keyboard.E && event.ctrlKey ){
				new FilesLoader().selectFile( onFilterFileSellect, "filt" );
			}
		}
		
		protected function onFilterFileSellect(event:Event):void{
			var filterFileName: String = event.target.name;
			new FilesLoader().loadFile( filterFileName, onFilterFileJsonLoaded );
		}
		
		protected function onFilterFileJsonLoaded(event:Event):void{
			var filterObject: Object = JSON.parse( event.target.data );
			for( var ob: String in filterObject ){
				var index: int = paytables.indexOf( ob );
				for( var i: int = 0; i < filterObject[ob].length; i++ ){
					paytablesChildList[index].push( filterObject[ob][i] );
				}
				this.rebuildChildListUIContainer( index );
			}
		}
		
		protected function onClose( event: MouseEvent ): void{
			this.parent.removeChild( this );
		}
	}
}
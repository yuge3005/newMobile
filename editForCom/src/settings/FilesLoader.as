package settings{
	import flash.display.Loader;
	import flash.events.Event;
	import flash.net.FileFilter;
	import flash.net.FileReference;
	import flash.net.URLLoader;
	import flash.net.URLRequest;

	public class FilesLoader{
		
		private var callBack: Function;
		
		public function FilesLoader(){
		}
		
		/**
		 * 选择本地文件
		 * @param callback
		 * @param filter 
		 */		
		public function selectFile( callback: Function, filter: String = "json" ):void{
			var browser: FileReference = new FileReference;
			browser.browse( [new FileFilter( filter, "*." + filter )] );
			browser.addEventListener( Event.SELECT, onSellect );
			this.callBack = callback;
		}
		
		protected function onSellect(event:Event):void{
			callBack( event );
		}
		
		/**
		 * 加载文件
		 * @param path
		 * @param callback 
		 */		
		public function loadFile( path:String, callback: Function):void	{
			var textureJson: URLLoader = new URLLoader;
			textureJson.addEventListener( Event.COMPLETE, onLoad );
			textureJson.load( new URLRequest( path ) );
			this.callBack = callback;
		}
		
		protected function onLoad(event:Event):void{
			callBack( event );
		}
		
		/**
		 * 加载图片
		 * @param path
		 * @param callback 
		 */		
		public function loadPicture( path:String, callback: Function):void{
			var ld: Loader = new Loader;
			ld.contentLoaderInfo.addEventListener( Event.COMPLETE, onLoad );
			ld.load( new URLRequest( path ) );
			this.callBack = callback;
		}
	}
}
package settings{
	import flash.events.Event;
	import flash.net.FileReference;

	public class GameConfigObject{
		
		public static var backgroundColor: uint;
		public static var extraUIName: String;
		
		public static var textureRelativePath: String;
		public static var animationRelativePath: String;
		public static var animationPicturePath: String;
		
		public static var backgroundItems: Array = [];
		
		public static var tempBackgroundItems: Array;
		
		public static var balls: Array;
		public static var ballSize: Number;
		public static var ballTextSize: Number;
		public static var ballNumber: int;
		
		public static var payTables: Object = {};
		
		public static var card: Object = {};
		
		private static var successCallback: Function;
		
		public function GameConfigObject(){
		}
		
		private static function getConfigObject():Object{
			var obj: Object = {};
			obj.backgroundColor = backgroundColor;
			obj.extraUIName = extraUIName;
			obj.textureRelativePath = textureRelativePath;
			obj.animationRelativePath = animationRelativePath;
			obj.animationPicturePath= animationPicturePath;
			obj.backgroundItems = backgroundItems;
			obj.balls = balls;
			obj.ballSize = ballSize;
			obj.ballTextSize = ballTextSize;
			obj.ballNumber = ballNumber;
			obj.payTables = payTables;
			obj.card = card;
			return obj;
		}
		
		public static function clearBackgroundItems():void{
			backgroundItems = [];
		}
		
		public static function addBackgroundItem(item:Object):void{
			backgroundItems.push( item );
		}
		
		public static function save():void{
			var str: String = JSON.stringify( getConfigObject() );
			var file: FileReference = new FileReference;
			file.save( str, "game config file name.conf" );
		}
		
		public static function load( successCallback: Function ):void{
			new FilesLoader().selectFile( onFileSellect, "conf" );
			GameConfigObject.successCallback = successCallback;
		}
		
		protected static function onFileSellect(event:Event):void{
			new FilesLoader().loadFile( event.target.name, onFileLoaded );
		}
		
		protected static function onFileLoaded(event:Event):void	{
			var obj: Object = JSON.parse( event.target.data );
			backgroundColor = obj.backgroundColor;
			textureRelativePath = obj.textureRelativePath;
			if( obj.animationPicturePath && obj.animationRelativePath ){
				animationPicturePath = obj.animationPicturePath;
				animationRelativePath = obj.animationRelativePath;
			}
			if( obj.balls ) balls = obj.balls;
			if( obj.ballSize ) ballSize = obj.ballSize;
			if( obj.ballTextSize )ballTextSize = obj.ballTextSize;
			if( obj.ballNumber ) ballNumber = obj.ballNumber;
			if( obj.payTables ) payTables = obj.payTables;
			if( obj.card )card = obj.card;
			if( obj.extraUIName )extraUIName = obj.extraUIName;
			successCallback();
			
			tempBackgroundItems = obj.backgroundItems;
		}
		
		public static function createBalls():void{
			balls = [];
			for( var i:int = 0; i < 90; i++ ){
				balls.push( { index:i } );
			}
		}
		
		public static function clearBallPath(currentIndex:int):void{
			balls[ currentIndex ].path = [];
		}
		
		public static function addPathPoint(currentIndex:int,point:Object):void{
			balls[ currentIndex ].path.push( point );
		}
		
		public static function editPaytable(name:String, obj:Object):void{
			payTables[name] = obj;
		}
		
		public static function deletePaytable(name:String):void{
			payTables[name] = null;
			delete payTables[name];
		}
	}
}
package settings{
	import flash.events.Event;
	
	public class EditorEvent extends Event{
	
		public var data: *;
		
		/**选颜色*/		
		public static const COLOR_CHANGE: String = "colorChange";
		/**纹理图集配置文件加载完毕json*/
		public static const TEXTURE_FILE_LOADED: String = "textureFileLoaded";
		/**纹理图集图片文件加载完毕png*/		
		public static const TEXTURE_PICTURE_LOADED: String = "texturePictureLoaded";
		/**动画图集配置文件加载完毕*/		
		public static const ANIMATION_FILE_LOADED: String = "animationFileLoaded";
		/**动画图集图片文件加载完毕*/
		public static const ANIMATION_PICTURE_LOADED: String = "animationPictureLoaded";
		/**添加物体*/		
		public static const ADD_ITEM: String = "addItem";
		/**轻移物体*/
		public static const MOVE_ITEM: String = "moveItem";
		/**移除物体*/
		public static const REMOVE_ITEM: String = "removeItem";
		/**物体层级上升*/
		public static const ITEM_LAYER_UP: String = "itemLayerUp";
		/**添加动画*/
		public static const ADD_ANIMATION: String = "addAnimation";
		/**配置文件加载完毕*/		
		public static const CONFIG_LOADED:String = "configLoaded";
		/**清除背景*/		
		public static const CLEAR_BACKGROUND: String = "clearBackground";
		/**锁定背景*/		
		public static const LOCK_BACKROUND: String = "lockBackground";

		/**背景物体移动*/		
		public static const ITEM_MOVE:String = "itemMove";
		/**物体发生变化，移除、添加，层级上升时*/		
		public static const ITEM_CHANGE:String = "itemChange";
		
		/**添加路径点*/
		public static const ADD_PATH_POINT: String = "addPathPoint";
		/**清空当前路径*/		
		public static const CLEAR_PATH: String = "clearPath";
		/**测试球路径*/
		public static const TEST_BALL_PATH: String = "testBallPath";
		
		/**路径改变*/
		public static const PATH_CHANGE: String = "pathChange";
		
		/**添加paytable的UI*/
		public static const ADD_PAYTABLE_UI: String = "addPaytableUI";
		
		/**添加卡片位置*/
		public static const ADD_CARD_POSITION: String = "addCardPosition";
		/**卡片位置发生变化*/
		public static const CARD_POSITION_CHANGE: String = "cardPositionChange";
		/**清除卡片位置*/
		public static const CLEAR_CARD_POSITIONS: String = "clearCardPosition";
		
		public function EditorEvent(type:String, data: * = null ){
			super( type );
			this.data = data;
		}
	}
}
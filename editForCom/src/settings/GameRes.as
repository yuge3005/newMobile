package settings{
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.geom.Matrix;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;

	public class GameRes{

		/**素材配置对象*/
		public static var textureData: Object;
		/**素材图*/
		public static var texturePic: BitmapData;
		
		/**动画帧图像配置对象*/
		public static var movieClipFrameRes: Object;
		/**动画帧数据配置对象*/
		public static var movieClipFrameData: Object;
		/**动画素材图*/
		public static var movieClipPic: BitmapData;
		
		public function GameRes(){
		}
		
		public static function buildItemByName( name: String ): Sprite{
			var sp: Sprite = new Sprite;
			var obj: Object = GameRes.textureData[name];
			var matrix: Matrix = new Matrix( 1, 0, 0, 1, -obj.x, -obj.y );
			sp.graphics.beginBitmapFill( GameRes.texturePic, matrix, false, true );
			sp.graphics.drawRect( 0, 0, obj.w, obj.h );
			sp.name = name;
			return sp;
		}
		
		public static function buildBallWithIndex(index : int, num : int = 0, scaleToGame: Boolean = true ):Sprite{
			var ballObj: Object = GameConfigObject.balls[index];
			var ball: Sprite = buildItemByName( ballObj.ui );
			var ballHeght: int = ball.height;
			var tf: TextFormat = new TextFormat;
			if( ballObj.color )tf.color = ballObj.color;
			tf.align = TextFormatAlign.CENTER;
			tf.size = GameConfigObject.ballTextSize;
			tf.bold = true;
			var tx: TextField = new TextField;
			tx.width = ball.width;
			tx.defaultTextFormat = tf;
			tx.text = "" + ( num ? num : index + 1 );
			tx.y = ball.height - tx.textHeight >> 1;
			if( ballObj.offsetX )tx.x = ballObj.offsetX;
			tx.selectable = false;
			ball.addChild( tx );
			ball.mouseChildren = false;
			if( scaleToGame )ball.scaleX = ball.scaleY = GameConfigObject.ballSize / ballHeght;
			return ball;
		}
	}
}
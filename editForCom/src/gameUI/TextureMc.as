package gameUI{
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.geom.Matrix;
	
	public class TextureMc extends Sprite{
		
		private var obj:Object;
		private var data:Object;
		private var bitmapData: BitmapData;
		
		private var _currentFrame: int;
		private var currentFrameRemain: int;
		
		private var isPlaying: Boolean;
		
		public function TextureMc( obj: Object, data: Object, bitmapData: BitmapData ){
			this.bitmapData = bitmapData;
			this.data = data;
			this.obj = obj;
			
			_currentFrame = -1;
			
			this.addEventListener(Event.ENTER_FRAME, onFrame);
			
			play();
		}
		
		private function play():void{
			isPlaying = true;
		}
		
		private function stop():void{
			isPlaying = false;
		}
		
		protected function onFrame(event:Event):void{
			if( currentFrameRemain ){
				currentFrameRemain --;
				return;
			}
			_currentFrame++;
			if( _currentFrame >= obj["frames"].length )_currentFrame = 0;
			var currentFrameObj: Object = obj["frames"][_currentFrame];
			currentFrameRemain = currentFrameObj.duration;
			var resName: String = currentFrameObj["res"];
			var resObj: Object = data[resName];
			var matrix: Matrix = new Matrix( 1, 0, 0, 1, -resObj.x, -resObj.y );
			this.graphics.clear();
			this.graphics.beginBitmapFill( bitmapData, matrix );
			this.graphics.drawRect( 0, 0, resObj.w, resObj.h );
		}
	}
}
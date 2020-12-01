class GraphicTool {
	public constructor() {
	}

	public static drawRect( target: egret.Shape|egret.Sprite, rect: egret.Rectangle, color: number = 0, clearFirst: boolean = false, alpha: number = 1, roundRect: number = 0, lineThick: number = 0, lineColor: number = 0, lineAlpha: number = 1 ): void{
		if( clearFirst ) target.graphics.clear();
		if( lineThick ) target.graphics.lineStyle( lineThick, lineColor, lineAlpha );
		target.graphics.beginFill( color, alpha );
		if( roundRect ) target.graphics.drawRoundRect( rect.x, rect.y, rect.width, rect.height, roundRect );
		else target.graphics.drawRect( rect.x, rect.y, rect.width, rect.height );
		target.graphics.endFill();
	}

	public static drawRectangles( target: egret.Shape|egret.Sprite, rectangles: Array<egret.Rectangle>, color: number = 0, clearFirst: boolean = false, alpha: number = 1 ): void{
		if( clearFirst ) target.graphics.clear();
		target.graphics.beginFill( color, alpha );
		for( let i: number = 0; i < rectangles.length; i++ ){
			let rect: egret.Rectangle = rectangles[i];
			target.graphics.drawRect( rect.x, rect.y, rect.width, rect.height );
		}
		target.graphics.endFill();
	}

	public static drawCircle( target: egret.Shape, center: egret.Point, r: number, color: number, clearFirst: boolean = false, alpha: number = 1, lineThick: number = 0, lineColor: number = 0, lineAlpha: number = 1 ){
		if( clearFirst ) target.graphics.clear();
		if( lineThick ) target.graphics.lineStyle( lineThick, lineColor, lineAlpha );
		target.graphics.beginFill( color, alpha );
		target.graphics.drawCircle( center.x, center.y, r );
		target.graphics.endFill();
	}
}
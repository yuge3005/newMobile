class MDS{

	public static mcFactory: egret.MovieClipDataFactory;

	public static addGameText( target: egret.DisplayObjectContainer, x: number, y: number, size: number, color: number, textItem: string,stroke: boolean = false, width: number = 200, additionString: string = "", scaleX: number = 0.8 ): TextLabel{
        let tx: TextLabel = Com.addLabelAt( target, x, y + BrowserInfo.textUp, width, size, size, stroke, true );
        tx.textColor = color;
        tx.textAlign = "left";
		tx.setText( MuLang.getText( textItem ) + additionString );
		tx.scaleX = scaleX;
        return tx;
    }

	public static addGameTextCenterShadow( target: egret.DisplayObjectContainer, x: number, y: number, size: number, color: number, textItem: string,stroke: boolean = false, width: number = 200, center: boolean = true, dropShadow: boolean = true ): TextLabel{
        let tx: TextLabel = this.addGameText( target, x, y, size, color, textItem, stroke, width );
        if( center ) tx.textAlign = "center";
        if( dropShadow ) tx.filters = [ new egret.DropShadowFilter(3, 45, 0x000000, 1, 1, 1, 1, egret.BitmapFilterQuality.HIGH) ];
        return tx;
    }

	public constructor() {
	}

	public static removeSelf( item: egret.DisplayObject ){
		if( item.parent ) item.parent.removeChild( item );
	}
}
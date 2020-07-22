class MDS{

	public static mcFactory: egret.MovieClipDataFactory;

	public static addGameText( target: egret.DisplayObjectContainer, x: number, y: number, size: number, color: number, textItem: string,stroke: boolean = false, width: number = 200, additionString: string = "", scaleX: number = 0.8 ): egret.TextField{
        let tx: egret.TextField = Com.addTextAt( target, x, y + BrowserInfo.textUp, width, size, size, stroke, true );
        tx.textColor = color;
        tx.textAlign = "left";
		tx.text = MuLang.getText( textItem ) + additionString;
		tx.scaleX = scaleX;
        return tx;
    }

	public constructor() {
	}

	public static removeSelf( item: egret.DisplayObject ){
		if( item.parent ) item.parent.removeChild( item );
	}
}
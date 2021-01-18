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

    public static addBitmapTextAt( target: egret.DisplayObjectContainer, fontName: string, x: number, y: number, textAlign: string = "left", size: number, color: number = 0, width: number, height: number ): BmpText{
		var bmpText: BmpText = new BmpText();
		bmpText.font = RES.getRes(fontName);
		bmpText.textAlign = textAlign;
		bmpText.verticalAlign = "middle";
		bmpText.text = " ";
		let scale: number = size / bmpText.textHeight;
		bmpText.width = 1 / scale * width;
		bmpText.height = 1 / scale * height;
		bmpText.scaleX = bmpText.scaleY = scale;
		bmpText.filters = [MatrixTool.colorMatrixPure(color)];
		Com.addObjectAt( target, bmpText, x, y );
		return bmpText;
	}

	public constructor() {
	}

	public static removeSelf( item: egret.DisplayObject ){
		if( item.parent ) item.parent.removeChild( item );
	}

	public static onUserHeadLoaded( userInfo: egret.Bitmap, size: number, event: egret.Event ){
		let loader:egret.ImageLoader = event.currentTarget;
        let bmd: egret.BitmapData = loader.data;
		let tx: egret.Texture = new egret.Texture;
		tx.bitmapData = bmd;
		userInfo.scaleX = userInfo.scaleY = 1;
        userInfo.texture = tx;
		userInfo.width = userInfo.height = size;
	}
}
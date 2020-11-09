/**
 * ChildObjectManager
 */
class Com {
	public constructor() {
	}

	/**
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    public static createBitmapByName(name: string): egret.Bitmap{
		let result = new egret.Bitmap();
		let texture: egret.Texture = RES.getRes(name);
		if( !texture )console.error( `picture ${name} does not exist`);
		result.texture = texture;
		return result;
    }

    public static addObjectAt( target: egret.DisplayObjectContainer, obj: egret.DisplayObject, x: number, y: number ): void{
        target.addChild( obj );
		obj.x = x;
		obj.y = y;
    }

    public static addBitmapAt( target: egret.DisplayObjectContainer, assetName: string, x: number, y: number ): egret.Bitmap{
		let bit: egret.Bitmap = this.createBitmapByName( assetName );
		this.addObjectAt( target, bit, x, y );
		return bit;
	}

	public static addBitmapAtMiddle( target: egret.DisplayObjectContainer, assetName: string, x: number, y: number ): egret.Bitmap{
		let bit: egret.Bitmap = this.createBitmapByName( assetName );
		this.addObjectAt( target, bit, x, y );
		bit.anchorOffsetX = bit.width >> 1;
		bit.anchorOffsetY = bit.height >> 1;
		return bit;
	}

	public static addRotateBitmapAt( target: egret.DisplayObjectContainer, assetName: string, x: number, y: number, duration: number ): egret.Bitmap{
		let bit: egret.Bitmap = this.addBitmapAtMiddle( target, assetName, x, y );
		egret.Tween.get(bit, {loop: true})
		.to({rotation: 360}, duration)
		.wait(0);
		return bit;
	}

    public static addMovieClipAt( target: egret.DisplayObjectContainer, mcf: egret.MovieClipDataFactory, assetName:string, x:number=0, y:number=0 ): egret.MovieClip{
		let mc: egret.MovieClip = new egret.MovieClip( mcf.generateMovieClipData(assetName) );
		this.addObjectAt( target, mc, x, y );
		mc.play(-1);
		return mc;
	}

    public static addTextAt( target: egret.DisplayObjectContainer, x: number, y: number, width: number, height: number, size: number, stroke: boolean = false, bold: boolean = false ): egret.TextField{
		let tx: egret.TextField = new egret.TextField;
		tx.width = width;
		tx.height = height;
		tx.size = size;
		tx.textAlign = "center";

		if( bold )tx.fontFamily = "Arial Black";		
		else tx.fontFamily = "Arial";

		if(stroke){
			tx.stroke = 1;
			tx.strokeColor = 0x000000;
		}
		this.addObjectAt( target, tx, x, y );
		return tx;
	}

	public static addLabelAt( target: egret.DisplayObjectContainer, x: number, y: number, width: number, height: number, size: number, stroke: boolean = false, bold: boolean = false ): TextLabel{
		let tx: TextLabel = new TextLabel;
		tx.maxWidth = tx.width = width;
		tx.height = height;
		tx.maxSize = tx.size = size;
		tx.textAlign = "center";

		if( bold )tx.fontFamily = "Arial Black";
		else tx.fontFamily = "Arial";

		if(stroke){
			tx.stroke = 1;
			tx.strokeColor = 0x000000;
		}
		this.addObjectAt( target, tx, x, y );
		return tx;
	}

	public static addBitmapTextAt( target: egret.DisplayObjectContainer, fontName: string, x: number, y: number, textAlign: string = "left", size: number = 0, color: number = 0 ): egret.BitmapText{
		var bmpText: egret.BitmapText = new egret.BitmapText();
		bmpText.font = RES.getRes(fontName);
		bmpText.textAlign = textAlign;
		if( size ){
			bmpText.text = " ";
			bmpText.scaleX = bmpText.scaleY = size / bmpText.textHeight;
		}
		if (color>0) {
			bmpText.filters = [MatrixTool.colorMatrixPure(color)];
		}
		this.addObjectAt( target, bmpText, x, y );
		return bmpText;
	}

	public static addDownButtonAt( target: egret.DisplayObjectContainer, assetNormal: string, assetTouched: string, x: number, y: number, onClickCallBack: Function, enableButton: boolean ): TouchDownButton{
		let bit: TouchDownButton = new TouchDownButton( assetNormal, assetTouched );
		this.addObjectAt( target, bit, x, y );
		bit.enabled = enableButton;
		bit.addEventListener( egret.TouchEvent.TOUCH_TAP, onClickCallBack, target );
		return bit;
	}
}
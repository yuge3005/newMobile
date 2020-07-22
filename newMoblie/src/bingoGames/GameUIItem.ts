class GameUIItem extends egret.Sprite{

    public static languageText: Object;

    protected extraUIName: string;
	protected extraUIObject: egret.DisplayObject;

	public constructor() {
		super();
	}

    public addGameText( x: number, y: number, size: number, color: number, textItem: string,stroke: boolean = false, width: number = 200, additionString: string = "", scaleX: number = 0.8 ): egret.TextField{
        let tx: egret.TextField = Com.addTextAt( this, x, y + BrowserInfo.textUp, width, size, size, stroke, true );
        tx.textColor = color;
        tx.textAlign = "left";
        tx.text = GameUIItem.languageText[textItem][GlobelSettings.language] + additionString;
		tx.scaleX = scaleX;
        return tx;
    }

    public addGameTextCenterShadow( x: number, y: number, size: number, color: number, textItem: string,stroke: boolean = false, width: number = 200, center: boolean = true, dropShadow: boolean = true ): egret.TextField{
        let tx: egret.TextField = this.addGameText( x, y, size, color, textItem, stroke, width );
        if( center ) tx.textAlign = "center";
        if( dropShadow ) tx.filters = [ new egret.DropShadowFilter(3, 45, 0x000000, 1, 1, 1, 1, egret.BitmapFilterQuality.HIGH) ];
        return tx;
    }

/************************************************************************************************************************************************************/

    protected gratisUIIsOverExtraUI: boolean;

    protected gratisUI: egret.DisplayObject;
    protected gratisNumber: number;
	
    protected showFreeExtraPosition(): void{
        if( !this.gratisUI )this.gratisUI = this.getGratisUI();
        if( this.gratisNumber <= 0 ) return;
        let ballPositionObject: egret.Point = BallManager.getBallLastPosition( this.gratisNumber - 1 );
        this.gratisUI.x = ballPositionObject.x;
        this.gratisUI.y = ballPositionObject.y;
        this.addChildAt( this.gratisUI, this.getChildIndex( this.extraUIObject ) + ( this.gratisUIIsOverExtraUI ? 1 : 0 ) );
	}

	protected getGratisUI(): egret.DisplayObject{
		//sub class override
		return null;
	}
}
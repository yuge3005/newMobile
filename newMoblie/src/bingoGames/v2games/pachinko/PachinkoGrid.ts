
class PachinkoGrid extends CardGrid {
    private shape: egret.Shape;

    constructor() {
        super();

        // bg
        this.addChildAt(new egret.Bitmap(RES.getRes("pachinko_json.card_box")), 0);

        // shape
        this.shape = new egret.Shape();
        this.shape.width = CardGrid.gridSize.x;
        this.shape.height = CardGrid.gridSize.y;
        this.redrawBg(0xFFFFFF, 0);
        this.addChildAt(this.shape, 1);
    }

    protected _blink: boolean;
	public get blink(): boolean{
		return this._blink;
	}
    public set blink( value: boolean ){
		if( this._blink == value )return;
		this._blink = value;

		if( !value ){
			this.redrawBg( CardGrid.defaultBgColor, 0 );
			
			if( this.smallWinTimesText ){
				if( this.contains( this.smallWinTimesText ) )this.removeChild( this.smallWinTimesText );
				this.smallWinTimesText = null;
			}
			if( this.smallWinIcon ){
				if( this.contains( this.smallWinIcon ) )this.removeChild( this.smallWinIcon );
				this.smallWinIcon = null;
			}
		}
	}

    protected redrawBg(color: number, alpha: number = 1): void {
        if (this.shape) GraphicTool.drawRect( this.shape, new egret.Rectangle( 0, 0, CardGrid.gridSize.x, CardGrid.gridSize.y ), color, true, alpha );
    }

    public showEffect( isShow: boolean ){
		if( this.blink )this.blink = false;
		this._isChecked = isShow;
		if( isShow ){
			if( CardGrid.colorNumberOnEffect )this.numTxt.textColor = CardGrid.numberColorOnEffect;
			if( CardGrid.colorNumberBackgroundOnEffect )this.redrawBg( CardGrid.numberBackgroundColorOnEffect );
		}
		else{
			if( CardGrid.colorNumberOnEffect )this.numTxt.textColor = CardGrid.numberColor;
			if( CardGrid.colorNumberBackgroundOnEffect )this.redrawBg( CardGrid.defaultBgColor, 0 );
		}
    }
    
    public showBlink( isShow: boolean ): void{
		if( isShow )this.redrawBg( CardGrid.blinkColors1, 0.65 );
		else this.redrawBg( CardGrid.blinkColors2, 0.65 );
	}
}
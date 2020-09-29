class CardGrid extends egret.Sprite{

	public static numberColor: number;
	public static numberColorOnEffect: number;
	public static numberBackgroundColorOnEffect: number;
	public static colorNumberOnEffect: boolean;
	public static colorNumberBackgroundOnEffect: boolean;

	public static gridSize: egret.Point;
	public static gridSpace: egret.Point;

	public static defaultBgColor: number;
	public static defaultNumberSize: number;

	public static blinkColors1: number;
	public static blinkColors2: number;

	public static winTimesOffset: egret.Point = new egret.Point;

	protected numTxt: BmpText;

	private zeroUI: egret.Bitmap;

	private num: number;
	public set gridNumber( value: number ){
		this.num = value;
		this.numTxt.text = "" + value;
		if( value == 0 && GameCard.zeroUI ){
			if( !this.zeroUI )this.zeroUI = Com.addBitmapAt( this, BingoMachine.getAssetStr( GameCard.zeroUI ), 0, 0 );
		}
	}
	public get gridNumber(): number{
		return this.num;
	}

	protected _isChecked: boolean;
	public get isChecked(): boolean{
		return this._isChecked;
	}

	protected _blink: boolean;
	public get blink(): boolean{
		return this._blink;
	}
	public set blink( value: boolean ){
		if( this._blink == value )return;
		this._blink = value;

		if( !value ){
			this.redrawBg( CardGrid.defaultBgColor );
			
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

	public constructor() {
		super();

		this.redrawBg( CardGrid.defaultBgColor );

		this.numTxt = MDS.addBitmapTextAt( this, "Arial Black_fnt", 0, - CardGrid.defaultNumberSize * 0.125, "center", CardGrid.defaultNumberSize, CardGrid.numberColor, CardGrid.gridSize.x, CardGrid.gridSize.y );
	}

	protected redrawBg( color: number ){
		GraphicTool.drawRect( this, new egret.Rectangle( 0, 0, CardGrid.gridSize.x, CardGrid.gridSize.y ), color, true );
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
			if( CardGrid.colorNumberBackgroundOnEffect )this.redrawBg( CardGrid.defaultBgColor );
		}
	}

	public showRedEffect(){
		this.numTxt.textColor = CardGrid.numberColor;
		this.redrawBg( 0xFF0000 );
	}

	public showBlink( isShow: boolean ): void{
		if( isShow )this.redrawBg( CardGrid.blinkColors1 );
		else this.redrawBg( CardGrid.blinkColors2 );
	}

	protected smallWinTimesText: egret.TextField;
	protected smallWinIcon: egret.DisplayObjectContainer;

	public setSmallTime( winTimes: number ): void{
		if( !winTimes ){
			this.blink = false;
			return;
		}
		this.smallWinTimesText = Com.addTextAt( this, 0, CardGrid.gridSize.y - 10 + CardGrid.winTimesOffset.x, CardGrid.gridSize.x + CardGrid.winTimesOffset.y, 10, 10 );
		this.smallWinTimesText.textAlign = "right";
		this.smallWinTimesText.text = "x" + winTimes;
		this.smallWinTimesText.textColor = CardGrid.numberColor;
	}

	public setSmallIcon( winIcon: egret.DisplayObjectContainer ): void{
		this.smallWinIcon = winIcon;
		winIcon.x = 1;
		winIcon.y = 1;
		this.addChild( winIcon );
	}
}
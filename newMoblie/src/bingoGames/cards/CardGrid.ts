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
	}

	public constructor() {
		super();

		this.numTxt = MDS.addBitmapTextAt( this, "Arial Black_fnt", 0, - CardGrid.defaultNumberSize * 0.125, "center", CardGrid.defaultNumberSize, CardGrid.numberColor, CardGrid.gridSize.x, CardGrid.gridSize.y );
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
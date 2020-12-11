class MultiPlayerGrid extends egret.Sprite{
	
	public static defaultBgPicName: string;
	protected defaultBgPic: egret.Bitmap;

	public static onEffBgPicName: string;
	protected onEffBgPic: egret.Bitmap;

	public static blink1PicName: string;
	private blink1Pic: egret.Bitmap;

	public static blink2PicName: string;
	private blink2Pic: egret.Bitmap;

	public static linePicName: string;
	protected linePic: egret.Bitmap;

	protected _currentBgPic: egret.Bitmap;
	public set currentBgPic( value ){
		if( this._currentBgPic && this.contains( this._currentBgPic ) )this.removeChild( this._currentBgPic );
		this._currentBgPic = value;
		this.addChildAt( this._currentBgPic, 0 );
	}
	public get currentBgPic(){
		return this._currentBgPic;
	}

	protected _blink: boolean;
	public get blink(): boolean{
		return this._blink;
	}
	public set blink( value: boolean ){
		if( this._blink == value )return;
		this._blink = value;
		if( !value )this.currentBgPic = this.defaultBgPic;
	}

	public static numberColor: number;
	public static numberColorOnEffect: number;
	public static colorNumberOnEffect: boolean;

	public static gridSize: egret.Point;
	public static gridSpace: egret.Point;

	public static defaultNumberSize: number;

	protected numTxt: egret.TextField;

	protected zeroUI: egret.Bitmap;
	public static zeroUIName: string;

	protected num: number;
	public set gridNumber( value: number ){
		this.num = value;
		this.numTxt.text = "" + value;
		if( value == 0 && MultiPlayerGrid.zeroUIName ){
			if( !this.zeroUI )this.zeroUI = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( MultiPlayerGrid.zeroUIName ), 0, 0 );
		}
	}
	public get gridNumber(): number{
		return this.num;
	}

	protected _isChecked: boolean;
	public get isChecked(): boolean{
		if( this.gridNumber == 0 ) return true;
		return this._isChecked;
	}

	public constructor() {
		super();

		this.init();
	}

	protected init(): void {
		this.defaultBgPic = Com.createBitmapByName( MultiPlayerMachine.getAssetStr( MultiPlayerGrid.defaultBgPicName ) );
		this.addChild( this.defaultBgPic );

		this.numTxt = Com.addTextAt( this, 0, MultiPlayerGrid.gridSize.y - MultiPlayerGrid.defaultNumberSize >> 1, MultiPlayerGrid.gridSize.x, MultiPlayerGrid.defaultNumberSize, MultiPlayerGrid.defaultNumberSize, false, true );
		this.numTxt.textAlign = "center";
		this.numTxt.verticalAlign = "middle";
		this.numTxt.textColor = MultiPlayerGrid.numberColor;

		this.onEffBgPic = Com.createBitmapByName( MultiPlayerMachine.getAssetStr( MultiPlayerGrid.onEffBgPicName ) );
		this.blink1Pic = Com.createBitmapByName( MultiPlayerMachine.getAssetStr( MultiPlayerGrid.blink1PicName ) );
		this.blink2Pic = Com.createBitmapByName( MultiPlayerMachine.getAssetStr( MultiPlayerGrid.blink2PicName ) );
		this.linePic = Com.createBitmapByName( MultiPlayerMachine.getAssetStr( MultiPlayerGrid.linePicName ) );
	}

	public showEffect( isShow: boolean ){
		if( this.blink )this.blink = false;
		this._isChecked = isShow;
		if( isShow ){
			if( MultiPlayerGrid.colorNumberOnEffect )this.numTxt.textColor = MultiPlayerGrid.numberColorOnEffect;
			this.currentBgPic = this.onEffBgPic;
		}
		else{
			this.numTxt.textColor = MultiPlayerGrid.numberColor;
			this.currentBgPic = this.defaultBgPic;
		}
	}

	public showRedEffect(){
		this.numTxt.textColor = MultiPlayerGrid.numberColor;
		this.currentBgPic = this.linePic;
	}

	public showBlink( isShow: boolean ): void{
		if( isShow )this.currentBgPic = this.blink1Pic;
		else this.currentBgPic = this.blink2Pic;
		this.numTxt.textColor = 0xBB4249;
	}
}
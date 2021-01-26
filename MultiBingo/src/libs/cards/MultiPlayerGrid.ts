class MultiPlayerGrid extends egret.Sprite{
	
	protected defaultBgPic: egret.Bitmap;
	protected onEffBgPic: egret.Bitmap;
	private blink1Pic: egret.Bitmap;
	private blink2Pic: egret.Bitmap;
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

	private blinkPic: egret.Bitmap;

	public defaultPosition: egret.Point;

	protected _blink: boolean;
	public get blink(): boolean{
		return this._blink;
	}
	public set blink( value: boolean ){
		if( this._blink == value )return;
		this._blink = value;
		this.blinkPic.visible = value;
	}

	protected numTxt: egret.TextField;

	protected zeroUI: egret.Bitmap;

	protected num: number;
	public set gridNumber( value: number ){
		this.num = value;
		this.numTxt.text = "" + value;
		if( value == 0 && CardGridUISettings.zeroUIName ){
			if( !this.zeroUI )this.zeroUI = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( CardGridUISettings.zeroUIName ), 0, 0 );
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
		this.defaultBgPic = Com.addBitmapAt( this,  MultiPlayerMachine.getAssetStr( CardGridUISettings.defaultBgPicName ), 0, 0 );

		this.blinkPic = Com.addBitmapAt( this,  MultiPlayerMachine.getAssetStr( CardGridUISettings.blink1PicName ), 0, 0 );
		this.blinkPic.visible = false;

		this.numTxt = Com.addTextAt( this, 0, ( CardGridColorAndSizeSettings.gridSize.y - CardGridColorAndSizeSettings.defaultNumberSize >> 1 ) + CardGridColorAndSizeSettings.defaultNumberSize * 0.075, CardGridColorAndSizeSettings.gridSize.x, CardGridColorAndSizeSettings.defaultNumberSize, CardGridColorAndSizeSettings.defaultNumberSize, false, true );
		this.numTxt.textAlign = "center";
		this.numTxt.verticalAlign = "middle";
		this.numTxt.textColor = CardGridColorAndSizeSettings.numberColor;

		this.onEffBgPic = Com.createBitmapByName( MultiPlayerMachine.getAssetStr( CardGridUISettings.onEffBgPicName ) );
		this.blink1Pic = Com.createBitmapByName( MultiPlayerMachine.getAssetStr( CardGridUISettings.blink1PicName ) );
		this.blink2Pic = Com.createBitmapByName( MultiPlayerMachine.getAssetStr( CardGridUISettings.blink2PicName ) );
		this.linePic = Com.createBitmapByName( MultiPlayerMachine.getAssetStr( CardGridUISettings.linePicName ) );
	}

	public showEffect( isShow: boolean ){
		this._isChecked = isShow;
		if( isShow ){
			if( CardGridColorAndSizeSettings.colorNumberOnEffect )this.numTxt.textColor = CardGridColorAndSizeSettings.numberColorOnEffect;
			this.currentBgPic = this.onEffBgPic;
		}
		else{
			this.numTxt.textColor = CardGridColorAndSizeSettings.numberColor;
			this.currentBgPic = this.defaultBgPic;
		}
	}

	public showRedEffect(){
		this.numTxt.textColor = CardGridColorAndSizeSettings.numberColor;
		this.currentBgPic = this.linePic;
	}
}
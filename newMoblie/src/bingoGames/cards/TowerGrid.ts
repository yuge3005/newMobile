class TowerGrid extends CardGrid{

	public static defaultBgPicName: string;
	protected defaultBgPic: egret.Bitmap;

	public static onEffBgPicName: string;
	private onEffBgPic: egret.Bitmap;

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

	public get blink(): boolean{
		return this._blink;
	}
	public set blink( value: boolean ){
		if( this._blink == value )return;
		this._blink = value;
		if( !value )this.currentBgPic = this.defaultBgPic;
	}

	public constructor() {
		super();

		this.graphics.clear();

		this.defaultBgPic = Com.createBitmapByName( BingoMachine.getAssetStr( TowerGrid.defaultBgPicName ) );
		this.addChildAt( this.defaultBgPic, 0 );

		this.onEffBgPic = Com.createBitmapByName( BingoMachine.getAssetStr( TowerGrid.onEffBgPicName ) );
		this.blink1Pic = Com.createBitmapByName( BingoMachine.getAssetStr( TowerGrid.blink1PicName ) );
		this.blink2Pic = Com.createBitmapByName( BingoMachine.getAssetStr( TowerGrid.blink2PicName ) );
		this.linePic = Com.createBitmapByName( BingoMachine.getAssetStr( TowerGrid.linePicName ) );
	}

	public showEffect( isShow: boolean ){
		if( this.blink )this.blink = false;
		this._isChecked = isShow;
		if( isShow ){
			if( CardGrid.colorNumberOnEffect )this.numTxt.textColor = CardGrid.numberColorOnEffect;
			this.currentBgPic = this.onEffBgPic;
		}
		else{
			if( this.blink )this.blink = false;
			if( CardGrid.colorNumberOnEffect )this.numTxt.textColor = CardGrid.numberColor;
			this.currentBgPic = this.defaultBgPic;
		}
	}

	public showRedEffect(){
		this.numTxt.textColor = CardGrid.numberColor;
		this.currentBgPic = this.linePic;
	}

	public showBlink( isShow: boolean ): void{
		if( isShow )this.currentBgPic = this.blink1Pic;
		else this.currentBgPic = this.blink2Pic;
	}
}
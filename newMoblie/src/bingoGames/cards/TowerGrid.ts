class TowerGrid extends CardGrid{

	protected defaultBgPic: egret.Bitmap;
	private onEffBgPic: egret.Bitmap;
	private blink1Pic: egret.Bitmap;
	private blink2Pic: egret.Bitmap;
	protected linePic: egret.Bitmap;

	private gridLayer: egret.DisplayObjectContainer;

	protected _currentBgPic: egret.Bitmap;
	public set currentBgPic( value ){
		this._currentBgPic = value;
		this.flushGrid();
	}

	public get blink(): boolean{
		return this._blink;
	}
	public set blink( value: boolean ){
		if( this._blink == value )return;
		this._blink = value;
		if( !value )this.currentBgPic = this.defaultBgPic;
		else this.numTxt.textColor = CardGrid.numberColorOnEffect;
	}

	private gridView: egret.Bitmap;

	private zeroUI: egret.Bitmap;

	private num: number;
	public set gridNumber( value: number ){
		this.num = value;
		this.numTxt.text = "" + value;
		if( value == 0 && GameCard.zeroUI ){
			if( !this.zeroUI )this.zeroUI = Com.addBitmapAt( this, BingoMachine.getAssetStr( GameCard.zeroUI ), 0, 0 );
		}
		this.flushGrid();
	}
	public get gridNumber(): number{
		return this.num;
	}

	public constructor() {
		super();

		this._currentBgPic = this.defaultBgPic = Com.createBitmapByName( BingoMachine.getAssetStr( CardSettings.defaultBgPicName ) );
		this.onEffBgPic = Com.createBitmapByName( BingoMachine.getAssetStr( CardSettings.onEffBgPicName ) );
		this.blink1Pic = Com.createBitmapByName( BingoMachine.getAssetStr( CardSettings.blink1PicName ) );
		this.blink2Pic = Com.createBitmapByName( BingoMachine.getAssetStr( CardSettings.blink2PicName ) );
		this.linePic = Com.createBitmapByName( BingoMachine.getAssetStr( CardSettings.linePicName ) );

		this.gridView = new egret.Bitmap;
		this.addChild( this.gridView );

		this.gridLayer = new egret.DisplayObjectContainer;
	}

	protected flushGrid(){
		this.gridLayer.removeChildren();
		this.gridLayer.addChild( this._currentBgPic );
		this.gridLayer.addChild( this.numTxt );

		let ren: egret.RenderTexture = new egret.RenderTexture;
		ren.drawToTexture( this.gridLayer, new egret.Rectangle( 0, 0, this.gridLayer.width, this.gridLayer.height ) );
		this.gridView.texture = ren;
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
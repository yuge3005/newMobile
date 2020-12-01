class MaraGrid extends Multi75Grid{

	public static AWARDTYPE_RED_BAIT = "redBait";
	public static AWARDTYPE_GREEN_BAIT = "greenBait";
	public static AWARDTYPE_ORANGE_BAIT = "orangeBait";
	public static AWARDTYPE_CAMARA = "camera";
	public static AWARDTYPE_PEARL_MAIN = "pearl";
	public static AWARDTYPE_PEARL_PER = "pearl_per";

	public get blink(): boolean{
		return this._blink;
	}
	public set blink( value: boolean ){
		if( this._blink == value )return;
		this._blink = value;
		if( !value ){
			this.currentBgPic = this.defaultBgPic;
			this.numTxt.textColor = MultiPlayerGrid.numberColor;
		}
	}

	public constructor() {
		super();

		this.blinkTextSizeMin = 15;
		this.blinkTextSizeMax = 18;
	}

	protected getBitmapByAwardType( awardType: string ): egret.Bitmap{
		let additionPic: egret.Bitmap;
		switch( awardType ){
			case MaraGrid.AWARDTYPE_RED_BAIT:
				additionPic = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "cicon_" + "redBait" ), 0, 0 );
				break;
			case MaraGrid.AWARDTYPE_GREEN_BAIT:
				additionPic = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "cicon_" + "greenBait" ), 0, 0 );
				break;
			case MaraGrid.AWARDTYPE_ORANGE_BAIT:
				additionPic = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "cicon_" + "orangeBait" ), 0, 0 );
				break;
			case MaraGrid.AWARDTYPE_CAMARA:
				additionPic = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "cicon_" + "camera" ), 0, 0 );
				break;
			case MaraGrid.AWARDTYPE_PEARL_MAIN:
				additionPic = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "cicon_" + "pearl_big" ), 0, 0 );
				break;
			case MaraGrid.AWARDTYPE_PEARL_PER:
				additionPic = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "cicon_" + "pearl_small" ), 0, 0 );
				break;
		}
		return additionPic;
	}

	public showEffect( isShow: boolean ){
		if( this.isChecked && isShow ) return;
		if( this.blink )this.blink = false;
		this._isChecked = isShow;
		if( !isShow ){
			this.currentBgPic = this.defaultBgPic;
		}
		if( this.gridNumber )this.touchEnabled = true;
	}

	public showYellowBg(){
		this.currentBgPic = this.onEffBgPic;
	}

	public clearYellow(){
		this.currentBgPic = this.defaultBgPic;
	}
}
class BingoBeneGrid extends ExtraBlinkGrid{

	// miss one effect
	private missOneBg: egret.Bitmap;

	private waveMc: egret.MovieClip;

	public static MISS_LINE: string = "blue_square";
	public static MISS_COLUMNS_3: string = "green_square";
	public static MISS_DOUBLE_LINE: string = "purple_square";
	public static MISS_COLUMNS_4: string = "pink_square";
	public static MISS_COLUMNS_2_2: string = "orange_square";
	public static MISS_BINGO: string = "yellow_square";

	public set blinkType( value: string ){
		this.missOneBg.texture = RES.getRes( this.assetStr( value ) );
		let winTimesStr: string;
		switch(value){
			case BingoBeneGrid.MISS_LINE: winTimesStr = "4";
				break;
			case BingoBeneGrid.MISS_COLUMNS_3: winTimesStr = "30";
				break;
			case BingoBeneGrid.MISS_DOUBLE_LINE: winTimesStr = "80";
				break;
			case BingoBeneGrid.MISS_COLUMNS_4: winTimesStr = "120";
				break;
			case BingoBeneGrid.MISS_COLUMNS_2_2: winTimesStr = "250";
				break;
			case BingoBeneGrid.MISS_BINGO: winTimesStr = "500";
				break;
		}
		this.smallWinTimesText.text = "x" + winTimesStr;
	}

	public get blink(): boolean{
		return this._blink;
	}
	public set blink( value: boolean ){
		if( this._blink == value )return;
		this._blink = value;

		if( !value ){
			this.extraBinkSp.visible = false;
		}
		else{
			this.blinkType = BingoBeneGrid.MISS_LINE;
			this.showBlink( true );
		}
	}

	public constructor() {
		super();

		this.waveMc = Com.addMovieClipAt( this, MDS.mcFactory, "bingo_bene_wave", 0, 0 );
		this.waveMc.visible = false;
	}

	protected buildSmallWinText(){
		this.extraBlinkNumTxt = Com.addLabelAt( this.extraBinkSp, 0, 3, CardGrid.gridSize.x, 45, 45, false, true );
		this.extraBlinkNumTxt.textColor = 0;
		this.smallWinTimesText = Com.addLabelAt( this.extraBinkSp, 0, 50, CardGrid.gridSize.x, 30, 30 );
		this.smallWinTimesText.textColor = 0xFFFFFF;
	}

	protected getBlinkBg(): egret.Bitmap | egret.MovieClip{
		this.missOneBg = Com.createBitmapByName( this.assetStr( "blue_square" ) );
		return this.missOneBg;
	}

	protected buildExtraBlinkSp(){
		super.buildExtraBlinkSp();
		this.missOneBg.x -= 8;
		this.missOneBg.y -= 13;
	}

	private assetStr( str: string ): string{
		return "mentonGrid_json." + str;
	}

	public showEffect( isShow: boolean ){
		if( this.blink )this.blink = false;
		if (isShow) {
			this.numTxt.textColor = CardGrid.numberColorOnEffect;
			this.currentBgPic = this.onEffBgPic;
			if( !this._isChecked ){
				this._isChecked = true;
				
				this.waveMc.visible = true;
				this.waveMc.gotoAndPlay(1,1);
				this.addChildAt( this.numTxt, this.getChildIndex( this.waveMc ) + 1 );

				setTimeout( this.removeWaveMc.bind(this), 1000 );
			}
		}
		else{
			this.numTxt.textColor = CardGrid.numberColor;
			this.currentBgPic = this.defaultBgPic;
			if( this._isChecked ){
				this._isChecked = false;
				this.removeWaveMc();
			}
		}
	}

	public showBlink( isShow: boolean ): void{
		this.extraBinkSp.visible = true;
	}

	private removeWaveMc(){
		if( this.waveMc.visible ) this.waveMc.visible = false;
	}

	public showRedEffect(){
		this.numTxt.textColor = 0;
		this.currentBgPic = this.linePic;
	}
}
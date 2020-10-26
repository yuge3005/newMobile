class MentonGrid extends ExtraBlinkGrid{
	private radius: number;
	// single number effect
	private effectBox: egret.DisplayObjectContainer;
	private effect: egret.Shape;

	// effect color
	public static effectBgColor: number = 0x18458E;
	public static effectTextColor: number = 0x2A5AC3;
	// line num color
	public static lineBgColor: number = 0x222870;
	public static lineNumTextColor: number = 0xFFFFFF;

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
			case MentonGrid.MISS_LINE: winTimesStr = "4";
				break;
			case MentonGrid.MISS_COLUMNS_3: winTimesStr = "30";
				break;
			case MentonGrid.MISS_DOUBLE_LINE: winTimesStr = "80";
				break;
			case MentonGrid.MISS_COLUMNS_4: winTimesStr = "120";
				break;
			case MentonGrid.MISS_COLUMNS_2_2: winTimesStr = "250";
				break;
			case MentonGrid.MISS_BINGO: winTimesStr = "500";
				break;
		}
	}

	public get blink(): boolean{
		return this._blink;
	}
	public set blink( value: boolean ){
		if( this._blink == value )return;
		this._blink = value;
		if( !value ){
			this.blinkType = MentonGrid.MISS_LINE;
		}
		else{
			this.blinkType = MentonGrid.MISS_LINE;
		}
	}

	public constructor() {
		super();

		// radius
		this.radius = Math.max(CardGrid.gridSize.x, CardGrid.gridSize.y) * Math.SQRT1_2;
		// effect container
		this.effectBox = new egret.DisplayObjectContainer();
		this.effectBox.mask = new egret.Rectangle(0, 0, CardGrid.gridSize.x, CardGrid.gridSize.y);
		this.addChildAt(this.effectBox, 0);
		// effect
		this.effect = new egret.Shape();
		this.drawEffectCircle(MentonGrid.effectBgColor, CardGrid.numberColor);
		this.effect.scaleX = this.effect.scaleY = 0;
		Com.addObjectAt(this.effectBox, this.effect, CardGrid.gridSize.x >> 1, CardGrid.gridSize.y >> 1);

		this.waveMc = Com.addMovieClipAt( this, MDS.mcFactory, "bingo_bene_wave", 0, 0 );
		this.waveMc.visible = false;
	}

	protected buildSmallWinText(){
		this.extraBlinkNumTxt = Com.addLabelAt( this.extraBinkSp, 0, 3, CardGrid.gridSize.x, 30, 30, false, true );
		this.smallWinTimesText = Com.addLabelAt( this.extraBinkSp, 0, 27, CardGrid.gridSize.x, 40, 35 );
		this.smallWinTimesText.textColor = 0xFFFF00;
	}

	protected getBlinkBg(): egret.Bitmap | egret.MovieClip{
		this.missOneBg = Com.createBitmapByName( this.assetStr( "blue_square" ) );
		return this.missOneBg;
	}

	private assetStr( str: string ): string{
		return "mentonGrid_json." + str;
	}

	public showEffect( isShow: boolean ){
		if( this.blink )this.blink = false;
		if (isShow) {
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
			this.currentBgPic = this.defaultBgPic;
			if( this._isChecked ){
				this._isChecked = false;
				this.removeWaveMc();
			}

			if (this.blink) this.blink = false;
			egret.Tween.removeTweens(this.effect);
			this.effect.scaleX = this.effect.scaleY = 0;

			this.drawEffectCircle(MentonGrid.effectBgColor, CardGrid.numberColor);
		}
	}

	private removeWaveMc(){
		if( this.waveMc.visible ) this.waveMc.visible = false;
	}

	public showRedEffect(){
		this.drawEffectCircle(MentonGrid.lineBgColor, MentonGrid.lineNumTextColor);
	}
	
	private drawEffectCircle(bgColor: number, textColor: number): void {
		GraphicTool.drawCircle( this.effect, new egret.Point, this.radius, bgColor, true );
		this.numTxt.textColor = textColor;
	}
}
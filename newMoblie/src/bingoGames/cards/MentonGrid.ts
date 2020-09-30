class MentonGrid extends CardGrid{
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
	private missOneContainer: egret.DisplayObjectContainer;
	private missOneBg: egret.Bitmap;
	private missOneNumText: egret.TextField;
	private missOneMultiple: egret.TextField;

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
		this.missOneMultiple.text = winTimesStr;
	}

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
		if( !value ){
			this.missOneContainer.visible = false;
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

		// miss one effect
		this.missOneContainer = new egret.DisplayObjectContainer();
		this.missOneContainer.visible = false;
		Com.addObjectAt(this, this.missOneContainer, -3, -3);
		// bg
		this.missOneBg = Com.addBitmapAt(this.missOneContainer, this.assetStr( "blue_square" ), 0, 0);
		// miss one num text
		this.missOneNumText = Com.addTextAt(this.missOneContainer, 0, 3, 50, 30, CardGrid.defaultNumberSize, false, false);
		this.missOneNumText.bold = true;
		this.missOneNumText.textAlign = "center";
		this.missOneNumText.verticalAlign = "middle";
		this.missOneNumText.textColor = CardGrid.numberColor;
		this.missOneNumText.text = this.numTxt.text;
		// miss one multiple
		this.missOneMultiple = Com.addTextAt(this.missOneContainer, 0, 27, 50, 20, 16, false, false);
		this.missOneMultiple.textAlign = "center";
		this.missOneMultiple.verticalAlign = "middle";
		this.missOneMultiple.textColor = 0xFFFFFF;
		this.missOneMultiple.text = "0";
	}

	private assetStr( str: string ): string{
		return "mentonGrid_json." + str;
	}

	public showEffect( isShow: boolean ){
		if( this.blink )this.blink = false;
		this._isChecked = isShow;
		if (isShow) {
			egret.Tween.get(this.effect).to({ scaleX: 1, scaleY: 1 }, 300);
			this.numTxt.textColor = MentonGrid.effectTextColor;
		}
		else{
			if (this.blink) this.blink = false;
			egret.Tween.removeTweens(this.effect);
			this.effect.scaleX = this.effect.scaleY = 0;

			this.drawEffectCircle(MentonGrid.effectBgColor, CardGrid.numberColor);
			this.missOneContainer.visible = false;
		}
	}

	public showRedEffect(){
		this.drawEffectCircle(MentonGrid.lineBgColor, MentonGrid.lineNumTextColor);
	}
	
	private drawEffectCircle(bgColor: number, textColor: number): void {
		GraphicTool.drawCircle( this.effect, new egret.Point, this.radius, bgColor, true );
		this.numTxt.textColor = textColor;
	}

	public showBlink( isShow: boolean ): void{
		this.missOneNumText.text = this.numTxt.text;
		this.missOneContainer.visible = true;
		if( this.missOneMultiple.text == "0" )this.blinkType = MentonGrid.MISS_LINE;
	}
}
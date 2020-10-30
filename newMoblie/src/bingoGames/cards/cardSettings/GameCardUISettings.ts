class GameCardUISettings {

	public static titleColors: Array<number>;
	public static bgString: string;

	public static texColor: number;

	public static gridNumbers: egret.Point;
	public static gridInitPosition: egret.Point;

	public static cardTextRect: egret.Rectangle;
	public static betTextRect: egret.Rectangle;

	public static currentBgColorIndex: number = 0;

	public static showTitleShadow: egret.Filter;
	public static gridOnTop: boolean = true;
	
	public constructor() {
	}

	public static dataSetting( data: Object ){
		this.titleColors = data["titleColors"];
		this.bgString = data["cardBg"];
	}

	public static colorSetting( colors: Object ){
		this.texColor = colors["textColor"];
	}

	public static sizeSetting( size: Object ){
		this.gridNumbers = new egret.Point( size["vertSize"], size["horzSize"] );
		this.gridInitPosition = new egret.Point( size["numberInitialPositionX"], size["numberInitialPositionY"] );

		let cardTextRect: egret.Rectangle = new egret.Rectangle( size["cardTextPositionX"], size["cardTextPositionY"], size["cardTextSizeX"], size["cardTextSizeY"] );
		if( cardTextRect.width > 1 ) this.cardTextRect = cardTextRect;
		let betTextRect: egret.Rectangle = new egret.Rectangle( size["betTextPositionX"], size["betTextPositionY"], size["betTextSizeX"], size["betTextSizeY"] );
		if( betTextRect.width > 1 ) this.betTextRect = betTextRect;
	}

	public static get cardTitleColor(): number{
		return this.titleColors[this.currentBgColorIndex];
	}

	public static changeBgColor(){
		this.currentBgColorIndex++;
		if( this.currentBgColorIndex >= this.titleColors.length )this.currentBgColorIndex = 0;
	}
}
class CardGridColorAndSizeSettings{

	public static numberColor: number;
	public static numberColorOnEffect: number;
	public static colorNumberOnEffect: boolean;

	public static gridSize: egret.Point;
	public static gridSpace: egret.Point;

	public static defaultNumberSize: number;

	public constructor() {
	}

	public static colorSetting( colors: Object ){
		this.numberColor = colors["numberColor"];
		this.numberColorOnEffect = colors["numberColorOnEffect"];
		this.colorNumberOnEffect = colors["colorNumberOnEffect"];
	}

	public static sizeSetting( size: Object ){
		this.gridSize = new egret.Point( size["numberSizeX"], size["numberSizeY"] );
		this.gridSpace = new egret.Point( this.gridSize.x + size["vertGap"], this.gridSize.y + size["horzGap"] );
	}
}
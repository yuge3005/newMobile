class LineManager {
	public constructor() {
	}

	public static maxLines: number;
	public static currentLines: number;

	public static lineStartPoint: egret.Point;
	public static lineScale: egret.Point = new egret.Point( 3, 3 );
	public static linePicPositions: Array<number>;

	public static lineFormat(): string{
		return ( Math.pow( 2, this.maxLines + 1 ) - Math.pow( 2, this.maxLines - this.currentLines ) ).toString(16);
	}
}
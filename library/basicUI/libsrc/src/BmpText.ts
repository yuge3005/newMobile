class BmpText extends egret.BitmapText{

	private _color: number;
	public set textColor( value: number ){
		this._color = value;
		this.filters = [MatrixTool.colorMatrixPure(value)];
	}
	public get textColor(): number{
		return this._color;
	}

	public constructor() {
		super();
	}

	public setText( str: string ): void{
		this.text = str;
	}
}
class PachinkoGrid extends ExtraBlinkGrid{

	public static gridMatrixs: Array<Array<number>>;
	public static paytableNumbers: Object;

    constructor() {
        super();
    }

	protected buildSmallWinText(){
		this.extraBlinkNumTxt = Com.addLabelAt( this.extraBinkSp, 0, 6, CardGridColorAndSizeSettings.gridSize.x, 30, 30, false, true );
		this.extraBlinkNumTxt.textColor = 0;
		this.smallWinTimesText = Com.addLabelAt( this.extraBinkSp, 0, 34, CardGridColorAndSizeSettings.gridSize.x, 40, 40, true, true );
		this.smallWinTimesText.stroke = 3;
	}

	protected getBlinkBg(): egret.Bitmap{
		return Com.createBitmapByName( BingoMachine.getAssetStr( CardGridUISettings.defaultBgPicName ) );
	}

	public set extraBlinkNumber( value: number ){
		this.extraBlinkNumTxt.text = "" + value;
		let extraBg: egret.Bitmap = this.extraBinkSp.getChildAt( 0 ) as egret.Bitmap;
		let index: number = Math.floor( value / 10 );
		let gcmf: egret.ColorMatrixFilter = new egret.ColorMatrixFilter(PachinkoGrid.gridMatrixs[index]);
		extraBg.filters = [ gcmf ];
	}

	public static setGridMatrix(){
		let gridMatrixs = [];
		gridMatrixs[0] = this.getMatrixArray( 0, 1, 0 );
		gridMatrixs[1] = this.getMatrixArray( 1, 0, 0 );
		gridMatrixs[2] = this.getMatrixArray( 1, 1, 0 );
		gridMatrixs[3] = this.getMatrixArray( 0, 0, 1 );
		gridMatrixs[4] = this.getMatrixArray( 1, 0.5, 0 );
		gridMatrixs[5] = this.getMatrixArray( 0.8, 0.8, 0.8 );
		gridMatrixs[6] = this.getMatrixArray( 0.9, 0, 0.9 );
		gridMatrixs[7] = this.getMatrixArray( 0.6, 0, 0.9 );
		this.gridMatrixs = gridMatrixs;
	}

	public static getMatrixArray( r: number, g: number, b: number ): Array<number>{
		let matrix : Array<number> = [];
		matrix = matrix.concat( [r, 0, 0, 0, 0 ] );
		matrix = matrix.concat( [0, g, 0, 0, 0 ] );
		matrix = matrix.concat( [0, 0, b, 0, 0 ] );
		matrix = matrix.concat( [0, 0, 0, 1, 0 ] );
		return matrix;
	}

	public showRedEffect(){
		this.numTxt.textColor = CardGridColorAndSizeSettings.numberColorOnEffect;
		this.currentBgPic = this.linePic;
	}
}
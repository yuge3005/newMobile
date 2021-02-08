class MatrixTool {
	public constructor() {
	}

	public static colorMatrix( mainChannel: number, otherChannel: number, alphaChannel: number ){
		let matrix : Array<number> = [];
		matrix = matrix.concat( [mainChannel, otherChannel, otherChannel, 0, 0 ] );
		matrix = matrix.concat( [otherChannel, mainChannel, otherChannel, 0, 0 ] );
		matrix = matrix.concat( [otherChannel, otherChannel, mainChannel, 0, 0 ] );
		matrix = matrix.concat( [0, 0, 0, alphaChannel, 0 ] );
		let gcmf: egret.ColorMatrixFilter = new egret.ColorMatrixFilter(matrix);
		return gcmf;
	}

	public static colorMatrixPure( color: number, alpha: number = 1 ){
		let matrix : Array<number> = [];
		matrix = matrix.concat( [0, 0, 0, 0, color >> 16 ] );
		matrix = matrix.concat( [0, 0, 0, 0, ( color & 0x00FF00 ) >> 8 ] );
		matrix = matrix.concat( [0, 0, 0, 0, color & 0x0000FF ] );
		matrix = matrix.concat( [0, 0, 0, alpha, 0 ] );
		let gcmf: egret.ColorMatrixFilter = new egret.ColorMatrixFilter(matrix);
		return gcmf;
	}

	public static colorMatrixLighter( light: number ){
		let stay: number = 1 - light;
		let leghter: number = Math.floor( 255 * light );
		let matrix : Array<number> = [];
		matrix = matrix.concat( [stay, 0, 0, 0, leghter ] );
		matrix = matrix.concat( [0, stay, 0, 0, leghter ] );
		matrix = matrix.concat( [0, 0, stay, 0, leghter ] );
		matrix = matrix.concat( [0, 0, 0, 1, 0 ] );
		let gcmf: egret.ColorMatrixFilter = new egret.ColorMatrixFilter(matrix);
		return gcmf;
	}
}
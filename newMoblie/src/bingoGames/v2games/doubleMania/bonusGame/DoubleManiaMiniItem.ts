class DoubleManiaMiniItem extends egret.DisplayObjectContainer {

	private static miniFilters: Array<Array<egret.ColorMatrixFilter>>;
	public static itemAssetList: Array<string>;

	private miniItemBg: egret.Bitmap;

	public constructor( assetString: string ) {
		super();
		if( !DoubleManiaMiniItem.miniFilters )DoubleManiaMiniItem.getMiniFilters();

		this.miniItemBg = Com.addBitmapAt( this, assetString, 0, 0 );

		this.showRandom();
	}

	private showRandom(): void{
		let rd: number = Math.floor( Math.random() * 5 );
		this.showItem( rd );
	}

	private showItem( i: number, blur: boolean = false ): void{
		this.removeChildren();
		this.addChild( this.miniItemBg );
		this.miniItemBg.filters = DoubleManiaMiniItem.miniFilters[i];
		let icon: egret.Bitmap = Com.addBitmapAt( this, DoubleManiaMiniItem.itemAssetList[i] + ( blur ? "_blur" : "" ), 0, 0 );
		icon.anchorOffsetX = icon.width >> 1;
		icon.anchorOffsetY = icon.height >> 1;
		icon.x = this.miniItemBg.width >> 1;
		icon.y = this.miniItemBg.height >> 1;
	}

	private static getMiniFilters(): void{
		this.miniFilters = [];
		this.miniFilters[0] = [];//green
		this.miniFilters[1] =  [ this.getRGBMatrix( 0.2, 0.2, 0.2 ) ];//black
		this.miniFilters[2] =  [ this.getRGBMatrix( 1, 1, 0 ) ];//yellow
		this.miniFilters[3] =  [ this.getRGBMatrix( 1, 0.5, 0 ) ];//orange
		this.miniFilters[4] =  [ this.getRGBMatrix( 1, 1, 1 ) ];//white
	}

	private static getRGBMatrix( r: number, g: number, b: number ): egret.ColorMatrixFilter{
		let matrix : Array<number> = [];
		matrix = matrix.concat( [0, r, 0, 0, 0 ] );
		matrix = matrix.concat( [0, g, 0, 0, 0 ] );
		matrix = matrix.concat( [0, b, 0, 0, 0 ] );
		matrix = matrix.concat( [0, 0, 0, 1, 0 ] );
		return new egret.ColorMatrixFilter(matrix);
	}

	private intervalId: number;

	public runRandomBlur(){
		this.intervalId = setInterval( this.runBlurItem.bind( this ), 34 );
	}

	private runBlurItem(): void{
		if( !this.stage )clearInterval( this.intervalId );
		let rd: number = Math.floor( Math.random() * 5 );
		this.showItem( rd, true );
	}

	public currentItem: number;

	public shopOn( i: number ){
		clearInterval( this.intervalId );
		this.showItem( i );
		this.currentItem = i;
	}
}
class NineballCard extends GameCard{

	private gridLayer: egret.DisplayObjectContainer;
	private gridMask: egret.Bitmap;

	public constructor( cardId: number ) {
		super( cardId );
	}

	public getNumbers( numbers: Array<number> ){
		super.getNumbers( numbers );

		if( this.gridLayer ) return;
		this.gridLayer = new egret.DisplayObjectContainer;
		for( var i: number = 0; i < numbers.length; i++ ){
			this.gridLayer.addChild( this.grids[i] );
		}
		Com.addObjectAt( this, this.gridLayer, 13, 55 );

		var gridMask: egret.Bitmap = Com.addBitmapAt( this, BingoMachine.getAssetStr( "mask" ), 13, 55 );
		this.gridLayer.mask = gridMask;
	}

	protected createGrid( gridIndex: number ): TowerGrid{
		let grid: TowerGrid = new TowerGrid;
		grid.x = ( gridIndex % GameCardUISettings.gridNumbers.x ) * CardGridColorAndSizeSettings.gridSpace.x + 2;
		grid.y = Math.floor( gridIndex / GameCardUISettings.gridNumbers.x ) * CardGridColorAndSizeSettings.gridSpace.y + 2;
		this.addChild( grid );
		return grid;
	}
}
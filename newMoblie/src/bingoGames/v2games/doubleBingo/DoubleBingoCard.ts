class DoubleBingoCard extends GameCard{

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected createGrid( gridIndex: number ): TowerGrid{
		let grid: TowerGrid = new TowerGrid();
		let line: number = gridIndex < 4 ? 0 : ( gridIndex < 9 ? 1 : 2 );
		let row: number = gridIndex < 4 ? gridIndex : ( gridIndex < 9 ? gridIndex - 4 : gridIndex - 9 );
		grid.x = GameCardUISettings.gridInitPosition.x + row * CardGridColorAndSizeSettings.gridSpace.x;
		grid.y = GameCardUISettings.gridInitPosition.y + line * CardGridColorAndSizeSettings.gridSpace.y;
		if( this.cardId & 1 ){
			if( line == 0 )	grid.x += CardGridColorAndSizeSettings.gridSpace.x;
		}
		else{
			if( line == 2 ) grid.x += CardGridColorAndSizeSettings.gridSpace.x;
		}
		this.addChild( grid );
		return grid;
	}
}
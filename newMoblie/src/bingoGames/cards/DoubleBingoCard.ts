class DoubleBingoCard extends GameCard{

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		this.bg = Com.addBitmapAt( this, BingoMachine.getAssetStr( GameCardUISettings.bgString.replace( "_1", "" ) + "_" + ( this.cardId + 1 ) ), 0, 0 );
		super.onAdd( event );
	}

	protected createGrid( gridIndex: number ): TowerGrid{
		let grid: TowerGrid = new TowerGrid();
		let line: number = gridIndex < 4 ? 0 : ( gridIndex < 9 ? 1 : 2 );
		grid.x = GameCardUISettings.gridInitPosition.x + ( gridIndex - line * 4 ) * CardGridColorAndSizeSettings.gridSpace.x;
		grid.y = GameCardUISettings.gridInitPosition.y + line * CardGridColorAndSizeSettings.gridSpace.y;
		if( this.cardId & 1 ){
			grid.x += ( 1 - ( line & 1 ) ) * CardGridColorAndSizeSettings.gridSpace.x * ( line >= 2 ? -1 : 1 );
		}
		if( this.cardId == 1 )grid.x += 15;
		else if( this.cardId == 2 )grid.x += 18;
		else if( this.cardId == 3 )grid.x += 2;
		if( GameCardUISettings.gridOnTop )this.addChild( grid );
		else this.addChildAt( grid, 0 );
		return grid;
	}
}
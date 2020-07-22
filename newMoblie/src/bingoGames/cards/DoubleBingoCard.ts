class DoubleBingoCard extends GameCard{

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		this.bg = Com.addBitmapAt( this, BingoMachine.getAssetStr( GameCard.bgString.replace( "_1", "" ) + "_" + ( this.cardId + 1 ) ), 0, 0 );
		this.disabledBg = Com.createBitmapByName( BingoMachine.getAssetStr( GameCard.disabledBgString.replace( "_1", "" ) + "_" + ( this.cardId + 1 ) ) );
		super.onAdd( event );
	}

	protected createGrid( gridIndex: number ): CardGrid{
		let grid: CardGrid = new CardGrid();
		let line: number = gridIndex < 4 ? 0 : ( gridIndex < 9 ? 1 : 2 );
		grid.x = GameCard.gridInitPosition.x + ( gridIndex - line * 4 ) * CardGrid.gridSpace.x;
		grid.y = GameCard.gridInitPosition.y + line * CardGrid.gridSpace.y;
		if( this.cardId & 1 ){
			grid.x += ( 1 - ( line & 1 ) ) * CardGrid.gridSpace.x * ( line >= 2 ? -1 : 1 );
		}
		if( this.cardId == 1 )grid.x += 15;
		else if( this.cardId == 2 )grid.x += 18;
		else if( this.cardId == 3 )grid.x += 2;
		if( GameCard.gridOnTop )this.addChild( grid );
		else this.addChildAt( grid, 0 );
		return grid;
	}
}
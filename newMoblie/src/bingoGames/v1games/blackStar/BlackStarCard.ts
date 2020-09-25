class BlackStarCard extends GameCard{
	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		super.onAdd( event );

		Com.addBitmapAt( this, BingoMachine.getAssetStr( "card_bg03" ), 13, 34 );
	}

	public getBgColor(){
		if( GameCard.titleColors ){
			this.bg.filters = [ MatrixTool.colorMatrixPure( GameCard.titleColors[GameCard.currentBgColorIndex] ) ];
		}
	}
}
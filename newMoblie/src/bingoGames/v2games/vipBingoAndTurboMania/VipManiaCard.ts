class VipManiaCard extends GameCard{
	public constructor( cardId: number ) {
		super( cardId );
	}

	public getBgColor(){
		if( GameCard.titleColors ){
			this.bg.filters = [ MatrixTool.colorMatrixPure( GameCard.titleColors[GameCard.currentBgColorIndex] ) ];
		}
	}
}
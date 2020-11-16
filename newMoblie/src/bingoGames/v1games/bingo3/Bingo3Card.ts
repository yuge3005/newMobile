class Bingo3Card extends GameCard{
	public constructor( cardId: number ) {
		super( cardId );
	}

	public getBgColor(){
		if( GameCardUISettings.titleColors ){
			this.bg.filters = [ MatrixTool.colorMatrixPure( GameCardUISettings.cardTitleColor ) ];
		}
	}
}
class Pachinko2Card extends GameCard{
	public constructor( cardId: number ) {
		super( cardId );
	}

	public getNumbers( numbers: Array<number> ){
		super.getNumbers( numbers );

		for( let i: number = 0; i < this.grids.length; i++ ){
			( this.grids[i] as Pachinko2Grid ).extraBlinkNumber = numbers[i];
		}
	}

	public showWinCount( winNumber: number ): void{
		if( winNumber > 0 ) this.betText.setText( MuLang.getText("win") + ": " + ( winNumber ? Utils.formatCoinsNumber( winNumber ) : "" ) );
	}
}
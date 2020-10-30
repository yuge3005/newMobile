class ExtraBlinkCard extends GameCard{
	public constructor( cardId: number ) {
		super( cardId );
	}

	public getNumbers( numbers: Array<number> ){
		super.getNumbers( numbers );

		for( let i: number = 0; i < this.grids.length; i++ ){
			( this.grids[i] as ExtraBlinkGrid ).extraBlinkNumber = numbers[i];
		}
	}

	public showWinCount( winNumber: number ): void{
		if( winNumber > 0 ) this.betText.setText( MuLang.getText("win") + ": " + ( winNumber ? Utils.formatCoinsNumber( winNumber ) : "" ) );
	}

	public setSmallWinTimeAt( gridIndex: number, winTimes: number ): void{	
		if( this.grids[gridIndex] instanceof ExtraBlinkGrid ){
			( this.grids[gridIndex] as ExtraBlinkGrid ).setSmallTime( winTimes );
		}
		else{
			console.error( "current grid is not extra blink grid, cannot setSmallTime" );
		}
	}
}
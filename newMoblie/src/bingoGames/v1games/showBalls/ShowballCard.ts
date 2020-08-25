class ShowballCard extends GameCard{
	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd(event: egret.Event) {
        super.onAdd(event);
        
        this.cardText.scaleX = 0.95;
        this.betText.scaleX = 0.95;
		this.cardText.fontFamily = "Arial";
        this.betText.fontFamily = "Arial";
		this.cardText.bold = true;
        this.betText.bold = true;
    }

	public getNumbers( numbers: Array<number> ){
		super.getNumbers( numbers );

		for( let i: number = 0; i < this.grids.length; i++ ){
			( this.grids[i] as ShowballGrid ).extraBlinkNumber = numbers[i];
		}
	}

	public showWinCount( winNumber: number ): void{
		if( winNumber > 0 ) this.betText.setText( MuLang.getText("win") + ": " + ( winNumber ? Utils.formatCoinsNumber( winNumber ) : "" ) );
	}
}
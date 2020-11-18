class ShowballCard extends ExtraBlinkCard{
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
        this.cardText.text = MuLang.getText("prize") + ":";
    }

    public showWinCount( winNumber: number ): void{
		if( winNumber > 0 ) this.cardText.setText( MuLang.getText("prize") + ": " + ( winNumber ? Utils.formatCoinsNumber( winNumber ) : "" ) );
        else this.cardText.text = MuLang.getText("prize") + ":";
	}
}
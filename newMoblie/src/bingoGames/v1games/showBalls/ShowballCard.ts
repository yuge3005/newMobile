class ShowballCard extends GameCard{
	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd(event: egret.Event) {
        super.onAdd(event);
        
        this.cardText.scaleX = 0.95;
        this.betText.scaleX = 0.95;

		this.cardText.textColor = 0xFFFF33;
		this.cardText.fontFamily = "Arial";
		this.cardText.bold = true;
		this.cardText.filters = [];
		this.cardText.text = MuLang.getText("prize") + ":";
    }

	public showWinCount( winNumber: number ): void{
		this.cardText.text = MuLang.getText("prize") + ": " + ( winNumber ? Utils.formatCoinsNumber( winNumber ) : "" );
	}
}
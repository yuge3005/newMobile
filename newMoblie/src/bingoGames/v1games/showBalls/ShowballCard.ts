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
		this.cardText.text = GameUIItem.languageText["prize"][GlobelSettings.language] + ":";
    }

	public showWinCount( winNumber: number ): void{
		this.cardText.text = GameUIItem.languageText["prize"][GlobelSettings.language] + ": " + ( winNumber ? Utils.formatCoinsNumber( winNumber ) : "" );
	}
}
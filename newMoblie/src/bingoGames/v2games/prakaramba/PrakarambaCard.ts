class PrakarambaCard extends ExtraBlinkCard{
	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd(event: egret.Event) {
        super.onAdd(event);

		this.cardText.setText( MuLang.getText("win") + ": 0" );
	}
}
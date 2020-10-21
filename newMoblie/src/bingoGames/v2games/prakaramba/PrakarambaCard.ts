class PrakarambaCard extends ExtraBlinkCard{

	private winTx: TextLabel;

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd(event: egret.Event) {
        super.onAdd(event);

		this.winTx = this.cardText;
		this.winTx.setText( MuLang.getText("win") + ": 0" );
	}

	public showWinCount( winNumber: number ): void{
		this.winTx.setText(  MuLang.getText("win") + ": " + Utils.formatCoinsNumber( winNumber ) );
	}

	public clearStatus(){
		super.clearStatus();
		this.winTx.setText( MuLang.getText("win") + ": 0" );
	}
}
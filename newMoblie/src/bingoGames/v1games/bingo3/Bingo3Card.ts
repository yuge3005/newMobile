class Bingo3Card extends GameCard{
	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd(event: egret.Event) {
        super.onAdd(event);

		this.cardText.fontFamily = "Arial";
		this.cardText.bold = true;
		this.betText.fontFamily = "Arial";
		this.betText.bold = true;
	}

	public getBgColor(){
		if( GameCardUISettings.titleColors ){
			this.bg.filters = [ MatrixTool.colorMatrixPure( GameCardUISettings.cardTitleColor ) ];
		}
	}
}
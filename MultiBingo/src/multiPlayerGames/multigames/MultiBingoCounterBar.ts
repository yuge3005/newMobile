class MultiBingoCounterBar extends egret.DisplayObjectContainer{

	protected cardCountTxt: TextLabel;
	protected playerCountTxt: TextLabel;
	
	public constructor() {
		super();
	}

	public updateCardAndPlayerNumbers( cardCount: number, playerCount: number ){
		this.cardCountTxt.setText( cardCount + " " + MuLang.getText( "cards", MuLang.CASE_UPPER ) );
		this.playerCountTxt.setText( playerCount + " " + MuLang.getText( "players", MuLang.CASE_UPPER ) );
	}
}
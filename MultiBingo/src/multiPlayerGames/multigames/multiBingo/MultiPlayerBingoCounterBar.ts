class MultiPlayerBingoCounterBar extends MultiBingoCounterBar{
	public constructor() {
		super();

		this.cardCountTxt = MDS.addGameText( this, 35, 160, 48, 0xFFFFFF, "", false, 480 );
		this.playerCountTxt = MDS.addGameText( this, 35, 160, 48, 0xFFFFFF, "", false, 480 );
	}

	public updateCardAndPlayerNumbers( cardCount: number, playerCount: number ){
		super.updateCardAndPlayerNumbers( cardCount, playerCount );
		
		this.cardCountTxt.setText( this.cardCountTxt.text + "  " + this.playerCountTxt.text );
		this.playerCountTxt.text = "";
	}
}
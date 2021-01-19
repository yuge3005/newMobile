class MaraBingoCounterBar extends MultiBingoCounterBar{
	public constructor() {
		super();

		this.cardCountTxt = Com.addLabelAt( this, -1329, -410, 225, 40, 40 );
		this.cardCountTxt.textAlign = "left";
		this.cardCountTxt.fontFamily = "Arial";
		this.cardCountTxt.bold = true;
		this.cardCountTxt.scaleX = 0.75;
		this.playerCountTxt = Com.addLabelAt( this, -1329, -453, 225, 40, 40 );
		this.playerCountTxt.textAlign = "left";
		this.playerCountTxt.fontFamily = "Arial";
		this.playerCountTxt.bold = true;
		this.playerCountTxt.scaleX = 0.75;
	}
}
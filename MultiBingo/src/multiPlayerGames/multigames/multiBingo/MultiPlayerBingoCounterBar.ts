class MultiPlayerBingoCounterBar extends MultiBingoCounterBar{
	public constructor() {
		super();

		this.cardCountTxt = MDS.addGameText( this, 35 - 1500, - 428, 48, 0xFFFFFF, "", false, 480 );
		this.playerCountTxt = MDS.addGameText( this, 35 - 1500, - 428, 48, 0xFFFFFF, "", false, 480 );
	}
}
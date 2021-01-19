class MultiPlayerBingoCounterBar extends MultiBingoCounterBar{
	public constructor() {
		super();

		this.cardCountTxt = MDS.addGameText( this, 35, 160, 48, 0xFFFFFF, "", false, 480 );
		this.playerCountTxt = MDS.addGameText( this, 35, 160, 48, 0xFFFFFF, "", false, 480 );
	}
}
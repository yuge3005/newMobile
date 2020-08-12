class GoldSilverSuper extends V2Game{
	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super( gameConfigFile, configUrl, gameId );
		this.ptFilterConfig = "goldball_filt";
		this.languageObjectName = "silver_ball_tx";

		PaytableUI.textBold = true;

		GameCard.useRedEffect = true;

		BingoBackGroundSetting.defaultScale = false;
		BingoBackGroundSetting.gameMask = new egret.Rectangle( 0, 0, 2000, 1125 );
	}

	protected init(){
		super.init();

		if( this.extraUIObject ) this.extraUIShowNumber();
	}
}
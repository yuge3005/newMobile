class GoldSilverSuper extends V2Game{
	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super( gameConfigFile, configUrl, gameId );
		this.languageObjectName = "silver_ball_tx";

		PaytableUI.textBold = true;

		GameCard.useRedEffect = true;
	}

	protected init(){
		super.init();

		if( this.extraUIObject ) this.extraUIShowNumber();
	}
}
class PrakarambaCard extends ExtraBlinkCard{

	private winTx: TextLabel;

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd(event: egret.Event) {
        super.onAdd(event);

		this.cardText.fontFamily = "Arial";
		this.betText.fontFamily = "Arial";

		this.winTx = this.cardText;
		this.winTx.setText( MuLang.getText("win") + ": 0" );
	}

	public showWinCount( winNumber: number ): void{
		this.winTx.setText(  MuLang.getText("win") + ": " + Utils.formatCoinsNumber( winNumber ) );
	}

	public clearStatus(){
		super.clearStatus();
		this.redEffectKeys = {};
		this.winTx.setText( MuLang.getText("win") + ": 0" );
	}

	private redEffectKeys: Object = {};

	public showfitEffect( assetName: string, fitIndex: Array<boolean> ){
		if( GameCard.useRedEffect ){
			if( fitIndex.length ){
				for( let i: number = 0; i < fitIndex.length; i++ ){
					if( fitIndex[i] ){
						let ruleStr: string = PayTableManager.payTablesDictionary[assetName].rules[i];
						this.setGridsToRed( ruleStr );

						if( !this.redEffectKeys[ ruleStr ] ){
							this.gridsRedWave( ruleStr );
						}
					}
				}
			}
			else{
				let ruleStr: string = PayTableManager.payTablesDictionary[assetName].rule;
				this.setGridsToRed( ruleStr );

				if( !this.redEffectKeys[ ruleStr ] ){
					this.gridsRedWave( ruleStr );
				}
			}
		}
	}

	protected gridsRedWave( str: string ): void{
		this.redEffectKeys[ str ] = true;

		for( let i: number = 0; i < str.length; i++ ){
			if( str.charAt(i) == "1" ) ( this.grids[i] as PrakarambaGrid ).showWaveEffect( 0 );
		}
	}
}
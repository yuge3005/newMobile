class DoubleManiaCard extends ExtraBlinkCard{
	public constructor( cardId: number ) {
		super( cardId );
	}

	public showfitEffect( assetName: string, fitIndex: Array<boolean> ){
		if( fitIndex.length ){
			for( let i: number = 0; i < fitIndex.length; i++ ){
				if( fitIndex[i] ) {
					Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName][i] ), 0, 0 );
					this.removeFork( PayTableManager.payTablesDictionary[assetName].rules[i] );
				}
			}
		}
		else{
			Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName] ), 0, 0 );
			this.removeFork( PayTableManager.payTablesDictionary[assetName].rule );
		}
	}

	protected removeFork( str: string ): void{
		for( let j: number = 0; j < str.length; j++ ){
			if( str[j] == "1" ){
				(this.grids[j] as ForkGrid).removeFork();
			}
		}
	}
}
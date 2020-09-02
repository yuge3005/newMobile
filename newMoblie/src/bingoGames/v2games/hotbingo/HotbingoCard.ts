class HotbingoCard extends GameCard{

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		super.onAdd( event );
		this.cardText.fontFamily = "Righteous";
		this.betText.fontFamily = "Righteous";
	}

	public showfitEffect( assetName: string, fitIndex: Array<boolean> ){
		if( fitIndex.length ){
			for( let i: number = 0; i < fitIndex.length; i++ ){
				if( fitIndex[i] ){
					this.removeFork( PayTableManager.payTablesDictionary[assetName].rules[i] );
					Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName][i] ), 0, 0 );
				}
			}
		}
		else{
			this.setGridsToRed( PayTableManager.payTablesDictionary[assetName].rule );
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
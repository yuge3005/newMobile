class CopacabanaCard extends GameCard{

	public constructor( cardId: number ) {
		super( cardId );
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

	public clearStatus(){
		CopacabanaGird.needClear = true;
		super.clearStatus();
		CopacabanaGird.needClear = false;
		this.redEffectKeys = {};
	}

	protected gridsRedWave( str: string ): void{
		this.redEffectKeys[ str ] = true;
		trace( str );
		let first1: number = str.indexOf( "1" );
		for( let j: number = 0; j < str.length; j++ ){
			if( str[j] == "1" ){
				( this.grids[j] as CopacabanaGird ).showWaveEffect( ( j - first1 + 1 ) * 100 );
			}
		}
	}
}
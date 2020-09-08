class BonusBingoCard extends GameCard{

    public cardBgLight: egret.Bitmap;

	public constructor( cardId: number ) {
		super( cardId );

		this.cardBgLight = Com.addBitmapAt( this, BingoMachine.getAssetStr( "card_outlight" ), -74, -80 );
		this.addChildAt( this.cardBgLight, 0 );
	}

	private superBg: egret.Bitmap;
	private static superBgName: string = "card_special";

	public useSuperBg( status: boolean ){
		let index: number = this.getChildIndex( this.bg );
		if( status ){
			if( !this.superBg )this.superBg = Com.addBitmapAt( this, BingoMachine.getAssetStr( BonusBingoCard.superBgName ), 0, 0 );
			this.addChildAt( this.superBg, index + 1 );
		}
		else{
			if( this.superBg && this.contains( this.superBg ) )this.removeChild( this.superBg );
		}
	}

	public showfitEffect( assetName: string, fitIndex: Array<boolean> ){
		if( fitIndex.length ){
			for( let i: number = 0; i < fitIndex.length; i++ ){
				if( fitIndex[i] ) {
					this.removeFork( PayTableManager.payTablesDictionary[assetName].rules[i] );
				}
			}
		}
		else{
			this.removeFork( PayTableManager.payTablesDictionary[assetName].rule );
		}
		
		if( !GameCard.fitEffectNameList )return;

		try{
			let effectImage: egret.Bitmap;
			if( fitIndex.length ){
				for( let i: number = 0; i< fitIndex.length; i++ ){
					if( fitIndex[i] ){
						effectImage = Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName][i] ), 0, 0 );
					}
				}
			}
			else{
				effectImage = Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName] ), 0, 0 );
			}
		}
		catch( e ){
			trace( "showfitEffect ignore:" + assetName );
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
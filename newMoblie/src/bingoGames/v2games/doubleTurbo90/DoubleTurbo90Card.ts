class DoubleTurbo90Card extends Turbo90Card{
	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		super.onAdd( event );
		this.titleBg.x = 5;
		this.titleBg.y = 7;
		Com.addBitmapAt( this, BingoMachine.getAssetStr( "card_background" ), 9, 41 );
	}

	public showfitEffect( assetName: string, fitIndex: Array<boolean> ){
		if( fitIndex.length ){
			for( let i: number = 0; i < fitIndex.length; i++ ){
				if( fitIndex[i] ) {
					this.setGridsToRed( PayTableManager.payTablesDictionary[assetName].rules[i] );
					this.removeFork( PayTableManager.payTablesDictionary[assetName].rules[i] );
				}
			}
		}
		else{
			this.setGridsToRed( PayTableManager.payTablesDictionary[assetName].rule );
			this.removeFork( PayTableManager.payTablesDictionary[assetName].rule );
		}
	}
}
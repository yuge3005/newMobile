class Turbo90Card extends GameCard{

	protected titleBg: egret.Bitmap;

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		super.onAdd( event );
		this.titleBg = Com.addBitmapAt( this, BingoMachine.getAssetStr( "CARD_HEADER_BG_white" ), 9, 8 );
		this.addChild( this.cardText );
		this.addChild( this.betText );
	}

	public getBgColor(){
		if( !this.titleBg )return;
		if( GameCardUISettings.titleColors ){
			this.titleBg.filters = [ MatrixTool.colorMatrixPure( GameCardUISettings.cardTitleColor ) ];
		}
	}

	public showfitEffect( assetName: string, fitIndex: Array<boolean> ){
		if( fitIndex.length ){
			for( let i: number = 0; i < fitIndex.length; i++ ){
				if( fitIndex[i] ) this.removeFork( PayTableManager.payTablesDictionary[assetName].rules[i] );
			}
		}
		else{
			this.setGridsToRed( PayTableManager.payTablesDictionary[assetName].rule );
			this.removeFork( PayTableManager.payTablesDictionary[assetName].rule );
		}

		if( fitIndex.length ){
			for( let i: number = 0; i< fitIndex.length; i++ ){
				if( fitIndex[i] ){
					Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName][i] ), 0, 0 );
				}
			}
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
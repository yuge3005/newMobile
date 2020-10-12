class BlackStarCard extends ExtraBlinkCard{

	private unFitEffectLayer: egret.DisplayObjectContainer;

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		super.onAdd( event );

		if (this.cardText) this.cardText.setText( MuLang.getText( "card" ) + ":" );

		Com.addBitmapAt( this, BingoMachine.getAssetStr( "card_bg03" ), 13, 34 );

		this.unFitEffectLayer = new egret.DisplayObjectContainer;
		this.addChildAt( this.unFitEffectLayer, this.getChildIndex( this.fitEffectLayer ) );
	}

	public getBgColor(){
		if( GameCard.titleColors ){
			this.bg.filters = [ MatrixTool.colorMatrixPure( GameCard.titleColors[GameCard.currentBgColorIndex] ) ];
		}
	}

	public clearFitEffect(){
		super.clearFitEffect();
		if( this.unFitEffectLayer ){
			this.unFitEffectLayer.removeChildren();
			this.addChildAt( this.unFitEffectLayer, this.getChildIndex( this.fitEffectLayer ) - 1 );
		}
	}

	public showunfitEffect( assetName: string, unfitRules: Array<number> ){
		try{
			let effectImage: egret.Bitmap;
			if( unfitRules ){
				for( let i: number = 0; i< unfitRules.length; i++ ){
					effectImage = Com.addBitmapAt( this.unFitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName][unfitRules[i]] ), 0, 0 );
				}
			}
			else{
				effectImage = Com.addBitmapAt( this.unFitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName] ), 0, 0 );
			}
		}
		catch( e ){
			trace( "showfitEffect ignore:" + assetName );
		}
	}
}
class Showball2Card extends ShowballCard{

	private unFitEffectLayer: egret.DisplayObjectContainer;

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		super.onAdd( event );

		this.unFitEffectLayer = new egret.DisplayObjectContainer;
		this.addChildAt( this.unFitEffectLayer, this.getChildIndex( this.fitEffectLayer ) );

		this.fitEffectLayer.filters = [ MatrixTool.colorMatrixPure( 0xFF0000 ), new egret.GlowFilter( 0xFF0000, 1, 4, 4, 5, 5 ) ];
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
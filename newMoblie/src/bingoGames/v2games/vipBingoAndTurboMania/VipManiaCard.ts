class VipManiaCard extends GameCard{

	private unFitEffectLayer: egret.DisplayObjectContainer;

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		super.onAdd( event );

		this.unFitEffectLayer = new egret.DisplayObjectContainer;
		this.addChildAt( this.unFitEffectLayer, this.getChildIndex( this.fitEffectLayer ) );
	}

	public getBgColor(){
		if( GameCardUISettings.titleColors ){
			this.bg.filters = [ MatrixTool.colorMatrixPure( GameCardUISettings.cardTitleColor ) ];
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
					if( GameCard.fitEffectNameList[assetName][unfitRules[i]].indexOf( "card_dbline" ) >= 0 || GameCard.fitEffectNameList[assetName][unfitRules[i]].indexOf( "card_line" ) >= 0 ) break;
					else effectImage = Com.addBitmapAt( this.unFitEffectLayer, BingoMachine.getAssetStr( "thin_" + GameCard.fitEffectNameList[assetName][unfitRules[i]] ), 0, 0 );
				}
			}
			else{
				if( GameCard.fitEffectNameList[assetName][0].indexOf( "card_bingo" ) < 0 && GameCard.fitEffectNameList[assetName][0].indexOf( "card_corner" ) < 0 ){
					effectImage = Com.addBitmapAt( this.unFitEffectLayer, BingoMachine.getAssetStr( "thin_" + GameCard.fitEffectNameList[assetName] ), 0, 0 );
				}
			}
		}
		catch( e ){
			trace( "showfitEffect ignore:" + assetName );
		}
	}
}
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
			this.addChildAt( this.unFitEffectLayer, this.getChildIndex( this.fitEffectLayer ) );
		}
	}
}
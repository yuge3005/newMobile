class BlackStarCard extends ExtraBlinkCard{

	private unFitEffectLayer: egret.DisplayObjectContainer;
	private winTx: TextLabel;

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		super.onAdd( event );

		Com.addBitmapAt( this, BingoMachine.getAssetStr( "card_bg03" ), 13, 34 );

		this.unFitEffectLayer = new egret.DisplayObjectContainer;
		this.addChildAt( this.unFitEffectLayer, this.getChildIndex( this.fitEffectLayer ) );

		this.winTx = Com.addLabelAt( this, 395, GameCardUISettings.betTextRect.y, 300, GameCardUISettings.betTextRect.height, GameCardUISettings.betTextRect.height, false, true );
		this.winTx.textColor = 0;
		this.winTx.textAlign = "right";
		this.winTx.scaleX = 0.9;
		this.winTx.setText( "" );
	}

	public showWinCount( winNumber: number ): void{
		this.winTx.setText( "" + winNumber );
	}

	public clearStatus(){
		super.clearStatus();
		this.winTx.setText( "" );
	}

	public getBgColor(){
		if( GameCardUISettings.titleColors ){
			this.bg.filters = [ MatrixTool.colorMatrixPure( GameCardUISettings.titleColors[GameCard.currentBgColorIndex] ) ];
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
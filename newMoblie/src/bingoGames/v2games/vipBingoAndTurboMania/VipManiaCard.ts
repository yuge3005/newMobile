class VipManiaCard extends GameCard{

	private unFitEffectLayer: egret.DisplayObjectContainer;
	private winPaytableAnimationLayer: egret.DisplayObjectContainer;

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		super.onAdd( event );

		this.unFitEffectLayer = new egret.DisplayObjectContainer;
		this.addChildAt( this.unFitEffectLayer, this.getChildIndex( this.fitEffectLayer ) );

		this.winPaytableAnimationLayer = new egret.DisplayObjectContainer;
		this.addChild( this.winPaytableAnimationLayer );
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
			this.winPaytableAnimationLayer.removeChildren();
			this.addChild( this.winPaytableAnimationLayer );
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

	public showPatternAnimation( paytableName: string ){
		this.winPaytableAnimationLayer.removeChildren();
		let ptBitmap: egret.Bitmap;
		if( paytableName == "vip_line" ){
			ptBitmap = Com.addBitmapAtMiddle( this.winPaytableAnimationLayer, BingoMachine.getAssetStr( "partten_linha" ), 331, 142 );
			let checkStr: string = this.getCheckString();
			if( checkStr.substr( 0, 5 ) == "11111" ){
				ptBitmap.y -= CardGridColorAndSizeSettings.gridSpace.y;
			}
			else if( checkStr.substr( 5, 10 ) == "11111" ){
			}
			else if( checkStr.substr( 10, 15 ) == "11111" ){
				ptBitmap.y += CardGridColorAndSizeSettings.gridSpace.y;
			}
			else{
				egret.error( "line paytable error" );
			}
		}
		else if( paytableName == "vip_double_line" ){
			ptBitmap = Com.addBitmapAtMiddle( this.winPaytableAnimationLayer, BingoMachine.getAssetStr( "partten_linha_dupla" ), 331, 142 );
		}
		else if( paytableName == "vip_round" ){
			ptBitmap = Com.addBitmapAtMiddle( this.winPaytableAnimationLayer, BingoMachine.getAssetStr( "partten_quadra" ), 331, 142 );
		}
		else if( paytableName == "vip_bingo" ){
			ptBitmap = Com.addBitmapAtMiddle( this.winPaytableAnimationLayer, BingoMachine.getAssetStr( "partten_bingo" ), 331, 142 );
		}
		
		if( !ptBitmap ) return;

		ptBitmap.scaleX = ptBitmap.scaleY = 0.1;
		ptBitmap.filters = [new egret.DropShadowFilter( 10, 45, 0, 0.7, 10, 10, 1 )];
		let tw: egret.Tween = egret.Tween.get( ptBitmap, { loop: true } );
		tw.to( { scaleX: 0.5, scaleY: 0.5 }, 500 );
		tw.to( { scaleX: 0.2, scaleY: 0.2 }, 500 );
	}

	public showfitEffect( assetName: string, fitIndex: Array<boolean> ){
		if( fitIndex.length ){
			for( let i: number = 0; i < fitIndex.length; i++ ){
				if( fitIndex[i] ) {
					this.removeFork( PayTableManager.payTablesDictionary[assetName].rules[i] );
					this.setGridsToRed( PayTableManager.payTablesDictionary[assetName].rules[i] );
				}
			}
		}
		else{
			this.removeFork( PayTableManager.payTablesDictionary[assetName].rule );
			this.setGridsToRed( PayTableManager.payTablesDictionary[assetName].rule );
		}
		
		if( !GameCard.fitEffectNameList )return;

		try{
			let effectImage: egret.Bitmap;
			if( fitIndex.length ){
				for( let i: number = 0; i< fitIndex.length; i++ ){
					if( fitIndex[i] ){
						if( GameCard.fitEffectNameList[assetName][i] ) effectImage = Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName][i] ), 0, 0 );
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
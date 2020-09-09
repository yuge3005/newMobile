class BonusBingoCard extends GameCard{

    public cardBgLight: egret.Bitmap;
	private luckMultiOnCard: egret.DisplayObjectContainer;
	private winTimesTip: egret.Bitmap;

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

	public showCardMultiTimes( luckMultiTimes: number, cardIndex: number ){
        let luckMultiOnCard: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, luckMultiOnCard, 164, 206 );
        Com.addBitmapAt( luckMultiOnCard, BingoMachine.getAssetStr( "card_center02" ), 0, 0 );
        let tx: egret.TextField = Com.addTextAt( luckMultiOnCard, 0, 0, 50, 20, 20, false, true );
        tx.text = "X" + luckMultiTimes;
        tx.textColor = 0xFFFF00;
        luckMultiOnCard.anchorOffsetX = luckMultiOnCard.width >> 1;
        luckMultiOnCard.anchorOffsetY = luckMultiOnCard.height >> 1;
        luckMultiOnCard.scaleX = luckMultiOnCard.scaleY = 0.1;
        let tw: egret.Tween = egret.Tween.get( luckMultiOnCard );
        tw.to( { scaleX: 2, scaleY: 2 }, 300 );
        tw.to( { scaleX: 1.2, scaleY: 1.2 }, 400, egret.Ease.bounceOut );
        for( let i: number = 0; i < 250; i++ ){
            tw.to( { scaleX: 0.8, scaleY: 0.8 }, 200 );
            tw.to( { scaleX: 1.2, scaleY: 1.2 }, 200 );
        }
        this.luckMultiOnCard = luckMultiOnCard;
    }

	public removeLuckMultiOnCard(){
		if( this.luckMultiOnCard && this.contains( this.luckMultiOnCard ) ) this.removeChild( this.luckMultiOnCard );
	}

	public clearWinTimesTip(){
		if( this.winTimesTip && this.contains( this.winTimesTip ) ){
			this.removeChild( this.winTimesTip );
			this.winTimesTip = null;
		}
	}

	public showWinTimesTip( assetName: string ){
		this.winTimesTip = Com.addBitmapAtMiddle( this, BingoMachine.getAssetStr( assetName ), 164, 205 );
	}
}
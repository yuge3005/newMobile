class PachinkoCard extends ExtraBlinkCard {
    constructor( cardId: number ) {
        super( cardId );
    }

    public set bet( value: number ){
		this.betText.setText( Utils.formatCoinsNumber( value ) );
    }
    
    protected onAdd(event: egret.Event) {
        super.onAdd(event);

		if (this.cardText) this.cardText.setText( MuLang.getText( "bet" ) + ":" );
        if (this.betText) this.betText.textColor = 0xFFFF00;
    }

    public showfitEffect( assetName: string, fitIndex: Array<boolean> ){
        try{
			let effectImage: egret.Bitmap;
			if( fitIndex.length ){
				for( let i: number = 0; i< fitIndex.length; i++ ){
					if( fitIndex[i] ){
						if( GameCard.fitEffectNameList[assetName][i] )effectImage = Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName][i] ), 0, 0 );
						this.setGridsToRed( PayTableManager.payTablesDictionary[assetName].rules[i] );
					}
				}
			}
			else{
				if( GameCard.fitEffectNameList[assetName] )effectImage = Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName] ), 0, 0 );
				this.setGridsToRed( PayTableManager.payTablesDictionary[assetName].rule );
			}
		}
		catch( e ){
			trace( "showfitEffect ignore:" + assetName );
		}
    }
}
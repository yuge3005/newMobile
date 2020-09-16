class PachinkoCard extends ExtraBlinkCard {
    constructor( cardId: number ) {
        super( cardId );
    }

    public set bet( value: number ){
		if (!this.betText) return;
		this.betText.text = Utils.formatCoinsNumber( value );
    }
    
    protected onAdd(event: egret.Event) {
        super.onAdd(event);

        if (this.cardText) this.cardText.text = MuLang.getText( "bet" );
        if (this.betText) this.betText.textColor = 0xFFFF00;
    }

    public showfitEffect( assetName: string, fitIndex: Array<boolean> ){
        try{
			let effectImage: egret.Bitmap;
			if( fitIndex.length ){
				for( let i: number = 0; i< fitIndex.length; i++ ){
					if( fitIndex[i] ){
						if( GameCard.fitEffectNameList[assetName][i] )effectImage = Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName][i] ), 0, 0 );
					}
				}
			}
			else{
				if( GameCard.fitEffectNameList[assetName] )effectImage = Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName] ), 0, 0 );
			}
		}
		catch( e ){
			trace( "showfitEffect ignore:" + assetName );
		}
    }
}
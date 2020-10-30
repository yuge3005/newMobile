class PachinkoCard extends ExtraBlinkCard {

	private winTipTx: TextLabel;
	private winTx: TextLabel;

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

		this.winTipTx = Com.addLabelAt( this, 310, GameCard.cardTextRect.y, GameCard.cardTextRect.width, GameCard.cardTextRect.height, GameCard.cardTextRect.height, false, true );
		this.winTipTx.textColor = GameCardUISettings.texColor;
		this.winTipTx.textAlign = "left";
		this.winTipTx.scaleX = 0.9;
		this.winTipTx.setText( MuLang.getText( "win" ) + ":" );
		this.winTx = Com.addLabelAt( this, 400, GameCard.betTextRect.y, 250, GameCard.betTextRect.height, GameCard.betTextRect.height, false, true );
		this.winTx.textColor = 0xFFFF00;
		this.winTx.textAlign = "left";
		this.winTx.scaleX = 0.9;
		this.winTx.setText( MuLang.getText( "" ) + ": " );
		this.winTx.visible = this.winTipTx.visible = false;
    }

	public showWinCount( winNumber: number ): void{
		if( winNumber > 0 ){
			this.winTx.visible = this.winTipTx.visible = true;
			this.winTx.setText( Utils.formatCoinsNumber( winNumber ) );
		}
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

	public clearStatus(): void{
		super.clearStatus();
		this.winTx.visible = this.winTipTx.visible = false;
	}
}
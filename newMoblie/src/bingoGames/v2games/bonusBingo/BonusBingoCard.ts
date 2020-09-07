class BonusBingoCard extends GameCard{

	public constructor( cardId: number ) {
		super( cardId );
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
}
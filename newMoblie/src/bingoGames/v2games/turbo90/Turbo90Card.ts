class Turbo90Card extends GameCard{

	private titleBg: egret.Bitmap;

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		super.onAdd( event );
		this.titleBg = Com.addBitmapAt( this, BingoMachine.getAssetStr( "CARD_HEADER_BG_white" ), 9, 8 );
		this.addChild( this.cardText );
		this.addChild( this.betText );
	}

	public getBgColor(){
		if( !this.titleBg )return;
		if( GameCard.titleColors ){
			this.titleBg.filters = [ MatrixTool.colorMatrixPure( GameCard.titleColors[GameCard.currentBgColorIndex] ) ];
			// GraphicTool.drawRect( this, new egret.Rectangle( 0, 0, this.bg.width, this.bg.height ), GameCard.titleColors[GameCard.currentBgColorIndex], true, 1, GameCard.bgRound );
		}
	}
}
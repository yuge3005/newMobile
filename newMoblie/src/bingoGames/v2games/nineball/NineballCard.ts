class NineballCard extends GameCard{

	private gridLayer: egret.DisplayObjectContainer;
	private gridMask: egret.Bitmap;

	public constructor( cardId: number ) {
		super( cardId );
	}

	public getNumbers( numbers: Array<number> ){
		super.getNumbers( numbers );

		if( this.gridLayer ) return;
		this.gridLayer = new egret.DisplayObjectContainer;
		for( var i: number = 0; i < numbers.length; i++ ){
			this.gridLayer.addChild( this.grids[i] );
		}
		this.addChild( this.gridLayer );

		var gridMask: egret.Bitmap = Com.addBitmapAt( this, BingoMachine.getAssetStr( "mask" ), 13, 55 );
		this.gridLayer.mask = gridMask;
	}
}
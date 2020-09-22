class SuperGoalPaytableUI extends PaytableUI{

	private ptBg: egret.Bitmap;

	public constructor( useBg: boolean ) {
		super( useBg );
	}

	public initUI(){
		super.initUI();

		this.ptBg = Com.addBitmapAt( this, BingoMachine.getAssetStr( "paytable_bg" ), -8, -8 );
		this.setChildIndex( this.ptBg, 0 );

		for( let i: number = 0; i < 25; i++ ){
			this.grids[i].x = i % 5 * 12;
			this.grids[i].y = Math.floor( i / 5 ) * 12;
			GraphicTool.drawRect( this.grids[i], new egret.Rectangle( 0, 0, 10, 10 ), 0xFFFFFF, true );
		}

		this.tx.y += 5;
	}
}
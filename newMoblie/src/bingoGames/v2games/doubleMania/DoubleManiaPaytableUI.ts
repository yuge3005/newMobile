class DoubleManiaPaytableUI extends PaytableUI{
	public constructor( useBg: boolean ) {
		super( useBg );
	}

	public focus(){
		GraphicTool.drawRect( this, new egret.Rectangle( -1, -1, 94, 48 ), PaytableUI.focusColor, true, 0.0, 0, 2, PaytableUI.focusColor );
	}

	public initUI(){
		super.initUI();

		let width: number = 17.8;
		let height: number = 14;
		for( let i: number = 0; i < 15; i++ ){
			this.grids[i].x = i % 5 * width + 2;
			this.grids[i].y = Math.floor( i / 5 ) * height + 2;
			GraphicTool.drawRect( this.grids[i], new egret.Rectangle( 0, 0, width - 1, height - 1 ), 0, true );
		}
	}
}
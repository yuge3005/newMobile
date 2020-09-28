class BlackStarPaytableUI extends PaytableUI{
	public constructor( useBg: boolean ) {
		super( useBg );
	}

	public initUI(){
		super.initUI();

		this.tx.bold = true;
		for( let i: number = 0; i < this.grids.length; i++ ){
			let row: number = i % 5;
			this.grids[i].x = row * 13 + ( row ? 1 : 0 );
			this.grids[i].y = Math.floor( i / 5 ) * 11;
			GraphicTool.drawRect( this.grids[i], new egret.Rectangle( 0, 0, 10, 8 ), 0xFFFF00, true, 1, 8 );
		}
	}

	public focus(){
		GraphicTool.drawRect( this, new egret.Rectangle( -10, -6, 83, 54 ), PaytableUI.focusColor, true, 0.0, 2, 4, 0xFFFF00 );
		this.tx.textColor = 0xFF0000;
	}
	
	public clearStatus(): void{
		super.clearStatus();
		this.tx.textColor = 0xFFFFFF;
	}

	protected onFrame(event:egret.Event):void{
		this.currentEffect++;

		for( var i: number = 0; i < this.blinkGridsIndexs.length; i++ ){
			let showing: boolean = Boolean( ( this.currentEffect >> 4 ) & 1 );
			this.grids[this.blinkGridsIndexs[i]].alpha = showing ? 1 : 0;
		}
	}
}
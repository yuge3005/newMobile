class SuperGoalPaytableUI extends PaytableUI{

	public constructor( useBg: boolean ) {
		super( useBg );
	}

	public initUI(){
		super.initUI();

		for( let i: number = 0; i < 25; i++ ){
			this.grids[i].x = i % 5 * 12;
			this.grids[i].y = Math.floor( i / 5 ) * 12;
			GraphicTool.drawRect( this.grids[i], new egret.Rectangle( 0, 0, 10, 10 ), 0xFFFF00, true );
		}

		this.tx.y += 8;
	}

	public focus(){
		GraphicTool.drawRect( this, new egret.Rectangle( -8, -8, this.bg.width + 16, this.bg.height + 16 ), PaytableUI.focusColor, true, 0, 10, 5, PaytableUI.focusColor );
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
class PachinkoPaytableUI extends PaytableUI{
	public constructor( useBg: boolean ) {
		super( useBg );
		this.scaleX = this.scaleY = 20 / 23;
	}

	public focus(){
		GraphicTool.drawRect( this, new egret.Rectangle( -5, -5, this.bg.width + 10, this.bg.height + 10 ), PaytableUI.focusColor, true, 0, 10, 5, PaytableUI.focusColor );
		this.tx.textColor = 0xFF0000;
	}

	public initUI(){
		super.initUI();

		for( let i: number = 0; i < 25; i++ ){
			this.grids[i].x = i % 5 * 19 + 1;
			this.grids[i].y = Math.floor( i / 5 ) * 19;
			GraphicTool.drawRect( this.grids[i], new egret.Rectangle( 0, 0, 15, 15 ), 0, true );
		}

		this.tx.y += 5;
	}

	public clearStatus(): void{
		super.clearStatus();
		this.tx.textColor = 0xFFFFFF;
	}

	protected onFrame(event:egret.Event):void{
		this.currentEffect++;
		for( var i: number = 0; i < this.blinkGridsIndexs.length; i++ ){
			// this.grids[this.blinkGridsIndexs[i]].filters = [ this._winEffects[(this.currentEffect>>4)%this._winEffects.length] ];
		}
	}
}
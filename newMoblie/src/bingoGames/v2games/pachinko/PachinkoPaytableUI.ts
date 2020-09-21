class PachinkoPaytableUI extends PaytableUI{

	public payTableName: string;
	public static defaulAlphaFilter = MatrixTool.colorMatrixPure( 0, 0 );

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
			GraphicTool.drawRect( this.grids[i], new egret.Rectangle( 0, 0, 15, 15 ), 0xFFFFFF, true );
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
			let showing: boolean = Boolean( ( this.currentEffect >> 4 ) & 1 );
			if( showing ){
				let showingFilter: egret.Filter;
				if( PachinkoGrid.paytableNumbers[this.payTableName] != null ) {
					let num: number = PachinkoGrid.paytableNumbers[this.payTableName][this.blinkGridsIndexs[i]];
					let index: number = Math.floor( num / 10 );
					showingFilter = new egret.ColorMatrixFilter(PachinkoGrid.gridMatrixs[index]);
				}
				else showingFilter = MatrixTool.colorMatrixPure( 0xFFFF00 );

				this.grids[this.blinkGridsIndexs[i]].filters = [ showingFilter ];
			}
			else{
				this.grids[this.blinkGridsIndexs[i]].filters = [ PachinkoPaytableUI.defaulAlphaFilter ];
			}
		}
	}
}
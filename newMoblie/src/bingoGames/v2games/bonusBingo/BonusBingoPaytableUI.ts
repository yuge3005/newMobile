class BonusBingoPaytableUI extends PaytableUI {

	private effectBg: egret.Bitmap;

	public constructor( useBg: boolean ) {
		super( useBg );

		if( !useBg )throw new Error( "PaytableUIWithBg useBg must be true" );
	}

	public initUI(){
		super.initUI();

		this.drawNormalBg();

		this.effectBg = Com.createBitmapByName( BingoMachine.getAssetStr( "highlight" ) );
		let offset: number = this.effectBg.width - this.bg.width >> 1;
		this.effectBg.x = this.effectBg.y = - offset;
		this.addChildAt( this.effectBg, 0 );
		this.effectBg.visible = false;

		let ar: Array<string> = this.gridRuleString.split( "*" );
		let row: number = parseInt( ar[0] );
		let line: number = parseInt( ar[1] );
		let num: number = row * line;
		let width: number = Math.floor( this.bg.width / row ) - 1;
		let height: number = Math.floor( this.bg.height / line ) - 1;
		this.grids = [];
		for( let i: number = 0; i < num; i++ ){
			this.grids[i] = new egret.Shape;
			this.grids[i].x = i % row * ( width + 1 ) + 1;
			this.grids[i].y = Math.floor( i / row ) * ( height + 1 ) + 1;
			GraphicTool.drawRect( this.grids[i], new egret.Rectangle( 0, 0, width, height ) );
		}
	}

	private drawNormalBg(): void{
		GraphicTool.drawRect( this, new egret.Rectangle( 0, 0, this.bg.width, this.bg.height ), 0xFFFFFF );
	}

	public clearStatus(): void{
		this.blink = false;
		this.effectBg.visible = false;
	}

	public focus(){
		this.addChildAt( this.effectBg, 0 );
		this.effectBg.visible = true;
	}
}
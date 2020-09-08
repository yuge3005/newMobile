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

		let len: number = 68 * 0.2;
		let gap: number = len + 1;
		this.grids = [];
		for( let i: number = 0; i < 25; i++ ){
			this.grids[i] = new egret.Shape;
			this.grids[i].x = i % 5 * gap + 1;
			this.grids[i].y = Math.floor( i / 5 ) * gap + 1;
			GraphicTool.drawRect( this.grids[i], new egret.Rectangle( 0, 0, len, len ) );
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
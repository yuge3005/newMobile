class BingoBenePaytableUI extends PaytableUI {

	public static colorBgName = "pattern_color";
    public static frameBgName = "pattern_frame";
    public static halfBgName = "pattern_half";
	public static offsetPoint: egret.Point = new egret.Point( -15, -10 );

	public static normalColors: Object = { 4: 0x0d4590, 30: 0x14ae00, 80: 0x6f10ab, 120: 0xc71bbd, 250: 0xbb2f0f, 500: 0xdfbb14 } 

	private halfBg: egret.Bitmap;
	private frameBg: egret.Bitmap;
	private colorBg: egret.Bitmap;

	private rulesStep: number = 0;

	public constructor( useBg: boolean ) {
		super( useBg );

		if( !useBg )throw new Error( "PaytableUIWithAnimation useBg must be true" );
	}

	public initUI(){
		super.initUI();

		this.tx.y += 12;

		this.resetBgStatus();
	}

	private addBitmapOnBottom( name: string ): egret.Bitmap{
		let bit: egret.Bitmap = Com.createBitmapByName( BingoMachine.getAssetStr( name ) );
		bit.x = BingoBenePaytableUI.offsetPoint.x;
		bit.y = BingoBenePaytableUI.offsetPoint.y;
		this.addChildAt( bit, 0 );
		return bit;
	}

	private normalStatus(): void{
		this.tx.textColor = 0xFFFFFF;
		this.colorBg.filters = [ MatrixTool.colorMatrixPure( 0 ) ];
		this.halfBg.filters = [ MatrixTool.colorMatrixPure( BingoBenePaytableUI.normalColors[ this._tx ] ) ];
	}

	public clearStatus(): void{
		super.clearStatus();
		this.resetBgStatus();
	}

	private resetBgStatus(): void{
		this.halfBg = this.addBitmapOnBottom( BingoBenePaytableUI.halfBgName );
		this.frameBg = this.addBitmapOnBottom( BingoBenePaytableUI.frameBgName );
		this.colorBg = this.addBitmapOnBottom( BingoBenePaytableUI.colorBgName );
		this.normalStatus();
	}

	public showFit(): void{
		this.colorBg.filters = [ MatrixTool.colorMatrixPure( 0xFFFF00 ) ];
		this.tx.textColor = 0xFF0000;
	}

	protected onFrame(event:egret.Event):void{
		this.currentEffect++;

		for( var i: number = 0; i < this.blinkGridsIndexs.length; i++ ){
			this.grids[this.blinkGridsIndexs[i]].filters = [ this._winEffects[(this.currentEffect>>4)%this._winEffects.length] ];
		}
	}
}
class CopaPaytalbeLayer extends PaytableLayer{
	public constructor() {
		super();

		this.buildFgs();
	}

	protected buildFgs(){
		let greenBg: egret.Bitmap = this.buildScaleBg( "bar_long", 327, 113, 70, 1000 );
		let orangeBg: egret.Bitmap = this.buildScaleBg( "bar_loyalty_point", 1248, 113, 70, 430 );
		let brownBg: egret.Bitmap = this.buildScaleBg( "bar_loyalty_point_write", 1411, 120, 55, 250, 52 );
		let lineBg: egret.Bitmap = this.buildScaleBg( "paytable_prize_bg", 434, 122, 55, 135, 50 );
		let DBLineBg: egret.Bitmap = this.buildScaleBg( "paytable_prize_bg", 707, 122, 55, 135, 50 );
		let bingoBg: egret.Bitmap = this.buildScaleBg( "paytable_prize_bg", 1052, 122, 55, 180, 50 );
    }

	private buildScaleBg( assetsName: string, x: number, y: number, a: number, width: number, height: number = 0 ): egret.Bitmap{
		let bitmap: egret.Bitmap = Com.addBitmapAt( this, BingoMachine.getAssetStr( assetsName ), x, y );
		let len: number = a - 20;
		bitmap.scale9Grid = new egret.Rectangle( 10, 10, len, len );
		bitmap.width = width;
		if( height ) bitmap.height = height;
		return bitmap;
	}
}
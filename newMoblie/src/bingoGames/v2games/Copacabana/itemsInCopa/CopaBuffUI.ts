class CopaBuffUI extends egret.DisplayObjectContainer{

	private bgSp: egret.Bitmap;
	private buffLeftUI: egret.Bitmap;
	private buffLeftOverMaxUI: egret.Bitmap;
	private buffIcon: egret.Bitmap;

	private progressRect: egret.Rectangle = new egret.Rectangle( 120, 45, 212, 16 );

	private iconAssetsName: string;

	public constructor() {
		super();

		this.bgSp = Com.addBitmapAt( this, BingoMachine.getAssetStr( "buff_bg" ), 54, 22 );
		this.bgSp.scale9Grid = new egret.Rectangle( 10, 10, 66, 66 );
		this.bgSp.width = 300;
		this.bgSp.height = 65;
		this.addChild( this.bgSp );

		let blackBg: egret.Bitmap = Com.addBitmapAt( this, BingoMachine.getAssetStr( "buff_progress_bg" ), 120, 45 );
		blackBg.width = 212;

		this.buffLeftUI = Com.addBitmapAt( this, BingoMachine.getAssetStr( "buff_progress" ), 120, 45 );
		this.addChild( this.buffLeftUI );

		this.buffLeftOverMaxUI = Com.addBitmapAt( this, BingoMachine.getAssetStr( "buff_progress" ), 120, 45 );
		this.addChild( this.buffLeftOverMaxUI );
		this.buffLeftOverMaxUI.filters = [ MatrixTool.colorMatrixPure( 0xFF0000 ) ];

		this.cacheAsBitmap = true;
	}

	public setCurrentBuff( bufLeftTurns: number, bufMaxTurns: number, buffId: number ){
        if( bufLeftTurns > bufMaxTurns ){
			this.buffLeftOverMaxUI.visible = true;
			this.buffLeftUI.width = 212;
			this.buffLeftOverMaxUI.width = ( bufLeftTurns - bufMaxTurns ) / bufMaxTurns * 212;
        }
        else{
			this.buffLeftOverMaxUI.visible = false;
			this.buffLeftUI.width = bufLeftTurns / bufMaxTurns * 212;
        }

		this.changeBuffIcon( buffId );
	}

	private changeBuffIcon( buffId: number ){
		let iconAssetsName: string = BingoMachine.getAssetStr( "buff_" + buffId );
		if( this.iconAssetsName == iconAssetsName ) return;

		this.iconAssetsName = iconAssetsName;
		if( this.buffIcon && this.contains( this.buffIcon ) ) this.removeChild( this.buffIcon );
        this.buffIcon = Com.addBitmapAt( this, iconAssetsName, 0, 0 );
        this.buffIcon.scaleX = this.buffIcon.scaleY = 2.7;
	}
}
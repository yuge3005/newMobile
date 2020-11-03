class CopaBuffUI extends egret.DisplayObjectContainer{

	private bgSp: egret.Shape;
	private buffLeftUI: egret.Shape;
	private buffIcon: egret.Bitmap;

	private progressRect: egret.Rectangle = new egret.Rectangle( 120, 45, 212, 16 );

	private iconAssetsName: string;

	public constructor() {
		super();

		this.bgSp = new egret.Shape;
		GraphicTool.drawRect( this.bgSp, new egret.Rectangle( 54, 22, 300, 63 ), 0x3c1b08, false, 1, 10 );
		GraphicTool.drawRect( this.bgSp, this.progressRect );
		this.addChild( this.bgSp );

		this.buffLeftUI = new egret.Shape;
		this.addChild( this.buffLeftUI );

		this.cacheAsBitmap = true;
	}

	public setCurrentBuff( bufLeftTurns: number, bufMaxTurns: number, buffId: number ){
        if( bufLeftTurns > bufMaxTurns ){
            GraphicTool.drawRect( this.buffLeftUI, this.progressRect, 0x7EFC53, true );
            GraphicTool.drawRect( this.buffLeftUI, new egret.Rectangle( 120, 45, Math.floor( ( bufLeftTurns - bufMaxTurns ) / bufMaxTurns * 212 ), 16 ), 0xFF0000 );
        }
        else{
            GraphicTool.drawRect( this.buffLeftUI, new egret.Rectangle( 120, 45, Math.floor( bufLeftTurns / bufMaxTurns * 212 ), 16 ), 0x7EFC53, true );
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
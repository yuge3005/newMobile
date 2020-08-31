class DoubleTurbo90PTBG extends egret.DisplayObjectContainer{

	private rainbow: egret.Bitmap;

	public constructor() {
		super();

		Com.addBitmapAt( this, BingoMachine.getAssetStr( "paytable_frame" ), -20, 0 );
		this.rainbow = Com.addBitmapAtMiddle( this, BingoMachine.getAssetStr( "rainbow" ), 225, 88 );
		this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );
		let msk: egret.Bitmap = Com.addBitmapAt( this, BingoMachine.getAssetStr( "paytable_mask" ), 0, 0 );
		this.rainbow.mask = msk;
		Com.addBitmapAtMiddle( this, BingoMachine.getAssetStr( "paytable_bg" ), 225, 88 );
	}

	private onAdd(event: egret.Event){
		this.rotateAgain();
	}

	private rotateAgain(){
		if( !this.stage )return;
		this.rainbow.rotation = 0;
		TweenerTool.tweenTo( this.rainbow, { rotation: -360 }, 5000, 0, this.rotateAgain.bind( this ) );
	}
}
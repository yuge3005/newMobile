class BlackStarTipStatus extends egret.DisplayObjectContainer{

	private playText: egret.BitmapText;
	private extraTitle: egret.BitmapText;
	private extraText: egret.BitmapText;
	private tipTimer: egret.Timer;

	public constructor() {
		super();

		this.playText = MDS.addBitmapTextAt( this, "Ozone_fnt", 0, -35, "center", 150, 0xFFFF00, 320, 150 );
		this.playText.verticalAlign = "middle";
		this.playText.text = "PLAY";

		this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );

		this.extraTitle = MDS.addBitmapTextAt( this, "Ozone_fnt", 0, 10, "center", 60, 0xE4E4E4, 320, 60 );
		this.extraTitle.verticalAlign = "middle";
		this.extraTitle.text = "EXTRA BALL";
		this.extraTitle.visible = false;

		this.extraText = MDS.addBitmapTextAt( this, "Ozone_fnt", 0, 55, "center", 60, 0xF6352E, 320, 60 );
		this.extraText.verticalAlign = "middle";
		this.extraText.visible = false;

		this.cacheAsBitmap = true;
	}

	private onAdd( event: egret.Event ){
		this.tipTimer = new egret.Timer( 500 );
		this.tipTimer.addEventListener( egret.TimerEvent.TIMER, this.onTimer, this );
		this.tipTimer.start();
		this.addEventListener( egret.Event.REMOVED_FROM_STAGE, this.onRemove, this );
	}

	private onTimer( event: egret.TimerEvent ){
		let bl: boolean = Boolean( this.tipTimer.currentCount & 1 );
		this.playText.filters = [MatrixTool.colorMatrixPure( bl ? 0xFFFF00 : 0x252500 )];
		this.extraTitle.filters = [MatrixTool.colorMatrixPure( bl ? 0xE4E4E4 : 0xF6352E )];
		this.extraText.filters = [MatrixTool.colorMatrixPure( bl ? 0xF6352E : 0xE4E4E4 )];
	}

	public showPlay(){
		this.playText.visible = true;
		this.extraTitle.visible = this.extraText.visible = false;
	}

	public showExtra( price: number ){
		this.playText.visible = false;
		this.extraTitle.visible = this.extraText.visible = true;
		this.extraText.text = Utils.formatCoinsNumber( price ) + " COINS";
	}

	private onRemove( event: egret.Event ){
		this.tipTimer.reset();
		this.tipTimer.stop();
		this.tipTimer.removeEventListener( egret.TimerEvent.TIMER, this.onTimer, this );
		this.removeEventListener( egret.Event.REMOVED_FROM_STAGE, this.onRemove, this );
	}
}
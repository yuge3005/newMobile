class EraDoGeloLineLayer extends PaytableLayer{

	protected blinkingLines: Array<egret.Bitmap>;
	protected blinkingItems: Array<egret.DisplayObject>;
	protected blinkTimer: egret.Timer;

	public constructor() {
		super();

		this.x = LineManager.lineStartPoint.x;
		this.y = LineManager.lineStartPoint.y;
	}

	protected buildFgs(){
		this.paytableFgs = [];
		for( let i: number = 0; i < 20; i++ ){
			this.paytableFgs[i] = this.parent.getChildByName( SlotMachine.getAssetStr( "num_" + ( i + 1 ) ) );
        }
    }

	public addPaytableUI(){
		this.buildFgs();
	}

	// public lineBlink( lines: Array<number> ){
	// 	this.clearPaytablesStatus();
	// 	this.blinkingLines = [];
	// 	this.blinkingItems = [];

	// 	if( lines.length == 0 ) return;
	// 	SoundManager.play( "win_mp3" );

	// 	let pts: Object = LineManager.linesDictionary;
	// 	for( let i: number = 0; i < lines.length; i++ ){
	// 		let pic: egret.Bitmap = this.buildLineUI( lines[i] );
	// 		this.blinkingLines.push( pic );
	// 		this.blinkingItems.push( this.paytableFgs[lines[i]-1] );
	// 		let pt: LineUI = pts[ "p" + lines[i] ];
	// 		this.blinkingItems.push( pt );
	// 	}

	// 	this.blinkTimer = new egret.Timer( 500 );
	// 	this.blinkTimer.addEventListener( egret.TimerEvent.TIMER, this.onBlinkTimer, this );
	// 	this.blinkTimer.start();
	// }

	protected buildLineUI( lineNumber: number ): egret.Bitmap{
		let pic: egret.Bitmap = Com.addBitmapAt( this, "halloween_line_json.line" + lineNumber, 0, LineManager.linePicPositions[ lineNumber - 1 ] );
		pic.scaleX = pic.scaleY = 3;
		return pic;
	}
}
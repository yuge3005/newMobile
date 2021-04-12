class HalloweenLineLayer extends PaytableLayer{

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
			this.paytableFgs[i] = this.parent.getChildByName( SlotMachine.getAssetStr( "G" + ( i + 1 ) ) );
        }
    }

	public addPaytableUI(){
		super.addPaytableUI();

		let pts: Object = LineManager.linesDictionary;
		for( let ob in pts ){
			let pos: Object = pts[ob].position;
			pts[ob].y += 7;
		}

		this.buildFgs();
	}

	public lineBlink( lines: Array<number> ){
		this.clearPaytablesStatus();
		this.blinkingLines = [];
		this.blinkingItems = [];

		let pts: Object = LineManager.linesDictionary;
		for( let i: number = 0; i < lines.length; i++ ){
			let pic: egret.Bitmap = Com.addBitmapAt( this, "halloween_line_json.line" + lines[i], 0, LineManager.linePicPositions[ lines[i] ] );
			pic.scaleX = pic.scaleY = 3;
			this.blinkingLines.push( pic );
			this.blinkingItems.push( this.paytableFgs[lines[i]-1] );
			let pt: LineUI = pts[ "p" + lines[i] ];
			this.blinkingItems.push( pt );
		}

		this.blinkTimer = new egret.Timer( 500 );
		this.blinkTimer.addEventListener( egret.TimerEvent.TIMER, this.onBlinkTimer, this );
		this.blinkTimer.start();
	}

	public clearPaytablesStatus(){
		if( this.blinkingLines ) this.clearBlinkLines();
		if( this.blinkingItems ) this.clearBlinkItems();
		if( this.blinkTimer ) this.stopTimer();
	}

	protected clearBlinkLines(){
		for( let i: number = 0; i < this.blinkingLines.length; i++ ){
			if( this.blinkingLines[i] && this.blinkingLines[i].parent ) this.blinkingLines[i].parent.removeChild( this.blinkingLines[i] );
		}
		this.blinkingLines = null;
	}

	protected clearBlinkItems(){
		for( let i: number = 0; i < this.blinkingItems.length; i++ ){
			this.blinkingItems[i].filters = [];
		}
		this.blinkingItems = null;
	}

	protected stopTimer(){
		this.blinkTimer.stop();
		this.blinkTimer.removeEventListener( egret.TimerEvent.TIMER, this.onBlinkTimer, this );
		this.blinkTimer = null;
	}

	protected onBlinkTimer( event: egret.TimerEvent ){
		let filt: boolean = Boolean( this.blinkTimer.currentCount & 1 );
		for( let i: number = 0; i < this.blinkingItems.length; i++ ){
			if( filt ){
				if( this.paytableFgs.indexOf( this.blinkingItems[i] ) >= 0 ){
					this.blinkingItems[i].filters = [ MatrixTool.colorMatrixPure( 0 ) ];
				}
				else{
					this.blinkingItems[i].filters = [ MatrixTool.colorMatrixPure( 0xFFFFFF ) ];
				}
			}
			else{
				this.blinkingItems[i].filters = [];
			}
		}
	}
}
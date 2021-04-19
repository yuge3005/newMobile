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
			( this.paytableFgs[i] as egret.MovieClip ).gotoAndStop(1);
        }
    }

	public addPaytableUI(){
		this.buildFgs();
	}

	public lineBlink( lines: Array<number> ){
		this.clearPaytablesStatus();
		this.blinkingLines = [];
		this.blinkingItems = [];

		if( lines.length == 0 ) return;
		SoundManager.play( "win_mp3" );

		let pts: Object = LineManager.linesDictionary;
		for( let i: number = 0; i < lines.length; i++ ){
			let pic: egret.Bitmap = this.buildLineUI( lines[i] );
			this.blinkingLines.push( pic );
			this.blinkingItems.push( this.paytableFgs[lines[i]-1] );
			( this.paytableFgs[lines[i]-1] as egret.MovieClip ).gotoAndPlay(1);
		}
	}

	protected buildLineUI( lineNumber: number ): egret.Bitmap{
		let pic: egret.Bitmap = Com.addBitmapAt( this, "eraDoGelo_line_json.line" + lineNumber, 10, LineManager.linePicPositions[ lineNumber - 1 ] - this.y + 2 );
		pic.scaleX = pic.scaleY = 3;
		return pic;
	}

	public clearPaytablesStatus(){
		if( this.blinkingLines ) this.clearBlinkLines();
		if( this.blinkingItems ) this.clearBlinkItems();
	}

	protected clearBlinkLines(){
		for( let i: number = 0; i < this.blinkingLines.length; i++ ){
			if( this.blinkingLines[i] && this.blinkingLines[i].parent ) this.blinkingLines[i].parent.removeChild( this.blinkingLines[i] );
		}
		this.blinkingLines = null;
	}

	protected clearBlinkItems(){
		for( let i: number = 0; i < this.blinkingItems.length; i++ ){
			( this.blinkingItems[i] as egret.MovieClip ).gotoAndStop(1);
		}
		this.blinkingItems = null;
	}
}
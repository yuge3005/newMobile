class HalloweenXLineLayer extends HalloweenLineLayer{

	public constructor() {
		super();
	}

	public addPaytableUI(){
	}

	public lineBlink( lines: Array<number> ){
		this.clearPaytablesStatus();
		this.blinkingLines = [];

		if( lines.length == 0 ) return;
		SoundManager.play( "win_mp3" );

		let pts: Object = LineManager.linesDictionary;
		for( let i: number = 0; i < lines.length; i++ ){
			let pic: egret.Bitmap = this.buildLineUI( lines[i] );
			this.blinkingLines.push( pic );
		}
	}

	protected buildLineUI( lineNumber: number ): egret.Bitmap{
		let pic: egret.Bitmap = Com.addBitmapAt( this, "halloween_line_json.line" + lineNumber, 0, LineManager.linePicPositions[ lineNumber - 1 ] );
		pic.scaleX = pic.scaleY = 3;
		return pic;
	}
}
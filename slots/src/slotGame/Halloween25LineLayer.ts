class Halloween25LineLayer extends HalloweenLineLayer{

	public constructor() {
		super();
	}

	protected buildFgs(){
		this.paytableFgs = [];
		for( let i: number = 0; i < 25; i++ ){
			this.paytableFgs[i] = this.parent.getChildByName( SlotMachine.getAssetStr( "G" + ( i + 1 ) ) );
			this.paytableFgs[i].scaleX = this.paytableFgs[i].scaleY = 0.9;

			let tempX: number = this.paytableFgs[i].x - 333;
			let tempY: number = this.paytableFgs[i].y - 124;
			tempX *= 0.9;
			tempY *= 0.9;
			tempX += 403;
			tempY += 144;

			this.paytableFgs[i].x = Math.floor( tempX );
			this.paytableFgs[i].y = Math.floor( tempY );
        }
    }

	public addPaytableUI(){
		LineManager.getPayTableUI();
		let pts: Object = LineManager.linesDictionary;
		for( let ob in pts ){
			let pos: Object = pts[ob].position;
			pts[ob].x = ( pos["x"] - 330 ) * 0.9 - 1;
			pts[ob].y = ( pos["y"] - 124 ) * 0.9 + 7;
			pts[ob].tx.size = 42;
			this.addChild( pts[ob] );
		}

		this.buildFgs();
	}

	protected buildLineUI( lineNumber: number ): egret.Bitmap{
		let pic: egret.Bitmap;
		if( lineNumber <= 20 ){
			pic = Com.addBitmapAt( this, "halloween_line_json.line" + lineNumber, 0, LineManager.linePicPositions[ lineNumber - 1 ] - 4 - 60 * LineManager.linePicPositions[ lineNumber - 1 ] / 720 );
			pic.scaleX = pic.scaleY = 2.7;
		}
		else{
			pic = Com.addBitmapAt( this, SlotMachine.getAssetStr( lineNumber + "_line" ), LineManager.linePicPositions[ lineNumber - 1 ], 0 );
			pic.height = 760;
		}
		return pic;
	}
}
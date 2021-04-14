class Halloween25LineLayer extends HalloweenLineLayer{

	public constructor() {
		super();
	}

	protected buildFgs(){
		this.paytableFgs = [];
		for( let i: number = 0; i < 25; i++ ){
			this.paytableFgs[i] = this.parent.getChildByName( SlotMachine.getAssetStr( "G" + ( i + 1 ) ) );
        }
    }

	protected buildLineUI( lineNumber: number ): egret.Bitmap{
		if( lineNumber <= 20 )return super.buildLineUI( lineNumber );
		else{
			let pic: egret.Bitmap = Com.addBitmapAt( this, "halloween_line_json.line" + lineNumber, LineManager.linePicPositions[ lineNumber - 1 ], 0 );
			pic.height = 760;
			return pic;
		}
	}
}
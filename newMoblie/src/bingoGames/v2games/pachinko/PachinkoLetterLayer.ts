class PachinkoLetterLayer extends egret.DisplayObjectContainer{

	private pachinkoLetters: Array<egret.Bitmap>;

	public constructor() {
		super();

		this.pachinkoLetters = [];
		for( let i: number = 0; i < 8; i++ ){
            this.pachinkoLetters[i] = Com.addBitmapAt( this, BingoMachine.getAssetStr( "pachinko_letter_" + ( i + 1 ) ), 29 * i + ( i > 4 ? -16 : 0 ), 0 );
        }
	}
}
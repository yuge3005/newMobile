class PachinkoPaytableLayer extends PaytableLayer{
	public constructor() {
		super();
	}

	public addPaytableUI(){
        super.addPaytableUI();

		let pts: Object = PayTableManager.payTablesDictionary;
		let scale: number = 20 / 23;
		for( let payTable in pts ){
			let pos: Object = pts[payTable].position;
			pts[payTable].UI.scaleY = pts[payTable].UI.scaleX = scale;
		}
	}
}
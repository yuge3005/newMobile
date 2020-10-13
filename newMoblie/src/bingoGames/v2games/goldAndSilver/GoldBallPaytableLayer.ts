class GoldBallPaytableLayer extends PaytableLayer{
	public constructor() {
		super();

		this.buildTitleText();
	}

	public addPaytableUI(){
        super.addPaytableUI();

		let pts: Object = PayTableManager.payTablesDictionary;
        for( let payTable in pts ){
			let pos: Object = pts[payTable].position;
            let y: number = pos["y"];
            let tx: egret.TextField = pts[payTable].UI["tx"];
            tx.width = 128;
            tx.textAlign = "right";
		}
	}

	protected buildTitleText(){
		this.goldballText( 54, "bingo" );
		this.goldballText( 115, "double" );
		this.goldballText( 174, "line" );
	}

	private goldballText( yPos: number, text: string ){
		let tx: TextLabel = MDS.addGameText( this, 178, yPos, 36, 0xFFD871, text, false, 200 );
		tx.italic = true;
		tx.setText( tx.text.toUpperCase() );
	}
}
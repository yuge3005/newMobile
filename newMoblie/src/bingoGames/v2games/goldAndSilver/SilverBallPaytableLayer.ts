class SilverBallPaytableLayer extends PaytableLayer{
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
	    let bingo = MDS.addGameText( this, 242, 30, 33, 0xF9CC15, "bingo", false, 170);
        let double = MDS.addGameText( this, 242, 70, 33, 0xF9CC15, "double", false, 170);
        let line = MDS.addGameText( this, 242, 110, 33, 0xF9CC15, "line", false, 170);
	}
}
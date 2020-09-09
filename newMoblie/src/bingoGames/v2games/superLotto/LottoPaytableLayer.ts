class LottoPaytableLayer extends PaytableLayer{
	public constructor() {
		super();

	}

	public addPaytableUI(){
        super.addPaytableUI();

        let pts: Object = PayTableManager.payTablesDictionary;
        for( let payTable in pts ){
			let pos: Object = pts[payTable].position;
            let isSequence: boolean = payTable.indexOf( "se" ) >= 0;
            let y: number = pos["y"] - ( isSequence ? 234 : 382 );
            y = Math.floor( y / 56 );
            y = ( isSequence ? 234 : 382 ) + y * 56 + 32;
			pts[payTable].UI.y = y;
            pts[payTable].UI.x = 1745;
            let tx: egret.TextField = pts[payTable].UI["tx"];
            tx.width = 200;
            tx.textAlign = "right";
		}
    }
}
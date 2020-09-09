class LottoPaytableLayer extends PaytableLayer{

	private anNumbers: Array<TextLabel>;
    private seNumbers: Array<TextLabel>;

	private anBgs: Array<egret.Bitmap>;
    private seBgs: Array<egret.Bitmap>;

	public constructor() {
		super();

		this.addLottoPaytalbeNumbers();
	}

	private addLottoPaytalbeNumbers(){
        this.anNumbers = [];
        this.anBgs = [];
        for( let i: number = 0; i < 4; i++ ){
            this.anBgs[i] = Com.addBitmapAt( this, BingoMachine.getAssetStr( "any_light" ), 1587, 793 - 56 * i );
            this.anBgs[i].visible = false;
            this.anNumbers[i] = MDS.addGameTextCenterShadow( this, 1618, 799 - 56 * i, 40, 0xE518FD, "sequence", false, 45, false, false );
            this.anNumbers[i].setText( "" + ( i + 2 ) );
        }
        this.seNumbers = [];
        this.seBgs = [];
        for( let i: number = 0; i < 6; i++ ){
            this.seBgs[i] = Com.addBitmapAt( this, BingoMachine.getAssetStr( "sequence_light" ), 1587, 478 - 56 * i );
            this.seBgs[i].visible = false;
            this.seNumbers[i] = MDS.addGameTextCenterShadow( this, 1618, 484 - 56 * i, 40, 0x18A4FD, "sequence", false, 45, false, false );
            this.seNumbers[i].setText( "" + ( i + 1 ) );
        }
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

	public showPaytableBg( isSequence, itemIndex ){
        let i: number = itemIndex - ( isSequence ? 1 : 2 );
        let bg: egret.Bitmap = isSequence ? this.seBgs[i] : this.anBgs[i];
        bg.visible = true;
        let tx: egret.TextField = isSequence ? this.seNumbers[i] : this.anNumbers[i];
        tx.textColor = isSequence ? 0xFAFF32 : 0xFAFF32;
        tx.stroke = 1.5;
    }

	public clearPaytableFgs(){
        for( let i: number = 0; i < 4; i++ ){
            this.anBgs[i].visible = false;
            this.anNumbers[i].textColor = 0xE518FD;
            this.anNumbers[i].stroke = 0;
        }
        for( let i: number = 0; i < 6; i++ ){
            this.seBgs[i].visible = false;
            this.seNumbers[i].textColor = 0x18A4FD;
            this.seNumbers[i].stroke = 0;
        }
    }
}
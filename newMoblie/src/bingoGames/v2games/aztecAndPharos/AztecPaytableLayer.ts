class AztecPaytableLayer extends PaytableLayer{

    protected pharosPattenTexts: Array<TextLabel>;
    protected pharosPattenBlickCount: Array<number>;



	public constructor() {
		super();

		this.buildTitleText();
	}

	protected buildTitleText(){
		let pattenNames: Array<string> = ["bingo", "three side", "two side", "one side" ];

		this.pharosPattenTexts = [];
        for( let i: number = 0; i < pattenNames.length; i++ ){
            this.pharosPattenTexts[i] = MDS.addGameText( this, 90, 578 + i * 50, 35, 0xFFD162, pattenNames[i], false, 200, "", 0.9 );
            this.pharosPattenTexts[i].stroke = 2;
            this.pharosPattenTexts[i].strokeColor = 0;
        }
	}

	public addPaytableUI(){
        super.addPaytableUI();

		let pts: Object = PayTableManager.payTablesDictionary;
        for( let payTable in pts ){
			let pos: Object = pts[payTable].position;
            pts[payTable].UI.addEventListener( "paytableFitEvent", this.payTableFit, this );
            let tx: egret.TextField = pts[payTable].UI["tx"];
            tx.width = 120;
            tx.textAlign = "right";
            tx.stroke = 2;
            tx.strokeColor = 0;
		}
	}

	protected payTableFit( event: egret.Event ){
        let str: string = event.target["tx"].text;
        if( !this.pharosPattenBlickCount ) this.pharosPattenBlickCount = [];
        if( str == "x1000" ) this.pharosPattenBlickCount[0] = 0;
        else if( str == "x200" ) this.pharosPattenBlickCount[1] = 0;
        else if( str == "x70" ) this.pharosPattenBlickCount[2] = 0;
        else if( str == "x3" ) this.pharosPattenBlickCount[3] = 0;
        this.addEventListener( egret.Event.ENTER_FRAME, this.onPaytableBlink, this );
    }

	public clearPaytableFgs(){
        for( let i: number = 0; i < 4; i++ ){
            this.pharosPattenTexts[i].textColor = 0xFFD162;
        }
        this.pharosPattenBlickCount = null;
        this.removeEventListener( egret.Event.ENTER_FRAME, this.onPaytableBlink, this );
    }

	protected onPaytableBlink( egret: egret.Event ){
        for( let i: number = 0; i < 4; i++ ){
            if( isNaN( this.pharosPattenBlickCount[i] ) ) continue;
            this.pharosPattenBlickCount[i] ++;
            if( (this.pharosPattenBlickCount[i]>>4) % 2 ){
                this.pharosPattenTexts[i].textColor = 0xFFD162;
            }
            else{
                this.pharosPattenTexts[i].textColor = 0xFF0000;
            }
        }
    }
}
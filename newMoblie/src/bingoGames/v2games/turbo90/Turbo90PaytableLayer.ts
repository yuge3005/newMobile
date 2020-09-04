class Turbo90PaytableLayer extends PaytableLayer{
	public constructor() {
		super();

		this.x = 938;
		this.y = 364;
		
        this.buildFgs();
        this.buildTitleText();
	}

    protected buildFgs(){
		this.paytableFgs = [];
        for( let i: number = 0; i < 4; i++ ){
            this.paytableFgs[i] = Com.addBitmapAt( this, BingoMachine.getAssetStr("paytable_fg"), 0, -8 + 130 * i );
            this.paytableFgs[i].visible = false;
        }
        let winBgMask: egret.Bitmap = Com.addBitmapAt( this, BingoMachine.getAssetStr("paytable_bg"), 0, 0 );
        this.mask = winBgMask;
    }

    protected buildTitleText(){
        this.turbo90Text( "bingo", 395 );
        this.turbo90Text( "double line", 525 );
        this.turbo90Text( "line", 655 );
        this.turbo90Text( "four corners", 785 );
    }

    private turbo90Text( str: string, yPos: number ): egret.TextField{
        let tx: TextLabel = Com.addLabelAt( this, 957 - this.x, yPos - this.y, 166, 35, 35, true, false );
        tx.textColor = 0xECFFAC;
        tx.bold = true;
        tx.stroke = 2;
        tx.strokeColor = 0x213510;
        tx.setText( MuLang.getText(str) );
        return tx;
    }

    public addPaytableUI(){
        super.addPaytableUI();

        let pts: Object = PayTableManager.payTablesDictionary;
        for( let payTable in pts ){
			let pos: Object = pts[payTable].position;
            let y: number = pos["y"];
            y = Math.floor( y / 130 ) * 130 + 40;
			pts[payTable].UI.y = y - this.y;
            pts[payTable].UI.x = 957 - this.x;
            pts[payTable].UI.addEventListener( "paytableFitEvent", this.payTableFit, this );
            let tx: egret.TextField = pts[payTable].UI["tx"];
            tx.width = 166;
            tx.textAlign = "center";
            tx.stroke = 1;
            tx.strokeColor = 0;
		}
    }

    private payTableFit( event: egret.Event ){
        let str: string = event.target["tx"].text;
        if( str == "x1000" ) this.paytableFgs[0].visible = true;
        else if( str == "x100" ) this.paytableFgs[1].visible = true;
        else if( str == "x4" ) this.paytableFgs[2].visible = true;
        else if( str == "x1" ) this.paytableFgs[3].visible = true;
    }

    public clearPaytableFgs(){
        for( let i: number = 0; i < 4; i++ ){
            this.paytableFgs[i].visible = false;
        }
    }
}
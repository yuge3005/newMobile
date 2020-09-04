class NineballPaytableLayer extends PaytableLayer{
	public constructor() {
		super();

		this.x = 896;
		this.y = 360;
		
        this.buildFgs();
        this.buildTitleText();
	}

	protected buildFgs(){
		this.paytableFgs = [];
        for( let i: number = 0; i < 3; i++ ){
            this.paytableFgs[i] = Com.addBitmapAt( this, BingoMachine.getAssetStr("paytable_fg"), 5, 6 + 173 * i );
			this.paytableFgs[i].scaleX = this.paytableFgs[i].scaleY = 196 / 249;
            this.paytableFgs[i].visible = false;
        }
        let winBgMask: egret.Bitmap = Com.addBitmapAt( this, BingoMachine.getAssetStr("paytable_bg"), 0, 0 );
        this.mask = winBgMask;
    }

	protected buildTitleText(){
	    this.nineballText( "bingo", 420 );
        this.nineballText( "double", 590 );
        this.nineballText( "line", 760 );
	}

	private nineballText( str: string, yPos: number ): egret.TextField{
        let tx: TextLabel = Com.addLabelAt( this, 900 - this.x, yPos - this.y, 200, 35, 35, true, false );
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
            y = Math.floor( y / 170 ) * 170 + 120;
			pts[payTable].UI.y = y - this.y;
            pts[payTable].UI.x = 912 - this.x;
            pts[payTable].UI.addEventListener( "paytableFitEvent", this.payTableFit, this );
            let tx: egret.TextField = pts[payTable].UI["tx"];
            tx.width = 172;
            tx.textAlign = "center";
            tx.stroke = 1;
            tx.strokeColor = 0;
		}
    }

	protected payTableFit( event: egret.Event ){
        let str: string = event.target["tx"].text;
        if( str == "x1000" ) this.paytableFgs[0].visible = true;
        else if( str == "x100" ) this.paytableFgs[1].visible = true;
        else if( str == "x4" ) this.paytableFgs[2].visible = true;
    }

	public clearPaytableFgs(){
        for( let i: number = 0; i < this.paytableFgs.length; i++ ){
            this.paytableFgs[i].visible = false;
        }
    }
}
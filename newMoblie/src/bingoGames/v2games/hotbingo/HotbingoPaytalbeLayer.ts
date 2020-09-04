class HotbingoPaytalbeLayer extends PaytableLayer{
	public constructor() {
		super();

		this.x = 1295;
		this.y = 41;

		this.buildFgs();
        this.buildTitleText();
	}

	protected buildFgs(){
		this.paytableFgs = [];
        for( let i: number = 0; i < 4; i++ ){
			this.paytableFgs[i] = new HotbingoPaytableBg(i);
            Com.addObjectAt( this, this.paytableFgs[i], 4, 2 + 34 * i );
        }
    }

	protected buildTitleText(){
		let i: number = 0;
		let firstY: number = 7;
		this.hotbingoText( firstY + 34 * i++, "bingo" );
		this.hotbingoText( firstY + 34 * i++, "double line" );
		this.hotbingoText( firstY + 34 * i++, "line" );
		this.hotbingoText( firstY + 34 * i++, "four corners" );
	}

	private hotbingoText( yPos: number, textItem: string ){
		let tx: TextLabel = MDS.addGameText( this, 15, yPos, 30, 0x001D65, textItem, false, 300, "", 1 );
		tx.fontFamily = "Arail";
		tx.bold = true;
	}

	public addPaytableUI(){
        super.addPaytableUI();

        let pts: Object = PayTableManager.payTablesDictionary;
        for( let payTable in pts ){
			let pos: Object = pts[payTable].position;
            let y: number = pos["y"];
            y = Math.floor( y / 34 ) * 34 + 15;
			pts[payTable].UI.y = y - this.y;
            pts[payTable].UI.x = 1658 - this.x;
            pts[payTable].UI.addEventListener( "paytableFitEvent", this.payTableFit, this );
            let tx: egret.TextField = pts[payTable].UI["tx"];
            tx.width = 84;
            tx.textAlign = "right";
		}
    }

	protected payTableFit( event: egret.Event ){
        let str: string = event.target["tx"].text;
        if( str == "x1000" ) ( this.paytableFgs[0] as HotbingoPaytableBg ).fit = true;
        else if( str == "x100" ) ( this.paytableFgs[1] as HotbingoPaytableBg ).fit = true;
        else if( str == "x4" ) ( this.paytableFgs[2] as HotbingoPaytableBg ).fit = true;
        else if( str == "x1" ) ( this.paytableFgs[3] as HotbingoPaytableBg ).fit = true;
    }

	public clearPaytableFgs(){
        for( let i: number = 0; i < this.paytableFgs.length; i++ ){
            ( this.paytableFgs[i] as HotbingoPaytableBg ).fit = false;
        }
    }
}
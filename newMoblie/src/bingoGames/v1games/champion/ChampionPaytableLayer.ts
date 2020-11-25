class ChampionPaytableLayer extends PaytableLayer{
	public constructor() {
		super();

		this.x = 1724;
		this.y = 125;
		
        this.buildFgs();
        this.buildTitleText();
	}

	protected buildFgs(){
		this.paytableFgs = [];
		let pts: Array<Array<number>> = [ [45, 28], [123, 42], [200,45], [280,42], [357,43], [434,45], [514,43], [592,42] ];
        for( let i: number = 0; i < 8; i++ ){
            this.paytableFgs[i] = Com.addMovieClipAt( this, MDS.mcFactory, "paytable_fg", 17, pts[i][0] );
            this.paytableFgs[i].height = pts[i][1];
            this.paytableFgs[i].visible = false;
        }
    }

	protected buildTitleText(){
		this.chamoionText( 140 - this.y, "bingo" );
        this.chamoionText( 218 - this.y, "4 lines" );
        this.chamoionText( 296 - this.y, "perimeter" );
        this.chamoionText( 374 - this.y, "3 lines" );
		this.chamoionText( 452 - this.y, "letterXT" );
		this.chamoionText( 530 - this.y, "2 lines" );
		this.chamoionText( 608 - this.y, "4 corners" );
		this.chamoionText( 686 - this.y, "diagonal" );
    }

    private chamoionText( yPos: number, tx: string ){
        let lb: TextLabel = MDS.addGameText( this, 20, yPos, 30, 0x8DDAFF, tx, false, 225, "", 1 );
        lb.fontFamily = "Arial";
        lb.bold = true;
        lb.textAlign = "center";
    }

	public addPaytableUI(){
        super.addPaytableUI();

        let pts: Object = PayTableManager.payTablesDictionary;
        for( let payTable in pts ){
			let pos: Object = pts[payTable].position;
            pts[payTable].UI.addEventListener( "paytableFitEvent", this.payTableFit, this );
            let tx: egret.TextField = pts[payTable].UI["tx"];
            tx.width = 115;
            tx.textAlign = "right";
		}
    }

	protected payTableFit( event: egret.Event ){
        let str: string = event.target["tx"].text;
		let index: number = Math.floor( event.target.y / 80 );
        this.paytableFgs[index].visible = true;
    }

	public clearPaytableFgs(){
        for( let i: number = 0; i < 8; i++ ){
            this.paytableFgs[i].visible = false;
        }
    }
}
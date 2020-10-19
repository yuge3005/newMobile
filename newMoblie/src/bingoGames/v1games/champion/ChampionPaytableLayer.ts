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
		// this.addGameText( 700, 74, 15, 0x46C8F5, "bingo",false, 200 );
        // this.addGameText( 700, 130, 15, 0x46C8F5, "4 lines",false, 200 );
        // this.addGameText( 700, 183, 15, 0x46C8F5, "perimeter",false, 200 );
        // this.addGameText( 700, 238, 15, 0x46C8F5, "3 lines",false, 200 );
		// this.addGameText( 700, 292, 15, 0x46C8F5, "letterXT",false, 200 );
		// this.addGameText( 700, 346, 15, 0x46C8F5, "2 lines",false, 200 );
		// this.addGameText( 700, 400, 15, 0x46C8F5, "4 corners",false, 200 );
		// this.addGameText( 700, 455, 15, 0x46C8F5, "diagonal",false, 200 );
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
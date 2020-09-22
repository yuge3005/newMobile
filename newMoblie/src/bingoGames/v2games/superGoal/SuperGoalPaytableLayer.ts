class SuperGoalPaytableLayer extends PaytableLayer{

	private pachinkoPaytableList: Object;

	public constructor() {
		super();

		this.x = 755;
		this.y = 700;

		let ptBg: egret.Bitmap = Com.addBitmapAt( this, BingoMachine.getAssetStr( "paytable_bg_02" ), 0, 0 );
        ptBg.scale9Grid = new egret.Rectangle( 10, 10, 40, 40 );
        ptBg.width = 492;
        ptBg.height = 200;

		this.buildFgs();
	}

	protected buildFgs(){
		this.paytableFgs = [];
        for( let i: number = 0; i < 12; i++ ){
			this.paytableFgs[i] = Com.addBitmapAt( this, BingoMachine.getAssetStr("paytable_bg"), 773 + i % 6 * 79 - 8 - this.x, ( i >= 6 ? 809 : 712 ) - 8 - this.y );
			this.setChildIndex( this.paytableFgs[i], 0 );
        }
    }

	public addPaytableUI(){
		super.addPaytableUI();

		this.pachinkoPaytableList = {};

		let supergoalStr: string = SuperGoal.supergoalString;
        for( let i: number = 0; i < supergoalStr.length; i++ ){
			let tpName: string = "pachinko" + "_" + supergoalStr[i]
            this.pachinkoPaytableList[supergoalStr[i]] = PayTableManager.payTablesDictionary[ tpName ];
            this.removeChild( this.pachinkoPaytableList[supergoalStr[i]].ui );
			this.deletePaytableFromDictionary( tpName );
        }
	}

	private removeCurrentLetter(){
		let supergoalStr: string = SuperGoal.supergoalString;
		for( let i: number = 0; i < supergoalStr.length; i++ ){
			let letter: string = supergoalStr[i];
			if( this.contains( this.pachinkoPaytableList[letter].ui ) ){
				this.removeChild( this.pachinkoPaytableList[letter].ui );
				this.deletePaytableFromDictionary( "pachinko" + "_" + letter );
			}
		}
	}

	private deletePaytableFromDictionary( ptName: string ){
		PayTableManager.payTablesDictionary[ ptName ] = null;
		delete PayTableManager.payTablesDictionary[ ptName ];
	}

	public addCurrentPaytable( letterIndex: number ){
		this.removeCurrentLetter();
		let supergoalStr: string = SuperGoal.supergoalString;
		let letter: string = supergoalStr[letterIndex];

		PayTableManager.payTablesDictionary[ "pachinko" + "_" + letter ] = this.pachinkoPaytableList[letter];
        this.addChild( this.pachinkoPaytableList[letter].ui );
	}
}
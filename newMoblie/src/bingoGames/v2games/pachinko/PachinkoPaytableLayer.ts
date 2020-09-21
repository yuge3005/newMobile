class PachinkoPaytableLayer extends PaytableLayer{

	private pachinkoPaytableList: Object;

	public constructor() {
		super();
	}

	public addPaytableUI(){
		super.addPaytableUI();

		let pts: Object = PayTableManager.payTablesDictionary;
		for( let ob in pts ){
			pts[ob].UI.payTableName = pts[ob].payTableName;
		}

		this.pachinkoPaytableList = {};

		let pachinkoStr: string = Pachinko.pachinkoString;
        for( let i: number = 0; i < pachinkoStr.length; i++ ){
			let tpName: string = pachinkoStr + "_" + pachinkoStr[i]
            this.pachinkoPaytableList[pachinkoStr[i]] = PayTableManager.payTablesDictionary[ tpName ];
            this.removeChild( this.pachinkoPaytableList[pachinkoStr[i]].ui );
			this.deletePaytableFromDictionary( tpName );
        }
	}

	private removeCurrentLetter(){
		let pachinkoStr: string = Pachinko.pachinkoString;
		for( let i: number = 0; i < pachinkoStr.length; i++ ){
			let letter: string = pachinkoStr[i];
			if( this.contains( this.pachinkoPaytableList[letter].ui ) ){
				this.removeChild( this.pachinkoPaytableList[letter].ui );
				this.deletePaytableFromDictionary( pachinkoStr + "_" + letter );
			}
		}
	}

	private deletePaytableFromDictionary( ptName: string ){
		PayTableManager.payTablesDictionary[ ptName ] = null;
		delete PayTableManager.payTablesDictionary[ ptName ];
	}

	public addCurrentPaytable( letterIndex: number ){
		this.removeCurrentLetter();
		let pachinkoStr: string = Pachinko.pachinkoString;
		let letter: string = pachinkoStr[letterIndex];

		PayTableManager.payTablesDictionary[ pachinkoStr + "_" + letter ] = this.pachinkoPaytableList[letter];
        this.addChild( this.pachinkoPaytableList[letter].ui );
	}
}
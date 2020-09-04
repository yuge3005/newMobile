class PaytableLayer extends egret.DisplayObjectContainer{

	protected paytableFgs: Array<egret.DisplayObject>;

	public constructor() {
		super();
	}

	public addPaytableUI(){
		PayTableManager.getPayTableUI();
		let pts: Object = PayTableManager.payTablesDictionary;
		for( let ob in pts ){
			this.addChild( pts[ob].UI );
		}

		for( let payTable in PayTableManager.payTablesDictionary ){
			let pos: Object = PayTableManager.payTablesDictionary[payTable].position;
			pts[payTable].UI.x = pos["x"] - this.x;
			pts[payTable].UI.y = pos["y"] - this.y;
		}
	}

	public clearPaytableFgs(){
        //sub class override
    }

	protected buildFgs(){
		//sub class override
	}

	protected buildTitleText(){
		//sub class override
	}
}
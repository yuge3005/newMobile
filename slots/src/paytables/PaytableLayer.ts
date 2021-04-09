class PaytableLayer extends egret.DisplayObjectContainer{

	protected paytableFgs: Array<egret.DisplayObject>;

	public constructor() {
		super();

		this.cacheAsBitmap = true;
	}

	public addPaytableUI(){
		LineManager.getPayTableUI();
		let pts: Object = LineManager.linesDictionary;
		for( let ob in pts ){
			let pos: Object = pts[ob].position;
			pts[ob].UI.x = pos["x"] - this.x;
			pts[ob].UI.y = pos["y"] - this.y;
			this.addChild( pts[ob].UI );
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

	protected payTableFit( event: egret.Event ){
		//sub class override
	}
}
class PaytableLayer extends egret.DisplayObjectContainer{
	public constructor() {
		super();

		let pts: Object = PayTableManager.payTablesDictionary;
		for( let ob in pts ){
			this.addChild( pts[ob].UI );
		}

		for( let payTable in PayTableManager.payTablesDictionary ){
			let pos: Object = PayTableManager.payTablesDictionary[payTable].position;
			pts[payTable].UI.x = pos["x"];
			pts[payTable].UI.y = pos["y"];
		}
	}
}
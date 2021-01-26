class FreeCardUI extends egret.DisplayObjectContainer{

	public static freeCardCount: number;

	protected countTx: TextLabel;

	public constructor() {
		super();
	}

	public setFreeCardCount( count: number ){
		this.countTx.setText( "X " + count );
	}
}
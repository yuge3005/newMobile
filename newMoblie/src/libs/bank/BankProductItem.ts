class BankProductItem extends egret.DisplayObjectContainer{

	public hash: string;

	public constructor() {
		super();

		this.touchChildren = false;
		this.touchEnabled = true;
	}
}
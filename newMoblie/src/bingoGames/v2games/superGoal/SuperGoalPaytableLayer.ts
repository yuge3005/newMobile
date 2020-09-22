class SuperGoalPaytableLayer extends PaytableLayer{
	public constructor() {
		super();

		this.buildFgs();
	}

	protected buildFgs(){
		this.paytableFgs = [];
        for( let i: number = 0; i < 12; i++ ){
			this.paytableFgs[i] = Com.addBitmapAt( this, BingoMachine.getAssetStr("paytable_bg"), 773 + i % 6 * 79 - 8, ( i >= 6 ? 809 : 712 ) - 8 );
			this.setChildIndex( this.paytableFgs[i], 0 );
        }
    }
}
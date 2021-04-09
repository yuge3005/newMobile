class HalloweenLineLayer extends PaytableLayer{

	public constructor() {
		super();
	}

	protected buildFgs(){
		this.paytableFgs = [];
		for( let i: number = 0; i < 20; i++ ){
			this.paytableFgs[i] = this.parent.getChildByName( SlotMachine.getAssetStr( "" + ( i + 1 ) ) );
        }
    }

	public addPaytableUI(){
		super.addPaytableUI();

		let pts: Object = LineManager.linesDictionary;
		for( let ob in pts ){
			let pos: Object = pts[ob].position;
			pts[ob].y += 7;
		}

		this.buildFgs();
	}
}
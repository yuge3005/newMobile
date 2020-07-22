class LottoGrid extends CardGrid{
	public constructor() {
		super();
	}

	public showRedEffect(){
		this.numTxt.textColor = 0xFEFE00;
		this.redrawBg( 0x2D87CF );
	}
}
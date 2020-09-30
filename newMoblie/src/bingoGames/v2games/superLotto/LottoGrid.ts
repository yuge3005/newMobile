class LottoGrid extends TowerGrid{
	public constructor() {
		super();
	}

	public showRedEffect(){
		this.numTxt.textColor = 0xFEFE00;
		this.currentBgPic = this.linePic;
	}
}
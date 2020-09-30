class LottoGrid extends TowerGrid{

	public get blink(): boolean{
		return this._blink;
	}
	public set blink( value: boolean ){
		if( this._blink == value )return;
		this._blink = value;
		if( !value )this.currentBgPic = this.defaultBgPic;
		else this.numTxt.textColor = CardGrid.numberColor;
	}

	public constructor() {
		super();
	}

	public showRedEffect(){
		this.numTxt.textColor = 0xFEFE00;
		this.currentBgPic = this.linePic;
	}
}
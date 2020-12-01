class BlackoutGrid extends Multi75Grid{

	public constructor() {
		super();

		this.blinkTextSizeMin = 22;
		this.blinkTextSizeMax = 22;
	}

	public showEffect( isShow: boolean ){
		if( this.blink )this.blink = false;
		this._isChecked = isShow;
		if( !isShow ){
			this.numTxt.textColor = MultiPlayerGrid.numberColor;
			this.currentBgPic = this.defaultBgPic;
		}
	}
}
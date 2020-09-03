class ExtraBlinkGrid extends TowerGrid{

	public static extraBink: boolean;

	public get blink(): boolean{
		return this._blink;
	}
	public set blink( value: boolean ){
		if( this._blink == value )return;
		this._blink = value;
		if( !value ){
			this.currentBgPic = this.defaultBgPic;
			this.extraBinkSp.visible = false;
		}
		else this.numTxt.textColor = CardGrid.numberColorOnEffect;
	}

	protected extraBlinkNumTxt: egret.TextField;
	protected extraBinkSp: egret.DisplayObjectContainer;

	public set extraBlinkNumber( value: number ){
		this.extraBlinkNumTxt.text = "" + value;
	}

	public constructor() {
		super();

		this.buildExtraBlinkSp();
		this.buildSmallWinText();
	}

	protected buildExtraBlinkSp(){
		this.extraBinkSp = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.extraBinkSp, 0, 0 );
		Com.addObjectAt( this.extraBinkSp, this.getBlinkBg(), 0, 0 );
		this.extraBinkSp.visible = false;
	}

	protected buildSmallWinText(){
		//sub class override
	}

	protected getBlinkBg(): egret.Bitmap{
		return null;
	}

	public setSmallTime( winTimes: number ): void{
		if( !winTimes ){
			this.blink = false;
			return;
		}
		this.smallWinTimesText.text = "x" + winTimes;
	}

	public showBlink( isShow: boolean ): void{
		if( ExtraBlinkGrid.extraBink ){
			this.currentBgPic = this.defaultBgPic;
			this.extraBinkSp.visible = isShow;
		}
		else{
			super.showBlink( isShow );
			this.extraBinkSp.visible = false;
		}
		this.numTxt.textColor = CardGrid.numberColor;
	}
}
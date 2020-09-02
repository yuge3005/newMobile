class Pachinko2Grid extends TowerGrid{

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
	private extraBinkSp: egret.DisplayObjectContainer;

	public set extraBlinkNumber( value: number ){
		this.extraBlinkNumTxt.text = "" + value;
	}

	public constructor() {
		super();

		this.extraBinkSp = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.extraBinkSp, 0, 0 );
		Com.addObjectAt( this.extraBinkSp, this.linePic, 0, 0 )
		this.extraBlinkNumTxt = Com.addLabelAt( this.extraBinkSp, 0, 3, CardGrid.gridSize.x, 30, 30, false, true );
		this.smallWinTimesText = Com.addLabelAt( this.extraBinkSp, 0, 30, CardGrid.gridSize.x, 40, 35 );
		this.smallWinTimesText.textColor = 0xFFFF00;
		this.extraBinkSp.visible = false;
	}

	public setSmallTime( winTimes: number ): void{
		if( !winTimes ){
			this.blink = false;
			return;
		}
		this.smallWinTimesText.text = "x" + winTimes;
	}

	public showBlink( isShow: boolean ): void{
		if( Pachinko2Grid.extraBink ){
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
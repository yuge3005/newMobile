class PrakarambaGrid extends ExtraBlinkGrid{

	private blinkGridBg: egret.MovieClip;

	private waveMc: egret.MovieClip;

	public constructor() {
		super();

		this.waveMc = Com.addMovieClipAt( this, MDS.mcFactory, "prakarambaGridRed", 0, 0 );
		this.waveMc.visible = false;
	}

	protected getBlinkBg(): egret.MovieClip{
		this.blinkGridBg = Com.addMovieClipAt( this, MDS.mcFactory, "prakarambaGridBlink", 0, 0 );
		return this.blinkGridBg;
	}

	protected buildSmallWinText(){
		this.extraBlinkNumTxt = MDS.addBitmapTextAt( this.extraBinkSp, "Arial Black_fnt", 0, - CardGridColorAndSizeSettings.defaultNumberSize * 0.125, "center", CardGridColorAndSizeSettings.defaultNumberSize, CardGridColorAndSizeSettings.numberColor, CardGridColorAndSizeSettings.gridSize.x, CardGridColorAndSizeSettings.gridSize.y );
		this.smallWinTimesText = Com.addLabelAt( this.extraBinkSp, 5, 55, CardGridColorAndSizeSettings.gridSize.x - 5, 11, 11 );
		this.smallWinTimesText.textColor = 0;
		this.smallWinTimesText.textAlign = "left";
	}

	public showBlink( isShow: boolean ): void{
		this.extraBinkSp.visible = true;
		this.blinkGridBg.gotoAndPlay( 1 );
	}

	public setSmallTime( winTimes: number ): void{
		if( !winTimes ){
			this.blink = false;
			return;
		}
		this.smallWinTimesText.text = "" + winTimes * GameData.currentBet;
	}

	public showWaveEffect( delay: number ): void{
		this.waveMc.visible = true;
		this.waveMc.gotoAndPlay(1);
		this.addChildAt( this.numTxt, this.getChildIndex( this.waveMc ) + 1 );

		setTimeout( this.removeWaveMc.bind(this), 1000 );
	}

	private removeWaveMc(){
		if( this.waveMc.visible ) this.waveMc.visible = false;
	}
}
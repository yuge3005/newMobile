class PrakarambaGrid extends ExtraBlinkGrid{

	private blinkGridBg: egret.MovieClip;

	public constructor() {
		super();
	}

	protected getBlinkBg(): egret.MovieClip{
		this.blinkGridBg = Com.addMovieClipAt( this, MDS.mcFactory, "prakarambaGridBlink", 0, 0 );
		return this.blinkGridBg;
	}

	protected buildSmallWinText(){
		this.extraBlinkNumTxt = MDS.addBitmapTextAt( this, "Arial Black_fnt", 0, - CardGrid.defaultNumberSize * 0.125, "center", CardGrid.defaultNumberSize, CardGrid.numberColorOnEffect, CardGrid.gridSize.x, CardGrid.gridSize.y );
		this.smallWinTimesText = Com.addLabelAt( this.extraBinkSp, 5, 55, CardGrid.gridSize.x - 5, 11, 11 );
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
}
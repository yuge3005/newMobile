class SuperGoalGrid extends ExtraBlinkGrid{

	private waveMc: egret.MovieClip;

	public static needClear: boolean;

	private forkUI: egret.Bitmap;

	public constructor() {
		super();
	}

	protected getBlinkBg(): egret.Bitmap{
		return Com.createBitmapByName( BingoMachine.getAssetStr( "card_yellow_02" ) );
	}

	protected buildSmallWinText(){
		this.extraBlinkNumTxt = Com.addLabelAt( this.extraBinkSp, 0, 3, CardGrid.gridSize.x, 30, 30, false, true );
		this.extraBlinkNumTxt.textColor = 0;
		this.smallWinTimesText = Com.addLabelAt( this.extraBinkSp, 0, 28, CardGrid.gridSize.x, 35, 30 );
		this.smallWinTimesText.textColor = 0xFFFF00;
	}

	public showWaveEffect( delay: number ): void{
		egret.Tween.removeTweens( this );
		let tw: egret.Tween = egret.Tween.get( this );
		tw.wait( delay );
		tw.call( () => { this.waveMc.gotoAndPlay( 1, 1 ) } );
	}

	public set currentBgPic( value ){
		if( this._currentBgPic && this.contains( this._currentBgPic ) )this.removeChild( this._currentBgPic );
		if( value == this.linePic ){
			if( !this.waveMc )this.waveMc = Com.addMovieClipAt( this, MDS.mcFactory, "gridWaveSuperGoal", 0, 0 );
			if( !this.contains( this.waveMc ) ){
				this.waveMc.gotoAndStop(1);
			}
			this.addChildAt( this.waveMc, 0 );
			if( this.forkUI && this.contains( this.forkUI ) )this.removeChild( this.forkUI );
		}
		else{
			if( !this.contains( this.waveMc ) ){
				this._currentBgPic = value;
				this.addChildAt( this._currentBgPic, 0 );
			}
			else if( this.contains( this.waveMc ) && SuperGoalGrid.needClear ){
				this.removeChild( this.waveMc );
				this._currentBgPic = value;
				this.addChildAt( this._currentBgPic, 0 );
			}
		}
	}

	public showEffect( isShow: boolean ): void{
		super.showEffect( isShow );

		if( isShow ){
			if( !this.forkUI ) this.forkUI = Com.createBitmapByName( BingoMachine.getAssetStr( CardSettings.usefork ) );
			Com.addObjectAt( this, this.forkUI, CardGrid.gridSize.x - this.forkUI.width >> 1, CardGrid.gridSize.y - this.forkUI.height >> 1 );
		}
		else {
			if( this.forkUI && this.contains( this.forkUI ) )this.removeChild( this.forkUI );
		}
	}
}
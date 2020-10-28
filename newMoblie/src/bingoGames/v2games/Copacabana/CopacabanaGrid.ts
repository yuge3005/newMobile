class CopacabanaGird extends TowerGrid{

	private waveMc: egret.MovieClip;

	public static mcf: egret.MovieClipDataFactory;

	public static needClear: boolean;

	public static showBinkColor: boolean;

	public static rangeColors: Array<number>;

	public constructor() {
		super();
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
			if( !this.waveMc )this.waveMc = Com.addMovieClipAt( this, MDS.mcFactory, "gridWave", 0, 0 );
			if( !this.contains( this.waveMc ) ){
				this.waveMc.gotoAndStop(1);
			}
			this.addChildAt( this.waveMc, 0 );
		}
		else{
			if( !this.contains( this.waveMc ) ){
				this._currentBgPic = value;
				this.addChildAt( this._currentBgPic, 0 );
			}
			else if( this.contains( this.waveMc ) && CopacabanaGird.needClear ){
				this.removeChild( this.waveMc );
				this._currentBgPic = value;
				this.addChildAt( this._currentBgPic, 0 );
			}
		}
	}

	public showEffect( isShow: boolean ): void{
		super.showEffect( isShow );
	}

	public showBlink( isShow: boolean ): void{
		super.showBlink( isShow );

		if( CopacabanaGird.showBinkColor ) this._currentBgPic.filters = [ MatrixTool.colorMatrixPure( CopacabanaGird.rangeColors[ Math.floor( ( this.gridNumber - 1 ) / 15 ) ] ) ];
		else this._currentBgPic.filters = [];
	}
}
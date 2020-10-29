class CopacabanaGird extends TowerGrid{

	private waveMc: egret.MovieClip;

	public static mcf: egret.MovieClipDataFactory;

	public static needClear: boolean;

	public static showBinkColor: boolean;

	public static rangeColors: Array<number> = [ 0x0b5ff2, 0x27a00d, 0x8a0eaf, 0xbd0a0e, 0xc8800d, 0xE193B1 ];

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
		if( value == this.linePic ){
			if( !this.waveMc ) this.waveMc = Com.addMovieClipAt( this, MDS.mcFactory, "gridWave", 0, 0 );
			if( !this.contains( this.waveMc ) ){
				this.waveMc.gotoAndStop(1);
			}
			this.addChild( this.waveMc );
			this.addChild( this.numTxt );
		}
		else{
			if( !this.contains( this.waveMc ) ){
				this._currentBgPic = value;
				this.flushGrid();
			}
			else if( this.contains( this.waveMc ) && CopacabanaGird.needClear ){
				this.removeChild( this.waveMc );
				this._currentBgPic = value;
				this.flushGrid();
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
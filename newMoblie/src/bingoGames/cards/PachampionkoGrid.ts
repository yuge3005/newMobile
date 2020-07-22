class PachampionkoGrid extends TowerGrid{

	private missOneContainer: egret.DisplayObjectContainer;
	private missOneBg: egret.Bitmap;
	private missOneNumText: egret.TextField;
	private missOneMultiple: egret.TextField;

	private waveMc: egret.MovieClip;

	public static mcf: egret.MovieClipDataFactory;

	public static needClear: boolean;

	private forkUI: egret.Bitmap;
	
	public get blink(): boolean{
		return this._blink;
	}
	public set blink( value: boolean ){
		if( this._blink == value )return;
		this._blink = value;
		if( !value ){ 
			this.currentBgPic = this.defaultBgPic;
			this.missOneContainer.visible = false;
		}
	}

	public constructor() {
		super()

		// miss one effect
		this.missOneContainer = new egret.DisplayObjectContainer();
		this.missOneContainer.visible = false;
		this.addChild( this.missOneContainer );
		// bg
		this.missOneBg = Com.addBitmapAt(this.missOneContainer, BingoMachine.getAssetStr( "card_yellow_02" ), 0, 0);
		// miss one num text
		this.missOneNumText = Com.addTextAt(this.missOneContainer, 0, 0, 38, 20, 18, false, false);
		this.missOneNumText.bold = true;
		this.missOneNumText.textAlign = "center";
		this.missOneNumText.verticalAlign = "middle";
		this.missOneNumText.textColor = CardGrid.numberColor;
		this.missOneNumText.text = this.numTxt.text;
		// miss one multiple
		this.missOneMultiple = Com.addTextAt(this.missOneContainer, 0, 15, 38, 16, 14, false, false);
		this.missOneMultiple.textAlign = "center";
		this.missOneMultiple.verticalAlign = "middle";
		this.missOneMultiple.textColor = 0xFFFFFF;
		this.missOneMultiple.text = "0";
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
			if( !this.waveMc )this.waveMc = Com.addMovieClipAt( this, PachampionkoGrid.mcf, "gridWavePachampionko", 0, 0 );
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
			else if( this.contains( this.waveMc ) && PachampionkoGrid.needClear ){
				this.removeChild( this.waveMc );
				this._currentBgPic = value;
				this.addChildAt( this._currentBgPic, 0 );
			}
		}
	}

	public showEffect( isShow: boolean ): void{
		super.showEffect( isShow );
		if( !isShow ){
			this.missOneContainer.visible = false;
		}

		if( isShow ){
			if( !this.forkUI ) this.forkUI = Com.createBitmapByName( BingoMachine.getAssetStr( GameCard.usefork ) );
			Com.addObjectAt( this, this.forkUI, CardGrid.gridSize.x - this.forkUI.width >> 1, CardGrid.gridSize.y - this.forkUI.height >> 1 );
		}
		else {
			if( this.forkUI && this.contains( this.forkUI ) )this.removeChild( this.forkUI );
		}
	}

	public showBlink( isShow: boolean ): void{
		this.missOneNumText.text = this.numTxt.text;
		this.missOneContainer.visible = true;
		if( this.parent ) this.parent.addChild( this );
	}

	public setSmallTime( winTimes: number ): void{
		if( !winTimes ){
			this.blink = false;
			return;
		}
		this.missOneMultiple.text = "" + winTimes;
	}
}
class MultiPlayerEnergy extends egret.DisplayObjectContainer{

	private powerUpBtn: TouchDownButton;
	private powerUpTypeIcon: egret.Bitmap;
	private powerProcess: egret.Bitmap;
	private powerType: string;

	private powerUpParticle: particle.GravityParticleSystem;
	private powerUpBlinkLight: egret.MovieClip;

	private set process( value: number ){
		this.powerProcess.mask = new egret.Rectangle( 0, 369 * (1 - value), 72, 369 * value );
		if( !this.powerUpBtn.enabled && value >= 1 ){
			SoundManager.play( "mpb_powerup_activate_mp3" );

			this.powerUpParticle = new particle.GravityParticleSystem(RES.getRes("multiPlayerParticle_png"), RES.getRes("multiPlayerParticle_json"));
			Com.addObjectAt(this, this.powerUpParticle, 0, 0 );
			this.powerUpParticle.start();

			this.powerUpBlinkLight = Com.addMovieClipAt( this, MDS.mcFactory, "blinkLight", 20, -106 );
			this.powerUpBlinkLight.scaleX = this.powerUpBlinkLight.scaleY = 2;

			this.cacheAsBitmap = false;
		}
		this.powerUpBtn.enabled = value >= 1;

		if( this.powerUpParticle && !this.powerUpBtn.enabled ){
			if( this.powerUpParticle.parent )this.powerUpParticle.parent.removeChild( this.powerUpParticle );
			this.powerUpParticle = null;

			if( this.powerUpBlinkLight.parent ) this.powerUpBlinkLight.parent.removeChild( this.powerUpBlinkLight );
			this.powerUpBlinkLight = null;

			this.cacheAsBitmap = true;
		}
	}

	public constructor() {
		super();

		this.powerUpBtn = Com.addDownButtonAt( this, MultiPlayerMachine.getAssetStr( "charger-icon" ), MultiPlayerMachine.getAssetStr( "charger-icon" ), 8, -120, this.onPowerBtnClick.bind(this), false );
		this.powerUpBtn.disabledFilter = MatrixTool.colorMatrix( 1, 0, 1 );
		this.powerUpBtn.enabled = false;
		this.powerProcess = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "chargerbar_01" ), 38, 36 );

		this.powerProcess.mask = new egret.Rectangle( 0, 369, 72, 0 );

		this.powerUpTypeIcon = new egret.Bitmap;
		this.powerUpTypeIcon.x = 8 - 23;
		this.powerUpTypeIcon.y = -120 - 21;
		this.addChild( this.powerUpTypeIcon );
	}

	public showEnergy( data: Object ){
		if( data && !isNaN(data["energy"]) ){
			this.process = data["energy"];
			this.powerType = data["type"];

			if( this.powerType ){
				this.powerUpBtn.alpha = 0.1;
				let iconSource: string;
				if( "coinsBall" == this.powerType ) iconSource = "coins_ball_ppwer";
				else if( "coinsAwardThree" == this.powerType ) iconSource = "coins_number3_power";
				else if( "markNumber" == this.powerType ) iconSource = "gift_number_power";
				this.powerUpTypeIcon.texture = RES.getRes( MultiPlayerMachine.getAssetStr( iconSource ) );
			}
		}
	}

	public onPowerBtnClick( event: egret.TouchEvent ){
		this.process = 0;
		let ev: egret.Event = new egret.Event( "useEnergy" );
		ev.data = this.powerType;
		this.dispatchEvent( ev );

		this.powerUpTypeIcon.texture = null;
		this.powerUpBtn.alpha = 1;

		MultyPlayerBingo.powerUpTimes++;
	}
}
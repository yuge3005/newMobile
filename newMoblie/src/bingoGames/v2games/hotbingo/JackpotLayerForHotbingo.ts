class JackpotLayerForHotbingo extends JackpotLayer{

	private mcBg: egret.Bitmap;
	private mcLeft: egret.Bitmap;
	private mcRight: egret.Bitmap;

	public constructor( jackpotContainerPosition: egret.Point, jackpot: number, jackpotMinBet: number, betConfig: Array<Object>, lockPosition: egret.Point,
		jackpotTextRect: egret.Rectangle, jackpotTextSize: number, jackpotTextColor: number ) {
		super( jackpotContainerPosition, jackpot, jackpotMinBet, betConfig, lockPosition, jackpotTextRect, jackpotTextSize, jackpotTextColor );

		let bgName: string = BingoMachine.getAssetStr( "Jackpot_enable" );
		if( MuLang.language == "pt" ) bgName += "_pt";
		this.mcBg = Com.addBitmapAt( this, bgName, 0, 0 );
		this.addChildAt( this.mcBg, 0 );

		this.jackpotText.filters = [new egret.GlowFilter( 0, 1, 6, 6, 4 )];

		if( MuLang.language == "pt" ){
			this.removeChild( this.jackpotLock );
			this.jackpotLock = Com.addBitmapAt(this, BingoMachine.getAssetStr("Jackpot_lock_pt"), lockPosition.x, lockPosition.y );
			this.jackpotLock.touchEnabled = true;
		}

		this.mcLeft = Com.addBitmapAtMiddle( this, BingoMachine.getAssetStr("Jackpot_star"), 120, 80 );
		this.addChildAt( this.mcLeft, 0 );
		this.mcRight = Com.addBitmapAtMiddle( this, BingoMachine.getAssetStr("Jackpot_star"), 487, 80 );
		this.addChildAt( this.mcRight, 0 );
	}

	public tryJackpotMinBet(): void{
		super.tryJackpotMinBet();
		if( this.mcBg )	this.mcRight.visible = this.mcLeft.visible = this.mcBg.visible = !this.jackpotLock.visible;
		else setTimeout( this.tryJackpotMinBet.bind(this), 10 );
	}

	public running( isRunning: boolean ){
		if( isRunning ){
			TweenerTool.tweenTo( this.mcLeft, { rotation: this.mcLeft.rotation + 360000 }, 3000000 );
			TweenerTool.tweenTo( this.mcRight, { rotation: this.mcRight.rotation + 360000 }, 3000000 );
		}
		else{
			egret.Tween.removeTweens( this.mcLeft );
			egret.Tween.removeTweens( this.mcRight );
		}
	}
}
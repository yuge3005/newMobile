class JackpotLayerForShowball1 extends JackpotLayer{

	private mcBg: egret.MovieClip;

	public constructor( jackpotContainerPosition: egret.Point, jackpot: number, jackpotMinBet: number, betConfig: Array<Object>, lockPosition: egret.Point,
		jackpotTextRect: egret.Rectangle, jackpotTextSize: number, jackpotTextColor: number ) {
		super( jackpotContainerPosition, jackpot, jackpotMinBet, betConfig, lockPosition, jackpotTextRect, jackpotTextSize, jackpotTextColor );

		this.mcBg = Com.addMovieClipAt( this, MDS.mcFactory, "showball1Jackpot", 0, 0 );
		this.addChildAt( this.mcBg, 0 );
		this.mcBg.stop();
	}

	public jackpotPlay( isPlay: boolean ){
		if( isPlay ){
			this.mcBg.play();
		}
		else{
			this.mcBg.gotoAndStop(1);
		}
	}

	public tryJackpotMinBet(): void{
		super.tryJackpotMinBet();
		if( this.mcBg )this.mcBg.visible = !this.jackpotLock.visible;
		else setTimeout( this.tryJackpotMinBet.bind(this), 10 );
	}
}
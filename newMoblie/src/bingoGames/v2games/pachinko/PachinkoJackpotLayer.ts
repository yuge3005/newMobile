class PachinkoJackpotLayer extends JackpotLayer{

	private mcBg: egret.Bitmap;

	public constructor( jackpotContainerPosition: egret.Point, jackpot: number, jackpotMinBet: number, betConfig: Array<Object>, lockPosition: egret.Point,
		jackpotTextRect: egret.Rectangle, jackpotTextSize: number, jackpotTextColor: number ) {
		super( jackpotContainerPosition, jackpot, jackpotMinBet, betConfig, lockPosition, jackpotTextRect, jackpotTextSize, jackpotTextColor );

		this.mcBg = Com.addBitmapAt( this, BingoMachine.getAssetStr( "jackpot_active" ), 0, 0 );
		this.addChildAt( this.mcBg, 0 );

		this.jackpotText.textAlign = "left";
        this.jackpotText.fontFamily = "Arial";
        this.jackpotText.bold = true;
	}

	public tryJackpotMinBet(): void{
		super.tryJackpotMinBet();
		if( this.mcBg )	this.mcBg.visible = !this.jackpotLock.visible;
		else setTimeout( this.tryJackpotMinBet.bind(this), 10 );
	}
}
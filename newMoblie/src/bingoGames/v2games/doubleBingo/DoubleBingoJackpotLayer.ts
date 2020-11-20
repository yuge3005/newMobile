class DoubleBingoJackpotLayer extends JackpotLayer{

	public constructor( jackpotContainerPosition: egret.Point, jackpot: number, jackpotMinBet: number, betConfig: Array<Object>, lockPosition: egret.Point,
		jackpotTextRect: egret.Rectangle, jackpotTextSize: number, jackpotTextColor: number, tipRect: egret.Rectangle = null, tipTextSize: number = 0, tipTextColor: number = 0 ) {
		super( jackpotContainerPosition, jackpot, jackpotMinBet, betConfig, lockPosition, jackpotTextRect, jackpotTextSize, jackpotTextColor, tipRect, tipTextSize, tipTextColor );

		this.jackpotText.textAlign = "right";
		this.jackpotText.fontFamily = "Arial";

		this.jackpotText.scaleX = 0.9;
		this.jackpotText.x = 25;

		this.tip.scaleX = 0.9;
		this.tip.stroke = 2;
	}
}
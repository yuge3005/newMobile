class HalloweenXJackpotLayer extends JackpotLayer{

	private smallJackpotTx: TextLabel;

	private smalljackpotTextValue: number = 0;
	private set smallJackpotValue( value: number ){
		this.smalljackpotTextValue = value;
		this.smallJackpotTx.setText( Utils.formatCoinsNumber( Math.round( value ) ) );
	}

	private get smallJackpotValue(): number{
		return this.smalljackpotTextValue;
	}

	public constructor( ackpotContainerPosition: egret.Point, jackpot: number, jackpotMinBet: number, betConfig: Array<Object>, lockPosition: egret.Point,
		jackpotTextRect: egret.Rectangle, jackpotTextSize: number, jackpotTextColor: number,
		tipRect: egret.Rectangle = null, tipTextSize: number = 0, tipTextColor: number = 0, lockOnTop: boolean = false ) {
		super( ackpotContainerPosition, jackpot, jackpotMinBet, betConfig, lockPosition,
		jackpotTextRect, jackpotTextSize, jackpotTextColor,	tipRect, tipTextSize, tipTextColor, true );

		this.smallJackpotTx = Com.addLabelAt( this, jackpotTextRect.x, jackpotTextRect.y - 170, jackpotTextRect.width, jackpotTextRect.height, jackpotTextSize, false, true );
		this.smallJackpotTx.stroke = 2;
		this.smallJackpotTx.strokeColor = 0;
		this.smallJackpotTx.text = "0";
	}

	public setJackpotNumber( data: Object, isChangeBet: boolean = false ){
		super.setJackpotNumber( data, isChangeBet );

		if( isChangeBet ) return;
		else egret.Tween.get( this ).to( { smallJackpotValue: data["smallerJackpot"] }, 2000 );
	}
}
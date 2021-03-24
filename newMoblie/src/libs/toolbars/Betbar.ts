class Betbar extends egret.DisplayObjectContainer{

	private processBar: egret.Bitmap;
	private jackpotMinBet: number;

	private processStartX: number = 32;
	private processMax: number = 780;

	private betPointJsckpot: BetbarPoint;
	private betPointMaxBet: BetbarPoint;

	public constructor(jackpotMinBet:number) {
		super();

		let bg: egret.Bitmap = Com.addBitmapAt( this, "betBar_json.bar_bg", 0, 0 );
		bg.scale9Grid = new egret.Rectangle( 18, 10, 60, 29 );
		bg.width = 820;

		this.processBar = Com.addBitmapAt( this, "betBar_json.bar_progress", 4, 4 );
		this.processBar.scale9Grid = new egret.Rectangle( 16, 8, 56, 15 );
		this.processBar.width = this.processStartX;

		this.visible = false;
		this.jackpotMinBet = jackpotMinBet;

		this.betPointJsckpot = new BetbarPoint( this.jackpotMinBet );
		this.betPointMaxBet = new BetbarPoint( GameData.maxBet );
		Com.addObjectAt( this, this.betPointJsckpot, 0, 20 );
		Com.addObjectAt( this, this.betPointMaxBet, this.processStartX + this.processMax, 20 );
	}

	public setBet( bet: number ){
		egret.Tween.removeTweens( this );
		this.visible = true;
		TweenerTool.tweenTo( this, { alpha: 1 }, 500, 0, this.waitThis.bind(this) );

		this.checkLock( bet );
	}

	private waitThis(){
		TweenerTool.tweenTo( this, { alpha: 0 }, 500, 1500, this.waitThis.bind(this) );
	}

	private hideThis(){
		this.visible = false;
	}

	private checkLock( bet: number ){
		TweenerTool.tweenTo( this.processBar, { width: this.getBetPosition( bet ) }, 400, 0 );

		this.betPointMaxBet.resetActiveBet( GameData.maxBet );
		this.betPointJsckpot.x = this.getBetPosition( this.betPointJsckpot.currentActiveBet );

		this.betPointJsckpot.resetBet( bet );
		this.betPointMaxBet.resetBet( bet );
	}

	private getBetPosition( bet: number ): number{
		return GameData.bets.indexOf( bet ) / ( GameData.bets.length - 1 ) * this.processMax + this.processStartX;
	}
}
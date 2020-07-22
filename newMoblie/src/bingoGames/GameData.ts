class GameData {

	public static bets: Array<number> = [50,100,250,500,1000,2500,5000,10000,25000,50000,100000,250000,500000,1000000,2500000,5000000,10000000];

	public static get minBet():number{
		return this.bets[0];
	}

	public static get maxBet():number{
		return this.bets[this.bets.length-1];
	}

	public static betUp(){
		this._currentBetIndex++;
	}

	public static betDown(){
		this._currentBetIndex--;
	}

	public static _currentBetIndex: number = -1;
	public static get currentBet():number{
		if( this._currentBetIndex <= -1 )this._currentBetIndex = this.bets.length - 1;
		else if( this._currentBetIndex >= this.bets.length )this._currentBetIndex = 0;
		return this.bets[this._currentBetIndex];
	}

	public static get currentBetIndex():number{
		return this._currentBetIndex;
	}

	public static setBetToMax(): void{
		this._currentBetIndex = this.bets.length - 1;
	}

	public constructor() {
	}
}
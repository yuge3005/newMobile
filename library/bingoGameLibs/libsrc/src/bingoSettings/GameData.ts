class GameData {

	public static bets: Array<number> = [10,25,50,100,250,500,1000,2500,5000,10000,25000,50000,100000,250000,500000,1000000,2500000,5000000,10000000];

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

	public static setBetToMin(): void {
		this._currentBetIndex = 0;
	}

	public constructor() {
	}

	public static waiter: Function;

	public static getBetList( callback: Function, gameId: string ){
		this.waiter = callback;

		let parameters = {current_bet: GameData.currentBet,"machineId": parseInt(gameId)};
		new DataServer().getDataFromUrl(PlayerConfig.config("http") + "://" + PlayerConfig.config("host") + "/cmd.php?action=get_machine_settings", this.getMachineSettingSuccess.bind(this), this, true, parameters);
	}

	private static getMachineSettingSuccess( data: string ){
		let dataObj: Object = JSON.parse(data);

		if( dataObj["bet_steps"] instanceof Array ){
			let betsArr: Array<string> = dataObj["bet_steps"];
			this.bets = [];
			for( let i: number = 0; i < betsArr.length; i++ ){
				this.bets[i] = parseInt( betsArr[i] );
			}
			this._currentBetIndex = this.bets.indexOf( dataObj["default_bet"] );
			this.waiter( true );
		}
	}
}
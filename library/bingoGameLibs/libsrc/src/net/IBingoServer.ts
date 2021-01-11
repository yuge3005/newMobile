class IBingoServer {

	private static serverConnection: Function = SFSConnector;

	public constructor() {
	}

	public static get connected():boolean{
		return this.serverConnection["connection"];
    }

	public static serverInit(){
		eval( "new this.serverConnection()" );
	}

	public static sendMessage( key: string, value: Object ):void{
		this.serverConnection["sendMessage"]( key, value );
	}

	public static set gameInitCallback( value: Function ){
		this.serverConnection["gameInitCallback"] = value;
	}

	public static set tounamentCallback( value: Function ){
		this.serverConnection["tounamentCallback"] = value;
	}

	public static set changeNumberCallback( value: Function ){
		this.serverConnection["changeNumberCallback"] = value;
	}

	public static set playCallback( value: Function ){
		this.serverConnection["playCallback"] = value;
	}

	public static set roundOverCallback( value: Function ){
		this.serverConnection["roundOverCallback"] = value;
	}

	public static set cancelExtraCallback( value: Function ){
		this.serverConnection["cancelExtraCallback"] = value;
	}

	public static set extraCallback( value: Function ){
		this.serverConnection["extraCallback"] = value;
	}

	public static set jackpotCallbak( value: Function ){
		this.serverConnection["jackpotCallbak"] = value;
	}

	public static set jackpotWinCallbak( value: Function ){
		this.serverConnection["jackpotWinCallbak"] = value;
	}

	public static set bonusGameSpinCallback( value: Function ){
		this.serverConnection["bonusGameSpinCallback"] = value;
	}

	public static set buffHandlerCallback( value: Function ){
		this.serverConnection["buffHandlerCallback"] = value;
	}

	public static set goKartHandlerCallback(value: Function) {
		this.serverConnection["goKartHandlerCallback"] = value;
	}

	public static set selectNumberCallback( value: Function ){
		this.serverConnection["selectNumberCallback"] = value;
	}

	public static set lemonGameCallback( value: Function ){
		this.serverConnection["lemonGameCallback"] = value;
	}

	public static loginTo( zona: string, room: string = null, joinRoomCallback: Function ):void{
        this.serverConnection["loginTo"]( zona, room, joinRoomCallback );
	}

	public static changeNumber(): void{
		this.serverConnection["sendMessage"]( "solicitanumeros", {} );
	}

	public static play( bet: number, cards: number, cardGroupNumber: number, betIndex: number ):void{
		this.serverConnection["sendPlay"]( "solicitajogada", bet, cards, cardGroupNumber, betIndex );
	}

	public static playWithCardId( bet: number, cards: number, cardGroupNumber: number, betIndex: number, cardId: number ):void{
		this.serverConnection["sendPlayWithCardId"]( "solicitajogada", bet, cards, cardGroupNumber, betIndex, cardId );
	}

	public static playWithCardNumbers ( bet: number, cards: number, cardGroupNumber: number, betIndex: number, cardNumbers: Array<number> ):void{
		this.serverConnection["sendPlayWithNumbers"]( "solicitajogada", bet, cards, cardGroupNumber, betIndex, cardNumbers );
	}

	public static round( bet: number, cards: number, cardGroupNumber: number, betIndex: number ):void{
		this.serverConnection["sedRound"]( "round", bet, cards, cardGroupNumber, betIndex )
	}

	public static roundOver(){
		this.serverConnection["roundOver"]();
	}

	public static libera(){
		this.serverConnection["libera"]();
	}

	public static cancelExtra( extraString: boolean = false ){
		this.serverConnection["cancelExtra"]( extraString );
	}

	public static extra( extraString: boolean = false, saving: boolean = false ){
		this.serverConnection["extra"]( extraString, saving );
	}

	public static bonusGameSpin( bet: number ){
		this.serverConnection["bonusGameSpin"]( bet );
	}

	public static buffHandler( action: string, bet: number ){
		this.serverConnection["buffHandler"]( action, bet );
	}

	public static selectNumber( num: number ){
		this.serverConnection["selectNumber"]( num );
	}

	public static goKartHandler(action: string, rewardType: number) {
		this.serverConnection["goKartHandler"](action, rewardType);
	}

	public static lemonGame( action: string, bet: number = 0, type: number = 0, boxIndex: number = 0 ){
		this.serverConnection["lemonGame"]( action, bet, type, boxIndex );
	}
}
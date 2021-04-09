class ISlotServer {

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

	public static set jackpotCallbak( value: Function ){
		this.serverConnection["jackpotCallbak"] = value;
	}

	public static set jackpotWinCallbak( value: Function ){
		this.serverConnection["jackpotWinCallbak"] = value;
	}

	public static loginTo( zona: string, room: string = null, joinRoomCallback: Function ):void{
        this.serverConnection["loginTo"]( zona, room, joinRoomCallback );
	}

	public static play( bet: number, betIndex: number, gameLineFormat: string ):void{
		this.serverConnection["sendPlay"]( "solicitajogada", bet, betIndex, gameLineFormat );
	}

	public static round( bet: number, cards: number, cardGroupNumber: number, betIndex: number ):void{
		this.serverConnection["sedRound"]( "round", bet, cards, cardGroupNumber, betIndex )
	}

	public static roundOver(){
		this.serverConnection["roundOver"]();
	}
}
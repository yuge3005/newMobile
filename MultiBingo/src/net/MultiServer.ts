class MultiServer {

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

	public static get userMultiplier(): number{
		return this.serverConnection["userMultiplier"];
	}

	public static get multiPlayerPattens(): Array<Object>{
		return this.serverConnection["multiPlayerPattens"];
	}

	public static get totalWinCount(): number{
		return this.serverConnection["totalWinCount"];
	}

	public static set gameInitCallback( value: Function ){
		this.serverConnection["gameInitCallback"] = value;
	}

	public static set roundOverCallback( value: Function ){
		this.serverConnection["roundOverCallback"] = value;
	}

	public static set selectNumberCallback( value: Function ){
		this.serverConnection["selectNumberCallback"] = value;
	}

	public static set multiPlayerCallback( value: Function ){
		this.serverConnection["multiPlayerCallback"] = value;
	}

	public static set triggerpowerUpCallback( value: Function ){
		this.serverConnection["triggerpowerUpCallback"] = value;
	}

	public static set callBingoCallback( value: Function ){
		this.serverConnection["callBingoCallback"] = value;
	}

	public static set existCardCallback( value: Function ){
		this.serverConnection["existCardCallback"] = value;
	}

	public static set otherJoinRoomCallback( value: Function ){
		this.serverConnection["otherJoinRoomCallback"] = value;
	}

	public static set roomMessageCallback( value: Function ){
		this.serverConnection["roomMessageCallback"] = value;
	}

	public static set cardsAndPlayersCallback( value: Function ){
		this.serverConnection["cardsAndPlayersCallback"] = value;
	}

	public static set buyCardCallback( value: Function ){
		this.serverConnection["buyCardCallback"] = value;
	}

	public static set buyCardFeatureCallback( value: Function ){
		this.serverConnection["buyCardFeatureCallback"] = value;
	}

	public static set coinsChangeCallback( value: Function ){
		this.serverConnection["coinsChangeCallback"] = value;
	}

	public static set powerUpCallback( value: Function ){
		this.serverConnection["powerUpCallback"] = value;
	}

	public static set buyFeatureCallback( value: Function ){
		this.serverConnection["buyFeatureCallback"] = value;
	}

	public static set luckNumberCallback( value: Function ){
		this.serverConnection["luckNumberCallback"] = value;
	}

	public static set onCardPriceCallback(value: Function) {
		this.serverConnection["onCardPriceCallback"] = value;
	}

	public static set onResumeCallback(value: Function){
		this.serverConnection["onResumeCallback"] = value;
	}

	public static set onEnterCallback(value: Function){
		this.serverConnection["onEnterCallback"] = value;
	}

	public static set onZoneCallback(value: Function){
		this.serverConnection["onZoneCallback"] = value;
	}

	public static set onPreBuyCard(value: Function){
		this.serverConnection["onPreBuyCard"] = value;
	}

	public static set onBlackoutMatching(value: Function){
		this.serverConnection["onBlackoutMatching"] = value;
	}

	public static set onBlackoutBallCallback(value: Function){
		this.serverConnection["onBlackoutBallCallback"] = value;
	}

	public static set onPastJoinedRoomCallback(value: Function){
		this.serverConnection["onPastJoinedRoomCallback"] = value;
	}

	public static loginTo( zona: string, room: string = null, joinRoomCallback: Function ):void{
        this.serverConnection["loginTo"]( zona, room, joinRoomCallback );
	}

	public static libera(){
		this.serverConnection["libera"]();
	}

	public static selectNumber( num: number ){
		this.serverConnection["selectNumber"]( num );
	}

	public static buyCard( amount: number, multiple: number ){
		this.serverConnection["buyCard"]( amount, multiple );
	}

	public static numberSelect( uuid: string, gridIndex: number ){
		this.serverConnection["numberSelect"]( uuid, gridIndex );
	}

	public static triggerPowerUp( type: string, uuid: string = null, gridIndex: number = NaN ){
		this.serverConnection["triggerPowerUp"]( type, uuid, gridIndex );
	}

	public static blackoutTriggerPowerUp( type: string, uuid: string, gridIndex: number, powerUpId: string ){
		this.serverConnection["blackoutTriggerPowerUp"]( type, uuid, gridIndex, powerUpId );
	}

	public static blackoutGoldTriggerPowerUp( type: string, num: number, powerUpId: string ){
		this.serverConnection["blackoutGoldTriggerPowerUp"]( type, num, powerUpId );
	}

	public static powerUp( type: string ){
		this.serverConnection["powerUp"]( type );
	}

	public static blackPowerUp( type: string, id: string ){
		this.serverConnection["blackPowerUp"]( type, id );
	}

	public static guessNum( num: number ){
		this.serverConnection["guessNum"]( num );
	}

	public static callBingo( uuid: string ){
		this.serverConnection["callBingo"]( uuid );
	}

	public static blackoutBingo(){
		this.serverConnection["blackoutBingo"]();
	}

	public static sendChatMessage( message: string ){
		this.serverConnection["sendChatMessage"]( message );
	}

	public static buyFeature( featureName: string, uuid: string = null ){
		this.serverConnection["buyFeature"]( featureName, uuid );
	}

	public static sendPreBuyCard( multiple: number ){
		this.serverConnection["sendPreBuyCard"]( multiple );
	}

	public static blackoutGetInRoom( roomName: string ){
		this.serverConnection["blackoutGetInRoom"]( roomName );
	}

	public static getBlackoutAward( id: string ){
		this.serverConnection["getBlackoutAward"]( id );
	}

	public static leaveRoom(){
		this.serverConnection["leaveRoom"]();
	}

	public static getRoomMate(): Array<Object>{
		return this.serverConnection["getRoomMate"]();
	}

	public static getUserInfoById( userId: string ): Object{
		return this.serverConnection["getUserInfoById"]( userId );
	}
}
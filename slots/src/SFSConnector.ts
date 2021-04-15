//,"src/javascripts/sfs2x-api-1.7.5.js"
class SFSConnector {
    private static _config: any;
    private static _sfs: any;
    private static connection: boolean;
    private static login: boolean;

    private static gettingRoom: string;
    private static joinRoomCallback: Function;
    public static gameInitCallback: Function;
    public static tounamentCallback: Function;
    public static changeNumberCallback: Function;
    public static playCallback: Function;
    public static roundOverCallback: Function;
    public static cancelExtraCallback: Function;
    public static extraCallback: Function;
    public static jackpotCallbak: Function;
    public static jackpotWinCallbak: Function;
    public static bonusGameSpinCallback: Function;
    public static buffHandlerCallback: Function;
    public static goKartHandlerCallback: Function;
    public static selectNumberCallback: Function;
    public static lemonGameCallback: Function;

    constructor() {
        SFSConnector.connection = false;
        SFSConnector.login = false;
        if( !SFSConnector._config ) SFSConnector._config = {
            host: "52.2.30.161",
            port: 8989,
            debug: false,
            useSSL: true
        };
        this.connection();
    }

    /**
     * connect sfs server
     **/
    private connection(): void {
        if (eval("SFS2X") && eval("SFS2X.SmartFox")) {
            if (!SFSConnector._sfs) {
                SFSConnector._sfs = eval("new SFS2X.SmartFox(SFSConnector._config)");

                // logger setting
                SFSConnector._sfs.logger.level = eval("SFS2X.LogLevel.DEBUG");
                SFSConnector._sfs.logger.enableConsoleOutput = true;
                SFSConnector._sfs.logger.enableEventDispatching = true;

                // add log events
                SFSConnector._sfs.logger.addEventListener(eval("SFS2X.LoggerEvent.DEBUG"), this.showSfsLogs, this);
                SFSConnector._sfs.logger.addEventListener(eval("SFS2X.LoggerEvent.INFO"), this.showSfsLogs, this);
                SFSConnector._sfs.logger.addEventListener(eval("SFS2X.LoggerEvent.WARNING"), this.showSfsLogs, this);
                SFSConnector._sfs.logger.addEventListener(eval("SFS2X.LoggerEvent.ERROR"), this.showSfsLogs, this);
                // add actions events
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.CONNECTION"), this.onSfsConnection, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.CONNECTION_LOST"), this.onSfsConnectionLost, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.EXTENSION_RESPONSE"), this.onSfsExtensionResponse, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.LOGIN"), this.onLogin, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.LOGIN_ERROR"), this.onLoginError, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.ROOM_JOIN"), this.onJoinRoom, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.ROOM_JOIN_ERROR"), this.onJoinRoomError, this);
                
                // connect
                SFSConnector._sfs.connect();
            } else {
                console.error("SFSServer had been initilized!");
            }
        }
    }

    /**
     * show logs
     */
    private showSfsLogs(event): void {
        console.log(event.message || "");
    }

    /**
     * sfs server connection callback
     */
    private onSfsConnection(event): void {
        if (event.success) {
            // success
            console.log("connected to SFS Server 2X " + SFSConnector._sfs.version);
            SFSConnector.connection = true;
        } else {
            // failed
        }
    }

    /**
     * sfs server lost connection callback
     */
    private onSfsConnectionLost(event): void {
        console.log("SFS Server connection lost!");
        console.log(event);
        alert( "connection lost!" );
        // remove event listeners
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.CONNECTION"), this.onSfsConnection);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.CONNECTION_LOST"), this.onSfsConnectionLost);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.EXTENSION_RESPONSE"), this.onSfsExtensionResponse);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.LOGIN"), this.onLogin);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.LOGIN_ERROR"), this.onLoginError);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.ROOM_JOIN"), this.onJoinRoom);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.ROOM_JOIN_ERROR"), this.onJoinRoomError);
        SFSConnector._sfs.logger.removeEventListener(eval("SFS2X.LoggerEvent.DEBUG"), this.showSfsLogs);
        SFSConnector._sfs.logger.removeEventListener(eval("SFS2X.LoggerEvent.INFO"), this.showSfsLogs);
        SFSConnector._sfs.logger.removeEventListener(eval("SFS2X.LoggerEvent.WARNING"), this.showSfsLogs);
        SFSConnector._sfs.logger.removeEventListener(eval("SFS2X.LoggerEvent.ERROR"), this.showSfsLogs);

        // reset settings
        SFSConnector.connection = false;
        SFSConnector._sfs = null;
    }

    /**
     * login callback
     **/
    private onLogin(event): void {
        console.log("login success!");

        if( SFSConnector.gettingRoom ){
            SFSConnector._sfs.send(eval("new SFS2X.JoinRoomRequest('" + SFSConnector.gettingRoom + "')"));
            SFSConnector.gettingRoom = null;
        }
    }

    /**
     * login error callback
     **/
    private onLoginError(event): void {
        console.error("login failed! " + event.errorMessage);
    }

    /**
     * join room callback
     **/
    private onJoinRoom(event): void {
        console.log("join room <" + event.room + "> success!");
        if( SFSConnector.joinRoomCallback ){
            SFSConnector.joinRoomCallback();
            SFSConnector.joinRoomCallback = null;
        }
    }

    /**
     * join room error callback
     **/
    private onJoinRoomError(event): void {
        console.error("join room failed! " + event.errorMessage);
    }

    /**
     * sfs server extension response callback
     */
    private onSfsExtensionResponse(event): void {
        trace( "onSfsExtensionResponse" );
        if( event.cmd.indexOf( "trm." ) != 0 ){ // filter for tounament message
            trace( event.cmd );
            trace( event.params.getDump() );
        }
        if( event.cmd == "respostalogin" && SFSConnector.gameInitCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["credito"] = data.getDouble("creditos");
            gameData["acumulado"] = Number( data.getUtfString("acumulado1") );
            gameData["jackpot_min_bet"] = data.getInt("jackpot_min_bet");
            // if( !numCards )createNumberCards();
            // setNumberCards( numerosCartelas );
            gameData["pendente"] = data.getBool("pendente");
            gameData["aposta"] = data.getDouble("aposta");
            gameData["btcreditar"] = data.getBool("btcreditar");
            gameData["btpainelpendente"] = data.getBool("btpainelpendente");
            gameData["letras"] = data.getUtfString("letras");
            gameData["luckmultis"] = data.getUtfString("luckmultis");
            gameData["puzzleCurrent"] = data.getInt("puzzle_spin_amount");
            gameData["puzzleTotal"] = data.getInt("puzzle_spin_target");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["premiosPagos"] = data.getDoubleArray("premiosPagos");
            let betConfig = data.getSFSArray("betConfig");
            if( betConfig ){
                gameData["betConfig"] = this.getBetConfig( betConfig );
            }
            gameData["freeSpin"] = data.getInt("free_spin");
            SFSConnector.gameInitCallback( gameData );
        }
        else if( event.cmd == "respostajogada" && SFSConnector.playCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["credito"] = data.getDouble("creditos");
            gameData["ganho"] = data.getDouble("ganho");
            gameData["xp"] = data.getDouble("xp");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["tipoBonus"] = data.getInt("tipoBonus");
            gameData["posicoesArrayBonus"] = data.getIntArray("posicoesArrayBonus");
            gameData["figuras"] = data.getIntArray("figuras");
            gameData["linhasPremiadas"] = data.getIntArray("linhasPremiadas");
            gameData["figurasPremiadas"] = data.getIntArray("figurasPremiadas");
            SFSConnector.playCallback( gameData, data );
        }
        else if( event.cmd == "respostafinaliza" && SFSConnector.roundOverCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["credito"] = data.getDouble( "creditos" );
            gameData["jackpot_min_bet"] = data.getInt("jackpot_min_bet");
            gameData["freeSpin"] = data.getInt("free_spin");
            SFSConnector.roundOverCallback( gameData );
        }
        else if( event.cmd == "atualizaacumulado" && SFSConnector.jackpotCallbak ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["acumulado"] = data.getDouble("acumulado");
            gameData["smallerJackpot"] = data.getDouble("smallerJackpot");
            SFSConnector.jackpotCallbak( gameData );
            return;
        }
        else if( event.cmd == "jackpotWin" && SFSConnector.jackpotWinCallbak ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["id"] = data.getUtfString("user_id");
            // gameData["jackpot"] = data.getLong("jackpot");
            gameData["jackpot"] = data.getLong("jackpotWin");
            SFSConnector.jackpotWinCallbak( gameData );
            return;
        }
        else if( event.cmd == "bonusGame" && SFSConnector.bonusGameSpinCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["over"] = data.getBool("over");
            gameData["prize"] = data.getDouble("prize");
            gameData["prizeIconIdx"] = data.getUtfStringArray( "prizeIconIdx" );
            gameData["iconIdx"] = data.getUtfStringArray( "iconIdx" );
            SFSConnector.bonusGameSpinCallback( gameData );
            return;
        }
        else if (event.cmd === "erro") {
            let info = event.params.get("mensagem");
            console.log("----   SFSConnector -> onSfsExtensionResponse[erro]:");
            console.log(info);

            if( info == "Saldo insuficiente" ){
                if( SFSConnector.playCallback || SFSConnector.extraCallback ){
                    let callbackFun: Function = SFSConnector.playCallback;
                    if( !callbackFun )callbackFun = SFSConnector.extraCallback;
                    callbackFun( null );
                }
            }
        }
        else if( event.cmd.indexOf( "trm." ) == 0 && SFSConnector.tounamentCallback ){
            SFSConnector.tounamentCallback( event.cmd, event.params );
        }
    }

    /**
     * send cmd request to sfs server
     * @param cmd    the sfs server request command object
     * @param params request parameters
     **/
    public static send(cmd, params) {
        if (eval("SFS2X")) {
            if (SFSConnector.connection) {
                SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest(cmd, params)"));
            } else {
                console.error("SFS Server connection failed!");
            }
        } else {
            console.log("Object SFS2X is not defined!");
        }
    }

    private getBetConfig( configData: any ): Array<Object>{
        let ar: Array<Object> = [];
        for( let i: number = 0; i < configData.size(); i++ ){
            ar[i] = {};
            ar[i]["bet"] = configData.get(i).getInt("bet");
            ar[i]["jackpotRate"] = configData.get(i).getDouble("jackpotRate");
        }
        return ar;
    }

    public static loginTo( zona: string, room: string = null, joinRoomCallback: Function ):void{
        this.gettingRoom = room;
        this._sfs.send(eval("new SFS2X.LoginRequest('" + PlayerConfig.player( "user.id" ) + "', '', null, '" + zona + "')" ));
        this.joinRoomCallback = joinRoomCallback;
    }

    public static sendMessage( key: string, value: Object ):void{
        var params:any = eval( "new SFS2X.SFSObject()" );
        for( var ob in value ){
            if( ob == "version" ) params.putInt( ob, value[ob] );
            else params.putUtfString( ob, value[ob] );
        }
        trace("send:ExtensionRequest," + key);
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( key, params )"));
    }

    public static sendPlay( key: string, bet: number, betIndex: number, gameLineFormat: string ): void{
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putInt( "aposta", bet );
        params.putInt( "bet_index", betIndex );
        params.putUtfString("linhas", gameLineFormat);
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( key, params )"));
    }

    public static roundOver(){
        var params:any = eval( "new SFS2X.SFSObject()" );
        trace( params.getDump() )
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'finalizajogada', params )"));
    }
}
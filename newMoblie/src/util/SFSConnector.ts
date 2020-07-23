let SFSServerCommandHandlerMapping = {};
let connectionComplete = [];
//,"src/javascripts/sfs2x-api-1.7.5.js"
class SFSConnector {
    private static _config: any;
    private static _sfs: any;
    private static connection: boolean;
    public static get connected():boolean{
        return this.connection;
    }
    private static login: boolean;
    private static connectionComplete: Array<Function>;

    private static gettingRoom: string;
    private static waitingForUserVar: boolean;
    private static joinRoomCallback: Function;
    public static gameInitCallback: Function;
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
    public static multiPlayerCallback: Function;
    public static buyCardCallback: Function;
    public static coinsChangeCallback: Function;
    public static powerUpCallback: Function;
    public static triggerpowerUpCallback: Function;
    public static callBingoCallback: Function;
    public static existCardCallback: Function;
    public static otherJoinRoomCallback: Function;
    public static roomMessageCallback: Function;
    public static cardsAndPlayersCallback: Function;

    constructor() {
        // PlayerConfig.config("host")
        new Http().instance( "https://" + "staging.doutorbingo.com/xmlconfig/config.xml", "GET", null, true, this.getSFSConfigSuccess.bind(this)).send();
    }

    /**
     * get sfs server config
     **/
    private getSFSConfigSuccess(data: string): void {
        let serverConfig: egret.XML = egret.XML.parse(data);
        SFSConnector.connection = false;
        SFSConnector.login = false;
        SFSConnector._config = {
            host: "",
            port: 8090,
            debug: false,
            useSSL: false
        };

        for (let i = 0; i < serverConfig.children.length; i++) {
            if ((<egret.XML>serverConfig.children[i]).name === "ip") {
                SFSConnector._config["host"] = (<egret.XMLText>(<egret.XML>serverConfig.children[i]).children[0]).text;
            } else if ((<egret.XML>serverConfig.children[i]).name === "porta") {
                // SFSConnector._config["port"] = Number((<egret.XMLText>(<egret.XML>serverConfig.children[i]).children[0]).text);
            }
        }

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
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.USER_VARIABLES_UPDATE"), this.onUserVarUpdate, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE"), this.onRoomVarsUpdate, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.CONNECTION"), this.onSfsConnection, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.CONNECTION_LOST"), this.onSfsConnectionLost, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.EXTENSION_RESPONSE"), this.onSfsExtensionResponse, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.LOGIN"), this.onLogin, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.LOGIN_ERROR"), this.onLoginError, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.ROOM_JOIN"), this.onJoinRoom, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.ROOM_JOIN_ERROR"), this.onJoinRoomError, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.USER_ENTER_ROOM"), this.onUserEnterRoom, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.USER_EXIT_ROOM"), this.onUserExitRoom, this);
                SFSConnector._sfs.addEventListener(eval("SFS2X.SFSEvent.PUBLIC_MESSAGE"), this.onUserMessage, this);
                
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
            // ConnectionLost.showReconnectUI();
            // console.log( "ConnectionLost" );
            // login
            // SFSConnector.loginIn();
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
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.USER_VARIABLES_UPDATE"), this.onUserVarUpdate);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE"), this.onRoomVarsUpdate, this);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.CONNECTION"), this.onSfsConnection);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.CONNECTION_LOST"), this.onSfsConnectionLost);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.EXTENSION_RESPONSE"), this.onSfsExtensionResponse);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.LOGIN"), this.onLogin);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.LOGIN_ERROR"), this.onLoginError);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.ROOM_JOIN"), this.onJoinRoom);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.ROOM_JOIN_ERROR"), this.onJoinRoomError);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.USER_ENTER_ROOM"), this.onUserEnterRoom);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.USER_EXIT_ROOM"), this.onUserExitRoom);
        SFSConnector._sfs.removeEventListener(eval("SFS2X.SFSEvent.PUBLIC_MESSAGE"), this.onUserMessage);
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

        for (let i = 0; i < connectionComplete.length; i++) {
            eval("connectionComplete[i]()");
        }
        connectionComplete = [];

        if( SFSConnector.gettingRoom ){
            SFSConnector._sfs.send(eval("new SFS2X.JoinRoomRequest('" + SFSConnector.gettingRoom + "')"));
            SFSConnector.gettingRoom = null;
        }
        else SFSConnector.waitingForUserVar = true;
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

        if( SFSConnector.multiPlayerCallback ){
            let room = SFSConnector._sfs.lastJoinedRoom;
            let changedObject = room.getVariable( "timePlan" ).value;
            if( changedObject.getBool( "isLocked" ) == true ){
                let changeValue: Object = {};
                changeValue["isLocked"] = changedObject.getBool("isLocked");
                changeValue["startTime"] = changedObject.getUtfString("startTime");
                changeValue["endTime"] = changedObject.getUtfString("endTime");
                SFSConnector.multiPlayerCallback( "timePlan", changeValue );
                return;
            }

            let cardPrice = room.getVariable( "cardPrice" ).value;
            SFSConnector.multiPlayerCallback( "cardPrice", cardPrice );

            let roomVar = room.getVariable( "gamePattern" );
            let arr = roomVar.value;
            let cardPrize = arr.get(0).getInt("prize");
            SFSConnector.multiPlayerCallback( "cardPrize", cardPrize );

            SFSConnector.multiPlayerCallback( "enterGameState", room.getVariable( "gameState" ).value );

            this.updataCardsAndPlayers( true );
        }
    }

    /**
     * join room error callback
     **/
    private onJoinRoomError(event): void {
        console.error("join room failed! " + event.errorMessage);
    }

    private onUserVarUpdate(event): void {
        if( SFSConnector.waitingForUserVar ){
            SFSConnector._sfs.send(eval("new SFS2X.JoinRoomRequest('" + SFSConnector._sfs.getRoomList()[0].name + "')"));
            SFSConnector.waitingForUserVar = false;
        }

        if( event.changedVars.indexOf( "cards" ) >= 0 ){
            let sfsVarCard = SFSConnector._sfs.mySelf.getVariable( "cards" );
            trace( sfsVarCard.value.getDump() );
            let arr = sfsVarCard.value;
            let gameData = [];
            for( let i: number = 0; i < arr.size(); i++ ){
                gameData[i] = {};
                gameData[i]["numbers"] = arr.get(i).getIntArray("numbers");
                gameData[i]["coinsNumber"] = arr.get(i).getIntArray("coinsNumber");
                gameData[i]["uuid"] = arr.get(i).getUtfString("uuid");
                gameData[i]["free"] = [];
                let freeArr = arr.get(i).getSFSArray("free");
                for( let j: number = 0; j < freeArr.size(); j++ ){
                    let colum: number = freeArr.get(j).getInt("column");
                    let row: number = freeArr.get(j).getInt("row");
                    gameData[i]["free"].push( row * 5 + colum );
                }
            }
            if( SFSConnector.buyCardCallback ){
                SFSConnector.buyCardCallback( gameData );
            }
            else if( SFSConnector.existCardCallback ){
                var existCardData: Object = {};
                existCardData["cards"] = gameData;
                existCardData["selected_multi"] = SFSConnector._sfs.mySelf.getVariable( "selected_multi" ).value;
                existCardData["amount"] = gameData.length;
                SFSConnector.existCardCallback( existCardData );
            }
        }

        if( SFSConnector.coinsChangeCallback ){
            let data: Object = { credito: SFSConnector._sfs.mySelf.getVariable( "soft_money" ).value };
            SFSConnector.coinsChangeCallback( data );
        }
        trace( "onUserVarUpdate" );
        trace( event.changedVars );
        trace( SFSConnector._sfs.mySelf.getVariables() );
    }

    public static get userMultiplier(): number{
        return SFSConnector._sfs.mySelf.getVariable( "multiplier" ).value;
    }

    public static get multiPlayerPattens(): Array<Object>{
        let arr = SFSConnector._sfs.lastJoinedRoom.getVariable( "gamePattern" ).value;
        let changeValue: Array<Object> = [];
        for( let j: number = 0; j < arr.size(); j++ ){
            changeValue[j] = {};
            changeValue[j]["patternName"] = arr.get(j).getUtfString("patternName");
        }
        return changeValue;
    }

    public static get totalWinCount(): number{
        let winCount: number = SFSConnector._sfs.lastJoinedRoom.getVariable( "totalWinCount" ).value;
        return winCount;
    }

    private onRoomVarsUpdate(event): void {
        let room = SFSConnector._sfs.lastJoinedRoom;
        trace( "onRoomVarUpdate" );
        trace( event.changedVars );
        if( !room || !event.changedVars || event.changedVars.length == 0 ) return;
        for( let i: number = 0; i < event.changedVars.length;i++ ){
            let changedItemName = event.changedVars[i];
            let roomVar = room.getVariable( changedItemName );
            let changedObject = roomVar.value;
            let changeValue: any;
            switch( changedItemName ){
                case "calledBingoNumbers":
                    if( event.changedVars.length != 1 )continue;
                    let ballIndex: number = 0;
                    let lastBall: number;
                    changeValue = [];
                    while( lastBall = changedObject.getInt( ballIndex++ ) ){
                        changeValue.push( { lastBall: lastBall, ballIndex: ballIndex } );
                    }
                    break;
                case "countDown":
                    changeValue = changedObject;
                    break;
                case "timePlan":
                    changeValue = {};
                    changeValue["isLocked"] = changedObject.getBool("isLocked");
                    changeValue["startTime"] = changedObject.getUtfString("startTime");
                    changeValue["endTime"] = changedObject.getUtfString("endTime");
                    break;
                case "gamePattern":
                    let arr = changedObject;
                    changeValue = [];
                    for( let j: number = 0; j < arr.size(); j++ ){
                        changeValue[j] = {};
                        changeValue[j]["patternName"] = arr.get(j).getUtfString("patternName");
                    }
                    break;
                case "cardPrice":
                    changeValue = changedObject;
                    break;
                case "finalWinner":
                    break;
                case "cardCount":
                    this.updataCardsAndPlayers();
                    break;
                default: 
                    trace( changedItemName );
                    trace( changedObject );
                    continue;
            }
            trace( changeValue );
            if( SFSConnector.multiPlayerCallback ) SFSConnector.multiPlayerCallback( changedItemName, changeValue );
        }
    }

    private onUserEnterRoom(event): void{
        if( SFSConnector.otherJoinRoomCallback ) {
            var userName = event.user.getVariable("name").value;
            var fbId = event.user.getVariable("platformId").value;
            SFSConnector.otherJoinRoomCallback( userName, fbId );
        }

        this.updataCardsAndPlayers( true );
    }

    private onUserExitRoom(event): void{
        trace( "onUserExitRoom" );
        this.updataCardsAndPlayers( true );
    }

    private updataCardsAndPlayers( roomPlayerChange: boolean = false ): void{
        if( SFSConnector.cardsAndPlayersCallback ){
            let room = SFSConnector._sfs.lastJoinedRoom;
            var gameData: Object = {};
            gameData["cardCount"] = room.getVariable( "cardCount" ).value;
            gameData["playerCound"] = room.getPlayerList().length;
            if( roomPlayerChange ){
                gameData["players"] = [];
                let playerList = room.getPlayerList();
                for( let i: number = 0; i < playerList.length; i++ ){
                    gameData["players"].push( playerList[i].getVariable("platformId").value );
                }
            }
            SFSConnector.cardsAndPlayersCallback( gameData );
        }
    }

    private onUserMessage(event): void{
        if( SFSConnector.roomMessageCallback ) SFSConnector.roomMessageCallback( event.sender.getVariable("name").value, event.message, event.sender.getVariable("platformId").value );
    }

    /**
     * sfs server extension response callback
     */
    private onSfsExtensionResponse(event): void {
        trace( "onSfsExtensionResponse" );
        trace( event.cmd );
        trace( event.params.getDump() );
        if( event.cmd == "respostainiciar" && SFSConnector.gameInitCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["credito"] = data.getDouble("creditos");
            gameData["acumulado"] = data.getDouble("acumulado");
            gameData["jackpot_min_bet"] = data.getInt("jackpot_min_bet");
            gameData["cartela"] = data.getInt("cartela");
            gameData["numerosCartelas"] = data.getByteArray("numeros");
            // if( !numCards )createNumberCards();
            // setNumberCards( numerosCartelas );
            gameData["pendente"] = data.getBool("pendente");
            gameData["aposta"] = data.getInt("aposta");
            gameData["btcreditar"] = data.getBool("btcreditar");
            gameData["btextra"] = data.getBool("btextra");
            gameData["btpainelpendente"] = data.getBool("btpainelpendente");
            gameData["letras"] = data.getUtfString("letras");
            gameData["bonusBalls"] = data.getUtfString("bonusBalls");
            gameData["bonusRounds"] = data.getUtfString("bonusRounds");
            gameData["luckmultis"] = data.getUtfString("luckmultis");
            gameData["puzzleCurrent"] = data.getInt("puzzle_spin_amount");
            gameData["puzzleTotal"] = data.getInt("puzzle_spin_target");
            let buffWheel = data.getIntArray("buffWheel");
            if( buffWheel ){
                gameData["buffWheel"] = buffWheel;

                gameData["goKartRewards"] = data.getSFSArray("go_kart_rewards");
                var buffs = data.getSFSArray("buffs");
                gameData["buffs"] = [];
                for( let i: number = 0; i < buffs.size(); i++ ){
                    gameData["buffs"][i] = {};
                    gameData["buffs"][i].buffValue = buffs.get(i).getInt("buffValue");
                    gameData["buffs"][i].buff_pos = buffs.get(i).getInt("buff_pos");
                    gameData["buffs"][i].buffID = buffs.get(i).getInt("buffID");
                    gameData["buffs"][i].buffMaxValue = buffs.get(i).getInt("buff_max_value");
                    gameData["buffs"][i].buffBet = buffs.get(i).getInt("buffBet");
                }

                gameData["gokartSecondCurrencyRewards"] = data.getSFSArray("go_kart_hard_currency_rewards");
            }
            let bellIndexs = data.getIntArray("bell_indexs");
            if( bellIndexs ){
                gameData["bellIndexs"] = bellIndexs;
                var lemonBuffs = data.getSFSArray("lemon_games_buffs");
                gameData["lemonBuffs"] = [];
                for( let i: number = 0; i < lemonBuffs.size(); i++ ){
                    gameData["lemonBuffs"][i] = {};
                    gameData["lemonBuffs"][i].buffID = lemonBuffs.get(i).getInt("buffID");
                    gameData["lemonBuffs"][i].buffBet = lemonBuffs.get(i).getInt("buffBet");
                }
            }
            gameData["secondCurrency"] = data.getLong("hard_currency");
            let betConfig = data.getSFSArray("betConfig");
            if( betConfig ){
                gameData["betConfig"] = this.getBetConfig( betConfig );
            }
            SFSConnector.gameInitCallback( gameData );
        }
        if( event.cmd == "login" && SFSConnector.gameInitCallback ){
            var data : any = event.params;
            let resposta = data.getUtfString("resposta");

            var gameData: Object = {};
            gameData["credito"] = parseInt(resposta.match( /\$.+(?=CA)/ )[0].replace( "$", "" ) );
			var subResponse:String = resposta.substr(resposta.search("CT"));
            var codCartela: number = parseInt( subResponse.substr(2, 4) );
            gameData["cartela"] = codCartela;
            gameData["acumulado"] = resposta.match( /AC.+(?=CT)/ )[0].replace( "AC", "" );
            gameData["jackpot_min_bet"] = data.getInt("jackpot_min_bet");
            gameData["puzzleCurrent"] = data.getInt("puzzle_spin_amount");
            gameData["puzzleTotal"] = data.getInt("puzzle_spin_target");
            let save = resposta.match( /P\d*/g );
            if( save && save.length ){
                gameData["save"] = parseInt( save[save.length-1].replace( "P", "" ) );
            }
            gameData["secondCurrency"] = data.getLong("hard_currency");
            let betConfig = data.getSFSArray("betConfig");
            if( betConfig ){
                gameData["betConfig"] = this.getBetConfig( betConfig );
            }
            SFSConnector.gameInitCallback( gameData );

            var params:any = eval( "new SFS2X.SFSObject()" );
            SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'respostalogin', params )"));
        }
        else if( event.cmd == "respostasolicitanumeros" && SFSConnector.changeNumberCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["cartela"] = data.getInt( "cartela" );
            gameData["numerosCartelas"] = data.getByteArray("numeros");
            gameData["mark_column"] = data.getIntArray( "mark_column_nums_buff" );
            gameData["mark_on_card"] = data.getIntArray( "mark_num_per_card_buff" );
            gameData["rewardNumIndex"] = data.getInt( "rewardNumIndex" );
            gameData["bellIndexs"] = data.getIntArray("bell_indexs");
            SFSConnector.changeNumberCallback( gameData );
        }
        else if( event.cmd == "jogada" && SFSConnector.playCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["credito"] = data.getDouble("creditos");
            gameData["ganho"] = data.getDouble("ganho");
            gameData["btextra"] = data.getBool("btextra");
            gameData["bolas"] = data.getByteArray("bolas");
            gameData["valorextra"] = data.getInt("valorextra");
            gameData["ebPrice"] = data.getLong("ebPrice");
            gameData["xp"] = data.getDouble("xp");
            gameData["gratis"] = data.getByte("gratis");
            gameData["eb_colors"] = data.getIntArray("eb_colors_buff");
            gameData["free_eb"] = data.getIntArray("free_eb_buff");
            if( !gameData["free_eb"] ) gameData["free_eb"] = data.getIntArray("freeEbs");
            gameData["cut_ball_position"] = data.getInt("random_select_ball_position_buff");

            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["winSecondCurrency"] = data.getLong("total_win_hard_currency");
            gameData["buffRewardSecondCurrency"] = data.getLong("buff_reward_hard_currency");

            gameData["wonAllBells"] = data.getBool("won_all_bells");
            if( gameData["wonAllBells"] ){
                gameData["buffID"] = data.getInt( "buffID" );
                gameData["bombIndexs"] = data.getIntArray("bomb_indexs");
            }

            gameData["isMegaBall"] = data.getBool("isMegaBall");
            gameData["ebPosition"] = data.getInt("ebPosition");
            let prizeBalls = data.getSFSArray("multi_prize_balls");
            if( prizeBalls ){
            gameData["prizeBalls"] = [];
                for( let i: number = 0; i < prizeBalls.size(); i++ ){
                    gameData["prizeBalls"][i] = {};
                    gameData["prizeBalls"][i].index = prizeBalls.get(i).getInt("ball_index");
                    gameData["prizeBalls"][i].multi = prizeBalls.get(i).getInt("multi");
                }
            }
            SFSConnector.playCallback( gameData, data );
        }
        else if( event.cmd == "round" && SFSConnector.playCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            let tempData: string = data.getUtfString("balls");
            
            let balls: Array<number> = [];
            try{
                let ballString: string = tempData.match( /R\d+(?=G)/ )[0].replace( "R", "" );
                for( let i: number = 0; i < ballString.length; i+=2 ){
                    balls.push( parseInt( ballString[i] + ballString[i+1] ) );
                }
            }
            catch(e){ trace( "data error" ) }
            
            try{
                gameData["ganho"] = parseInt( tempData.match( /G\d+/ )[0].replace( "G", "" ) );
                gameData["credito"] = parseInt(tempData.match( /\$.+(?=CA)/ )[0].replace( "$", "" ) );
            }
            catch(e){ trace( "data error" ) }
            gameData["btextra"] = tempData.indexOf( "E" ) > 0;
            if( gameData["btextra"] )gameData["valorextra"] = parseInt( tempData.substr( tempData.indexOf( "E" ) + 1 ) );
            gameData["bolas"] = balls;
            gameData["xp"] = data.getDouble("xp");
            gameData["secondCurrency"] = data.getLong("hard_currency");

            SFSConnector.playCallback( gameData );
        }
        else if( event.cmd == "jogadafinalizada" && SFSConnector.roundOverCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["ganho"] = data.getDouble( "ganho" );
            gameData["credito"] = data.getDouble( "creditos" );
            gameData["luckMulti"] = data.getInt( "luckMulti" );
            gameData["letra"] = data.getByte( "letra" );
            gameData["bonusRound"] = data.getByte( "bonusRound" );
            gameData["missionValue"] = data.get("mission_value");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["winSecondCurrency"] = data.getLong("total_win_hard_currency");
            gameData["jackpot_min_bet"] = data.getInt("jackpot_min_bet");
            gameData["puzzleCurrent"] = data.getInt("puzzle_spin_amount");
            gameData["puzzleTotal"] = data.getInt("puzzle_spin_target");
            SFSConnector.roundOverCallback( gameData );
        }
        else if( event.cmd == "libera" && SFSConnector.roundOverCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            let tempData: string = data.getUtfString("resposta");
            try{
                gameData["ganho"] = "unexpress";
                gameData["credito"] = parseInt( tempData.match( /\$.+(?=CA)/ )[0].replace( "$", "" ) );
            }
            catch(e){ trace( "data error" ) }
            gameData["missionValue"] = data.get("mission_value");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["jackpot_min_bet"] = data.getInt("jackpot_min_bet");
            gameData["puzzleCurrent"] = data.getInt("puzzle_spin_amount");
            gameData["puzzleTotal"] = data.getInt("puzzle_spin_target");
            SFSConnector.roundOverCallback( gameData );
        }
        else if( event.cmd == "jogadafinalizada" && SFSConnector.cancelExtraCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["ganho"] = data.getDouble( "ganho" );
            gameData["credito"] = data.getDouble( "creditos" );
            gameData["extrasnaocompradas"] = data.getByteArray( "extrasnaocompradas" );
            gameData["luckMulti"] = data.getInt( "luckMulti" );
            gameData["letra"] = data.getByte( "letra" );
            gameData["bonusRound"] = data.getByte( "bonusRound" );
            gameData["missionValue"] = data.get("mission_value");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["winSecondCurrency"] = data.getLong("total_win_hard_currency");
            gameData["jackpot_min_bet"] = data.getInt("jackpot_min_bet");
            gameData["puzzleCurrent"] = data.getInt("puzzle_spin_amount");
            gameData["puzzleTotal"] = data.getInt("puzzle_spin_target");
            SFSConnector.cancelExtraCallback( gameData );
        }
        else if( event.cmd == "libera" && SFSConnector.cancelExtraCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            let tempData: string = data.getUtfString("resposta");
            try{
                gameData["credito"] = parseInt( tempData.match( /\$.+(?=CA)/ )[0].replace( "$", "" ) );
            }
            catch(e){ trace( "data error" ) }
            gameData["extrasnaocompradas"] = data.getByteArray( "notBoughtEBIndex" );
            gameData["missionValue"] = data.get("mission_value");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["jackpot_min_bet"] = data.getInt("jackpot_min_bet");
            gameData["puzzleCurrent"] = data.getInt("puzzle_spin_amount");
            gameData["puzzleTotal"] = data.getInt("puzzle_spin_target");
            SFSConnector.cancelExtraCallback( gameData );
        }
        else if( event.cmd == "jogada" && SFSConnector.extraCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["credito"] = data.getDouble("creditos");
            gameData["ganho"] = data.getDouble("ganho");
            gameData["btextra"] = data.getBool("btextra");
            gameData["extra"] = data.getByte("extra");
            gameData["valorextra"] = data.getInt("valorextra");
            gameData["ebPrice"] = data.getLong("ebPrice");
            gameData["xp"] = data.getDouble("xp");
            gameData["bonusBall"] = data.getByte("bonusBall");
            gameData["eb_colors"] = data.getIntArray("eb_colors_buff");
            gameData["isMegaBall"] = data.getBool("isMegaBall");

            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["winSecondCurrency"] = data.getLong("total_win_hard_currency");
            gameData["buffRewardSecondCurrency"] = data.getLong("buff_reward_hard_currency");

            gameData["wonAllBells"] = data.getBool("won_all_bells");
            if( gameData["wonAllBells"] ){
                gameData["buffID"] = data.getInt( "buffID" );
                gameData["bombIndexs"] = data.getIntArray("bomb_indexs");
            }
            
            gameData["ebPosition"] = data.getInt("ebPosition");
            
            SFSConnector.extraCallback( gameData );
        }
        else if( event.cmd == "extra" && SFSConnector.extraCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            let tempData: string = data.getUtfString("ball");

            try{
                gameData["ganho"] = parseInt( tempData.match( /G\d+/ )[0].replace( "G", "" ) );
                gameData["credito"] = parseInt( tempData.match( /\$.+(?=CA)/ )[0].replace( "$", "" ) );
                gameData["extra"] = parseInt( tempData.match( /X\d+/ )[0].replace( "X", "" ) );

                let save = tempData.match( /P\d+[EF]/g );
                if( save && save.length ){
                    gameData["save"] = parseInt( save[0].replace( "P", "" ).replace( "E", "" ).replace( "F", "" ) );
                }
            }
            catch(e){}
            gameData["btextra"] = tempData.indexOf( "E" ) > 0;
            if( gameData["btextra"] )gameData["valorextra"] = parseInt( tempData.substr( tempData.indexOf( "E" ) + 1 ) );

            gameData["xp"] = data.getDouble("xp");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["isMegaBall"] = data.getBool("isMegaBall");
            if( gameData["isMegaBall"] )gameData["valorextra"] = data.getLong("ebPrice");

            SFSConnector.extraCallback( gameData );
        }
        else if( event.cmd == "atualizaacumulado" && SFSConnector.jackpotCallbak ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["acumulado"] = data.getDouble("acumulado");
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
        else if( event.cmd == "buffHandler" && SFSConnector.buffHandlerCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["buffValue"] = data.getInt("buffValue");
            gameData["buff_dices"] = data.getIntArray("buff_dices");
            gameData["add_buff_state"] = data.getBool( "add_buff_state" );
            gameData["buff_pos"] = data.getInt( "buff_pos" );
            gameData["buffMaxValue"] = data.getInt( "buff_max_value" );

            gameData["mark_column"] = data.getIntArray( "mark_column_nums_buff" );
            gameData["mark_on_card"] = data.getIntArray( "mark_num_per_card_buff" );
            gameData["rewardNumIndex"] = data.getInt( "rewardNumIndex" );
            gameData["roll_again_price"] = data.getInt( "roll_again_price" );
            gameData["double_buff_rounds_price"] = data.getInt( "double_buff_rounds_price" );
            gameData["secondCurrency"] = data.getLong( "hard_currency" );
            gameData["xp"] = data.getDouble( "xp" );
            SFSConnector.buffHandlerCallback( gameData );
            return;
        }
        else if( event.cmd == "select_num_handler" && SFSConnector.selectNumberCallback ){
            var data : any = event.params;
            var gameData: Object = {};
            gameData["credito"] = data.getDouble("creditos");
            gameData["ganho"] = data.getDouble("ganho");
            gameData["btextra"] = data.getBool("tembolaextra");
            gameData["bolas"] = data.getByteArray("bolas");
            gameData["valorextra"] = data.getInt("valorextra");
            gameData["ebPrice"] = data.getLong("ebPrice");
            gameData["xp"] = data.getDouble("xp");

            SFSConnector.selectNumberCallback( gameData );
            return;
        }
        else if (event.cmd === "goKartHandler" && SFSConnector.goKartHandlerCallback) {
            var data: any = event.params;
            var gameData: Object = {};
            gameData["isGetTurbo"] = data.getBool("isGetTurbo");
            gameData["select_gokart_state"] = data.getBool("select_gokart_state");
            gameData["buffReward"] = data.getLong("buffReward");
            gameData["buff_pos"] = data.getInt("buff_pos");
            gameData["buffValue"] = data.getInt("buffValue");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["buffRewardSecondCurrency"] = data.getLong("buff_reward_hard_currency");
            SFSConnector.goKartHandlerCallback(gameData);
        }
        else if (event.cmd === "lemon_game_handler" && SFSConnector.lemonGameCallback ){
            var data: any = event.params;
            var gameData: Object = {};
            gameData["lemonCard"] = data.get( "lemon_games_card" );
            if( gameData["lemonCard"] ){
                gameData["lemonCard"] = { type: gameData["lemonCard"].getInt("type"), value: gameData["lemonCard"].getInt("value") };
            }
            gameData["lemonBuffsReward"] = data.getLong( "lemon_games_buffs_reward" );
            gameData["lemonPizzaMaterials"] = data.getIntArray( "lemon_games_pizza_materials" );

            var lemonBoxs = data.getSFSArray("lemon_games_boxes");
            if( lemonBoxs ){
            gameData["lemonBoxs"] = [];
                for( let i: number = 0; i < lemonBoxs.size(); i++ ){
                    gameData["lemonBoxs"][i] = {};
                    gameData["lemonBoxs"][i].type = lemonBoxs.get(i).getInt("type");
                    gameData["lemonBoxs"][i].value = lemonBoxs.get(i).getInt("value");
                }
            }

            SFSConnector.lemonGameCallback(gameData);
        }
        else if (event.cmd === "numberSelect" && SFSConnector.selectNumberCallback ){
            var data: any = event.params;
            var gameData: Object = {};
            gameData["numberIndex"] = data.getInt("numberIdx");
            gameData["uuid"] = data.getUtfString("uuid");
            gameData["energy"] = data.getDouble("energy");
            gameData["type"] = data.getUtfString("type");
            SFSConnector.selectNumberCallback(gameData);
        }
        else if (event.cmd === "usePowerUp" && SFSConnector.powerUpCallback ){
            var data: any = event.params;
            var gameData: Object = {};
            gameData["state"] = data.getBool("state");
            if( gameData["state"] ){
                gameData["auto"] = data.getBool("auto");
                gameData["powerUpType"] = data.getUtfString("powerUpType");
                gameData["luckyBall"] = data.getInt("luckyBall");

                let sfsVarCards = data.getSFSArray("cards");
                if( sfsVarCards ){
                    gameData["cards"] = [];
                    for( let i: number = 0; i < sfsVarCards.size(); i++ ){
                        gameData["cards"][i] = {};
                        gameData["cards"][i]["indexes"] = sfsVarCards.get(i).getIntArray("indexes");
                        gameData["cards"][i]["uuid"] = sfsVarCards.get(i).getUtfString("uuid");
                    }
                }
            }
            SFSConnector.powerUpCallback(gameData);
        }
        else if (event.cmd == "triggerPowerUp" && SFSConnector.triggerpowerUpCallback ){
            var data: any = event.params;
            var gameData: Object = {};
            gameData["coins"] = data.getInt("coins");
            gameData["numberIdx"] = data.getInt("numberIdx");
            gameData["balance"] = data.getDouble("balance");
            gameData["powerUpType"] = data.getUtfString("powerUpType");
            gameData["uuid"] = data.getUtfString("uuid");
            gameData["statusCode"] = data.getInt("statusCode");
            SFSConnector.triggerpowerUpCallback(gameData);
        }
        else if (event.cmd == "bingo" && SFSConnector.callBingoCallback ){
            var data: any = event.params;
            var gameData: Object = {};
            gameData["uuid"] = data.getUtfString("uuid");
            gameData["id"] = data.getInt("id");
            gameData["pattern"] = data.getUtfString("pattern");
            if( SFSConnector._sfs.lastJoinedRoom ){
                let room = SFSConnector._sfs.lastJoinedRoom;
                let winner = room.getUserById( gameData["id"] );
                if( winner ){
                    gameData["name"] = winner.getVariable("name").value;
                    gameData["fbId"] = winner.getVariable("platformId").value;
                }
            }
            SFSConnector.callBingoCallback(gameData);
        }
        else if (event.cmd == "exitsCard" && SFSConnector.existCardCallback ){
            var data: any = event.params;
            var gameData: Object = {};
            gameData["selected_multi"] = data.getInt("selected_multi");
            gameData["amount"] = data.getInt("amount");
            SFSConnector.existCardCallback( gameData );
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

        if (SFSServerCommandHandlerMapping[event.cmd]) {
            SFSServerCommandHandlerMapping[event.cmd](event.params);
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

    /**
     * login in zone
     **/
    public static loginIn(): void {
        SFSConnector._sfs.send(eval("new SFS2X.LoginRequest('243972732', '', null, 'Generic')"));
    }

    /**
     * push sfs server command handler mapping
     * @param cmd      command name
     * @param callback handler callback function
     */
    public static pushSFSServerCommandHandlerMapping(cmd: string, callback: Function, hard: boolean = false): void {
        if (!SFSServerCommandHandlerMapping[cmd] || hard) {
            SFSServerCommandHandlerMapping[cmd] = callback;
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

    /**
     * push functions in array that execute it after connection complete
     */
    public static onConnectionComplete(func: Function): void {
        connectionComplete.push(func);
    }

    public static loginTo( zona: string, room: string = null, joinRoomCallback: Function ):void{
        this.gettingRoom = room;
        this._sfs.send(eval("new SFS2X.LoginRequest('243972732', '', null, '" + zona + "')" ));
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

    public static sendPlay( key: string, bet: number, cards: number, cardGroupNumber: number, betIndex: number ): void{
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putInt( "aposta", bet );
        params.putByte( "qtd", cards );
		params.putInt( "cartela", cardGroupNumber );
        params.putInt( "bet_index", betIndex );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( key, params )"));
    }

    public static sendPlayWithCardId( key: string, bet: number, cards: number, cardGroupNumber: number, betIndex: number, cardId: number ): void{
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putInt( "aposta", bet );
        params.putByte( "qtd", cards );
		params.putInt( "cartela", cardGroupNumber );
        params.putInt( "bet_index", betIndex );
        params.putInt( "cardID", cardId );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( key, params )"));
    }

    public static sendPlayWithNumbers( key: string, bet: number, cards: number, cardGroupNumber: number, betIndex: number, cardNumbers: Array<number> ): void{
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putInt( "aposta", bet );
        params.putByte( "qtd", cards );
		params.putInt( "cartela", cardGroupNumber );
        params.putInt( "bet_index", betIndex );
        params.putByteArray( "selected_card_nums", cardNumbers );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( key, params )"));
    }

    public static sedRound( key: string, bet: number, cards: number, cardGroupNumber: number, betIndex: number ): void{
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putInt( "aposta", bet );
        params.putByte( "qtdCartelasAbertas", cards );
		params.putInt( "numCartela", cardGroupNumber );
        params.putInt( "bet_index", betIndex );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( key, params )"));
    }

    public static roundOver(){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putBool("stauto", false );
        params.putBool("finalizar", true);
        trace( params.getDump() )
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'executado', params )"));
    }

    public static libera(){
        var params:any = eval( "new SFS2X.SFSObject()" );
        trace( params.getDump() )
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'finaliza', params )"));
    }

    public static cancelExtra( extraString: boolean ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        trace( params.getDump() )
        if( extraString ) SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'finaliza', params )"));
        else SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'creditar', params )"));
    }

    public static extra( extraString: boolean, saving: boolean ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        trace( params.getDump() );
        if( extraString ) {
            if( saving ) SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'poupanca', params )"));
            else SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'extra', params )"));
        }
        else SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'solicitajogada', params )"));
    }

    public static bonusGameSpin( bet: number ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putInt( "bet", bet );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'bonusGame', params )"));
    }

    public static buffHandler( action: string, bet: number ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putUtfString( "action", action );
        params.putInt( "currentBet", bet );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'buffHandler', params )"));
    }

    public static selectNumber( num: number ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putInt( "selectedBallNum", num );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'select_num_handler', params )"));
    }

    public static goKartHandler(action: string, rewardType: number) {
        var params: any = eval("new SFS2X.SFSObject()");
        params.putUtfString("action", action);
        if (rewardType !== -1) params.putInt("rewardType", rewardType);
        trace(params.getDump());
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest('goKartHandler', params)"));
    }

    public static lemonGame( action: string, bet: number, type: number, boxIndex: number ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putUtfString( "action", action );
        params.putInt( "currentBet", bet );
        params.putInt( "clubs_type", type );
        params.putInt( "box_index", boxIndex );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'lemon_game_handler', params )"));
    }

    public static reloadGamesetting( name: string, pass: string ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putUtfString( "name", name );
        params.putUtfString( "pass", pass );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'reload_gamesetting', params )"));
    }

    public static buyCard( amount: number, multiple: number ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putInt( "amount", amount );
        params.putInt( "multiple", multiple );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'buyCard', params, SFSConnector._sfs.lastJoinedRoom )"));
    }

    public static numberSelect( uuid: string, gridIndex: number ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putUtfString( "uuid", uuid );
        params.putInt( "index", gridIndex );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'numberSelect', params, SFSConnector._sfs.lastJoinedRoom )"));
    }

    public static triggerPowerUp( type: string, uuid: string, gridIndex: number ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putUtfString( "type", type );
        if( uuid ){
            params.putUtfString( "uuid", uuid );
            params.putInt( "index", gridIndex );
        }
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'triggerPowerUp', params, SFSConnector._sfs.lastJoinedRoom )"));
    }

    public static powerUp( type: string ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putUtfString( "type", type );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'usePowerUp', params, SFSConnector._sfs.lastJoinedRoom )"));
    }

    public static callBingo( uuid: string ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putUtfString( "uuid", uuid );
        let sfsArr = eval( "new SFS2X.SFSArray()" );
        params.putSFSArray( "selectedNumbers", sfsArr );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'bingo', params, SFSConnector._sfs.lastJoinedRoom )"));
    }

    public static sendChatMessage( message: string ){
        SFSConnector._sfs.send(eval("new SFS2X.PublicMessageRequest( message )"));
    }
}
//,"src/javascripts/sfs2x-api-1.7.5.js"
class SFSConnector {
    private static _config: any;
    private static _sfs: any;
    private static connection: boolean;
    private static login: boolean;

    private static gettingRoom: string;
    private static joinRoomCallback: Function;
    public static selectNumberCallback: Function;
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
    public static buyCardFeatureCallback: Function;
    public static buyFeatureCallback: Function;
    public static luckNumberCallback: Function;
    public static onCardPriceCallback: Function;
    public static onResumeCallback: Function;
    public static onEnterCallback: Function;
    public static onPreBuyCard: Function;
    public static onBlackoutBallCallback: Function;
    public static onBlackoutMatching: Function;
    public static onPastJoinedRoomCallback: Function;

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

        if( SFSConnector.gettingRoom == "Multi75" ) return;
        SFSConnector._sfs.send(eval("new SFS2X.JoinRoomRequest('" + SFSConnector.gettingRoom + "')"));
        SFSConnector.gettingRoom = null;
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
            let patternValue = arr.get(0).getFloat("value");
            SFSConnector.multiPlayerCallback( "cardPrize", cardPrize );
            SFSConnector.multiPlayerCallback( "patternValue", patternValue );

            SFSConnector.multiPlayerCallback( "enterGameState", room.getVariable( "gameState" ).value );
            let specialPattern = room.getVariable( "treasure_hunt_pattern_format" );
            if( specialPattern ) SFSConnector.multiPlayerCallback( "treasure_hunt_pattern_format", specialPattern.value );

            let tmocb: Array<number> = MaraPayForBingoDataFormat.getTmocb( room.getVariable( "tournament_multi_on_call_bingo" ) );
            if( tmocb )SFSConnector.multiPlayerCallback( "tournament_multi_on_call_bingo", tmocb );

            if( room.getVariable( "current_treasure_hunt_prize" ) != null ){
                SFSConnector.multiPlayerCallback( "current_treasure_hunt_prize", room.getVariable( "current_treasure_hunt_prize" ).value );
            }

            if( room.getVariable( "ballSpeed" ) != null ){
                SFSConnector.multiPlayerCallback( "ballSpeed", room.getVariable( "ballSpeed" ).value );
            }

            setTimeout( this.updataCardsAndPlayers.bind(this), 1000, true );
        }
    }

    /**
     * join room error callback
     **/
    private onJoinRoomError(event): void {
        console.error("join room failed! " + event.errorMessage);
    }

    private onUserVarUpdate(event): void {
        if (!event.user.isItMe) return;

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
                gameData[i]["bingo"] = arr.get(i).getBool("bingo");
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
            let data: Object = { credito: SFSConnector._sfs.mySelf.getVariable( "soft_money" ).value, xp: SFSConnector._sfs.mySelf.getVariable( "xp" ).value };
            let dinero: any = SFSConnector._sfs.mySelf.getVariable( "hard_currency" );
            if( dinero ) data["secondCurrency"] = dinero.value;
            SFSConnector.coinsChangeCallback( data );
        }

        if( SFSConnector.luckNumberCallback && event.changedVars.indexOf( "luckNums" ) >= 0 ){
            let luckNums = SFSConnector._sfs.mySelf.getVariable( "luckNums" ).value;
            let luckNumsArr: Array<number> = [];
            for( let j: number = 0; j < luckNums.size(); j++ ){
                luckNumsArr[j] = luckNums.get(j)
            }
            SFSConnector.luckNumberCallback( luckNumsArr );
        }

        if( SFSConnector.onBlackoutBallCallback && event.changedVars.indexOf( "calledBingoNumbers" ) >= 0 ){
            let balls = SFSConnector._sfs.mySelf.getVariable( "calledBingoNumbers" ).value;
            let ballIndex: number = 0;
            let lastBall: number;
            let ballArr = [];
            while( lastBall = balls.getInt( ballIndex++ ) ){
                ballArr.push( { lastBall: lastBall, ballIndex: ballIndex } );
            }
            SFSConnector.onBlackoutBallCallback( ballArr );
        }

        if( SFSConnector.onPastJoinedRoomCallback && event.changedVars.indexOf( "pastJoinedRoom" ) >= 0 ){
            let pastJoinedRoom = SFSConnector._sfs.mySelf.getVariable( "pastJoinedRoom" ).value;
            let joinedRoomData = {
                "coinsType": pastJoinedRoom.getInt("coinsType"),
                "award": pastJoinedRoom.getLong("award"),
                "collected": pastJoinedRoom.getBool("collected"),
                "id": pastJoinedRoom.getUtfString("id"),
                "createAt": pastJoinedRoom.getUtfString("createAt")
            };
            trace( pastJoinedRoom.getDump() );
            SFSConnector.onPastJoinedRoomCallback( joinedRoomData );
        }
        trace( "onUserVarUpdate" );
        trace( event.changedVars );
        trace( SFSConnector._sfs.mySelf.getVariables() );
    }

    public static get userMultiplier(): number{
        let multiplier: number = 0;
        if( SFSConnector._sfs.mySelf && SFSConnector._sfs.mySelf.getVariable( "multiplier" ) ) multiplier = SFSConnector._sfs.mySelf.getVariable( "multiplier" ).value;
        return multiplier;
    }

    public static get multiPlayerPattens(): Array<Object>{
        let vc = SFSConnector._sfs.lastJoinedRoom.getVariable( "gamePattern" );
        if( !vc ) return null;
        let arr = SFSConnector._sfs.lastJoinedRoom.getVariable( "gamePattern" ).value;
        let changeValue: Array<Object> = [];
        for( let j: number = 0; j < arr.size(); j++ ){
            changeValue[j] = {};
            changeValue[j]["patternName"] = arr.get(j).getUtfString("patternName");
        }
        return changeValue;
    }

    public static get totalWinCount(): number{
        let vc = SFSConnector._sfs.lastJoinedRoom.getVariable( "totalWinCount" );
        if( vc ) return vc.value;
        return NaN;
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
                    if( event.changedVars.length > 2 )continue;
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
                case "gameState":
                    changeValue = changedObject;
                    break;
                case "cardCount":
                    this.updataCardsAndPlayers();
                    break;
                case "totalWinCount":
                    changeValue = changedObject;
                    break;
                case "treasure_hunt_pattern_format":
                    changeValue = changedObject;
                    break;
                case "current_treasure_hunt_prize":
                    changeValue = changedObject;
                    break;
                case "tournament_multi_on_call_bingo":
                    changeValue = MaraPayForBingoDataFormat.getTmocb( room.getVariable( "tournament_multi_on_call_bingo" ) );
                    break;
                case "pointsByPlayer":
                    let pointsByPlayer: any = room.getVariable( "pointsByPlayer" ).value;
                    changeValue = [];
                    for( let i: number = 0; i < pointsByPlayer.size(); i++ ){
                        changeValue[i] = {};
                        changeValue[i].userId = pointsByPlayer.get(i).getUtfString("playerId");
                        changeValue[i].selfRoundOver = pointsByPlayer.get(i).getBool("selfRoundOver");
                        changeValue[i].points = pointsByPlayer.get(i).getInt("points");
                        if( changeValue[i].userId == PlayerConfig.player( "user.id" ) ){
                            changeValue[i].fastMarkBonus = pointsByPlayer.get(i).getInt("fastMarkBonus");
                            changeValue[i].penalties = pointsByPlayer.get(i).getInt("penalties");
                            changeValue[i].doubleBonus = pointsByPlayer.get(i).getInt("doubleBonus");
                            changeValue[i].bingo = pointsByPlayer.get(i).getInt("bingo");
                            changeValue[i].multiBingo = pointsByPlayer.get(i).getInt("multiBingo");
                            changeValue[i].markNum = pointsByPlayer.get(i).getInt("markNum");
                        }
                    }
                    break;
                case "awardByPlayer":
                    let awardByPlayer: any = room.getVariable( "awardByPlayer" ).value;
                    changeValue = {};
                    changeValue.userId = awardByPlayer.getUtfString("playerId");
                    changeValue.award = awardByPlayer.getLong("award");
                    changeValue.coinsType = awardByPlayer.getInt("coinsType");
                    break;
                default: 
                    trace( changedItemName );
                    trace( changedObject );
                    continue;
            }
            if( "calledBingoNumbers" == changedItemName ) trace( changeValue[changeValue.length-1] );
            else trace( changeValue );
            if( SFSConnector.multiPlayerCallback ) SFSConnector.multiPlayerCallback( changedItemName, changeValue );
        }
    }

    private onUserEnterRoom(event): void{
        if (SFSConnector.otherJoinRoomCallback) {
            var userName = event.user.containsVariable("name") ? event.user.getVariable("name").value : "";
            var fbId = event.user.containsVariable("platformId") ? event.user.getVariable("platformId").value : "";
            var userId = event.user.containsVariable("external_uid") ? event.user.getVariable("external_uid").value : "";
            SFSConnector.otherJoinRoomCallback( userName, fbId, userId );
        }
    }

    private onUserExitRoom(event): void{
        trace( "onUserExitRoom" );
        this.updataCardsAndPlayers( true );
    }

    private updataCardsAndPlayers( roomPlayerChange: boolean = false ): void{
        if( SFSConnector.cardsAndPlayersCallback ){
            let room = SFSConnector._sfs.lastJoinedRoom;
            if (room) {
                var gameData: Object = {};
                gameData["cardCount"] = room.getVariable( "cardCount" ).value;
                gameData["playerCound"] = room.getPlayerList().length;
                gameData["buyCardPlayersAmount"] = room.getVariable("totalBuyCardPlayerAmount").value || 0;
                if( roomPlayerChange ){
                    gameData["players"] = [];
                    let playerList = room.getPlayerList();
                    for( let i: number = 0; i < playerList.length; i++ ){
                        let name = playerList[i].getVariable("name");
                        let platformId = playerList[i].getVariable("platformId");
                    	let userId = playerList[i].getVariable("external_uid");
                        let obj: Object = {};
                        if( name ) obj["name"] = name.value;
                        if( platformId ) obj["headUrl"] = platformId.value;
                    	if( userId ) obj["userId"] = userId.value;
                    	if( userId && platformId ) gameData["players"].push( obj );
                    }
                }
                SFSConnector.cardsAndPlayersCallback( gameData );
            }
        }
    }

    private onUserMessage(event): void{
        if( SFSConnector.roomMessageCallback ){
            let name = event.sender.getVariable("name");
            if( name ) SFSConnector.roomMessageCallback( name.value, event.message, event.sender.getVariable("platformId").value, event.sender.getVariable( "pid").value );
            else SFSConnector.roomMessageCallback( null, event.message, event.sender.getVariable("platformId").value, event.sender.getVariable( "pid").value );
        }
    }

    /**
     * sfs server extension response callback
     */
    private onSfsExtensionResponse(event): void {
        trace( "onSfsExtensionResponse" );
        trace( event.cmd );
        trace( event.params.getDump() );
        if( event.cmd == "select_num_handler" && SFSConnector.selectNumberCallback ){
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
        else if (event.cmd === "numberSelect" && SFSConnector.selectNumberCallback ){
            var data: any = event.params;
            var gameData: Object = {};
            gameData["numberIndex"] = data.getInt("numberIdx");
            gameData["uuid"] = data.getUtfString("uuid");
            gameData["energy"] = data.getDouble("energy");
            gameData["type"] = data.getUtfString("type");
            gameData["userId"] = data.getUtfString("userId");
            let luckFeatures = data.getSFSArray("luck_features");
            if( luckFeatures ){
                gameData["luckFeatures"] = [];
                for( let i: number = 0; i < luckFeatures.size(); i++ ){
                    gameData["luckFeatures"][i] = {};
                    gameData["luckFeatures"][i]["name"] = luckFeatures.get(i).getUtfString("name");
                    gameData["luckFeatures"][i]["id"] = luckFeatures.get(i).getUtfString("id");
                }
            }
            gameData["points"] = data.getInt("points");
            gameData["powerupId"] = data.getUtfString("powerup_id");
            gameData["timeLeft"] = data.getInt("time_left");
            gameData["currentPoints"] = data.getInt("current_points");
            gameData["doublePoints"] = data.getInt("double_points_award");
            if( gameData["doublePoints"] ) gameData["currentPoints"] += gameData["doublePoints"];
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
                let luckFeatures = data.getSFSArray("luck_features");
                if( luckFeatures ){
                    gameData["luckFeatures"] = [];
                    for( let i: number = 0; i < luckFeatures.size(); i++ ){
                        gameData["luckFeatures"][i] = {};
                        gameData["luckFeatures"][i]["name"] = luckFeatures.get(i).getUtfString("name");
                        gameData["luckFeatures"][i]["id"] = luckFeatures.get(i).getUtfString("id");
                    }
                }
                gameData["luckNumbers"] = data.getIntArray("luck_nums");
                gameData["userId"] = data.getUtfString("userId");
                gameData["timeLeft"] = data.getInt("time_left");
                gameData["powerUpId"] = data.getUtfString("powerup_id");

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
            gameData["greenPrize"] = data.getLong("green_bait_luck_pos_prize");
            gameData["redPrize"] = data.getLong("red_bait_luck_pos_prize");
            gameData["orangePrize"] = data.getLong("orange_bait_luck_exp");
            gameData["refreshCard"] = data.getBool("refresh_card");
            let pearlGrids = data.get( "pearl_have_got_luck_pos" );
            if( pearlGrids ) gameData["pearlGrids"] = MaraPayForBingoDataFormat.pearlLuckPos( pearlGrids, gameData["uuid"] );
            gameData["guessNumPrize"] = data.getLong("guess_num_prize");
            SFSConnector.triggerpowerUpCallback(gameData);
        }
        else if (event.cmd == "bingo" && SFSConnector.callBingoCallback ){
            var data: any = event.params;
            var gameData: Object = {};
            gameData["uuid"] = data.getUtfString("uuid");
            gameData["id"] = data.getInt("id");
            gameData["pattern"] = data.getUtfString("pattern");
            gameData["is_fake"] = data.getBool("is_fake");
            if( SFSConnector._sfs.lastJoinedRoom ){
                let room = SFSConnector._sfs.lastJoinedRoom;
                let winner = room.getUserById( gameData["id"] );
                if( winner ){
                    let name = winner.getVariable("name"), platformId = winner.getVariable("platformId");
                    if (name) gameData["name"] = name.value;
                    if (platformId) gameData["fbId"] = platformId.value;
                    gameData["isMe"] = winner.isItMe;
                }
            }
            gameData["userId"] = data.getUtfString("userId");
            gameData["points"] = data.getInt("points");
            let patternsByUUID = data.getSFSArray("patternsByUUID");
            if( patternsByUUID ){
                gameData["patternsByUUID"] = [];
                for( let i: number = 0; i < patternsByUUID.size(); i++ ){
                    gameData["patternsByUUID"][i] = {};
                    gameData["patternsByUUID"][i]["patterns"] = patternsByUUID.get(i).getUtfStringArray("patterns");
                    gameData["patternsByUUID"][i]["uuid"] = patternsByUUID.get(i).getUtfString("uuid");
                }
            }
            gameData["currentPoints"] = data.getInt("current_points");
            gameData["doublePoints"] = data.getInt("double_points_award");
            if( gameData["doublePoints"] ) gameData["currentPoints"] += gameData["doublePoints"];
            SFSConnector.callBingoCallback(gameData);
        }
        else if (event.cmd == "buyCard" && SFSConnector.buyCardFeatureCallback ){
            var data: any = event.params;
            var gameData: Object = {};
            let availableFeatures = data.getSFSArray("available_features");
            if( availableFeatures ){
                gameData["availableFeatures"] = [];
                for( let i: number = 0; i < availableFeatures.size(); i++ ){
                    gameData["availableFeatures"][i] = {};
                    gameData["availableFeatures"][i]["name"] = availableFeatures.get(i).getUtfString("name");
                    gameData["availableFeatures"][i]["type"] = availableFeatures.get(i).getUtfString("coinsType");
                    gameData["availableFeatures"][i]["price"] = availableFeatures.get(i).getInt("price");
                }
            }
            SFSConnector.buyCardFeatureCallback( gameData );
        }
        else if (event.cmd == "payForBingo" && SFSConnector.buyFeatureCallback ){
            let gameData: Object = MaraPayForBingoDataFormat.parseObject( event.params );
            SFSConnector.buyFeatureCallback( gameData );
        }
        else if (event.cmd == "resume" && SFSConnector.onResumeCallback ){
            var gameData: Object = MaraPayForBingoDataFormat.resumeData( event.params );
            SFSConnector.onResumeCallback( gameData );
        }
        else if (event.cmd === "erro") {
            let info = event.params.get("mensagem");
            console.log("----   SFSConnector -> onSfsExtensionResponse[erro]:");
            console.log(info);
        } else if (event.cmd === "afterJoinRoom" && ( SFSConnector.existCardCallback || SFSConnector.onCardPriceCallback || SFSConnector.onEnterCallback ) ) {
            var data: any = event.params;
            var gameData: Object = {};

            if (SFSConnector.existCardCallback) {
                gameData["selected_multi"] = data.getInt("selected_multi");
                gameData["amount"] = data.getInt("amount");
                SFSConnector.existCardCallback(gameData);
            }
            
            if( SFSConnector.onCardPriceCallback ){
                let cardPriceConfig = data.get("card_price_by_group");
                gameData["cardPriceConfig"] = [];
                for (let i = 0; i < cardPriceConfig.size(); i++) {
                    let config = [];
                    for (let j = 0; j < cardPriceConfig.get(i).size(); j++) {
                        config.push({
                            "coinsType": cardPriceConfig.get(i).get(j).get("coinsType"),
                            "price": cardPriceConfig.get(i).get(j).get("cardPrice")
                        });
                    }
                    gameData["cardPriceConfig"].push(config);
                }

                let betConfig = data.get("betConfig");
                gameData["betConfig"] = [];
                for (let i = 0; i < betConfig.size(); i++) {
                    gameData["betConfig"].push({
                        "bet": betConfig.get(i).get("bet"),
                        "jackpotRate": betConfig.get(i).get("jackpotRate")
                    })
                }

                SFSConnector.onCardPriceCallback(gameData);
            }

            if( SFSConnector.onEnterCallback ){
                var data: any = event.params;
                var gameData: Object = {};
                let availableFeatures = data.getSFSArray("available_features");
                if( availableFeatures ){
                    gameData["availableFeatures"] = [];
                    for( let i: number = 0; i < availableFeatures.size(); i++ ){
                        gameData["availableFeatures"][i] = {};
                        gameData["availableFeatures"][i]["name"] = availableFeatures.get(i).getUtfString("name");
                        gameData["availableFeatures"][i]["type"] = availableFeatures.get(i).getUtfString("coinsType");
                        gameData["availableFeatures"][i]["price"] = availableFeatures.get(i).getInt("price");
                    }
                }
                let havePaidFeatures = data.getSFSArray("have_paid_features"); 
                if( havePaidFeatures ){
                    gameData["havePaidFeatures"] = [];
                    for( let i: number = 0; i < havePaidFeatures.size(); i++ ){
                        gameData["havePaidFeatures"][i] = {};
                        gameData["havePaidFeatures"][i]["name"] = havePaidFeatures.get(i).getUtfString("name");
                        gameData["havePaidFeatures"][i]["type"] = havePaidFeatures.get(i).getUtfString("coinsType");
                        gameData["havePaidFeatures"][i]["price"] = havePaidFeatures.get(i).getInt("price");
                    }
                }
                gameData["multiplier"] = data.getInt("multiplier");
                gameData["points"] = data.getInt("points");
                gameData["timeLeft"] = data.getInt("time_left");
                SFSConnector.onEnterCallback( gameData );
            }
        } else if( event.cmd == "preBuyCard" && SFSConnector.onPreBuyCard ){
            var data: any = event.params;
            var gameData: Object = {};
            gameData["result"] = data.getBool("result");
            gameData["userId"] = data.getUtfString("userId");
            gameData["userIds"] = data.getUtfStringArray("userIds");
            let users = data.getSFSArray("users");
            if( users ){
                gameData["users"] = {};
                for( let i: number = 0; i < users.size(); i++ ){
                    let userId: string = users.get(i).getUtfString("userId");
                    let platformId: string = users.get(i).getUtfString("platformId");
                    let name: string = users.get(i).getUtfString("name");
                    gameData["users"][userId] = { userId: userId, fbId: platformId, name: name };
                }
            }
            SFSConnector.onPreBuyCard(gameData);
        } else if( event.cmd == "matching" && SFSConnector.onBlackoutMatching ){
            var data: any = event.params;
            var gameData: Object = {};
            gameData["result"] = data.getBool("result");
            gameData["roomName"] = data.getUtfString("roomName");
            SFSConnector.onBlackoutMatching(gameData);
        }
    }

    /**
     * login in zone
     **/
    public static loginIn(): void {
        SFSConnector._sfs.send(eval("new SFS2X.LoginRequest('" + PlayerConfig.player( "user.id" ) + "', '', null, 'Generic')"));
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

    public static blackoutTriggerPowerUp( type: string, uuid: string, gridIndex: number, powerUpId: string ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putUtfString( "type", type );
        params.putUtfString( "uuid", uuid );
        params.putInt( "index", gridIndex );
        params.putUtfString( "powerup_id", powerUpId );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'triggerPowerUp', params, SFSConnector._sfs.lastJoinedRoom )"));
    }

    public static blackoutGoldTriggerPowerUp( type: string, num: number, powerUpId: string ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putUtfString( "type", type );
        params.putInt( "choose_num", num );
        params.putUtfString( "powerup_id", powerUpId );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'triggerPowerUp', params, SFSConnector._sfs.lastJoinedRoom )"));
    }

    public static powerUp( type: string ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putUtfString( "type", type );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'usePowerUp', params, SFSConnector._sfs.lastJoinedRoom )"));
    }

    public static blackPowerUp( type: string, id: string ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putUtfString( "type", type );
        params.putUtfString( "powerup_id", id );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'usePowerUp', params, SFSConnector._sfs.lastJoinedRoom )"));
    }

    public static guessNum( num: number ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putUtfString( "type", "guessNum" );
        params.putInt( "guess_num", num );
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

    public static blackoutBingo(){
        var params:any = eval( "new SFS2X.SFSObject()" );
        trace( "bingo" );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'bingo', params, SFSConnector._sfs.lastJoinedRoom )"));
    }

    public static sendChatMessage( message: string ){
        SFSConnector._sfs.send(eval("new SFS2X.PublicMessageRequest( message )"));
    }

    public static buyFeature( featureName: string, uuid: string ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putUtfString( "powerUpType", featureName );
        if( uuid )params.putUtfString( "uuid", uuid );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'payForBingo', params, SFSConnector._sfs.lastJoinedRoom )"));
    }

    public static sendPreBuyCard( multiple: number ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putInt( "amount", 4 );
        params.putInt( "multiple", multiple );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'preBuyCard', params )"));
    }

    public static blackoutGetInRoom( roomName: string ){
        SFSConnector._sfs.send(eval("new SFS2X.JoinRoomRequest('" + roomName + "')"));
        SFSConnector.gettingRoom = null;
    }

    public static getBlackoutAward( id: string ){
        var params:any = eval( "new SFS2X.SFSObject()" );
        params.putUtfString( "collect_id", id );
        trace( params.getDump() );
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'collectAward', params )"));
    }

    public static leaveRoom(){
        SFSConnector._sfs.send(eval("new SFS2X.LeaveRoomRequest()"));
    }

    public static getRoomMate(){
        let room = SFSConnector._sfs.lastJoinedRoom;
        if (room) {
            let playerList = room.getPlayerList();
            let playersData: Array<Object> = [];
            for( let i: number = 0; i < playerList.length; i++ ){
                let name = playerList[i].getVariable("name");
                let platformId = playerList[i].getVariable("platformId");
                let userId = playerList[i].getVariable("external_uid");
                let obj: Object = {};
                if( name ) obj["name"] = name.value;
                if( platformId ) obj["headUrl"] = platformId.value;
                if( userId ) obj["userId"] = userId.value;
                if( userId ) playersData.push( obj );
            }
            return playersData;
        }
        else{
            return null;
        }
    }

    public static getUserInfoById( userId: string ): Object{
        let userManager = SFSConnector._sfs.userManager;
        let users = userManager.getUserByName(userId);
        if( !users ) return null;
        let obj: Object = {};
        obj["name"] = users.getVariable("name").value;
        obj["fbId"] = users.getVariable("platformId").value;
        return obj;
    }
}
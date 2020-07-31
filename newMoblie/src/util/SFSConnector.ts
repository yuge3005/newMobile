//,"src/javascripts/sfs2x-api-1.7.5.js"
class SFSConnector {
    private static _config: any;
    private static _sfs: any;
    private static connection: boolean;
    private static login: boolean;

    private static gettingRoom: string;
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

    constructor() {
        SFSConnector.connection = false;
        SFSConnector.login = false;
        SFSConnector._config = {
            host: "sfs.doutorbingo.com",
            port: 8443,
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
}
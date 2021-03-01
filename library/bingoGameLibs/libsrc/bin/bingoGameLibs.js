var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var GameUIItem = (function (_super) {
    __extends(GameUIItem, _super);
    function GameUIItem() {
        return _super.call(this) || this;
    }
    GameUIItem.prototype.showFreeExtraPosition = function () {
        if (!this.gratisUI)
            this.gratisUI = this.getGratisUI();
        if (this.gratisNumber <= 0)
            return;
        var ballPositionObject = BallManager.getBallLastPosition(this.gratisNumber - 1);
        this.gratisUI.x = ballPositionObject.x;
        this.gratisUI.y = ballPositionObject.y;
        this.addChildAt(this.gratisUI, this.getChildIndex(this.extraUIObject) + (this.gratisUIIsOverExtraUI ? 1 : 0));
    };
    GameUIItem.prototype.getGratisUI = function () {
        //sub class override
        return null;
    };
    return GameUIItem;
}(egret.Sprite));
__reflect(GameUIItem.prototype, "GameUIItem");
var GenericModal = (function (_super) {
    __extends(GenericModal, _super);
    function GenericModal(configUrl) {
        if (configUrl === void 0) { configUrl = null; }
        var _this = _super.call(this) || this;
        _this.enableKeyboard = false;
        _this.inited = false;
        _this.assetName = egret.getDefinitionByName(egret.getQualifiedClassName(_this)).classAssetName;
        if (_this.assetName === null || _this.assetName === "" || GenericModal.assetLoaded[_this.assetName])
            _this.init();
        else {
            if (configUrl) {
                _this.configUrl = configUrl;
                RES.getResByUrl(configUrl, _this.analyse, _this);
            }
            else
                GenericModal.loadAsset(_this.assetName, _this);
        }
        return _this;
    }
    Object.defineProperty(GenericModal, "classAssetName", {
        get: function () {
            return ""; //subclass must override
        },
        enumerable: true,
        configurable: true
    });
    GenericModal.prototype.analyse = function (result) {
        // RES.parseConfig( result, this.configUrl.replace( "data.res.json", "resource/" ) );
        GenericModal.loadAsset(this.assetName, this);
    };
    GenericModal.prototype.init = function () {
        //must be override
        this.inited = true;
        this.dispatchEvent(new egret.Event(GenericModal.GENERIC_MODAL_LOADED));
    };
    GenericModal.loadAsset = function (assetName, target) {
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loaded, target);
        RES.loadGroup(assetName);
    };
    GenericModal.loaded = function (event) {
        if (event.groupName != this["assetName"])
            return;
        GenericModal.assetLoaded[this["assetName"]] = true;
        this["init"]();
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, GenericModal.loaded, this);
    };
    GenericModal.prototype.onKeyUp = function (keyCode) { };
    GenericModal.GENERIC_MODAL_LOADED = "modalLoaded";
    GenericModal.CLOSE_MODAL = "closeModal";
    GenericModal.MODAL_COMMAND = "modalCommand";
    GenericModal.assetLoaded = new Array();
    return GenericModal;
}(egret.Sprite));
__reflect(GenericModal.prototype, "GenericModal");
var TowerGrid = (function (_super) {
    __extends(TowerGrid, _super);
    function TowerGrid() {
        var _this = _super.call(this) || this;
        _this.numTxt = MDS.addBitmapTextAt(_this, "Arial Black_fnt", 0, -CardGridColorAndSizeSettings.defaultNumberSize * 0.125, "center", CardGridColorAndSizeSettings.defaultNumberSize, CardGridColorAndSizeSettings.numberColor, CardGridColorAndSizeSettings.gridSize.x, CardGridColorAndSizeSettings.gridSize.y);
        _this._currentBgPic = _this.defaultBgPic = Com.createBitmapByName(BingoMachine.getAssetStr(CardGridUISettings.defaultBgPicName));
        _this.onEffBgPic = Com.createBitmapByName(BingoMachine.getAssetStr(CardGridUISettings.onEffBgPicName));
        _this.blink1Pic = Com.createBitmapByName(BingoMachine.getAssetStr(CardGridUISettings.blink1PicName));
        _this.blink2Pic = Com.createBitmapByName(BingoMachine.getAssetStr(CardGridUISettings.blink2PicName));
        _this.linePic = Com.createBitmapByName(BingoMachine.getAssetStr(CardGridUISettings.linePicName));
        _this.gridView = new egret.Bitmap;
        _this.addChild(_this.gridView);
        _this.gridLayer = new egret.DisplayObjectContainer;
        return _this;
    }
    Object.defineProperty(TowerGrid.prototype, "currentBgPic", {
        set: function (value) {
            this._currentBgPic = value;
            this.flushGrid();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TowerGrid.prototype, "isChecked", {
        get: function () {
            return this._isChecked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TowerGrid.prototype, "blink", {
        get: function () {
            return this._blink;
        },
        set: function (value) {
            if (this._blink == value)
                return;
            this._blink = value;
            if (!value)
                this.currentBgPic = this.defaultBgPic;
            else {
                this.numTxt.textColor = CardGridColorAndSizeSettings.numberColorOnEffect;
                this.showBlink(true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TowerGrid.prototype, "gridNumber", {
        get: function () {
            return this.num;
        },
        set: function (value) {
            this.num = value;
            this.numTxt.text = "" + value;
            if (value == 0 && CardGridUISettings.zeroUI) {
                if (!this.zeroUIBitmap)
                    this.zeroUIBitmap = Com.addBitmapAt(this, BingoMachine.getAssetStr(CardGridUISettings.zeroUI), 0, 0);
            }
            this.flushGrid();
        },
        enumerable: true,
        configurable: true
    });
    TowerGrid.prototype.flushGrid = function () {
        this.gridLayer.removeChildren();
        this.gridLayer.addChild(this._currentBgPic);
        this.gridLayer.addChild(this.numTxt);
        var ren = new egret.RenderTexture;
        ren.drawToTexture(this.gridLayer, new egret.Rectangle(0, 0, this.gridLayer.width, this.gridLayer.height));
        this.gridView.texture = ren;
    };
    TowerGrid.prototype.showEffect = function (isShow) {
        if (this.blink)
            this.blink = false;
        this._isChecked = isShow;
        if (isShow) {
            if (CardGridColorAndSizeSettings.colorNumberOnEffect)
                this.numTxt.textColor = CardGridColorAndSizeSettings.numberColorOnEffect;
            this.currentBgPic = this.onEffBgPic;
        }
        else {
            if (this.blink)
                this.blink = false;
            if (CardGridColorAndSizeSettings.colorNumberOnEffect)
                this.numTxt.textColor = CardGridColorAndSizeSettings.numberColor;
            this.currentBgPic = this.defaultBgPic;
        }
    };
    TowerGrid.prototype.showRedEffect = function () {
        this.numTxt.textColor = CardGridColorAndSizeSettings.numberColor;
        this.currentBgPic = this.linePic;
    };
    TowerGrid.prototype.showBlink = function (isShow) {
        if (isShow)
            this.currentBgPic = this.blink1Pic;
        else
            this.currentBgPic = this.blink2Pic;
    };
    return TowerGrid;
}(egret.Sprite));
__reflect(TowerGrid.prototype, "TowerGrid");
//,"src/javascripts/sfs2x-api-1.7.5.js"
var SFSConnector = (function () {
    function SFSConnector() {
        SFSConnector.connection = false;
        SFSConnector.login = false;
        if (!SFSConnector._config)
            SFSConnector._config = {
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
    SFSConnector.prototype.connection = function () {
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
            }
            else {
                console.error("SFSServer had been initilized!");
            }
        }
    };
    /**
     * show logs
     */
    SFSConnector.prototype.showSfsLogs = function (event) {
        console.log(event.message || "");
    };
    /**
     * sfs server connection callback
     */
    SFSConnector.prototype.onSfsConnection = function (event) {
        if (event.success) {
            // success
            console.log("connected to SFS Server 2X " + SFSConnector._sfs.version);
            SFSConnector.connection = true;
        }
        else {
            // failed
        }
    };
    /**
     * sfs server lost connection callback
     */
    SFSConnector.prototype.onSfsConnectionLost = function (event) {
        console.log("SFS Server connection lost!");
        console.log(event);
        alert("connection lost!");
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
    };
    /**
     * login callback
     **/
    SFSConnector.prototype.onLogin = function (event) {
        console.log("login success!");
        if (SFSConnector.gettingRoom) {
            SFSConnector._sfs.send(eval("new SFS2X.JoinRoomRequest('" + SFSConnector.gettingRoom + "')"));
            SFSConnector.gettingRoom = null;
        }
    };
    /**
     * login error callback
     **/
    SFSConnector.prototype.onLoginError = function (event) {
        console.error("login failed! " + event.errorMessage);
    };
    /**
     * join room callback
     **/
    SFSConnector.prototype.onJoinRoom = function (event) {
        console.log("join room <" + event.room + "> success!");
        if (SFSConnector.joinRoomCallback) {
            SFSConnector.joinRoomCallback();
            SFSConnector.joinRoomCallback = null;
        }
    };
    /**
     * join room error callback
     **/
    SFSConnector.prototype.onJoinRoomError = function (event) {
        console.error("join room failed! " + event.errorMessage);
    };
    /**
     * sfs server extension response callback
     */
    SFSConnector.prototype.onSfsExtensionResponse = function (event) {
        trace("onSfsExtensionResponse");
        trace(event.cmd);
        trace(event.params.getDump());
        if (event.cmd == "respostainiciar" && SFSConnector.gameInitCallback) {
            var data = event.params;
            var gameData = {};
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
            var buffWheel = data.getIntArray("buffWheel");
            if (buffWheel) {
                gameData["buffWheel"] = buffWheel;
                gameData["goKartRewards"] = data.getSFSArray("go_kart_rewards");
                var buffs = data.getSFSArray("buffs");
                gameData["buffs"] = [];
                for (var i = 0; i < buffs.size(); i++) {
                    gameData["buffs"][i] = {};
                    gameData["buffs"][i].buffValue = buffs.get(i).getInt("buffValue");
                    gameData["buffs"][i].buff_pos = buffs.get(i).getInt("buff_pos");
                    gameData["buffs"][i].buffID = buffs.get(i).getInt("buffID");
                    gameData["buffs"][i].buffMaxValue = buffs.get(i).getInt("buff_max_value");
                    gameData["buffs"][i].buffBet = buffs.get(i).getInt("buffBet");
                }
                gameData["gokartSecondCurrencyRewards"] = data.getSFSArray("go_kart_hard_currency_rewards");
            }
            var bellIndexs = data.getIntArray("bell_indexs");
            if (bellIndexs) {
                gameData["bellIndexs"] = bellIndexs;
                var lemonBuffs = data.getSFSArray("lemon_games_buffs");
                gameData["lemonBuffs"] = [];
                for (var i = 0; i < lemonBuffs.size(); i++) {
                    gameData["lemonBuffs"][i] = {};
                    gameData["lemonBuffs"][i].buffID = lemonBuffs.get(i).getInt("buffID");
                    gameData["lemonBuffs"][i].buffBet = lemonBuffs.get(i).getInt("buffBet");
                }
            }
            gameData["secondCurrency"] = data.getLong("hard_currency");
            var betConfig = data.getSFSArray("betConfig");
            if (betConfig) {
                gameData["betConfig"] = this.getBetConfig(betConfig);
            }
            gameData["freeSpin"] = data.getInt("free_spin");
            SFSConnector.gameInitCallback(gameData);
        }
        if (event.cmd == "login" && SFSConnector.gameInitCallback) {
            var data = event.params;
            var resposta = data.getUtfString("resposta");
            var gameData = {};
            gameData["credito"] = parseInt(resposta.match(/\$.+(?=CA)/)[0].replace("$", ""));
            var subResponse = resposta.substr(resposta.search("CT"));
            var codCartela = parseInt(subResponse.substr(2, 4));
            gameData["cartela"] = codCartela;
            gameData["acumulado"] = resposta.match(/AC.+(?=CT)/)[0].replace("AC", "");
            gameData["jackpot_min_bet"] = data.getInt("jackpot_min_bet");
            gameData["puzzleCurrent"] = data.getInt("puzzle_spin_amount");
            gameData["puzzleTotal"] = data.getInt("puzzle_spin_target");
            var save = resposta.match(/P\d*/g);
            if (save && save.length) {
                gameData["save"] = parseInt(save[save.length - 1].replace("P", ""));
            }
            gameData["secondCurrency"] = data.getLong("hard_currency");
            var betConfig = data.getSFSArray("betConfig");
            if (betConfig) {
                gameData["betConfig"] = this.getBetConfig(betConfig);
            }
            gameData["freeSpin"] = data.getInt("free_spin");
            SFSConnector.gameInitCallback(gameData);
            var params = eval("new SFS2X.SFSObject()");
            SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'respostalogin', params )"));
        }
        else if (event.cmd == "respostasolicitanumeros" && SFSConnector.changeNumberCallback) {
            var data = event.params;
            var gameData = {};
            gameData["cartela"] = data.getInt("cartela");
            gameData["numerosCartelas"] = data.getByteArray("numeros");
            gameData["mark_column"] = data.getIntArray("mark_column_nums_buff");
            gameData["mark_on_card"] = data.getIntArray("mark_num_per_card_buff");
            gameData["rewardNumIndex"] = data.getInt("rewardNumIndex");
            gameData["bellIndexs"] = data.getIntArray("bell_indexs");
            SFSConnector.changeNumberCallback(gameData);
        }
        else if (event.cmd == "jogada" && SFSConnector.playCallback) {
            var data = event.params;
            var gameData = {};
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
            if (!gameData["free_eb"])
                gameData["free_eb"] = data.getIntArray("freeEbs");
            gameData["cut_ball_position"] = data.getInt("random_select_ball_position_buff");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["winSecondCurrency"] = data.getLong("total_win_hard_currency");
            gameData["buffRewardSecondCurrency"] = data.getLong("buff_reward_hard_currency");
            gameData["wonAllBells"] = data.getBool("won_all_bells");
            if (gameData["wonAllBells"]) {
                gameData["buffID"] = data.getInt("buffID");
                gameData["bombIndexs"] = data.getIntArray("bomb_indexs");
            }
            gameData["bonusGame"] = data.getBool("bonusGame");
            gameData["isMegaBall"] = data.getBool("isMegaBall");
            gameData["ebPosition"] = data.getInt("ebPosition");
            var prizeBalls = data.getSFSArray("multi_prize_balls");
            if (prizeBalls) {
                gameData["prizeBalls"] = [];
                for (var i = 0; i < prizeBalls.size(); i++) {
                    gameData["prizeBalls"][i] = {};
                    gameData["prizeBalls"][i].index = prizeBalls.get(i).getInt("ball_index");
                    gameData["prizeBalls"][i].multi = prizeBalls.get(i).getInt("multi");
                }
            }
            SFSConnector.playCallback(gameData, data);
        }
        else if (event.cmd == "round" && SFSConnector.playCallback) {
            var data = event.params;
            var gameData = {};
            var tempData = data.getUtfString("balls");
            var balls = [];
            try {
                var ballString = tempData.match(/R\d+(?=G)/)[0].replace("R", "");
                for (var i = 0; i < ballString.length; i += 2) {
                    balls.push(parseInt(ballString[i] + ballString[i + 1]));
                }
            }
            catch (e) {
                trace("data error");
            }
            try {
                gameData["ganho"] = parseInt(tempData.match(/G\d+/)[0].replace("G", ""));
                gameData["credito"] = parseInt(tempData.match(/\$.+(?=CA)/)[0].replace("$", ""));
            }
            catch (e) {
                trace("data error");
            }
            gameData["btextra"] = tempData.indexOf("E") > 0;
            if (gameData["btextra"])
                gameData["valorextra"] = parseInt(tempData.substr(tempData.indexOf("E") + 1));
            gameData["bolas"] = balls;
            gameData["xp"] = data.getDouble("xp");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            SFSConnector.playCallback(gameData);
        }
        else if (event.cmd == "jogadafinalizada" && SFSConnector.roundOverCallback) {
            var data = event.params;
            var gameData = {};
            gameData["ganho"] = data.getDouble("ganho");
            gameData["credito"] = data.getDouble("creditos");
            gameData["luckMulti"] = data.getInt("luckMulti");
            gameData["letra"] = data.getByte("letra");
            gameData["bonusRound"] = data.getByte("bonusRound");
            gameData["missionValue"] = data.getLong("mission_value");
            gameData["missionTarget"] = data.getLong("mission_target");
            gameData["missionId"] = data.getLong("mission_id");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["winSecondCurrency"] = data.getLong("total_win_hard_currency");
            gameData["jackpot_min_bet"] = data.getInt("jackpot_min_bet");
            gameData["puzzleCurrent"] = data.getInt("puzzle_spin_amount");
            gameData["puzzleTotal"] = data.getInt("puzzle_spin_target");
            gameData["freeSpin"] = data.getInt("free_spin");
            SFSConnector.roundOverCallback(gameData);
        }
        else if (event.cmd == "libera" && SFSConnector.roundOverCallback) {
            var data = event.params;
            var gameData = {};
            var tempData = data.getUtfString("resposta");
            try {
                gameData["ganho"] = "unexpress";
                gameData["credito"] = parseInt(tempData.match(/\$.+(?=CA)/)[0].replace("$", ""));
            }
            catch (e) {
                trace("data error");
            }
            gameData["missionValue"] = data.getLong("mission_value");
            gameData["missionTarget"] = data.getLong("mission_target");
            gameData["missionId"] = data.getLong("mission_id");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["jackpot_min_bet"] = data.getInt("jackpot_min_bet");
            gameData["puzzleCurrent"] = data.getInt("puzzle_spin_amount");
            gameData["puzzleTotal"] = data.getInt("puzzle_spin_target");
            gameData["freeSpin"] = data.getInt("free_spin");
            SFSConnector.roundOverCallback(gameData);
        }
        else if (event.cmd == "jogadafinalizada" && SFSConnector.cancelExtraCallback) {
            var data = event.params;
            var gameData = {};
            gameData["ganho"] = data.getDouble("ganho");
            gameData["credito"] = data.getDouble("creditos");
            gameData["extrasnaocompradas"] = data.getByteArray("extrasnaocompradas");
            gameData["luckMulti"] = data.getInt("luckMulti");
            gameData["letra"] = data.getByte("letra");
            gameData["bonusRound"] = data.getByte("bonusRound");
            gameData["missionValue"] = data.getLong("mission_value");
            gameData["missionTarget"] = data.getLong("mission_target");
            gameData["missionId"] = data.getLong("mission_id");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["winSecondCurrency"] = data.getLong("total_win_hard_currency");
            gameData["jackpot_min_bet"] = data.getInt("jackpot_min_bet");
            gameData["puzzleCurrent"] = data.getInt("puzzle_spin_amount");
            gameData["puzzleTotal"] = data.getInt("puzzle_spin_target");
            gameData["freeSpin"] = data.getInt("free_spin");
            SFSConnector.cancelExtraCallback(gameData);
        }
        else if (event.cmd == "libera" && SFSConnector.cancelExtraCallback) {
            var data = event.params;
            var gameData = {};
            var tempData = data.getUtfString("resposta");
            try {
                gameData["credito"] = parseInt(tempData.match(/\$.+(?=CA)/)[0].replace("$", ""));
            }
            catch (e) {
                trace("data error");
            }
            gameData["extrasnaocompradas"] = data.getByteArray("notBoughtEBIndex");
            gameData["missionValue"] = data.getLong("mission_value");
            gameData["missionTarget"] = data.getLong("mission_target");
            gameData["missionId"] = data.getLong("mission_id");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["jackpot_min_bet"] = data.getInt("jackpot_min_bet");
            gameData["puzzleCurrent"] = data.getInt("puzzle_spin_amount");
            gameData["puzzleTotal"] = data.getInt("puzzle_spin_target");
            gameData["freeSpin"] = data.getInt("free_spin");
            SFSConnector.cancelExtraCallback(gameData);
        }
        else if (event.cmd == "jogada" && SFSConnector.extraCallback) {
            var data = event.params;
            var gameData = {};
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
            gameData["bonusGame"] = data.getBool("bonusGame");
            gameData["wonAllBells"] = data.getBool("won_all_bells");
            if (gameData["wonAllBells"]) {
                gameData["buffID"] = data.getInt("buffID");
                gameData["bombIndexs"] = data.getIntArray("bomb_indexs");
            }
            gameData["ebPosition"] = data.getInt("ebPosition");
            SFSConnector.extraCallback(gameData);
        }
        else if (event.cmd == "extra" && SFSConnector.extraCallback) {
            var data = event.params;
            var gameData = {};
            var tempData = data.getUtfString("ball");
            try {
                gameData["ganho"] = parseInt(tempData.match(/G\d+/)[0].replace("G", ""));
                gameData["credito"] = parseInt(tempData.match(/\$.+(?=CA)/)[0].replace("$", ""));
                gameData["extra"] = parseInt(tempData.match(/X\d+/)[0].replace("X", ""));
                var save = tempData.match(/P\d+[EF]/g);
                if (save && save.length) {
                    gameData["save"] = parseInt(save[0].replace("P", "").replace("E", "").replace("F", ""));
                }
            }
            catch (e) { }
            gameData["btextra"] = tempData.indexOf("E") > 0;
            if (gameData["btextra"])
                gameData["valorextra"] = parseInt(tempData.substr(tempData.indexOf("E") + 1));
            gameData["xp"] = data.getDouble("xp");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["isMegaBall"] = data.getBool("isMegaBall");
            if (gameData["isMegaBall"])
                gameData["valorextra"] = data.getLong("ebPrice");
            SFSConnector.extraCallback(gameData);
        }
        else if (event.cmd == "atualizaacumulado" && SFSConnector.jackpotCallbak) {
            var data = event.params;
            var gameData = {};
            gameData["acumulado"] = data.getDouble("acumulado");
            SFSConnector.jackpotCallbak(gameData);
            return;
        }
        else if (event.cmd == "jackpotWin" && SFSConnector.jackpotWinCallbak) {
            var data = event.params;
            var gameData = {};
            gameData["id"] = data.getUtfString("user_id");
            // gameData["jackpot"] = data.getLong("jackpot");
            gameData["jackpot"] = data.getLong("jackpotWin");
            SFSConnector.jackpotWinCallbak(gameData);
            return;
        }
        else if (event.cmd == "bonusGame" && SFSConnector.bonusGameSpinCallback) {
            var data = event.params;
            var gameData = {};
            gameData["over"] = data.getBool("over");
            gameData["prize"] = data.getDouble("prize");
            gameData["prizeIconIdx"] = data.getUtfStringArray("prizeIconIdx");
            gameData["iconIdx"] = data.getUtfStringArray("iconIdx");
            SFSConnector.bonusGameSpinCallback(gameData);
            return;
        }
        else if (event.cmd == "buffHandler" && SFSConnector.buffHandlerCallback) {
            var data = event.params;
            var gameData = {};
            gameData["buffValue"] = data.getInt("buffValue");
            gameData["buff_dices"] = data.getIntArray("buff_dices");
            gameData["add_buff_state"] = data.getBool("add_buff_state");
            gameData["buff_pos"] = data.getInt("buff_pos");
            gameData["buffMaxValue"] = data.getInt("buff_max_value");
            gameData["mark_column"] = data.getIntArray("mark_column_nums_buff");
            gameData["mark_on_card"] = data.getIntArray("mark_num_per_card_buff");
            gameData["rewardNumIndex"] = data.getInt("rewardNumIndex");
            gameData["roll_again_price"] = data.getInt("roll_again_price");
            gameData["double_buff_rounds_price"] = data.getInt("double_buff_rounds_price");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["xp"] = data.getDouble("xp");
            SFSConnector.buffHandlerCallback(gameData);
            return;
        }
        else if (event.cmd == "select_num_handler" && SFSConnector.selectNumberCallback) {
            var data = event.params;
            var gameData = {};
            gameData["credito"] = data.getDouble("creditos");
            gameData["ganho"] = data.getDouble("ganho");
            gameData["btextra"] = data.getBool("tembolaextra");
            gameData["bolas"] = data.getByteArray("bolas");
            gameData["valorextra"] = data.getInt("valorextra");
            gameData["ebPrice"] = data.getLong("ebPrice");
            gameData["xp"] = data.getDouble("xp");
            SFSConnector.selectNumberCallback(gameData);
            return;
        }
        else if (event.cmd === "goKartHandler" && SFSConnector.goKartHandlerCallback) {
            var data = event.params;
            var gameData = {};
            gameData["isGetTurbo"] = data.getBool("isGetTurbo");
            gameData["select_gokart_state"] = data.getBool("select_gokart_state");
            gameData["buffReward"] = data.getLong("buffReward");
            gameData["buff_pos"] = data.getInt("buff_pos");
            gameData["buffValue"] = data.getInt("buffValue");
            gameData["secondCurrency"] = data.getLong("hard_currency");
            gameData["buffRewardSecondCurrency"] = data.getLong("buff_reward_hard_currency");
            SFSConnector.goKartHandlerCallback(gameData);
        }
        else if (event.cmd === "lemon_game_handler" && SFSConnector.lemonGameCallback) {
            var data = event.params;
            var gameData = {};
            gameData["lemonCard"] = data.get("lemon_games_card");
            if (gameData["lemonCard"]) {
                gameData["lemonCard"] = { type: gameData["lemonCard"].getInt("type"), value: gameData["lemonCard"].getInt("value") };
            }
            gameData["lemonBuffsReward"] = data.getLong("lemon_games_buffs_reward");
            gameData["lemonPizzaMaterials"] = data.getIntArray("lemon_games_pizza_materials");
            var lemonBoxs = data.getSFSArray("lemon_games_boxes");
            if (lemonBoxs) {
                gameData["lemonBoxs"] = [];
                for (var i = 0; i < lemonBoxs.size(); i++) {
                    gameData["lemonBoxs"][i] = {};
                    gameData["lemonBoxs"][i].type = lemonBoxs.get(i).getInt("type");
                    gameData["lemonBoxs"][i].value = lemonBoxs.get(i).getInt("value");
                }
            }
            SFSConnector.lemonGameCallback(gameData);
        }
        else if (event.cmd === "erro") {
            var info = event.params.get("mensagem");
            console.log("----   SFSConnector -> onSfsExtensionResponse[erro]:");
            console.log(info);
            if (info == "Saldo insuficiente") {
                if (SFSConnector.playCallback || SFSConnector.extraCallback) {
                    var callbackFun = SFSConnector.playCallback;
                    if (!callbackFun)
                        callbackFun = SFSConnector.extraCallback;
                    callbackFun(null);
                }
            }
        }
        else if (event.cmd.indexOf("trm.") == 0 && SFSConnector.tounamentCallback) {
            SFSConnector.tounamentCallback(event.cmd, event.params);
        }
    };
    /**
     * send cmd request to sfs server
     * @param cmd    the sfs server request command object
     * @param params request parameters
     **/
    SFSConnector.send = function (cmd, params) {
        if (eval("SFS2X")) {
            if (SFSConnector.connection) {
                SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest(cmd, params)"));
            }
            else {
                console.error("SFS Server connection failed!");
            }
        }
        else {
            console.log("Object SFS2X is not defined!");
        }
    };
    SFSConnector.prototype.getBetConfig = function (configData) {
        var ar = [];
        for (var i = 0; i < configData.size(); i++) {
            ar[i] = {};
            ar[i]["bet"] = configData.get(i).getInt("bet");
            ar[i]["jackpotRate"] = configData.get(i).getDouble("jackpotRate");
        }
        return ar;
    };
    SFSConnector.loginTo = function (zona, room, joinRoomCallback) {
        if (room === void 0) { room = null; }
        this.gettingRoom = room;
        this._sfs.send(eval("new SFS2X.LoginRequest('" + PlayerConfig.player("user.id") + "', '', null, '" + zona + "')"));
        this.joinRoomCallback = joinRoomCallback;
    };
    SFSConnector.sendMessage = function (key, value) {
        var params = eval("new SFS2X.SFSObject()");
        for (var ob in value) {
            if (ob == "version")
                params.putInt(ob, value[ob]);
            else
                params.putUtfString(ob, value[ob]);
        }
        trace("send:ExtensionRequest," + key);
        trace(params.getDump());
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( key, params )"));
    };
    SFSConnector.sendPlay = function (key, bet, cards, cardGroupNumber, betIndex) {
        var params = eval("new SFS2X.SFSObject()");
        params.putInt("aposta", bet);
        params.putByte("qtd", cards);
        params.putInt("cartela", cardGroupNumber);
        params.putInt("bet_index", betIndex);
        trace(params.getDump());
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( key, params )"));
    };
    SFSConnector.sendPlayWithCardId = function (key, bet, cards, cardGroupNumber, betIndex, cardId) {
        var params = eval("new SFS2X.SFSObject()");
        params.putInt("aposta", bet);
        params.putByte("qtd", cards);
        params.putInt("cartela", cardGroupNumber);
        params.putInt("bet_index", betIndex);
        params.putInt("cardID", cardId);
        trace(params.getDump());
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( key, params )"));
    };
    SFSConnector.sendPlayWithNumbers = function (key, bet, cards, cardGroupNumber, betIndex, cardNumbers) {
        var params = eval("new SFS2X.SFSObject()");
        params.putInt("aposta", bet);
        params.putByte("qtd", cards);
        params.putInt("cartela", cardGroupNumber);
        params.putInt("bet_index", betIndex);
        params.putByteArray("selected_card_nums", cardNumbers);
        trace(params.getDump());
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( key, params )"));
    };
    SFSConnector.sedRound = function (key, bet, cards, cardGroupNumber, betIndex) {
        var params = eval("new SFS2X.SFSObject()");
        params.putInt("aposta", bet);
        params.putByte("qtdCartelasAbertas", cards);
        params.putInt("numCartela", cardGroupNumber);
        params.putInt("bet_index", betIndex);
        trace(params.getDump());
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( key, params )"));
    };
    SFSConnector.roundOver = function () {
        var params = eval("new SFS2X.SFSObject()");
        params.putBool("stauto", false);
        params.putBool("finalizar", true);
        trace(params.getDump());
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'executado', params )"));
    };
    SFSConnector.libera = function () {
        var params = eval("new SFS2X.SFSObject()");
        trace(params.getDump());
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'finaliza', params )"));
    };
    SFSConnector.cancelExtra = function (extraString) {
        var params = eval("new SFS2X.SFSObject()");
        trace(params.getDump());
        if (extraString)
            SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'finaliza', params )"));
        else
            SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'creditar', params )"));
    };
    SFSConnector.extra = function (extraString, saving) {
        var params = eval("new SFS2X.SFSObject()");
        trace(params.getDump());
        if (extraString) {
            if (saving)
                SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'poupanca', params )"));
            else
                SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'extra', params )"));
        }
        else
            SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'solicitajogada', params )"));
    };
    SFSConnector.bonusGameSpin = function (bet) {
        var params = eval("new SFS2X.SFSObject()");
        params.putInt("bet", bet);
        trace(params.getDump());
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'bonusGame', params )"));
    };
    SFSConnector.buffHandler = function (action, bet) {
        var params = eval("new SFS2X.SFSObject()");
        params.putUtfString("action", action);
        params.putInt("currentBet", bet);
        trace(params.getDump());
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'buffHandler', params )"));
    };
    SFSConnector.selectNumber = function (num) {
        var params = eval("new SFS2X.SFSObject()");
        params.putInt("selectedBallNum", num);
        trace(params.getDump());
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'select_num_handler', params )"));
    };
    SFSConnector.goKartHandler = function (action, rewardType) {
        var params = eval("new SFS2X.SFSObject()");
        params.putUtfString("action", action);
        if (rewardType !== -1)
            params.putInt("rewardType", rewardType);
        trace(params.getDump());
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest('goKartHandler', params)"));
    };
    SFSConnector.lemonGame = function (action, bet, type, boxIndex) {
        var params = eval("new SFS2X.SFSObject()");
        params.putUtfString("action", action);
        params.putInt("currentBet", bet);
        params.putInt("clubs_type", type);
        params.putInt("box_index", boxIndex);
        trace(params.getDump());
        SFSConnector._sfs.send(eval("new SFS2X.ExtensionRequest( 'lemon_game_handler', params )"));
    };
    return SFSConnector;
}());
__reflect(SFSConnector.prototype, "SFSConnector");
var GameCard = (function (_super) {
    __extends(GameCard, _super);
    function GameCard(cardId) {
        var _this = _super.call(this) || this;
        _this.cardId = cardId;
        _this.cacheAsBitmap = true;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAdd, _this);
        return _this;
    }
    Object.defineProperty(GameCard.prototype, "bet", {
        set: function (value) {
            if (!this.betText)
                return;
            this.betText.setText(MuLang.getText("bet") + ": " + Utils.formatCoinsNumber(value));
        },
        enumerable: true,
        configurable: true
    });
    GameCard.prototype.onAdd = function (event) {
        if (!this.bg)
            this.bg = Com.addBitmapAt(this, BingoMachine.getAssetStr(GameCardUISettings.bgString), 0, 0);
        this.fitEffectLayer = new egret.DisplayObjectContainer;
        this.addChild(this.fitEffectLayer);
        this.getBgColor();
        if (GameCardUISettings.cardTextRect) {
            this.cardText = this.buildCardTitleText(GameCardUISettings.cardTextRect, GameCardUISettings.cardTextRect.height);
            this.cardText.setText(MuLang.getText("card") + ": " + (this.cardId + 1));
        }
        if (GameCardUISettings.betTextRect) {
            this.betText = this.buildCardTitleText(GameCardUISettings.betTextRect, GameCardUISettings.betTextRect.height);
            this.betText.setText(MuLang.getText("bet") + ": ");
        }
        if (GameCard.clickChangeNumber) {
            this.touchChildren = false;
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cardNumber, this);
        }
    };
    GameCard.prototype.buildCardTitleText = function (rect, size) {
        var tx = Com.addLabelAt(this, rect.x, rect.y, rect.width, rect.height, size, false, true);
        tx.textColor = GameCardUISettings.texColor;
        tx.textAlign = "left";
        tx.scaleX = 0.9;
        if (GameCardUISettings.showTitleShadow)
            tx.filters = [GameCardUISettings.showTitleShadow];
        return tx;
    };
    GameCard.prototype.cardNumber = function (event) {
        if (GameCard.changeingCard || BingoMachine.inRound)
            return;
        BingoMachine.sendCommand(GameCommands.changeNumber);
    };
    GameCard.getCardData = function (data) {
        GameCardUISettings.dataSetting(data);
        CardGridUISettings.getSettingStrings(data);
        var colors = data["colors"];
        CardGridColorAndSizeSettings.colorSetting(colors);
        GameCardUISettings.colorSetting(colors);
        var size = data["size"];
        CardGridColorAndSizeSettings.sizeSetting(size);
        GameCardUISettings.sizeSetting(size);
    };
    GameCard.prototype.getBgColor = function () {
        if (GameCardUISettings.titleColors) {
            GraphicTool.drawRect(this, new egret.Rectangle(0, 0, this.bg.width, this.bg.height), GameCardUISettings.cardTitleColor, true, 1);
        }
    };
    GameCard.prototype.getNumbers = function (numbers) {
        this.numbers = numbers;
        var i;
        if (!this.grids) {
            this.grids = [];
            for (i = 0; i < numbers.length; i++) {
                this.grids[i] = this.createGrid(i);
            }
        }
        for (i = 0; i < this.grids.length; i++) {
            this.grids[i].gridNumber = numbers[i];
        }
    };
    GameCard.prototype.createGrid = function (gridIndex) {
        var grid = eval("new CardManager.gridType()");
        grid.x = GameCardUISettings.gridInitPosition.x + (gridIndex % GameCardUISettings.gridNumbers.x) * CardGridColorAndSizeSettings.gridSpace.x;
        grid.y = GameCardUISettings.gridInitPosition.y + Math.floor(gridIndex / GameCardUISettings.gridNumbers.x) * CardGridColorAndSizeSettings.gridSpace.y;
        if (GameCardUISettings.gridOnTop)
            this.addChild(grid);
        else
            this.addChildAt(grid, 0);
        return grid;
    };
    GameCard.prototype.checkNumber = function (ballIndex) {
        var index = this.numbers.indexOf(ballIndex);
        if (index >= 0)
            this.grids[index].showEffect(true);
        return index;
    };
    GameCard.prototype.clearStatus = function () {
        this.clearFitEffect();
        for (var i = 0; i < this.grids.length; i++) {
            this.grids[i].showEffect(false);
        }
        if (this.redEffectArray)
            this.redEffectArray = null;
    };
    GameCard.prototype.getCheckString = function () {
        var str = "";
        for (var i = 0; i < this.grids.length; i++) {
            if (this.grids[i].isChecked)
                str += "1";
            else
                str += "0";
        }
        return str;
    };
    GameCard.prototype.blinkAt = function (index) {
        if (this.grids[index].isChecked)
            throw new Error("not posible blink grid");
        this.grids[index].blink = true;
    };
    GameCard.prototype.stopBlink = function () {
        for (var i = 0; i < this.grids.length; i++) {
            if (this.grids[i].blink)
                this.grids[i].blink = false;
        }
    };
    GameCard.prototype.blink = function (show) {
        if (!this.grids || !this.grids.length)
            return;
        var isShow = Boolean(show);
        for (var i = 0; i < this.grids.length; i++) {
            if (this.grids[i].blink)
                this.grids[i].showBlink(isShow);
        }
    };
    GameCard.prototype.getNumberAt = function (index) {
        return this.grids[index].gridNumber;
    };
    GameCard.prototype.clearFitEffect = function () {
        if (this.fitEffectLayer) {
            this.fitEffectLayer.removeChildren();
            this.addChild(this.fitEffectLayer);
        }
        if (GameCardUISettings.useRedEffect) {
            if (this.redEffectArray) {
                for (var j = 0; j < this.redEffectArray.length; j++) {
                    if (this.redEffectArray[j])
                        this.grids[j].showEffect(true);
                }
                this.redEffectArray = null;
            }
        }
    };
    GameCard.prototype.setGridsToRed = function (str) {
        if (!this.redEffectArray)
            this.redEffectArray = [];
        for (var j = 0; j < str.length; j++) {
            if (str[j] == "1") {
                this.grids[j].showRedEffect();
                this.redEffectArray[j] = true;
            }
        }
    };
    GameCard.prototype.showfitEffect = function (assetName, fitIndex) {
        if (GameCardUISettings.useRedEffect) {
            if (fitIndex.length) {
                for (var i = 0; i < fitIndex.length; i++) {
                    if (fitIndex[i]) {
                        this.setGridsToRed(PayTableManager.payTablesDictionary[assetName].rules[i]);
                    }
                }
            }
            else {
                this.setGridsToRed(PayTableManager.payTablesDictionary[assetName].rule);
            }
        }
        if (!GameCard.fitEffectNameList)
            return;
        try {
            var effectImage = void 0;
            if (fitIndex.length) {
                for (var i = 0; i < fitIndex.length; i++) {
                    if (fitIndex[i]) {
                        effectImage = Com.addBitmapAt(this.fitEffectLayer, BingoMachine.getAssetStr(GameCard.fitEffectNameList[assetName][i]), 0, 0);
                    }
                }
            }
            else {
                effectImage = Com.addBitmapAt(this.fitEffectLayer, BingoMachine.getAssetStr(GameCard.fitEffectNameList[assetName]), 0, 0);
            }
        }
        catch (e) {
            trace("showfitEffect ignore:" + assetName);
        }
    };
    GameCard.clickChangeNumber = true;
    return GameCard;
}(GameUIItem));
__reflect(GameCard.prototype, "GameCard");
var TounamentLayer = (function (_super) {
    __extends(TounamentLayer, _super);
    function TounamentLayer(data) {
        var _this = _super.call(this) || this;
        _this.buildInnerBar();
        _this.buildOutBar();
        _this.updateDuration(data.duration, data.totalDuration);
        _this.updatePrize(data.prize);
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAdd, _this);
        _this.updateUserList(data.userList, data.winners);
        return _this;
    }
    Object.defineProperty(TounamentLayer.prototype, "potCount", {
        get: function () {
            return this._potCount;
        },
        set: function (value) {
            this._potCount = Math.floor(value);
            this.potTx.setText("$" + this._potCount);
        },
        enumerable: true,
        configurable: true
    });
    TounamentLayer.prototype.onAdd = function (event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        this.timer = new egret.Timer(1000);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.timer.start();
    };
    TounamentLayer.prototype.onRemove = function (event) {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.timer.stop();
        this.timer = null;
    };
    TounamentLayer.prototype.updata = function (data) {
        this.updateDuration(data.duration, data.totalDuration);
        this.updatePrize(data.prize);
        this.updateUserList(data.userList, data.winners);
    };
    TounamentLayer.prototype.buildInnerBar = function () {
        this.innerBar = new egret.DisplayObjectContainer;
        Com.addObjectAt(this, this.innerBar, 0, 0);
        var tmBg = Com.addBitmapAt(this.innerBar, "tounament_json.ranking_bg", 0, 0);
        tmBg.width = 235;
        tmBg.height = 385;
        Com.addBitmapAtMiddle(this.innerBar, "tounament_json.ranking_" + MuLang.language, 117, 36);
        var titleTx = Com.addTextAt(this.innerBar, 10, 80, 215, 30, 30);
        titleTx.text = MuLang.getText("play_enter");
        var barBg = Com.addBitmapAt(this.innerBar, "tounament_json.bar_bg", 10, 117);
        barBg.scale9Grid = new egret.Rectangle(10, 10, 182, 24);
        barBg.width = 212;
        var prizeBg = Com.addBitmapAt(this.innerBar, "tounament_json.bar_bg", 10, 175);
        prizeBg.scale9Grid = new egret.Rectangle(10, 10, 182, 24);
        prizeBg.width = 212;
        prizeBg.height = 100;
        var potTx = Com.addTextAt(this.innerBar, 10, 185, 215, 28, 28);
        potTx.text = MuLang.getText("prize_pot");
        this.pressBar = Com.addBitmapAt(this.innerBar, "tounament_json.progress_bar", 12, 121);
        this.pressBar.scale9Grid = new egret.Rectangle(4, 4, 186, 28);
        Com.addBitmapAt(this.innerBar, "tounament_json.deviding_line", 15, 287);
        this.champoin = new TounamentChampoin();
        Com.addObjectAt(this.innerBar, this.champoin, 0, 308);
        this.innerBar.cacheAsBitmap = true;
        this.potTx = Com.addLabelAt(this, 12, 225, 208, 48, 48, false, true);
        this.potCount = 0;
        this.timeTx = Com.addTextAt(this, 10, 125, 212, 36, 36, true);
        this.timeTx.stroke = 2;
        this.timeTx.bold = true;
        this.timeTx.verticalAlign = "middle";
    };
    TounamentLayer.prototype.buildOutBar = function () {
        this.outBar = new egret.DisplayObjectContainer;
        Com.addObjectAt(this, this.outBar, 0, 297);
        var avBg = Com.addBitmapAt(this.outBar, "tounament_json.mechanism_pending_bg", 0, 0);
        avBg.width = 235;
        avBg.height = 530;
        var avt = Com.addBitmapAtMiddle(this.outBar, "tounament_json.avatar", 117, 264);
        var fbId = PlayerConfig.player("facebook_id");
        if (fbId)
            FacebookBitmap.downloadBitmapDataByFacebookID(fbId, 100, 100, MDS.onUserHeadLoaded.bind(this, avt, 166), this);
        var txUp = Com.addTextAt(this.outBar, 5, 0, 215, 150, 28, true, true);
        txUp.textColor = 0xFFFF00;
        txUp.stroke = 2;
        txUp.strokeColor = 0;
        txUp.verticalAlign = "middle";
        txUp.text = MuLang.getText("play_to_enter");
        var txDown = Com.addTextAt(this.outBar, 0, 405, 235, 30, 28, false, true);
        txDown.text = MuLang.getText("win_to_enter");
        this.outBar.cacheAsBitmap = true;
    };
    TounamentLayer.prototype.updateDuration = function (duration, totalDuration) {
        this.duration = duration;
        this.totalDuration = totalDuration;
        this.pressBar.width = duration / this.totalDuration * 208;
        this.updataDurationUI(duration);
        if (this.timer) {
            this.timer.reset();
            this.timer.start();
        }
    };
    TounamentLayer.prototype.onTimer = function (event) {
        this.updataDurationUI(this.duration - event.target.currentCount);
    };
    TounamentLayer.prototype.updataDurationUI = function (duration) {
        this.timeTx.text = Utils.secondToHour(duration);
    };
    TounamentLayer.prototype.updatePrize = function (prize) {
        TweenerTool.tweenTo(this, { potCount: prize }, 500);
    };
    TounamentLayer.prototype.updateUserList = function (users, winners) {
        if (this.userIndexOf(users, PlayerConfig.player("user.id")) < 0)
            return;
        TweenerTool.tweenTo(this.outBar, { x: -235 }, 500);
        this.showingWinners = !this.showingWinners;
        this.hideUserUI();
        this.showUserUI(users, winners);
    };
    TounamentLayer.prototype.hideUserUI = function () {
        if (this.usersUI) {
            for (var i = 0; i < this.usersUI.length; i++) {
                TweenerTool.tweenTo(this.usersUI[i], { scaleY: 0 }, 500, 500 * i, MDS.removeSelf.bind(this, this.usersUI[i]));
            }
        }
    };
    TounamentLayer.prototype.showUserUI = function (users, winners) {
        this.champoin.clearUI();
        if (this.showingWinners) {
            if (winners.length > 3)
                winners.length = 3;
            this.showingWinnersUI(winners);
        }
        else {
            var userList = this.getUserListOrder(users);
            this.showingWinnersUI(userList);
            if (userList[0].rank != 1)
                this.champoin.show(winners[0]);
        }
    };
    TounamentLayer.prototype.showingWinnersUI = function (winners) {
        this.usersUI = [];
        for (var i = 0; i < Math.min(winners.length, 3); i++) {
            this.usersUI[i] = new TounamentUserItem(winners[i], winners[i].rank, winners[i].uid == PlayerConfig.player("user.id"));
            this.usersUI[i].scaleY = 0;
            this.usersUI[i].x = 0;
            this.addChild(this.usersUI[i]);
            this.usersUI[i].y = 460 + i * 142;
            TweenerTool.tweenTo(this.usersUI[i], { scaleY: 1 }, 500, 500 * i + 500);
        }
    };
    TounamentLayer.prototype.getUserListOrder = function (users) {
        var myIndex = NaN;
        var newIndex;
        for (var i = 0; i < users.length; i++) {
            if (users[i].uid == PlayerConfig.player("user.id")) {
                myIndex = i;
            }
        }
        var newArr = [];
        newArr.push(users[myIndex]);
        newIndex = 0;
        if (myIndex > 0) {
            newArr.unshift(users[myIndex - 1]);
            newIndex += 1;
        }
        if (users.length > myIndex + 1) {
            newArr.push(users[myIndex + 1]);
        }
        if (newArr.length < 3) {
            if (myIndex > 1) {
                newArr.unshift(users[myIndex - 2]);
                newIndex += 1;
            }
        }
        if (newArr.length < 3) {
            if (users.length > myIndex + 2) {
                newArr.push(users[myIndex + 2]);
            }
        }
        return newArr;
    };
    TounamentLayer.prototype.userIndexOf = function (users, id) {
        if (users && users.length) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].uid == id)
                    return i;
            }
        }
        return -1;
    };
    return TounamentLayer;
}(egret.DisplayObjectContainer));
__reflect(TounamentLayer.prototype, "TounamentLayer");
var BingoMachine = (function (_super) {
    __extends(BingoMachine, _super);
    function BingoMachine(gameConfigFile, configUrl, gameId) {
        var _this = _super.call(this) || this;
        _this.languageObjectName = "forAll_tx";
        _this.connectReady = false;
        _this.assetReady = false;
        _this.betListReady = false;
        _this.lockWinTip = false;
        _this.connetKeys = { zona: "Zona" + gameId, sala: "Sala" + gameId };
        _this.tokenObject = {};
        _this.tokenObject["value"] = { tipo: "jogar", version: PlayerConfig.serverVertion };
        BingoMachine.currentGameId = gameId;
        if (localStorage.getItem("gotoGame" + gameId))
            localStorage.removeItem("gotoGame" + gameId);
        else
            document.location.href = "../lobby";
        _this.gameConfigFile = gameConfigFile;
        _this.ballArea = new BallManager;
        _this.assetName = egret.getDefinitionByName(egret.getQualifiedClassName(_this)).classAssetName;
        BingoMachine.currentGame = _this;
        _this.soundManager = new GameSoundManager();
        RES.getResByUrl(configUrl, _this.analyse, _this);
        _this.loginToServer();
        return _this;
    }
    Object.defineProperty(BingoMachine.prototype, "gameCoins", {
        get: function () {
            return this._gameCoins;
        },
        set: function (value) {
            this._gameCoins = value;
            if (this.creditText)
                this.creditText.setText(Utils.formatCoinsNumber(value));
        },
        enumerable: true,
        configurable: true
    });
    BingoMachine.prototype.assetStr = function (str) {
        return this.assetName + "_json." + str;
    };
    BingoMachine.getAssetStr = function (str) {
        return this.currentGame.assetStr(str);
    };
    BingoMachine.prototype.onConfigLoadComplete = function () {
        var obj = RES.getRes(this.gameConfigFile.replace(".", "_"));
        BingoBackGroundSetting.getBackgroundData(obj["backgroundColor"], obj["backgroundItems"]);
        this.ballArea.getBallSettings(obj["balls"], obj["ballSize"], obj["ballTextSize"]);
        this.extraUIName = obj["extraUIName"];
        PayTableManager.getPayTableData(obj["payTables"]);
        CardManager.getCardData(obj["card"]);
        CardManager.startBlinkTimer();
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        GameCard.fitEffectNameList = obj["payTablesFitEffect"];
        PaytableFilter.filterObject = obj["payTablesFilter"];
        PaytableFilter.soundObject = obj["payTablesSound"];
        MuLang.txt = this.getLanguageObject();
    };
    BingoMachine.prototype.getLanguageObject = function () {
        var txtObj = RES.getRes("forAll_tx");
        if (this.languageObjectName != "forAll_tx") {
            var spObj = RES.getRes(this.languageObjectName);
            for (var ob in spObj) {
                txtObj[ob] = spObj[ob];
            }
        }
        return txtObj;
    };
    BingoMachine.prototype.getSoundName = function (paytalbeName) {
        if (PaytableFilter.soundObject) {
            var name_1 = PaytableFilter.soundObject[paytalbeName];
            if (name_1)
                return name_1.replace(".", "_");
        }
        return "";
    };
    BingoMachine.prototype.onRemove = function (event) {
        CardManager.stopBlinkTimer();
        IBingoServer.jackpotCallbak = null;
        IBingoServer.jackpotWinCallbak = null;
        this.ballArea.onRemove();
        this.removedFromStage();
    };
    BingoMachine.prototype.analyse = function (result) {
        this.loadAsset(this.assetName);
    };
    BingoMachine.prototype.loadAsset = function (assetName) {
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loaded, this);
        try {
            var group = RES["config"].config.groups;
            group[assetName] = group[assetName].concat(group["allGameAssets"]);
        }
        catch (e) {
            egret.error(e);
        }
        RES.loadGroup(assetName, 0, this.preLoader);
    };
    BingoMachine.prototype.loaded = function (event) {
        if (event.groupName != this.assetName)
            return;
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loaded, this);
        this.assetReady = true;
        this.testReady();
    };
    BingoMachine.prototype.init = function () {
        this.dispatchEvent(new egret.Event(BingoMachine.GENERIC_MODAL_LOADED));
        this.preLoader = null;
        this.scaleX = BingoBackGroundSetting.gameSize.x / BingoBackGroundSetting.gameMask.width;
        this.scaleY = BingoBackGroundSetting.gameSize.y / BingoBackGroundSetting.gameMask.height;
        this.mask = BingoBackGroundSetting.gameMask;
        MDS.mcFactory = BingoBackGroundSetting.initBackground(this);
        this.addChild(this.ballArea);
        this.addPayTables();
        this.sendInitDataRequest();
        this.cardArea = new egret.DisplayObjectContainer;
        this.addChild(this.cardArea);
        CardGridUISettings.initGridAssets();
        if (this.extraUIName) {
            this.extraUIObject = this.getChildByName(this.assetStr(this.extraUIName));
            if (this.extraUIObject)
                this.extraUIObject.visible = false;
        }
        this.addEventListener("bingo", this.winBingo, this);
        this.addEventListener("betChanged", this.onBetChanged, this);
        this.tellTounamentCurrentBet();
    };
    BingoMachine.prototype.addPayTables = function () {
        this.payTableArea = eval("new PayTableManager.layerType()");
        this.addChild(this.payTableArea);
        this.payTableArea.addPaytableUI();
    };
    BingoMachine.prototype.loginToServer = function () {
        if (IBingoServer.connected) {
            IBingoServer.loginTo(this.connetKeys["zona"], this.connetKeys["sala"], this.onJoinRoomCallback.bind(this));
            GameData.getBetList(this.betListCallback.bind(this), this.connetKeys["zona"].replace(/\D/g, ""));
        }
        else
            setTimeout(this.loginToServer.bind(this), 200);
    };
    BingoMachine.prototype.onJoinRoomCallback = function () {
        this.connectReady = true;
        this.testReady();
    };
    BingoMachine.prototype.betListCallback = function (success) {
        this.betListReady = true;
        this.testReady();
    };
    BingoMachine.prototype.testReady = function () {
        if (this.connectReady && this.assetReady && this.betListReady) {
            this.onConfigLoadComplete();
            this.init();
        }
    };
    BingoMachine.prototype.sendInitDataRequest = function () {
        IBingoServer.gameInitCallback = this.onServerData.bind(this);
        IBingoServer.tounamentCallback = this.onTounamentData.bind(this);
        IBingoServer.sendMessage(this.tokenObject["key"], this.tokenObject["value"]);
    };
    BingoMachine.prototype.onServerData = function (data) {
        IBingoServer.gameInitCallback = null;
        this.setCardDatasWithNumeros(data["numerosCartelas"], data["cartela"]);
        this.showJackpot(data["acumulado"], data["jackpot_min_bet"], data["betConfig"]);
        IBingoServer.jackpotCallbak = this.jackpotArea.setJackpotNumber.bind(this.jackpotArea);
        IBingoServer.jackpotWinCallbak = this.jackpotArea.jackpotWinCallback.bind(this.jackpotArea);
        this.initToolbar();
        this.updateCredit(data);
        this.resetGameToolBarStatus();
        this.dispatchEvent(new egret.Event("connected_to_server"));
        this.setLetras(data["letras"]);
        if (this.needListenToolbarStatus)
            this.listenToGameToolbarStatus();
        this.freeSpin = data["freeSpin"];
        if (this.freeSpin > 0)
            BingoMachine.sendCommand(GameCommands.minBet);
        this.loadOtherGroup();
    };
    BingoMachine.prototype.loadOtherGroup = function () {
        RES.loadGroup("generic");
        RES.loadGroup("gameSettings");
        if (this.megaName) {
            if (!localStorage.getItem(this.megaName)) {
                try {
                    RES.loadGroup("megaForFirst_" + MuLang.language);
                }
                catch (e) { }
            }
        }
    };
    BingoMachine.prototype.initToolbar = function () {
        this.gameToolBar = new BingoGameToolbar;
        Com.addObjectAt(this, this.gameToolBar, 0, BingoGameToolbar.toolBarY);
        this.gameToolBar.showTip("");
        this.gameToolBar.addEventListener(XpBar.LEVEL_UP_BONUS, this.onLevelUpBonus, this);
        this.topbar = new Topbar;
        this.addChild(this.topbar);
        this.topbar.scaleX = this.gameToolBar.scaleX = BingoBackGroundSetting.gameMask.width / 2000;
        this.topbar.scaleY = this.gameToolBar.scaleY = BingoBackGroundSetting.gameMask.height / 1125;
    };
    BingoMachine.prototype.listenToGameToolbarStatus = function () {
        this.gameToolBar.addEventListener("winChange", this.winChange, this);
        this.gameToolBar.addEventListener("tipStatus", this.tipStatus, this);
        if (this.tipStatusTextPosition) {
            var rect = this.tipStatusTextPosition;
            this.tipStatusText = MDS.addGameText(this, rect.x, rect.y, rect.height, this.tipStatusTextColor, "bet", false, rect.width);
            this.tipStatusText.textAlign = "center";
            this.tipStatusText.text = MuLang.getText("press play");
        }
    };
    BingoMachine.prototype.tipStatus = function (e, textDoubleLine) {
        var _this = this;
        if (textDoubleLine === void 0) { textDoubleLine = false; }
        switch (e["status"]) {
            case GameCommands.play:
                this.tipStatusText.text = MuLang.getText("good luck");
                break;
            case GameCommands.extra:
                var extraStr = MuLang.getText("extra ball");
                extraStr += textDoubleLine ? "\r\n" : ": ";
                if (e["extraPrice"])
                    extraStr += Utils.formatCoinsNumber(e["extraPrice"]);
                else
                    extraStr += MuLang.getText("free");
                this.tipStatusText.setText(extraStr);
                this.lockWinTip = true;
                setTimeout(function () { _this.lockWinTip = false; }, 10);
                break;
            default:
                this.tipStatusText.text = MuLang.getText("press play");
                break;
        }
    };
    BingoMachine.prototype.winChange = function (e, textDoubleLine) {
        if (textDoubleLine === void 0) { textDoubleLine = false; }
        if (e["winCoins"] && !this.lockWinTip)
            this.tipStatusText.text = MuLang.getText("win") + (textDoubleLine ? "\r\n" : ": ") + e["winCoins"];
    };
    BingoMachine.prototype.setCardDatasWithNumeros = function (numeros, cartela) {
        var cards = CardManager.cards;
        var numbersOnCards = numeros.length / cards.length;
        for (var i = 0; i < cards.length; i++) {
            cards[i].x = GameCardUISettings.cardPositions[i]["x"];
            cards[i].y = GameCardUISettings.cardPositions[i]["y"];
            this.cardArea.addChild(cards[i]);
            cards[i].getNumbers(numeros.slice(i * numbersOnCards, (i + 1) * numbersOnCards));
        }
        this.changeCardsBg();
        CardManager.groupNumber = cartela;
    };
    BingoMachine.prototype.resetGameToolBarStatus = function () {
        this.gameToolBar.setBet(GameData.currentBet, CardManager.enabledCards, GameData.currentBet == GameData.maxBet);
        this.betText.setText(Utils.formatCoinsNumber(CardManager.setCardBet(GameData.currentBet)));
    };
    BingoMachine.runningBall = function (ballIndex) {
        this.currentGame.showLastBall(ballIndex);
    };
    BingoMachine.betweenBallRunning = function () {
        return this.currentGame.lightCheck();
    };
    BingoMachine.runningAnimation = function (callback, lightResult, isLastBall) {
        this.currentGame.runningWinAnimation(callback, lightResult, isLastBall);
    };
    BingoMachine.endBallRunning = function () {
        this.currentGame.ballRunforStop = false;
        var breakChecked = this.currentGame.getResultListToCheck();
        if (breakChecked)
            return;
        if (this.currentGame.btExtra) {
            this.currentGame.hasExtraBallFit();
            this.currentGame.gameToolBar.unlockAllButtons();
            this.currentGame.gameToolBar.showExtra(true, this.currentGame.valorextra);
            this.currentGame.gameToolBar.showWinResult(this.currentGame.ganho);
            if (this.currentGame.gameToolBar.autoPlaying || this.currentGame.gameToolBar.buyAllExtra) {
                setTimeout(this.sendCommand.bind(this), 500, GameCommands.extra);
            }
            this.currentGame.showExtraUI();
        }
        else {
            this.currentGame.sendRoundOverRequest();
            this.currentGame.gameToolBar.showExtra(false);
            this.currentGame.gameToolBar.lockAllButtons();
        }
    };
    BingoMachine.prototype.sendRoundOverRequest = function () {
        IBingoServer.roundOverCallback = this.onRoundOver.bind(this);
        IBingoServer.roundOver();
    };
    BingoMachine.prototype.lightCheck = function () {
        var checkingString = CardManager.getCheckingStrings();
        var payTablesDictionary = PayTableManager.payTablesDictionary;
        var resultList = [];
        var hasFit = false;
        for (var i = 0; i < checkingString.length; i++) {
            resultList[i] = {};
            for (var ob in payTablesDictionary) {
                var result = payTablesDictionary[ob].lightCheck(checkingString[i]);
                if (result.length > 0) {
                    hasFit = true;
                    resultList[i][ob] = result;
                }
            }
        }
        return hasFit ? resultList : [];
    };
    BingoMachine.prototype.getResultListToCheck = function (inLightCheck) {
        if (inLightCheck === void 0) { inLightCheck = false; }
        this.inLightCheck = inLightCheck;
        var checkingString = CardManager.getCheckingStrings();
        var payTablesDictionary = PayTableManager.payTablesDictionary;
        var resultList = [];
        for (var i = 0; i < checkingString.length; i++) {
            resultList[i] = {};
            for (var ob in payTablesDictionary) {
                var result = payTablesDictionary[ob].check(checkingString[i]);
                resultList[i][ob] = result;
            }
        }
        this.paytableResultFilter(resultList);
        this.afterCheck(resultList);
        return false;
    };
    BingoMachine.prototype.paytableResultFilter = function (resultList) {
    };
    BingoMachine.prototype.showExtraUI = function (show) {
        if (show === void 0) { show = true; }
        if (this.extraUIObject)
            this.extraUIObject.visible = show;
    };
    BingoMachine.prototype.clearRunningBallUI = function () {
        if (this.runningBallUI && this.runningBallContainer.contains(this.runningBallUI))
            this.runningBallContainer.removeChild(this.runningBallUI);
    };
    BingoMachine.prototype.setLetras = function (letrasData) {
        //only for pachinko
    };
    BingoMachine.prototype.playSound = function (soundName, repeat, callback) {
        if (repeat === void 0) { repeat = 1; }
        if (callback === void 0) { callback = null; }
        this.soundManager.play(soundName, repeat, callback);
    };
    BingoMachine.prototype.stopSound = function (soundName) {
        this.soundManager.stop(soundName);
    };
    BingoMachine.prototype.stopAllSound = function () {
        this.soundManager.stopAll();
    };
    BingoMachine.prototype.removedFromStage = function () {
        this.soundManager.stopAll();
    };
    BingoMachine.prototype.tileBg = function () {
        var bg = this.getChildAt(0);
        if (bg) {
            bg.fillMode = egret.BitmapFillMode.REPEAT;
            bg.width = BingoBackGroundSetting.gameMask.width;
            bg.height = BingoBackGroundSetting.gameMask.height;
            return true;
        }
        return false;
    };
    BingoMachine.sendCommand = function (cmd) {
        trace("ToolBarCommand:" + cmd);
        if (cmd == GameCommands.help) {
            this.currentGame.dispatchEvent(new egret.Event("showHelp"));
        }
        else if (cmd == GameCommands.changeNumber) {
            this.currentGame.changeNumberSound();
            CardManager.clearCardsStatus();
            if (this.currentGame instanceof V1Game) {
                this.currentGame.setCardDatasWithNumeros(this.currentGame["getCardsGroup"](CardManager.groupNumber), CardManager.groupNumber < 100 ? CardManager.groupNumber + 1 : 1);
                return;
            }
            this.currentGame.gameToolBar.lockAllButtons();
            IBingoServer.changeNumberCallback = this.currentGame.onChangeNumber.bind(this.currentGame);
            GameCard.changeingCard = true;
            IBingoServer.changeNumber();
        }
        else if (cmd == GameCommands.play) {
            if (Number(this.currentGame.gameCoins) < GameData.currentBet * CardManager.enabledCards) {
                if (this.currentGame.gameToolBar.autoPlaying) {
                    this.currentGame.gameToolBar.autoPlaying = false;
                    this.currentGame.gameToolBar.unlockAllButtonsAfterOOC();
                    this.currentGame.resetGameToolBarStatus();
                }
                this.currentGame.dispatchEvent(new egret.Event("out_of_coins_game_id"));
                alert("out of coins");
                return;
            }
            this.currentGame.startPlay();
            this.currentGame.gameToolBar.lockAllButtons();
            this.currentGame.sendPlayRequest();
            CardManager.clearCardsStatus();
            PayTableManager.clearPaytablesStatus();
            this.currentGame.gameToolBar.showTip(cmd);
            this.currentGame.ballArea.clearBalls();
            this.currentGame.showExtraUI(false);
            this.currentGame.dispatchEvent(new egret.Event("onGamePlay"));
        }
        else if (cmd == GameCommands.stop) {
            this.currentGame.ballRunforStop = true;
            this.currentGame.gameToolBar.enabledStopButton();
            this.currentGame.ballArea.stopBallRunning();
        }
        else if (cmd == GameCommands.collect) {
            this.currentGame.collectExtraBall();
            this.currentGame.sendCancelExtraReuqest();
            this.currentGame.gameToolBar.lockAllButtons();
            this.currentGame.gameToolBar.showTip("");
            this.currentGame.clearRunningBallUI();
        }
        else if (cmd == GameCommands.extra) {
            var isOOC = this.currentGame.checkOOCWhenExtra();
            if (isOOC)
                return;
            this.currentGame.gameToolBar.lockAllButtons();
            this.currentGame.sendExtraRequest();
            this.currentGame.getExtraBallFit();
        }
        else if (cmd == GameCommands.saving) {
            this.currentGame.gameToolBar.lockAllButtons();
            this.currentGame.sendExtraRequest(true);
            this.currentGame.getExtraBallFit();
        }
        else if (cmd == GameCommands.showMini) {
            this.currentGame.showMiniGame();
        }
        else if (cmd == GameCommands.startAuto) {
            this.currentGame.gameToolBar.autoPlaying = true;
        }
        else if (cmd == GameCommands.stopAuto) {
            this.currentGame.gameToolBar.autoPlaying = false;
            clearTimeout(this.currentGame.autoPlayTimeoutId);
        }
        else if (cmd == GameCommands.buyAll) {
            this.currentGame.gameToolBar.buyAllExtra = true;
        }
        else {
            if (cmd == GameCommands.decreseBet) {
                GameData.betDown();
                this.currentGame.betChanged(-1);
            }
            else if (cmd == GameCommands.increaseBet) {
                GameData.betUp();
                this.currentGame.betChanged(1);
            }
            else if (cmd == GameCommands.maxBet) {
                GameData.setBetToMax();
                this.currentGame.betChanged(0);
            }
            else if (cmd == GameCommands.minBet) {
                GameData.setBetToMin();
                this.currentGame.betChanged(0);
            }
            else
                throw new Error("hehe");
            this.currentGame.resetGameToolBarStatus();
            this.currentGame.changeCardsBg();
            this.currentGame.jackpotArea.tryJackpotMinBet();
            this.currentGame.tellTounamentCurrentBet();
        }
    };
    BingoMachine.prototype.betChanged = function (type) {
        this.dispatchEvent(new egret.Event("betChanged", false, false, { type: type }));
        this.jackpotArea.changebet();
        this.gameToolBar.updateFreeSpinCount(GameData.currentBet == GameData.minBet && this.freeSpin);
    };
    BingoMachine.prototype.checkOOCWhenExtra = function () {
        var isOOC;
        if (this.isMegaBall)
            isOOC = Number(this.dinero) < this.valorextra;
        else
            isOOC = Number(this.gameCoins) < this.valorextra;
        if (isOOC) {
            if (this.gameToolBar.autoPlaying) {
                this.gameToolBar.autoPlaying = false;
                this.gameToolBar.unlockAllButtonsAfterOOCExtra();
            }
            if (this.gameToolBar.buyAllExtra)
                this.gameToolBar.buyAllExtra = false;
            if (this.isMegaBall)
                this.dispatchEvent(new egret.Event("out_of_dinero"));
            else
                this.dispatchEvent(new egret.Event("out_of_coins_game_id"));
        }
        return isOOC;
    };
    BingoMachine.prototype.tellTounamentCurrentBet = function () {
        var betData = {};
        betData["currentBet"] = GameData.currentBet;
        betData["betProgress"] = (GameData.currentBetIndex + 1) / GameData.bets.length;
        this.dispatchEvent(new egret.Event("BET_CHANGED", false, false, betData));
    };
    BingoMachine.prototype.changeCardsBg = function () {
        CardManager.changeCardsBgColor();
    };
    BingoMachine.prototype.onChangeNumber = function (data) {
        IBingoServer.changeNumberCallback = null;
        GameCard.changeingCard = false;
        this.setCardDatasWithNumeros(data["numerosCartelas"], data["cartela"]);
        this.gameToolBar.unlockAllButtons();
        this.changeCardsBg();
    };
    BingoMachine.prototype.onPlay = function (data, hotData) {
        if (hotData === void 0) { hotData = null; }
        IBingoServer.playCallback = null;
        this.firstHaveExtraBall = true;
        this.lastLightResult = [];
        this.isMegaBall = false;
        if (!data) {
            this.stopAutoPlay();
            this.dispatchEvent(new egret.Event("out_of_coins_game_id"));
            return;
        }
        this.updateCredit(data);
        this.gameToolBar.showStop(true);
        this.gameToolBar.showWinResult(0);
        this.currentBallIndex = 0;
        this.btExtra = data["btextra"];
        this.ganho = data["ganho"];
        if (data["ebPrice"])
            this.valorextra = data["ebPrice"];
        else
            this.valorextra = data["valorextra"];
        this.gratisNumber = data["gratis"] > 0 ? data["gratis"] + data["bolas"].length : 0;
        if (data["bolas"] && data["bolas"].length) {
            this.ballArea.runBalls(data["bolas"]);
        }
    };
    BingoMachine.prototype.updateCredit = function (data) {
        this.gameCoins = Math.round(data["credito"]);
        if (!isNaN(data["secondCurrency"]))
            this.dinero = data["secondCurrency"];
        if (this.gameToolBar) {
            this.gameToolBar.updateCoinsAndDinero(this.gameCoins, this.dinero);
            if (!isNaN(data["xp"]))
                this.gameToolBar.updateXp(data["xp"]);
        }
    };
    BingoMachine.prototype.onRoundOver = function (data) {
        IBingoServer.roundOverCallback = null;
        this.roundOver();
        this.gameToolBar.showStop(false);
        this.gameToolBar.unlockAllButtons();
        if (data["ganho"] != "unexpress")
            this.gameToolBar.showWinResult(data["ganho"]);
        else
            this.gameToolBar.showWinResult(this.ganho);
        this.updateCredit(data);
        if (data["freeSpin"] != null)
            this.checkFreeSpin(data["freeSpin"]);
        this.checkAuto();
        this.updateNewDatas(data);
    };
    BingoMachine.prototype.checkAuto = function () {
        if (!this.gameToolBar.autoPlaying)
            this.resetGameToolBarStatus();
        if (this.gameToolBar.buyAllExtra)
            this.gameToolBar.buyAllExtra = false;
        if (this.gameToolBar.autoPlaying) {
            this.gameToolBar.lockAllButtons();
            this.autoPlayTimeoutId = setTimeout(this.aotoNextRound.bind(this), 1000);
        }
    };
    BingoMachine.prototype.checkFreeSpin = function (freeSpin) {
        this.freeSpin = freeSpin;
        if (GameData.minBet == GameData.currentBet && this.freeSpin > 0) {
            if (this.gameToolBar.autoPlaying)
                this.gameToolBar.autoPlaying = false;
            this.gameToolBar.updateFreeSpinCount(this.freeSpin);
        }
    };
    BingoMachine.prototype.aotoNextRound = function () {
        if (this.waitingForEffect)
            this.autoPlayTimeoutId = setTimeout(this.aotoNextRound.bind(this), 500);
        else
            this.gameToolBar.autoPlaying = true;
    };
    BingoMachine.prototype.waitForEffect = function (callback) {
        this.waitingForEffect = false;
        if (callback)
            callback();
    };
    BingoMachine.prototype.onCancelExtra = function (data) {
        IBingoServer.cancelExtraCallback = null;
        this.gameToolBar.unlockAllButtons();
        this.gameToolBar.showExtra(false);
        this.roundOver();
        this.updateCredit(data);
        if (data["freeSpin"] != null)
            this.checkFreeSpin(data["freeSpin"]);
        this.resetGameToolBarStatus();
        this.showMissExtraBall(data["extrasnaocompradas"]);
        this.updateNewDatas(data);
    };
    BingoMachine.prototype.onExtra = function (data) {
        IBingoServer.extraCallback = null;
        data["btextra"] = data["btextra"] || data["isMegaBall"];
        this.isMegaBall = data["isMegaBall"];
        if (!data) {
            var needChangeCollectBtnStatus = this.gameToolBar.autoPlaying;
            this.stopAutoPlay();
            this.dispatchEvent(new egret.Event("out_of_coins_game_id"));
            if (needChangeCollectBtnStatus)
                this.gameToolBar.showCollectButtonAfterOOC();
            return;
        }
        this.updateCredit(data);
        this.btExtra = data["btextra"];
        this.ganho = data["ganho"];
        if (data["ebPrice"])
            this.valorextra = data["ebPrice"];
        else
            this.valorextra = data["valorextra"];
        if (data["extra"]) {
            this.ballArea.runExtra(data["extra"]);
        }
        CardManager.stopAllBlink();
    };
    BingoMachine.prototype.showMissExtraBall = function (balls) {
        this.ballArea.runMissExtra(balls);
    };
    BingoMachine.prototype.sendPlayRequest = function () {
        IBingoServer.playCallback = this.onPlay.bind(this);
        IBingoServer.play(GameData.currentBet, CardManager.enabledCards, CardManager.groupNumber, GameData.currentBetIndex);
        BingoMachine.inRound = true;
    };
    BingoMachine.prototype.sendExtraRequest = function (saving) {
        if (saving === void 0) { saving = false; }
        IBingoServer.extraCallback = this.onExtra.bind(this);
        IBingoServer.extra();
    };
    BingoMachine.prototype.sendCancelExtraReuqest = function () {
        IBingoServer.cancelExtraCallback = this.onCancelExtra.bind(this);
        IBingoServer.cancelExtra();
    };
    BingoMachine.prototype.showLastBallAt = function (ballIndex, x, y, scale) {
        if (scale === void 0) { scale = 1; }
        if (this.runningBallUI && (this.runningBallContainer).contains(this.runningBallUI)) {
            (this.runningBallContainer).removeChild(this.runningBallUI);
        }
        this.runningBallUI = this.ballArea.getABigBall(ballIndex);
        this.runningBallUI.scaleX = this.runningBallUI.scaleY = scale;
        Com.addObjectAt(this.runningBallContainer, this.runningBallUI, x, y);
    };
    BingoMachine.prototype.afterCheck = function (resultList) {
        var fitItemOnCard = [];
        var blinkGridOnCard = [];
        var blinkGridOnPaytable = {};
        var hasBingo;
        CardManager.clearCardsEffect();
        PayTableManager.clearPaytablesStatus();
        for (var i = 0; i < resultList.length; i++) {
            fitItemOnCard[i] = [];
            blinkGridOnCard[i] = [];
            for (var ob in PayTableManager.payTablesDictionary) {
                var result = resultList[i][ob];
                if (result.fit || result.fits) {
                    fitItemOnCard[i].push({ paytalbe: ob, fit: result.fit, fits: result.fits });
                }
                if (result.unfitIndex >= 0) {
                    blinkGridOnCard[i].push(result.unfitIndex);
                    if (!blinkGridOnPaytable[ob])
                        blinkGridOnPaytable[ob] = [];
                    blinkGridOnPaytable[ob].push(result.unfitIndex);
                }
                else if (result.unfitIndexs) {
                    for (var unfitItem in result.unfitIndexs) {
                        blinkGridOnCard[i].push(result.unfitIndexs[unfitItem]);
                        if (!blinkGridOnPaytable[ob])
                            blinkGridOnPaytable[ob] = [];
                        blinkGridOnPaytable[ob].push(result.unfitIndexs[unfitItem]);
                    }
                }
            }
        }
        if (PaytableFilter.filterObject) {
            for (var i = 0; i < fitItemOnCard.length; i++)
                PaytableFilter.paytableConfixFilter(fitItemOnCard[i], true);
        }
        for (var i = 0; i < fitItemOnCard.length; i++) {
            for (var j = 0; j < fitItemOnCard[i].length; j++) {
                var paytableObject = fitItemOnCard[i][j];
                var paytableName = paytableObject["paytalbe"];
                PayTableManager.payTablesDictionary[paytableName].ui.showFit();
                if (fitItemOnCard[i][j] == "bingo")
                    hasBingo = true;
                CardManager.showPaytableResult(i, paytableName, paytableObject["fit"], paytableObject["fits"]);
            }
        }
        if (this.ballArea.needLightCheck)
            CardManager.stopAllBlink();
        CardManager.letCardBlink(blinkGridOnCard);
        for (var ptObj in blinkGridOnPaytable)
            PayTableManager.payTablesDictionary[ptObj].showBlinkAt(blinkGridOnPaytable[ptObj]);
        if (this.needSmallWinTimesOnCard)
            this.showSmallWinTimes(resultList);
    };
    BingoMachine.prototype.winBingo = function () {
        this.stopAutoPlay();
        if (this.jackpotArea.jackpotBonus) {
            var ev = new egret.Event("JACKPOT_WIN");
            ev.data = { bonus: this.jackpotArea.jackpotNumber };
            this.dispatchEvent(ev);
            this.jackpotArea.jackpotBonus = false;
            this.jackpotArea.jackpotNumber = 0;
        }
        else
            this.dispatchEvent(new egret.Event("winbingo", false, false, { coins: this.ganho }));
    };
    BingoMachine.prototype.showSmallWinTimes = function (resultList) {
        for (var i = 0; i < resultList.length; i++) {
            var blinkGrids = {};
            for (var ob in PayTableManager.payTablesDictionary) {
                var result = resultList[i][ob];
                if (result.unfitIndex >= 0) {
                    if (!blinkGrids[result.unfitIndex])
                        blinkGrids[result.unfitIndex] = [];
                    blinkGrids[result.unfitIndex].push(ob);
                }
                else if (result.unfitIndexs) {
                    for (var unfitItem in result.unfitIndexs) {
                        if (!blinkGrids[result.unfitIndexs[unfitItem]])
                            blinkGrids[result.unfitIndexs[unfitItem]] = [];
                        blinkGrids[result.unfitIndexs[unfitItem]].push(ob);
                    }
                }
            }
            this.showSmallWinResult(i, blinkGrids);
        }
    };
    BingoMachine.prototype.showSmallWinResult = function (cardIndex, blinkGrids) {
        for (var index in blinkGrids) {
            var winTimes = 0;
            for (var j = 0; j < blinkGrids[index].length; j++) {
                var winTimesTxt = PayTableManager.payTablesDictionary[blinkGrids[index][j]].ui["tx"].text;
                winTimes += parseFloat(winTimesTxt.replace(/\D/, ""));
            }
            CardManager.setSmallWinTime(cardIndex, parseInt(index), winTimes);
        }
    };
    /**
     * quick play
     */
    BingoMachine.prototype.quickPlay = function () {
        this.gameToolBar.quickPlay();
    };
    /**
     * stop quick play
     */
    BingoMachine.prototype.stopQuickPlay = function () {
    };
    /**
     * collect credito
     */
    BingoMachine.prototype.collectCredit = function () {
        this.gameToolBar.collect();
    };
    BingoMachine.prototype.runningWinAnimation = function (callback, lightResult, isLastBall) {
        var paytableName = "";
        var multiple = 0;
        for (var i = 0; i < lightResult.length; i++) {
            for (var ob in lightResult[i]) {
                if (!this.lastLightResult[i] || !this.lastLightResult[i][ob] || this.lastLightResult[i][ob].length < lightResult[i][ob].length) {
                    if (multiple < PayTableManager.payTablesDictionary[ob].multiple) {
                        multiple = PayTableManager.payTablesDictionary[ob].multiple;
                        paytableName = PayTableManager.payTablesDictionary[ob].payTableName;
                        if (paytableName == PayTableManager.bingoPaytableName)
                            this.dispatchEvent(new egret.Event("bingo"));
                    }
                }
            }
        }
        this.lastLightResult = lightResult;
        if (paytableName !== "") {
            if (!isLastBall) {
                this.getResultListToCheck(true);
                this.getPaytablesFit(paytableName, callback);
            }
            else {
                this.getPaytablesFit(paytableName);
                callback();
            }
        }
        else
            callback();
    };
    BingoMachine.prototype.getPaytablesFit = function (paytabledName, callback) {
        if (callback === void 0) { callback = null; }
        var soundName = this.getSoundName(paytabledName);
        if (soundName !== "") {
            this.waitingForEffect = true;
            if (SoundManager.soundEfOn) {
                this.playSound(soundName, 1, this.waitForEffect.bind(this, callback));
            }
            else {
                setTimeout(this.waitForEffect.bind(this, callback), 1500);
            }
        }
        else {
            if (callback)
                callback();
        }
    };
    BingoMachine.prototype.onBetChanged = function (event) {
        // override
    };
    BingoMachine.prototype.hasExtraBallFit = function () {
        // override
    };
    BingoMachine.prototype.getExtraBallFit = function () {
        // override
    };
    BingoMachine.prototype.collectExtraBall = function () {
        // override
    };
    BingoMachine.prototype.changeNumberSound = function () {
        // override
    };
    BingoMachine.prototype.roundOver = function () {
        BingoMachine.inRound = false;
    };
    BingoMachine.prototype.startPlay = function () {
        this.stopAllSound();
        CardManager.stopAllBlink();
        if (this.superExtraBg && this.superExtraBg.visible)
            this.superExtraBg.visible = false;
        this.gameToolBar.megeExtraOnTop(false);
        if (this.ganhoCounter)
            this.ganhoCounter.clearGanhoData();
    };
    BingoMachine.prototype.showLastBall = function (ballIndex) {
        this.currentBallIndex++;
        if (this.ballCountText)
            this.ballCountText.text = "" + this.currentBallIndex;
    };
    BingoMachine.prototype.paytableRuleFilter = function (blinkGrids) {
    };
    BingoMachine.prototype.showMiniGame = function () {
    };
    BingoMachine.prototype.showWinAnimationAt = function (cardId, win) {
        // override
    };
    BingoMachine.prototype.dropCoinsAt = function (ptX, ptY, coinsLevel) {
        if (coinsLevel === void 0) { coinsLevel = 1; }
        Com.addObjectAt(this, new DropCoins(coinsLevel), ptX - 100, ptY - 100);
    };
    BingoMachine.prototype.showNoBetAndCredit = function () {
        this.creditText = new TextLabel;
        this.betText = new TextLabel;
    };
    BingoMachine.prototype.showJackpot = function (jackpot, jackpotMinBet, betConfig) {
        // override
    };
    BingoMachine.prototype.refreshGameCoins = function (coins) {
        this.gameCoins = Math.round(coins);
    };
    BingoMachine.prototype.refreshGameDinero = function (dinero) {
        this.dinero = dinero;
    };
    Object.defineProperty(BingoMachine, "jackpotMin", {
        get: function () {
            if (this.currentGame && this.currentGame.jackpotArea)
                return this.currentGame.jackpotArea.jackpotMinBet;
            else
                return 0;
        },
        enumerable: true,
        configurable: true
    });
    BingoMachine.prototype.buildSuperEbArea = function (superEbBgName, superEbAreaX, superEbAreaY) {
        this.superExtraBg = Com.addBitmapAt(this, this.assetStr(superEbBgName), superEbAreaX, superEbAreaY);
        this.superExtraBg.visible = false;
        this.setChildIndex(this.superExtraBg, this.getChildIndex(this.ballArea));
    };
    BingoMachine.prototype.tryFirstMega = function (rect) {
        if (!this.megaName)
            return;
        if (localStorage.getItem(this.megaName))
            return;
        else {
            localStorage.setItem(this.megaName, "true");
            this.stopAutoPlay();
            var ev = new egret.Event("megaFirst");
            ev.data = rect;
            this.dispatchEvent(ev);
        }
    };
    BingoMachine.prototype.stopAutoPlay = function () {
        if (this.gameToolBar.autoPlaying)
            this.gameToolBar.autoPlaying = false;
        else if (this.gameToolBar.buyAllExtra)
            this.gameToolBar.buyAllExtra = false;
    };
    BingoMachine.prototype.onTounamentData = function (cmd, data) {
        var tmData = TounamentDataFormat.parse(cmd, data);
        if (cmd == "trm.start") {
            if (this.tounamentBar)
                return;
            var initData = tmData;
            if (initData.isGold)
                this.tounamentBar = new GoldTounamentLayer(initData);
            else
                this.tounamentBar = new TounamentLayer(initData);
            Com.addObjectAt(this, this.tounamentBar, -235, 117);
            TweenerTool.tweenTo(this.tounamentBar, { x: 0 }, 600, 1000);
        }
        else if (cmd == "trm.update") {
            var updateData = tmData;
            if (this.tounamentBar)
                this.tounamentBar.updata(updateData);
        }
        else if (cmd == "trm.end") {
        }
        else {
            trace(cmd);
            egret.error("tounament command error!");
        }
    };
    BingoMachine.prototype.onLevelUpBonus = function (event) {
        var bonus = event.data;
        if (!isNaN(bonus)) {
            this.gameCoins += bonus;
            this.gameToolBar.updateCoinsAndDinero(this.gameCoins, this.dinero);
        }
    };
    /**************************************************************************************************************/
    BingoMachine.prototype.updateNewDatas = function (data) {
        this.gameToolBar.updateMissionData(data["missionValue"], data["missionTarget"], data["missionId"]);
    };
    BingoMachine.missionPopup = function () {
        this.currentGame.dispatchEvent(new egret.Event("missionPopup"));
    };
    BingoMachine.GENERIC_MODAL_LOADED = "gameLoaded";
    BingoMachine.inRound = false;
    return BingoMachine;
}(GameUIItem));
__reflect(BingoMachine.prototype, "BingoMachine");
var GenericPo = (function (_super) {
    __extends(GenericPo, _super);
    function GenericPo(configUrl) {
        if (configUrl === void 0) { configUrl = null; }
        return _super.call(this, configUrl) || this;
    }
    GenericPo.prototype.init = function () {
        if (this.bgAssetName !== "") {
            this.bg = Com.addBitmapAt(this, this.bgAssetName, 0, 0);
            this.anchorOffsetX = this.bg.width >> 1;
            this.anchorOffsetY = this.bg.height >> 1;
        }
        else {
            this.width = document.documentElement.clientWidth;
            this.height = document.documentElement.clientHeight;
            this.anchorOffsetX = this.width >> 1;
            this.anchorOffsetY = this.height >> 1;
        }
        if (!this.closeButtonOffset)
            this.closeButtonOffset = new egret.Point(0, 0);
        if (this.closeButtonAssetName)
            this.closeButton = Com.addDownButtonAt(this, this.closeButtonAssetName, this.closeButtonAssetName, this.bg.width + this.closeButtonOffset.x, this.closeButtonOffset.y, this.onClose, true);
        _super.prototype.init.call(this);
    };
    GenericPo.prototype.onClose = function (event) {
        this.dispatchEvent(new egret.Event(GenericModal.CLOSE_MODAL));
    };
    /**
     * update deal overplus text
     */
    GenericPo.prototype.updateDealOverplusText = function (time) { };
    /**
     * po overplus over
     */
    GenericPo.prototype.poOverplusOver = function () { };
    /**
     * on key up
     */
    GenericPo.prototype.onKeyUp = function (keyCode) { };
    /**
     * on mouse wheel
     */
    GenericPo.prototype.onMouseWheel = function (dir) { };
    return GenericPo;
}(GenericModal));
__reflect(GenericPo.prototype, "GenericPo");
var PaytableLayer = (function (_super) {
    __extends(PaytableLayer, _super);
    function PaytableLayer() {
        var _this = _super.call(this) || this;
        _this.cacheAsBitmap = true;
        return _this;
    }
    PaytableLayer.prototype.addPaytableUI = function () {
        PayTableManager.getPayTableUI();
        var pts = PayTableManager.payTablesDictionary;
        for (var ob in pts) {
            var pos = pts[ob].position;
            pts[ob].UI.x = pos["x"] - this.x;
            pts[ob].UI.y = pos["y"] - this.y;
            this.addChild(pts[ob].UI);
        }
    };
    PaytableLayer.prototype.clearPaytableFgs = function () {
        //sub class override
    };
    PaytableLayer.prototype.buildFgs = function () {
        //sub class override
    };
    PaytableLayer.prototype.buildTitleText = function () {
        //sub class override
    };
    PaytableLayer.prototype.payTableFit = function (event) {
        //sub class override
    };
    return PaytableLayer;
}(egret.DisplayObjectContainer));
__reflect(PaytableLayer.prototype, "PaytableLayer");
var PaytableUI = (function (_super) {
    __extends(PaytableUI, _super);
    function PaytableUI(useBg) {
        var _this = _super.call(this) || this;
        _this.useBg = useBg;
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemove, _this);
        return _this;
    }
    Object.defineProperty(PaytableUI.prototype, "_tx", {
        get: function () {
            var txt = this.tx.text.replace(/\D/g, "");
            return isNaN(Number(txt)) ? 1 : Number(txt);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaytableUI.prototype, "blink", {
        set: function (value) {
            this._blink = value;
            this.currentEffect = 0;
            if (value) {
                this.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
                if (this.useBg) {
                    for (var i = 0; i < this.blinkGridsIndexs.length; i++) {
                        this.addChild(this.grids[this.blinkGridsIndexs[i]]);
                    }
                }
            }
            else {
                if (!this.useBg)
                    this.tx.filters = [];
                else {
                    this.removeChildren();
                    this.addChild(this.bg);
                    if (this.tx) {
                        this.addChild(this.tx);
                        this.tx.filters = [];
                    }
                }
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
            }
        },
        enumerable: true,
        configurable: true
    });
    PaytableUI.prototype.onRemove = function (event) {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
    };
    Object.defineProperty(PaytableUI.prototype, "winEffects", {
        set: function (value) {
            this._winEffects = value;
        },
        enumerable: true,
        configurable: true
    });
    PaytableUI.prototype.onFrame = function (event) {
        this.currentEffect++;
        if (!this.useBg) {
            if (PaytableUI.needBlink)
                this.tx.filters = [this._winEffects[(this.currentEffect >> 4) % this._winEffects.length]];
        }
        else {
            for (var i = 0; i < this.blinkGridsIndexs.length; i++) {
                this.grids[this.blinkGridsIndexs[i]].filters = [this._winEffects[(this.currentEffect >> 4) % this._winEffects.length]];
            }
            if (this.tx && this.blinkGridsIndexs.length)
                this.tx.filters = [this._winEffects[(this.currentEffect >> 4) % this._winEffects.length]];
        }
    };
    PaytableUI.prototype.setText = function (text, color, size) {
        if (color === void 0) { color = 0; }
        if (!text)
            return;
        this.textColor = color;
        this.tx = new egret.TextField;
        this.tx.textColor = color;
        this.tx.size = size;
        this.tx.bold = PaytableUI.textBold;
        this.tx.text = text;
        if (!this.useBg)
            this.addChild(this.tx);
    };
    PaytableUI.prototype.setBackground = function (assetsName) {
        if (!this.useBg)
            return;
        this.bgName = assetsName;
    };
    PaytableUI.prototype.showFit = function () {
        this.blink = false;
        if (!this.useBg) {
            this.blink = true;
        }
        else {
            this.focus();
        }
        this.dispatchEvent(new egret.Event("paytableFitEvent"));
    };
    PaytableUI.prototype.clearStatus = function () {
        this.blink = false;
        if (this.bg)
            this.graphics.clear();
    };
    PaytableUI.prototype.setGrids = function (ruleString) {
        if (!ruleString)
            return;
        this.gridRuleString = ruleString;
    };
    PaytableUI.prototype.initUI = function () {
        if (!this.useBg)
            return;
        this.bg = Com.createBitmapByName(BingoMachine.getAssetStr(this.bgName));
        this.addChild(this.bg);
        var ar = this.gridRuleString.split("*");
        var row = parseInt(ar[0]);
        var line = parseInt(ar[1]);
        var num = row * line;
        var width = Math.ceil(this.bg.width / row);
        var height = Math.ceil(this.bg.height / line);
        this.grids = [];
        for (var i = 0; i < num; i++) {
            this.grids[i] = new egret.Shape;
            this.grids[i].x = i % row * width;
            this.grids[i].y = Math.floor(i / row) * height;
            GraphicTool.drawRect(this.grids[i], new egret.Rectangle(0, 0, width - 1, height - 1));
        }
        if (this.tx) {
            this.tx.width = this.bg.width;
            this.tx.y = this.bg.height + 3;
            this.tx.textAlign = "center";
            this.addChild(this.tx);
        }
    };
    PaytableUI.prototype.focus = function () {
        if (this.useBg) {
            GraphicTool.drawRect(this, new egret.Rectangle(-2, -2, this.bg.width + 4, this.bg.height + 4), PaytableUI.focusColor, true, 0.0, 0, 2, PaytableUI.focusColor);
        }
    };
    PaytableUI.prototype.showBlinkAt = function (grids) {
        if (this.useBg) {
            this.blinkGridsIndexs = grids;
            this.blink = true;
        }
    };
    PaytableUI.textBold = false;
    PaytableUI.focusColor = 0xFFFF88;
    PaytableUI.needBlink = true;
    return PaytableUI;
}(egret.Sprite));
__reflect(PaytableUI.prototype, "PaytableUI");
var GanhoCounter = (function () {
    function GanhoCounter(winCallback) {
        if (winCallback === void 0) { winCallback = null; }
        this.ganhoArray = [];
        this.winCallback = winCallback;
    }
    GanhoCounter.prototype.clearGanhoData = function () {
        this.ganhoArray = [];
    };
    GanhoCounter.prototype.countGanhoAndPlayAnimation = function (resultList) {
        var fitItemOnCard = this.getFitItemOnCard(resultList);
        var ganhoArray = this.getGanhoArray(resultList, fitItemOnCard);
        this.showWinAnimationOnAllCards(ganhoArray);
    };
    GanhoCounter.prototype.showWinAnimationOnAllCards = function (ganhoArray) {
        for (var i = 0; i < ganhoArray.length; i++) {
            if (ganhoArray[i]) {
                if (!this.ganhoArray[i] || ganhoArray[i] > this.ganhoArray[i]) {
                    this.ganhoArray[i] = ganhoArray[i];
                    if (this.winCallback)
                        this.winCallback(i, ganhoArray[i]);
                }
            }
        }
    };
    GanhoCounter.prototype.getFitItemOnCard = function (resultList) {
        var fitItemOnCard = [];
        for (var i = 0; i < resultList.length; i++) {
            fitItemOnCard[i] = [];
            for (var ob in PayTableManager.payTablesDictionary) {
                var result = resultList[i][ob];
                if (result.fit || result.fits) {
                    fitItemOnCard[i].push({ paytalbe: ob, fit: result.fit, fits: result.fits });
                }
            }
        }
        if (PaytableFilter.filterObject) {
            for (var i = 0; i < fitItemOnCard.length; i++)
                PaytableFilter.paytableConfixFilter(fitItemOnCard[i], true);
        }
        return fitItemOnCard;
    };
    GanhoCounter.prototype.getGanhoArray = function (resultList, fitItemOnCard) {
        var ganhoArray = [];
        for (var i = 0; i < resultList.length; i++) {
            ganhoArray[i] = 0;
            for (var ob in PayTableManager.payTablesDictionary) {
                var result = resultList[i][ob];
                if (result.fit || result.fits) {
                    var inFitItem = false;
                    for (var k = 0; k < fitItemOnCard[i].length; k++) {
                        if (fitItemOnCard[i][k]["paytalbe"] == ob) {
                            inFitItem = true;
                            break;
                        }
                    }
                    if (!inFitItem)
                        continue;
                    this.countGanho(ganhoArray, i, ob, result);
                }
            }
        }
        return ganhoArray;
    };
    GanhoCounter.prototype.countGanho = function (ganhoArray, i, ob, result) {
        var winTimesTxt = PayTableManager.payTablesDictionary[ob].ui["tx"].text;
        ganhoArray[i] += parseFloat(winTimesTxt.replace(/\D/, ""));
    };
    return GanhoCounter;
}());
__reflect(GanhoCounter.prototype, "GanhoCounter");
var BallManager = (function (_super) {
    __extends(BallManager, _super);
    function BallManager() {
        var _this = _super.call(this) || this;
        _this.moveingBallLayer = new egret.DisplayObjectContainer;
        _this.staticBallLayer = new egret.DisplayObjectContainer;
        _this.addChild(_this.staticBallLayer);
        _this.addChild(_this.moveingBallLayer);
        _this.staticBallLayer.cacheAsBitmap = true;
        return _this;
    }
    BallManager.prototype.getBallSettings = function (balls, ballSize, ballTextSize) {
        var newballs = [];
        for (var i = 0; i < balls.length; i++) {
            newballs[i] = {};
            for (var ob in balls[i])
                newballs[i][ob] = balls[i][ob];
        }
        BallManager.balls = newballs;
        BingoBall.ballUIs = [];
        this.ballSize = ballSize;
        this.ballTextSize = ballTextSize;
    };
    BallManager.prototype.clearBalls = function () {
        for (var i = 0; i < this.moveingBallLayer.numChildren; i++) {
            var ball = this.moveingBallLayer.getChildAt(i);
            ball.removeEventListener(BingoBall.BALL_MOVE_END, this.onBallMoveEnd, this);
        }
        this.moveingBallLayer.removeChildren();
        this.staticBallLayer.removeChildren();
    };
    BallManager.prototype.onRemove = function () {
        clearTimeout(this.nextDelayId);
    };
    BallManager.prototype.runBalls = function (balls) {
        this.clearBalls();
        this.lightResult = null;
        this.ballIndexs = balls;
        this.extraBalls = [];
        this.ballOrder = 0;
        this.beginRun();
    };
    BallManager.prototype.runCutBalls = function (balls) {
        this.ballIndexs = this.ballIndexs.concat(balls);
        this.beginRun();
    };
    BallManager.prototype.runExtra = function (extraBall) {
        this.ballIndexs.push(extraBall);
        this.beginRun();
    };
    BallManager.prototype.runMissExtra = function (missExtra) {
        if (!missExtra)
            return;
        while (missExtra.length)
            this.ballIndexs.push(missExtra.shift());
        while (this.ballIndexs.length) {
            this.runMissExtraBall();
        }
    };
    BallManager.prototype.beginRun = function () {
        if (!this.ballIndexs.length) {
            BingoMachine.endBallRunning();
            return;
        }
        this.runNextBall();
        var lightResult;
        var newFit;
        var isLastBall = this.ballIndexs.length == 0;
        if (this.needLightCheck || isLastBall)
            lightResult = BingoMachine.betweenBallRunning();
        if (lightResult) {
            newFit = this.recordlightResult(lightResult);
        }
        if (newFit) {
            BingoMachine.runningAnimation(this.delayRunNextBall.bind(this), lightResult, isLastBall);
        }
        else
            this.delayRunNextBall();
    };
    BallManager.prototype.stopBallRunning = function () {
        while (this.ballIndexs.length > 1) {
            this.runNextBall();
        }
    };
    BallManager.prototype.runNextBall = function () {
        var index = this.ballIndexs.shift();
        var ballInfo = BallManager.balls[this.ballOrder++];
        var path = ballInfo["path"];
        var pts = [];
        for (var i = 0; i < path.length; i++) {
            pts[i] = new egret.Point(path[i]["x"], path[i]["y"]);
        }
        var sp = this.buildBallWithIndex(index);
        this.moveingBallLayer.addChild(sp);
        sp.addEventListener(BingoBall.BALL_MOVE_END, this.onBallMoveEnd, this);
        sp.startRun(pts);
        CardManager.getBall(index);
        BingoMachine.runningBall(index);
    };
    BallManager.prototype.onBallMoveEnd = function (event) {
        var ball = event.target;
        this.staticBallLayer.addChild(ball);
    };
    BallManager.prototype.runMissExtraBall = function () {
        var index = this.ballIndexs.shift();
        var ballInfo = BallManager.balls[this.ballOrder++];
        var path = ballInfo["path"];
        var lstPtObj = path[path.length - 1];
        var ptLast = new egret.Point(lstPtObj["x"], lstPtObj["y"]);
        var sp = this.buildBallWithIndex(index);
        Com.addObjectAt(this.staticBallLayer, sp, ptLast.x, ptLast.y);
        var cross = new egret.Shape;
        var a = this.ballSize / sp.scaleX;
        cross.graphics.lineStyle(Math.floor(a * 0.07), 0xFF0000);
        var startOffset = (2 - Math.SQRT2) * 0.25 * a;
        cross.graphics.moveTo(startOffset, startOffset);
        cross.graphics.lineTo(sp.width - startOffset, sp.height - startOffset);
        cross.graphics.moveTo(sp.width - startOffset, startOffset);
        cross.graphics.lineTo(startOffset, sp.height - startOffset);
        sp.filters = [MatrixTool.colorMatrixLighter(0.5)];
        sp.addChild(cross);
    };
    BallManager.prototype.delayRunNextBall = function () {
        this.nextDelayId = setTimeout(this.beginRun.bind(this), BallManager.normalBallInterval);
    };
    BallManager.prototype.recordlightResult = function (lightResult) {
        if (!this.lightResult || this.lightResult.length == 0) {
            this.lightResult = lightResult;
            return true;
        }
        for (var i = 0; i < lightResult.length; i++) {
            for (var ob in lightResult[i]) {
                if (!this.lightResult[i][ob] || lightResult[i][ob].length != this.lightResult[i][ob].length) {
                    this.lightResult = lightResult;
                    return true;
                }
            }
        }
        return false;
    };
    BallManager.prototype.setBallBg = function (ball, assetName) {
        Com.addBitmapAt(ball, BingoMachine.getAssetStr(assetName), 0, 0);
    };
    BallManager.prototype.buildBallWithIndex = function (num, scaleToGame) {
        if (num === void 0) { num = 0; }
        if (scaleToGame === void 0) { scaleToGame = true; }
        var index = num - 1;
        if (!BingoBall.ballUIs[index]) {
            BingoBall.ballUIs[index] = this.buildBallUIWithIndex(index, num);
        }
        return new BingoBall(index, scaleToGame ? this.ballSize : 0);
    };
    BallManager.prototype.buildBallUIWithIndex = function (index, num) {
        if (num === void 0) { num = 0; }
        var ballObj = BallManager.balls[index];
        var ball = new egret.Sprite();
        this.setBallBg(ball, ballObj["ui"]);
        var tx = new egret.TextField;
        tx.width = ball.width;
        tx.size = this.ballTextSize;
        tx.bold = true;
        tx.textAlign = "center";
        tx.textColor = Number(ballObj["color"]);
        tx.text = "" + (num ? num : index + 1);
        tx.y = ball.height - tx.textHeight >> 1;
        if (BallManager.textBold) {
            tx.fontFamily = "Arial Black";
        }
        if (ballObj["offsetX"])
            tx.x = ballObj["offsetX"];
        if (BallManager.ballOffsetY)
            tx.y += BallManager.ballOffsetY;
        ball.addChild(tx);
        return ball;
    };
    BallManager.prototype.getABall = function (index) {
        return this.buildBallWithIndex(index);
    };
    BallManager.prototype.getABigBall = function (index) {
        return this.buildBallWithIndex(index, false);
    };
    BallManager.getBallLastPosition = function (index) {
        var ballObject = this.balls[index];
        var ballPath = ballObject["path"];
        var ballPositionObject = ballPath[ballPath.length - 1];
        return new egret.Point(ballPositionObject["x"], ballPositionObject["y"]);
    };
    BallManager.normalBallInterval = 100;
    BallManager.ballOffsetY = 0;
    return BallManager;
}(egret.DisplayObjectContainer));
__reflect(BallManager.prototype, "BallManager");
var BingoBall = (function (_super) {
    __extends(BingoBall, _super);
    function BingoBall(index, ballSize) {
        if (ballSize === void 0) { ballSize = 0; }
        var _this = _super.call(this) || this;
        _this.ballSize = ballSize;
        var ren = new egret.RenderTexture;
        var newBall = BingoBall.ballUIs[index];
        ren.drawToTexture(newBall, new egret.Rectangle(0, 0, newBall.width, newBall.height), ballSize ? ballSize / newBall.height : 1);
        var bmp = new egret.Bitmap(ren);
        _this.addChild(bmp);
        return _this;
    }
    BingoBall.prototype.startRun = function (pts) {
        if (BallManager.rotateBall) {
            var half = this.ballSize >> 1;
            this.anchorOffsetX = half;
            this.anchorOffsetY = half;
            this.x = pts[0]["x"] + half;
            this.y = pts[0]["y"] + half;
        }
        else {
            this.x = pts[0]["x"];
            this.y = pts[0]["y"];
        }
        this.pts = pts;
        this.moveToNextPoint();
    };
    BingoBall.prototype.moveToNextPoint = function () {
        var curruntPoint = this.pts.shift();
        if (!this.pts.length) {
            this.dispatchEvent(new egret.Event(BingoBall.BALL_MOVE_END));
            return;
        }
        var targetPoint = this.pts[0];
        var distance = egret.Point.distance(curruntPoint, targetPoint);
        var tw = egret.Tween.get(this);
        if (BallManager.rotateBall) {
            var half = this.ballSize >> 1;
            tw.to({ x: targetPoint.x + half, y: targetPoint.y + half, rotation: this.rotation + 360 }, distance * 0.5);
        }
        else
            tw.to({ x: targetPoint.x, y: targetPoint.y }, distance * 0.5);
        tw.call(this.moveToNextPoint, this);
    };
    BingoBall.BALL_MOVE_END = "ballMoveEnd";
    return BingoBall;
}(egret.Sprite));
__reflect(BingoBall.prototype, "BingoBall");
var BingoBackGroundSetting = (function () {
    function BingoBackGroundSetting() {
    }
    BingoBackGroundSetting.getBackgroundData = function (bgColor, bgItems) {
        this.bgColor = bgColor;
        this.bgItems = bgItems;
    };
    BingoBackGroundSetting.initBackground = function (target) {
        this.drawBackgroundOn(target);
        var movieClipDataFactory = this.getAnimationFactory(target);
        this.buildBGItemsByArray(target, movieClipDataFactory);
        return movieClipDataFactory;
    };
    BingoBackGroundSetting.getAnimationFactory = function (target) {
        var animationAssetsName = egret.getDefinitionByName(egret.getQualifiedClassName(target)).animationAssetName;
        var data = RES.getRes(animationAssetsName + "_json");
        var tex = RES.getRes(animationAssetsName + "_png");
        return new egret.MovieClipDataFactory(data, tex);
    };
    BingoBackGroundSetting.drawBackgroundOn = function (target) {
        GraphicTool.drawRect(target, new egret.Rectangle(0, 0, BingoBackGroundSetting.gameMask.width, BingoBackGroundSetting.gameMask.height), this.bgColor);
    };
    BingoBackGroundSetting.buildBGItemsByArray = function (target, mcf) {
        var items = new Array();
        var bgItemNames = this.bgItems;
        for (var i = 0; i < bgItemNames.length; i++) {
            var sp = void 0;
            if (RES.getRes(BingoMachine.getAssetStr(bgItemNames[i]["name"]))) {
                sp = Com.addBitmapAt(target, BingoMachine.getAssetStr(bgItemNames[i]["name"]), bgItemNames[i]["x"], bgItemNames[i]["y"]);
                sp.name = BingoMachine.getAssetStr(bgItemNames[i]["name"]);
            }
            else {
                sp = Com.addMovieClipAt(target, mcf, bgItemNames[i]["name"], bgItemNames[i]["x"], bgItemNames[i]["y"]);
                sp.name = BingoMachine.getAssetStr(bgItemNames[i]["name"]);
            }
            target.addChild(sp);
            items.push(sp);
        }
        return items;
    };
    BingoBackGroundSetting.gameMask = new egret.Rectangle(0, 0, 2000, 1125);
    BingoBackGroundSetting.gameSize = new egret.Point(960, 540);
    return BingoBackGroundSetting;
}());
__reflect(BingoBackGroundSetting.prototype, "BingoBackGroundSetting");
var GameCommands = (function () {
    function GameCommands() {
    }
    GameCommands.help = "help";
    GameCommands.decreseBet = "decreseBet";
    GameCommands.increaseBet = "increaseBet";
    GameCommands.changeNumber = "changeNumber";
    GameCommands.maxBet = "maxBet";
    GameCommands.minBet = "minBet";
    GameCommands.collect = "collect";
    GameCommands.play = "play";
    GameCommands.stop = "stop";
    GameCommands.startAuto = "startAuto";
    GameCommands.extra = "extra";
    GameCommands.stopAuto = "stopAuto";
    GameCommands.saving = "saving";
    GameCommands.showMini = "showMini";
    GameCommands.buyAll = "buyAll";
    return GameCommands;
}());
__reflect(GameCommands.prototype, "GameCommands");
var GameData = (function () {
    function GameData() {
    }
    Object.defineProperty(GameData, "minBet", {
        get: function () {
            return this.bets[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameData, "maxBet", {
        get: function () {
            return this.bets[this.bets.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    GameData.betUp = function () {
        this._currentBetIndex++;
    };
    GameData.betDown = function () {
        this._currentBetIndex--;
    };
    Object.defineProperty(GameData, "currentBet", {
        get: function () {
            if (this._currentBetIndex <= -1)
                this._currentBetIndex = this.bets.length - 1;
            else if (this._currentBetIndex >= this.bets.length)
                this._currentBetIndex = 0;
            return this.bets[this._currentBetIndex];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameData, "currentBetIndex", {
        get: function () {
            return this._currentBetIndex;
        },
        enumerable: true,
        configurable: true
    });
    GameData.setBetToMax = function () {
        this._currentBetIndex = this.bets.length - 1;
    };
    GameData.setBetToMin = function () {
        this._currentBetIndex = 0;
    };
    GameData.getBetList = function (callback, gameId) {
        this.waiter = callback;
        var parameters = { current_bet: GameData.currentBet, "machineId": parseInt(gameId) };
        new DataServer().getDataFromUrl(PlayerConfig.config("http") + "://" + PlayerConfig.config("host") + "/cmd.php?action=get_machine_settings", this.getMachineSettingSuccess.bind(this), this, true, parameters);
    };
    GameData.getMachineSettingSuccess = function (data) {
        var dataObj = JSON.parse(data);
        if (dataObj["bet_steps"] instanceof Array) {
            var betsArr = dataObj["bet_steps"];
            this.bets = [];
            for (var i = 0; i < betsArr.length; i++) {
                this.bets[i] = parseInt(betsArr[i]);
            }
            this._currentBetIndex = this.bets.indexOf(dataObj["default_bet"]);
            this.waiter(true);
        }
    };
    GameData.bets = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000, 2500000, 5000000, 10000000];
    GameData._currentBetIndex = -1;
    return GameData;
}());
__reflect(GameData.prototype, "GameData");
var MuLang = (function () {
    function MuLang() {
    }
    MuLang.getText = function (key, caseType) {
        if (caseType === void 0) { caseType = 0; }
        if (!MuLang.txt)
            return null;
        var lanObject = MuLang.txt[key];
        if (!lanObject)
            return key;
        var str = lanObject[MuLang.language];
        if (str) {
            switch (caseType) {
                default: return str;
                case 1: return str.toUpperCase();
                case 2: return str.toLowerCase();
                case 3: return str.substring(0, 1).toUpperCase() + str.substring(1, str.length).toLowerCase();
            }
        }
        else
            return key;
    };
    Object.defineProperty(MuLang, "language", {
        get: function () {
            if (localStorage && ["pt", "en", "es"].indexOf(localStorage["language"]) >= 0)
                return localStorage["language"];
            var resLan = requestStr("lan");
            if (["pt", "en", "es"].indexOf(resLan) >= 0)
                return resLan;
            return "pt";
        },
        set: function (value) {
            localStorage.setItem("language", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MuLang, "languageName", {
        get: function () {
            return this.lanuageNames[this.language];
        },
        enumerable: true,
        configurable: true
    });
    MuLang.txt = {};
    MuLang.CASE_NORMAL = 0;
    MuLang.CASE_UPPER = 1;
    MuLang.CASE_LOWER = 2;
    MuLang.CASE_TYPE_CAPITALIZE = 3;
    MuLang.lanuageNames = { en: "english", es: "spanish", pt: "portuguese" };
    return MuLang;
}());
__reflect(MuLang.prototype, "MuLang");
var MDS = (function () {
    function MDS() {
    }
    MDS.addGameText = function (target, x, y, size, color, textItem, stroke, width, additionString, scaleX) {
        if (stroke === void 0) { stroke = false; }
        if (width === void 0) { width = 200; }
        if (additionString === void 0) { additionString = ""; }
        if (scaleX === void 0) { scaleX = 0.8; }
        var tx = Com.addLabelAt(target, x, y + BrowserInfo.textUp, width, size, size, stroke, true);
        tx.textColor = color;
        tx.textAlign = "left";
        tx.setText(MuLang.getText(textItem) + additionString);
        tx.scaleX = scaleX;
        return tx;
    };
    MDS.addGameTextCenterShadow = function (target, x, y, size, color, textItem, stroke, width, center, dropShadow) {
        if (stroke === void 0) { stroke = false; }
        if (width === void 0) { width = 200; }
        if (center === void 0) { center = true; }
        if (dropShadow === void 0) { dropShadow = true; }
        var tx = this.addGameText(target, x, y, size, color, textItem, stroke, width);
        if (center)
            tx.textAlign = "center";
        if (dropShadow)
            tx.filters = [new egret.DropShadowFilter(3, 45, 0x000000, 1, 1, 1, 1, 3 /* HIGH */)];
        return tx;
    };
    MDS.addBitmapTextAt = function (target, fontName, x, y, textAlign, size, color, width, height) {
        if (textAlign === void 0) { textAlign = "left"; }
        if (color === void 0) { color = 0; }
        var bmpText = new BmpText();
        bmpText.font = RES.getRes(fontName);
        bmpText.textAlign = textAlign;
        bmpText.verticalAlign = "middle";
        bmpText.text = " ";
        var scale = size / bmpText.textHeight;
        bmpText.width = 1 / scale * width;
        bmpText.height = 1 / scale * height;
        bmpText.scaleX = bmpText.scaleY = scale;
        bmpText.filters = [MatrixTool.colorMatrixPure(color)];
        Com.addObjectAt(target, bmpText, x, y);
        return bmpText;
    };
    MDS.removeSelf = function (item) {
        if (item.parent)
            item.parent.removeChild(item);
    };
    MDS.onUserHeadLoaded = function (userInfo, size, event) {
        var loader = event.currentTarget;
        var bmd = loader.data;
        var tx = new egret.Texture;
        tx.bitmapData = bmd;
        userInfo.scaleX = userInfo.scaleY = 1;
        userInfo.texture = tx;
        userInfo.width = userInfo.height = size;
    };
    return MDS;
}());
__reflect(MDS.prototype, "MDS");
var CardArrowLayer = (function (_super) {
    __extends(CardArrowLayer, _super);
    function CardArrowLayer(mcf, assetName, offsetPt, disY, scaleX) {
        if (scaleX === void 0) { scaleX = 1; }
        var _this = _super.call(this) || this;
        _this.arrowMcs = [];
        var cardPositions = GameCardUISettings.cardPositions;
        for (var i = 0; i < cardPositions.length; i++) {
            _this.arrowMcs[i] = [];
            for (var j = 0; j < 3; j++) {
                var arrowAnimation = _this.buildArrowByPoint(mcf, assetName, cardPositions[i], j, offsetPt, disY, scaleX);
                arrowAnimation.stop();
                arrowAnimation.visible = false;
                _this.arrowMcs[i][j] = arrowAnimation;
            }
        }
        return _this;
    }
    CardArrowLayer.prototype.buildArrowByPoint = function (mcf, assetName, cardPosition, j, offsetPt, disY, scaleX) {
        var arrowAnimation = Com.addMovieClipAt(this, mcf, assetName, cardPosition["x"] + offsetPt.x, cardPosition["y"] + disY * j + offsetPt.y);
        if (scaleX != 1)
            arrowAnimation.scaleX = scaleX;
        return arrowAnimation;
    };
    CardArrowLayer.prototype.arrowBlink = function (resultList) {
        this.clearArrow();
        for (var i = 0; i < 4; i++) {
            if (resultList[i]["line"] && resultList[i]["line"]["unfitIndexs"]) {
                for (var line in resultList[i]["line"]["unfitIndexs"]) {
                    var arrow = this.arrowMcs[i][line];
                    arrow.visible = true;
                    arrow.gotoAndPlay(1);
                }
            }
        }
    };
    CardArrowLayer.prototype.clearArrow = function () {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                var arrow = this.arrowMcs[i][j];
                arrow.visible = false;
                arrow.stop();
            }
        }
    };
    return CardArrowLayer;
}(egret.DisplayObjectContainer));
__reflect(CardArrowLayer.prototype, "CardArrowLayer");
var CardManager = (function () {
    function CardManager() {
    }
    CardManager.getCardData = function (data) {
        this.cards = new Array();
        GameCard.getCardData(data);
        for (var i = 0; i < GameCardUISettings.cardPositions.length; i++) {
            this.cards[i] = eval("new CardManager.cardType( i )");
        }
    };
    Object.defineProperty(CardManager, "enabledCards", {
        get: function () {
            return this.cards.length;
        },
        enumerable: true,
        configurable: true
    });
    CardManager.setCardBet = function (bet) {
        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].bet = bet;
        }
        return bet * this.enabledCards;
    };
    CardManager.getBall = function (ballIndex) {
        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].checkNumber(ballIndex);
        }
    };
    CardManager.clearCardsStatus = function () {
        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].clearStatus();
        }
    };
    CardManager.getCheckingStrings = function () {
        var checkingString = [];
        for (var i = 0; i < this.cards.length; i++) {
            checkingString.push(this.cards[i].getCheckString());
        }
        return checkingString;
    };
    CardManager.letCardBlink = function (blinkGridOnCard) {
        for (var i = 0; i < blinkGridOnCard.length; i++) {
            for (var j = 0; j < blinkGridOnCard[i].length; j++) {
                this.cards[i].blinkAt(blinkGridOnCard[i][j]);
            }
        }
    };
    CardManager.stopAllBlink = function () {
        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].stopBlink();
        }
    };
    CardManager.changeCardsBgColor = function () {
        if (!GameCardUISettings.titleColors)
            return;
        GameCardUISettings.changeBgColor();
        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].getBgColor();
        }
    };
    CardManager.showPaytableResult = function (cardIndex, paytableName, fit, fitIndexArray) {
        if (fit)
            fitIndexArray = [];
        this.cards[cardIndex].showfitEffect(paytableName, fitIndexArray);
    };
    CardManager.startBlinkTimer = function () {
        this.blinkTimer = new egret.Timer(500, 0);
        this.blinkTimer.addEventListener(egret.TimerEvent.TIMER, this.onBlinkTimer, this);
        this.blinkTimer.start();
    };
    CardManager.onBlinkTimer = function (event) {
        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].blink(event.target.currentCount & 1);
        }
    };
    CardManager.stopBlinkTimer = function () {
        this.blinkTimer.reset();
        this.blinkTimer.stop();
    };
    CardManager.clearCardsEffect = function () {
        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].clearFitEffect();
        }
    };
    CardManager.setSmallWinTime = function (cardIndex, gridIndex, winTimes) {
        if (this.cards[cardIndex] instanceof ExtraBlinkCard) {
            this.cards[cardIndex].setSmallWinTimeAt(gridIndex, winTimes);
        }
        else {
            console.error("current card is not extra blink card, cannot setSmallWinTimeAt");
        }
    };
    CardManager.cardType = GameCard;
    CardManager.gridType = TowerGrid;
    return CardManager;
}());
__reflect(CardManager.prototype, "CardManager");
var ExtraBlinkCard = (function (_super) {
    __extends(ExtraBlinkCard, _super);
    function ExtraBlinkCard(cardId) {
        return _super.call(this, cardId) || this;
    }
    ExtraBlinkCard.prototype.getNumbers = function (numbers) {
        _super.prototype.getNumbers.call(this, numbers);
        for (var i = 0; i < this.grids.length; i++) {
            this.grids[i].extraBlinkNumber = numbers[i];
        }
    };
    ExtraBlinkCard.prototype.showWinCount = function (winNumber) {
        if (winNumber > 0)
            this.betText.setText(MuLang.getText("win") + ": " + (winNumber ? Utils.formatCoinsNumber(winNumber) : ""));
    };
    ExtraBlinkCard.prototype.setSmallWinTimeAt = function (gridIndex, winTimes) {
        if (this.grids[gridIndex] instanceof ExtraBlinkGrid) {
            this.grids[gridIndex].setSmallTime(winTimes);
        }
        else {
            console.error("current grid is not extra blink grid, cannot setSmallTime");
        }
    };
    return ExtraBlinkCard;
}(GameCard));
__reflect(ExtraBlinkCard.prototype, "ExtraBlinkCard");
var ExtraBlinkGrid = (function (_super) {
    __extends(ExtraBlinkGrid, _super);
    function ExtraBlinkGrid() {
        var _this = _super.call(this) || this;
        _this.buildExtraBlinkSp();
        _this.buildSmallWinText();
        return _this;
    }
    Object.defineProperty(ExtraBlinkGrid.prototype, "blink", {
        get: function () {
            return this._blink;
        },
        set: function (value) {
            if (this._blink == value)
                return;
            this._blink = value;
            if (!value) {
                this.currentBgPic = this.defaultBgPic;
                this.extraBinkSp.visible = false;
                this.numTxt.textColor = CardGridColorAndSizeSettings.numberColor;
            }
            else {
                this.numTxt.textColor = CardGridColorAndSizeSettings.numberColorOnEffect;
                this.showBlink(true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtraBlinkGrid.prototype, "extraBlinkNumber", {
        set: function (value) {
            this.extraBlinkNumTxt.setText("" + value);
        },
        enumerable: true,
        configurable: true
    });
    ExtraBlinkGrid.prototype.buildExtraBlinkSp = function () {
        this.extraBinkSp = new egret.DisplayObjectContainer;
        Com.addObjectAt(this, this.extraBinkSp, 0, 0);
        Com.addObjectAt(this.extraBinkSp, this.getBlinkBg(), 0, 0);
        this.extraBinkSp.visible = false;
    };
    ExtraBlinkGrid.prototype.buildSmallWinText = function () {
        //sub class override
    };
    ExtraBlinkGrid.prototype.getBlinkBg = function () {
        return null;
    };
    ExtraBlinkGrid.prototype.setSmallTime = function (winTimes) {
        if (!winTimes) {
            this.blink = false;
            return;
        }
        this.smallWinTimesText.text = "x" + winTimes;
    };
    ExtraBlinkGrid.prototype.showBlink = function (isShow) {
        if (ExtraBlinkGrid.extraBink) {
            this.currentBgPic = this.defaultBgPic;
            this.extraBinkSp.visible = isShow;
        }
        else {
            _super.prototype.showBlink.call(this, isShow);
            this.extraBinkSp.visible = false;
        }
        this.numTxt.textColor = CardGridColorAndSizeSettings.numberColor;
    };
    return ExtraBlinkGrid;
}(TowerGrid));
__reflect(ExtraBlinkGrid.prototype, "ExtraBlinkGrid");
var ForkGrid = (function (_super) {
    __extends(ForkGrid, _super);
    function ForkGrid() {
        return _super.call(this) || this;
    }
    ForkGrid.prototype.showEffect = function (isShow) {
        _super.prototype.showEffect.call(this, isShow);
        if (isShow) {
            if (!this.forkUI)
                this.forkUI = Com.createBitmapByName(BingoMachine.getAssetStr(CardGridUISettings.usefork));
            Com.addObjectAt(this, this.forkUI, CardGridColorAndSizeSettings.gridSize.x - this.forkUI.width >> 1, CardGridColorAndSizeSettings.gridSize.y - this.forkUI.height >> 1);
        }
        else {
            this.removeFork();
        }
    };
    ForkGrid.prototype.removeFork = function () {
        if (this.forkUI && this.contains(this.forkUI))
            this.removeChild(this.forkUI);
    };
    return ForkGrid;
}(TowerGrid));
__reflect(ForkGrid.prototype, "ForkGrid");
var BingoGameMain = (function (_super) {
    __extends(BingoGameMain, _super);
    function BingoGameMain() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    /**
    * need override
    */
    BingoGameMain.prototype.onAddToStage = function (event) { };
    /**
     * need override
     */
    BingoGameMain.prototype.runGame = function () { };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    BingoGameMain.prototype.createGameScene = function () {
        this.buildGame();
        this.addGameLoaderAndEvents();
        IBingoServer.serverInit();
    };
    /**
     * need override
     */
    BingoGameMain.prototype.buildGame = function () { };
    BingoGameMain.prototype.addGameLoaderAndEvents = function () {
        var loadingView = new LoadingUI();
        this.currentGame.preLoader = loadingView;
        this.currentGame.addEventListener(BingoMachine.GENERIC_MODAL_LOADED, this.addGame, this);
        this.currentGame.addEventListener("showGameSettings", this.showGameSettings, this);
        this.currentGame.addEventListener("missionPopup", this.showMission, this);
    };
    BingoGameMain.prototype.addGame = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        var isMobile = stageW < stageH;
        try {
            isMobile = eval("isMobile()");
        }
        catch (e) { }
        this.isMobile = isMobile;
        if (isMobile) {
            this.x = stageW;
            this.rotation = 90;
        }
        this.addChild(this.currentGame);
        document.addEventListener("keydown", this.keyDown.bind(this));
        var loadingBar = document.getElementById("loading_bar");
        if (loadingBar)
            loadingBar.parentNode.removeChild(loadingBar);
    };
    /**
     * key down
     */
    BingoGameMain.prototype.keyDown = function (event) {
        if (this.currentGame) {
            if (event.keyCode === 32) {
                event.preventDefault();
                this.currentGame.quickPlay();
            }
            else if (event.keyCode === 67) {
                event.preventDefault();
                this.currentGame.collectCredit();
            }
        }
    };
    BingoGameMain.prototype.showGameSettings = function (event) {
        this.showShadow();
        this.currentPo = new GameSettingPopup;
        if (this.currentPo.inited)
            this.addPhonePo();
        else
            this.currentPo.addEventListener(GenericModal.GENERIC_MODAL_LOADED, this.addPhonePo, this);
    };
    BingoGameMain.prototype.showMission = function (event) {
        this.showShadow();
        this.currentPo = new MissionPopup;
        if (this.currentPo.inited)
            this.addPhonePo();
        else
            this.currentPo.addEventListener(GenericModal.GENERIC_MODAL_LOADED, this.addPhonePo, this);
    };
    BingoGameMain.prototype.showShadow = function () {
        if (!this.shadow) {
            this.shadow = new egret.Shape;
            GraphicTool.drawRect(this.shadow, new egret.Rectangle(0, 0, BingoBackGroundSetting.gameSize.x, BingoBackGroundSetting.gameSize.y), 0, false, 0.5);
            this.shadow.touchEnabled = true;
        }
        this.addChild(this.shadow);
        if (!this.modalPreloader) {
            this.modalPreloader = Com.addBitmapAt(this, "modalGeneric_json.loader", BingoBackGroundSetting.gameSize.x >> 1, BingoBackGroundSetting.gameSize.y >> 1);
            this.modalPreloader.anchorOffsetX = this.modalPreloader.width >> 1;
            this.modalPreloader.anchorOffsetY = this.modalPreloader.height >> 1;
        }
        this.addChild(this.modalPreloader);
        this.modalPreloader.addEventListener(egret.Event.ENTER_FRAME, this.onLoadingAnimation, this, false);
    };
    BingoGameMain.prototype.onLoadingAnimation = function (event) {
        event.currentTarget.rotation += 5;
    };
    BingoGameMain.prototype.addPo = function (event) {
        if (event === void 0) { event = null; }
        this.addPoFromTo(0.2, 1);
    };
    BingoGameMain.prototype.addPhonePo = function (event) {
        if (event === void 0) { event = null; }
        this.addPoFromTo(0.1, 0.48);
    };
    BingoGameMain.prototype.addPoFromTo = function (fromScale, toScale) {
        this.currentPo.x = BingoBackGroundSetting.gameSize.x >> 1;
        this.currentPo.y = BingoBackGroundSetting.gameSize.y >> 1;
        this.currentPo.scaleX = fromScale;
        this.currentPo.scaleY = fromScale;
        this.currentPo.addEventListener(GenericModal.CLOSE_MODAL, this.closeCurrentPo, this);
        this.addChild(this.currentPo);
        var tw = egret.Tween.get(this.currentPo);
        tw.to({ "scaleX": toScale, "scaleY": toScale }, 300);
        this.modalPreloader.removeEventListener(egret.Event.ENTER_FRAME, this.onLoadingAnimation, this, false);
        this.removeChild(this.modalPreloader);
    };
    BingoGameMain.prototype.closeCurrentPo = function () {
        if (!this.currentPo)
            return;
        var tw = egret.Tween.get(this.currentPo);
        tw.to({ "scaleX": 0.1, "scaleY": 0.1 }, 300);
        tw.call(function () {
            this.removeChild(this.currentPo);
            this.removeChild(this.shadow);
        }, this);
        tw.wait(100);
        tw.call(function () {
            this.currentPo = null;
            // this.showFirstWaitingModal();
        }, this);
    };
    return BingoGameMain;
}(egret.DisplayObjectContainer));
__reflect(BingoGameMain.prototype, "BingoGameMain");
var BrowserInfo = (function () {
    function BrowserInfo() {
    }
    BrowserInfo.getBrowserInfo = function () {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
        var m = ua.match(re);
        try {
            Sys["browser"] = m[1].replace(/version/, "'safari");
            Sys["ver"] = m[2];
        }
        catch (e) {
            trace("no browser info");
        }
        return Sys;
    };
    Object.defineProperty(BrowserInfo, "textUp", {
        get: function () {
            if (!this.textNeedUpHasTested) {
                var bs = this.getBrowserInfo();
                this.textNeedUpInThisBrowser = 0;
                if (bs["browser"] == "chrome") {
                    var versionNumbers = bs["ver"].split(".");
                    if (versionNumbers[0] && parseInt(versionNumbers[0]) >= 71) {
                        if (versionNumbers[2] && parseInt(versionNumbers[2]) >= 3550) {
                            this.textNeedUpInThisBrowser = 2;
                        }
                    }
                }
                this.textNeedUpHasTested = true;
            }
            return this.textNeedUpInThisBrowser;
        },
        enumerable: true,
        configurable: true
    });
    return BrowserInfo;
}());
__reflect(BrowserInfo.prototype, "BrowserInfo");
var CardGridColorAndSizeSettings = (function () {
    function CardGridColorAndSizeSettings() {
    }
    CardGridColorAndSizeSettings.colorSetting = function (colors) {
        this.numberColor = colors["numberColor"];
        this.numberColorOnEffect = colors["numberColorOnEffect"];
        this.colorNumberOnEffect = colors["colorNumberOnEffect"];
    };
    CardGridColorAndSizeSettings.sizeSetting = function (size) {
        this.gridSize = new egret.Point(size["numberSizeX"], size["numberSizeY"]);
        this.gridSpace = new egret.Point(this.gridSize.x + size["vertGap"], this.gridSize.y + size["horzGap"]);
    };
    return CardGridColorAndSizeSettings;
}());
__reflect(CardGridColorAndSizeSettings.prototype, "CardGridColorAndSizeSettings");
var CardGridUISettings = (function () {
    function CardGridUISettings() {
    }
    CardGridUISettings.getSettingStrings = function (data) {
        this.blink1PicName = data["blink1"];
        this.blink2PicName = data["blink2"];
        this.defaultBgPicName = data["defaultBg"];
        this.onEffBgPicName = data["onEffBg"];
        this.linePicName = data["line"];
        this.usefork = data["usefork"];
    };
    CardGridUISettings.initGridAssets = function () {
        this.defaultBgPicTexture = Com.createBitmapByName(BingoMachine.getAssetStr(this.defaultBgPicName));
        this.onEffBgPicTexture = Com.createBitmapByName(BingoMachine.getAssetStr(this.onEffBgPicName));
        this.blink1PicTexture = Com.createBitmapByName(BingoMachine.getAssetStr(this.blink1PicName));
        this.blink2PicTexture = Com.createBitmapByName(BingoMachine.getAssetStr(this.blink2PicName));
        this.linePicTexture = Com.createBitmapByName(BingoMachine.getAssetStr(this.linePicName));
    };
    return CardGridUISettings;
}());
__reflect(CardGridUISettings.prototype, "CardGridUISettings");
var GameCardUISettings = (function () {
    function GameCardUISettings() {
    }
    GameCardUISettings.dataSetting = function (data) {
        this.titleColors = data["titleColors"];
        this.bgString = data["cardBg"];
        this.cardPositions = [];
        for (var i = 0; i < data["cardPositions"].length; i++) {
            var ob = data["cardPositions"];
            this.cardPositions[i] = new egret.Point(ob[i]["x"], ob[i]["y"]);
        }
    };
    GameCardUISettings.colorSetting = function (colors) {
        this.texColor = colors["textColor"];
    };
    GameCardUISettings.sizeSetting = function (size) {
        this.gridNumbers = new egret.Point(size["vertSize"], size["horzSize"]);
        this.gridInitPosition = new egret.Point(size["numberInitialPositionX"], size["numberInitialPositionY"]);
        var cardTextRect = new egret.Rectangle(size["cardTextPositionX"], size["cardTextPositionY"], size["cardTextSizeX"], size["cardTextSizeY"]);
        if (cardTextRect.width > 1)
            this.cardTextRect = cardTextRect;
        var betTextRect = new egret.Rectangle(size["betTextPositionX"], size["betTextPositionY"], size["betTextSizeX"], size["betTextSizeY"]);
        if (betTextRect.width > 1)
            this.betTextRect = betTextRect;
    };
    Object.defineProperty(GameCardUISettings, "cardTitleColor", {
        get: function () {
            return this.titleColors[this.currentBgColorIndex];
        },
        enumerable: true,
        configurable: true
    });
    GameCardUISettings.changeBgColor = function () {
        this.currentBgColorIndex++;
        if (this.currentBgColorIndex >= this.titleColors.length)
            this.currentBgColorIndex = 0;
    };
    GameCardUISettings.getIndexOnCard = function (index) {
        var gridPerCard = this.gridNumbers.x * this.gridNumbers.y;
        var cardIndex = Math.floor(index / gridPerCard);
        var gridIndex = index % gridPerCard;
        var pt = new egret.Point(cardIndex, gridIndex);
        return pt;
    };
    GameCardUISettings.positionOnCard = function (cardIndex, gridIndex) {
        var pt = new egret.Point;
        pt.x = this.cardPositions[cardIndex]["x"] + this.gridInitPosition.x + (gridIndex % this.gridNumbers.x) * CardGridColorAndSizeSettings.gridSpace.x;
        pt.y = this.cardPositions[cardIndex]["y"] + this.gridInitPosition.y + Math.floor(gridIndex / this.gridNumbers.x) * CardGridColorAndSizeSettings.gridSpace.y;
        return pt;
    };
    GameCardUISettings.setTargetToPositionOnCard = function (target, cardIndex, gridIndex) {
        var pt = this.positionOnCard(cardIndex, gridIndex);
        target.x = pt.x;
        target.y = pt.y;
    };
    GameCardUISettings.numberAtCard = function (cardIndex, gridIndex) {
        return CardManager.cards[cardIndex].getNumberAt(gridIndex);
    };
    GameCardUISettings.currentBgColorIndex = 0;
    GameCardUISettings.gridOnTop = true;
    return GameCardUISettings;
}());
__reflect(GameCardUISettings.prototype, "GameCardUISettings");
var GameSettingItem = (function (_super) {
    __extends(GameSettingItem, _super);
    function GameSettingItem(icon, text, entity, offsetY) {
        var _this = _super.call(this) || this;
        var bg = Com.addBitmapAt(_this, "gameSettings_json.tab_bg", 0, 0);
        bg.width = 1040;
        bg.height = 140;
        Com.addBitmapAtMiddle(_this, "gameSettings_json." + icon, 90, 70 + offsetY);
        var tx = MDS.addGameText(_this, 180, 35, 54, 0xFFFFFF, text, true, 600, "", 1);
        tx.height = 75;
        GameSettingItem.settingTextFormat(tx);
        _this.addChild(entity);
        _this.cacheAsBitmap = true;
        return _this;
    }
    GameSettingItem.settingTextFormat = function (tx) {
        tx.fontFamily = "Righteous";
        tx.stroke = 2;
        tx.strokeColor = 0x03034B;
        tx.filters = [new egret.DropShadowFilter(5, 45, 0, 0.5, 4, 4, 2, 1)];
    };
    return GameSettingItem;
}(egret.DisplayObjectContainer));
__reflect(GameSettingItem.prototype, "GameSettingItem");
var GameSettingPopup = (function (_super) {
    __extends(GameSettingPopup, _super);
    function GameSettingPopup() {
        return _super.call(this) || this;
    }
    Object.defineProperty(GameSettingPopup, "classAssetName", {
        get: function () {
            return "gameSettings";
        },
        enumerable: true,
        configurable: true
    });
    GameSettingPopup.prototype.init = function () {
        this.bgAssetName = "gameSettings_json.bg";
        this.closeButtonAssetName = "gameSettings_json.X_btn";
        _super.prototype.init.call(this);
        this.bg.width = 1240;
        this.bg.height = 990;
        this.anchorOffsetX = this.bg.width >> 1;
        this.anchorOffsetY = this.bg.height >> 1;
        this.closeButton.x = this.bg.width;
        this.addScrollArea(new egret.Rectangle(62, 41, 1040, 910));
        this.addItems();
        this.addTitleAndVertion();
        this.addLanguageBar();
        this.scrollSlider = new SettingSlider;
        Com.addObjectAt(this, this.scrollSlider, 1150, 70);
        this.scrollSlider.addEventListener("startDrag", this.onStartDrag, this);
        this.scrollSlider.addEventListener("stopDrag", this.onStopDrag, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
    };
    GameSettingPopup.prototype.onRemove = function (event) {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
    };
    GameSettingPopup.prototype.addScrollArea = function (maskRect) {
        this.scrollArea = new egret.ScrollView;
        this.scrollArea.width = maskRect.width;
        this.scrollArea.height = maskRect.height;
        Com.addObjectAt(this, this.scrollArea, maskRect.x, maskRect.y);
        this.scrollBar = new egret.DisplayObjectContainer;
        this.scrollArea.setContent(this.scrollBar);
    };
    GameSettingPopup.prototype.addItem = function (index, icon, text, entity, offsetY) {
        if (offsetY === void 0) { offsetY = 0; }
        var settingsItem = new GameSettingItem(icon, text, entity, offsetY);
        settingsItem.y = index * 150;
        this.scrollBar.addChild(settingsItem);
    };
    GameSettingPopup.prototype.addButtonText = function (button, buttonText) {
        if (buttonText === void 0) { buttonText = null; }
        var tx = Com.addLabelAt(button, 10, 0, button.width - 20, button.height, 48);
        GameSettingItem.settingTextFormat(tx);
        if (buttonText)
            tx.setText(MuLang.getText(buttonText, MuLang.CASE_UPPER));
    };
    GameSettingPopup.prototype.addLoginButtonText = function (button, buttonText) {
        if (buttonText === void 0) { buttonText = null; }
        var tx = Com.addLabelAt(button, 90, 0, button.width - 100, button.height, 48);
        GameSettingItem.settingTextFormat(tx);
        tx.textAlign = "left";
        if (buttonText)
            tx.setText(MuLang.getText(buttonText, MuLang.CASE_UPPER));
    };
    GameSettingPopup.prototype.addItems = function () {
        var button0 = Com.addDownButtonAt(this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.logout, true);
        this.addButtonText(button0, "logout");
        var playType = this.getPlayerType();
        this.addItem(0, "avatar", MuLang.getText(playType, MuLang.CASE_UPPER) + ":   " + PlayerConfig.player(playType == "user_id" ? "user.id" : playType), button0);
        var button1 = Com.addDownButtonAt(this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.showLangugeBar, true);
        Com.addBitmapAtMiddle(button1, "gameSettings_json.flag_" + MuLang.language, button1.width >> 1, button1.height >> 1);
        Com.addBitmapAtMiddle(button1, "gameSettings_json.btn_arrow", button1.width - 45, button1.height >> 1);
        this.addItem(1, "language_icon", "language", button1, 5);
        var bt2Container = new egret.DisplayObjectContainer;
        var button2_1 = Com.addDownButtonAt(bt2Container, "gameSettings_json.gl_bt_settings", "gameSettings_json.gl_bt_settings", 380, 18, this.gotoLoginPage, true);
        var button2_2 = Com.addDownButtonAt(bt2Container, "gameSettings_json.fb_bt_settings", "gameSettings_json.fb_bt_settings", 700, 18, this.gotoLoginPage, true);
        this.addLoginButtonText(button2_1, "login");
        this.addLoginButtonText(button2_2, "login");
        this.addItem(2, "icon_connect", "link", bt2Container);
        var button3 = Com.addDownButtonAt(this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.suport, true);
        this.addButtonText(button3, "contact");
        this.addItem(3, "support_icon", "support", button3, 5);
        var button4 = Com.addDownButtonAt(this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.suport, true);
        this.addButtonText(button4, "rate_us");
        this.addItem(4, "rate_icon", "rate_us", button4, 5);
        this.soundEffectBtn = new SettingsCheckbox(this.soundEffectChange.bind(this));
        this.soundEffectBtn.RadioOn = SoundManager.soundEfOn;
        this.addItem(5, "sound_fx_icon", "sound_effect_on", this.soundEffectBtn, 5);
        this.musicBtn = new SettingsCheckbox(this.musicChange.bind(this));
        this.musicBtn.RadioOn = SoundManager.soundOn;
        this.addItem(6, "music_icon", "music_on", this.musicBtn, 5);
        this.visualEffectBtn = new SettingsCheckbox(this.visualEffectChange.bind(this));
        this.visualEffectBtn.RadioOn = GameSettings.visualEffectOn;
        this.addItem(7, "visual_fx_icon", "effect_on", this.visualEffectBtn, 5);
        this.notificationBtn = new SettingsCheckbox(this.notificationChange.bind(this));
        this.notificationBtn.RadioOn = GameSettings.notificationOn;
        this.addItem(8, "icon_notification", MuLang.getText("notification"), this.notificationBtn, 5);
    };
    GameSettingPopup.prototype.getPlayerType = function () {
        var typeStr;
        if (PlayerConfig.player("facebook_id"))
            return "facebook_id";
        else if (PlayerConfig.player("custom_id"))
            return "custom_id";
        else if (PlayerConfig.player("google_id"))
            return "google_id";
        else if (PlayerConfig.player("guest_id"))
            return "guest_id";
        else
            return "user_id";
    };
    GameSettingPopup.prototype.addTitleAndVertion = function () {
        var tx = Com.addLabelAt(this, 0, -40, this.bg.width, 65, 50);
        GameSettingItem.settingTextFormat(tx);
        tx.setText(MuLang.getText("settings", MuLang.CASE_UPPER));
        var txVersion = MDS.addGameText(this, 100, 975, 40, 0xFFFFFF, "", true, 525, "", 1);
        txVersion.height = 50;
        GameSettingItem.settingTextFormat(txVersion);
        txVersion.setText(MuLang.getText("settings", MuLang.CASE_UPPER) + ":     " + GameSettings.vertion);
        var txId = MDS.addGameText(this, 720, 975, 40, 0xFFFFFF, "", true, 650, "", 1);
        txId.height = 50;
        GameSettingItem.settingTextFormat(txId);
        txId.setText(MuLang.getText("user_id", MuLang.CASE_UPPER) + ":     " + PlayerConfig.player("user.id"));
    };
    GameSettingPopup.prototype.addLanguageBar = function () {
        this.languageBar = new LanguageBar;
        this.languageBar.visible = false;
        Com.addObjectAt(this.scrollBar, this.languageBar, 708, 280);
    };
    GameSettingPopup.prototype.logout = function () {
        alert("can not logout now");
    };
    GameSettingPopup.prototype.showLangugeBar = function () {
        this.languageBar.visible = !this.languageBar.visible;
    };
    GameSettingPopup.prototype.gotoLoginPage = function () {
        window.location.href = "/";
    };
    GameSettingPopup.prototype.suport = function () {
        window.location.href = "/contact.php";
    };
    GameSettingPopup.prototype.soundEffectChange = function () {
        this.soundEffectBtn.RadioOn = SoundManager.soundEfOn = !SoundManager.soundEfOn;
    };
    GameSettingPopup.prototype.musicChange = function () {
        this.musicBtn.RadioOn = SoundManager.soundOn = !SoundManager.soundOn;
    };
    GameSettingPopup.prototype.visualEffectChange = function () {
        this.visualEffectBtn.RadioOn = GameSettings.visualEffectOn = !GameSettings.visualEffectOn;
    };
    GameSettingPopup.prototype.notificationChange = function () {
        this.notificationBtn.RadioOn = GameSettings.notificationOn = !GameSettings.notificationOn;
    };
    GameSettingPopup.prototype.onFrame = function (event) {
        if (this.sliderDraging)
            this.scrollArea.scrollTop = this.scrollSlider.scrollTop * this.scrollArea.getMaxScrollTop();
        else
            this.scrollSlider.setSliderPosition(this.scrollArea.getMaxScrollTop(), this.scrollArea.scrollTop);
    };
    GameSettingPopup.prototype.onStartDrag = function (event) {
        this.sliderDraging = true;
    };
    GameSettingPopup.prototype.onStopDrag = function (event) {
        this.sliderDraging = false;
    };
    return GameSettingPopup;
}(GenericPo));
__reflect(GameSettingPopup.prototype, "GameSettingPopup");
var GameSettings = (function () {
    function GameSettings() {
    }
    Object.defineProperty(GameSettings, "visualEffectOn", {
        get: function () {
            if (egret.localStorage.getItem("visualEffect") == "false")
                return false;
            return true;
        },
        set: function (value) {
            if (this.visualEffectOn == value)
                return;
            egret.localStorage.setItem("visualEffect", value ? "" : "false");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameSettings, "notificationOn", {
        get: function () {
            if (egret.localStorage.getItem("notification") == "false")
                return false;
            return true;
        },
        set: function (value) {
            if (this.notificationOn == value)
                return;
            egret.localStorage.setItem("notification", value ? "" : "false");
        },
        enumerable: true,
        configurable: true
    });
    GameSettings.vertion = "2.6.2";
    return GameSettings;
}());
__reflect(GameSettings.prototype, "GameSettings");
var trace = function (a) {
    egret.log(a);
};
var LanguageBar = (function (_super) {
    __extends(LanguageBar, _super);
    function LanguageBar() {
        var _this = _super.call(this) || this;
        GraphicTool.drawRect(_this, new egret.Rectangle(0, 0, 308, 268), 0x968503, false, 1, 50, 2, 0xfffd75);
        _this.touchEnabled = true;
        _this.touchChildren = false;
        _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouch, _this);
        _this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, _this.onTouch, _this);
        _this.addEventListener(egret.TouchEvent.TOUCH_END, _this.onTouch, _this);
        _this.addEventListener(egret.TouchEvent.TOUCH_MOVE, _this.onTouch, _this);
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTap, _this);
        _this.rects = [];
        _this.languageArr = ["pt", "en", "es"];
        for (var i = 0; i < 3; i++) {
            _this.rects[i] = new egret.Rectangle(10, 8 + i * 90, 285, 70);
            GraphicTool.drawRect(_this, _this.rects[i], 0x968503, false, 1, 20, 2, 0xfffd75);
            Com.addBitmapAtMiddle(_this, "gameSettings_json.flag_" + _this.languageArr[i], _this.rects[i].width * 0.5 + _this.rects[i].x, _this.rects[i].height * 0.5 + _this.rects[i].y);
        }
        return _this;
    }
    LanguageBar.prototype.onTouch = function (event) {
        event.stopImmediatePropagation();
    };
    LanguageBar.prototype.onTap = function (event) {
        var testPt = new egret.Point(event.localX, event.localY);
        for (var i = 0; i < 3; i++) {
            if (this.rects[i].containsPoint(testPt)) {
                this.visible = false;
                if (MuLang.language != this.languageArr[i]) {
                    MuLang.language = this.languageArr[i];
                    window.location.reload();
                }
                break;
            }
        }
    };
    return LanguageBar;
}(egret.Sprite));
__reflect(LanguageBar.prototype, "LanguageBar");
var SettingsCheckbox = (function (_super) {
    __extends(SettingsCheckbox, _super);
    function SettingsCheckbox(callback) {
        var _this = _super.call(this) || this;
        _this.bg = Com.addBitmapAt(_this, "gameSettings_json.bg_slider_on", 0, 0);
        _this.bar = Com.addBitmapAt(_this, "gameSettings_json.slider_switch", 77, 2);
        _this.touchChildren = false;
        _this.touchEnabled = true;
        _this.x = 855;
        _this.y = 32;
        _this.callback = callback;
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTap, _this);
        return _this;
    }
    Object.defineProperty(SettingsCheckbox.prototype, "RadioOn", {
        get: function () {
            return this._radioOn;
        },
        set: function (value) {
            this._radioOn = value;
            if (value) {
                this.bg.texture = RES.getRes("gameSettings_json.bg_slider_on");
                this.bar.x = 77;
            }
            else {
                this.bg.texture = RES.getRes("gameSettings_json.bg_slider_off");
                this.bar.x = 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    SettingsCheckbox.prototype.onTap = function (e) {
        this.callback();
    };
    return SettingsCheckbox;
}(egret.DisplayObjectContainer));
__reflect(SettingsCheckbox.prototype, "SettingsCheckbox");
var SettingSlider = (function (_super) {
    __extends(SettingSlider, _super);
    function SettingSlider() {
        var _this = _super.call(this) || this;
        _this.sliderRange = 850;
        var bg = Com.addBitmapAt(_this, "gameSettings_json.scroll_bar", 0, 0);
        bg.height = _this.sliderRange;
        _this.slider = Com.addBitmapAtMiddle(_this, "gameSettings_json.scroll_bar_handle", 10, 0);
        _this.slider.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onSliderStartDrag, _this);
        _this.slider.touchEnabled = true;
        return _this;
    }
    SettingSlider.prototype.setSliderPosition = function (topMax, scrollTop) {
        if (scrollTop < 0)
            scrollTop = 0;
        if (scrollTop > topMax)
            scrollTop = topMax;
        this.slider.y = scrollTop / topMax * this.sliderRange;
    };
    SettingSlider.prototype.onSliderStartDrag = function (event) {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onSliderStopDrag, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onSliderStopDrag, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
        this.dispatchEvent(new egret.Event("startDrag"));
        this.dragStarStageY = event.stageY;
        this.dragStarSliderY = this.slider.y;
        this.dragSliderPosition(event.stageY);
    };
    SettingSlider.prototype.onSliderStopDrag = function (event) {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onSliderStopDrag, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onSliderStopDrag, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
        this.dispatchEvent(new egret.Event("stopDrag"));
    };
    SettingSlider.prototype.dragSliderPosition = function (y) {
        y -= this.dragStarStageY;
        y /= this.parent.scaleY;
        y += this.dragStarSliderY;
        var p = y;
        if (p < 0)
            p = 0;
        if (p > this.sliderRange)
            p = this.sliderRange;
        this.slider.y = p;
    };
    Object.defineProperty(SettingSlider.prototype, "scrollTop", {
        get: function () {
            return this.slider.y / this.sliderRange;
        },
        enumerable: true,
        configurable: true
    });
    SettingSlider.prototype.onMove = function (event) {
        this.dragSliderPosition(event.stageY);
    };
    return SettingSlider;
}(egret.DisplayObjectContainer));
__reflect(SettingSlider.prototype, "SettingSlider");
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        return _super.call(this) || this;
    }
    LoadingUI.prototype.onProgress = function (current, total) {
        document.getElementById("loading_progress_div").style.width = Math.floor(320 * (0.18 + current / total * 0.72 + 0)) + "px";
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
var Coin = (function (_super) {
    __extends(Coin, _super);
    function Coin() {
        var _this = _super.call(this, Coin.mcf.generateMovieClipData("flyingCoins")) || this;
        _this.anchorOffsetX = _this.width >> 1;
        _this.anchorOffsetY = _this.height >> 1;
        return _this;
    }
    Object.defineProperty(Coin, "mcf", {
        get: function () {
            if (!this._mcf) {
                var coinsData = RES.getRes("flyingCoins_json");
                var coinsTex = RES.getRes("flyingCoins_png");
                this._mcf = new egret.MovieClipDataFactory(coinsData, coinsTex);
            }
            return this._mcf;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Coin.prototype, "factor", {
        get: function () {
            return 0;
        },
        set: function (value) {
            var bar = 1 - value;
            var barSq = bar * bar;
            var valueSq = value * value;
            var valueTimesBar2 = 2 * value * bar;
            this.x = barSq * this.startPosition.x + valueTimesBar2 * this.middlePosition.x + valueSq * this.endPosition.x;
            this.y = barSq * this.startPosition.y + valueTimesBar2 * this.middlePosition.y + valueSq * this.endPosition.y;
            this.scaleX = this.scaleY = barSq * this.startScale + valueTimesBar2 * this.middleScale + valueSq * this.endScale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Coin.prototype, "vY", {
        get: function () {
            return this._vy;
        },
        set: function (value) {
            this._vy = value;
            this.y += value;
        },
        enumerable: true,
        configurable: true
    });
    return Coin;
}(egret.MovieClip));
__reflect(Coin.prototype, "Coin");
var DataServer = (function () {
    function DataServer() {
    }
    DataServer.prototype.getDataFromUrl = function (url, successCallback, thisObject, postMethod, dataObejct, failedCallbBack) {
        if (postMethod === void 0) { postMethod = true; }
        if (failedCallbBack === void 0) { failedCallbBack = null; }
        var ld = new egret.URLLoader;
        this.callback = successCallback;
        this.thisObject = thisObject;
        this.failedCallback = failedCallbBack;
        ld.addEventListener(egret.Event.COMPLETE, this.loadComplete, this);
        ld.addEventListener(egret.IOErrorEvent.IO_ERROR, this.loadFaild, this);
        ld.dataFormat = egret.URLLoaderDataFormat.TEXT;
        // add properties
        url = url.concat((url.indexOf("?") >= 0 ? "&" : "?").concat(PlayerConfig.properties));
        var urlRequest = new egret.URLRequest(url);
        urlRequest.method = postMethod ? egret.URLRequestMethod.POST : egret.URLRequestMethod.GET;
        var variable = new egret.URLVariables();
        variable.variables = dataObejct;
        urlRequest.data = variable;
        ld.load(urlRequest);
    };
    DataServer.prototype.loadComplete = function (event) {
        this.callback.call(this.thisObject, event.target.data);
    };
    DataServer.prototype.loadFaild = function (event) {
        if (this.failedCallback)
            this.failedCallback.call(this.thisObject, event.type);
    };
    return DataServer;
}());
__reflect(DataServer.prototype, "DataServer");
var Dinero = (function (_super) {
    __extends(Dinero, _super);
    function Dinero() {
        var _this = _super.call(this, Dinero.mcf.generateMovieClipData("flyingDinero1")) || this;
        _this.anchorOffsetX = _this.width >> 1;
        _this.anchorOffsetY = _this.height >> 1;
        return _this;
    }
    Object.defineProperty(Dinero, "mcf", {
        get: function () {
            if (!this._mcf) {
                var coinsData = RES.getRes("flyingCoins_json");
                var coinsTex = RES.getRes("flyingCoins_png");
                this._mcf = new egret.MovieClipDataFactory(coinsData, coinsTex);
            }
            return this._mcf;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dinero.prototype, "factor", {
        get: function () {
            return 0;
        },
        set: function (value) {
            var bar = 1 - value;
            var barSq = bar * bar;
            var valueSq = value * value;
            var valueTimesBar2 = 2 * value * bar;
            this.x = barSq * this.startPosition.x + valueTimesBar2 * this.middlePosition.x + valueSq * this.endPosition.x;
            this.y = barSq * this.startPosition.y + valueTimesBar2 * this.middlePosition.y + valueSq * this.endPosition.y;
            this.scaleX = this.scaleY = barSq * this.startScale + valueTimesBar2 * this.middleScale + valueSq * this.endScale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dinero.prototype, "vY", {
        get: function () {
            return this._vy;
        },
        set: function (value) {
            this._vy = value;
            this.y += value;
        },
        enumerable: true,
        configurable: true
    });
    return Dinero;
}(egret.MovieClip));
__reflect(Dinero.prototype, "Dinero");
var DropCoins = (function (_super) {
    __extends(DropCoins, _super);
    function DropCoins(coinsLevel) {
        var _this = _super.call(this, RES.getRes("getCoinsParticle_png"), RES.getRes("getCoinsParticle_json")) || this;
        _this.start((coinsLevel + 1) * 400);
        TweenerTool.tweenTo(_this, { rotation: 0 }, 500, 1500, MDS.removeSelf.bind(_this, _this));
        return _this;
    }
    return DropCoins;
}(particle.GravityParticleSystem));
__reflect(DropCoins.prototype, "DropCoins");
var FacebookBitmap = (function () {
    function FacebookBitmap() {
    }
    FacebookBitmap.downloadBitmapDataByFacebookID = function (facebookId, width, height, callback, thisObject) {
        this.downloadBitmapDataByURL("https://graph.facebook.com/" + facebookId + "/picture?width=" + width + "&height=" + height, callback, thisObject);
    };
    FacebookBitmap.downloadBitmapDataByURL = function (url, callback, thisObject) {
        var imgLoader = new egret.ImageLoader;
        imgLoader.once(egret.Event.COMPLETE, callback, thisObject);
        imgLoader.crossOrigin = "anonymous";
        imgLoader.load(url);
    };
    return FacebookBitmap;
}());
__reflect(FacebookBitmap.prototype, "FacebookBitmap");
var FlyingCoins = (function (_super) {
    __extends(FlyingCoins, _super);
    function FlyingCoins() {
        var _this = _super.call(this) || this;
        _this.coinsMcs = [];
        _this.dineroMcs = [];
        return _this;
    }
    FlyingCoins.prototype.fly = function (coinsCount, startPosition, endPosition, middlePosition, startScale, endScale, middleScale) {
        while (this.coinsMcs.length < coinsCount)
            this.coinsMcs.push(new Coin());
        this.coinsFly = this.coinsMcs.concat();
        this.savePositions(startPosition, endPosition, middlePosition, startScale, endScale, middleScale);
        this.gapDuration = 30;
        this.startFly();
        SoundManager.play("collect_coins_mp3");
    };
    FlyingCoins.prototype.flyDenero = function (coinsCount, startPosition, endPosition, middlePosition, startScale, endScale, middleScale) {
        while (this.dineroMcs.length < coinsCount)
            this.dineroMcs.push(new Dinero());
        this.coinsFly = this.dineroMcs.concat();
        this.savePositions(startPosition, endPosition, middlePosition, startScale, endScale, middleScale);
        this.gapDuration = 80;
        this.startFly();
        SoundManager.play("collect_coins_mp3");
    };
    FlyingCoins.prototype.savePositions = function (startPosition, endPosition, middlePosition, startScale, endScale, middleScale) {
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.middlePosition = middlePosition;
        this.startScale = startScale;
        this.endScale = endScale;
        this.middleScale = middleScale;
    };
    FlyingCoins.prototype.startFly = function () {
        if (!this.coinsFly.length)
            return;
        var coin = this.coinsFly.shift();
        coin.startPosition = this.startPosition;
        coin.x = coin.startPosition.x;
        coin.y = coin.startPosition.y;
        coin.endPosition = this.endPosition;
        coin.middlePosition = this.middlePosition;
        coin.startScale = this.startScale;
        coin.scaleX = coin.scaleY = coin.startScale;
        coin.endScale = this.endScale;
        coin.middleScale = this.middleScale;
        coin.rotation = Math.random() * 360;
        coin.gotoAndPlay(Math.floor(Math.random() * coin.totalFrames));
        this.addChild(coin);
        coin.play(-1);
        var twX = egret.Tween.get(coin);
        twX.wait(this.gapDuration);
        twX.call(this.startFly, this);
        twX.to({ factor: 1 }, 800);
        twX.call(this.endFly, this, [coin]);
    };
    FlyingCoins.prototype.endFly = function (coin) {
        coin.parent.removeChild(coin);
        coin.stop();
        if (this.numChildren === 0) {
            if (this.parent)
                this.parent.removeChild(this);
        }
    };
    return FlyingCoins;
}(egret.DisplayObjectContainer));
__reflect(FlyingCoins.prototype, "FlyingCoins");
var PlayerConfig = (function () {
    function PlayerConfig() {
    }
    Object.defineProperty(PlayerConfig, "playerData", {
        get: function () {
            if (!this._playerData) {
                var playerStr = localStorage.getItem("player");
                if (playerStr) {
                    try {
                        this._playerData = JSON.parse(playerStr);
                    }
                    catch (e) {
                        this._playerData = null;
                    }
                }
            }
            return this._playerData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayerConfig, "configData", {
        get: function () {
            if (!this._configData) {
                var configStr = localStorage.getItem("config");
                if (configStr) {
                    try {
                        this._configData = JSON.parse(configStr);
                    }
                    catch (e) {
                        this._configData = null;
                    }
                }
            }
            return this._configData;
        },
        enumerable: true,
        configurable: true
    });
    PlayerConfig.player = function (key) {
        try {
            var item = eval("this.playerData." + key);
            return item;
        }
        catch (e) {
            var rs = this.playerConfig[key];
            if (key == "user.id" && !rs)
                rs = "243972732";
            return rs;
        }
    };
    PlayerConfig.config = function (key) {
        try {
            var item = eval("this.configData." + key);
            return item;
        }
        catch (e) {
            var rs = this.playerConfig[key];
            if (key == "http" && !rs)
                rs = "https";
            if (key == "host" && !rs)
                rs = "staging.doutorbingo.com";
            if (key == "platform" && !rs)
                rs = "com";
            return rs;
        }
    };
    Object.defineProperty(PlayerConfig, "properties", {
        get: function () {
            return localStorage.getItem("user_account_info");
        },
        enumerable: true,
        configurable: true
    });
    PlayerConfig.serverVertion = 2;
    PlayerConfig.playerConfig = { "user.id": requestStr("id"), "score.level": 2538, "score.this_level_xp": 2500, "score.next_level_xp": 3500, "score.xp": 3000,
        "mission": { "task_is_process": "0", "unlock_level": 10, "task": { "387285": { "is_active": "1", "type": "1", "current": "1", "target": "2", "id": "387285" }, "387286": { "is_active": "0", "type": "1", "current": "1", "target": "6", "id": "387286" }, "387287": { "is_active": "0", "type": "1", "current": "0", "target": "15", "id": "387287" } }, "score_info": { "score_is_process": "0" } }, "mission.unlock_level": 3000 };
    PlayerConfig.mission = {};
    return PlayerConfig;
}());
__reflect(PlayerConfig.prototype, "PlayerConfig");
function requestStr(str) {
    var resItems = location.search.split(/[?&]/);
    var items = Object;
    for (var i = 0; i < resItems.length; i++) {
        var item = resItems[i].split("=");
        if (item.length == 2)
            items[item[0]] = item[1];
    }
    return items[str];
}
var LocalDataManager = (function () {
    function LocalDataManager() {
    }
    LocalDataManager.updatePlayerData = function (key, value) {
        if (localStorage.getItem("player")) {
            var str = localStorage.getItem("player");
            var ob = JSON.parse(str);
            try {
                eval("ob." + key + " = value");
            }
            catch (e) {
                return;
            }
            localStorage.setItem("player", JSON.stringify(ob));
        }
    };
    LocalDataManager.updatePlayerDatas = function (items) {
        if (localStorage.getItem("player")) {
            var str = localStorage.getItem("player");
            var ob = JSON.parse(str);
            for (var i = 0; i < items.length; i++) {
                try {
                    eval("ob." + items[i].key + " = items[i].value");
                }
                catch (e) {
                    return;
                }
            }
            localStorage.setItem("player", JSON.stringify(ob));
        }
    };
    return LocalDataManager;
}());
__reflect(LocalDataManager.prototype, "LocalDataManager");
var JackpotLayer = (function (_super) {
    __extends(JackpotLayer, _super);
    function JackpotLayer(jackpotContainerPosition, jackpot, jackpotMinBet, betConfig, lockPosition, jackpotTextRect, jackpotTextSize, jackpotTextColor, tipRect, tipTextSize, tipTextColor, lockOnTop) {
        if (tipRect === void 0) { tipRect = null; }
        if (tipTextSize === void 0) { tipTextSize = 0; }
        if (tipTextColor === void 0) { tipTextColor = 0; }
        if (lockOnTop === void 0) { lockOnTop = false; }
        var _this = _super.call(this) || this;
        _this.betConfig = betConfig;
        _this.x = jackpotContainerPosition.x;
        _this.y = jackpotContainerPosition.y;
        _this.jackpotLock = Com.addBitmapAt(_this, BingoMachine.getAssetStr("jackpot_lock"), lockPosition.x, lockPosition.y);
        _this.jackpotLock.touchEnabled = true;
        if (tipRect) {
            _this.tip = Com.addLabelAt(_this, tipRect.x, tipRect.y, tipRect.width, tipRect.height, tipTextSize, false, true);
            _this.tip.textColor = tipTextColor;
            _this.tip.setText(MuLang.getText("jackpot"));
        }
        _this.jackpotText = Com.addLabelAt(_this, jackpotTextRect.x, jackpotTextRect.y, jackpotTextRect.width, jackpotTextRect.height, jackpotTextSize, false, true);
        _this.jackpotText.textColor = jackpotTextColor;
        _this.jackpotText.verticalAlign = "middle";
        _this.jackpotValue = _this.countJackpotByRate(Math.round(jackpot));
        _this.jackpotMinBet = jackpotMinBet;
        if (lockOnTop)
            _this.addChild(_this.jackpotLock);
        _this.tryJackpotMinBet();
        return _this;
    }
    JackpotLayer.prototype.createJackpotTooltipAt = function (x, y) {
        var typeRight = this.x + x > this.parent.width / 2;
        var type = typeRight ? "right" : "left";
        this.jackpotTooltip = new egret.DisplayObjectContainer();
        this.jackpotTooltip.width = 370;
        this.jackpotTooltip.height = 180;
        this.jackpotTooltip.anchorOffsetX = typeRight ? 310 : 64;
        this.jackpotTooltip.anchorOffsetY = 17;
        // background image
        Com.addBitmapAt(this.jackpotTooltip, ("jackpot_tooltip_json.tooltip_" + type), 0, 0);
        // tooltip text
        var tooltipText = Com.addTextAt(this.jackpotTooltip, 21, 42, 327, 120, 18, false, false);
        tooltipText.fontFamily = "Righteous";
        tooltipText.textColor = 0xFFFFFF;
        tooltipText.textAlign = "center";
        tooltipText.verticalAlign = "middle";
        var cardNumbers = CardManager.cards.length;
        tooltipText.text = MuLang.getText("jackpot_tooltip").replace("{1}", this.jackpotMinBet * cardNumbers + "").replace("{2}", cardNumbers + "");
        Com.addObjectAt(this, this.jackpotTooltip, x, y);
    };
    Object.defineProperty(JackpotLayer.prototype, "jackpotValue", {
        get: function () {
            return this.jackpotCurrentTextValue;
        },
        set: function (value) {
            this.jackpotCurrentTextValue = value;
            this.jackpotText.setText(Utils.formatCoinsNumber(Math.round(value)));
        },
        enumerable: true,
        configurable: true
    });
    JackpotLayer.prototype.countJackpotByRate = function (jackpot) {
        this.currentJackpotPool = jackpot;
        for (var i = 0; i < this.betConfig.length; i++) {
            if (GameData.currentBet == this.betConfig[i]["bet"]) {
                return jackpot * this.betConfig[i]["jackpotRate"];
            }
        }
    };
    JackpotLayer.prototype.changebet = function () {
        this.setJackpotNumber({ acumulado: this.currentJackpotPool }, true);
    };
    JackpotLayer.prototype.setJackpotNumber = function (data, isChangeBet) {
        if (isChangeBet === void 0) { isChangeBet = false; }
        egret.Tween.removeTweens(this);
        var jackPotValue = this.countJackpotByRate(data["acumulado"]);
        if (isChangeBet)
            this.jackpotValue = jackPotValue;
        else
            egret.Tween.get(this).to({ jackpotValue: jackPotValue }, 2000);
    };
    JackpotLayer.prototype.tryJackpotMinBet = function () {
        if (!this.jackpotMinBet || GameData.currentBet < this.jackpotMinBet || CardManager.enabledCards != CardManager.cards.length) {
            this.jackpotLock.visible = true;
        }
        else
            this.jackpotLock.visible = false;
    };
    Object.defineProperty(JackpotLayer.prototype, "textBold", {
        set: function (bold) {
            this.jackpotText.fontFamily = bold ? "Arial Black" : "Arial";
        },
        enumerable: true,
        configurable: true
    });
    JackpotLayer.prototype.jackpotWinCallback = function (data) {
        if (data["id"] == Number(PlayerConfig.player("user.id"))) {
            this.jackpotBonus = true;
            this.jackpotNumber = data["jackpot"];
        }
    };
    return JackpotLayer;
}(egret.DisplayObjectContainer));
__reflect(JackpotLayer.prototype, "JackpotLayer");
var MissionBar = (function (_super) {
    __extends(MissionBar, _super);
    function MissionBar() {
        var _this = _super.call(this) || this;
        _this.missionBg = Com.addBitmapAt(_this, "missionBar_json.btn_mission_bg", 0, 0);
        _this.missionBook = Com.addBitmapAt(_this, "missionBar_json.mission_icon", 18, 4);
        var lockType = MissionDataManager.checkMissionLocked();
        if (lockType >= 0) {
            _this.missLock = new MissLockUI(lockType);
            _this.addChild(_this.missLock);
        }
        else {
            _this.showMissionProcess();
        }
        return _this;
    }
    MissionBar.prototype.showMissionProcess = function () {
        var currentBingoTask = MissionDataManager.getActiveMissionTask(MissionDataManager.MISSION_TYPE_BINGO);
        this.showTaskUI(currentBingoTask);
    };
    MissionBar.prototype.showTaskUI = function (currentBingoTask) {
        this.missionData = currentBingoTask;
        this.missionProcessUI = new MissionProcessUI;
        Com.addObjectAt(this, this.missionProcessUI, 0, 0);
        this.missionProcessUI.setProcess(currentBingoTask.current / currentBingoTask.target);
        this.addChild(this.missionBook);
    };
    MissionBar.prototype.updateMissionData = function (value, target, id) {
        if (id.toString() != this.missionData.mission_id) {
            egret.error("mission id error");
            return;
        }
        if (this.missionData.target != target) {
            egret.error("mission target error");
            return;
        }
        this.missionProcessUI.setProcess(value / target);
        this.missionData.current = value;
        LocalDataManager.updatePlayerData("mission.task." + id + ".current", value.toString());
    };
    return MissionBar;
}(egret.DisplayObjectContainer));
__reflect(MissionBar.prototype, "MissionBar");
var MissionDataManager = (function () {
    function MissionDataManager() {
    }
    /**
     * check mission locked
     */
    MissionDataManager.checkMissionLocked = function () {
        var mission = PlayerConfig.player("mission");
        if (mission["task_is_process"] === "1" || mission["score_info"]["score_is_process"] === "1")
            return 2;
        if (Number(PlayerConfig.player("score.level")) < Number(mission["unlock_level"]))
            return 1;
        for (var missionId in mission["task"]) {
            if (!isNaN(Number(missionId))) {
                return -1;
            }
        }
        return 0;
    };
    MissionDataManager.getMissionTasks = function (type) {
        var mission = PlayerConfig.player("mission");
        var task = mission["task"];
        var taskArr = [];
        for (var ob in task) {
            if (isNaN(Number(ob)))
                continue;
            if (task[ob].type == type) {
                taskArr.push(this.getMissionTaskData(task[ob]));
            }
        }
        return taskArr;
    };
    MissionDataManager.getMissionTaskData = function (taskObject) {
        var taskData = {};
        taskData.is_active = taskObject["is_active"];
        taskData.current = Number(taskObject["current"]);
        taskData.target = Number(taskObject["target"]);
        taskData.mission_id = taskObject["id"];
        return taskData;
    };
    MissionDataManager.getActiveMissionTask = function (type) {
        var mission = PlayerConfig.player("mission");
        var task = mission["task"];
        for (var ob in task) {
            if (isNaN(Number(ob)))
                continue;
            if (task[ob].type == type) {
                var taskData = this.getMissionTaskData(task[ob]);
                if (taskData.is_active == "1")
                    return taskData;
            }
        }
        return null;
    };
    MissionDataManager.MISSION_TYPE_BINGO = "1";
    MissionDataManager.MISSION_TYPE_SLOT = "2";
    return MissionDataManager;
}());
__reflect(MissionDataManager.prototype, "MissionDataManager");
var MissionProcessUI = (function (_super) {
    __extends(MissionProcessUI, _super);
    function MissionProcessUI() {
        var _this = _super.call(this) || this;
        _this.missionProcessBar = Com.addBitmapAt(_this, "missionBar_json.mission_bar", 41, 25);
        _this.missionProcessTx = Com.addLabelAt(_this, 115, 27, 180, 40, 27, true, true);
        _this.missionProcessTx.stroke = 2;
        _this.missionProcessTx.fontFamily = "Righteous";
        _this.touchChildren = false;
        _this.touchEnabled = true;
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onMissionBtn, _this);
        return _this;
    }
    MissionProcessUI.prototype.setProcess = function (process) {
        this.missionProcessBar.mask = new egret.Rectangle(0, 0, this.missionProcessBar.width * process, this.missionProcessBar.height);
        if (process == 1) {
            this.missionProcessTx.text = MuLang.getText("collect");
            if (!this.fullLight) {
                this.fullLight = Com.addBitmapAt(this, "missionBar_json.mission_btn_white", 0, 0);
                this.bookOutlight = Com.addBitmapAt(this, "missionBar_json.mission_icon_outlight", 5, -9);
                this.fullLight.alpha = 0;
                TweenerTool.tweenTo(this.fullLight, { alpha: 1 }, 1000, 0, this.alphaLight.bind(this));
            }
        }
        else {
            this.missionProcessTx.text = (process * 100).toFixed(1) + "%";
        }
    };
    MissionProcessUI.prototype.alphaLight = function () {
        TweenerTool.tweenTo(this.fullLight, { alpha: (this.fullLight.alpha > 0.7 ? 0.5 : 1) }, 500, 0, this.alphaLight.bind(this));
    };
    MissionProcessUI.prototype.onMissionBtn = function (event) {
        BingoMachine.missionPopup();
    };
    return MissionProcessUI;
}(egret.DisplayObjectContainer));
__reflect(MissionProcessUI.prototype, "MissionProcessUI");
var MissLockUI = (function (_super) {
    __extends(MissLockUI, _super);
    function MissLockUI(lockType) {
        var _this = _super.call(this) || this;
        Com.addBitmapAt(_this, "missionBar_json.btn_shadow", 0, 0);
        Com.addBitmapAt(_this, "missionBar_json.Locked", 146, 16);
        _this.touchEnabled = true;
        _this.touchChildren = false;
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.showMissionLockTip, _this);
        _this.buildTip(lockType);
        return _this;
    }
    MissLockUI.prototype.showMissionLockTip = function (event) {
        if (this.contains(this.missLockTip))
            return;
        Com.addObjectAt(this, this.missLockTip, 154, -57);
        this.missLockTip.scaleX = this.missLockTip.scaleY = 0.1;
        TweenerTool.tweenTo(this.missLockTip, { scaleX: 1, scaleY: 1 }, 300, 0, this.lockUIShowing.bind(this));
    };
    MissLockUI.prototype.buildTip = function (lockType) {
        this.missLockTip = new egret.DisplayObjectContainer;
        var tipBg = Com.addBitmapAtMiddle(this.missLockTip, "missionBar_json.tips_bg", 0, 0);
        // tip text
        var tipsArray = ["coming_soon", "from_level", "mission_updating_tip"];
        var tipText = Com.addLabelAt(this.missLockTip, -160, -55, 320, 85, 56, false, false);
        tipText.fontFamily = "Righteous";
        tipText.setText(MuLang.getText(tipsArray[lockType], MuLang.CASE_TYPE_CAPITALIZE));
        if (lockType === 1)
            tipText.setText(tipText.text.replace(":", ": " + PlayerConfig.player("mission.unlock_level")));
    };
    MissLockUI.prototype.lockUIShowing = function () {
        TweenerTool.tweenTo(this.missLockTip, { scaleX: 0.1, scaleY: 0.1 }, 300, 1500, MDS.removeSelf.bind(this, this.missLockTip));
    };
    return MissLockUI;
}(egret.DisplayObjectContainer));
__reflect(MissLockUI.prototype, "MissLockUI");
var IBingoServer = (function () {
    function IBingoServer() {
    }
    Object.defineProperty(IBingoServer, "connected", {
        get: function () {
            return this.serverConnection["connection"];
        },
        enumerable: true,
        configurable: true
    });
    IBingoServer.serverInit = function () {
        eval("new this.serverConnection()");
    };
    IBingoServer.sendMessage = function (key, value) {
        this.serverConnection["sendMessage"](key, value);
    };
    Object.defineProperty(IBingoServer, "gameInitCallback", {
        set: function (value) {
            this.serverConnection["gameInitCallback"] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IBingoServer, "tounamentCallback", {
        set: function (value) {
            this.serverConnection["tounamentCallback"] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IBingoServer, "changeNumberCallback", {
        set: function (value) {
            this.serverConnection["changeNumberCallback"] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IBingoServer, "playCallback", {
        set: function (value) {
            this.serverConnection["playCallback"] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IBingoServer, "roundOverCallback", {
        set: function (value) {
            this.serverConnection["roundOverCallback"] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IBingoServer, "cancelExtraCallback", {
        set: function (value) {
            this.serverConnection["cancelExtraCallback"] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IBingoServer, "extraCallback", {
        set: function (value) {
            this.serverConnection["extraCallback"] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IBingoServer, "jackpotCallbak", {
        set: function (value) {
            this.serverConnection["jackpotCallbak"] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IBingoServer, "jackpotWinCallbak", {
        set: function (value) {
            this.serverConnection["jackpotWinCallbak"] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IBingoServer, "bonusGameSpinCallback", {
        set: function (value) {
            this.serverConnection["bonusGameSpinCallback"] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IBingoServer, "buffHandlerCallback", {
        set: function (value) {
            this.serverConnection["buffHandlerCallback"] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IBingoServer, "goKartHandlerCallback", {
        set: function (value) {
            this.serverConnection["goKartHandlerCallback"] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IBingoServer, "selectNumberCallback", {
        set: function (value) {
            this.serverConnection["selectNumberCallback"] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IBingoServer, "lemonGameCallback", {
        set: function (value) {
            this.serverConnection["lemonGameCallback"] = value;
        },
        enumerable: true,
        configurable: true
    });
    IBingoServer.loginTo = function (zona, room, joinRoomCallback) {
        if (room === void 0) { room = null; }
        this.serverConnection["loginTo"](zona, room, joinRoomCallback);
    };
    IBingoServer.changeNumber = function () {
        this.serverConnection["sendMessage"]("solicitanumeros", {});
    };
    IBingoServer.play = function (bet, cards, cardGroupNumber, betIndex) {
        this.serverConnection["sendPlay"]("solicitajogada", bet, cards, cardGroupNumber, betIndex);
    };
    IBingoServer.playWithCardId = function (bet, cards, cardGroupNumber, betIndex, cardId) {
        this.serverConnection["sendPlayWithCardId"]("solicitajogada", bet, cards, cardGroupNumber, betIndex, cardId);
    };
    IBingoServer.playWithCardNumbers = function (bet, cards, cardGroupNumber, betIndex, cardNumbers) {
        this.serverConnection["sendPlayWithNumbers"]("solicitajogada", bet, cards, cardGroupNumber, betIndex, cardNumbers);
    };
    IBingoServer.round = function (bet, cards, cardGroupNumber, betIndex) {
        this.serverConnection["sedRound"]("round", bet, cards, cardGroupNumber, betIndex);
    };
    IBingoServer.roundOver = function () {
        this.serverConnection["roundOver"]();
    };
    IBingoServer.libera = function () {
        this.serverConnection["libera"]();
    };
    IBingoServer.cancelExtra = function (extraString) {
        if (extraString === void 0) { extraString = false; }
        this.serverConnection["cancelExtra"](extraString);
    };
    IBingoServer.extra = function (extraString, saving) {
        if (extraString === void 0) { extraString = false; }
        if (saving === void 0) { saving = false; }
        this.serverConnection["extra"](extraString, saving);
    };
    IBingoServer.bonusGameSpin = function (bet) {
        this.serverConnection["bonusGameSpin"](bet);
    };
    IBingoServer.buffHandler = function (action, bet) {
        this.serverConnection["buffHandler"](action, bet);
    };
    IBingoServer.selectNumber = function (num) {
        this.serverConnection["selectNumber"](num);
    };
    IBingoServer.goKartHandler = function (action, rewardType) {
        this.serverConnection["goKartHandler"](action, rewardType);
    };
    IBingoServer.lemonGame = function (action, bet, type, boxIndex) {
        if (bet === void 0) { bet = 0; }
        if (type === void 0) { type = 0; }
        if (boxIndex === void 0) { boxIndex = 0; }
        this.serverConnection["lemonGame"](action, bet, type, boxIndex);
    };
    IBingoServer.serverConnection = SFSConnector;
    return IBingoServer;
}());
__reflect(IBingoServer.prototype, "IBingoServer");
var TounamentDataFormat = (function () {
    function TounamentDataFormat() {
    }
    TounamentDataFormat.parse = function (cmd, data) {
        var obj;
        switch (cmd) {
            case "trm.start":
                obj = this.initTournamentData(data);
                break;
            case "trm.update":
                obj = this.updateTournamentData(data);
                break;
            case "trm.end":
                obj = this.tournamentOver(data);
                break;
            default: trace("wrong tounament command");
        }
        return obj;
    };
    TounamentDataFormat.initTournamentData = function (data) {
        var tmd = {};
        tmd.isGold = data.getBool("isGold");
        tmd.fromLevel = Number(data.getInt("fromLevel"));
        tmd.toLevel = Number(data.getInt("toLevel"));
        tmd.gameIDs = data.getIntArray("gameIDs");
        tmd.threshold = Number(data.getDouble("threshold:"));
        tmd.currentTreshold = Number(data.getDouble("currentTreshold"));
        tmd.eligible = data.getBool("eligible");
        this.getUpdateData(tmd, data);
        return tmd;
    };
    TounamentDataFormat.getListDatas = function (tmd, data) {
        var prizes = data.get("prizes");
        tmd.prizes = [];
        if (prizes) {
            for (var i = 0; i < prizes.size(); i++) {
                tmd.prizes[i] = this.getPrizeData(prizes.get(i));
            }
        }
        var userList = data.get("user_list");
        tmd.userList = [];
        if (userList) {
            for (var i = 0; i < userList.size(); i++) {
                tmd.userList[i] = this.getAUserData(userList.get(i));
            }
        }
        var winners = data.get("winners");
        tmd.winners = [];
        if (winners) {
            for (var i = 0; i < winners.size(); i++) {
                tmd.winners[i] = this.getAUserData(winners.get(i));
            }
        }
    };
    TounamentDataFormat.getPrizeData = function (prize) {
        var prizeData = {};
        prizeData.fromRank = Number(prize.getInt("fromRank"));
        prizeData.toRank = Number(prize.getInt("toRank"));
        prizeData.winningPrize = Number(prize.getLong("winningPrize"));
        prizeData.winGoldPrize = Number(prize.getLong("winGoldPrize"));
        return prizeData;
    };
    TounamentDataFormat.getAUserData = function (user) {
        var userData = {};
        userData.uid = user.getUtfString("uid");
        userData.isWinning = user.getBool("isWinning");
        userData.loyaltyLevel = user.getInt("loyaltyLevel");
        userData.minEnter = user.getLong("winGoldPrize");
        userData.coinsEarn = user.getLong("coinsEarn");
        userData.rank = user.getInt("rank");
        userData.winGoldPrize = user.getLong("winGoldPrize");
        userData.currentWinningPrize = user.getLong("currentWinningPrize");
        userData.networkLogins = [];
        var networkLoginsArr = user.get("networkLogins");
        for (var i = 0; i < networkLoginsArr.size(); i++) {
            var networkLoginData = networkLoginsArr.get(i);
            userData.networkLogins[i] = {};
            userData.networkLogins[i].id = networkLoginData.getUtfString("id");
            userData.networkLogins[i].pic = networkLoginData.getUtfString("pic");
            userData.networkLogins[i].network = networkLoginData.getUtfString("network");
        }
        return userData;
    };
    TounamentDataFormat.updateTournamentData = function (data) {
        var tmd = {};
        this.getUpdateData(tmd, data);
        return tmd;
    };
    TounamentDataFormat.getUpdateData = function (tmd, data) {
        tmd.totalDuration = Number(data.getInt("total_duration"));
        tmd.duration = Number(data.getInt("duration"));
        tmd.userCount = Number(data.getInt("userCount"));
        tmd.prize = Number(data.getLong("prize"));
        tmd.normalPrize = Number(data.getLong("normalPrize"));
        tmd.goldPrize = Number(data.getLong("goldPrize"));
        this.getListDatas(tmd, data);
    };
    TounamentDataFormat.tournamentOver = function (data) {
        // let missionValue = data.get("mission_value");
        var isWinning = data.getBool("isWinning");
        if (isWinning) {
            var winInfo = {};
            winInfo.bonusId = data.getInt("pending_round_id");
            winInfo.rank = data.getInt("rank");
            winInfo.currentWinningPrize = data.getLong("currentWinningPrize");
            winInfo.goldPrize = data.getLong("winGoldPrize") || 0;
            return winInfo;
        }
        return null;
    };
    return TounamentDataFormat;
}());
__reflect(TounamentDataFormat.prototype, "TounamentDataFormat");
var PaytableCheckResult = (function () {
    function PaytableCheckResult(name) {
        this.fit = false;
        this.unfitIndex = -1;
        this.fitIndex = [];
        this.name = name;
    }
    PaytableCheckResult.prototype.getCheckResult = function (testString, ruleString, ruleIndex) {
        if (ruleIndex === void 0) { ruleIndex = NaN; }
        var num = this.testCheckString(testString, ruleString);
        if (num == -1) {
            if (isNaN(ruleIndex))
                this.fit = true;
            else {
                if (!this.fits)
                    this.fits = [];
                this.fits[ruleIndex] = true;
            }
        }
        else if (num >= 0) {
            if (isNaN(ruleIndex))
                this.unfitIndex = num;
            else {
                if (!this.unfitIndexs)
                    this.unfitIndexs = {};
                this.unfitIndexs[ruleIndex] = num;
            }
        }
    };
    PaytableCheckResult.prototype.lightCheckResult = function (testString, ruleString, ruleIndex) {
        if (ruleIndex === void 0) { ruleIndex = NaN; }
        var num = this.testCheckString(testString, ruleString);
        if (num == -1)
            return true;
        return false;
    };
    PaytableCheckResult.prototype.toString = function () {
        var str = this.name + ":";
        if (this.fit) {
            str += "fit = true";
        }
        else if (this.unfitIndex != -1) {
            str += "unfitIndex" + ":" + this.unfitIndex;
        }
        else {
            if (this.fits) {
                str += "fits:";
                for (var i = 0; i < this.fits.length; i++) {
                    if (this.fits[i])
                        str += "(" + i + "," + this.fits[i] + "),";
                }
                str = str.substr(0, str.length - 1);
            }
            if (this.unfitIndexs) {
                str += "unfitIndexs:";
                for (var ob in this.unfitIndexs) {
                    str += "(" + ob + "," + this.unfitIndexs[ob] + "),";
                }
                str = str.substr(0, str.length - 1);
            }
        }
        return str;
    };
    PaytableCheckResult.prototype.testCheckString = function (testString, checkGate) {
        if (testString.length != checkGate.length)
            return NaN;
        var differentIndex = -1;
        for (var i = 0; i < testString.length; i++) {
            var char = checkGate.charAt(i);
            if (char == "0")
                continue;
            if (testString.charAt(i) != checkGate.charAt(i)) {
                if (differentIndex >= 0)
                    return NaN;
                else
                    differentIndex = i;
            }
        }
        return differentIndex;
    };
    return PaytableCheckResult;
}());
__reflect(PaytableCheckResult.prototype, "PaytableCheckResult");
var PaytableFilter = (function () {
    function PaytableFilter() {
    }
    PaytableFilter.lightConfixFilter = function (paytableName, cardPaytableItems) {
        for (var ob in cardPaytableItems) {
            if (ob == paytableName)
                continue;
            if (this.testContain(ob, paytableName))
                return true;
        }
        return false;
    };
    PaytableFilter.paytableConfixFilter = function (fitPaytableItem, byObject) {
        if (byObject === void 0) { byObject = false; }
        for (var i = 0; i < fitPaytableItem.length - 1; i++) {
            for (var j = i + 1; j < fitPaytableItem.length; j++) {
                var contains = void 0;
                if (byObject)
                    contains = this.testContain(fitPaytableItem[i]["paytalbe"], fitPaytableItem[j]["paytalbe"]);
                else
                    contains = this.testContain(fitPaytableItem[i], fitPaytableItem[j]);
                if (contains) {
                    fitPaytableItem.splice(j, 1);
                    j--;
                    continue;
                }
                if (byObject)
                    contains = this.testContain(fitPaytableItem[j]["paytalbe"], fitPaytableItem[i]["paytalbe"]);
                else
                    contains = contains = this.testContain(fitPaytableItem[j], fitPaytableItem[i]);
                if (contains) {
                    fitPaytableItem.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
    };
    PaytableFilter.testContain = function (ruleParent, ruleChild) {
        var parentArray = this.filterObject[ruleParent];
        if (!parentArray)
            return false;
        var index = parentArray.indexOf(ruleChild);
        if (index >= 0)
            return true;
        for (var i = 0; i < parentArray.length; i++) {
            if (this.testContain(parentArray[i], ruleChild))
                return true;
        }
        return false;
    };
    return PaytableFilter;
}());
__reflect(PaytableFilter.prototype, "PaytableFilter");
var GameSoundManager = (function () {
    function GameSoundManager() {
        this.playing = [];
        GameSoundManager.instance = this;
    }
    GameSoundManager.prototype.play = function (soundAssetName, repeat, callback) {
        if (repeat === void 0) { repeat = 1; }
        if (callback === void 0) { callback = null; }
        var soundChannel = SoundManager.play(soundAssetName, repeat === -1);
        if (callback !== null && repeat !== -1) {
            soundChannel["soundCallback"] = callback;
            soundChannel["soundAssetName"] = soundAssetName;
            soundChannel.addEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
        }
        if (soundChannel) {
            this.playing.push(soundChannel);
        }
        if (!soundChannel && callback) {
            callback();
        }
    };
    GameSoundManager.prototype.onSoundComplete = function (e) {
        var soundChannel = e.currentTarget;
        soundChannel.removeEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
        if (soundChannel["soundCallback"]) {
            soundChannel["soundCallback"]();
            soundChannel["soundCallback"] = null;
        }
        var index = this.playing.indexOf(soundChannel);
        this.playing.splice(index, 1);
    };
    GameSoundManager.prototype.stop = function (soundAssetName) {
        for (var i = 0; i < this.playing.length; i++) {
            var soundChannel = this.playing[i];
            if (soundChannel["soundAssetName"] == soundAssetName) {
                soundChannel.stop();
                if (soundChannel["soundCallback"]) {
                    soundChannel["soundCallback"]();
                    soundChannel["soundCallback"] = null;
                }
                this.playing.splice(i, 1);
                i--;
            }
        }
        SoundManager.stopMusic();
    };
    GameSoundManager.prototype.stopAll = function () {
        for (var i = 0; i < this.playing.length; i++) {
            var sound = this.playing[i];
            if (sound["soundCallback"]) {
                sound.removeEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
                sound["soundCallback"]();
                sound["soundCallback"] = null;
            }
            sound.stop();
        }
        this.playing = [];
    };
    GameSoundManager.stopAll = function () {
        if (this.instance)
            this.instance.stopAll();
    };
    GameSoundManager.instance = null;
    return GameSoundManager;
}());
__reflect(GameSoundManager.prototype, "GameSoundManager");
var PayTableManager = (function (_super) {
    __extends(PayTableManager, _super);
    function PayTableManager(paytableObject, name) {
        var _this = _super.call(this) || this;
        _this._payTableName = name;
        var rule = paytableObject["rule"];
        if (rule.length == 1)
            _this.rule = rule[0];
        else if (rule.length > 1)
            _this.rules = rule;
        _this.ui = _this.createPaytableUI(paytableObject["useBckgroundPicture"]);
        _this.ui.setText(paytableObject["UItext"], paytableObject["textColor"], paytableObject["textSize"]);
        _this.ui.setBackground(paytableObject["bgPicture"]);
        var effect1 = null;
        var effect2 = null;
        if (paytableObject["blinkAlpha1"] != null && paytableObject["blinkColor1"] != null) {
            effect1 = MatrixTool.colorMatrixPure(paytableObject["blinkColor1"], paytableObject["blinkAlpha1"]);
        }
        if (paytableObject["blinkAlpha1"] != null && paytableObject["blinkColor1"] != null) {
            effect2 = MatrixTool.colorMatrixPure(paytableObject["blinkColor2"], paytableObject["blinkAlpha2"]);
        }
        _this.ui.winEffects = [effect1, effect2];
        _this.ui.setGrids(paytableObject["gridRule"]);
        _this.gridRule = paytableObject["gridRule"];
        var position = paytableObject["position"];
        _this.position = new egret.Point(position["x"], position["y"]);
        return _this;
    }
    Object.defineProperty(PayTableManager.prototype, "payTableName", {
        get: function () {
            return this._payTableName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PayTableManager.prototype, "multiple", {
        get: function () {
            return this.ui._tx;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PayTableManager.prototype, "UI", {
        get: function () {
            return this.ui;
        },
        enumerable: true,
        configurable: true
    });
    PayTableManager.getPayTableData = function (obj) {
        this.payTablesDictionary = {};
        for (var payTableObj in obj) {
            var ptm = new PayTableManager(obj[payTableObj], payTableObj);
            this.payTablesDictionary[payTableObj] = ptm;
        }
    };
    PayTableManager.getPayTableUI = function () {
        for (var payTableObj in this.payTablesDictionary) {
            this.payTablesDictionary[payTableObj].ui.initUI();
        }
    };
    PayTableManager.prototype.createPaytableUI = function (useBg) {
        var ptUI;
        ptUI = eval("new PayTableManager.paytableUIType(" + useBg + ")");
        return ptUI;
    };
    PayTableManager.prototype.check = function (testRule) {
        var result = new PaytableCheckResult(this.payTableName);
        if (this.rule) {
            result.getCheckResult(testRule, this.rule);
        }
        else if (this.rules) {
            for (var i = 0; i < this.rules.length; i++) {
                result.getCheckResult(testRule, this.rules[i], i);
            }
        }
        else
            throw Error("ff");
        return result;
    };
    PayTableManager.prototype.lightCheck = function (testRule) {
        var result = new PaytableCheckResult(this.payTableName);
        var fitArray = [];
        if (this.rule) {
            if (result.lightCheckResult(testRule, this.rule))
                fitArray.push(-1);
        }
        else if (this.rules) {
            for (var i = 0; i < this.rules.length; i++) {
                if (result.lightCheckResult(testRule, this.rules[i], i))
                    fitArray.push(i);
            }
        }
        else
            throw Error("ff");
        return fitArray;
    };
    PayTableManager.clearPaytablesStatus = function () {
        for (var ob in this.payTablesDictionary) {
            this.payTablesDictionary[ob].clearStatus("0");
        }
    };
    PayTableManager.prototype.focus = function () {
        this.ui.focus();
    };
    PayTableManager.prototype.clearStatus = function () {
        this.ui.clearStatus();
    };
    PayTableManager.prototype.showBlinkAt = function (grids) {
        this.ui.showBlinkAt(grids);
    };
    PayTableManager.bingoPaytableName = "bingo";
    PayTableManager.paytableUIType = PaytableUI;
    PayTableManager.layerType = PaytableLayer;
    return PayTableManager;
}(egret.Sprite));
__reflect(PayTableManager.prototype, "PayTableManager");
var PaytableResultListOprator = (function () {
    function PaytableResultListOprator() {
    }
    PaytableResultListOprator.missOneCounter = function (resultList, paytableName, needCount) {
        if (needCount === void 0) { needCount = false; }
        var missCount = 0;
        for (var i = 0; i < resultList.length; i++) {
            if (resultList[i][paytableName] && resultList[i][paytableName].unfitIndex >= 0) {
                missCount++;
                if (!needCount)
                    break;
            }
        }
        return missCount;
    };
    return PaytableResultListOprator;
}());
__reflect(PaytableResultListOprator.prototype, "PaytableResultListOprator");
var V1Game = (function (_super) {
    __extends(V1Game, _super);
    function V1Game(gameConfigFile, configUrl, gameId) {
        var _this = _super.call(this, gameConfigFile, configUrl, gameId) || this;
        _this.tokenObject["key"] = "login";
        _this.tokenObject["value"]["token"] = "112411241124696911692424116969";
        return _this;
    }
    V1Game.prototype.getCardsGroup = function (value) {
        if (!this.Cartoes)
            this.createCardGroups();
        var ar = this.Cartoes.slice(value * 4 - 3, value * 4 + 1);
        var resultArray = [];
        for (var i = 0; i < ar.length; i++) {
            resultArray = resultArray.concat(this.changeCardNumberOrder(ar[i]));
        }
        return resultArray;
    };
    V1Game.prototype.changeCardNumberOrder = function (groupNumbers) {
        var newArray = [];
        groupNumbers = groupNumbers.concat();
        for (var i = 0; i < groupNumbers.length; i++) {
            var line = i % GameCardUISettings.gridNumbers.y;
            var row = Math.floor(i / GameCardUISettings.gridNumbers.y);
            newArray[line * 5 + row] = groupNumbers[i];
        }
        return newArray;
    };
    V1Game.prototype.onServerData = function (data) {
        data["numerosCartelas"] = this.getCardsGroup(data["cartela"]);
        _super.prototype.onServerData.call(this, data);
    };
    V1Game.prototype.sendRoundOverRequest = function () {
        IBingoServer.roundOverCallback = this.onRoundOver.bind(this);
        IBingoServer.libera();
    };
    V1Game.prototype.sendPlayRequest = function () {
        IBingoServer.playCallback = this.onPlay.bind(this);
        IBingoServer.round(GameData.currentBet, CardManager.enabledCards, CardManager.groupNumber, GameData.currentBetIndex);
        BingoMachine.inRound = true;
    };
    V1Game.prototype.sendExtraRequest = function (saving) {
        if (saving === void 0) { saving = false; }
        IBingoServer.extraCallback = this.onExtra.bind(this);
        IBingoServer.extra(true, saving);
    };
    V1Game.prototype.sendCancelExtraReuqest = function () {
        IBingoServer.cancelExtraCallback = this.onCancelExtra.bind(this);
        IBingoServer.cancelExtra(true);
    };
    V1Game.prototype.createCardGroups = function () {
        this.Cartoes = RES.getRes("v1gameDefault_json");
    };
    V1Game.prototype.onPlay = function (data) {
        if (data && data["bolas"] && data["bolas"].length) {
            var balls = data["bolas"];
            for (var i = 0; i < balls.length; i++) {
                balls[i] = this.changeNumberFromServer(balls[i]);
            }
            if (this["de_duplication"])
                this["de_duplication"](balls);
        }
        else
            data = null;
        _super.prototype.onPlay.call(this, data);
    };
    V1Game.prototype.changeNumberFromServer = function (num) {
        var card = Math.floor((num - 1) / 15);
        var index = (num - 1) % 15;
        return CardManager.cards[card].getNumberAt(index);
    };
    V1Game.prototype.onExtra = function (data) {
        if (data && data["extra"] != null) {
            if (this["de_duplication"])
                data["extra"] = data["extra"] % 100;
            data["extra"] = this.changeNumberFromServer(data["extra"]);
        }
        else
            data = null;
        _super.prototype.onExtra.call(this, data);
    };
    V1Game.prototype.showMissExtraBall = function (balls) {
        if (!balls)
            return;
        for (var i = 0; i < balls.length; i++) {
            balls[i] = this.changeNumberFromServer(balls[i]);
        }
        _super.prototype.showMissExtraBall.call(this, balls);
    };
    return V1Game;
}(BingoMachine));
__reflect(V1Game.prototype, "V1Game");
var MissionPopup = (function (_super) {
    __extends(MissionPopup, _super);
    function MissionPopup() {
        return _super.call(this) || this;
    }
    Object.defineProperty(MissionPopup, "classAssetName", {
        get: function () {
            return "bingoMissionPopup";
        },
        enumerable: true,
        configurable: true
    });
    MissionPopup.prototype.init = function () {
        this.bgAssetName = "missionBingo_json.bg";
        this.closeButtonAssetName = "missionPopup_json.btn_close";
        this.closeButtonOffset = new egret.Point(190, 18);
        _super.prototype.init.call(this);
        this.anchorOffsetX = 922;
        this.anchorOffsetY = 472;
        Com.addBitmapAtMiddle(this, "missionBingo_json.mission_" + MuLang.language, 797, 41);
        Com.addBitmapAt(this, "missionBingo_json.card", 1080, -68);
        this.taskListLayer = new egret.DisplayObjectContainer;
        this.addChild(this.taskListLayer);
        this.showListByData();
        Com.addBitmapAt(this, "missionPopup_json.doctor", 1475, 29);
        this.addChild(this.closeButton);
    };
    MissionPopup.prototype.showListByData = function () {
        this.taskListLayer.removeChildren();
        var mission = PlayerConfig.player("mission");
        var tasks = MissionDataManager.getMissionTasks("1");
        var taskUIs = [];
        var hasFoundActive;
        var taskHeight;
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            var isActive = task.is_active == "1";
            taskUIs[i] = new MissionTaskUIItem(isActive, task.current / task.target, hasFoundActive);
            Com.addObjectAt(this.taskListLayer, taskUIs[i], 794, this.taskListLayer.height + (i ? 16 : 0) + taskUIs[i].anchorOffsetY + 176);
            if (!hasFoundActive && isActive)
                hasFoundActive = true;
        }
    };
    return MissionPopup;
}(GenericPo));
__reflect(MissionPopup.prototype, "MissionPopup");
var MissionTaskUIItem = (function (_super) {
    __extends(MissionTaskUIItem, _super);
    function MissionTaskUIItem(isActive, process, hasActive) {
        var _this = _super.call(this) || this;
        var bg;
        if (isActive && process != 1) {
            bg = Com.addBitmapAt(_this, "missionBingo_json.bar2", 0, 0);
            bg.scale9Grid = new egret.Rectangle(60, 48, 119, 122);
            bg.width = 1405;
        }
        else {
            bg = Com.addBitmapAt(_this, "missionBingo_json.bar1", 12, 0);
            bg.scale9Grid = new egret.Rectangle(48, 48, 63, 63);
            bg.width = 1393;
            if (isActive) {
                var tx = MDS.addGameText(_this, 120, 0, 52, 0xFFFFFF, "mission_complete", false, 790, "", 1);
            }
            // Com.addBitmapAt( this,  )
        }
        _this.anchorOffsetX = 700;
        _this.anchorOffsetY = 110;
        return _this;
    }
    return MissionTaskUIItem;
}(egret.DisplayObjectContainer));
__reflect(MissionTaskUIItem.prototype, "MissionTaskUIItem");
var BingoGameToolbar = (function (_super) {
    __extends(BingoGameToolbar, _super);
    function BingoGameToolbar() {
        var _this = _super.call(this) || this;
        _this._autoPlaying = false;
        _this._buyAllExtra = false;
        _this.delayKeyboard = 500;
        _this._enableKeyboard = true;
        _this._coins = 0;
        _this._dinero = 0;
        _this._win = 0;
        _this.allButtons = [];
        Com.addBitmapAt(_this, "bingoGameToolbar_json.back_panel", 0, 96);
        _this.buildPlayContainer();
        _this.buildExtraContainer();
        _this.stopAutoBtn = _this.addBtn("auto_stop", 1724, 22, GameCommands.stopAuto, _this, true);
        _this.addButtonText(_this.stopAutoBtn, 72, "auto", 15, 0, 0xFFFFFF, _this.stopAutoBtn.width - 30, 125, 4, 0x000093);
        _this.addButtonText(_this.stopAutoBtn, 35, "click to stop", 15, 100, 0xFFFFFF, _this.stopAutoBtn.width - 30, 70, 1, 0x000093);
        _this.stopAutoBtn.visible = false;
        _this.allButtons.pop(); // stopAuto button dont need enabled
        Com.addBitmapAt(_this, "bingoGameToolbar_json.middle_bar", 610, 22);
        Com.addBitmapAt(_this, "bingoGameToolbar_json.msg_bg", 694, 35).height = 86;
        var bl1 = Com.addBitmapAt(_this, "bingoGameToolbar_json.ballance", 694, 128);
        bl1.width = 355;
        bl1.height = 50;
        var bl2 = Com.addBitmapAt(_this, "bingoGameToolbar_json.ballance", 1054, 128);
        bl2.width = 225;
        bl2.height = 50;
        Com.addBitmapAt(_this, "bingoGameToolbar_json.balance_coin", 655, 115);
        Com.addBitmapAt(_this, "bingoGameToolbar_json.balance_chip", 1217, 123);
        _this.createTexts();
        _this.xpBar = new XpBar;
        Com.addObjectAt(_this, _this.xpBar, 1365, 38);
        _this.xpBar.addEventListener(XpBar.LEVEL_UP_BONUS, _this.onLevelUpBonus, _this);
        _this.missionBar = new MissionBar;
        Com.addObjectAt(_this, _this.missionBar, 1357, 117);
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onToolbarAdd, _this);
        _this.cacheAsBitmap = true;
        return _this;
    }
    Object.defineProperty(BingoGameToolbar.prototype, "autoPlaying", {
        get: function () {
            return this._autoPlaying;
        },
        set: function (value) {
            this._autoPlaying = value;
            if (value) {
                this.enableAllButtons(false);
                this.stopAutoBtn.visible = true;
                BingoMachine.sendCommand(GameCommands.play);
            }
            else {
                this.stopAutoBtn.visible = false;
                this.playBtn.enabled = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BingoGameToolbar.prototype, "buyAllExtra", {
        get: function () {
            return this._buyAllExtra;
        },
        set: function (value) {
            this._buyAllExtra = value;
            if (value) {
                this.enabledExtraButtons(false);
                BingoMachine.sendCommand(GameCommands.extra);
            }
            else {
                this.enabledExtraButtons();
            }
        },
        enumerable: true,
        configurable: true
    });
    BingoGameToolbar.prototype.onToolbarAdd = function (event) {
        //this.startHappyHour();
    };
    BingoGameToolbar.prototype.buildPlayContainer = function () {
        this.playContainer = new egret.DisplayObjectContainer;
        this.addChild(this.playContainer);
        Com.addBitmapAt(this.playContainer, "play_bg", 1360, 0);
        Com.addBitmapAt(this.playContainer, "bet_screen", 178, 122);
        this.helpBtn = this.addBtn("i", 12, 126, GameCommands.help, this.playContainer);
        this.decreseBetBtn = this.addBtn("bet_down", 95, 116, GameCommands.decreseBet, this.playContainer);
        this.increaseBetBtn = this.addBtn("bet_up", 411, 116, GameCommands.increaseBet, this.playContainer);
        this.maxBetBtn = this.addBtn("max_btn", 509, 116, GameCommands.maxBet, this.playContainer);
        this.addButtonText(this.maxBetBtn, 48, "max", 0, 0, 0x343433, this.maxBetBtn.width - 10, this.maxBetBtn.height, 1);
        this.stopBtn = this.addBtn("play", 1724, 22, GameCommands.stop, this.playContainer);
        this.addButtonText(this.stopBtn, 72, "stop", 15, 0, 0xFFFFFF, this.stopBtn.width - 30, 186, 4, 0x000093);
        this.addPlayButton();
        this.freeSpinBtn = new FreeSpinButton;
        this.freeSpinBtn.visible = false;
        Com.addObjectAt(this.playContainer, this.freeSpinBtn, 1724, 22);
        var tb = this.addToolBarText(198, 192, 192, 30, 30, 0, 0, this.playContainer);
        tb.setText(MuLang.getText("total bet"));
        tb.textColor = 0x343433;
        this.betText = this.addToolBarText(185, 124, 220, 68, 45, 1, 0, this.playContainer);
    };
    BingoGameToolbar.prototype.buildExtraContainer = function () {
        this.extraContainer = new egret.DisplayObjectContainer;
        this.addChild(this.extraContainer);
        this.extraContainer.visible = false;
        Com.addBitmapAt(this.extraContainer, "BB_EXTRA_btn_bg", 1360, 0);
        this.collectBtn = this.addBtn("BB_EXTRA_collect_btn", 17, 120, GameCommands.collect, this.extraContainer, true);
        this.addButtonText(this.collectBtn, 50, "credit", 10, 0, 0, this.collectBtn.width - 20);
        this.buyAllBtn = this.addBtn("BB_EXTRA_buyall", 290, 118, GameCommands.buyAll, this.extraContainer, true);
        this.addButtonText(this.buyAllBtn, 50, "buy all", 10, 0, 0, this.buyAllBtn.width - 20);
        this.superExtraBtn = this.addMaskBtn("btn_mega", 1724, 22, GameCommands.extra, this.extraContainer, 0xFFFFFF);
        this.superExtraBtn.addButtonBigText(72, "mega");
        this.superExtraBtn.addButtonSmallText(60);
        this.superExtraBtn.setIcon("balance_chip");
        this.bigExtraBtn = this.addMaskBtn("BB_EXTRA_extra_btn", 1724, 22, GameCommands.extra, this.extraContainer);
        this.bigExtraBtn.addButtonBigText(72, "extra");
        this.bigExtraBtn.addButtonSmallText(60);
        this.bigExtraBtn.setIcon("balance_coin");
    };
    BingoGameToolbar.prototype.addPlayButton = function () {
        this.playBtn = new LongPressButton("bingoGameToolbar_json.play", "bingoGameToolbar_json.play_press");
        Com.addObjectAt(this.playContainer, this.playBtn, 1724, 22);
        this.playBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendCommand, this);
        this.playBtn.name = GameCommands.play;
        this.playBtn.disabledFilter = MatrixTool.colorMatrixLighter(0.2);
        this.playBtn.enabled = true;
        this.allButtons.push(this.playBtn);
        this.addButtonText(this.playBtn, 72, "play", 15, 0, 0xFFFFFF, this.playBtn.width - 30, 125, 4, 0x000093);
        this.addButtonText(this.playBtn, 35, "hold for auto", 15, 100, 0xFFFFFF, this.playBtn.width - 30, 70, 1, 0x000093);
        this.playBtn.longPressSetting(1000, this.startAuto.bind(this));
    };
    BingoGameToolbar.prototype.createTexts = function () {
        this.winText = this.addToolBarText(720, 50, 565, 65, 60, 2, 0x2A1DB5);
        this.coinsText = this.addToolBarText(730, 135, 305, 40, 40, 3, 0xAC9418);
        this.dineroText = this.addToolBarText(1070, 135, 150, 40, 40, 3, 0x38AC3d);
    };
    BingoGameToolbar.prototype.addToolBarText = function (x, y, textWidth, textHeight, textSize, stroke, strokeColor, target) {
        if (stroke === void 0) { stroke = 0; }
        if (strokeColor === void 0) { strokeColor = 0; }
        if (target === void 0) { target = null; }
        var tx = Com.addLabelAt(target ? target : this, x, y, textWidth, textHeight, textSize);
        tx.fontFamily = "Righteous";
        if (stroke) {
            tx.stroke = stroke;
            tx.strokeColor = strokeColor;
        }
        return tx;
    };
    BingoGameToolbar.prototype.addBtn = function (assets, x, y, name, container, donotHavePressUi) {
        if (donotHavePressUi === void 0) { donotHavePressUi = false; }
        var assetsName = "bingoGameToolbar_json." + assets;
        var pressUi = donotHavePressUi ? assetsName : assetsName + "_press";
        var btn = Com.addDownButtonAt(container, assetsName, pressUi, x, y, this.sendCommand.bind(this), true);
        btn.name = name;
        btn.disabledFilter = MatrixTool.colorMatrixLighter(0.2);
        this.allButtons.push(btn);
        return btn;
    };
    BingoGameToolbar.prototype.addMaskBtn = function (assets, x, y, name, container, textColor) {
        if (textColor === void 0) { textColor = 0; }
        var btn = new GameToolbarMaskButton("bingoGameToolbar_json." + assets, textColor);
        Com.addObjectAt(container, btn, x, y);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendCommand, this);
        btn.name = name;
        this.allButtons.push(btn);
        return btn;
    };
    BingoGameToolbar.prototype.sendCommand = function (event) {
        BingoMachine.sendCommand(event.target.name);
    };
    BingoGameToolbar.prototype.addButtonText = function (terget, size, text, offsetX, offsetY, color, width, height, stroke, strokeColor) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        if (color === void 0) { color = 0xFFFFFF; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        if (stroke === void 0) { stroke = 0; }
        if (strokeColor === void 0) { strokeColor = 0; }
        var txt = Com.addLabelAt(this, offsetX, offsetY, width ? width : terget.width, height ? height : terget.height, size);
        terget.addChild(txt);
        txt.fontFamily = "Righteous";
        if (color != 0xFFFFFF)
            txt.textColor = color;
        if (stroke) {
            txt.stroke = stroke;
            txt.strokeColor = strokeColor;
        }
        txt.setText(MuLang.getText(text, MuLang.CASE_UPPER));
        return txt;
    };
    BingoGameToolbar.prototype.setBet = function (bet, cardNumber, isMaxBet) {
        this.betNumber = bet * cardNumber;
        if (isMaxBet) {
            this.maxBetBtn.enabled = false;
            this.increaseBetBtn.enabled = false;
        }
        else {
            this.maxBetBtn.enabled = true;
            this.increaseBetBtn.enabled = true;
        }
        if (bet == GameData.minBet)
            this.decreseBetBtn.enabled = false;
        else
            this.decreseBetBtn.enabled = true;
    };
    Object.defineProperty(BingoGameToolbar.prototype, "betNumber", {
        set: function (value) {
            var str = Utils.formatCoinsNumber(value);
            this.betText.setText(str);
        },
        enumerable: true,
        configurable: true
    });
    BingoGameToolbar.prototype.lockAllButtons = function () {
        if (this.autoPlaying)
            return;
        this.enabledButtons = [];
        for (var i = 0; i < this.allButtons.length; i++) {
            if (this.allButtons[i].enabled) {
                this.allButtons[i].enabled = false;
                this.enabledButtons.push(this.allButtons[i]);
            }
        }
    };
    BingoGameToolbar.prototype.unlockAllButtons = function () {
        if (this.autoPlaying)
            return;
        if (!this.enabledButtons)
            return;
        for (var i = 0; i < this.enabledButtons.length; i++) {
            this.enabledButtons[i].enabled = true;
        }
        this.enabledButtons = [];
    };
    BingoGameToolbar.prototype.showExtra = function (isShow, extraPrice) {
        if (extraPrice === void 0) { extraPrice = 0; }
        if (isShow) {
            if (this.autoPlaying) {
                this.playBtn.visible = false;
            }
            else {
                this.enableAllButtons(false);
                if (!this.buyAllExtra)
                    this.enabledExtraButtons();
            }
            this.showExtraButton(true);
            this.showTip(GameCommands.extra, extraPrice);
        }
        else {
            if (this.autoPlaying) {
            }
            else {
                this.enableAllButtons(true);
                this.playBtn.visible = true;
            }
            this.showExtraButton(false);
        }
    };
    BingoGameToolbar.prototype.enableAllButtons = function (enabled) {
        for (var i = 0; i < this.allButtons.length; i++) {
            this.allButtons[i].enabled = enabled;
        }
    };
    BingoGameToolbar.prototype.showExtraButton = function (isShow) {
        this.playContainer.visible = !isShow;
        this.extraContainer.visible = isShow;
    };
    BingoGameToolbar.prototype.enabledExtraButtons = function (isAble) {
        if (isAble === void 0) { isAble = true; }
        this.buyAllBtn.enabled = this.collectBtn.enabled = this.superExtraBtn.enabled = this.bigExtraBtn.enabled = isAble;
    };
    BingoGameToolbar.prototype.showTip = function (cmd, price) {
        if (price === void 0) { price = 0; }
        var ev = new egret.Event("tipStatus");
        switch (cmd) {
            case GameCommands.play:
                ev["status"] = "play";
                this.dispatchEvent(ev);
                break;
            case GameCommands.extra:
                ev["status"] = "extra";
                ev["extraPrice"] = price;
                this.dispatchEvent(ev);
                this.showCoinsIconAt(price);
                break;
            default:
                ev["status"] = "ready";
                this.dispatchEvent(ev);
                break;
        }
    };
    BingoGameToolbar.prototype.showCoinsIconAt = function (price) {
        this.superExtraBtn.setPrice(price);
        this.bigExtraBtn.setPrice(price);
    };
    BingoGameToolbar.prototype.showWinResult = function (winPrice) {
        if (winPrice)
            TweenerTool.tweenTo(this, { win: winPrice }, 335);
        else
            this.win = winPrice;
        var ev = new egret.Event("winChange");
        ev["winCoins"] = winPrice;
        this.dispatchEvent(ev);
    };
    BingoGameToolbar.prototype.showStop = function (isStop) {
        this.playBtn.visible = !isStop;
        this.stopBtn.visible = isStop;
        this.stopBtn.enabled = isStop;
    };
    BingoGameToolbar.prototype.showCollectButtonAfterOOC = function () {
        this.enabledExtraButtons();
        this.showExtraButton(true);
    };
    BingoGameToolbar.prototype.unlockAllButtonsAfterOOC = function () {
        this.enableAllButtons(true);
        this.showStop(false);
    };
    BingoGameToolbar.prototype.unlockAllButtonsAfterOOCExtra = function () {
        this.enableAllButtons(false);
        this.enabledExtraButtons();
        this.showExtraButton(true);
    };
    BingoGameToolbar.prototype.collect = function () {
        if (this.collectBtn.enabled && this.collectBtn.visible) {
            BingoMachine.sendCommand(GameCommands.collect);
        }
    };
    Object.defineProperty(BingoGameToolbar.prototype, "enableKeyboard", {
        get: function () {
            return this._enableKeyboard;
        },
        set: function (value) {
            var _this = this;
            this._enableKeyboard = value;
            if (!value) {
                setTimeout(function () { _this.enableKeyboard = true; }, this.delayKeyboard);
            }
        },
        enumerable: true,
        configurable: true
    });
    BingoGameToolbar.prototype.quickPlay = function () {
        if (!this.enableKeyboard || this.autoPlaying)
            return;
        if (this.playBtn.enabled && this.playBtn.visible) {
            BingoMachine.sendCommand(GameCommands.play);
            this.enableKeyboard = false;
        }
        else if (this.playContainer.visible && this.stopBtn.enabled && this.stopBtn.visible) {
            BingoMachine.sendCommand(GameCommands.stop);
            this.enableKeyboard = false;
        }
        else if (this.extraContainer.visible && this.bigExtraBtn.enabled && this.bigExtraBtn.visible) {
            BingoMachine.sendCommand(GameCommands.extra);
            this.enableKeyboard = false;
        }
    };
    BingoGameToolbar.prototype.enabledStopButton = function () {
        this.stopBtn.enabled = false;
    };
    BingoGameToolbar.prototype.megeExtraOnTop = function (megaOnTop) {
        this.superExtraBtn.visible = megaOnTop;
        this.bigExtraBtn.visible = !megaOnTop;
    };
    BingoGameToolbar.prototype.updateCoinsAndDinero = function (coins, dinero) {
        TweenerTool.tweenTo(this, { coins: coins, dinero: dinero }, 335);
    };
    BingoGameToolbar.prototype.updateXp = function (xp) {
        this.xpBar.updateXp(xp);
    };
    BingoGameToolbar.prototype.startAuto = function () {
        BingoMachine.sendCommand(GameCommands.startAuto);
    };
    Object.defineProperty(BingoGameToolbar.prototype, "coins", {
        get: function () {
            return this._coins;
        },
        set: function (value) {
            this._coins = value;
            this.coinsText.setText(Utils.formatCoinsNumber(Math.floor(value)));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BingoGameToolbar.prototype, "dinero", {
        get: function () {
            return this._dinero;
        },
        set: function (value) {
            this._dinero = value;
            this.dineroText.setText(Utils.formatCoinsNumber(Math.floor(value)));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BingoGameToolbar.prototype, "win", {
        get: function () {
            return this._win;
        },
        set: function (value) {
            this._win = value;
            if (value)
                this.winText.setText(Utils.formatCoinsNumber(Math.floor(value)));
            else
                this.winText.setText("");
        },
        enumerable: true,
        configurable: true
    });
    BingoGameToolbar.prototype.onLevelUpBonus = function (event) {
        var bonus = event.data;
        var ev = new egret.Event(XpBar.LEVEL_UP_BONUS);
        ev.data = bonus;
        this.dispatchEvent(ev);
    };
    BingoGameToolbar.prototype.updateFreeSpinCount = function (freeSpinCount) {
        this.freeSpinBtn.setFreeCount(freeSpinCount);
    };
    BingoGameToolbar.prototype.updateMissionData = function (value, target, id) {
        this.missionBar.updateMissionData(value, target, id);
    };
    BingoGameToolbar.toolBarY = 900;
    return BingoGameToolbar;
}(egret.DisplayObjectContainer));
__reflect(BingoGameToolbar.prototype, "BingoGameToolbar");
var FreeSpinButton = (function (_super) {
    __extends(FreeSpinButton, _super);
    function FreeSpinButton() {
        var _this = _super.call(this, "bingoGameToolbar_json.FreeSpin", "bingoGameToolbar_json.FreeSpin") || this;
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.freeSpinClick, _this);
        _this.enabled = true;
        Com.addBitmapAt(_this, "bingoGameToolbar_json.FREE_" + MuLang.language, 17, 23);
        Com.addBitmapAt(_this, "bingoGameToolbar_json.free spin icon", 0, 108);
        _this.freeCountLeftTx = Com.addLabelAt(_this, 120, 125, 135, 56, 56);
        return _this;
    }
    FreeSpinButton.prototype.freeSpinClick = function (event) {
        BingoMachine.sendCommand(GameCommands.play);
        this.visible = false;
    };
    FreeSpinButton.prototype.setFreeCount = function (freeCount) {
        this.visible = Boolean(freeCount);
        this.freeCountLeftTx.setText("X " + freeCount);
    };
    return FreeSpinButton;
}(TouchDownButton));
__reflect(FreeSpinButton.prototype, "FreeSpinButton");
var GameToolbarMaskButton = (function (_super) {
    __extends(GameToolbarMaskButton, _super);
    function GameToolbarMaskButton(assetsString, textColor) {
        var _this = _super.call(this, assetsString, assetsString) || this;
        _this.stayTime = 2500;
        _this.moveTime = 800;
        _this.maskBit = Com.addBitmapAt(_this, assetsString, 0, 0);
        _this.mask = _this.maskBit;
        _this.scrollLayer = new egret.DisplayObjectContainer;
        _this.addChild(_this.scrollLayer);
        _this.textColor = textColor;
        return _this;
    }
    GameToolbarMaskButton.prototype.addButtonBigText = function (size, text) {
        this.buildBigText(size, text);
        var txt = this.buildBigText(size, text);
        txt.y = -this.mask.height * 2;
    };
    GameToolbarMaskButton.prototype.buildBigText = function (size, text) {
        var txt = Com.addLabelAt(this.scrollLayer, 10, 0, this.width - 20, this.mask.height, size);
        txt.fontFamily = "Righteous";
        txt.textColor = this.textColor;
        txt.setText(MuLang.getText(text, MuLang.CASE_UPPER));
        return txt;
    };
    GameToolbarMaskButton.prototype.addButtonSmallText = function (size) {
        this.priceText = this.buildBigText(size, "");
        this.priceText.y = -150;
        this.freeText = this.buildBigText(size, "free");
        this.freeText.y = -175;
        this.freeText.visible = false;
    };
    GameToolbarMaskButton.prototype.setIcon = function (assetName) {
        this.icon = Com.addBitmapAt(this.scrollLayer, "bingoGameToolbar_json." + assetName, 0, 0);
        this.icon.x = this.maskBit.width - this.icon.width >> 1;
        this.icon.y = -87 - this.icon.height;
    };
    GameToolbarMaskButton.prototype.setPrice = function (price) {
        this.priceText.setText(price + "");
        egret.Tween.removeTweens(this.scrollLayer);
        this.scrollLayer.y = 0;
        TweenerTool.tweenTo(this.scrollLayer, { y: this.maskBit.height }, this.moveTime, this.stayTime, this.extraStep1.bind(this), null, egret.Ease.backInOut);
        this.icon.visible = this.priceText.visible = price > 0;
        this.freeText.visible = !this.icon.visible;
    };
    GameToolbarMaskButton.prototype.extraStep1 = function () {
        TweenerTool.tweenTo(this.scrollLayer, { y: this.maskBit.height * 2 }, this.moveTime, this.stayTime, this.extraStep2.bind(this), null, egret.Ease.backInOut);
    };
    GameToolbarMaskButton.prototype.extraStep2 = function () {
        this.scrollLayer.y = 0;
        TweenerTool.tweenTo(this.scrollLayer, { y: this.maskBit.height }, this.moveTime, this.stayTime, this.extraStep1.bind(this), null, egret.Ease.backInOut);
    };
    return GameToolbarMaskButton;
}(TouchDownButton));
__reflect(GameToolbarMaskButton.prototype, "GameToolbarMaskButton");
var Topbar = (function (_super) {
    __extends(Topbar, _super);
    function Topbar() {
        var _this = _super.call(this) || this;
        Com.addBitmapAt(_this, "topbar_json.buy_bg", 742, 0);
        _this.backToLobbyBtn = Com.addDownButtonAt(_this, "topbar_json.home", "topbar_json.home_press", 0, 14, _this.onButtonClick, true);
        _this.menuBtn = Com.addDownButtonAt(_this, "topbar_json.hamburger", "topbar_json.hamburger", 1908, 14, _this.onButtonClick, true);
        _this.bankBtn = Com.addDownButtonAt(_this, "topbar_json.buy-btn", "topbar_json.buy-btn", 793, 5, _this.onButtonClick, false);
        var txt = Com.addLabelAt(_this, 10, 10, 390, 80, 48);
        _this.bankBtn.addChild(txt);
        txt.fontFamily = "Righteous";
        txt.stroke = 2;
        txt.strokeColor = 0;
        txt.setText(MuLang.getText("bank", MuLang.CASE_UPPER));
        _this.cacheAsBitmap = true;
        return _this;
    }
    Topbar.prototype.onButtonClick = function (event) {
        if (event.target == this.backToLobbyBtn) {
            document.location.href = "../lobby";
        }
        else if (event.target == this.menuBtn) {
            var bingoGame = this.parent;
            bingoGame.stopAutoPlay();
            bingoGame.dispatchEvent(new egret.Event("showGameSettings"));
        }
    };
    return Topbar;
}(egret.DisplayObjectContainer));
__reflect(Topbar.prototype, "Topbar");
var XpBar = (function (_super) {
    __extends(XpBar, _super);
    function XpBar() {
        var _this = _super.call(this) || this;
        _this.levelUpRecord = {};
        Com.addBitmapAt(_this, "bingoGameToolbar_json.xp", 0, 0);
        _this.xpProccessUI = Com.addBitmapAt(_this, "bingoGameToolbar_json.xp_filling", 17, 11);
        _this.starUI = Com.addBitmapAtMiddle(_this, "bingoGameToolbar_json.Group-22", 21, 22);
        _this.levelTx = Com.addLabelAt(_this, -5, 11, 50, 20, 20, true);
        _this.levelTx.bold = true;
        _this.levelTx.strokeColor = 0x888888;
        _this.xpProccessTx = Com.addLabelAt(_this, 75, 20, 225, 32, 32, true);
        _this.xpProccessTx.bold = true;
        _this.level = PlayerConfig.player("score.level");
        _this.thisLevelXp = PlayerConfig.player("score.this_level_xp");
        _this.nextLevelXp = PlayerConfig.player("score.next_level_xp");
        _this.levelTx.setText("" + _this.level);
        _this.xpProccess = 0;
        _this.updateXp(PlayerConfig.player("score.xp"));
        return _this;
    }
    Object.defineProperty(XpBar.prototype, "xpProccess", {
        get: function () {
            return this._xpProccess;
        },
        set: function (value) {
            this._xpProccess = value;
            this.xpProccessTx.text = (value * 100).toFixed(1) + "%";
            this.xpProccessUI.mask = new egret.Rectangle(0, 0, value * this.xpProccessUI.width, this.xpProccessUI.height);
        },
        enumerable: true,
        configurable: true
    });
    XpBar.prototype.updateXp = function (xp) {
        this.currentXp = xp;
        var xpProccessNum = (this.currentXp - this.thisLevelXp) / (this.nextLevelXp - this.thisLevelXp);
        if (xpProccessNum >= 1) {
            this.levelUp();
            xpProccessNum = 1;
        }
        else if (xpProccessNum < 0)
            xpProccessNum = 0;
        TweenerTool.tweenTo(this, { xpProccess: xpProccessNum }, 330);
        LocalDataManager.updatePlayerData("score.xp", xp);
    };
    XpBar.prototype.levelUp = function () {
        if (!this.levelUpRecord[this.level + ""]) {
            this.levelUpRecord[this.level + ""] = true;
            // send level up request
            this.sendCollectBonusRequest(BingoMachine.currentGameId, GameData.currentBet);
            return true;
        }
    };
    XpBar.prototype.sendCollectBonusRequest = function (gameID, currentBet) {
        var requestData = { json: JSON.stringify({ "bonus_type": "level_up", "seed": new Date().valueOf(), "debug": {}, "fb": PlayerConfig.player("facebook.id"), "current_bet": currentBet, "machineId": gameID, "level": this.level, "game_id": gameID }) };
        new DataServer().getDataFromUrl(PlayerConfig.config("http") + "://" + PlayerConfig.config("host") + "/cmd.php?action=update_user_bonus", this.collectRequestSuccess.bind(this), this, true, requestData, this.collectRequestFailed);
    };
    /**
     * collect bonus request success
     **/
    XpBar.prototype.collectRequestSuccess = function (data) {
        if (typeof data === "undefined" || data === null)
            return;
        data = typeof (data) === "string" ? JSON.parse(data) : data;
        var level = Number(data["level"]);
        // refresh toolbar level and xp progress
        this.thisLevelXp = Number(data["this_level_xp"]);
        this.nextLevelXp = Number(data["next_level_xp"]);
        this.level = level;
        this.levelTx.setText("" + level);
        this.updateXp(Number(data["xp"]));
        var loyalty = data["loyalty_point"] - Number(PlayerConfig.player("loyalty.loyalty_point"));
        //playerData
        var datas = [];
        datas[0] = { key: "score.level", value: level };
        datas[1] = { key: "score.this_level_xp", value: this.thisLevelXp };
        datas[2] = { key: "score.next_level_xp", value: this.nextLevelXp };
        datas[3] = { key: "levelMultiplier", value: data["levelMultiplier"] };
        datas[4] = { key: "chipsLevelMultiplier", value: data["chipsLevelMultiplier"] };
        datas[5] = { key: "levelMultiplierPuzzle", value: data["levelMultiplierPuzzle"] };
        datas[6] = { key: "loyalty.loyalty_point", value: data["loyalty_point"] };
        LocalDataManager.updatePlayerDatas(datas);
        //mexBet
        var maxBet = Number(data["user_max_bet"]);
        if (GameData.maxBet < maxBet)
            GameData.bets.push(maxBet);
        // LevelUp.targetCoins = data["coins"];
        var bonuses = data["bonuses"];
        var bonus = 0;
        if (typeof bonuses !== "undefined" && bonuses !== null) {
            for (var i = 0; i < bonuses.length; i++) {
                bonus += Number(bonuses[i]["level_up_bonus"]);
            }
        }
        this.showBonusAndLoyalty(bonus, loyalty);
        // if (Lobby.getInstance()) Lobby.getInstance().unlockMission();
        // check have someone game unlock?
        // if (unlockedGameID.length > 0) {
        // 	UnlockGame.gameID = unlockedGameID[0];
        // 	Trigger.insertInstance(new UnlockGame());
        // }
        // data["reward_items"]
    };
    /**
     * collect bonus request failed
     **/
    XpBar.prototype.collectRequestFailed = function (data) {
        console.log("collect bonus request failed!");
    };
    XpBar.prototype.showBonusAndLoyalty = function (bonus, loyalty) {
        var bt = new egret.DisplayObjectContainer;
        var btContainer = new egret.DisplayObjectContainer;
        this.addChildAt(btContainer, 0);
        Com.addObjectAt(btContainer, bt, 0, 0);
        bt.touchEnabled = true;
        var bg = Com.addBitmapAt(bt, "bingoGameToolbar_json.BB_star_open_bg", 0, 0);
        bg.width = 300;
        bg.height = 350;
        var wbg1 = Com.addBitmapAt(bt, "bingoGameToolbar_json.BB_star_benefit_bg", 17, 60);
        wbg1.height = 135;
        var wbg2 = Com.addBitmapAt(bt, "bingoGameToolbar_json.BB_star_benefit_bg", 17, 196);
        wbg2.height = 135;
        Com.addBitmapAt(bt, "bingoGameToolbar_json.loyalty_points_icon", 60, 90);
        var lp = Com.addTextAt(bt, 135, 90, 140, 74, 52);
        lp.verticalAlign = "middle";
        lp.textAlign = "left";
        lp.text = "+" + Math.round(loyalty);
        var tip = Com.addLabelAt(bt, 27, 220, 240, 28, 28);
        tip.setText(MuLang.getText("level_up_bonus"));
        var coins = Com.addLabelAt(bt, 17, 265, 260, 36, 36);
        coins.setText("" + Math.round(bonus));
        TweenerTool.tweenTo(bt, { y: -350 }, 600, 0, this.btBack.bind(this, bt, btContainer, bonus));
        btContainer.mask = new egret.Rectangle(0, -350, 300, 350);
    };
    XpBar.prototype.btBack = function (bt, btContainer, bonus) {
        TweenerTool.tweenTo(bt, { y: 0 }, 600, 1000, MDS.removeSelf.bind(this, btContainer));
        var ev = new egret.Event(XpBar.LEVEL_UP_BONUS);
        ev.data = bonus;
        this.dispatchEvent(ev);
        if (this.stage) {
            var flyCoins = new FlyingCoins();
            flyCoins.fly(10, new egret.Point(730, 435), new egret.Point(350, 520), new egret.Point(400, 300), 0.15, 0.1, 0.3);
            this.stage.addChild(flyCoins);
        }
    };
    XpBar.LEVEL_UP_BONUS = "levelUpBonus";
    return XpBar;
}(egret.DisplayObjectContainer));
__reflect(XpBar.prototype, "XpBar");
var GoldTounamentLayer = (function (_super) {
    __extends(GoldTounamentLayer, _super);
    function GoldTounamentLayer(data) {
        return _super.call(this, data) || this;
    }
    return GoldTounamentLayer;
}(TounamentLayer));
__reflect(GoldTounamentLayer.prototype, "GoldTounamentLayer");
var TounamentChampoin = (function (_super) {
    __extends(TounamentChampoin, _super);
    function TounamentChampoin() {
        return _super.call(this) || this;
    }
    TounamentChampoin.prototype.clearUI = function () {
        this.removeChildren();
    };
    TounamentChampoin.prototype.show = function (user) {
        var headBg = Com.addBitmapAt(this, "tounament_json.head_bg", 10, 0);
        var headUI = Com.addBitmapAt(this, "tounament_json.avatar", 11, 1);
        headUI.width = 63;
        headUI.height = 63;
        if (user.networkLogins[0].network == "facebook") {
            FacebookBitmap.downloadBitmapDataByFacebookID(user.networkLogins[0].id, 50, 50, MDS.onUserHeadLoaded.bind(this, headUI, 63), this);
        }
        var shieldBitmap = Com.addBitmapAt(this, "tounament_json.Top3_1st_sheild", 90, 0);
        shieldBitmap.width = 35;
        shieldBitmap.height = 35;
        var rankTx = Com.addLabelAt(this, 128, 0, 88, 30, 28);
        rankTx.textAlign = "right";
        rankTx.text = "#1";
        rankTx.filters = [new egret.DropShadowFilter()];
        var ptsTx = Com.addLabelAt(this, 87, 48, 100, 20, 20);
        ptsTx.textAlign = "left";
        ptsTx.text = "PTS:";
        var scoreTx = Com.addLabelAt(this, 87 + ptsTx.textWidth, 48, 129 - ptsTx.textWidth, 20, 20);
        scoreTx.textAlign = "right";
        scoreTx.setText(Utils.formatCoinsNumber(user.coinsEarn));
        ptsTx.size = scoreTx.size;
    };
    return TounamentChampoin;
}(egret.DisplayObjectContainer));
__reflect(TounamentChampoin.prototype, "TounamentChampoin");
var V2Game = (function (_super) {
    __extends(V2Game, _super);
    function V2Game(gameConfigFile, configUrl, gameId) {
        var _this = _super.call(this, gameConfigFile, configUrl, gameId) || this;
        _this.tokenObject["key"] = "iniciar";
        _this.tokenObject["value"]["token"] = "undefined";
        return _this;
    }
    V2Game.prototype.extraUIShowNumber = function () {
        this.extraUIObject.visible = true;
        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.runningBallContainer.x = this.extraUIObject.x;
        this.runningBallContainer.y = this.extraUIObject.y;
        this.addChildAt(this.runningBallContainer, this.getChildIndex(this.extraUIObject));
        Com.addObjectAt(this.runningBallContainer, this.extraUIObject, 0, 0);
        this.extraUIObject = this.runningBallContainer;
    };
    /*******************************************************************************************************/
    V2Game.prototype.getNumberOnCard = function (cardIndex, gridIndex) {
        var num = GameCardUISettings.numberAtCard(cardIndex, gridIndex);
        CardManager.getBall(num);
    };
    V2Game.prototype.getBuffInfoIndex = function (buffInfo) {
        for (var i = 0; i < buffInfo.length; i++) {
            if (buffInfo[i]["buffBet"] == GameData.currentBet) {
                return i;
            }
        }
        return -1;
    };
    return V2Game;
}(BingoMachine));
__reflect(V2Game.prototype, "V2Game");
var TounamentUserItem = (function (_super) {
    __extends(TounamentUserItem, _super);
    function TounamentUserItem(user, rank, isMe) {
        var _this = _super.call(this) || this;
        _this.anchorOffsetY = 70;
        var bg = Com.addBitmapAt(_this, isMe ? "tounament_json.own_bg" : "tounament_json.player_bg", 0, 0);
        bg.width = 235;
        bg.height = 140;
        var headBg = Com.addBitmapAt(_this, "tounament_json.head_bg", 10, 17);
        headBg.width = 104;
        headBg.height = 104;
        var headUI = Com.addBitmapAt(_this, "tounament_json.avatar", 12, 19);
        headUI.width = 100;
        headUI.height = 100;
        if (user.networkLogins[0].network == "facebook") {
            FacebookBitmap.downloadBitmapDataByFacebookID(user.networkLogins[0].id, 100, 100, MDS.onUserHeadLoaded.bind(_this, headUI, 100), _this);
        }
        if (rank <= 3) {
            var shieldName = _this.addChildShield(rank);
            if (shieldName) {
                var shieldBitmap = Com.addBitmapAt(_this, "tounament_json." + shieldName, 152, 6);
                shieldBitmap.width = 69;
                shieldBitmap.height = 73;
            }
        }
        else {
            var tx = Com.addLabelAt(_this, 152, 28, 69, 40, 40);
            tx.textAlign = "left";
            tx.setText("#" + rank);
            tx.filters = [new egret.DropShadowFilter()];
        }
        var ptsTx = Com.addLabelAt(_this, 120, 85, 100, 22, 22);
        ptsTx.textAlign = "right";
        ptsTx.text = "PTS";
        var scoreTx = Com.addLabelAt(_this, 120, 115, 100, 20, 20);
        scoreTx.textAlign = "right";
        scoreTx.setText(Utils.formatCoinsNumber(user.coinsEarn));
        if (!isMe)
            _this.cacheAsBitmap = true;
        return _this;
    }
    TounamentUserItem.prototype.addChildShield = function (rank) {
        switch (rank) {
            case 1: return "Top3_1st_sheild";
            case 2: return "Top3_2nd_sheild";
            case 3: return "Top3_3rd_sheild";
            default: return null;
        }
    };
    return TounamentUserItem;
}(egret.DisplayObjectContainer));
__reflect(TounamentUserItem.prototype, "TounamentUserItem");

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
                // RES.getResByUrl( configUrl, this.analyse, this );
                RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, _this.analyse, _this);
                RES.loadConfig("../data.res.json", configUrl.replace("data.res.json", "resource/"));
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
    GenericModal.prototype.analyse = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.analyse, this);
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
var mouse = (function () {
    function mouse() {
    }
    mouse.setButtonMode = function (a) {
    };
    return mouse;
}());
__reflect(mouse.prototype, "mouse");
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
        LanguageBar.instance = _this;
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
                    LanguageBar.changeIndex = i;
                    this.showConfirm();
                }
                break;
            }
        }
    };
    LanguageBar.prototype.showConfirm = function () {
        this.dispatchEvent(new egret.Event("showConfirm"));
    };
    LanguageBar.confirmChange = function () {
        MuLang.language = this.instance.languageArr[this.changeIndex];
        window.location.reload();
    };
    return LanguageBar;
}(egret.Sprite));
__reflect(LanguageBar.prototype, "LanguageBar");
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
            var properties = localStorage.getItem("user_account_info");
            if (properties.indexOf("login_type=custom") >= 0 || properties.indexOf("login_type=guest") >= 0) {
                properties += "&uid=" + PlayerConfig.player("user.id");
            }
            properties = properties.replace("login_type", "network");
            return properties;
        },
        enumerable: true,
        configurable: true
    });
    PlayerConfig.serverVertion = 2;
    PlayerConfig.playerConfig = { "user.id": requestStr("id"), "score.level": 2538,
        "score.this_level_xp": 2500, "score.next_level_xp": 3500,
        "user_info.preferences": [], "user_info.preferences_answer": [], "settings.lang": "en",
        "mission": { "task_is_process": "0", "unlock_level": 10, "task": { "387285": { "is_active": "1", "type": "1", "current": "1", "target": "2", "id": "387285", "bet_limit": -1 }, "387286": { "is_active": "0", "type": "1", "current": "1", "target": "6", "id": "387286" }, "387287": { "is_active": "0", "type": "1", "current": "0", "target": "15", "id": "387287" } }, "score_info": { "score_is_process": "0" } }, "mission.unlock_level": 3000, "loyalty.loyalty_level": 4, "facebook.email": "a@b.com",
        "score.coins": 10, "score.chips": 10, "score.xp": 10, "score": { "next_level_xp": 15, "this_level_xp": 5 } };
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
var BankProductItem = (function (_super) {
    __extends(BankProductItem, _super);
    function BankProductItem() {
        var _this = _super.call(this) || this;
        _this.touchChildren = false;
        _this.touchEnabled = true;
        return _this;
    }
    return BankProductItem;
}(egret.DisplayObjectContainer));
__reflect(BankProductItem.prototype, "BankProductItem");
var CollectHourlyBonusBar = (function (_super) {
    __extends(CollectHourlyBonusBar, _super);
    function CollectHourlyBonusBar() {
        return _super.call(this) || this;
    }
    CollectHourlyBonusBar.prototype.timerStaus = function (time, status) {
    };
    return CollectHourlyBonusBar;
}(egret.DisplayObjectContainer));
__reflect(CollectHourlyBonusBar.prototype, "CollectHourlyBonusBar");
var ConFirmBar = (function (_super) {
    __extends(ConFirmBar, _super);
    function ConFirmBar(size) {
        var _this = _super.call(this) || this;
        GraphicTool.drawRect(_this, new egret.Rectangle(-size.x >> 1, -size.y >> 1, size.x + 100, size.y), 0, false, 0.0);
        _this.touchEnabled = true;
        var barBg = Com.addBitmapAt(_this, "gameSettings_json.bg_popup", -610, -320);
        barBg.scale9Grid = new egret.Rectangle(60, 60, 911, 706);
        barBg.width = 1110;
        barBg.height = 535;
        var title = Com.addLabelAt(_this, 100 - 610, 75 - 320, 910, 72, 72, false, true);
        title.text = MuLang.getText("change_language");
        var tip = Com.addLabelAt(_this, 100 - 610, 200 - 320, 910, 100, 48);
        tip.setText(MuLang.getText("change_language_tip"));
        var btn1 = Com.addDownButtonAt(_this, "gameSettings_json.OK", "gameSettings_json.OK", 125 - 610, 370 - 320, _this.closeThisBar.bind(_this), true);
        var btTx1 = Com.addTextAt(_this, 0, 0, 20, 55, 55);
        btTx1.fontFamily = "Righteous";
        btTx1.text = MuLang.getText("cancel");
        btn1.setButtonText(btTx1);
        var btn2 = Com.addDownButtonAt(_this, "gameSettings_json.OK", "gameSettings_json.OK", 5, 370 - 320, _this.confirmChange.bind(_this), true);
        var btTx2 = Com.addTextAt(_this, 0, 0, 20, 55, 55);
        btTx2.fontFamily = "Righteous";
        btTx2.text = MuLang.getText("confirm");
        btn2.setButtonText(btTx2);
        return _this;
    }
    ConFirmBar.prototype.closeThisBar = function () {
        if (this.parent)
            this.parent.removeChild(this);
    };
    ConFirmBar.prototype.confirmChange = function (event) {
        LanguageBar.confirmChange();
    };
    return ConFirmBar;
}(egret.Sprite));
__reflect(ConFirmBar.prototype, "ConFirmBar");
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
        var button0 = Com.addDownButtonAt(this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.logout.bind(this), true);
        this.addButtonText(button0, "logout");
        var playType = this.getPlayerType();
        var itemIndex = 0;
        this.addItem(itemIndex++, "avatar", MuLang.getText(playType, MuLang.CASE_UPPER) + ":   " + PlayerConfig.player(playType == "user_id" ? "user.id" : playType), button0);
        if (playType == "facebook_id")
            this.getFacebookAvatar();
        var button1 = Com.addDownButtonAt(this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.showLangugeBar.bind(this), true);
        Com.addBitmapAtMiddle(button1, "gameSettings_json.flag_" + MuLang.language, button1.width >> 1, button1.height >> 1);
        Com.addBitmapAtMiddle(button1, "gameSettings_json.btn_arrow", button1.width - 45, button1.height >> 1);
        this.addItem(itemIndex++, "language_icon", "language", button1, 5);
        if (PlayerConfig.properties.indexOf("network=facebook") < 0) {
            var bt2Container = new egret.DisplayObjectContainer;
            var button2_1 = Com.addDownButtonAt(bt2Container, "gameSettings_json.gl_bt_settings", "gameSettings_json.gl_bt_settings", 380, 18, this.gotoLoginPage.bind(this), true);
            var button2_2 = Com.addDownButtonAt(bt2Container, "gameSettings_json.fb_bt_settings", "gameSettings_json.fb_bt_settings", 700, 18, this.gotoLoginPage.bind(this), true);
            this.addLoginButtonText(button2_1, "login");
            this.addLoginButtonText(button2_2, "login");
            this.addItem(itemIndex++, "icon_connect", "link", bt2Container);
        }
        var button3 = Com.addDownButtonAt(this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.suport.bind(this), true);
        this.addButtonText(button3, "contact");
        this.addItem(itemIndex++, "support_icon", "support", button3, 5);
        var button4 = Com.addDownButtonAt(this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.rateStar.bind(this), true);
        this.addButtonText(button4, "rate_us");
        this.addItem(itemIndex++, "rate_icon", "rate_us", button4, 5);
        this.soundEffectBtn = new SettingsCheckbox(this.soundEffectChange.bind(this));
        this.soundEffectBtn.RadioOn = SoundManager.soundEfOn;
        this.addItem(itemIndex++, "sound_fx_icon", "sound_effect_on", this.soundEffectBtn, 5);
        this.musicBtn = new SettingsCheckbox(this.musicChange.bind(this));
        this.musicBtn.RadioOn = SoundManager.soundOn;
        this.addItem(itemIndex++, "music_icon", "music_on", this.musicBtn, 5);
        this.visualEffectBtn = new SettingsCheckbox(this.visualEffectChange.bind(this));
        this.visualEffectBtn.RadioOn = GameSettings.visualEffectOn;
        this.addItem(itemIndex++, "visual_fx_icon", "effect_on", this.visualEffectBtn, 5);
        this.notificationBtn = new SettingsCheckbox(this.notificationChange.bind(this));
        this.notificationBtn.RadioOn = GameSettings.notificationOn;
        this.addItem(itemIndex++, "icon_notification", MuLang.getText("notification"), this.notificationBtn, 5);
    };
    GameSettingPopup.prototype.getFacebookAvatar = function () {
        var a = this.scrollBar.getChildAt(0);
        var bit = a.getChildAt(1);
        FacebookBitmap.downloadBitmapDataByFacebookID(PlayerConfig.player("facebook.id"), 100, 100, MDS.onUserHeadLoaded.bind(this, bit, 100), this);
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
        this.languageBar.addEventListener("showConfirm", this.showConfirm, this);
        Com.addObjectAt(this.scrollBar, this.languageBar, 708, 280);
    };
    GameSettingPopup.prototype.logout = function () {
        localStorage.removeItem("player");
        localStorage.removeItem("user_account_info");
        window.location.href = "/";
    };
    GameSettingPopup.prototype.showLangugeBar = function () {
        this.languageBar.visible = !this.languageBar.visible;
    };
    GameSettingPopup.prototype.gotoLoginPage = function () {
        this.logout();
    };
    GameSettingPopup.prototype.suport = function () {
        Com.addObjectAt(this, new SupportBar(new egret.Point(this.bg.width, this.bg.height)), this.bg.width >> 1, this.bg.height >> 1);
    };
    GameSettingPopup.prototype.rateStar = function () {
        Com.addObjectAt(this, new RateBar(new egret.Point(this.bg.width, this.bg.height)), this.bg.width >> 1, this.bg.height >> 1);
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
    GameSettingPopup.prototype.showConfirm = function () {
        Com.addObjectAt(this, new ConFirmBar(new egret.Point(this.bg.width, this.bg.height)), this.bg.width >> 1, this.bg.height >> 1);
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
var RateBar = (function (_super) {
    __extends(RateBar, _super);
    function RateBar(size) {
        var _this = _super.call(this) || this;
        GraphicTool.drawRect(_this, new egret.Rectangle(-size.x >> 1, -size.y >> 1, size.x + 100, size.y), 0, false, 0.0);
        _this.touchEnabled = true;
        _this.langResource = "rate_us_json";
        _this.bg = Com.addBitmapAtMiddle(_this, _this.langResource + ".M", 0, 0);
        var title = MDS.addGameText(_this, -370, -260, 48, 0x222222, "rate_us_now", false, 740, "", 1);
        title.textAlign = "center";
        title.text = title.text.toUpperCase();
        var tip = MDS.addGameText(_this, -370, -180, 35, 0x555555, "how_to_rate", false, 740, "", 1);
        tip.textAlign = "center";
        Com.addBitmapAt(_this, _this.langResource + ".doctor", 100, -130);
        _this.stars = [];
        _this.goldStars = [];
        for (var i = 0; i < 5; i++) {
            _this.stars[i] = Com.addDownButtonAt(_this, _this.langResource + ".Star_b", _this.langResource + ".Star_b", -290 + i * 115, -120, _this.rate.bind(_this), true);
            _this.stars[i].name = "" + i;
            _this.goldStars[i] = Com.addBitmapAt(_this, _this.langResource + ".Star", -290 + i * 115, -120);
            _this.goldStars[i].visible = false;
        }
        _this.closeBtn = Com.addDownButtonAt(_this, _this.langResource + ".roomCloseButton", _this.langResource + ".roomCloseButton", _this.bg.width >> 1, -_this.bg.height >> 1, _this.closeThisBar.bind(_this), true);
        _this.closeBtn.x -= _this.closeBtn.width;
        return _this;
    }
    RateBar.prototype.rate = function (event) {
        var currentBtn = event.target;
        var index = Number(currentBtn.name);
        for (var i = 0; i < 5; i++) {
            this.stars[i].enabled = false;
            if (i <= index)
                this.goldStars[i].visible = true;
        }
        this.dealWithIndex(index);
    };
    RateBar.prototype.closeThisBar = function () {
        if (this.parent)
            this.parent.removeChild(this);
    };
    RateBar.prototype.dealWithIndex = function (index) {
        if (index < 3)
            this.showOkButton();
        else
            setTimeout(this.delayOpenWindow.bind(this), 300);
    };
    RateBar.prototype.delayOpenWindow = function () {
        this.closeThisBar();
        if (Math.random() > 0.5)
            window.open("https://itunes.apple.com/app/doctor-bingo-free-bingo-slots/id1152226735");
        else
            window.open("https://play.google.com/store/apps/details?id=com.gamesmartltd.doctorbingo");
    };
    RateBar.prototype.showOkButton = function () {
        var btn = Com.addDownButtonAt(this, this.langResource + ".BUY COINS", this.langResource + ".BUY COINS", -132, 150, this.closeThisBar.bind(this), true);
        var btnTx = Com.addTextAt(this, 0, 0, 40, 40, 50, false, true);
        btn.setButtonText(btnTx);
        btnTx.textColor = 0;
        btnTx.text = "OK";
    };
    return RateBar;
}(egret.Sprite));
__reflect(RateBar.prototype, "RateBar");
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
var SupportBar = (function (_super) {
    __extends(SupportBar, _super);
    function SupportBar(size) {
        var _this = _super.call(this) || this;
        GraphicTool.drawRect(_this, new egret.Rectangle(-size.x >> 1, -size.y >> 1, size.x + 100, size.y), 0, false, 0.0);
        _this.touchEnabled = true;
        _this.langResource = "support_json";
        _this.email = PlayerConfig.player("facebook.email") || PlayerConfig.player("user_info.email") || "";
        _this.buildBg();
        _this.buildTitleText();
        _this.buildSupportText();
        _this.buildSupportBtn();
        _this.buildCloseBtn();
        return _this;
    }
    SupportBar.prototype.buildBg = function () {
        this.bg = Com.addBitmapAt(this, this.langResource + ".popup_bg_big", -623, -377);
        this.bg.scale9Grid = new egret.Rectangle(40, 40, 569, 609);
        this.bg.width = 1247;
        this.bg.height = 755;
    };
    SupportBar.prototype.buildTitleText = function () {
        // top title
        var topTitle = Com.addTextAt(this, 85 - 623, 28 - 377, 432, 88, 64, true, false);
        topTitle.fontFamily = "TCM_conden";
        topTitle.textAlign = "left";
        topTitle.verticalAlign = "middle";
        topTitle.bold = true;
        topTitle.stroke = 4;
        topTitle.textColor = 0xD0C39D;
        topTitle.strokeColor = 0xC9A947;
        topTitle.text = MuLang.getText("e_support", MuLang.CASE_UPPER);
        // top text input
        var topTextContainer = new egret.DisplayObjectContainer();
        Com.addObjectAt(this, topTextContainer, 185 - 623, 115 - 377);
        // top text bg
        var topTextBg = Com.addBitmapAt(topTextContainer, this.langResource + ".select_box", 0, 0);
        topTextBg.scale9Grid = new egret.Rectangle(11, 11, 27, 27);
        topTextBg.width = 980;
        topTextBg.height = 83;
        // top text input
        this.topTextInput = new eui.EditableText();
        Com.addObjectAt(topTextContainer, this.topTextInput, 20, 0);
        this.topTextInput.width = 940;
        this.topTextInput.height = 83;
        this.topTextInput.size = 48;
        // this.topTextInput.textAlign = "left";
        this.topTextInput.verticalAlign = "middle";
        this.topTextInput.fontFamily = "TCM_conden";
        this.topTextInput.bold = true;
        this.topTextInput.textColor = 0xFFFFFF;
        this.topTextInput.text = this.email;
        this.topTextInput.prompt = MuLang.getText("email", MuLang.CASE_UPPER);
        // talk icon
        Com.addBitmapAt(this, this.langResource + ".icon_zendesk", 90 - 623, 118 - 377);
    };
    SupportBar.prototype.buildSupportText = function () {
        // support text
        var supportText = Com.addTextAt(this, 84 - 623, 205 - 377, 313, 53, 42, false, false);
        supportText.fontFamily = "TCM_conden";
        supportText.textAlign = "left";
        supportText.verticalAlign = "middle";
        supportText.textColor = 0xB0881B;
        supportText.text = MuLang.getText("message", MuLang.CASE_UPPER);
        // support text input
        var supportTextContainer = new egret.DisplayObjectContainer();
        supportTextContainer.width = 1084;
        supportTextContainer.height = 445;
        Com.addObjectAt(this, supportTextContainer, 83 - 623, 258 - 377);
        // support text bg
        var supportTextBg = Com.addBitmapAt(supportTextContainer, this.langResource + ".select_box", 0, 0);
        supportTextBg.scale9Grid = new egret.Rectangle(11, 11, 27, 27);
        supportTextBg.width = 1084;
        supportTextBg.height = 445;
        // support text input
        this.supportTextInput = Com.addTextAt(supportTextContainer, 20, 20, 1044, 405, 36, false, false);
        this.supportTextInput.fontFamily = "TCM_conden";
        this.supportTextInput.textAlign = "left";
        this.supportTextInput.bold = true;
        this.supportTextInput.multiline = true;
        this.supportTextInput.wordWrap = true;
        this.supportTextInput.type = egret.TextFieldType.INPUT;
        this.supportTextInput.textColor = 0xFFFFFF;
    };
    SupportBar.prototype.buildSupportBtn = function () {
        // send btn container
        var sendBtnContainer = Com.addDownButtonAt(this, this.langResource + ".button_send", this.langResource + ".button_send", 1011 - 623, 586 - 377, this.sendSupport.bind(this), true);
        // support submit button text
        var sendBtnText = Com.addTextAt(this, 31, 18, 133, 90, 48, true, false);
        sendBtnText.fontFamily = "TCM_conden";
        sendBtnText.verticalAlign = "middle";
        sendBtnText.stroke = 2;
        sendBtnText.strokeColor = 0x054B05;
        sendBtnText.text = MuLang.getText("send");
        sendBtnContainer.addChild(sendBtnText);
    };
    SupportBar.prototype.buildCloseBtn = function () {
        this.closeBtn = Com.addDownButtonAt(this, this.langResource + ".button_close", this.langResource + ".button_close", this.bg.width >> 1, -this.bg.height >> 1, this.closeThisBar.bind(this), true);
        this.closeBtn.x -= this.closeBtn.width >> 1;
        this.closeBtn.y -= this.closeBtn.height >> 1;
    };
    SupportBar.prototype.buildAlertBar = function () {
        var alertBar = new egret.Sprite;
        Com.addObjectAt(this, alertBar, 0, 0);
        GraphicTool.drawRect(alertBar, new egret.Rectangle(-1000, -500, 2000, 1000), 0, false, 0.0);
        alertBar.touchEnabled = true;
        var barBg = Com.addBitmapAt(alertBar, "gameSettings_json.bg_popup", -700, -300);
        barBg.scale9Grid = new egret.Rectangle(60, 60, 911, 706);
        barBg.width = 1120;
        barBg.height = 515;
        var title = Com.addLabelAt(alertBar, -600, -220, 920, 76, 76);
        title.text = MuLang.getText("oops");
        var tip = Com.addLabelAt(alertBar, -600, -60, 920, 48, 48);
        tip.setText(MuLang.getText("enter_correct_info"));
        var dr = Com.addBitmapAt(alertBar, "gameSettings_json.dr", 300, -380);
        dr.scaleX = dr.scaleY = 1.1;
        var btn = Com.addDownButtonAt(alertBar, "gameSettings_json.OK", "gameSettings_json.OK", -325, 50, this.closeAlertBar.bind(this), true);
        var btTx = Com.addTextAt(alertBar, 0, 0, 20, 72, 72);
        btTx.text = "OK";
        btn.setButtonText(btTx);
        return alertBar;
    };
    SupportBar.prototype.closeAlertBar = function (event) {
        this.alertBar.visible = false;
    };
    SupportBar.prototype.sendSupport = function () {
        var exp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!exp.test(this.topTextInput.text)) {
            if (!this.alertBar)
                this.alertBar = this.buildAlertBar();
            this.alertBar.visible = true;
            return;
        }
        this.email = this.topTextInput.text;
        var value = this.supportTextInput.text;
        if (value !== "" && this.email !== "") {
            var XHR = eval("window.XMLHttpRequest") ? new XMLHttpRequest() : eval("new ActiveXObject('Microsoft.XMLHTTP')");
            XHR.open("post", "https://gamesmartltd.zendesk.com/api/v2/tickets.json", true);
            XHR.setRequestHeader("Accept", "application/json");
            XHR.setRequestHeader("Content-Type", "application/json");
            XHR.setRequestHeader("Authorization", "Basic YW55QGRvdXRvcmJpbmdvLmNvbTpCaW5nbzQ1NiE=");
            XHR.send(JSON.stringify({
                "ticket": {
                    "subject": value.length > 40 ? value.substring(0, 40) : value,
                    "comment": {
                        "body": value
                    },
                    "requester": {
                        "name": PlayerConfig.player("facebook.name"),
                        "email": this.email
                    },
                    tags: [
                        "canvas",
                        "userid_" + PlayerConfig.player("user.id"),
                        "level_" + PlayerConfig.player("score.level"),
                        "loyalty_level_" + PlayerConfig.player("loyalty.loyalty_level")
                    ]
                }
            }));
            egret.setTimeout(function () {
                this.buildSupportSuccessContainer();
            }, this, 2000);
        }
    };
    SupportBar.prototype.closeThisBar = function () {
        if (this.parent)
            this.parent.removeChild(this);
    };
    SupportBar.prototype.buildSupportSuccessContainer = function () {
        this.supportSuccessContainer = new egret.DisplayObjectContainer();
        Com.addObjectAt(this, this.supportSuccessContainer, -623, -377);
        // support success bg
        var successBg = Com.addBitmapAt(this.supportSuccessContainer, this.langResource + ".popup_bg_big", 0, 0);
        successBg.scale9Grid = new egret.Rectangle(40, 40, 569, 609);
        successBg.width = 1247;
        successBg.height = 755;
        // support success title
        var supportSuccessTitle = Com.addTextAt(this.supportSuccessContainer, 208, 124, 830, 127, 64, false, false);
        supportSuccessTitle.fontFamily = "TCM_conden";
        supportSuccessTitle.textColor = 0xFFFFFF;
        supportSuccessTitle.verticalAlign = "middle";
        supportSuccessTitle.text = Utils.toFirstUpperCase(MuLang.getText("FACEBOOK_WAIT_CONGRATULATIONS_TITLE"));
        // support success text
        var supportSuccessText = Com.addTextAt(this.supportSuccessContainer, 84, 294, 1079, 262, 48, false, false);
        supportSuccessText.fontFamily = "TCM_conden";
        supportSuccessText.textColor = 0xFFFFFF;
        supportSuccessText.text = MuLang.getText("support_success_text");
        this.addChild(this.closeBtn);
    };
    return SupportBar;
}(egret.Sprite));
__reflect(SupportBar.prototype, "SupportBar");
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
            var resLan = PlayerConfig.player("settings.lang") || eval("getPlayer().settings.lang");
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

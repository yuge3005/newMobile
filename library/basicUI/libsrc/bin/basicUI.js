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
var TouchDownButton = (function (_super) {
    __extends(TouchDownButton, _super);
    function TouchDownButton(upState, downState) {
        var _this = _super.call(this) || this;
        _this.upState = Com.createBitmapByName(upState);
        _this.downState = Com.createBitmapByName(downState);
        _this.addChildAt(_this.upState, 0);
        _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouchBegin, _this);
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTouchTap, _this);
        return _this;
    }
    Object.defineProperty(TouchDownButton, "isRightClick", {
        get: function () {
            return document["isRightClick"];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TouchDownButton.prototype, "enabled", {
        get: function () {
            return this.touchEnabled;
        },
        set: function (value) {
            this.touchEnabled = value;
            if (value) {
                this.filters = [];
            }
            else {
                if (this.contains(this.downState))
                    this.removeChild(this.downState);
                this.addChildAt(this.upState, 0);
                this.filters = this.disabledFilter ? [this.disabledFilter] : [MatrixTool.colorMatrix(0.5, 0.1, 1)];
            }
        },
        enumerable: true,
        configurable: true
    });
    TouchDownButton.prototype.onTouchBegin = function (event) {
        if (this.contains(this.upState))
            this.removeChild(this.upState);
        this.addChildAt(this.downState, 0);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    };
    TouchDownButton.prototype.onTouchEnd = function (event) {
        if (this.contains(this.downState))
            this.removeChild(this.downState);
        this.addChildAt(this.upState, 0);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    };
    TouchDownButton.prototype.onTouchTap = function (event) {
        if (TouchDownButton.isRightClick) {
            event.stopImmediatePropagation();
            return;
        }
        SoundManager.play("open_list_mp3");
    };
    TouchDownButton.prototype.setButtonText = function (txt) {
        txt.width = this.upState.width;
        txt.height = this.upState.height;
        txt.textAlign = "center";
        txt.verticalAlign = "middle";
        this.addChild(txt);
    };
    return TouchDownButton;
}(egret.DisplayObjectContainer));
__reflect(TouchDownButton.prototype, "TouchDownButton");
var BmpText = (function (_super) {
    __extends(BmpText, _super);
    function BmpText() {
        return _super.call(this) || this;
    }
    Object.defineProperty(BmpText.prototype, "textColor", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
            this.filters = [MatrixTool.colorMatrixPure(value)];
        },
        enumerable: true,
        configurable: true
    });
    BmpText.prototype.setText = function (str) {
        this.text = str;
    };
    return BmpText;
}(egret.BitmapText));
__reflect(BmpText.prototype, "BmpText");
/**
 * ChildObjectManager
 */
var Com = (function () {
    function Com() {
    }
    /**
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Com.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        if (!texture)
            console.error("picture " + name + " does not exist");
        result.texture = texture;
        return result;
    };
    Com.addObjectAt = function (target, obj, x, y) {
        target.addChild(obj);
        obj.x = x;
        obj.y = y;
    };
    Com.addBitmapAt = function (target, assetName, x, y) {
        var bit = this.createBitmapByName(assetName);
        this.addObjectAt(target, bit, x, y);
        return bit;
    };
    Com.addBitmapAtMiddle = function (target, assetName, x, y) {
        var bit = this.createBitmapByName(assetName);
        this.addObjectAt(target, bit, x, y);
        bit.anchorOffsetX = bit.width >> 1;
        bit.anchorOffsetY = bit.height >> 1;
        return bit;
    };
    Com.addRotateBitmapAt = function (target, assetName, x, y, duration) {
        var bit = this.addBitmapAtMiddle(target, assetName, x, y);
        egret.Tween.get(bit, { loop: true })
            .to({ rotation: 360 }, duration)
            .wait(0);
        return bit;
    };
    Com.addMovieClipAt = function (target, mcf, assetName, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var mc = new egret.MovieClip(mcf.generateMovieClipData(assetName));
        this.addObjectAt(target, mc, x, y);
        mc.play(-1);
        return mc;
    };
    Com.addTextAt = function (target, x, y, width, height, size, stroke, bold) {
        if (stroke === void 0) { stroke = false; }
        if (bold === void 0) { bold = false; }
        var tx = new egret.TextField;
        tx.width = width;
        tx.height = height;
        tx.size = size;
        tx.textAlign = "center";
        if (bold)
            tx.fontFamily = "Arial Black";
        else
            tx.fontFamily = "Arial";
        if (stroke) {
            tx.stroke = 1;
            tx.strokeColor = 0x000000;
        }
        this.addObjectAt(target, tx, x, y);
        return tx;
    };
    Com.addLabelAt = function (target, x, y, width, height, size, stroke, bold) {
        if (stroke === void 0) { stroke = false; }
        if (bold === void 0) { bold = false; }
        var tx = new TextLabel;
        tx.maxWidth = tx.width = width;
        tx.height = height;
        tx.maxSize = tx.size = size;
        tx.textAlign = "center";
        if (bold)
            tx.fontFamily = "Arial Black";
        else
            tx.fontFamily = "Arial";
        if (stroke) {
            tx.stroke = 1;
            tx.strokeColor = 0x000000;
        }
        this.addObjectAt(target, tx, x, y);
        return tx;
    };
    Com.addBitmapTextAt = function (target, fontName, x, y, textAlign, size, color) {
        if (textAlign === void 0) { textAlign = "left"; }
        if (size === void 0) { size = 0; }
        if (color === void 0) { color = 0; }
        var bmpText = new egret.BitmapText();
        bmpText.font = RES.getRes(fontName);
        bmpText.textAlign = textAlign;
        if (size) {
            bmpText.text = " ";
            bmpText.scaleX = bmpText.scaleY = size / bmpText.textHeight;
        }
        if (color > 0) {
            bmpText.filters = [MatrixTool.colorMatrixPure(color)];
        }
        this.addObjectAt(target, bmpText, x, y);
        return bmpText;
    };
    Com.addDownButtonAt = function (target, assetNormal, assetTouched, x, y, onClickCallBack, enableButton) {
        var bit = new TouchDownButton(assetNormal, assetTouched);
        this.addObjectAt(target, bit, x, y);
        bit.enabled = enableButton;
        bit.addEventListener(egret.TouchEvent.TOUCH_TAP, onClickCallBack, target);
        return bit;
    };
    return Com;
}());
__reflect(Com.prototype, "Com");
var GraphicTool = (function () {
    function GraphicTool() {
    }
    GraphicTool.drawRect = function (target, rect, color, clearFirst, alpha, roundRect, lineThick, lineColor, lineAlpha) {
        if (color === void 0) { color = 0; }
        if (clearFirst === void 0) { clearFirst = false; }
        if (alpha === void 0) { alpha = 1; }
        if (roundRect === void 0) { roundRect = 0; }
        if (lineThick === void 0) { lineThick = 0; }
        if (lineColor === void 0) { lineColor = 0; }
        if (lineAlpha === void 0) { lineAlpha = 1; }
        if (clearFirst)
            target.graphics.clear();
        if (lineThick)
            target.graphics.lineStyle(lineThick, lineColor, lineAlpha);
        target.graphics.beginFill(color, alpha);
        if (roundRect)
            target.graphics.drawRoundRect(rect.x, rect.y, rect.width, rect.height, roundRect);
        else
            target.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
        target.graphics.endFill();
    };
    GraphicTool.drawRectangles = function (target, rectangles, color, clearFirst, alpha) {
        if (color === void 0) { color = 0; }
        if (clearFirst === void 0) { clearFirst = false; }
        if (alpha === void 0) { alpha = 1; }
        if (clearFirst)
            target.graphics.clear();
        target.graphics.beginFill(color, alpha);
        for (var i = 0; i < rectangles.length; i++) {
            var rect = rectangles[i];
            target.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
        }
        target.graphics.endFill();
    };
    GraphicTool.drawCircle = function (target, center, r, color, clearFirst, alpha, lineThick, lineColor, lineAlpha) {
        if (clearFirst === void 0) { clearFirst = false; }
        if (alpha === void 0) { alpha = 1; }
        if (lineThick === void 0) { lineThick = 0; }
        if (lineColor === void 0) { lineColor = 0; }
        if (lineAlpha === void 0) { lineAlpha = 1; }
        if (clearFirst)
            target.graphics.clear();
        if (lineThick)
            target.graphics.lineStyle(lineThick, lineColor, lineAlpha);
        target.graphics.beginFill(color, alpha);
        target.graphics.drawCircle(center.x, center.y, r);
        target.graphics.endFill();
    };
    return GraphicTool;
}());
__reflect(GraphicTool.prototype, "GraphicTool");
var LongPressButton = (function (_super) {
    __extends(LongPressButton, _super);
    function LongPressButton(upState, downState) {
        return _super.call(this, upState, downState) || this;
    }
    LongPressButton.prototype.onTouchBegin = function (event) {
        _super.prototype.onTouchBegin.call(this, event);
        this.longPressJustHappened = false;
        if (this.longPressDuration)
            this.addTimer();
    };
    LongPressButton.prototype.addTimer = function () {
        if (this.longPressTimer)
            this.removeTimer();
        this.longPressTimer = new egret.Timer(this.longPressDuration, 1);
        this.longPressTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
        this.longPressTimer.start();
    };
    LongPressButton.prototype.removeTimer = function () {
        if (!this.longPressTimer)
            return;
        this.longPressTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
        this.longPressTimer.stop();
        this.longPressTimer = null;
    };
    LongPressButton.prototype.onTimerComplete = function (event) {
        this.longPressJustHappened = true;
        this.removeTimer();
        if (this.longPressCallback)
            this.longPressCallback();
    };
    LongPressButton.prototype.onTouchTap = function (event) {
        if (this.longPressJustHappened) {
            this.longPressJustHappened = false;
            event.stopImmediatePropagation();
            return;
        }
        if (this.longPressTimer) {
            this.removeTimer();
        }
        _super.prototype.onTouchTap.call(this, event);
    };
    LongPressButton.prototype.longPressSetting = function (duration, callback) {
        if (callback === void 0) { callback = null; }
        this.longPressDuration = duration;
        this.longPressCallback = callback;
    };
    return LongPressButton;
}(TouchDownButton));
__reflect(LongPressButton.prototype, "LongPressButton");
var MatrixTool = (function () {
    function MatrixTool() {
    }
    MatrixTool.colorMatrix = function (mainChannel, otherChannel, alphaChannel) {
        var matrix = [];
        matrix = matrix.concat([mainChannel, otherChannel, otherChannel, 0, 0]);
        matrix = matrix.concat([otherChannel, mainChannel, otherChannel, 0, 0]);
        matrix = matrix.concat([otherChannel, otherChannel, mainChannel, 0, 0]);
        matrix = matrix.concat([0, 0, 0, alphaChannel, 0]);
        var gcmf = new egret.ColorMatrixFilter(matrix);
        return gcmf;
    };
    MatrixTool.colorMatrixPure = function (color, alpha) {
        if (alpha === void 0) { alpha = 1; }
        var matrix = [];
        matrix = matrix.concat([0, 0, 0, 0, color >> 16]);
        matrix = matrix.concat([0, 0, 0, 0, (color & 0x00FF00) >> 8]);
        matrix = matrix.concat([0, 0, 0, 0, color & 0x0000FF]);
        matrix = matrix.concat([0, 0, 0, alpha, 0]);
        var gcmf = new egret.ColorMatrixFilter(matrix);
        return gcmf;
    };
    MatrixTool.colorMatrixLighter = function (light) {
        var stay = 1 - light;
        var leghter = Math.floor(255 * light);
        var matrix = [];
        matrix = matrix.concat([stay, 0, 0, 0, leghter]);
        matrix = matrix.concat([0, stay, 0, 0, leghter]);
        matrix = matrix.concat([0, 0, stay, 0, leghter]);
        matrix = matrix.concat([0, 0, 0, 1, 0]);
        var gcmf = new egret.ColorMatrixFilter(matrix);
        return gcmf;
    };
    return MatrixTool;
}());
__reflect(MatrixTool.prototype, "MatrixTool");
var SoundManager = (function () {
    function SoundManager() {
    }
    Object.defineProperty(SoundManager, "soundOn", {
        get: function () {
            if (egret.localStorage.getItem("sound") == "false")
                return false;
            return true;
        },
        set: function (value) {
            if (this.soundOn == value)
                return;
            egret.localStorage.setItem("sound", value ? "" : "false");
            if (value) {
                if (this.currentBackgorundMusicSound)
                    this.startPlayGameMusic();
            }
            else {
                this.stopMusic();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundManager, "soundEfOn", {
        get: function () {
            if (egret.localStorage.getItem("soundEf") == "false")
                return false;
            return true;
        },
        set: function (value) {
            if (this.soundEfOn == value)
                return;
            egret.localStorage.setItem("soundEf", value ? "" : "false");
        },
        enumerable: true,
        configurable: true
    });
    SoundManager.play = function (soundName, loop) {
        if (loop === void 0) { loop = false; }
        var sound = RES.getRes(soundName);
        if (!sound) {
            egret.error("can not fond sound resource:" + soundName);
            return null;
        }
        if (loop) {
            if (this.currentBackgorundMusicChannel)
                this.currentBackgorundMusicChannel.stop();
            this.currentBackgorundMusicSound = sound;
            if (this.soundOn) {
                this.startPlayGameMusic();
                return null;
            }
        }
        else {
            if (this.soundEfOn) {
                sound.type = egret.Sound.EFFECT;
                return sound.play(0, 1);
            }
        }
    };
    SoundManager.startPlayGameMusic = function () {
        this.currentBackgorundMusicSound.type = egret.Sound.MUSIC;
        this.currentBackgorundMusicChannel = this.currentBackgorundMusicSound.play(0, 0);
        this.currentBackgorundMusicChannel.volume = 0;
        var tween = egret.Tween.get(this.currentBackgorundMusicChannel);
        tween.to({ volume: 1 }, 1000);
    };
    SoundManager.stopMusic = function () {
        if (this.currentBackgorundMusicChannel) {
            egret.Tween.removeTweens(this.currentBackgorundMusicChannel);
            this.currentBackgorundMusicChannel.stop();
            this.currentBackgorundMusicChannel = null;
        }
    };
    return SoundManager;
}());
__reflect(SoundManager.prototype, "SoundManager");
var TextLabel = (function (_super) {
    __extends(TextLabel, _super);
    function TextLabel() {
        var _this = _super.call(this) || this;
        _this.verticalAlign = "middle";
        return _this;
    }
    TextLabel.prototype.setText = function (str) {
        this.text = str;
        this.width = this.maxWidth * 5;
        if (this.size <= this.maxSize - 2)
            this.size = this.maxSize;
        while (this.textWidth > this.maxWidth) {
            this.size -= 2;
        }
        this.width = this.maxWidth;
    };
    return TextLabel;
}(egret.TextField));
__reflect(TextLabel.prototype, "TextLabel");
var TweenerTool = (function () {
    function TweenerTool() {
    }
    TweenerTool.tweenTo = function (target, toObject, duration, delay, callback, fromObject, ease) {
        if (delay === void 0) { delay = 0; }
        if (callback === void 0) { callback = null; }
        if (fromObject === void 0) { fromObject = null; }
        if (ease === void 0) { ease = null; }
        var tw = egret.Tween.get(target);
        if (delay > 0)
            tw.wait(delay);
        for (var ob in fromObject)
            target[ob] = fromObject[ob];
        tw.to(toObject, duration, ease);
        if (callback)
            tw.call(callback);
    };
    return TweenerTool;
}());
__reflect(TweenerTool.prototype, "TweenerTool");
var Utils = {
    /**
     * put "," in the coins number
     * @param coins
     * @returns {string}
     */
    formatCoinsNumber: function (coins) {
        var coinsNumStr = coins + "", result = "", suffix = "";
        if (coinsNumStr.indexOf(".") > 0) {
            suffix = coinsNumStr.substring(coinsNumStr.indexOf("."), coinsNumStr.length);
            coinsNumStr = coinsNumStr.substring(0, coinsNumStr.indexOf("."));
        }
        for (var i = coinsNumStr.length, j = 1; i > 0; i--, j++) {
            result = (j % 3 === 0 ? "," : "").concat(coinsNumStr.charAt(i - 1)) + result;
        }
        return result.substring(result.charAt(0) === "," ? 1 : 0) + suffix;
    },
    /**
     * transfer first word to Upper
     */
    toFirstUpperCase: function (str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1, str.length).toLowerCase();
    },
    /**
     * transform the format of seconds to 'HH:mm:ss'.
     * example, call <b>Utils.secondToHour(8011)</b>, result is <b>02:13:31</b>
     * @param second
     * @returns {string}
     */
    secondToHour: function (second) {
        var h = Math.floor(second / 3600), m = Math.floor(second % 3600 / 60), s = Math.floor(second % 60);
        return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    },
    /**
     * return how many seconds over the day
     */
    secondsOverDay: function () {
        var now = new Date();
        return {
            D: 0,
            H: 23 - now.getHours(),
            M: 59 - now.getMinutes(),
            S: 59 - now.getSeconds()
        };
    },
    /**
     * return how many seconds over the week
     */
    secondsOverWeekend: function () {
        var now = new Date();
        return {
            D: 7 - now.getDay(),
            H: 23 - now.getHours(),
            M: 59 - now.getMinutes(),
            S: 59 - now.getSeconds()
        };
    },
    replaceAll: function (str, searchValue, replaceValue) {
        return str.indexOf(searchValue) > -1 ? Utils.replaceAll(str.replace(searchValue, replaceValue), searchValue, replaceValue) : str;
    }
};

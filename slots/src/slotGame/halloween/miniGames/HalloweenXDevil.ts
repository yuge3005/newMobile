class HalloweenXDevil extends egret.DisplayObjectContainer {
    private defaultInnerNumbers: Array<number> = [8, 5, 3, 4, 8, 2, 1, 7, 9, 7, 10, 6];
    private defaultOuterNumbers: Array<number> = [30, 10, 18, 10, 12, 10, 15, 10, 20, 12, 18, 10, 15, 10, 12, 10, 12, 15, 10, 12, 18, 10, 12, 15, 10, 12, 20, 10, 15, 12, 10];
    private innerPos: Array<number> = [];
    private outerPos: Array<number> = [];

    private ganho: number;
    private smallMultiple: number;
    private bigMultiple: number;
    private medalMultiple: number;
    private lineCount: number = 20;
    private bet: number;
    private innerNumbers: Array<number>;
    private outerNumbers: Array<number>;

    private spinEnable: boolean = true;
    private finger: egret.Bitmap;
    private innerCircle: egret.DisplayObjectContainer;
    private outerCircle: egret.DisplayObjectContainer;
    private coins: Array<egret.DisplayObjectContainer>;

    private chance1Text: egret.TextField;
    private chance2Text: egret.TextField;
    private medalText: egret.TextField;
    private totalBonusText: egret.TextField;
    private betText: egret.TextField;
    private totalWinText: egret.TextField;

    constructor(ganho: number, smallMultiple: number, bigMultiple: number, medalMultiple: number, lineCount: number, bet: number) {
        super();

        this.ganho = ganho;
        this.smallMultiple = smallMultiple;
        this.bigMultiple = bigMultiple;
        this.medalMultiple = medalMultiple;
        this.lineCount = lineCount;
        this.bet = bet;

        this.defaultInnerNumbers.map((num, idx) => {
            if (num === smallMultiple) this.innerPos.push(idx);
        });

        this.defaultOuterNumbers.map((num, idx) => {
            if (num === bigMultiple) this.outerPos.push(idx);
        });

        // bg
        Com.addBitmapAt(this, "mini_game_json.devil_bg", 0, 0);

        // spin btn
        Com.addDownButtonAt(this, "mini_game_json.wheel_button", "mini_game_json.wheel_button", 915, 310, this.spin, true);

        // inner circle
        this.innerCircle = new egret.DisplayObjectContainer();
        Com.addObjectAt(this, this.innerCircle, 1010, 398);

        // inner circle numbers
        for (let i = 0; i < 12; i++) {
            let num = Com.addBitmapAt(this.innerCircle, "mini_game_json." + this.defaultInnerNumbers[i], 0, 0);
            num.anchorOffsetX = num.width >> 1;
            num.anchorOffsetY = -210;
            num.rotation = i * 30;
        }

        // outer circle
        this.outerCircle = new egret.DisplayObjectContainer();
        Com.addObjectAt(this, this.outerCircle, 1010, 398);

        // outer circle numbers
        for (let i = 0; i < 31; i++) {
            let num = Com.addBitmapAt(this.outerCircle, "mini_game_json.small_" + this.defaultOuterNumbers[i], 0, 0);
            num.anchorOffsetX = num.width >> 1;
            num.anchorOffsetY = -300;
            num.rotation = Math.floor(i * 3600 / 31) / 10;
        }

        // coins
        this.coins = new Array<egret.DisplayObjectContainer>(5);
        for (let i = 0; i < 5; i++) {
            this.coins[i] = this.appendCoin(i);
            Com.addObjectAt(this, this.coins[i], 464 + i * 270, 788);
        }

        // finger
        this.finger = Com.addBitmapAt(this, "mini_game_json.finger", 916, 376);
        this.finger.rotation = 90;
        egret.Tween.get(this.finger, { loop: true }).to({ anchorOffsetY: 10 }, 300, egret.Ease.sineIn).to({anchorOffsetY: 0}, 150, egret.Ease.sineOut);

        // texts
        this.chance1Text = Com.addTextAt(this, 1608, 71, 277, 49, 42, true, false);
        this.chance2Text = Com.addTextAt(this, 1608, 175, 277, 49, 42, true, false);
        this.medalText = Com.addTextAt(this, 1608, 281, 277, 49, 42, true, false);
        this.totalBonusText = Com.addTextAt(this, 1608, 395, 277, 49, 42, false, false);
        this.betText = Com.addTextAt(this, 1608, 513, 277, 49, 42, true, false);
        this.betText.text = Utils.formatCoinsNumber(this.bet);
        this.betText.size = 40 - Math.max(this.betText.text.length - 12, 0) * 2;

        this.totalWinText = Com.addTextAt(this, 1584, 624, 336, 60, 48, true, false);

        this.chance1Text.fontFamily = this.chance2Text.fontFamily = this.medalText.fontFamily = this.totalBonusText.fontFamily = this.betText.fontFamily = this.totalWinText.fontFamily = "Righteous";
        this.chance1Text.verticalAlign = this.chance2Text.verticalAlign = this.medalText.verticalAlign = this.totalBonusText.verticalAlign = this.betText.verticalAlign = this.totalWinText.verticalAlign = "middle";
        this.chance1Text.stroke = this.chance2Text.stroke = this.medalText.stroke = this.totalBonusText.stroke = this.betText.stroke = this.totalWinText.stroke = 2;
        this.chance1Text.strokeColor = this.chance2Text.strokeColor = this.medalText.strokeColor = this.totalBonusText.strokeColor = this.betText.strokeColor = this.totalWinText.strokeColor = 0x000000;
        this.chance1Text.textColor = this.chance2Text.textColor = this.medalText.textColor = this.totalBonusText.textColor = this.betText.textColor = this.totalWinText.textColor = 0xF1D130;
        this.chance1Text.visible = this.chance2Text.visible = this.medalText.visible = this.totalBonusText.visible = this.totalWinText.visible = false;
    }

    /**
     * spin
     */
    private spin(): void {
        if (!this.spinEnable) return;
        this.spinEnable = false;
        this.finger.visible = false;

        let innerIndex = Math.floor(Math.random() * this.innerPos.length), 
            outerIndex = Math.floor(Math.random() * this.outerPos.length);
        if (innerIndex === this.innerPos.length) innerIndex--;
        if (outerIndex === this.outerPos.length) outerIndex--;

        egret.Tween.get(this.innerCircle).to({ rotation: 1440 - this.innerPos[innerIndex] * 30 }, 8000, egret.Ease.sineInOut);
        egret.Tween.get(this.outerCircle).to({ rotation: -720 - this.outerPos[outerIndex] * 11.6 }, 8000, egret.Ease.sineInOut).call(function () {
            // show texts
            this.chance1Text.text = this.smallMultiple + "";
            this.blinkText(this.chance1Text, 250);
            this.chance2Text.text = this.bigMultiple + "";
            this.blinkText(this.chance2Text, 1000, function () {
                this.coins.map((coin) => {
                    coin.touchEnabled = true;
                });

                // show finger
                this.finger.x = 321;
                this.finger.y = 867;
                this.finger.visible = true;
            }.bind(this));
        }, this);
    }

    /**
     * append coin
     */
    private appendCoin(index: number): egret.DisplayObjectContainer {
        let result = new egret.DisplayObjectContainer();
        result.width = 227;
        result.height = 218;
        result.anchorOffsetX = 113;
        result.touchEnabled = false;
        result.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showModalResult.bind(this, index), this);

        // bg
        // Com.addBitmapAt(result, "mini_game_json.coin_back", 3, 0);

        // coin
        let coin = Com.addBitmapAt(result, "mini_game_json.coin_enable", 0, 0);

        result["addMedalMultiple"] = function (coin: egret.Bitmap, multiple: number, userAlpha: boolean = true) {
            // animation
            let tween = egret.Tween.get(this);
            tween.to({ scaleX: 0 }, 350, egret.Ease.sineIn);
            tween.call(function () {
                coin.texture = RES.getRes("mini_game_json.coin_disable");

                // multiple icon
                Com.addBitmapAt(this, "mini_game_json." + multiple + "x", 6, 37);
            }, this);
            tween.to({ scaleX: 1 }, 350, egret.Ease.sineOut).call(function () {
                this.dispatchEvent(new egret.Event("COIN_ANIMATION_OVER"));
            }, this);
        }.bind(result, coin);

        return result;
    }

    /**
     * show modal result
     */
    private showModalResult(index: number): void {
        this.finger.visible = false;

        let multipleArray = [3, 4, 5, 6, 7];
        multipleArray.splice(multipleArray.indexOf(this.medalMultiple), 1);

        // add event listener
        this.coins[index === 4 ? 3 : 4].once("COIN_ANIMATION_OVER", this.calculateTotalWin, this);

        // add event listener
        this.coins[index].once("COIN_ANIMATION_OVER", function (multipleArray: Array<number>, index: number) {
            let arrayIndex = 0;
            for (let i = 0; i < 5; i++) {
                if (i === index) continue;
                arrayIndex = Math.floor(Math.random() * multipleArray.length);
                this.coins[i]["addMedalMultiple"](multipleArray[arrayIndex]);
                multipleArray.splice(arrayIndex, 1);
            }
        }.bind(this, multipleArray, index), this);

        // show multiple
        this.coins[index]["addMedalMultiple"](this.medalMultiple, false);

        for( let i: number = 0; i < this.coins.length; i++ ){
            this.coins[i].removeEventListener( egret.TouchEvent.TOUCH_TAP, this.showModalResult, this );
        }
    }

    /**
     * calculate total win
     */
    private calculateTotalWin(): void {
        // total win
        let totalWin = this.smallMultiple * this.bigMultiple * this.medalMultiple * this.bet * this.lineCount;

        // show texts
        this.medalText.text = this.medalMultiple + "";
        this.blinkText(this.medalText, 150);
        this.totalBonusText.text = this.smallMultiple * this.bigMultiple * this.medalMultiple + "";
        this.blinkText(this.totalBonusText, 1000);
        this.totalWinText.text = Utils.formatCoinsNumber(totalWin);
        this.totalWinText.size = 48 - Math.max(this.totalWinText.text.length - 14, 0) * 2;
        this.blinkText(this.totalWinText, 1900, this.gameOver.bind(this, totalWin));
    }

    /**
     * game over
     */
    private gameOver(totalWin: number): void {
        this.dispatchEvent(new egret.Event(SlotMachine.BONUS_GAME_WIN, false, false, { bonus: totalWin }));
        
        egret.setTimeout(function (bonus: number) {
            this.dispatchEvent(new egret.Event(SlotMachine.BONUS_GAME_OVER, false, false, { totalBonus: (bonus + this.ganho) }));
        }.bind(this, totalWin), this, 2500);
    }

    /**
     * blink text
     */
    private blinkText(object: egret.TextField, wait: number, callback: Function = null): void {
        let tween = egret.Tween.get(object);
        tween.wait(wait)
            .call(function () { this.visible = true; }, object).wait(150)
            .call(function () { this.visible = false; }, object).wait(150)
            .call(function () { this.visible = true; }, object).wait(150)
            .call(function () { this.visible = false; }, object).wait(150)
            .call(function () { this.visible = true; }, object).wait(150)
            .call(function () { this.visible = false; }, object).wait(150)
            .call(function () { this.visible = true; }, object);
        if (callback) tween.call(callback);
    }
}
class CopaBoat extends egret.DisplayObjectContainer {
    private static SCROLL_OVER: string = "SCROLL_OVER";
    public static GET_TURBO: string = "GET_TURBO";
    public static BOAT_GAME_OVER: string = "BOAT_GAME_OVER";

    private starting: boolean = false;
    private over: boolean = false;

    private assetJson: string;
    private currentIndex: number;
    private increaseCount: number;
    private finalDistance: number;
    private currentBet: number;

    private startLine: egret.Bitmap;
    private floatSignContainer: egret.DisplayObjectContainer;
    private cloudsContainer: egret.DisplayObjectContainer;
    private boatContaner: egret.DisplayObjectContainer;
    private boat: egret.Bitmap;
    private boatWave: egret.Bitmap;
    private waterSpray: egret.Bitmap;
    private waterSprayTimer: egret.Timer;

    private progressBar: egret.DisplayObjectContainer;
    private progressPoints: Array<egret.Bitmap>;
    private pointPrize: Array<any>;
    private prizeAnimationText: egret.TextField;
    private boatIcon: egret.Bitmap;
    private overplus: number;
    private overplusTimer: egret.Timer;
    private overplusText: egret.TextField;
    private prizeText: egret.TextField;

    private speedBar: egret.DisplayObjectContainer;

    private lights: Array<egret.Bitmap>;
    private powers: Array<egret.DisplayObjectContainer>;
    private lightResult: Array<number>;
    private scrollStatus: number;
    private goBtn: egret.DisplayObjectContainer;
    private _btnEnable: boolean;

    private choicePrizeContainer: egret.DisplayObjectContainer;
    private choicePrizeCard: Array<egret.DisplayObjectContainer>;
    private vipChoiceBtn: egret.DisplayObjectContainer;
    private vipLoyaltyIcon: egret.Bitmap;
    private prizeMaxText: Array<egret.TextField>;
    private prizeType: number;

    private rewardContainer: egret.DisplayObjectContainer;
    private rewardText: egret.TextField;

    constructor( goKartRewards: any ) {
        super();

        this.assetJson = "pipa_boat_json";
        this.lightResult = [0, 0, 0, 0, 0];
        this.pointPrize = [];
        for (let i = 0; i < eval("goKartRewards.size()"); i++) {
            let reward = [];
            for (let j = 0; j < eval("goKartRewards.get(i).size()"); j++) {
                reward.push({"turbo_count": eval("goKartRewards.get(i).get(j).get('turbo_count')"), "coins": eval("goKartRewards.get(i).get(j).get('coins')")})
            }
            this.pointPrize.push(reward);
        }

        // bg
        Com.addBitmapAt(this, this.assetJson + ".game_bg", 0, 0);

        this.startLine = Com.addBitmapAt(this, this.assetJson + ".starting_line", 273, 193);

        // flag sign container
        this.floatSignContainer = new egret.DisplayObjectContainer();
        this.floatSignContainer.width = 1000;
        this.floatSignContainer.height = 28;
        Com.addObjectAt(this, this.floatSignContainer, 0, 300);
        // float signs
        for (let i = 0; i < 17; i++) {
            Com.addBitmapAt(this.floatSignContainer, this.assetJson + ".float", i * 60, 0);
        }
        // green shadow
        let greenShadow = Com.addBitmapAt(this, this.assetJson + ".float_cover", 0, 315);
        greenShadow.width = 755;
        greenShadow.height = 61;
        greenShadow.alpha = 0.5;

        // clouds container
        this.cloudsContainer = new egret.DisplayObjectContainer();
        this.cloudsContainer.width = 800;
        this.cloudsContainer.height = 110;
        Com.addObjectAt(this, this.cloudsContainer, -16, 2);
        // clouds
        Com.addBitmapAt(this.cloudsContainer, this.assetJson + ".cloud_02", 0, 46);
        Com.addBitmapAt(this.cloudsContainer, this.assetJson + ".cloud_03", 75, 0);
        Com.addBitmapAt(this.cloudsContainer, this.assetJson + ".cloud_01", 607, 0);

        // boat container
        this.boatContaner = new egret.DisplayObjectContainer();
        this.boatContaner.width = 367;
        this.boatContaner.height = 131;
        Com.addObjectAt(this, this.boatContaner, 14, 140);
        // water border
        this.boatWave = Com.addBitmapAt(this.boatContaner, this.assetJson + ".boat_wave", 171, 99);
        this.boatWave.anchorOffsetX = 140;
        this.boatWave.anchorOffsetY = 31;
        // boat
        this.boat = Com.addBitmapAt(this.boatContaner, this.assetJson + ".boat", 147, 80);
        this.boat.anchorOffsetX = 86;
        this.boat.anchorOffsetY = 80;
        // water spray
        this.waterSpray = Com.addBitmapAt(this.boatContaner, this.assetJson + ".spray_01", 0, 38);
        this.waterSpray["textureArray"] = ["spray_01", "spray_02", "spray_03", "spray_02"];
        this.waterSpray["index"] = 3;
        this.waterSpray.visible = false;
        egret.Tween.get(this.boat, { loop: true }).to({ y: 72 }, 500).to({ y: 80 }, 500);
        egret.Tween.get(this.boatWave, { loop: true }).to({ scaleX: 0.96, scaleY: 0.96 }, 500).to({ scaleX: 1, scaleY: 1 }, 500);

        // pregress bar
        this.progressBar = new egret.DisplayObjectContainer();
        this.progressBar.width = 680;
        this.progressBar.height = 48;
        this.progressBar.visible = false;
        Com.addObjectAt(this, this.progressBar, 43, 34);
        // images
        Com.addBitmapAt(this.progressBar, this.assetJson + ".time_bg", 0, 0);
        let prizeBg = Com.addBitmapAt(this.progressBar, this.assetJson + ".time_bg", 477, 0);
        prizeBg.scale9Grid = new egret.Rectangle(31, 9, 73, 22);
        prizeBg.width = 213;
        Com.addBitmapAt(this.progressBar, this.assetJson + ".icon_stopwatch", 23, 2);
        Com.addBitmapAt(this.progressBar, this.assetJson + ".icon_coin", 491, 1);
        // overplus text
        this.overplusText = Com.addTextAt(this.progressBar, 58, 10, 51, 28, 22, false, false);
        this.overplusText.fontFamily = "LuckiestGuy";
        this.overplusText.verticalAlign = "middle";
        this.overplusText.textColor = 0xFFFFFF;
        this.overplusText.text = "30";
        // prize text
        this.prizeText = Com.addTextAt(this.progressBar, 528, 10, 133, 28, 20, false, false);
        this.prizeText.fontFamily = "LuckiestGuy";
        this.prizeText.verticalAlign = "middle";
        this.prizeText.textColor = 0xFFFFFF;
        this.prizeText.text = "0";
        // progress
        let progress = new egret.DisplayObjectContainer();
        progress.width = 336;
        progress.height = 40;
        Com.addObjectAt(this.progressBar, progress, 135, 1);
        // progress points
        this.progressPoints = new Array<egret.Bitmap>(5);
        for (let i = 0; i < 5; i++) {
            // bg
            Com.addBitmapAt(progress, this.assetJson + ".progress_bg", 67 * i, 23);
            // point
            this.progressPoints[i] = Com.addBitmapAt(progress, this.assetJson + (i === 0 ? ".green_point" : ".red_point"), i * 67 + 3, 24);
            this.progressPoints[i]["trigger"] = function (point: egret.Bitmap, enable: boolean) {
                point.texture = RES.getRes(this.assetJson + (enable ? ".green_point" : ".red_point"));
            }.bind(this, this.progressPoints[i]);
        }
        // prize animation text
        this.prizeAnimationText = Com.addTextAt(this, 370, 255, 320, 70, 50, false, false);
        this.prizeAnimationText.fontFamily = "LuckiestGuy";
        this.prizeAnimationText.verticalAlign = "middle";
        this.prizeAnimationText.textColor = 0x138D1C;
        this.prizeAnimationText.anchorOffsetX = 160;
        this.prizeAnimationText.anchorOffsetY = 35;
        this.prizeAnimationText.bold = true;
        this.prizeAnimationText.visible = false;
        // boat icon
        this.boatIcon = Com.addBitmapAt(progress, this.assetJson + ".icon_boat", 0, 23);
        
        // speed bar
        this.speedBar = new egret.DisplayObjectContainer();
        this.speedBar.width = 628;
        this.speedBar.height = 94;
        this.speedBar.visible = false;
        Com.addObjectAt(this, this.speedBar, 73, 346);
        // bg
        Com.addBitmapAt(this.speedBar, this.assetJson + ".big_bar", 0, 0);
        // light
        this.lights = new Array<egret.Bitmap>(5);
        for (let i = 0; i < 5; i++) {
            this.lights[i] = Com.addBitmapAt(this.speedBar, this.assetJson + ".light_choice", 23 + 74 * i, 9);
            this.lights[i].visible = false;
            this.lights[i]["blink"] = function () {
                egret.Tween.get(this)
                    .set({ visible: true }).wait(400)
                    .set({ visible: false }).wait(400)
                    .set({ visible: true }).wait(400)
                    .set({ visible: false }).wait(400)
                    .set({ visible: true }).wait(400)
                    .set({ visible: false });
            }.bind(this.lights[i]);
        }
        // power container
        let powerContainer = new egret.DisplayObjectContainer();
        powerContainer.width = 370;
        powerContainer.height = 67;
        powerContainer.mask = new egret.Rectangle(0, 0, 370, 67);
        Com.addObjectAt(this.speedBar, powerContainer, 38, 9);

        // powers array
        this.powers = new Array<egret.DisplayObjectContainer>(5);
        for (let i = 0; i < 5; i++) {
            this.powers[i] = new egret.DisplayObjectContainer();
            this.powers[i].width = 44;
            this.powers[i].height = 268;
            this.powers[i].addEventListener(CopaBoat.SCROLL_OVER, this.showLights, this);
            Com.addObjectAt(powerContainer, this.powers[i], 74 * i, -201);

            Com.addBitmapAt(this.powers[i], this.assetJson + ".icon_oil", 5, 11);
            Com.addBitmapAt(this.powers[i], this.assetJson + ".icon_x", 4, 87);
            Com.addBitmapAt(this.powers[i], this.assetJson + ".icon_oil_blur", 5, 135);
            Com.addBitmapAt(this.powers[i], this.assetJson + ".icon_x", 4, 221);

            this.powers[i]["scroll"] = function (power: egret.DisplayObjectContainer, value: number) {
                power.y = -201;
                egret.Tween.get(power, { loop: true }).to({ y: -67 }, 100);
                egret.setTimeout(function (power: egret.DisplayObjectContainer, value: number) {
                    egret.Tween.removeTweens(power);
                    power.y = value === 0 ? -201 : 0;
                    power.dispatchEvent(new egret.Event(CopaBoat.SCROLL_OVER));
                }.bind(this, power, value), this, 900);
            }.bind(this, this.powers[i]);
        }
        // go btn
        this.goBtn = new egret.DisplayObjectContainer();
        this.goBtn.width = 220;
        this.goBtn.height = 73;
        this.goBtn.touchEnabled = true;
        this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getPower, this);
        Com.addObjectAt(this.speedBar, this.goBtn, 389, 5);
        // bg
        let goBtnBg = Com.addBitmapAt(this.goBtn, this.assetJson + ".btn_go", 0, 0);
        // go btn text
        let goBtnText = Com.addTextAt(this.goBtn, 0, 0, 220, 73, 48, false, false);
        goBtnText.fontFamily = "LuckiestGuy";
        goBtnText.verticalAlign = "middle";
        goBtnText.textColor = 0xFFFFFF;
        goBtnText.text = MuLang.getText( "go" );
        // go btn trigger
        this.goBtn["trigger"] = function (bg: egret.Bitmap, enable: boolean) {
            bg.texture = RES.getRes(this.assetJson + (enable ? ".btn_go": ".btn_go_dark"));
        }.bind(this, goBtnBg);

        // choice prize container
        this.choicePrizeContainer = new egret.DisplayObjectContainer();
        this.choicePrizeContainer.width = 755;
        this.choicePrizeContainer.height = 447;
        Com.addObjectAt(this, this.choicePrizeContainer, 0, 0);
        // title bg
        let titleBg = Com.addBitmapAt(this.choicePrizeContainer, this.assetJson + ".title_bg", 154, 21);
        titleBg.width = 464;
        titleBg.alpha = 0.4;
        titleBg.fillMode = egret.BitmapFillMode.REPEAT;
        // title text
        let titlePosition = { en: { x: 180, y: 29 }, es: { x: 203, y: 28 }, pt: { x: 169, y: 21 } };
        Com.addBitmapAt(this.choicePrizeContainer, "pipa_" + GlobelSettings.language + "_json.boat_title", titlePosition[GlobelSettings.language]["x"], titlePosition[GlobelSettings.language]["y"]);
        // choice boats
        let boatsAssets = [".boat_yellow", ".boat_red", ".boat_green"];
        let choiceBtnTextArray = ["choose", "choose", "vip"];
        this.choicePrizeCard = new Array<egret.DisplayObjectContainer>(3);
        this.prizeMaxText = new Array<egret.TextField>(3);
        for (let i = 0; i < 3; i++) {
            this.choicePrizeCard[i] = new egret.DisplayObjectContainer();
            this.choicePrizeCard[i].width = 252;
            this.choicePrizeCard[i].height = 267;
            // ## remove after second currency
            this.choicePrizeCard[i].visible = i === 0;
            Com.addObjectAt(this.choicePrizeContainer, this.choicePrizeCard[i], 36 + i * 219, 84);
            // bg
            Com.addBitmapAt(this.choicePrizeCard[i], this.assetJson + ".boat_bg", 0, 0);
            // coin
            if (i === 0) Com.addBitmapAt(this.choicePrizeCard[i], this.assetJson + ".icon_coin", 72, 9);
            // coins text
            this.prizeMaxText[i] = Com.addTextAt(this.choicePrizeCard[i], i === 0 ? 118 : 69, 9, i === 0 ? 115 : 164, 35, 20, false, false);
            if (i === 0) this.prizeMaxText[i].textAlign = "left";
            this.prizeMaxText[i].fontFamily = "Righteous";
            this.prizeMaxText[i].verticalAlign = "middle";
            this.prizeMaxText[i].textColor = 0xFFFFFF;
            this.prizeMaxText[i].skewX = 10;
            if (i !== 0) {
                this.prizeMaxText[i].text = MuLang.getText( "coming_soon" );
            }
            // boat icon
            Com.addBitmapAt(this.choicePrizeCard[i], this.assetJson + boatsAssets[i], 11, 73);
            // choice btn
            let choiceBtn = new egret.DisplayObjectContainer();
            choiceBtn.width = 155;
            choiceBtn.height = 51;
            choiceBtn.touchEnabled = true;
            choiceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.choicePrize.bind(this, i), this);
            Com.addObjectAt(this.choicePrizeCard[i], choiceBtn, 25, 190);
            // btn bg
            Com.addBitmapAt(choiceBtn, this.assetJson + ".btn_choose", 0, 0);
            // btn text
            let choiceBtnText = Com.addTextAt(choiceBtn, 0, 0, 155, 51, 22, false, false);
            choiceBtnText.fontFamily = "Righteous";
            choiceBtnText.verticalAlign = "middle";
            choiceBtnText.textColor = 0xFFFFFF;
            choiceBtnText.skewX = 10;
            choiceBtnText.text = (i === 2 ? "   ": "") + MuLang.getText( choiceBtnTextArray[i], MuLang.CASE_UPPER );
            if (i > 0) {
                choiceBtn.touchEnabled = false;
                choiceBtn.filters = [MatrixTool.colorMatrix(0.33, 0.33, 1)];

                if (i == 2 && Number(LoyaltyVo.get("loyaltyLevel")) < 3) {
                    this.vipChoiceBtn = choiceBtn;
                    // choiceBtn.touchEnabled = false;
                    // choiceBtn.filters = [MatrixTool.colorMatrix(0.33, 0.33, 1)];
                    // loyalty icon
                    this.vipLoyaltyIcon = Com.addBitmapAt(this.choicePrizeCard[i], "loyalty_system_" + GlobelSettings.language + "_json.level_1", 26, 192);
                    this.vipLoyaltyIcon.scaleX = this.vipLoyaltyIcon.scaleY = 0.5;
                }

                let cover = Com.addBitmapAt(this.choicePrizeCard[i], this.assetJson + ".black_cover", 0, 0);
                cover.alpha = 0.5;
                Com.addBitmapAt(this.choicePrizeCard[i], this.assetJson + ".lock", 100, 90);
            }
        }

        // reward container
        this.rewardContainer = new egret.DisplayObjectContainer();
        this.rewardContainer.width = 308;
        this.rewardContainer.height = 119;
        this.rewardContainer.visible = false;
        Com.addObjectAt(this, this.rewardContainer, 224, 8);
        // title
        let position = { en: { x: 0, y: 17 }, es: { x: 62, y: 0 }, pt: { x: 60, y: 0 } };
        Com.addBitmapAt(this.rewardContainer, "pipa_" + GlobelSettings.language + "_json.end_title", position[GlobelSettings.language]["x"], position[GlobelSettings.language]["y"]);
        // coins
        Com.addBitmapAt(this.rewardContainer, this.assetJson + ".icon_coin", 37, 84);
        // reward text
        this.rewardText = Com.addTextAt(this.rewardContainer, 82, 85, 360, 44, 30, false, false);
        this.rewardText.fontFamily = "LuckiestGuy";
        this.rewardText.textAlign = "left";
        this.rewardText.verticalAlign = "middle";
        this.rewardText.textColor = 0xE99D30;

        let sp: egret.Shape = new egret.Shape;
        GraphicTool.drawRect( sp, new egret.Rectangle( 0, 0, 755, 153 ), 0, false, 0.4 );
        sp.touchEnabled = true;
        Com.addObjectAt(this, sp, 0, 447);

        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, function () {
            if (this.overplusTimer) this.overplusTimer.stop();
        }, this);
    }

    /**
     * init game
     */
    public initGame(bet: number): void {
        this.boatWave.visible = true;
        this.starting = false;
        this.over = false;
        this.startLine.x = 273;
        this.floatSignContainer.x = 0;
        this.cloudsContainer.x = -16;
        this.boatContaner.x = 14;
        this.boatIcon.x = 0;
        this.currentIndex = 0;
        this.scrollStatus = 0;
        this.increaseCount = 0;
        this.overplus = 30;
        this.finalDistance = 67;
        this.currentBet = bet;
        this.prizeText.text = "0";

        for (let i = 1; i < 5; i++) {
            this.progressPoints[i]["trigger"](false);
        }

        if (Number(LoyaltyVo.get("loyaltyLevel")) >= 3) {
            if (this.vipChoiceBtn) {
                this.vipChoiceBtn.touchEnabled = true;
                this.vipChoiceBtn.filters = [];
            }
            if (this.vipLoyaltyIcon) this.vipLoyaltyIcon.parent.removeChild(this.vipLoyaltyIcon);
        }

        let totalCoins = 0;
        for (let j = 0; j < this.pointPrize[0].length; j++) {
            totalCoins += Number(this.pointPrize[0][j]["coins"]);
        }
        this.prizeMaxText[0].text = "" + totalCoins * bet;

        this.visible = true;
        this.rewardContainer.visible = false;
        this.choicePrizeContainer.visible = true;
    }

    /**
     * choice prize
     */
    private choicePrize(index: number): void {
        this.prizeType = index;

        // send command
        let ev: egret.Event = new egret.Event(CopaBoat.GET_TURBO);
        ev.data = { action: "select_turbo", rewardType: index };
        this.dispatchEvent(ev);

        Pipa.resetBgMusicTimer();
    }

    /**
     * choice prize callback
     */
    public choicePrizeCallback(success: boolean): void {
        if (success) {
            this.choicePrizeContainer.visible = false;
            this.progressBar.visible = this.speedBar.visible = true;
            this.btnEnable = true;
        }
    }

    /**
     * start game
     */
    public startGame(): void {
        this.boatWave.visible = false;
        egret.Tween.removeTweens(this.boat);
        egret.Tween.removeTweens(this.boatWave);
        this.boat.y = 80;
        this.boatWave.y = 99;

        egret.Tween.get(this.startLine).to({ x: -200 }, 1200);
        egret.Tween.get(this.cloudsContainer).to({ x: -166 }, 30000);
        egret.Tween.get(this.floatSignContainer, { loop: true }).to({ x: -179 }, 800);
        egret.Tween.get(this.boatIcon, { onChange: this.calculatePrize, onChangeObj: this }).to({ x: this.finalDistance }, 30000);
        // egret.Tween.get(this.boatContaner).to({ x: 37 }, 1000);

        this.waterSpray.visible = true;        
        // water spray timer
        this.waterSprayTimer = new egret.Timer(150, 0);
        this.waterSprayTimer.addEventListener(egret.TimerEvent.TIMER, function () {
            this["index"] += this["index"] === 3 ? -3 : 1;
            this.texture = RES.getRes(this["textureArray"][this["index"]]);
        }, this.waterSpray);
        this.waterSprayTimer.start();

        // dispatch event to play boat sound
        let event = new egret.Event(Pipa.PLAY_MINI_GAME_SOUND);
        event.data = { soundName: "engine_mp3", repeat: true };
        this.dispatchEvent(event);
        
        // over plus timer
        this.overplusTimer = new egret.Timer(1000, 30);
        this.overplusTimer.addEventListener(egret.TimerEvent.TIMER, function () {
            this.overplus--;
            this.overplusText.text = this.overplus + "";
        }, this);
        this.overplusTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timeOver, this);
        this.overplusTimer.start();
    }

    /**
     * time over
     */
    private timeOver(): void {
        this.over = true;
        this.boatWave.visible = true;
        this.waterSpray.visible = false;

        if (this.waterSprayTimer) {
            this.waterSprayTimer.stop();
            this.waterSprayTimer = null;
        }

        if (this.overplusTimer) {
            this.overplusTimer.stop();
            this.overplusTimer = null;
        }

        egret.Tween.removeTweens(this.boatContaner);
        egret.Tween.removeTweens(this.cloudsContainer);
        egret.Tween.removeTweens(this.floatSignContainer);
        egret.Tween.removeTweens(this.boatIcon);

        egret.Tween.get(this.boatContaner).to({ x: 320 }, 1200);
        egret.Tween.get(this.boat, { loop: true }).to({ y: 72 }, 500).to({ y: 80 }, 500);
        egret.Tween.get(this.boatWave, { loop: true }).to({ scaleX: 0.96, scaleY: 0.96 }, 500).to({ scaleX: 1, scaleY: 1 }, 500);

        this.btnEnable = false;

        // dispatch event to stop sound
        let event: egret.Event = new egret.Event(Pipa.STOP_MINI_GAME_SOUND);
        event.data = { soundName: "engine_mp3" };
        this.dispatchEvent(event);

        // send game over command
        let ev: egret.Event = new egret.Event(CopaBoat.GET_TURBO);
        ev.data = { action: "over" };
        this.dispatchEvent(ev);
    }

    /**
     * calculate prize
     */
    private calculatePrize(): void {
        if (this.boatIcon.x >= (this.currentIndex + 1) * 67) {
            this.currentIndex++;
            this.progressPoints[this.currentIndex]["trigger"](true);

            // get prize
            let prize = 0;
            for (let i = 0; i < this.currentIndex; i++) prize += this.pointPrize[this.prizeType][i]["coins"] * this.currentBet;

            // prize animation
            this.prizeAnimationText.text = "+" + this.pointPrize[this.prizeType][this.currentIndex - 1]["coins"] * this.currentBet;
            egret.Tween.get(this.prizeAnimationText).set({ visible: true, x: 370, y: 255 })
                .to({ scaleX: 1.4, scaleY: 1.4, alpha: 1 }, 500, egret.Ease.backOut).wait(500)
                .to({ x: 661, y: 58, scaleX: 0.2, scaleY: 0.2, alpha: 0 }, 800)
                .call(function (prize: number) {
                    let prizeText = Utils.formatCoinsNumber(prize);
                    this.prizeText.text = prizeText;
                    this.prizeText.size = 20 - Math.max(0, prizeText.length - 11);
                }.bind(this, prize), this);
        }
    }

    /**
     * get power
     */
    private getPower(): void {
        if (!this.btnEnable || this.over) return;
        if (!this.starting) {
            this.starting = true;
            this.startGame();
        }
        this.btnEnable = false;

        // send command
        let ev: egret.Event = new egret.Event(CopaBoat.GET_TURBO);
        ev.data = { action: "get_turbo" };
        this.dispatchEvent(ev);

        Pipa.resetBgMusicTimer();
    }

    /**
     * turbo
     */
    public turbo(turbo: boolean): void {
        this.lightResult = new Array<number>(5);
        if (turbo) {
            let start = Math.min(Math.floor(Math.random() * 3), 2);
            for (let i = 0; i < 5; i++) {
                this.lightResult[i] = (i >= start && i < (start + 3)) ? 1 : Math.round(Math.random());
            }
        } else {
            for (let i = 0; i < 5; i++) {
                this.lightResult[i] = Math.round(Math.random());
            }
            if (this.lightResult[2] === 1) {
                if (this.lightResult[1] === 1) {
                    this.lightResult[0] = 0;
                    this.lightResult[3] = 0;
                } else {
                    this.lightResult[4] = 0;
                }
            }
        }

        for (let i = 0; i < 5; i++) {
            this.powers[i]["scroll"](this.lightResult[i]);
        }
    }

    /**
     * show lights
     */
    private showLights(): void {
        if (this.over) return;
        if (this.scrollStatus === 4) {
            this.scrollStatus = 0;

            let blinkIndex = [];
            if (this.lightResult[2] === 1) {
                blinkIndex.push(2);
                if (this.lightResult[1] === 1) {
                    blinkIndex.push(1);
                    if (this.lightResult[0] === 1) blinkIndex.push(0);
                }

                if (this.lightResult[3] === 1) {
                    blinkIndex.push(3);
                    if (this.lightResult[4] === 1) blinkIndex.push(4);
                }
            }

            if (blinkIndex.length >= 3) {
                this.increaseCount++;

                for (let i = 0; i < blinkIndex.length; i++) {
                    this.lights[blinkIndex[i]]["blink"]();
                }

                // increase speed
                egret.Tween.removeTweens(this.boatContaner);
                egret.Tween.get(this.boatContaner).to({ x: 320 }, 700, egret.Ease.sineOut).wait(200).to({ x: 14 }, 1000, egret.Ease.sineIn);

                egret.Tween.removeTweens(this.boatIcon);
                egret.Tween.get(this.boatIcon, { onChange: this.calculatePrize, onChangeObj: this }).to({ x: this.boatIcon.x + this.getCurrentIncreaseDistance() }, 700).call(function () {
                    egret.Tween.removeTweens(this.boatIcon);
                    egret.Tween.get(this.boatIcon, { onChange: this.calculatePrize, onChangeObj: this }).to({ x: this.finalDistance }, this.overplus * 1000);
                }, this);

                egret.setTimeout(function () {
                    if (!this.over) this.btnEnable = true;
                }, this, 2000);
            } else {
                if (!this.over) this.btnEnable = true;
            }
        } else this.scrollStatus++;
    }

    /**
     * get current increase distance
     */
    private getCurrentIncreaseDistance(): number {
        let distance = 0;
        for (let i = this.pointPrize[this.prizeType].length - 1; i >= 0; i--) {
            if (this.increaseCount >= this.pointPrize[this.prizeType][i]["turbo_count"]) {
                distance = 67 / (this.pointPrize[this.prizeType][i + 1]["turbo_count"] - this.pointPrize[this.prizeType][i]["turbo_count"]);
                break;
            }
        }
        this.finalDistance += distance;
        return distance;
    }

    /**
     * gameOver
     */
    public gameOver(buffPos: number, buffReward: number): void {
        // show reward
        this.speedBar.visible = this.progressBar.visible = false;
        this.rewardText.text = buffReward + "";
        this.rewardContainer.visible = true;

        // dispatch event to stop sound
        let e: egret.Event = new egret.Event(Pipa.PLAY_MINI_GAME_SOUND);
        e.data = { soundName: "collect_bonus_mp3", repeat: false };
        this.dispatchEvent(e);

        // collect coins
        let gap = buffReward / 30;
        let rewardTimer = new egret.Timer(50, 30);
        rewardTimer.addEventListener(egret.TimerEvent.TIMER, function (total: number, gap: number, timer: egret.Timer) {
            this.rewardText.text = Math.floor(total - gap * timer.currentCount);
        }.bind(this, buffReward, gap, rewardTimer), this);
        rewardTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            this.rewardText.text = "0";
        }, this);
        egret.setTimeout(function (timer: egret.Timer, reward: number) {
            timer.start();

            // add coins
            // ToolbarUserCoins.add(reward);
        }.bind(this, rewardTimer, buffReward), this, 1000);

        // dispatch event
        let event: egret.Event = new egret.Event(CopaBoat.BOAT_GAME_OVER);
        event.data = { buffPos: buffPos };
        egret.setTimeout(function (event: egret.Event) {
            this.dispatchEvent(event);
        }.bind(this, event), this, 3500);
    }

    private get btnEnable(): boolean {
        return this._btnEnable;
    }

    private set btnEnable(enable: boolean) {
        this._btnEnable = enable;
        this.goBtn["trigger"](enable);
    }
}
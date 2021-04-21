
class Halloween25Wheel extends egret.DisplayObjectContainer {
    private multiple: number;
    private premio: number;
    private ganhoBonus: number;
    private wheel: egret.Bitmap;
    private premioText: egret.TextField;
    private spinBtn: TouchDownButton;

    constructor(multiple: number, premio: number, ganho: number, mcf: egret.MovieClipDataFactory) {
        super();
        
        this.multiple = multiple;
        this.premio = premio;
        this.ganhoBonus = ganho;

        // bg
        Com.addBitmapAt(this, "mini_game_json.wheel_game_bg_sd", 0, 0);

        // wheel
        this.wheel = Com.addBitmapAt(this, "mini_game_json.wheel", 710, 665);
        this.wheel.anchorOffsetX = this.wheel.anchorOffsetY = 390;
        this.wheel.rotation = 7;

        // text
        let staticText = Com.addTextAt(this, 1200, 271, 754, 255, 60, false, false);
        staticText.verticalAlign = "middle";
        staticText.fontFamily = "Righteous";
        staticText.bold = true;
        staticText.wordWrap = true;
        staticText.textColor = 0xEDC03F;
        staticText.text = MuLang.getText( "halloween_25line_wheel_text" );

        // premio
        this.premioText = Com.addTextAt(this, 1317, 597, 303, 67, 32, false, false);
        this.premioText.fontFamily = "Righteous";
        this.premioText.verticalAlign = "middle";
        this.premioText.textColor = 0xFFFFFF;
        this.premioText.text = "0";

        // premio static text
        let premioStaticText = Com.addTextAt(this, 1310, 694, 310, 73, 48, false, false);
        premioStaticText.fontFamily = "Righteous";
        premioStaticText.verticalAlign = "middle";
        premioStaticText.textColor = 0xECD026;
        premioStaticText.text = MuLang.getText( "prize", MuLang.CASE_TYPE_CAPITALIZE );

        this.spinBtn = Com.addDownButtonAt(this, "mini_game_json.btn_start", "mini_game_json.btn_start_down", 1380, 827, this.spinWheel, true);
    }

    /**
     * spin wheel
     */
    private spinWheel(): void {
        this.spinBtn.touchEnabled = false;
        this.spinBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.spinWheel, this);

        egret.Tween.get(this.wheel).wait(150).to({
            rotation: -1433 - (this.multiple - 1) * 15
        }, 6000 + this.multiple * 250, egret.Ease.sineOut).call(function () {
            this.dispatchEvent(new egret.Event(SlotMachine.BONUS_GAME_WIN, false, false, { bonus: this.ganhoBonus }));
            
            // gap
            let gap = this.ganhoBonus / 20;

            // timer
            let timer = new egret.Timer(50, 20);
            timer.addEventListener(egret.TimerEvent.TIMER, function (timer: egret.Timer, gap: number) {
                this.premioText.text = Utils.formatCoinsNumber(Math.floor(timer.currentCount * gap));
                this.premioText.size = 36 - Math.max(this.premioText.text.length - 6, 0) * 2;
            }.bind(this, timer, gap), this);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
                this.premioText.text = Utils.formatCoinsNumber(this.ganhoBonus);
                this.premioText.size = 36 - Math.max(this.premioText.text.length - 6, 0) * 2;

                egret.setTimeout(this.gameOver, this, 1000);
            }, this);
            timer.start();
        }, this);
    }

    /**
     * game over
     */
    private gameOver(): void {
        this.dispatchEvent(new egret.Event(SlotMachine.BONUS_GAME_OVER, false, false, { totalBonus: this.ganhoBonus }));
    }
}
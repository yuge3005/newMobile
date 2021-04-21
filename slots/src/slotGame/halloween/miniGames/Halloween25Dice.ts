
class Halloween25Dice extends egret.DisplayObjectContainer {
    private point: number;
    private premio: number;
    private ganhoBonus: number;
    private dicesArray: Array<egret.MovieClip>;
    private premioText: egret.TextField;

    constructor(point: number, premio: number, ganho: number, mcf: egret.MovieClipDataFactory) {
        super();

        this.point = point;
        this.premio = premio;
        this.ganhoBonus = ganho;

        // bg
        Com.addBitmapAt(this, "mini_game_json.dice_game_bg_sd", 0, 0);

        // shadow
        let shape = new egret.Shape();
        shape.graphics.beginFill(0x090909, 1);
        shape.graphics.drawRect(0, 206, 2000, 715);
        shape.graphics.endFill();
        Com.addObjectAt(this, shape, 0, 0);

        // text
        let leftBottomText = Com.addTextAt(this, 16, 951, 1248, 167, 48, false, false);
        leftBottomText.textAlign = "left";
        leftBottomText.verticalAlign = "middle";
        leftBottomText.textColor = 0xF1D218;
        leftBottomText.wordWrap = true;
        leftBottomText.text = MuLang.getText("halloween_25line_dice_text");

        // premio
        this.premioText = Com.addTextAt(this, 1311, 981, 382, 65, 38 - Math.max(premio.toString().length - 9, 0) * 2, false, false);
        this.premioText.fontFamily = "Righteous";
        this.premioText.verticalAlign = "middle";
        this.premioText.textColor = 0xFFFFFF;
        this.premioText.text = "0";

        // dices
        this.dicesArray = new Array<egret.MovieClip>(5);
        for (let i = 0; i < this.dicesArray.length; i++) {
            this.dicesArray[i] = new egret.MovieClip(mcf.generateMovieClipData("dice"));
            this.dicesArray[i].mask = new egret.Rectangle(2, 2, 234, 234);
            this.dicesArray[i].play(-1);
            Com.addObjectAt(this, this.dicesArray[i], 214 + i * 340, 232);

            this.dicesArray[i].touchEnabled = true;
            this.dicesArray[i].once(egret.TouchEvent.TOUCH_TAP, this.pickDice.bind(this, i), this);
        }
    }

    /**
     * pick dice
     */
    private pickDice(index: number): void {
        let dice = this.dicesArray[index];
        for (let i = 0; i < this.dicesArray.length; i++) {
            if (i !== index) this.dicesArray[i].touchEnabled = false;
        }

        // dice frame
        let diceFrames = [21, 17, 31, 13, 26, 1];

        egret.Tween.get(dice).to({ y: 682 }, 1500, egret.Ease.bounceOut).call(function (dice: egret.MovieClip, frame: number) {
            dice.gotoAndStop(frame);

            this.dispatchEvent(new egret.Event(SlotMachine.BONUS_GAME_WIN, false, false, { bonus: this.ganhoBonus }));
            
            // gap
            let gap = this.ganhoBonus / 20;

            // timer
            let timer = new egret.Timer(60, 20);
            timer.addEventListener(egret.TimerEvent.TIMER, function (timer: egret.Timer, gap: number) {
                this.premioText.text = Utils.formatCoinsNumber(Math.floor(timer.currentCount * gap));
                this.premioText.size = 38 - Math.max(this.premioText.text.length - 11, 0) * 1.5;
            }.bind(this, timer, gap), this);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
                this.premioText.text = Utils.formatCoinsNumber(this.ganhoBonus);
                this.premioText.size = 38 - Math.max(this.premioText.text.length - 11, 0) * 1.5;

                egret.setTimeout(this.gameOver, this, 1000);
            }, this);
            timer.start();
        }.bind(this, dice, diceFrames[this.point - 1]));
    }

    /**
     * game over
     */
    private gameOver(): void {
        this.dispatchEvent(new egret.Event(SlotMachine.BONUS_GAME_OVER, false, false, { totalBonus: this.ganhoBonus }));
    }
}
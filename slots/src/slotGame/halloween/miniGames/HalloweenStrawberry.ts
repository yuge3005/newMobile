

class HalloweenStrawberry extends egret.DisplayObjectContainer {
    private mcf: egret.MovieClipDataFactory;
    private ganho: number;
    private bonus: number;
    private bonusText: egret.TextField;
    private strawberriesContainer: egret.DisplayObjectContainer;
    private strawberryBonusArray: Array<number>;
    private currentIndex: number = 0;
    private totalBonus: number = 0;
    private maxSize: number = 0;

    // private soundManager: SlotSoundManager;

    constructor(credito: number, premio: number, bonusArray: Array<number>, mcf: egret.MovieClipDataFactory) {
        super();

        this.bonus = 0;        
        this.ganho = premio;
        this.strawberryBonusArray = bonusArray;
        // this.soundManager = soundManager;
        this.mcf = mcf;
        
        // bg
        Com.addBitmapAt(this, "mini_game_json.strawberries_bg", 0, 0);

        // credito text
        let creditoText = Com.addTextAt(this, 282, 1013, 378, 73, 48, false, false);
        creditoText.fontFamily = "Righteous";
        creditoText.verticalAlign = "middle";
        creditoText.text = Utils.formatCoinsNumber(credito);
        creditoText.size = 48 - Math.max(creditoText.text.length - 7, 0) * 2;

        // premio text
        let premioText = Com.addTextAt(this, 942, 1013, 324, 73, 48, false, false);
        premioText.fontFamily = "Righteous";
        premioText.verticalAlign = "middle";
        premioText.text = Utils.formatCoinsNumber(premio);
        premioText.size = 48 - Math.max(premioText.text.length - 7, 0) * 2;

        // bonus text
        this.bonusText = Com.addTextAt(this, 1520, 1013, 388, 73, 48, false, false);
        this.bonusText.fontFamily = "Righteous";
        this.bonusText.verticalAlign = "middle";
        this.bonusText.text = "0";
        
        // strawberries container
        this.strawberriesContainer = new egret.DisplayObjectContainer();
        this.strawberriesContainer.width = 1130;
        this.strawberriesContainer.height = 760;
        Com.addObjectAt(this, this.strawberriesContainer, 424, 199);

        // strawberries
        for (let i = 0; i < 12; i++) {
            Com.addObjectAt(this.strawberriesContainer, this.createStrawberry(i), (i % 4) * 280, Math.floor(i / 4) * 250);
        }

        // this.soundManager.play("strawberry_mp3", -1);
    }

    /**
     * create strawberry
     */
    private createStrawberry(index: number): egret.DisplayObjectContainer {
        let strawberry = new egret.DisplayObjectContainer();
        strawberry.touchEnabled = true;
        
        // yellow background
        let background = new egret.Shape();
        background.graphics.beginFill(0xFFCC00, 1);
        background.graphics.drawRect(-10, -10, 300, 260);
        background.graphics.endFill();
        background.visible = false;
        Com.addObjectAt(strawberry, background, 0, 0);

        // default animation
        let defaultAnimation = new egret.MovieClip(this.mcf.generateMovieClipData("strawberry"));
        defaultAnimation.scaleX = 1.8;
        defaultAnimation.scaleY = 1.6;
        defaultAnimation.gotoAndPlay("loop", -1);
        Com.addObjectAt(strawberry, defaultAnimation, 0, 0);

        // strawberry settings
        strawberry.touchEnabled = true;
        // mouse.setButtonMode(strawberry, true);
        // strawberry.addEventListener(mouse.MouseEvent.MOUSE_OVER, function () {
        //     this.visible = true;
        // }.bind(background), background);

        // strawberry.addEventListener(mouse.MouseEvent.MOUSE_OUT, function () {
        //     this.visible = false;
        // }.bind(background), background);

        strawberry.once(egret.TouchEvent.TOUCH_TAP, function (strawberry: egret.DisplayObjectContainer, defaultAnimation: egret.MovieClip) {
            if (this.currentIndex >= this.strawberryBonusArray.length) return;
            // disable mouse events
            strawberry.touchEnabled = false;

            let bonus = this.strawberryBonusArray[this.currentIndex];
            this.currentIndex++;

            // animation complete callback
            let animatinCompleteCallback = null;
            if (bonus !== 0) {
                // play sound
                // if (SlotSoundManager.soundOn && this.soundManager) this.soundManager.play("sound10_wav", 1);

                animatinCompleteCallback = function (strawberry: egret.DisplayObjectContainer, bonus: number) {
                    // bonus text
                    let bonusText = Com.addTextAt(strawberry, 14, 48, 250, 104, 42, false, false);
                    bonusText.textColor = 0x000000;
                    bonusText.fontFamily = "Righteous";
                    bonusText.verticalAlign = "middle";
                    bonusText.text = Utils.formatCoinsNumber(bonus);
                    bonusText.size = 42 - Math.max(bonusText.text.length - 6, 0) * 2;

                    // update total bonus text
                    this.totalBonus += bonus;
                    this.bonusText.text = Utils.formatCoinsNumber(this.totalBonus);
                    this.bonusText.size = 48 - Math.max(this.bonusText.text.length - 7, 0) * 2;

                    this.dispatchEvent(new egret.Event(SlotMachine.BONUS_GAME_WIN, false, false, {bonus: (this.totalBonus + this.ganho)}));
                }.bind(this, strawberry, bonus);
            } else {
                // play sound
                // if (SlotSoundManager.soundOn && this.soundManager) this.soundManager.play("sound2_wav", 1);

                animatinCompleteCallback = function () {
                    egret.setTimeout(function () {
                        this.soundManager.stop("strawberry_mp3");

                        this.dispatchEvent(new egret.Event(SlotMachine.BONUS_GAME_OVER, false, false, { totalBonus: this.totalBonus }));
                    }, this, 1000);
                };
            }

            defaultAnimation.once(egret.MovieClipEvent.COMPLETE, animatinCompleteCallback, this);
            defaultAnimation.gotoAndPlay(bonus === 0 ? "endAward": "award", 1);
            // this.soundManager.play( bonus === 0 ? "straw_end_wav": "straw_selct_wav", 1);
        }.bind(this, strawberry, defaultAnimation), this);
        
        return strawberry;
    }
}
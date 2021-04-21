class HalloweenCauldron extends egret.DisplayObjectContainer {
    private mcf: egret.MovieClipDataFactory;
    private cauldronsContainer: egret.DisplayObjectContainer;
    private cauldronBottomBg: egret.Bitmap;
    private bonusText: egret.TextField;
    private cauldronObjectsArray: Array<egret.DisplayObjectContainer>;
    private cauldronBonusArray: Array<number>;
    private ganho: number;
    private bonus: Array<number>;
    private aposta: number;
    private multiple: number;
    private lights: Array<egret.Bitmap>;

    private halloweenBonusMovieclipFactory: egret.MovieClipDataFactory;
    private halloweenBonusContainer: egret.DisplayObjectContainer;
    private halloweenBonusArray: Array<egret.DisplayObjectContainer>;
    private halloweenBonusDefaultAnimations: Array<egret.MovieClip>;

    // private soundManager: SlotSoundManager;
    
    constructor(credito: number, ganho: number, bonus: Array<number>, aposta: number, maxIconNumber: number, mcf: egret.MovieClipDataFactory) {
        super();

        this.width = 2000;
        this.height = 1125;
        this.ganho = ganho;
        this.bonus = bonus;
        this.aposta = aposta;
        this.multiple = maxIconNumber - 2;
        this.lights = [];
        // this.soundManager = soundManager;
        this.mcf = mcf;

        // bg
        Com.addBitmapAt(this, "mini_game_json.caldron_game_bg_new", 0, 0);

        // bottom bg
        this.cauldronBottomBg = Com.addBitmapAt(this, "mini_game_json.bonus_multiple", 804, 1021);
        this.cauldronBottomBg.scaleX = this.cauldronBottomBg.scaleY = .8;

        // credito text
        let creditoText = Com.addLabelAt(this, 372, 961, 280, 67, 42, false, false);
        creditoText.fontFamily = "Righteous";
        creditoText.textColor = 0xFFFF00;
        creditoText.setText( Utils.formatCoinsNumber(credito) );

        // premio text
        let premioText = Com.addLabelAt(this, 372, 1047, 280, 67, 42, false, false);
        premioText.fontFamily = "Righteous";
        premioText.textColor = 0xFFFF00;
        premioText.setText( Utils.formatCoinsNumber(ganho) );

        // bonus text
        this.bonusText = Com.addLabelAt(this, 372, 875, 280, 67, 42, false, false);
        this.bonusText.fontFamily = "Righteous";
        this.bonusText.textColor = 0xFFFF00;
        this.bonusText.text = "0";

        // begin cauldron game
        this.beginCauldronGame();
    }

    /**
     * begin cauldron game
     **/
    private beginCauldronGame(): void {
        // cauldrons container
        this.cauldronsContainer = new egret.DisplayObjectContainer();
        Com.addObjectAt(this, this.cauldronsContainer, 0, 0);

        // cauldrons
        this.cauldronObjectsArray = new Array<egret.DisplayObjectContainer>(5);
        for (let i = 0; i < 5; i++) {
            this.cauldronObjectsArray[i] = this.createCauldron(i);
            Com.addObjectAt(this.cauldronsContainer, this.cauldronObjectsArray[i], 2 + i * 399, 0);
        }
    }

    /**
     * create cauldron
     **/
    private createCauldron(index: number): egret.DisplayObjectContainer {
        let cauldron = new egret.DisplayObjectContainer();
        cauldron.touchEnabled = true;
        cauldron.width = 400;
        cauldron.height = 860;

        // default animation
        let defaultAnimation = new egret.MovieClip(this.mcf.generateMovieClipData("cauldron"));
        defaultAnimation.scaleX = defaultAnimation.scaleY = 2.66;
        defaultAnimation.play(-1);
        Com.addObjectAt(cauldron, defaultAnimation, 0, 527);

        cauldron.once(egret.TouchEvent.TOUCH_TAP, function (defaultAnimation: egret.MovieClip, index: number) {
            SoundManager.play( "win_bonus_wav" );

            // disable mouse events
            for (let i = 0; i < this.cauldronObjectsArray.length; i++) {
                this.cauldronObjectsArray[i].touchEnabled = false;
            }
            
            // show cauldrons bonus
            this.showCauldronsBonus(index);
        }.bind(this, defaultAnimation, index), this);

        return cauldron;
    }

    /**
     * show cauldrons bonus
     **/
    private showCauldronsBonus(index: number): void{
        // create bonus array
        let bonusArray = [0, 50, 75, 100, 150];
        let targetBonus = Math.floor(this.bonus[0] / (this.aposta * this.multiple));
        let resultBonus = new Array<number>(5);
        resultBonus[index] = targetBonus;
        bonusArray.splice(bonusArray.indexOf(targetBonus), 1);
        for (let i = 0; i < 5; i++) {
            if (i === index) continue;
            let arrayIndex = Math.floor(Math.random() * bonusArray.length);
            resultBonus[i] = bonusArray[arrayIndex];
            bonusArray.splice(arrayIndex, 1);
        }

        let bonusBitmap: egret.Bitmap = null;
        let bonusTexts = [];
        for (let i = 0; i < 5; i++) {
            if (i !== index) {
                if (resultBonus[i] === 0) {
                    bonusBitmap = Com.addBitmapAt(this.cauldronObjectsArray[i], "mini_game_json.pumpkin", 2, -10);
                    bonusBitmap.scaleX = bonusBitmap.scaleY = 2.66;
                    bonusBitmap.visible = false;
                } else {
                    // bonus text
                    let bonusText = Com.addTextAt(this.cauldronObjectsArray[i], 117, 131, 172, 235, 90, true, false);
                    bonusText.textColor = 0xFE3200;
                    bonusText.stroke = 1;
                    bonusText.strokeColor = 0xFE9F00;
                    bonusText.verticalAlign = "middle";
                    bonusText.visible = false;
                    bonusText.text = resultBonus[i] + "";

                    bonusTexts.push(bonusText);
                }
            }
        }

        // animation complete callback
        let animatinCompleteCallback = function (index: number, bonusBitmap: egret.Bitmap, bonusTexts: Array<egret.TextField>, bonus: number, event: egret.MovieClipEvent) {
            if (bonus > 0) {
                this.dispatchEvent(new egret.Event(SlotMachine.BONUS_GAME_WIN, false, false, {bonus: (this.bonus[0] + this.ganho)}));

                // bonus text
                let bonusText = Com.addTextAt(this.cauldronObjectsArray[index], 117, 131, 172, 235, 90, false, false);
                bonusText.textColor = 0xFE3200;
                bonusText.stroke = 1;
                bonusText.strokeColor = 0xFE9F00;
                bonusText.verticalAlign = "middle";
                bonusText.text = bonus + "";

                // set bonus text
                this.bonusText.text = bonus + "";
                this.bonusText.size = 42 - Math.max((this.bonusText.text.length - 6), 0) * 2;

                egret.setTimeout(function (bonus: number) {
                    this.dispatchEvent(new egret.Event(SlotMachine.BONUS_GAME_OVER, false, false, { totalBonus: bonus }));
                }.bind(this, this.bonus[0]), this, 2500);
            } else if (bonus === 0) {
                Com.addBitmapAt(this.cauldronObjectsArray[index], "mini_game_json.pumpkin", 2, -10);

                // begin halloween bonus game
                egret.setTimeout(this.beginHalloweenBonus, this, 2000);
            }

            egret.setTimeout(function (bonusBitmap: egret.Bitmap, bonusTexts: Array<egret.TextField>) {
                if (bonusBitmap) bonusBitmap.visible = true;
                for (let i = 0; i < bonusTexts.length; i++) {
                    bonusTexts[i].visible = true;
                }
            }.bind(this, bonusBitmap, bonusTexts), this, 1000);
        }.bind(this, index, bonusBitmap, bonusTexts, targetBonus);

        // bubble animation
        let bubbleAnimation = new egret.MovieClip(this.mcf.generateMovieClipData("bubble"));
        bubbleAnimation.scaleX = bubbleAnimation.scaleY = 2.66;
        bubbleAnimation.addEventListener(egret.Event.COMPLETE, animatinCompleteCallback, this);
        bubbleAnimation.play(1);
        Com.addObjectAt(this.cauldronObjectsArray[index], bubbleAnimation, 0, -17);
    }

    /**
     * begin halloween bonus game
     */
    private beginHalloweenBonus(): void {
        if (this.cauldronsContainer) this.removeChild(this.cauldronsContainer);

        // shadow
        let shape = new egret.Shape();
        shape.graphics.beginFill(0x202427, 1);
        shape.graphics.drawRect(0, 0, 2000, 860);
        shape.graphics.endFill();
        Com.addObjectAt(this, shape, 0, 0);

        this.cauldronBottomBg.texture = RES.getRes("mini_game_json.bonus_multiple_big");
        this.cauldronBottomBg.scaleX = this.cauldronBottomBg.scaleY = .8;

        // cauldrons container
        this.halloweenBonusContainer = new egret.DisplayObjectContainer();
        Com.addObjectAt(this, this.halloweenBonusContainer, 0, 0);

        // halloween bonus
        this.halloweenBonusArray = new Array<egret.DisplayObjectContainer>(5);
        this.halloweenBonusDefaultAnimations = [];
        for (let i = 0; i < 5; i++) {
            this.halloweenBonusArray[i] = this.createHalloweenBonus(i);
            Com.addObjectAt(this.halloweenBonusContainer, this.halloweenBonusArray[i], 2 + i * 399, 0);
        }

        SoundManager.play("jumping_wav");
    }

    /**
     * create halloween bonus
     */
    private createHalloweenBonus(index: number): egret.DisplayObjectContainer {
        let halloweenBonus = new egret.DisplayObjectContainer();
        halloweenBonus.touchEnabled = true;

        // default animation
        let defaultAnimation = new egret.MovieClip(this.mcf.generateMovieClipData("pumpkin"));
        defaultAnimation.scaleX = defaultAnimation.scaleY = 2;
        defaultAnimation.gotoAndPlay("loop", -1);
        this.halloweenBonusDefaultAnimations.push(defaultAnimation);
        Com.addObjectAt(halloweenBonus, defaultAnimation, 50, 124);

        // settings
        halloweenBonus.touchEnabled = true;
        // mouse.setButtonMode(halloweenBonus, true);
        halloweenBonus.once(egret.TouchEvent.TOUCH_TAP, function (defaultAnimation: egret.MovieClip, index: number) {
            // play sound
            SoundManager.play("bonus3_wav");

            // disable mouse events
            for (let i = 0; i < this.halloweenBonusArray.length; i++) {
                this.halloweenBonusArray[i].touchEnabled = false;
            }

            this.halloweenBonusDefaultAnimations.map((mv, idx) => {
                if (idx !== index) mv.gotoAndStop(1);
            });

            // show halloween bonus
            this.showHalloweenBonus(index);
        }.bind(this, defaultAnimation, index), this);

        return halloweenBonus;
    }

    /**
     * show halloween bonus
     **/
    private showHalloweenBonus(index: number): void {
        let bonusArray = [150, 200, 250, 500, 1000];
        let targetBonus = Math.floor(this.bonus[1] / this.aposta);
        let resultBonus = new Array<number>(5);
        bonusArray.splice(bonusArray.indexOf(targetBonus), 1);
        let bonusTexts: Array<egret.TextField> = [];
        for (let i = 0; i < 5; i++) {
            let arrayIndex = Math.floor(Math.random() * bonusArray.length);
            if (i === index) {
                bonusTexts[i] = Com.addTextAt(this.halloweenBonusArray[i], 117, 131, 172, 235, 90, true, false);
                bonusTexts[i].text = targetBonus + "";

                // set bonus text
                this.bonusText.text = targetBonus + "";
            } else {
                bonusTexts[i] = Com.addTextAt(this.halloweenBonusArray[i], 117, 131, 172, 235, 90, true, false);
                bonusTexts[i].text = bonusArray[arrayIndex] + "";
                bonusArray.splice(arrayIndex, 1);
            }
            bonusTexts[i].visible = false;
            bonusTexts[i].textColor = 0xFE3200;
            bonusTexts[i].stroke = 1;
            bonusTexts[i].strokeColor = 0xFE9F00;
            bonusTexts[i].verticalAlign = "middle";
        }

        // animation over callback
        let animationOverCallback = function (index: number, bonusTexts: Array<egret.TextField>) {
            // show win coins number
            this.dispatchEvent(new egret.Event(SlotMachine.BONUS_GAME_WIN, false, false, { bonus: (this.bonus[1] + this.ganho) }));
            
            // show target bonus text
            if (bonusTexts.length > index) bonusTexts[index].visible = true;

            egret.setTimeout(function (index: number, bonusTexts: Array<egret.TextField>) {
                for (let i = 0; i < bonusTexts.length; i++) {
                    if (i === index) continue;
                    if (bonusTexts[i]) bonusTexts[i].visible = true;
                }
            }.bind(this, index, bonusTexts), this, 500);

            egret.setTimeout(function (bonus: number) {
                this.dispatchEvent(new egret.Event(SlotMachine.BONUS_GAME_OVER, false, false, { totalBonus: bonus }));
            }.bind(this, this.bonus[1]), this, 2000);
        }.bind(this, index, bonusTexts);
        
        // halloween animation
        this.halloweenBonusDefaultAnimations[index].addEventListener(egret.Event.COMPLETE, animationOverCallback, this);
        this.halloweenBonusDefaultAnimations[index].gotoAndPlay(1, 1);
    }
}
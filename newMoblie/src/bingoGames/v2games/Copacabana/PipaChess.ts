
class PipaChess extends egret.DisplayObjectContainer {
    public static MINI_GAME_OVER: string = "MINI_GAME_OVER";
    public static REROLL_DICE: string = "REROLL_DICE";
    public static GET_BOAT_GAME: string = "GET_BOAT_GAME";

    public buffIconConfig: Array<Object>;

    private leftDice: PipaDice;
    private rightDice: PipaDice;

    private noBonusContainer: egret.DisplayObjectContainer;
    private noBonusText: egret.TextField;
    private noBonusProgress: egret.Bitmap;

    private pointText: egret.TextField;
    private roundCardText: egret.TextField;

    private cardsShadow: egret.Shape;
    private isAfterBoat: boolean;
    private rerollCard: egret.DisplayObjectContainer;
    private canReroll: boolean = true;
    private rerollPrice: egret.TextField;
    private roundCard: egret.DisplayObjectContainer;
    private noBonusTitle: egret.DisplayObjectContainer;
    private singleBuffIcon: egret.DisplayObjectContainer;
    private doublePowerCard: egret.DisplayObjectContainer;
    private doublePowerBuffIcon: egret.DisplayObjectContainer;
    private doublePowerPrice: egret.TextField;
    private isDoublePower: boolean;
    private buffInfoContainer: egret.DisplayObjectContainer;
    private buffInfoIcon: egret.Bitmap;
    private buffInfoName: egret.TextField;
    private buffInfoIntroduce: egret.TextField;
    
    private playBtn: TouchDownButton;
    private chess: JumpChess;
    private chessPlace: egret.Bitmap;

    private canChoise: boolean = false;
    private assetJson: string;
    private chessPositionArray: Array<any>;

    private currentPosition: number = 0;
    private point: number;

    private tutorail: boolean = false;
    private tutorailContainer: egret.DisplayObjectContainer;
    private tutorailSteps: Array<egret.DisplayObjectContainer>;
    private tutorailPrizeText: egret.TextField;
    private tutorailIndex: number = 0;

    private config: Array<number>;

    constructor(currentPosition: number, config: Array<number>) {
        super();

        this.width = 755;
        this.height = 462;
        this.currentPosition = currentPosition;
        this.config = config;

        this.assetJson = "pipa_chess_json";

        // bg
        Com.addBitmapAt(this, this.assetJson + ".bg", 0, 0);

        let sp: egret.Shape = new egret.Shape;
        GraphicTool.drawRect( sp, new egret.Rectangle( 0, 0, 755, 138 ), 0, false, 0.4 );
        sp.touchEnabled = true;
        Com.addObjectAt( this, sp, 0, 462 );

        // chess position array
        this.chessPositionArray = [
            { x: 377, y: 87, anchorOffsetX: 67, anchorOffsetY: 41 },
            { x: 419, y: 129, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 456, y: 152, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 494, y: 173, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 532, y: 196, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 604, y: 219, anchorOffsetX: 67, anchorOffsetY: 41 },
            { x: 533, y: 242, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 494, y: 264, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 456, y: 285, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 418, y: 307, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 377, y: 350, anchorOffsetX: 67, anchorOffsetY: 41 },
            { x: 337, y: 306, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 299, y: 284, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 260, y: 262, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 220, y: 241, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 146, y: 217, anchorOffsetX: 67, anchorOffsetY: 41 },
            { x: 221, y: 194, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 260, y: 173, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 298, y: 151, anchorOffsetX: 32, anchorOffsetY: 21 },
            { x: 336, y: 128, anchorOffsetX: 32, anchorOffsetY: 21 }
        ];

        // buff icon config
        this.buffIconConfig = [
            { bgAsset: ".icon_x", buffBgAsset: ".positive_x", asset: ".positive_x", anchorOffsetX: 32, anchorOffsetY: 21, name: "no_bonus", introduceName: "" },
            { bgAsset: ".small_board_green", buffBgAsset: ".positive_green", asset: ".icon_ninebox", anchorOffsetX: 14, anchorOffsetY: 20, name: "portuguese_stone", introduceName: "ninebox_introduce" },
            { bgAsset: ".small_board_yellow", buffBgAsset: ".positive_yellow", asset: ".icon_star", anchorOffsetX: 19, anchorOffsetY: 28, name: "wiz_beach_soccer", introduceName: "pipa_star_introduce" },
            { bgAsset: ".small_board_yellow", buffBgAsset: ".positive_yellow", asset: ".icon_plus", anchorOffsetX: 16, anchorOffsetY: 26, name: "divine_shell", introduceName: "pipa_plus_introduce" },
            { bgAsset: ".small_board_yellow", buffBgAsset: ".positive_yellow", asset: ".icon_color", anchorOffsetX: 17, anchorOffsetY: 26, name: "rainbow", introduceName: "color_introduce" },
            { bgAsset: ".small_board_red", buffBgAsset: ".positive_red", asset: ".icon_doller", anchorOffsetX: 19, anchorOffsetY: 23, name: "cold_coconut", introduceName: "cold_cocount_introduce" },
            { bgAsset: ".big_board_purple", buffBgAsset: ".positive_purple", asset: ".icon_choice_number", anchorOffsetX: 29, anchorOffsetY: 47, name: "magic_ball", introduceName: "magic_ball_introduce" },
            { bgAsset: ".big_board_green", buffBgAsset: ".positive_green", asset: ".icon_mark", anchorOffsetX: 26, anchorOffsetY: 42, name: "umbrella_beach", introduceName: "pipa_mark_introduce" },
            { bgAsset: ".small_board_green", buffBgAsset: ".positive_green", asset: ".icon_card", anchorOffsetX: 20, anchorOffsetY: 32, name: "ball_fish", introduceName: "pipa_card_introduce" },
            { bgAsset: ".big_board_red", buffBgAsset: ".positive_red", asset: ".icon_bomb", anchorOffsetX: 29, anchorOffsetY: 48, name: "seaquake", introduceName: "pipa_bomb_introduce" },
            { bgAsset: ".big_board_blue", buffBgAsset: ".positive_blue", asset: ".icon_boat", anchorOffsetX: 47, anchorOffsetY: 36, name: "currency", introduceName: "jet_sprint_introduce" },
            { bgAsset: ".big_board_blue", buffBgAsset: ".positive_blue", asset: ".icon_boat", anchorOffsetX: 47, anchorOffsetY: 36, name: "jet_sprint", introduceName: "jet_sprint_introduce" }
        ];

        let languageText = GameUIItem.languageText;
        languageText["ninebox_introduce"] = { en: "Add a new square (center 9 grid) pattern to your pay table",
            es: "Agregue un nuevo patrón cuadrado (cuadrícula del centro 9) a su tabla de premios",
            pt: "Adicione um novo padrão de quadrados (grade 9) à sua tabela de prêmios" };
        languageText["color_introduce"] = { en: "Reveal the color of the extra ball",
            es: "Revela el color de la bola extra",
            pt: "Revela a cor da bola extra" };
        languageText["cold_cocount_introduce"] = { en: "Double the price when winning double line",
            es: "Doble el premio al ganar la doble línea",
            pt: "Dobra o prêmio ao ganhar linha dupla" };
        languageText["jet_sprint_introduce"] = { en: "Take a boat tour on Copacabana",
            es: "Haga un paseo en Lancha por Copacabana",
            pt: "Faça um passeio de Lancha por Copacabana" };
        languageText["magic_ball_introduce"] = { en: "Give you the option to choose the number you want.",
            es: "Usted puede eligir el número que quieras.",
            pt: "Você pode escolher o número que quiser." };
        languageText["pipa_star_introduce"] = { en: "Get 2 free extra balls",
            es: "Gane 2 bolas extra gratis",
            pt: "Receba 2 bolas extras grátis" };
        languageText["pipa_plus_introduce"] = { en: "Get 2 more balls in the first round",
            es: "Gana 2 bolas más en la primera ronda",
            pt: "Ganhe 2 bolas a mais na primeira rodada" };
        languageText["pipa_mark_introduce"] = { en: "Mark the line of the first ball on each card",
            es: "Marque la línea de la primera bola en cada tarjeta",
            pt: "Marque a linha da primeira bola em cada cartela" };
        languageText["pipa_bomb_introduce"] = { en: "Mark the number with a water ball. Explode the water ball when the number is marked",
            es: "Marca el número con la bola de agua. Ocurrirá una explosión cuando el número ha ido sorteado",
            pt: "Marca o número com a bexiga de água. A bexiga explodirá quando o número for sorteado" };
        languageText["pipa_card_introduce"] = { en: "Receive a number already marked on each card",
            es: "Tenga un número marcado en cada cartela.",
            pt: "Tenha um número já marcado em cada cartela." };

        // add chesses
        let count = config.length;
        for (let i = 0; i <= count / 2; i++) {
            this.appendBuffInGame(this, i);
            if (i > 0 && i < count / 2) {
                this.appendBuffInGame(this, count - i);
            }
        }

        // dice movieclip factory
        let diceMovieClipFactory = new egret.MovieClipDataFactory(RES.getRes("pipa_dice_json"), RES.getRes("pipa_dice_png"));
        // dices
        this.leftDice = new PipaDice(diceMovieClipFactory, { x: 161, y: 130 });
        this.rightDice = new PipaDice(diceMovieClipFactory, { x: 520, y: 95 });
        this.leftDice.frameRate = this.rightDice.frameRate = 72;
        this.leftDice.scaleX = this.leftDice.scaleY = this.rightDice.scaleX = this.rightDice.scaleY = 0.9;
        this.leftDice.visible = this.rightDice.visible = false;
        Com.addObjectAt(this, this.leftDice, this.leftDice.defaultPosition["x"], this.leftDice.defaultPosition["y"]);
        Com.addObjectAt(this, this.rightDice, this.rightDice.defaultPosition["x"], this.rightDice.defaultPosition["y"]);
        this.leftDice["selfIndex"] = this.getChildIndex(this.leftDice);
        this.rightDice["selfIndex"] = this.getChildIndex(this.rightDice);

        // chess place
        this.chessPlace = Com.addBitmapAt(this, this.assetJson + ".doctor_place", this.chessPositionArray[currentPosition]["x"], this.chessPositionArray[currentPosition]["y"]);
        this.chessPlace.anchorOffsetX = 32;
        this.chessPlace.anchorOffsetY = 26;

        // chess
        this.chess = new JumpChess(this.assetJson + ".doctor_jump");
        this.chess.anchorOffsetX = 15;
        this.chess.anchorOffsetY = 39;
        this.chess.bindPlace(this.chessPlace);
        this.chess.addEventListener(JumpChess.JUMP, function () {
            // dispatch event to play sound
            let event = new egret.Event(Pipa.PLAY_MINI_GAME_SOUND);
            event.data = { soundName: "chess_mp3", repeat: false };
            this.dispatchEvent(event);

            if (this.point > 0) {
                this.point--;
                this.pointText.text = this.point + "";
            }
        }, this);
        Com.addObjectAt(this, this.chess, this.chessPositionArray[currentPosition]["x"], this.chessPositionArray[currentPosition]["y"]);

        // point text
        this.pointText = Com.addTextAt(this, 323, 130, 106, 51, 48, false, false);
        this.pointText.fontFamily = "LuckiestGuy";
        this.pointText.verticalAlign = "middle";
        this.pointText.textColor = 0xE99D30;
        this.pointText.filters = [new egret.DropShadowFilter(2, 45, 0x666666, 1, 3, 3)];

        /**
         * no bonus
         */
        this.noBonusContainer = new egret.DisplayObjectContainer();
        this.noBonusContainer.width = 147;
        this.noBonusContainer.height = 53;
        this.noBonusContainer.visible = false;
        Com.addObjectAt(this, this.noBonusContainer, 37, 370);
        // no bonus bg
        Com.addBitmapAt(this.noBonusContainer, this.assetJson + ".progress_bg", 26, 1);
        // buff icon
        Com.addBitmapAt(this.noBonusContainer, this.assetJson + ".positive_x", 0, 0);
        // no bonus text
        this.noBonusText = Com.addTextAt(this.noBonusContainer, 54, 3, 87, 30, 14, false, false);
        this.noBonusText.fontFamily = "Righteous";
        this.noBonusText.verticalAlign = "middle";
        this.noBonusText.wordWrap = true;
        this.noBonusText.textColor = 0xFFFFFF;
        this.noBonusText.visible = false;
        // progress
        this.noBonusProgress = Com.addBitmapAt(this.noBonusContainer, this.assetJson + ".progress_bar", 54, 38);
        this.noBonusProgress.scale9Grid = new egret.Rectangle(2, 2, 3, 3);
        this.noBonusProgress.width = 0;
        this.noBonusProgress.visible = false;
        
        // cards shadow
        this.cardsShadow = new egret.Shape();
        GraphicTool.drawRect( this.cardsShadow, new egret.Rectangle( 0, 0, 755, 462 ), 0, false, 0.45 );
        this.cardsShadow.visible = false;
        Com.addObjectAt(this, this.cardsShadow, 0, 0);

        // reroll card
        this.rerollCard = new egret.DisplayObjectContainer();
        this.rerollCard.width = 171;
        this.rerollCard.height = 194;
        this.rerollCard.alpha = 0;
        this.rerollCard.visible = false;
        Com.addObjectAt(this, this.rerollCard, 74, 70);
        // bg
        Com.addBitmapAt(this.rerollCard, this.assetJson + ".popup_bg", 0, 0);
        // icon
        Com.addBitmapAt(this.rerollCard, this.assetJson + ".icon_dice", 44, 69);
        // text
        let rerollText = Com.addTextAt(this.rerollCard, 18, 12, 135, 60, 20, true, false);
        rerollText.fontFamily = "TCM_conden";
        rerollText.verticalAlign = "middle";
        rerollText.textColor = 0x143582;
        rerollText.wordWrap = true;
        rerollText.stroke = 2;
        rerollText.strokeColor = 0xFFFFFF;
        rerollText.text = GameUIItem.languageText["rollAgain"][GlobelSettings.language];
        // reroll btn
        let rerollBtn = new egret.DisplayObjectContainer();
        rerollBtn.width = 84;
        rerollBtn.height = 34;
        rerollBtn.touchEnabled = true;
        mouse.setButtonMode(rerollBtn, true);
        rerollBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rerollDice, this);
        Com.addObjectAt(this.rerollCard, rerollBtn, 45, 129);
        // reroll bg
        Com.addBitmapAt(rerollBtn, this.assetJson + ".btn_popup", 0, 0);
        // second currency
        let roundDineroIcon = Com.addBitmapAt(rerollBtn, this.assetJson + ".dinero", 18, 16);
        roundDineroIcon.scaleX = roundDineroIcon.scaleY = 0.9;
        roundDineroIcon.anchorOffsetX = 19;
        roundDineroIcon.anchorOffsetY = 10;
        roundDineroIcon.rotation = -45;
        // reroll price
        this.rerollPrice = Com.addTextAt(rerollBtn, 34, 3, 44, 28, 24, false, false);
        this.rerollPrice.fontFamily = "TCM_conden";
        this.rerollPrice.verticalAlign = "middle";
        this.rerollPrice.textColor = 0xFFFFFF;
        this.rerollPrice.text = "0";

        // round card
        this.roundCard = new egret.DisplayObjectContainer();
        this.roundCard.width = 171;
        this.roundCard.height = 194;
        this.roundCard.alpha = 0;
        this.roundCard.visible = false;
        Com.addObjectAt(this, this.roundCard, 291, 70);
        // bg
        Com.addBitmapAt(this.roundCard, this.assetJson + ".popup_bg_02", 0, 0);
        // ## hide now
        // title
        this.noBonusTitle = new egret.DisplayObjectContainer();
        this.noBonusTitle.width = 227;
        this.noBonusTitle.height = 28;
        this.noBonusTitle.visible = false;
        Com.addObjectAt(this.roundCard, this.noBonusTitle, -27, -27);
        Com.addBitmapAt(this.noBonusTitle, this.assetJson + ".popup_title_bg", 15, 0);
        let noBonusTitle = Com.addTextAt(this.noBonusTitle, 0, 0, 227, 28, 16, false, false);
        noBonusTitle.verticalAlign = "middle";
        noBonusTitle.textColor = 0x6886E7;
        noBonusTitle.filters = [new egret.DropShadowFilter(1, 90, 0x000000, 1, 0, 1)];
        noBonusTitle.text = GameUIItem.languageText["no_bonus"][GlobelSettings.language];
        // text
        let roundCardText = Com.addTextAt(this.roundCard, 18, 12, 135, 60, 20, true, false);
        roundCardText.fontFamily = "TCM_conden";
        roundCardText.verticalAlign = "middle";
        roundCardText.textColor = 0x893E12;
        roundCardText.wordWrap = true;
        roundCardText.stroke = 2;
        roundCardText.strokeColor = 0xFFFFFF;
        this.roundCardText = roundCardText;
        // round btn
        let roundBtn = new egret.DisplayObjectContainer();
        roundBtn.width = 84;
        roundBtn.height = 34;
        roundBtn.touchEnabled = true;
        mouse.setButtonMode(roundBtn, true);
        roundBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getRounds, this);
        Com.addObjectAt(this.roundCard, roundBtn, 45, 129);
        // round bg
        Com.addBitmapAt(roundBtn, this.assetJson + ".btn_popup", 0, 0);
        // get round
        let roundBtnText = Com.addTextAt(roundBtn, 0, 0, 84, 34, 24, false, false);
        roundBtnText.fontFamily = "TCM_conden";
        roundBtnText.verticalAlign = "middle";
        roundBtnText.textColor = 0xFFFFFF;
        roundBtnText.text = GameUIItem.languageText["accept"][GlobelSettings.language];

        // double power card
        this.doublePowerCard = new egret.DisplayObjectContainer();
        this.doublePowerCard.width = 171;
        this.doublePowerCard.height = 194;
        this.doublePowerCard.alpha = 0;
        this.doublePowerCard.visible = false;
        Com.addObjectAt(this, this.doublePowerCard, 505, 70);
        // bg
        Com.addBitmapAt(this.doublePowerCard, this.assetJson + ".popup_bg", 0, 0);
        // double buff icon
        this.doublePowerBuffIcon = new egret.DisplayObjectContainer();
        Com.addObjectAt(this.doublePowerCard, this.doublePowerBuffIcon, 0, 0);
        // text
        let doublePowerText = Com.addTextAt(this.doublePowerCard, 18, 12, 135, 60, 20, true, false);
        doublePowerText.fontFamily = "TCM_conden";
        doublePowerText.verticalAlign = "middle";
        doublePowerText.textColor = 0x143582;
        doublePowerText.wordWrap = true;
        doublePowerText.stroke = 2;
        doublePowerText.strokeColor = 0xFFFFFF;
        doublePowerText.text = GameUIItem.languageText["doubleDuration"][GlobelSettings.language];
        // double power btn
        let doublePowerBtn = new egret.DisplayObjectContainer();
        doublePowerBtn.width = 84;
        doublePowerBtn.height = 34;
        doublePowerBtn.touchEnabled = true;
        mouse.setButtonMode(doublePowerBtn, true);
        doublePowerBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getDoublePower, this);
        Com.addObjectAt(this.doublePowerCard, doublePowerBtn, 45, 129);
        // double power bg
        Com.addBitmapAt(doublePowerBtn, this.assetJson + ".btn_popup", 0, 0);
        // second currency
        let doubleDineroIcon = Com.addBitmapAt(doublePowerBtn, this.assetJson + ".dinero", 18, 16);
        doubleDineroIcon.scaleX = doubleDineroIcon.scaleY = 0.9;
        doubleDineroIcon.anchorOffsetX = 19;
        doubleDineroIcon.anchorOffsetY = 10;
        doubleDineroIcon.rotation = -45;
        // double power text
        this.doublePowerPrice = Com.addTextAt(doublePowerBtn, 34, 3, 44, 28, 24, false, false);
        this.doublePowerPrice.fontFamily = "TCM_conden";
        this.doublePowerPrice.verticalAlign = "middle";
        this.doublePowerPrice.textColor = 0xFFFFFF;
        this.doublePowerPrice.text = "0";

        // buff icon container
        this.buffInfoContainer = new egret.DisplayObjectContainer();
        this.buffInfoContainer.width = 305;
        this.buffInfoContainer.height = 108;
        this.buffInfoContainer.visible = false;
        this.buffInfoContainer.alpha = 0;
        Com.addObjectAt(this, this.buffInfoContainer, 225, 300);
        // bg
        let bgShadow = new egret.Shape();
        GraphicTool.drawRect( bgShadow, new egret.Rectangle( 0, 0, 305, 108 ), 0, false, 0.55, 18 );
        Com.addObjectAt(this.buffInfoContainer, bgShadow, 0, 0);
        // buff icon
        this.buffInfoIcon = Com.addBitmapAt(this.buffInfoContainer, this.buffIconName(this.config[this.currentPosition]), 45, 39);
        // buff name
        this.buffInfoName = Com.addTextAt(this.buffInfoContainer, 8, 62, 72, 25, 12, false, false);
        this.buffInfoName.fontFamily = "Righteous";
        this.buffInfoName.verticalAlign = "middle";
        this.buffInfoName.wordWrap = true;
        this.buffInfoName.textColor = 0xFFFFFF;
        // buff introduce
        this.buffInfoIntroduce = Com.addTextAt(this.buffInfoContainer, 87, 7, 207, 89, 15, false, false);
        this.buffInfoIntroduce.fontFamily = "Righteous";
        this.buffInfoIntroduce.verticalAlign = "middle";
        this.buffInfoIntroduce.textAlign = "left";
        this.buffInfoIntroduce.lineSpacing = 2;
        this.buffInfoIntroduce.wordWrap = true;
        this.buffInfoIntroduce.textColor = 0xFFFFFF;

        // play btn
        this.playBtn = Com.addDownButtonAt(this, this.assetJson + ".btn_roll_down", this.assetJson + ".btn_roll", 602, 497, this.rollDice, true);
        this.playBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.rollDice, this);

        // text
        let playBtnText = Com.addTextAt(this, 0, 0, 129, 91, 36, false, false);
        playBtnText.fontFamily = "TCM_conden";
        playBtnText.verticalAlign = "middle";
        playBtnText.wordWrap = true;
        playBtnText.filters = [new egret.DropShadowFilter(0, 90, 0x999999, 1, 0, 2)];
        playBtnText.textColor = 0xFFFFFF;
        playBtnText.text = GameUIItem.languageText["RollDice"][GlobelSettings.language];

        this.playBtn.setText(playBtnText);
        
        // check is first time to play pipa chess game
        let firstPlayPipaChess = window.localStorage.getItem(PlayerConfig.player("user.id") + "_firstPlayPipaChess");
        if (firstPlayPipaChess === null) {
            this.tutorail = true;
        }

        this.visible = false;
        if (this.tutorail) this.addTutorail();
    }

    public checkBuffBoat( bufPos: number ): void{
        this.currentPosition = bufPos;
        let buffId = this.config[this.currentPosition];
        if (buffId === 11) {
            this.visible = true;
            this.isAfterBoat = true;
            this.rerollCard.visible = false;
            this.startBoatGame();
        } else {
            this.visible = false;
        }
    }

    /**
     * append buff
     */
    private appendBuffInGame(target: egret.DisplayObjectContainer, i: number): void {
        let buffId = this.config[i];
        // chess bg
        let bg = Com.addBitmapAt(target, this.assetJson + this.buffIconConfig[buffId]["bgAsset"], this.chessPositionArray[i]["x"], this.chessPositionArray[i]["y"]);
        bg.anchorOffsetX = this.chessPositionArray[i]["anchorOffsetX"];
        bg.anchorOffsetY = this.chessPositionArray[i]["anchorOffsetY"];

        if (buffId !== 0) {
            // buff icon
            let buffIcon = Com.addBitmapAt(target, this.buffIconName(buffId), this.chessPositionArray[i]["x"], this.chessPositionArray[i]["y"]);
            buffIcon.anchorOffsetX = this.buffIconConfig[buffId]["anchorOffsetX"];
            buffIcon.anchorOffsetY = this.buffIconConfig[buffId]["anchorOffsetY"];
        }
    }
    
    /**
     * get buff icon asset name
     */
    public buffIconName( buffId: number ): string{
        return this.assetJson + this.buffIconConfig[buffId]["asset"];
    }

    /**
     * start game
     */
    public startGame(): void {
        this.chess.x = this.chessPlace.x = this.chessPositionArray[this.currentPosition]["x"];
        this.chess.y = this.chessPlace.y = this.chessPositionArray[this.currentPosition]["y"];

        this.visible = true;
        this.noBonusProgress.width = 0;
        this.noBonusContainer.visible = this.noBonusText.visible = this.noBonusProgress.visible = false;
        this.pointText.visible = false;

        // init game
        this.isAfterBoat = this.isDoublePower = false;
        this.cardsShadow.visible = false;
        this.rerollCard.alpha = this.roundCard.alpha = this.doublePowerCard.alpha = 0;
        this.rerollCard.visible = this.roundCard.visible = this.doublePowerCard.visible = false;
        this.canReroll = true;
        this.playBtn.visible = true;
        this.playBtn.once(egret.TouchEvent.TOUCH_TAP, this.rollDice, this);
    }

    /**
     * roll dice
     */
    private rollDice(): void {
        let ev: egret.Event = new egret.Event(PipaChess.REROLL_DICE);
        ev.data = { action: "normal" };
        this.dispatchEvent( ev );
        
        Pipa.resetBgMusicTimer();
    }

    /**
     * run dice
     */
    public runDice(points: Array<number>, rounds: number, pos: number, rerollPrice: number, doublePowerPrice: number): number{
        // set point
        if( points.length == 2 ){
            this.point = points[0] + points[1];
        }
        else{ 
            alert( "ow my god!" );
            return;
        }

        this.roundCardText.text = rounds + " " + GameUIItem.languageText["rounds"][GlobelSettings.language];
        this.rerollPrice.text = rerollPrice + "";
        this.rerollPrice.size = 24 - Math.max((rerollPrice + "").length - 4, 0) * 4;
        this.doublePowerPrice.text = doublePowerPrice + "";
        this.doublePowerPrice.size = 24 - Math.max((doublePowerPrice + "").length - 4, 0) * 4;

        // hide cards
        this.cardsShadow.visible = false;
        this.rerollCard.alpha = this.roundCard.alpha = this.doublePowerCard.alpha = 0;
        this.rerollCard.visible = this.roundCard.visible = this.doublePowerCard.visible = false;
        this.pointText.text = this.point + "";
        this.setChildIndex(this.leftDice, 1000);
        this.setChildIndex(this.rightDice, 1001);

        // chess data
        let chessData = [this.chessPositionArray[this.currentPosition]];
        for (let i = 0; i < this.point; i++) {
            if (this.currentPosition === this.chessPositionArray.length - 1) this.currentPosition = 0;
            else this.currentPosition++;

            chessData.push(this.chessPositionArray[this.currentPosition]);
        }
        this.chess.loadData(chessData);
        this.chess.once(JumpChess.MOVE_OVER, this.showCards, this);

        // dispatch event to play sound
        let event = new egret.Event(Pipa.PLAY_MINI_GAME_SOUND);
        event.data = { soundName: "dice_mp3", repeat: false };
        egret.setTimeout(function (event: egret.Event) {
            this.dispatchEvent(event);
        }.bind(this, event), this, 400);

        // dice animation
        this.leftDice.runTo({ x: 326, y: 177 });
        this.rightDice.runTo({ x: 364, y: 199 });
        this.rightDice.once(PipaDice.RUN_OVER, function (points: Array<number>) {
            this.pointText.visible = true;

            this.setChildIndex(this.leftDice, this.leftDice["selfIndex"]);
            this.setChildIndex(this.rightDice, this.rightDice["selfIndex"]);
            this.leftDice.movieClip.gotoAndStop(15 + Number(points[0]));
            this.rightDice.movieClip.gotoAndStop(15 + Number(points[1]));

            egret.setTimeout( function(){ this.leftDice.movieClip.gotoAndStop(15 + Number(points[0])); this.rightDice.movieClip.gotoAndStop(15 + Number(points[1])); }, this, 40 );

            egret.setTimeout(function () {
                this.chess.startMove();
            }, this, 1000);
        }.bind(this, points), this);

        return this.config[pos];
    }

    /**
     * show cards
     */
    private showCards(): void {
        this.playBtn.visible = false;
        this.pointText.visible = false;
        this.leftDice.reset();
        this.rightDice.reset();

        let buffId = this.config[this.currentPosition];
        if (buffId === 11) {
            this.isAfterBoat = true;
            this.startBoatGame();
        } else {
            // dispatch event to play sound
            let event = new egret.Event(Pipa.PLAY_MINI_GAME_SOUND);
            event.data = { soundName: buffId === 0 ? "bad_buff_mp3" : "nice_buff_mp3", repeat: false };
            this.dispatchEvent(event);

            // single buff icon
            if (this.singleBuffIcon && this.singleBuffIcon.parent) this.singleBuffIcon.parent.removeChild(this.singleBuffIcon);
            this.singleBuffIcon = this.buildBuffIcon();
            Com.addObjectAt(this.roundCard, this.singleBuffIcon, 111 - this.singleBuffIcon.width / 2, 119 - this.singleBuffIcon.height / 2);

            // double power buff icon
            this.doublePowerBuffIcon.removeChildren();
            this.doublePowerBuffIcon.width = this.singleBuffIcon.width + 30;
            this.doublePowerBuffIcon.height = this.singleBuffIcon.height;
            Com.addObjectAt(this.doublePowerBuffIcon, this.buildBuffIcon(), 0, 0);
            Com.addObjectAt(this.doublePowerBuffIcon, this.buildBuffIcon(), 30, 0);
            this.doublePowerBuffIcon.x = 111 - (this.singleBuffIcon.width + 30) / 2;
            this.doublePowerBuffIcon.y = 119 - this.singleBuffIcon.height / 2;

            this.rerollCard.y = this.roundCard.y = this.doublePowerCard.y = buffId === 0 ? 170 : 70;

            if (buffId !== 0) {
                egret.Tween.get(this.buffInfoContainer).set({ visible: true }).call(function (buffId: number) {
                    // buff icon
                    this.buffInfoIcon.texture = RES.getRes(this.assetJson + this.buffIconConfig[buffId]["asset"]);
                    this.buffInfoIcon.anchorOffsetX = this.buffInfoIcon.width >> 1;
                    this.buffInfoIcon.anchorOffsetY = this.buffInfoIcon.height >> 1;
                    // buff name
                    this.buffInfoName.text = GameUIItem.languageText[this.buffIconConfig[buffId]["name"]][GlobelSettings.language];
                    // buff introduce
                    this.buffInfoIntroduce.text = GameUIItem.languageText[this.buffIconConfig[buffId]["introduceName"]][GlobelSettings.language];
                }, this, [buffId]).to({ alpha: 1 }, 500);

                if (this.tutorail) {
                    GraphicTool.drawRect(this.tutorailContainer["shadow"], new egret.Rectangle(0, 0, 755, 462), 0xFFFFFF, true, 0);
                    this.showTutorail();
                }
            }

            this.canChoise = true;
            this.cardsShadow.visible = true;
            // this.noBonusTitle.visible = buffId === 0;
            egret.Tween.get(this.rerollCard).set({ visible: !this.isAfterBoat && this.canReroll }).to({ alpha: 1 }, 500);
            egret.Tween.get(this.roundCard).wait(200).set({ visible: true }).to({ alpha: 1 }, 500);
            // if (buffId !== 0) {
            //     egret.Tween.get(this.doublePowerCard).wait(400).set({ visible: true }).to({ alpha: 1 }, 500).call(function () {
            //         this.canChoise = true;
            //     }, this);
            // }
        }
    }

    /**
     * reroll dice
     */
    private rerollDice(): void {
        if (!this.canChoise) return;

        let canRoll: boolean = ( this.parent as Pipa ).checkDinero( Number( this.rerollPrice.text ) );
        if( canRoll )return;

        this.point = 0;
        this.pointText.visible = false;

        this.canReroll = false;
        this.cardsShadow.visible = false;
        this.buffInfoContainer.visible = false;
        this.rerollCard.alpha = this.roundCard.alpha = this.doublePowerCard.alpha = 0;
        this.rerollCard.visible = this.roundCard.visible = this.doublePowerCard.visible = false;

        let ev: egret.Event = new egret.Event(PipaChess.REROLL_DICE);
        ev.data = { action: "overwrite" };
        this.dispatchEvent( ev );

        Pipa.resetBgMusicTimer();
    }

    /**
     * get rounds
     */
    private getRounds(): void {
        if (!this.canChoise) return;
        this.canChoise = false;

        this.showBuffResult();
        Pipa.resetBgMusicTimer();
    }

    /**
     * get double power
     **/
    private getDoublePower(): void {
        if (!this.canChoise) return;

        let canRoll: boolean = ( this.parent as Pipa ).checkDinero( Number( this.doublePowerPrice.text ) );
        if( canRoll )return;

        this.canChoise = false;

        let ev: egret.Event = new egret.Event(PipaChess.REROLL_DICE);
        ev.data = { action: "double" };
        this.dispatchEvent(ev);

        Pipa.resetBgMusicTimer();
    }

    /**
     * get double power callback
     */
    public getDoublePowerCallback(): void {
        this.isDoublePower = true;
        this.showBuffResult();
    }

    /**
     * update position
     */
    public kartGameOver(position: number, roundNumber: number): number {
        // set rounds text
        this.roundCardText.text = roundNumber + " " + GameUIItem.languageText["rounds"][GlobelSettings.language];

        // chess data
        let chessData = [this.chessPositionArray[this.currentPosition], this.chessPositionArray[position]];
        this.chess.loadData(chessData);
        this.chess.once(JumpChess.MOVE_OVER, this.showCards, this);

        this.currentPosition = position;
        this.chess.startMove();

        return this.config[position];
    }

    /**
     * show buff result
     */
    private showBuffResult(): void {
        egret.Tween.get(this.buffInfoContainer).to({ alpha: 0 }, 500).set({ visible: false });
        egret.Tween.get(this.rerollCard).to({ alpha: 0 }, 500).set({ visible: false });
        egret.Tween.get(this.roundCard).to({ alpha: 0 }, 500).set({ visible: false });
        egret.Tween.get(this.doublePowerCard).to({ alpha: 0 }, 500).set({ visible: false }).call(function () {
            this.cardsShadow.visible = false;
            this.noBonusContainer.visible = true;

            this.flyBuffToBoard();
        }, this);
    }

    /**
     * start boat game
     */
    public startBoatGame() {
        let iconBoatGame = Com.addBitmapAt(this, "pipa_" + GlobelSettings.language + "_json.icon_boat_game", 212, 161);
        iconBoatGame.alpha = 0;

        egret.Tween.get(iconBoatGame).to({ alpha: 1 }, 500).wait(1000).to({ alpha: 0 }, 500).call(function (icon: egret.Bitmap) {
            if (icon.parent) icon.parent.removeChild(icon);
            this.dispatchEvent(new egret.Event(PipaChess.GET_BOAT_GAME));
        }.bind(this, iconBoatGame), this);
    }

    /**
     * fly buff to board
     */
    private flyBuffToBoard(): void {
        
        let buffIcon: FlyBuff = this.buildBuffIcon();

        buffIcon.addEventListener(FlyBuff.MOVE_COMPLETE, function (icon: egret.Bitmap) {
            this.noBonusText.text = this.currnetBuffName();
            this.noBonusText.visible = true;
            this.noBonusProgress.visible = true;

            // double power progress
            let redProgress = null;
            if (this.isDoublePower) {
                redProgress = new egret.Shape();
                redProgress.width = 84;
                redProgress.height = 7;
                redProgress.mask = new egret.Rectangle(0, 0, 0, 7);
                Com.addObjectAt(this.noBonusContainer, redProgress, 54, 38);

                // draw rect
                GraphicTool.drawRect(redProgress, new egret.Rectangle(0, 0, 84, 7), 0xFF0000);
            }

            egret.Tween.get(this.noBonusProgress).to({ width: 84 }, 1000).call(function (icon: egret.Bitmap, doublePower: egret.Shape = null) {
                // callback
                let callback = function (icon: egret.Bitmap, doublePower: egret.Shape = null) {
                    if (icon.parent) icon.parent.removeChild(icon);
                    if (doublePower && doublePower.parent) doublePower.parent.removeChild(doublePower);
                    this.miniGameOver();
                }.bind(this, icon, doublePower);

                if (doublePower !== null) {
                    egret.Tween.get(doublePower.mask).to({ width: 84 }, 1000).wait(500).call(callback, this);
                } else {
                    egret.setTimeout(callback, this, 500);
                }
            }.bind(this, icon, redProgress), this);
        }.bind(this, buffIcon), this);
        buffIcon.moveTo({ x: 62, y: 398 });
    }

    public buildBuffIcon(): FlyBuff{
        // buff animation
        let buffId = this.config[this.currentPosition];
        let buffIcon: FlyBuff = new FlyBuff();
        buffIcon.width = 51;
        buffIcon.height = 56;
        buffIcon.anchorOffsetX = 25;
        buffIcon.anchorOffsetY = 28;
        Com.addObjectAt(this, buffIcon, this.chessPositionArray[this.currentPosition]["x"], this.chessPositionArray[this.currentPosition]["y"]);
        // bg
        Com.addBitmapAt(buffIcon, this.assetJson + this.buffIconConfig[buffId]["buffBgAsset"], 0, 0);
        if (buffId !== 0) {
            // add buff
            let buff = Com.addBitmapAt(buffIcon, this.assetJson + this.buffIconConfig[buffId]["asset"], 25, 26);
            buff.anchorOffsetX = buff.width >> 1;
            buff.anchorOffsetY = buff.height >> 1;
            if (buff.width > 36 || buff.height > 36) {
                buff.scaleX = buff.scaleY = Math.min(36 / buff.width, 36 / buff.height);
            }
        }
        return buffIcon;
    }

    /**
     * add tutorail
     */
    private addTutorail(): void {
        this.addTutorailLanguage();

        this.tutorailContainer = new egret.DisplayObjectContainer();
        this.tutorailContainer.width = 755;
        this.tutorailContainer.height = 462;
        this.tutorailContainer.touchEnabled = true;
        this.tutorailContainer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hideTutorail, this);
        Com.addObjectAt(this, this.tutorailContainer, 0, 0);
        // shadow
        this.tutorailContainer["shadow"] = new egret.Shape();
        GraphicTool.drawRect(this.tutorailContainer["shadow"], new egret.Rectangle(0, 0, 755, 590), 0x000000, false, 0.55);
        Com.addObjectAt(this.tutorailContainer, this.tutorailContainer["shadow"], 0, 0);

        // steps
        this.tutorailSteps = new Array<egret.DisplayObjectContainer>(3);
        // steps -> 0
        this.tutorailSteps[0] = new egret.DisplayObjectContainer();
        this.tutorailSteps[0].width = 755;
        this.tutorailSteps[0].height = 462;
        Com.addObjectAt(this.tutorailContainer, this.tutorailSteps[0], 0, 0);
        // chess
        let chessPlace = Com.addBitmapAt(this.tutorailSteps[0], this.assetJson + ".doctor_place", this.chessPositionArray[this.currentPosition]["x"] - 32, this.chessPositionArray[this.currentPosition]["y"] - 26);
        let chess = Com.addBitmapAt(this.tutorailSteps[0], this.assetJson + ".doctor_jump", this.chessPositionArray[this.currentPosition]["x"] - 15, this.chessPositionArray[this.currentPosition]["y"] - 39);
        // chess arrow
        let chessArrow = Com.addBitmapAt(this.tutorailSteps[0], "pipa_tutorail_json.tutorail_arrow", 391, 227);
        chessArrow.rotation = -135;
        // chess tutorail text
        this.addTutorailText(this.tutorailSteps[0], 123, 196, 278, 62, 18, GameUIItem.languageText["pipa_chess_tutorail"][GlobelSettings.language] );
        // go btn
        Com.addBitmapAt(this.tutorailSteps[0], this.assetJson + ".btn_roll", 602, 497);
        // go btn text
        let playBtnText = Com.addTextAt(this.tutorailSteps[0], 602, 497, 129, 91, 36, false, false);
        playBtnText.fontFamily = "TCM_conden";
        playBtnText.verticalAlign = "middle";
        playBtnText.wordWrap = true;
        playBtnText.filters = [new egret.DropShadowFilter(0, 90, 0x999999, 1, 0, 2)];
        playBtnText.textColor = 0xFFFFFF;
        playBtnText.text = GameUIItem.languageText["RollDice"][GlobelSettings.language];
        // go btn arrow
        let goBtnArrow = Com.addBitmapAt(this.tutorailSteps[0], "pipa_tutorail_json.tutorail_arrow", 650, 410);
        this.addTutorailText(this.tutorailSteps[0], 472, 340, 278, 62, 18, GameUIItem.languageText["pipa_chess_go_btn_tutorail"][GlobelSettings.language] );

        // steps -> 1
        this.tutorailSteps[1] = new egret.DisplayObjectContainer();
        this.tutorailSteps[1].width = 755;
        this.tutorailSteps[1].height = 462;
        this.tutorailSteps[1].visible = false;
        Com.addObjectAt(this.tutorailContainer, this.tutorailSteps[1], 0, 0);
        // buffs
        let buffArray = [0, 19, 1, 17, 4, 15, 5, 14, 7, 11, 10];
        for (let i = 0; i < buffArray.length; i++) {
            this.appendBuffInGame(this.tutorailSteps[1], buffArray[i]);
        }
        // no buff arrow
        let noBuffArrow = Com.addBitmapAt(this.tutorailSteps[1], "pipa_tutorail_json.tutorail_arrow", 247, 80);
        noBuffArrow.scaleX = -1;
        noBuffArrow.rotation = -75;
        // no buff tutorail text
        this.addTutorailText(this.tutorailSteps[1], 3, 61, 238, 62, 18, GameUIItem.languageText["pipa_no_buff_tutorail"][GlobelSettings.language] );
        // buff arrow
        let buffArrow = Com.addBitmapAt(this.tutorailSteps[1], "pipa_tutorail_json.tutorail_arrow", 492, 40);
        buffArrow.rotation = 90;
        // buff tutorail text
        this.addTutorailText(this.tutorailSteps[1], 500, 22, 238, 62, 18, GameUIItem.languageText["pipa_buff_tutorail"][GlobelSettings.language] );

        // steps -> 2
        this.tutorailSteps[2] = new egret.DisplayObjectContainer();
        this.tutorailSteps[2].width = 755;
        this.tutorailSteps[2].height = 462;
        this.tutorailSteps[2].visible = false;
        Com.addObjectAt(this.tutorailContainer, this.tutorailSteps[2], 0, 0);
        // card arrow
        let cardArrow = Com.addBitmapAt(this.tutorailSteps[2], "pipa_tutorail_json.tutorail_arrow", 226, 191);
        cardArrow.scaleX = -1;
        cardArrow.rotation = -90;
        this.addTutorailText(this.tutorailSteps[2], 0, 172, 220, 76, 14, GameUIItem.languageText["pipa_card_tutorail"][GlobelSettings.language] );
        // introduce arrow
        let introduceArrow = Com.addBitmapAt(this.tutorailSteps[2], "pipa_tutorail_json.tutorail_arrow", 570, 389);
        introduceArrow.scaleX = -1;
        introduceArrow.rotation = 90;
        this.addTutorailText(this.tutorailSteps[2], 575, 344, 180, 62, 16, GameUIItem.languageText["pipa_introduce_tutorail"][GlobelSettings.language] );

        // continue bg
        Com.addBitmapAt(this.tutorailContainer, "pipa_tutorail_json.continue_bg", 209, 405);
        // continue text
        let continueText = Com.addTextAt(this.tutorailContainer, 209, 405, 318, 43, 16, false, false);
        continueText.fontFamily = "Righteous";
        continueText.verticalAlign = "middle";
        continueText.textColor = 0xFFFFFF;
        continueText.text = GameUIItem.languageText["click_to_continue"][GlobelSettings.language];
    }

    /**
     * add tutorail text
     */
    private addTutorailText(target: egret.DisplayObjectContainer, x: number, y: number, width: number, height: number, size: number, text: string): void {
        let bg = Com.addBitmapAt(target, "pipa_tutorail_json.tutorail_txt_bg", x, y);
        bg.scale9Grid = new egret.Rectangle(30, 30, 168, 2);
        bg.width = width;
        bg.height = height;
        let textField = Com.addTextAt(target, x + 20, y, width - 40, height, size, false, false);
        textField.fontFamily = "Righteous";
        textField.verticalAlign = "middle";
        textField.wordWrap = true;
        textField.textColor = 0xFFFFFF;
        textField.text = text;
    }

    /**
     * show tutorail
     */
    private showTutorail(): void {
        this.tutorailSteps[this.tutorailIndex].visible = true;
        this.tutorailContainer.visible = true;
    }

    /**
     * hide tutorail
     */
    private hideTutorail(): void {
        this.tutorailSteps[this.tutorailIndex].visible = false;
        this.tutorailIndex++;
        this.tutorailContainer.visible = false;

        if (this.tutorailIndex === this.tutorailSteps.length) {
            this.tutorail = false;
            window.localStorage.setItem(PlayerConfig.player("user.id") + "_firstPlayPipaChess", "false");
        } else if (this.tutorailIndex < this.tutorailSteps.length - 1) {
            this.showTutorail();
        }
    }

    public currnetBuffName(): string{
        return GameUIItem.languageText[this.buffIconConfig[this.config[this.currentPosition]]["name"]][GlobelSettings.language];
    }

    /**
     * mini game over
     */
    private miniGameOver(): void {
        this.dispatchEvent(new egret.Event(PipaChess.MINI_GAME_OVER));
    }

    private addTutorailLanguage(){
        let languageText = GameUIItem.languageText;
        languageText["pipa_chess_tutorail"] = { en: "The pin will move according to the number on dices",
            es: "El pino se moverá de acuerdo con el numero de dados",
            pt: "O pino se moverá de acordo com o numéro dos dados" };
        languageText["pipa_chess_go_btn_tutorail"] = { en: "The PLAY button will be changed to you Roll the Dices",
            es: "El botón JUGAR cambiará para tu Jugar los dados",
            pt: "O botão JOGAR mudará para que você jogue os dados" };
        languageText["pipa_no_buff_tutorail"] = { en: "X is mean no Buff", es: "X significa sin poderes", pt: "X significa sem poderes" };
        languageText["pipa_buff_tutorail"] = { en: "There are 10 different buffs on the board",
            es: "Hay 10 diferentes poderes en el tablero",
            pt: "Existem 10 poderes diferentes no tabuleiro" };
        languageText["pipa_card_tutorail"] = { en: "When you got a buff you need to Acept to continue the game",
            es: "Cuando usted gana un poder usted debe aceptar para continuar el juego",
            pt: "Quando você ganha um poder você deve aceitar para continuar o jogo" };
        languageText["pipa_introduce_tutorail"] = { en: "The explanation for the buff", es: "Explicación del poder", pt: "Explicação do poder" };
	}
}

class JumpChess extends egret.Bitmap {
    public static JUMP: string = "JUMP";
    public static MOVE_OVER: string = "MOVE_OVER";
    private time: number = 550;
    private dataArray: Array<Object>;
    private chessPlace: egret.Bitmap;

    private startPosition: Object;
    private middlePosition: Object;
    private endPosition: Object;

    constructor(texture: string) {
        super(RES.getRes(texture));
        this.dataArray = [];
    }

    public bindPlace(place: egret.Bitmap): void {
        this.chessPlace = place;
    }

    public loadData(dataArray: Array<Object>): JumpChess {
        for (let i = 0; i < dataArray.length; i++) {
            this.dataArray.push(dataArray[i]);
        }
        return this;
    }

    public startMove(): void {
        if (this.dataArray.length < 2) {
            this.dataArray = [];
            this.dispatchEvent(new egret.Event(JumpChess.MOVE_OVER));
            return;
        }

        this.startPosition = this.dataArray.splice(0, 1)[0];
        this.endPosition = this.dataArray[0];
        this.middlePosition = {x: (this.endPosition["x"] + this.startPosition["x"]) / 2, y: (this.endPosition["y"] + this.startPosition["y"]) / 2 - 65}
        this.factor = 0;
        egret.Tween.get(this).to({ factor: 1 }, this.time).call(function () {
            this.dispatchEvent(new egret.Event(JumpChess.JUMP));
            this.startMove();
        }, this);
    }

    public get factor(): number {
        return 0;
    }

    public set factor(factor: number) {
        this.x = Math.pow(1 - factor, 2) * this.startPosition["x"] + 2 * factor * (1 - factor) * this.middlePosition["x"] + Math.pow(factor, 2) * this.endPosition["x"];
        this.y = Math.pow(1 - factor, 2) * this.startPosition["y"] + 2 * factor * (1 - factor) * this.middlePosition["y"] + Math.pow(factor, 2) * this.endPosition["y"];
        this.chessPlace.x = this.startPosition["x"] + (this.endPosition["x"] - this.startPosition["x"]) * factor;
        this.chessPlace.y = this.startPosition["y"] + (this.endPosition["y"] - this.startPosition["y"]) * factor;
    }
}

class PipaDice extends egret.DisplayObjectContainer {
    public static RUN_OVER: string = "RUN_OVER";

    public movieClip: egret.MovieClip;    
    public defaultPosition: Object;

    private startPosition: Object;
    private middlePosition: Object;
    private endPosition: Object;

    constructor(movieClipFactory: egret.MovieClipDataFactory, defaultPosition: Object) {
        super();

        this.width = 60;
        this.height = 60;

        this.movieClip = Com.addMovieClipAt(this, movieClipFactory, "dice", 0, 0);
        this.defaultPosition = defaultPosition;
    }

    public runTo(position: Object): void {
        this.visible = true;
        this.movieClip.gotoAndPlay("loop", -1);
        this.startPosition = { x: this.x, y: this.y };
        this.middlePosition = { x: (position["x"] + this.x) / 2, y: this.y };
        this.endPosition = position;

        egret.Tween.get(this).to({ factor: 1 }, 900, egret.Ease.sineIn).call(this.runOver, this);
    }

    private runOver(): void {
        this.dispatchEvent(new egret.Event(PipaDice.RUN_OVER));
    }

    public reset(): void {
        this.visible = false;
        this.x = this.defaultPosition["x"];
        this.y = this.defaultPosition["y"];
    }

    public get factor(): number {
        return 0;
    }

    public set factor(factor: number) {
        this.x = Math.pow(1 - factor, 2) * this.startPosition["x"] + 2 * factor * (1 - factor) * this.middlePosition["x"] + Math.pow(factor, 2) * this.endPosition["x"];
        this.y = Math.pow(1 - factor, 2) * this.startPosition["y"] + 2 * factor * (1 - factor) * this.middlePosition["y"] + Math.pow(factor, 2) * this.endPosition["y"];
    }

    public get frameRate(): number {
        return this.movieClip.frameRate;
    }

    public set frameRate(frameRate: number) {
        this.movieClip.frameRate = frameRate;
    }
}

class FlyBuff extends egret.DisplayObjectContainer {
    public static MOVE_COMPLETE: string = "MOVE_COMPLETE";

    private startPosition: Object;
    private middlePosition: Object;
    private endPosition: Object;

    public moveTo(target: Object): void {
        this.startPosition = { x: this.x, y: this.y };
        this.middlePosition = { x: (target["x"] + this.x) >> 1, y: this.y - 50 };
        this.endPosition = target;

        this.factor = 0;
        egret.Tween.get(this).to({ factor: 1 }, 1000).call(function () {
            this.dispatchEvent(new egret.Event(FlyBuff.MOVE_COMPLETE));
        }, this);
    }

    public get factor(): number {
        return 0;
    }

    public set factor(factor: number) {
        this.x = Math.pow(1 - factor, 2) * this.startPosition["x"] + 2 * factor * (1 - factor) * this.middlePosition["x"] + Math.pow(factor, 2) * this.endPosition["x"];
        this.y = Math.pow(1 - factor, 2) * this.startPosition["y"] + 2 * factor * (1 - factor) * this.middlePosition["y"] + Math.pow(factor, 2) * this.endPosition["y"];
    }
}
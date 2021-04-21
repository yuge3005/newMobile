
class HalloweenXDevilPopup extends Popup {
    public static bet: number;

    constructor() {
        super();
    }

    protected init() {
        this.bgAssetName = "halloweenx_popup_" + UserDataVo.lang + "_json.popup_devil";
        this.closeButtonAssetName = "";

        super.init();

        let topLeftText = Com.addTextAt(this, 411, 552, 288, 55, 42, false, false);
        topLeftText.fontFamily = "Righteous";
        topLeftText.verticalAlign = "middle";
        topLeftText.textColor = 0x54EA55;
        topLeftText.text = Lanuage.getValue("halloweenX_devil_wheel_text");

        let topRightText = Com.addTextAt(this, 911, 552, 288, 55, 42, false, false);
        topRightText.fontFamily = "Righteous";
        topRightText.verticalAlign = "middle";
        topRightText.textColor = 0x54EA55;
        topRightText.text = Lanuage.getValue("halloweenX_devil_medal_text");

        let betText = Com.addTextAt(this, 883, 739, 160, 41, 36, false, false);
        betText.fontFamily = "Righteous";
        betText.textAlign = "left";
        betText.verticalAlign = "middle";
        betText.text = "" + HalloweenXDevilPopup.bet;

        let bottomText = Com.addTextAt(this, 561, 790, 462, 55, 42, false, false);
        bottomText.fontFamily = "Righteous";
        bottomText.verticalAlign = "middle";
        bottomText.textColor = 0x54EA55;
        bottomText.text = Lanuage.getValue("halloweenX_devil_total_bonus");

        Com.addButtonAt(this, "halloweenx_popup_" + UserDataVo.lang + "_json.play_now", 813, 950, this.onClose, 1.1, 1);
    }
}
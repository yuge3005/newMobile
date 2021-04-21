class HalloweenXDevilPopup extends GenericPo {

    protected static get classAssetName() {
        return "halloweenXDevilPopup";
    }

    constructor() {
        super();
    }

    protected init() {
        this.bgAssetName = "halloweenx_popup_pt_json.popup_devil";
        this.closeButtonAssetName = "";

        super.init();

        let topLeftText = Com.addTextAt(this, 411, 552, 288, 55, 42, false, false);
        topLeftText.fontFamily = "Righteous";
        topLeftText.verticalAlign = "middle";
        topLeftText.textColor = 0x54EA55;
        topLeftText.text = MuLang.getText("halloweenX_devil_wheel_text");

        let topRightText = Com.addTextAt(this, 911, 552, 288, 55, 42, false, false);
        topRightText.fontFamily = "Righteous";
        topRightText.verticalAlign = "middle";
        topRightText.textColor = 0x54EA55;
        topRightText.text = MuLang.getText("halloweenX_devil_medal_text");

        let betText = Com.addTextAt(this, 883, 739, 160, 41, 36, false, false);
        betText.fontFamily = "Righteous";
        betText.textAlign = "left";
        betText.verticalAlign = "middle";
        betText.text = "" + GameData.currentBet;

        let bottomText = Com.addTextAt(this, 561, 790, 462, 55, 42, false, false);
        bottomText.fontFamily = "Righteous";
        bottomText.verticalAlign = "middle";
        bottomText.textColor = 0x54EA55;
        bottomText.text = MuLang.getText("halloweenX_devil_total_bonus");

        let bt: TouchDownButton = Com.addDownButtonAt(this, "halloweenx_popup_pt_json.play_now", "halloweenx_popup_pt_json.play_now", 813, 910, this.onClose, true);
        bt.x = this.bg.width - bt.width >> 1;
    }
}
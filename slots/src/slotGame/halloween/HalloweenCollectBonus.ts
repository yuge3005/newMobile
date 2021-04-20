class HalloweenCollectBonus extends GenericPo {
    public static bonus: number = 0;

    protected static get classAssetName() {
        return "halloweenMinigamePopup";
    }

    constructor() {
        super();
    }

    protected init() {
        this.bgAssetName = "halloween_popup_pt_json.award_bg";
        this.closeButtonAssetName = "";

        super.init();

        // title
        Com.addBitmapAt(this, "halloween_popup_pt_json.header", 372, 132);

        // bonus text
        let bonusText = Com.addTextAt(this, 119, 385, 750, 141, 50, true, true);
        bonusText.fontFamily = "Righteous";
        bonusText.verticalAlign = "middle";
        bonusText.textColor = 0xFFE200;
        bonusText.stroke = 4;
        bonusText.strokeColor = 0xB72100;
        bonusText.scaleX = bonusText.scaleY = 2;
        bonusText.text = Utils.formatCoinsNumber(HalloweenCollectBonus.bonus);
        bonusText.size = 100 - Math.max(bonusText.text.length - 10, 0) * 5;

        // close btn
        Com.addDownButtonAt(this, "halloween_popup_pt_json.collect", "halloween_popup_pt_json.collect", 869, 888, this.closePopup, true);
    }

    /**
     * close popup
     */
    private closePopup(): void {
        super.onClose(null);
    }
}
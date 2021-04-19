
class HalloweenCauldronPopup extends Popup {
    protected get classAssetName() {
        return "";
    }

    constructor() {
        super();
    }

    protected init() {
        this.bgAssetName = "halloween_popup_" + UserDataVo.lang + "_json.popup_cauldron";
        this.closeButtonAssetName = "";

        super.init();

        Com.addButtonAt(this, "halloween_popup_" + UserDataVo.lang + "_json.start", 432, 586, this.closePopup, 1.1, 1);
    }

    /**
     * close popup
     **/
    private closePopup(): void {
        super.onClose(null);
    }
}
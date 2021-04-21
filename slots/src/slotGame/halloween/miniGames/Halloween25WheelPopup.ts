
class Halloween25WheelPopup extends Popup {

    constructor() {
        super();
    }

    protected init() {
        this.bgAssetName = "halloween25_popup_" + UserDataVo.lang + "_json.popup_wheel";
        this.closeButtonAssetName = "";

        super.init();

        Com.addButtonAt(this, "halloween25_popup_" + UserDataVo.lang + "_json.start", 340, 490, this.closePopup, 1.1, 1);
    }

    /**
     * close popup
     **/
    private closePopup(): void {
        super.onClose(null);
    }
}
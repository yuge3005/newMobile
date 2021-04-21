class Halloween25WheelPopup extends GenericPo {

    protected static get classAssetName() {
        return "halloween25WheelPopup";
    }

    constructor() {
        super();
    }

    protected init() {
        this.bgAssetName = "halloween25_popup_pt_json.popup_wheel";
        this.closeButtonAssetName = "";

        super.init();

        let bt: TouchDownButton = Com.addDownButtonAt(this, "halloween25_popup_pt_json.start", "halloween25_popup_pt_json.start", 340, 490, this.onClose, true);
        bt.x = this.bg.width - bt.width >> 1;
    }

    /**
     * close popup
     **/
    private closePopup(): void {
        super.onClose(null);
    }
}
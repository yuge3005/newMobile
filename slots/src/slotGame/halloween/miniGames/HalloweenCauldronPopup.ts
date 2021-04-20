class HalloweenCauldronPopup extends GenericPo {
    protected static get classAssetName() {
        return "halloweenMinigamePopup";
    }

    constructor() {
        super();
    }

    protected init() {
        this.bgAssetName = "halloween_popup_pt_json.popup_cauldron";
        this.closeButtonAssetName = "";

        super.init();

        let bt: TouchDownButton = Com.addDownButtonAt(this, "halloween_popup_pt_json.start", "halloween_popup_pt_json.start", 432, 540, this.onClose, true);
        bt.x = this.bg.width - bt.width >> 1;
    }

    protected onClose(): void {
        super.onClose(null);
    }
}
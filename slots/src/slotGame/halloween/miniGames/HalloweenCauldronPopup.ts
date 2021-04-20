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

        Com.addDownButtonAt(this, "halloween_popup_pt_json.start", "halloween_popup_pt_json.start", 432, 586, this.onClose, true);
    }

    protected onClose(): void {
        super.onClose(null);

        
    }
}
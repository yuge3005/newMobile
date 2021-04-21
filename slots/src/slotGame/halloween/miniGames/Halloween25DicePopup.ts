class Halloween25DicePopup extends GenericPo {

    protected static get classAssetName() {
        return "halloween25DicePopup";
    }

    constructor() {
        super();
    }

    protected init() {
        this.bgAssetName = "halloween25_popup_pt_json.popup_dice";
        this.closeButtonAssetName = "";

        super.init();

        let bt: TouchDownButton = Com.addDownButtonAt(this, "halloween25_popup_pt_json.start", "halloween25_popup_pt_json.start", 340, 490, this.onClose, true);
        bt.x = this.bg.width - bt.width >> 1;
    }
}
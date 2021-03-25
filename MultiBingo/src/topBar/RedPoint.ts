class RedPoint extends egret.DisplayObjectContainer {
    private text: egret.TextField;

    constructor() {
        super();

        Com.addBitmapAt(this, "lobby_json.red_point", 0, 0);

        this.text = Com.addLabelAt(this, 0, 0, 50, 50, 28, false, false);
        this.text.fontFamily = "Righteous";

        this.anchorOffsetX = this.anchorOffsetY = 25;
    }

    /**
     * check
     */
    public check(num: number): void {
        this.visible = num > 0;
        this.text.text = "" + num;
    }
}
class FlyBuff extends egret.DisplayObjectContainer {
    public static MOVE_COMPLETE: string = "MOVE_COMPLETE";

    private startPosition: Object;
    private middlePosition: Object;
    private endPosition: Object;

    public moveTo(target: Object): void {
        this.startPosition = { x: this.x, y: this.y };
        this.middlePosition = { x: (target["x"] + this.x) >> 1, y: this.y - 50 };
        this.endPosition = target;

        this.factor = 0;
        egret.Tween.get(this).to({ factor: 1 }, 1000).call(function () {
            this.dispatchEvent(new egret.Event(FlyBuff.MOVE_COMPLETE));
        }, this);
    }

    public get factor(): number {
        return 0;
    }

    public set factor(factor: number) {
        this.x = Math.pow(1 - factor, 2) * this.startPosition["x"] + 2 * factor * (1 - factor) * this.middlePosition["x"] + Math.pow(factor, 2) * this.endPosition["x"];
        this.y = Math.pow(1 - factor, 2) * this.startPosition["y"] + 2 * factor * (1 - factor) * this.middlePosition["y"] + Math.pow(factor, 2) * this.endPosition["y"];
    }
}
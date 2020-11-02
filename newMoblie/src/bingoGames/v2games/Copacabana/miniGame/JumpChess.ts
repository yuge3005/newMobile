
class JumpChess extends egret.Bitmap {
    public static JUMP: string = "JUMP";
    public static MOVE_OVER: string = "MOVE_OVER";
    private time: number = 550;
    private dataArray: Array<Object>;
    private chessPlace: egret.Bitmap;

    private startPosition: Object;
    private middlePosition: Object;
    private endPosition: Object;

    constructor(texture: string) {
        super(RES.getRes(texture));
        this.dataArray = [];
    }

    public bindPlace(place: egret.Bitmap): void {
        this.chessPlace = place;
    }

    public loadData(dataArray: Array<Object>): JumpChess {
        for (let i = 0; i < dataArray.length; i++) {
            this.dataArray.push(dataArray[i]);
        }
        return this;
    }

    public startMove(): void {
        if (this.dataArray.length < 2) {
            this.dataArray = [];
            this.dispatchEvent(new egret.Event(JumpChess.MOVE_OVER));
            return;
        }

        this.startPosition = this.dataArray.splice(0, 1)[0];
        this.endPosition = this.dataArray[0];
        this.middlePosition = {x: (this.endPosition["x"] + this.startPosition["x"]) / 2, y: (this.endPosition["y"] + this.startPosition["y"]) / 2 - 65}
        this.factor = 0;
        egret.Tween.get(this).to({ factor: 1 }, this.time).call(function () {
            this.dispatchEvent(new egret.Event(JumpChess.JUMP));
            this.startMove();
        }, this);
    }

    public get factor(): number {
        return 0;
    }

    public set factor(factor: number) {
        this.x = Math.pow(1 - factor, 2) * this.startPosition["x"] + 2 * factor * (1 - factor) * this.middlePosition["x"] + Math.pow(factor, 2) * this.endPosition["x"];
        this.y = Math.pow(1 - factor, 2) * this.startPosition["y"] + 2 * factor * (1 - factor) * this.middlePosition["y"] + Math.pow(factor, 2) * this.endPosition["y"];
        this.chessPlace.x = this.startPosition["x"] + (this.endPosition["x"] - this.startPosition["x"]) * factor;
        this.chessPlace.y = this.startPosition["y"] + (this.endPosition["y"] - this.startPosition["y"]) * factor;
    }
}
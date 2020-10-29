class PipaDice extends egret.DisplayObjectContainer {
    public static RUN_OVER: string = "RUN_OVER";

    public movieClip: egret.MovieClip;    
    public defaultPosition: Object;

    private startPosition: Object;
    private middlePosition: Object;
    private endPosition: Object;

    constructor(movieClipFactory: egret.MovieClipDataFactory, defaultPosition: Object) {
        super();

        this.width = 60;
        this.height = 60;

        this.movieClip = Com.addMovieClipAt(this, movieClipFactory, "dice", 0, 0);
        this.defaultPosition = defaultPosition;
    }

    public runTo(position: Object): void {
        this.visible = true;
        this.movieClip.gotoAndPlay("loop", -1);
        this.startPosition = { x: this.x, y: this.y };
        this.middlePosition = { x: (position["x"] + this.x) / 2, y: this.y };
        this.endPosition = position;

        egret.Tween.get(this).to({ factor: 1 }, 900, egret.Ease.sineIn).call(this.runOver, this);
    }

    private runOver(): void {
        this.dispatchEvent(new egret.Event(PipaDice.RUN_OVER));
    }

    public reset(): void {
        this.visible = false;
        this.x = this.defaultPosition["x"];
        this.y = this.defaultPosition["y"];
    }

    public get factor(): number {
        return 0;
    }

    public set factor(factor: number) {
        this.x = Math.pow(1 - factor, 2) * this.startPosition["x"] + 2 * factor * (1 - factor) * this.middlePosition["x"] + Math.pow(factor, 2) * this.endPosition["x"];
        this.y = Math.pow(1 - factor, 2) * this.startPosition["y"] + 2 * factor * (1 - factor) * this.middlePosition["y"] + Math.pow(factor, 2) * this.endPosition["y"];
    }

    public get frameRate(): number {
        return this.movieClip.frameRate;
    }

    public set frameRate(frameRate: number) {
        this.movieClip.frameRate = frameRate;
    }
}
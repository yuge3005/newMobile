declare class TouchDownButton extends egret.DisplayObjectContainer {
    private upState;
    private downState;
    disabledFilter: egret.ColorMatrixFilter;
    static readonly isRightClick: boolean;
    enabled: boolean;
    constructor(upState: string, downState: string);
    protected onTouchBegin(event: egret.TouchEvent): void;
    private onTouchEnd(event);
    protected onTouchTap(event: egret.TouchEvent): void;
    setButtonText(txt: egret.TextField): void;
}
declare class BmpText extends egret.BitmapText {
    private _color;
    textColor: number;
    constructor();
    setText(str: string): void;
}
/**
 * ChildObjectManager
 */
declare class Com {
    constructor();
    /**
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    static createBitmapByName(name: string): egret.Bitmap;
    static addObjectAt(target: egret.DisplayObjectContainer, obj: egret.DisplayObject, x: number, y: number): void;
    static addBitmapAt(target: egret.DisplayObjectContainer, assetName: string, x: number, y: number): egret.Bitmap;
    static addBitmapAtMiddle(target: egret.DisplayObjectContainer, assetName: string, x: number, y: number): egret.Bitmap;
    static addRotateBitmapAt(target: egret.DisplayObjectContainer, assetName: string, x: number, y: number, duration: number): egret.Bitmap;
    static addMovieClipAt(target: egret.DisplayObjectContainer, mcf: egret.MovieClipDataFactory, assetName: string, x?: number, y?: number): egret.MovieClip;
    static addTextAt(target: egret.DisplayObjectContainer, x: number, y: number, width: number, height: number, size: number, stroke?: boolean, bold?: boolean): egret.TextField;
    static addLabelAt(target: egret.DisplayObjectContainer, x: number, y: number, width: number, height: number, size: number, stroke?: boolean, bold?: boolean): TextLabel;
    static addBitmapTextAt(target: egret.DisplayObjectContainer, fontName: string, x: number, y: number, textAlign?: string, size?: number, color?: number): egret.BitmapText;
    static addDownButtonAt(target: egret.DisplayObjectContainer, assetNormal: string, assetTouched: string, x: number, y: number, onClickCallBack: Function, enableButton: boolean): TouchDownButton;
}
declare class GraphicTool {
    constructor();
    static drawRect(target: egret.Shape | egret.Sprite, rect: egret.Rectangle, color?: number, clearFirst?: boolean, alpha?: number, roundRect?: number, lineThick?: number, lineColor?: number, lineAlpha?: number): void;
    static drawRectangles(target: egret.Shape | egret.Sprite, rectangles: Array<egret.Rectangle>, color?: number, clearFirst?: boolean, alpha?: number): void;
    static drawCircle(target: egret.Shape, center: egret.Point, r: number, color: number, clearFirst?: boolean, alpha?: number, lineThick?: number, lineColor?: number, lineAlpha?: number): void;
}
declare class LongPressButton extends TouchDownButton {
    private longPressDuration;
    private longPressCallback;
    private longPressTimer;
    private longPressJustHappened;
    constructor(upState: string, downState: string);
    protected onTouchBegin(event: egret.TouchEvent): void;
    private addTimer();
    private removeTimer();
    private onTimerComplete(event);
    protected onTouchTap(event: egret.TouchEvent): void;
    longPressSetting(duration: number, callback?: Function): void;
}
declare class MatrixTool {
    constructor();
    static colorMatrix(mainChannel: number, otherChannel: number, alphaChannel: number): egret.ColorMatrixFilter;
    static colorMatrixPure(color: number, alpha?: number): egret.ColorMatrixFilter;
    static colorMatrixLighter(light: number): egret.ColorMatrixFilter;
}
declare class SoundManager {
    private static currentBackgorundMusicChannel;
    private static currentBackgorundMusicSound;
    static soundOn: boolean;
    constructor();
    static soundEfOn: boolean;
    static play(soundName: string, loop?: boolean): egret.SoundChannel;
    private static startPlayGameMusic();
    static stopMusic(): void;
}
declare class TextLabel extends egret.TextField {
    maxSize: number;
    maxWidth: number;
    constructor();
    setText(str: string): void;
}
declare class TweenerTool {
    constructor();
    static tweenTo(target: any, toObject: Object, duration: number, delay?: number, callback?: Function, fromObject?: Object, ease?: Function): void;
}
declare let Utils: {
    formatCoinsNumber: (coins: any) => string;
    toFirstUpperCase: (str: string) => string;
    secondToHour: (second: any) => string;
    secondsOverDay: () => {
        D: number;
        H: number;
        M: number;
        S: number;
    };
    secondsOverWeekend: () => {
        D: number;
        H: number;
        M: number;
        S: number;
    };
    replaceAll: (str: string, searchValue: string, replaceValue: string) => string;
};

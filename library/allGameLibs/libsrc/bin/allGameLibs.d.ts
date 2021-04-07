declare class GenericModal extends egret.Sprite {
    enableKeyboard: boolean;
    needZoomOut: boolean;
    protected static readonly classAssetName: string;
    static GENERIC_MODAL_LOADED: string;
    static CLOSE_MODAL: string;
    static MODAL_COMMAND: string;
    protected assetName: string;
    protected static assetLoaded: Array<boolean>;
    inited: boolean;
    private configUrl;
    constructor(configUrl?: string);
    private analyse(event);
    protected init(): void;
    private static loadAsset(assetName, target);
    private static loaded(event);
    protected onKeyUp(keyCode: number): void;
}
declare class mouse {
    constructor();
    static setButtonMode(a: any): void;
}
declare class GenericPo extends GenericModal {
    protected bgAssetName: string;
    protected bg: egret.Bitmap;
    protected closeButtonAssetName: string;
    protected closeButton: TouchDownButton;
    protected closeButtonOffset: egret.Point;
    cannotQuick: boolean;
    constructor(configUrl?: string);
    protected init(): void;
    protected onClose(event: egret.TouchEvent): void;
    /**
     * update deal overplus text
     */
    protected updateDealOverplusText(time: number): void;
    /**
     * po overplus over
     */
    protected poOverplusOver(): void;
    /**
     * on key up
     */
    protected onKeyUp(keyCode: number): void;
    /**
     * on mouse wheel
     */
    protected onMouseWheel(dir: number): void;
}
declare class LanguageBar extends egret.Sprite {
    private rects;
    private languageArr;
    private static changeIndex;
    static instance: LanguageBar;
    constructor();
    private onTouch(event);
    private onTap(event);
    private showConfirm();
    static confirmChange(): void;
}
declare class MDS {
    static mcFactory: egret.MovieClipDataFactory;
    static addGameText(target: egret.DisplayObjectContainer, x: number, y: number, size: number, color: number, textItem: string, stroke?: boolean, width?: number, additionString?: string, scaleX?: number): TextLabel;
    static addGameTextCenterShadow(target: egret.DisplayObjectContainer, x: number, y: number, size: number, color: number, textItem: string, stroke?: boolean, width?: number, center?: boolean, dropShadow?: boolean): TextLabel;
    static addBitmapTextAt(target: egret.DisplayObjectContainer, fontName: string, x: number, y: number, textAlign: string, size: number, color: number, width: number, height: number): BmpText;
    constructor();
    static removeSelf(item: egret.DisplayObject): void;
    static onUserHeadLoaded(userInfo: egret.Bitmap, size: number, event: egret.Event): void;
}
declare class PlayerConfig {
    static serverVertion: number;
    constructor();
    private static _playerData;
    private static readonly playerData;
    private static _configData;
    private static readonly configData;
    private static playerConfig;
    private static mission;
    static player(key: string): any;
    static config(key: string): any;
    static readonly properties: string;
}
declare function requestStr(str: any): any;
declare class BankProductItem extends egret.DisplayObjectContainer {
    hash: string;
    constructor();
}
declare class CollectHourlyBonusBar extends egret.DisplayObjectContainer {
    protected coin: Coin;
    protected titleTx: egret.TextField;
    protected coinsTx: egret.TextField;
    constructor();
    timerStaus(time: number, status: number): void;
}
declare class ConFirmBar extends egret.Sprite {
    constructor(size: egret.Point);
    private closeThisBar();
    private confirmChange(event);
}
declare class GameSettingItem extends egret.DisplayObjectContainer {
    constructor(icon: string, text: string, entity: egret.DisplayObject, offsetY: number);
    static settingTextFormat(tx: TextLabel): void;
}
declare class GameSettingPopup extends GenericPo {
    protected scrollArea: egret.ScrollView;
    protected scrollBar: egret.DisplayObjectContainer;
    protected scrollSlider: SettingSlider;
    private sliderDraging;
    private soundEffectBtn;
    private musicBtn;
    private visualEffectBtn;
    private notificationBtn;
    private languageBar;
    protected static readonly classAssetName: string;
    constructor();
    protected init(): void;
    private onRemove(event);
    protected addScrollArea(maskRect: egret.Rectangle): void;
    protected addItem(index: number, icon: string, text: string, entity: egret.DisplayObject, offsetY?: number): void;
    protected addButtonText(button: TouchDownButton, buttonText?: string): void;
    protected addLoginButtonText(button: TouchDownButton, buttonText?: string): void;
    private addItems();
    private getFacebookAvatar();
    private getPlayerType();
    private addTitleAndVertion();
    private addLanguageBar();
    private logout();
    private showLangugeBar();
    private gotoLoginPage();
    private suport();
    private rateStar();
    private soundEffectChange();
    private musicChange();
    private visualEffectChange();
    private notificationChange();
    private onFrame(event);
    private onStartDrag(event);
    private onStopDrag(event);
    private showConfirm();
}
declare class GameSettings {
    static vertion: string;
    static visualEffectOn: boolean;
    static notificationOn: boolean;
    constructor();
}
declare var trace: (a: any) => void;
declare class BrowserInfo {
    constructor();
    static getBrowserInfo(): Object;
    static textNeedUpInThisBrowser: number;
    static textNeedUpHasTested: boolean;
    static readonly textUp: number;
}
declare class RateBar extends egret.Sprite {
    private langResource;
    private bg;
    private closeBtn;
    private stars;
    private goldStars;
    static aa: egret.DisplayObject;
    constructor(size: egret.Point);
    private rate(event);
    private closeThisBar();
    private dealWithIndex(index);
    private delayOpenWindow();
    private showOkButton();
}
declare class SettingsCheckbox extends egret.DisplayObjectContainer {
    private bg;
    private bar;
    private callback;
    private _radioOn;
    RadioOn: boolean;
    constructor(callback: Function);
    private onTap(e);
}
declare class SettingSlider extends egret.DisplayObjectContainer {
    private slider;
    private sliderRange;
    private dragStarStageY;
    private dragStarSliderY;
    constructor();
    setSliderPosition(topMax: number, scrollTop: number): void;
    private onSliderStartDrag(event);
    private onSliderStopDrag(event);
    private dragSliderPosition(y);
    readonly scrollTop: number;
    private onMove(event);
}
declare class SupportBar extends egret.Sprite {
    private langResource;
    private email;
    private topTextInput;
    private supportTextInput;
    private bg;
    private closeBtn;
    private supportSuccessContainer;
    private alertBar;
    constructor(size: egret.Point);
    private buildBg();
    private buildTitleText();
    private buildSupportText();
    private buildSupportBtn();
    private buildCloseBtn();
    private buildAlertBar();
    private closeAlertBar(event);
    private sendSupport();
    private closeThisBar();
    private buildSupportSuccessContainer();
}
declare class Coin extends egret.MovieClip {
    startPosition: egret.Point;
    endPosition: egret.Point;
    middlePosition: egret.Point;
    startScale: number;
    endScale: number;
    middleScale: number;
    private static _mcf;
    private static readonly mcf;
    constructor();
    factor: number;
    vY: number;
    _vy: number;
}
declare class DataServer {
    private callback;
    private thisObject;
    private failedCallback;
    constructor();
    getDataFromUrl(url: string, successCallback: Function, thisObject: any, postMethod: boolean, dataObejct: Object, failedCallbBack?: Function): void;
    private loadComplete(event);
    private loadFaild(event);
}
declare class Dinero extends egret.MovieClip {
    startPosition: egret.Point;
    endPosition: egret.Point;
    middlePosition: egret.Point;
    startScale: number;
    endScale: number;
    middleScale: number;
    private static _mcf;
    private static readonly mcf;
    constructor();
    factor: number;
    vY: number;
    _vy: number;
}
declare class FacebookBitmap {
    constructor();
    static downloadBitmapDataByFacebookID(facebookId: string, width: number, height: number, callback: Function, thisObject: any): void;
    static downloadBitmapDataByURL(url: string, callback: Function, thisObject: any): void;
}
declare class FlyingCoins extends egret.DisplayObjectContainer {
    private coinsMcs;
    private coinsFly;
    private dineroMcs;
    private startPosition;
    private endPosition;
    private middlePosition;
    private startScale;
    private endScale;
    private middleScale;
    private gapDuration;
    constructor();
    fly(coinsCount: number, startPosition: egret.Point, endPosition: egret.Point, middlePosition: egret.Point, startScale: number, endScale: number, middleScale: number): void;
    flyDenero(coinsCount: number, startPosition: egret.Point, endPosition: egret.Point, middlePosition: egret.Point, startScale: number, endScale: number, middleScale: number): void;
    private savePositions(startPosition, endPosition, middlePosition, startScale, endScale, middleScale);
    private startFly();
    private endFly(coin);
}
declare class MuLang {
    static txt: Object;
    static CASE_NORMAL: number;
    static CASE_UPPER: number;
    static CASE_LOWER: number;
    static CASE_TYPE_CAPITALIZE: number;
    constructor();
    static getText(key: string, caseType?: number): string;
    static language: string;
    static lanuageNames: Object;
    static readonly languageName: any;
}
declare class LocalDataManager {
    constructor();
    static updatePlayerData(key: string, value: any): void;
    static updatePlayerDatas(items: Array<IKeyValues>): void;
}
interface IKeyValues {
    key: string;
    value: any;
}

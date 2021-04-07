declare class GameUIItem extends egret.Sprite {
    protected extraUIName: string;
    protected extraUIObject: egret.DisplayObject;
    constructor();
    /************************************************************************************************************************************************************/
    protected gratisUIIsOverExtraUI: boolean;
    protected gratisUI: egret.DisplayObject;
    protected gratisNumber: number;
    protected showFreeExtraPosition(): void;
    protected getGratisUI(): egret.DisplayObject;
}
declare class SFSConnector {
    private static _config;
    private static _sfs;
    private static connection;
    private static login;
    private static gettingRoom;
    private static joinRoomCallback;
    static gameInitCallback: Function;
    static tounamentCallback: Function;
    static changeNumberCallback: Function;
    static playCallback: Function;
    static roundOverCallback: Function;
    static cancelExtraCallback: Function;
    static extraCallback: Function;
    static jackpotCallbak: Function;
    static jackpotWinCallbak: Function;
    static bonusGameSpinCallback: Function;
    static buffHandlerCallback: Function;
    static goKartHandlerCallback: Function;
    static selectNumberCallback: Function;
    static lemonGameCallback: Function;
    constructor();
    /**
     * connect sfs server
     **/
    private connection();
    /**
     * show logs
     */
    private showSfsLogs(event);
    /**
     * sfs server connection callback
     */
    private onSfsConnection(event);
    /**
     * sfs server lost connection callback
     */
    private onSfsConnectionLost(event);
    /**
     * login callback
     **/
    private onLogin(event);
    /**
     * login error callback
     **/
    private onLoginError(event);
    /**
     * join room callback
     **/
    private onJoinRoom(event);
    /**
     * join room error callback
     **/
    private onJoinRoomError(event);
    /**
     * sfs server extension response callback
     */
    private onSfsExtensionResponse(event);
    /**
     * send cmd request to sfs server
     * @param cmd    the sfs server request command object
     * @param params request parameters
     **/
    static send(cmd: any, params: any): void;
    private getBetConfig(configData);
    static loginTo(zona: string, room: string, joinRoomCallback: Function): void;
    static sendMessage(key: string, value: Object): void;
    static sendPlay(key: string, bet: number, cards: number, cardGroupNumber: number, betIndex: number): void;
    static sendPlayWithCardId(key: string, bet: number, cards: number, cardGroupNumber: number, betIndex: number, cardId: number): void;
    static sendPlayWithNumbers(key: string, bet: number, cards: number, cardGroupNumber: number, betIndex: number, cardNumbers: Array<number>): void;
    static sedRound(key: string, bet: number, cards: number, cardGroupNumber: number, betIndex: number): void;
    static roundOver(): void;
    static libera(): void;
    static cancelExtra(extraString: boolean): void;
    static extra(extraString: boolean, saving: boolean): void;
    static bonusGameSpin(bet: number): void;
    static buffHandler(action: string, bet: number): void;
    static selectNumber(num: number): void;
    static goKartHandler(action: string, rewardType: number): void;
    static lemonGame(action: string, bet: number, type: number, boxIndex: number): void;
}
declare class GameCard extends GameUIItem {
    protected bg: egret.Bitmap;
    protected cardText: TextLabel;
    protected betText: TextLabel;
    protected grids: Array<TowerGrid>;
    static clickChangeNumber: boolean;
    protected fitEffectLayer: egret.DisplayObjectContainer;
    static fitEffectNameList: Object;
    protected cardId: number;
    protected numbers: Array<number>;
    bet: number;
    constructor(cardId: number);
    protected onAdd(event: egret.Event): void;
    private buildCardTitleText(rect, size);
    static changeingCard: boolean;
    protected cardNumber(event: egret.TouchEvent): void;
    static getCardData(data: Object): void;
    getBgColor(): void;
    getNumbers(numbers: Array<number>): void;
    protected createGrid(gridIndex: number): TowerGrid;
    checkNumber(ballIndex: number): number;
    clearStatus(): void;
    getCheckString(): string;
    blinkAt(index: number): void;
    stopBlink(): void;
    blink(show: number): void;
    getNumberAt(index: number): number;
    clearFitEffect(): void;
    protected redEffectArray: Array<boolean>;
    protected setGridsToRed(str: string): void;
    showfitEffect(assetName: string, fitIndex: Array<boolean>): void;
}
declare class TowerGrid extends egret.Sprite {
    protected defaultBgPic: egret.Bitmap;
    protected onEffBgPic: egret.Bitmap;
    private blink1Pic;
    private blink2Pic;
    protected linePic: egret.Bitmap;
    private gridLayer;
    protected _currentBgPic: egret.Bitmap;
    currentBgPic: any;
    protected _isChecked: boolean;
    readonly isChecked: boolean;
    protected _blink: boolean;
    blink: boolean;
    private gridView;
    private zeroUIBitmap;
    protected numTxt: BmpText;
    private num;
    gridNumber: number;
    constructor();
    protected flushGrid(): void;
    showEffect(isShow: boolean): void;
    showRedEffect(): void;
    showBlink(isShow: boolean): void;
}
declare class BingoMachine extends GameUIItem {
    static GENERIC_MODAL_LOADED: string;
    preLoader: RES.PromiseTaskReporter;
    protected assetName: string;
    private gameConfigFile;
    protected languageObjectName: string;
    protected megaName: string;
    protected ballArea: BallManager;
    protected cardArea: egret.DisplayObjectContainer;
    protected arrowArea: CardArrowLayer;
    protected payTableArea: PaytableLayer;
    protected gameToolBar: BingoGameToolbar;
    protected topbar: Topbar;
    protected betBar: Betbar;
    protected betText: TextLabel;
    protected creditText: TextLabel;
    protected dinero: number;
    protected _gameCoins: number;
    protected gameCoins: number;
    protected freeSpin: number;
    protected connetKeys: Object;
    protected tokenObject: Object;
    private static currentGame;
    static currentGameId: number;
    protected soundManager: GameSoundManager;
    protected ballRunforStop: boolean;
    protected assetStr(str: string): string;
    static getAssetStr(str: string): string;
    protected runningBallUI: egret.Sprite;
    protected runningBallContainer: egret.DisplayObjectContainer;
    protected coverRunningBall: egret.DisplayObject;
    protected currentBallIndex: number;
    protected ballCountText: egret.TextField;
    protected needSmallWinTimesOnCard: boolean;
    protected needListenToolbarStatus: boolean;
    protected tipStatusText: TextLabel;
    protected tipStatusTextPosition: egret.Rectangle;
    protected tipStatusTextColor: number;
    protected prizeText: egret.TextField;
    connectReady: boolean;
    assetReady: boolean;
    betListReady: boolean;
    protected ganhoCounter: GanhoCounter;
    static inRound: boolean;
    constructor(gameConfigFile: string, configUrl: string, gameId: number);
    private onConfigLoadComplete();
    protected getLanguageObject(): Object;
    protected getSoundName(paytalbeName: string): string;
    protected onRemove(event: egret.Event): void;
    private analyse(result);
    private loadAsset(assetName);
    private loaded(event);
    protected init(): void;
    protected addPayTables(): void;
    private loginToServer();
    private onJoinRoomCallback();
    private betListCallback(success);
    private testReady();
    protected sendInitDataRequest(): void;
    protected onServerData(data: Object): void;
    private loadOtherGroup();
    protected initToolbar(): void;
    protected initBetbar(jackpotMinBet: number): void;
    protected listenToGameToolbarStatus(): void;
    protected tipStatus(e: egret.Event, textDoubleLine?: boolean): void;
    private lockWinTip;
    protected winChange(e: egret.Event, textDoubleLine?: boolean): void;
    private setCardDatasWithNumeros(numeros, cartela);
    protected resetGameToolBarStatus(): void;
    static runningBall(ballIndex: number): void;
    static betweenBallRunning(): Array<Object>;
    static runningAnimation(callback: Function, lightResult: Array<Object>, isLastBall: boolean): void;
    static endBallRunning(): void;
    protected sendRoundOverRequest(): void;
    protected lightCheck(): Array<Object>;
    protected inLightCheck: boolean;
    protected getResultListToCheck(inLightCheck?: boolean): boolean;
    protected paytableResultFilter(resultList: Array<Object>): void;
    protected showExtraUI(show?: boolean): void;
    protected clearRunningBallUI(): void;
    protected setLetras(letrasData: string): void;
    protected playSound(soundName: string, repeat?: number, callback?: Function): void;
    protected stopSound(soundName: string): void;
    protected stopAllSound(): void;
    protected removedFromStage(): void;
    protected tileBg(): boolean;
    /******************************************************************************************/
    protected btExtra: boolean;
    protected ganho: number;
    protected valorextra: number;
    static sendCommand(cmd: string): void;
    protected betChanged(type: number): void;
    protected checkOOCWhenExtra(): boolean;
    private tellTounamentCurrentBet();
    changeCardsBg(): void;
    onChangeNumber(data: Object): void;
    onPlay(data: Object, hotData?: any): void;
    protected updateCredit(data: Object): void;
    onRoundOver(data: Object): void;
    protected checkAuto(): void;
    protected checkFreeSpin(freeSpin: number): void;
    private autoPlayTimeoutId;
    private aotoNextRound();
    protected waitingForEffect: boolean;
    protected waitForEffect(callback: Function): void;
    onCancelExtra(data: Object): void;
    onExtra(data: Object): void;
    protected showMissExtraBall(balls: Array<number>): void;
    protected sendPlayRequest(): void;
    protected sendExtraRequest(saving?: boolean): void;
    protected sendCancelExtraReuqest(): void;
    protected showLastBallAt(ballIndex: number, x: number, y: number, scale?: number): void;
    protected afterCheck(resultList: Array<Object>): void;
    protected winBingo(): void;
    protected showSmallWinTimes(resultList: Array<Object>): void;
    protected showSmallWinResult(cardIndex: number, blinkGrids: Object): void;
    /**
     * quick play
     */
    quickPlay(): void;
    /**
     * stop quick play
     */
    stopQuickPlay(): void;
    /**
     * collect credito
     */
    collectCredit(): void;
    protected firstHaveExtraBall: boolean;
    protected lastLightResult: Array<Object>;
    protected runningWinAnimation(callback: Function, lightResult: Array<Object>, isLastBall: boolean): void;
    protected getPaytablesFit(paytabledName: string, callback?: Function): void;
    protected onBetChanged(event: egret.Event): void;
    protected hasExtraBallFit(): void;
    protected getExtraBallFit(): void;
    protected collectExtraBall(): void;
    protected changeNumberSound(): void;
    protected roundOver(): void;
    protected startPlay(): void;
    protected showLastBall(ballIndex: number): void;
    protected paytableRuleFilter(blinkGrids: any): void;
    protected showMiniGame(): void;
    protected showWinAnimationAt(cardId: number, win: number): void;
    protected dropCoinsAt(ptX: number, ptY: number, coinsLevel?: number): void;
    protected showNoBetAndCredit(): void;
    /******************************************************************************************/
    protected jackpotArea: JackpotLayer;
    protected showJackpot(jackpot: number, jackpotMinBet: number, betConfig: Array<Object>): void;
    refreshGameCoins(coins: number): void;
    refreshGameDinero(dinero: number): void;
    static readonly jackpotMin: number;
    /***********************************************************************************************************************************/
    protected superExtraBg: egret.Bitmap;
    protected isMegaBall: boolean;
    protected buildSuperEbArea(superEbBgName: string, superEbAreaX: number, superEbAreaY: number): void;
    protected tryFirstMega(rect: egret.Rectangle): void;
    stopAutoPlay(): void;
    /**************************************************************************************************************/
    protected onLevelUpBonus(event: egret.Event): void;
    /**************************************************************************************************************/
    protected updateNewDatas(data: Object): void;
    static missionPopup(): void;
}
declare class PaytableLayer extends egret.DisplayObjectContainer {
    protected paytableFgs: Array<egret.DisplayObject>;
    constructor();
    addPaytableUI(): void;
    clearPaytableFgs(): void;
    protected buildFgs(): void;
    protected buildTitleText(): void;
    protected payTableFit(event: egret.Event): void;
}
declare class PaytableUI extends egret.Sprite {
    static textBold: boolean;
    static focusColor: number;
    static needBlink: boolean;
    private useBg;
    private bgName;
    protected gridRuleString: string;
    protected tx: egret.TextField;
    readonly _tx: number;
    protected bg: egret.Bitmap;
    protected grids: Array<egret.Shape>;
    private textColor;
    protected blinkGridsIndexs: Array<number>;
    protected _winEffects: Array<egret.Filter>;
    protected currentEffect: number;
    protected _blink: Boolean;
    blink: Boolean;
    constructor(useBg: boolean);
    protected onRemove(event: egret.Event): void;
    winEffects: Array<egret.ColorMatrixFilter>;
    protected onFrame(event: egret.Event): void;
    setText(text: string, color: number, size: number): void;
    setBackground(assetsName: string): void;
    showFit(): void;
    clearStatus(): void;
    setGrids(ruleString: string): void;
    initUI(): void;
    focus(): void;
    showBlinkAt(grids: Array<number>): void;
}
declare class TounamentLayer extends egret.DisplayObjectContainer {
    private innerBar;
    private outBar;
    private pressBar;
    private timeTx;
    private potTx;
    private duration;
    private totalDuration;
    private timer;
    private _potCount;
    private potCount;
    private usersUI;
    private champoin;
    constructor(data: ITounamentInitData);
    private onAdd(event);
    private onRemove(event);
    updata(data: ITounamentData): void;
    buildInnerBar(): void;
    buildOutBar(): void;
    private updateDuration(duration, totalDuration);
    private onTimer(event);
    private updataDurationUI(duration);
    private updatePrize(prize);
    private showingWinners;
    private updateUserList(users, winners);
    private hideUserUI();
    private showUserUI(users, winners);
    private showingWinnersUI(winners);
    private getUserListOrder(users);
    private userIndexOf(users, id);
}
interface IMissionTask {
    target: number;
    current: number;
    is_active: string;
    mission_id: string;
}
declare class V2Game extends BingoMachine {
    constructor(gameConfigFile: string, configUrl: string, gameId: number);
    protected extraUIShowNumber(): void;
    /*******************************************************************************************************/
    protected getNumberOnCard(cardIndex: number, gridIndex: number): void;
    protected getBuffInfoIndex(buffInfo: Array<Object>): number;
}
declare class BallManager extends egret.DisplayObjectContainer {
    private static balls;
    private ballSize;
    private ballTextSize;
    static textBold: boolean;
    private ballIndexs;
    private extraBalls;
    private ballOrder;
    needLightCheck: boolean;
    static normalBallInterval: number;
    static ballOffsetY: number;
    static rotateBall: boolean;
    private lightResult;
    private moveingBallLayer;
    private staticBallLayer;
    constructor();
    getBallSettings(balls: Array<Object>, ballSize: number, ballTextSize: number): void;
    clearBalls(): void;
    onRemove(): void;
    runBalls(balls: Array<number>): void;
    runCutBalls(balls: Array<number>): void;
    runExtra(extraBall: number): void;
    runMissExtra(missExtra: Array<number>): void;
    private beginRun();
    stopBallRunning(): void;
    private runNextBall();
    private onBallMoveEnd(event);
    private runMissExtraBall();
    private nextDelayId;
    private delayRunNextBall();
    private recordlightResult(lightResult);
    protected setBallBg(ball: egret.Sprite, assetName: string): void;
    protected buildBallWithIndex(num?: number, scaleToGame?: Boolean): BingoBall;
    protected buildBallUIWithIndex(index: number, num?: number): egret.Sprite;
    getABall(index: number): BingoBall;
    getABigBall(index: number): BingoBall;
    static getBallLastPosition(index: number): egret.Point;
}
declare class BingoBall extends egret.Sprite {
    static BALL_MOVE_END: string;
    static ballUIs: Array<egret.Sprite>;
    private ballSize;
    private pts;
    constructor(index: number, ballSize?: number);
    startRun(pts: Array<egret.Point>): void;
    private moveToNextPoint();
}
declare class BingoBackGroundSetting {
    private static bgColor;
    private static bgItems;
    static gameMask: egret.Rectangle;
    static gameSize: egret.Point;
    constructor();
    static getBackgroundData(bgColor: number, bgItems: Array<string>): void;
    static initBackground(target: egret.Sprite): egret.MovieClipDataFactory;
    private static getAnimationFactory(target);
    private static drawBackgroundOn(target);
    private static buildBGItemsByArray(target, mcf);
}
declare class GameCommands {
    static help: string;
    static decreseBet: string;
    static increaseBet: string;
    static changeNumber: string;
    static maxBet: string;
    static minBet: string;
    static collect: string;
    static play: string;
    static stop: string;
    static startAuto: string;
    static extra: string;
    static stopAuto: string;
    static saving: string;
    static showMini: string;
    static buyAll: string;
    constructor();
}
declare class GameData {
    static bets: Array<number>;
    static readonly minBet: number;
    static readonly maxBet: number;
    static betUp(): void;
    static betDown(): void;
    static _currentBetIndex: number;
    static readonly currentBet: number;
    static readonly currentBetIndex: number;
    static setBetToMax(): void;
    static setBetToMin(): void;
    constructor();
    static waiter: Function;
    static getBetList(callback: Function, gameId: string): void;
    private static getMachineSettingSuccess(data);
}
declare class CardArrowLayer extends egret.DisplayObjectContainer {
    protected arrowMcs: Array<Array<egret.MovieClip>>;
    constructor(mcf: egret.MovieClipDataFactory, assetName: string, offsetPt: egret.Point, disY: number, scaleX?: number);
    protected buildArrowByPoint(mcf: egret.MovieClipDataFactory, assetName: string, cardPosition: Object, j: number, offsetPt: egret.Point, disY: number, scaleX: number): egret.MovieClip;
    arrowBlink(resultList: Array<Object>): void;
    clearArrow(): void;
}
declare class CardManager {
    static cards: Array<GameCard>;
    static groupNumber: number;
    static cardType: Function;
    static gridType: Function;
    constructor();
    static getCardData(data: Object): void;
    static readonly enabledCards: number;
    static setCardBet(bet: number): number;
    static getBall(ballIndex: number): void;
    static clearCardsStatus(): void;
    static getCheckingStrings(): Array<string>;
    static letCardBlink(blinkGridOnCard: Array<Array<number>>): void;
    static stopAllBlink(): void;
    static changeCardsBgColor(): void;
    static showPaytableResult(cardIndex: number, paytableName: string, fit: boolean, fitIndexArray: Array<boolean>): void;
    /*****************************************************************************************************************/
    private static blinkTimer;
    static startBlinkTimer(): void;
    private static onBlinkTimer(event);
    static stopBlinkTimer(): void;
    static clearCardsEffect(): void;
    static setSmallWinTime(cardIndex: number, gridIndex: number, winTimes: number): void;
}
declare class ExtraBlinkCard extends GameCard {
    constructor(cardId: number);
    getNumbers(numbers: Array<number>): void;
    showWinCount(winNumber: number): void;
    setSmallWinTimeAt(gridIndex: number, winTimes: number): void;
}
declare class ExtraBlinkGrid extends TowerGrid {
    static extraBink: boolean;
    blink: boolean;
    protected extraBlinkNumTxt: TextLabel | BmpText;
    protected extraBinkSp: egret.DisplayObjectContainer;
    protected smallWinTimesText: egret.TextField;
    extraBlinkNumber: number;
    constructor();
    protected buildExtraBlinkSp(): void;
    protected buildSmallWinText(): void;
    protected getBlinkBg(): egret.Bitmap | egret.MovieClip;
    setSmallTime(winTimes: number): void;
    showBlink(isShow: boolean): void;
}
declare class ForkGrid extends TowerGrid {
    private forkUI;
    constructor();
    showEffect(isShow: boolean): void;
    removeFork(): void;
}
declare class BingoGameMain extends egret.DisplayObjectContainer {
    protected currentGame: BingoMachine;
    protected currentPo: GenericPo;
    protected isMobile: boolean;
    private shadow;
    private modalPreloader;
    constructor();
    /**
    * need override
    */
    protected onAddToStage(event: egret.Event): void;
    /**
     * need override
     */
    protected runGame(): void;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    protected createGameScene(): void;
    /**
     * need override
     */
    protected buildGame(): void;
    protected addGameLoaderAndEvents(): void;
    private addGame();
    /**
     * key down
     */
    private keyDown(event);
    private showGameSettings(event);
    private showMission(event);
    protected showShadow(): void;
    private onLoadingAnimation(event);
    protected addPo(event?: egret.Event): void;
    protected addPhonePo(event?: egret.Event): void;
    private addPoFromTo(fromScale, toScale);
    closeCurrentPo(): void;
    showBank(event?: egret.Event): void;
    private loadDynamicClass(className, assetConfigUrl, classUrl);
    private showPoWithClassName(className, assetConfigUrl);
    private showPoWithClass(myClass, assetConfigUrl);
    showChipBank(event?: egret.Event): void;
    showCoinBank(event?: egret.Event): void;
}
declare class GlobelSettings {
    static bankOpenType: number;
    static bank: any;
    static chipBank: any;
    static bonusUI: any;
    constructor();
    static readonly language: string;
}
declare class CardGridColorAndSizeSettings {
    static numberColor: number;
    static numberColorOnEffect: number;
    static colorNumberOnEffect: boolean;
    static gridSize: egret.Point;
    static gridSpace: egret.Point;
    static defaultNumberSize: number;
    constructor();
    static colorSetting(colors: Object): void;
    static sizeSetting(size: Object): void;
}
declare class CardGridUISettings {
    static defaultBgPicName: string;
    static defaultBgPicTexture: egret.Bitmap;
    static onEffBgPicName: string;
    static onEffBgPicTexture: egret.Bitmap;
    static blink1PicName: string;
    static blink1PicTexture: egret.Bitmap;
    static blink2PicName: string;
    static blink2PicTexture: egret.Bitmap;
    static linePicName: string;
    static linePicTexture: egret.Bitmap;
    static usefork: string;
    static zeroUI: string;
    constructor();
    static getSettingStrings(data: Object): void;
    static initGridAssets(): void;
}
declare class GameCardUISettings {
    static titleColors: Array<number>;
    static bgString: string;
    static cardPositions: Array<egret.Point>;
    static texColor: number;
    static gridNumbers: egret.Point;
    static gridInitPosition: egret.Point;
    static cardTextRect: egret.Rectangle;
    static betTextRect: egret.Rectangle;
    static currentBgColorIndex: number;
    static showTitleShadow: egret.Filter;
    static gridOnTop: boolean;
    static useRedEffect: boolean;
    constructor();
    static dataSetting(data: Object): void;
    static colorSetting(colors: Object): void;
    static sizeSetting(size: Object): void;
    static readonly cardTitleColor: number;
    static changeBgColor(): void;
    static getIndexOnCard(index: number): egret.Point;
    static positionOnCard(cardIndex: number, gridIndex: number): egret.Point;
    static setTargetToPositionOnCard(target: egret.DisplayObject, cardIndex: number, gridIndex: number): void;
    static numberAtCard(cardIndex: number, gridIndex: number): number;
}
declare class GanhoCounter {
    protected ganhoArray: Array<number>;
    protected winCallback: Function;
    constructor(winCallback?: Function);
    clearGanhoData(): void;
    countGanhoAndPlayAnimation(resultList: Array<Object>): void;
    private showWinAnimationOnAllCards(ganhoArray);
    protected getFitItemOnCard(resultList: Array<Object>): Array<Array<Object>>;
    private getGanhoArray(resultList, fitItemOnCard);
    protected countGanho(ganhoArray: Array<number>, i: number, ob: string, result: PaytableCheckResult): void;
}
declare class DropCoins extends particle.GravityParticleSystem {
    constructor(coinsLevel: number);
}
declare class JackpotLayer extends egret.DisplayObjectContainer {
    tip: TextLabel;
    jackpotText: TextLabel;
    jackpotMinBet: number;
    protected jackpotLock: egret.Bitmap;
    protected jackpotTooltip: egret.DisplayObjectContainer;
    jackpotBonus: Boolean;
    jackpotNumber: number;
    private betConfig;
    constructor(jackpotContainerPosition: egret.Point, jackpot: number, jackpotMinBet: number, betConfig: Array<Object>, lockPosition: egret.Point, jackpotTextRect: egret.Rectangle, jackpotTextSize: number, jackpotTextColor: number, tipRect?: egret.Rectangle, tipTextSize?: number, tipTextColor?: number, lockOnTop?: boolean);
    private createJackpotTooltipAt(x, y);
    private jackpotCurrentTextValue;
    private jackpotValue;
    private currentJackpotPool;
    private countJackpotByRate(jackpot);
    changebet(): void;
    setJackpotNumber(data: Object, isChangeBet?: boolean): void;
    tryJackpotMinBet(): void;
    textBold: boolean;
    jackpotWinCallback(data: Object): void;
}
declare class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {
    constructor();
    onProgress(current: number, total: number): void;
}
declare class MissionBar extends egret.DisplayObjectContainer {
    private missionBg;
    private missionBook;
    private missLock;
    private missionProcessUI;
    private missionData;
    constructor();
    private showMissionProcess();
    private showTaskUI(currentBingoTask);
    updateMissionData(value: number, target: number, id: number): void;
}
declare class MissionDataManager {
    static MISSION_TYPE_BINGO: string;
    static MISSION_TYPE_SLOT: string;
    constructor();
    /**
     * check mission locked
     */
    static checkMissionLocked(): number;
    static getMissionTasks(type: string): Array<IMissionTask>;
    private static getMissionTaskData(taskObject);
    static getActiveMissionTask(type: string): IMissionTask;
}
declare class MissionProcessUI extends egret.DisplayObjectContainer {
    private missionProcessBar;
    private missionProcessTx;
    private fullLight;
    private bookOutlight;
    constructor();
    setProcess(process: number): void;
    private alphaLight();
    private onMissionBtn(event);
}
declare class MissLockUI extends egret.DisplayObjectContainer {
    private missLockTip;
    constructor(lockType: number);
    private showMissionLockTip(event);
    private buildTip(lockType);
    private lockUIShowing();
}
declare class IBingoServer {
    private static serverConnection;
    constructor();
    static readonly connected: boolean;
    static serverInit(): void;
    static sendMessage(key: string, value: Object): void;
    static gameInitCallback: Function;
    static tounamentCallback: Function;
    static changeNumberCallback: Function;
    static playCallback: Function;
    static roundOverCallback: Function;
    static cancelExtraCallback: Function;
    static extraCallback: Function;
    static jackpotCallbak: Function;
    static jackpotWinCallbak: Function;
    static bonusGameSpinCallback: Function;
    static buffHandlerCallback: Function;
    static goKartHandlerCallback: Function;
    static selectNumberCallback: Function;
    static lemonGameCallback: Function;
    static loginTo(zona: string, room: string, joinRoomCallback: Function): void;
    static changeNumber(): void;
    static play(bet: number, cards: number, cardGroupNumber: number, betIndex: number): void;
    static playWithCardId(bet: number, cards: number, cardGroupNumber: number, betIndex: number, cardId: number): void;
    static playWithCardNumbers(bet: number, cards: number, cardGroupNumber: number, betIndex: number, cardNumbers: Array<number>): void;
    static round(bet: number, cards: number, cardGroupNumber: number, betIndex: number): void;
    static roundOver(): void;
    static libera(): void;
    static cancelExtra(extraString?: boolean): void;
    static extra(extraString?: boolean, saving?: boolean): void;
    static bonusGameSpin(bet: number): void;
    static buffHandler(action: string, bet: number): void;
    static selectNumber(num: number): void;
    static goKartHandler(action: string, rewardType: number): void;
    static lemonGame(action: string, bet?: number, type?: number, boxIndex?: number): void;
}
declare class TounamentDataFormat {
    constructor();
    static parse(cmd: string, data: any): Object;
    private static initTournamentData(data);
    private static getListDatas(tmd, data);
    private static getPrizeData(prize);
    private static getAUserData(user);
    private static updateTournamentData(data);
    private static getUpdateData(tmd, data);
    private static tournamentOver(data);
}
declare class PaytableCheckResult {
    fit: boolean;
    fits: Array<boolean>;
    unfitIndex: number;
    unfitIndexs: Object;
    fitIndex: Array<number>;
    name: string;
    constructor(name: string);
    getCheckResult(testString: string, ruleString: string, ruleIndex?: number): void;
    lightCheckResult(testString: string, ruleString: string, ruleIndex?: number): boolean;
    toString(): string;
    private testCheckString(testString, checkGate);
}
declare class PaytableFilter {
    static filterObject: Object;
    static soundObject: Object;
    constructor();
    static lightConfixFilter(paytableName: string, cardPaytableItems: Object): boolean;
    static paytableConfixFilter(fitPaytableItem: Array<any>, byObject?: boolean): void;
    private static testContain(ruleParent, ruleChild);
}
declare class LoyaltyVo {
    private static loyaltyLevel;
    private static loyaltyPoint;
    private static loyaltyThisLevelBegin;
    private static loyaltyNextLevelBegin;
    private static loyaltyLevelBuffEndTime;
    private static loyaltyCalcF;
    private static loyaltyCalcPurchaseLt;
    private static isMissionRefresh;
    private static thisMonthPurchaseCount;
    private static missionScoreEasy;
    private static privileges;
    private static dataAfterUpdate;
    private static loyaltyName;
    private static overplus;
    private static overplusTimer;
    /**
     * init loyalty data
     */
    static init(data: any): void;
    /**
     * update loyalty data
     */
    static update(data: any): void;
    /**
     * update data
     */
    static updateData(data: any): void;
    /**
     * check buff time
     */
    private static checkBuffTime();
    /**
     * loyalty buff over
     */
    private static loyaltyBuffOver();
    /**
     * get data
     */
    static readonly data: any;
    /**
     * get name
     */
    static readonly getLoyaltyName: Array<string>;
    /**
     * get data
     */
    static get(key: string): any;
}
declare class PayTableManager extends egret.Sprite {
    static payTablesDictionary: Object;
    static bingoPaytableName: string;
    static paytableUIType: Function;
    static layerType: Function;
    private rule;
    private rules;
    private _payTableName;
    readonly payTableName: string;
    private useBgPicture;
    private textColor;
    private ui;
    readonly multiple: number;
    private gridRule;
    position: egret.Point;
    readonly UI: egret.DisplayObject;
    constructor(paytableObject: Object, name: string);
    static getPayTableData(obj: Object): void;
    static getPayTableUI(): void;
    private createPaytableUI(useBg);
    check(testRule: string): PaytableCheckResult;
    lightCheck(testRule: string): Array<number>;
    static clearPaytablesStatus(): void;
    focus(): void;
    clearStatus(): void;
    showBlinkAt(grids: Array<number>): void;
}
declare class PaytableResultListOprator {
    constructor();
    static missOneCounter(resultList: Array<Object>, paytableName: string, needCount?: boolean): number;
}
declare class GameSoundManager {
    private playing;
    private static instance;
    constructor();
    play(soundAssetName: string, repeat?: number, callback?: Function): void;
    private onSoundComplete(e);
    stop(soundAssetName: string): void;
    stopAll(): void;
    static stopAll(): void;
}
declare class MissionPopup extends GenericPo {
    private taskListLayer;
    protected static readonly classAssetName: string;
    constructor();
    protected init(): void;
    private showListByData();
}
declare class MissionTaskUIItem extends egret.DisplayObjectContainer {
    constructor(isActive: boolean, process: number, hasActive: boolean);
}
declare class BingoGameToolbar extends egret.DisplayObjectContainer {
    static toolBarY: number;
    private helpBtn;
    protected decreseBetBtn: TouchDownButton;
    protected increaseBetBtn: TouchDownButton;
    protected maxBetBtn: TouchDownButton;
    private collectBtn;
    protected buyAllBtn: TouchDownButton;
    protected playBtn: LongPressButton;
    protected stopBtn: TouchDownButton;
    protected freeSpinBtn: FreeSpinButton;
    protected bigExtraBtn: GameToolbarMaskButton;
    protected stopAutoBtn: TouchDownButton;
    protected superExtraBtn: GameToolbarMaskButton;
    private coinsText;
    private dineroText;
    private betText;
    private winText;
    protected allButtons: Array<TouchDownButton>;
    private enabledButtons;
    protected playContainer: egret.DisplayObjectContainer;
    protected extraContainer: egret.DisplayObjectContainer;
    private _autoPlaying;
    autoPlaying: boolean;
    private _buyAllExtra;
    buyAllExtra: boolean;
    protected xpBar: XpBar;
    constructor();
    protected onToolbarAdd(event: egret.Event): void;
    private buildPlayContainer();
    private buildExtraContainer();
    private addPlayButton();
    private createTexts();
    private addToolBarText(x, y, textWidth, textHeight, textSize, stroke?, strokeColor?, target?);
    protected addBtn(assets: string, x: number, y: number, name: string, container: egret.DisplayObjectContainer, donotHavePressUi?: boolean): TouchDownButton;
    protected addMaskBtn(assets: string, x: number, y: number, name: string, container: egret.DisplayObjectContainer, textColor?: number): GameToolbarMaskButton;
    protected sendCommand(event: egret.TouchEvent): void;
    protected addButtonText(terget: TouchDownButton, size: number, text: string, offsetX?: number, offsetY?: number, color?: number, width?: number, height?: number, stroke?: number, strokeColor?: number): TextLabel;
    setBet(bet: number, cardNumber: number, isMaxBet: boolean): void;
    private betNumber;
    lockAllButtons(): void;
    unlockAllButtons(): void;
    showExtra(isShow: boolean, extraPrice?: number): void;
    private enableAllButtons(enabled);
    private showExtraButton(isShow);
    private enabledExtraButtons(isAble?);
    showTip(cmd: string, price?: number): void;
    protected showCoinsIconAt(price: number): void;
    showWinResult(winPrice: number): void;
    showStop(isStop: boolean): void;
    showCollectButtonAfterOOC(): void;
    unlockAllButtonsAfterOOC(): void;
    unlockAllButtonsAfterOOCExtra(): void;
    collect(): void;
    private delayKeyboard;
    private _enableKeyboard;
    private enableKeyboard;
    quickPlay(): void;
    enabledStopButton(): void;
    megeExtraOnTop(megaOnTop: boolean): void;
    updateCoinsAndDinero(coins: number, dinero: number): void;
    updateXp(xp: number): void;
    private startAuto();
    private _coins;
    private coins;
    private _dinero;
    private dinero;
    private _win;
    private win;
    private onLevelUpBonus(event);
    updateFreeSpinCount(freeSpinCount: number): void;
    updateMissionData(value: number, target: number, id: number): void;
}
declare class FreeSpinButton extends TouchDownButton {
    private freeCountLeftTx;
    constructor();
    private freeSpinClick(event);
    setFreeCount(freeCount: number): void;
}
declare class GameToolbarMaskButton extends TouchDownButton {
    private maskBit;
    private scrollLayer;
    private priceText;
    private freeText;
    private icon;
    private stayTime;
    private moveTime;
    private textColor;
    constructor(assetsString: string, textColor: number);
    addButtonBigText(size: number, text: string): void;
    private buildBigText(size, text);
    addButtonSmallText(size: number): void;
    setIcon(assetName: string): void;
    setPrice(price: number): void;
    private extraStep1();
    private extraStep2();
}
declare class Topbar extends egret.DisplayObjectContainer {
    private backToLobbyBtn;
    private bankBtn;
    private menuBtn;
    constructor();
    private onButtonClick(event);
}
declare class XpBar extends egret.DisplayObjectContainer {
    static LEVEL_UP_BONUS: string;
    private xpProccessUI;
    private starUI;
    private levelTx;
    private xpProccessTx;
    private level;
    private thisLevelXp;
    private nextLevelXp;
    private currentXp;
    private _xpProccess;
    private xpProccess;
    private levelUpRecord;
    constructor();
    updateXp(xp: number): void;
    private levelUp();
    private sendCollectBonusRequest(gameID, currentBet);
    /**
     * collect bonus request success
     **/
    private collectRequestSuccess(data);
    /**
     * collect bonus request failed
     **/
    private collectRequestFailed(data);
    private showBonusAndLoyalty(bonus, loyalty);
    private btBack(bt, btContainer, bonus);
}
declare class Betbar extends egret.DisplayObjectContainer {
    private processBar;
    private jackpotMinBet;
    private processStartX;
    private processMax;
    private betPointJsckpot;
    private betPointMaxBet;
    constructor(jackpotMinBet: number);
    setBet(bet: number): void;
    private waitThis();
    private hideThis();
    private checkLock(bet);
    private getBetPosition(bet);
}
declare class BetbarIcon extends egret.DisplayObjectContainer {
    private icon;
    private iconLayer;
    private maskBitmap;
    private isMaxIcon;
    private lockUI;
    private blackMask;
    private whiteMask;
    constructor(iconStr: string);
    unlock(): void;
    lock(): void;
}
declare class BetbarPoint extends egret.DisplayObjectContainer {
    private pointUI;
    private activeBet;
    readonly currentActiveBet: number;
    private active;
    private activeBetUI;
    private activeBetTx;
    private activeBetBg;
    private betIcon;
    constructor(bet: number, str: string);
    resetBet(bet: number): void;
    resetActiveBet(bet: number): void;
    private hideActiveBetUI();
    private showActiveBetUI();
}
declare class GoldTounamentLayer extends TounamentLayer {
    constructor(data: ITounamentInitData);
}
interface ITounamentData {
    totalDuration: number;
    duration: number;
    userCount: number;
    prize: number;
    normalPrize: number;
    goldPrize: number;
    prizes: Array<ITounamentPrize>;
    userList: Array<ITounamentUser>;
    winners: Array<ITounamentUser>;
}
interface ITounamentInitData extends ITounamentData {
    isGold: boolean;
    threshold: number;
    currentTreshold: number;
    eligible: boolean;
    fromLevel: number;
    toLevel: number;
    gameIDs: Array<number>;
}
interface ITounamentPrize {
    fromRank: number;
    toRank: number;
    winningPrize: number;
    winGoldPrize: number;
}
interface ITounamentUser {
    uid: string;
    isWinning: boolean;
    loyaltyLevel: number;
    minEnter: number;
    coinsEarn: number;
    rank: number;
    winGoldPrize: number;
    networkLogins: Array<ITounamentNetwordLogins>;
    currentWinningPrize: number;
}
interface ITounamentNetwordLogins {
    id: string;
    pic: string;
    network: string;
}
interface ITounamentWinInfo {
    bonusId: number;
    rank: number;
    currentWinningPrize: number;
    goldPrize: number;
}
declare class TounamentChampoin extends egret.DisplayObjectContainer {
    constructor();
    clearUI(): void;
    show(user: ITounamentUser): void;
}
declare class V1Game extends BingoMachine {
    Cartoes: Array<Array<number>>;
    getCardsGroup(value: number): Array<number>;
    protected changeCardNumberOrder(groupNumbers: Array<number>): Array<number>;
    constructor(gameConfigFile: string, configUrl: string, gameId: number);
    protected onServerData(data: Object): void;
    protected sendRoundOverRequest(): void;
    protected sendPlayRequest(): void;
    protected sendExtraRequest(saving?: boolean): void;
    protected sendCancelExtraReuqest(): void;
    createCardGroups(): void;
    onPlay(data: Object): void;
    protected changeNumberFromServer(num: number): number;
    onExtra(data: Object): void;
    protected showMissExtraBall(balls: Array<number>): void;
}
declare class TounamentUserItem extends egret.DisplayObjectContainer {
    constructor(user: ITounamentUser, rank: number, isMe: boolean);
    private addChildShield(rank);
}

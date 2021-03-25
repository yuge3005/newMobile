class MultiGameTopBar extends egret.DisplayObjectContainer {

    private piggyBank: TouchDownButton;

    private dealBtn: egret.DisplayObjectContainer;
    private timeBg: egret.Bitmap;
    private dealBtnText: egret.TextField;
    private dealTimeOverplus: egret.TextField;

    private blockPurchase: boolean;

    constructor() {
        super();

        this.blockPurchase = Boolean(PlayerConfig.player("is_block_purchase"));
		let haveDealOverplus = Trigger.instance.haveDealOverplus;
        let havePoTimer = Trigger.instance.havePoTimer;

        let bar_up: egret.Bitmap = Com.addBitmapAt(this, "lobby_json.bar_up", 0, 0);
        bar_up.scaleX = bar_up.scaleY = 2;

        // user level area
        let userLevelArea = new LevelBar();
        Com.addObjectAt(this, userLevelArea, 65, 2);

        // user coins area
        let userCoinsArea = new CoinsBar();
        Com.addObjectAt(this, userCoinsArea, 525, 22);

        // bank btn
        let bankBtn = new egret.DisplayObjectContainer();
        bankBtn.touchEnabled = true;
        bankBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showBank, this);
        Com.addObjectAt(this, bankBtn, 948, 16);
        // bank btn bg
        Com.addBitmapAt(bankBtn, "lobby_json.btn_bank", 0, 0);
        // bank btn text
        let bankBtnText = Com.addTextAt(bankBtn, 15, 3, 249, 90, 48, false, false);
        bankBtnText.fontFamily = "Righteous";
        bankBtnText.verticalAlign = "middle";
        bankBtnText.stroke = 2;
        bankBtnText.strokeColor = 0x004913;
        bankBtnText.text = MuLang.getText("buy", MuLang.CASE_UPPER);

        let haveDealTimer = havePoTimer && haveDealOverplus && !this.blockPurchase;
        // deal btn
        this.dealBtn = new egret.DisplayObjectContainer();
        this.dealBtn.touchEnabled = true;
        this.dealBtn.filters = (havePoTimer && !haveDealOverplus) || this.blockPurchase ? [MatrixTool.colorMatrix(0.33, 0.33, 1)] : [];
        this.dealBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showPo, this);
        Com.addObjectAt(this, this.dealBtn, 1212, 16);
        // deal btn bg
        Com.addBitmapAt(this.dealBtn, "lobby_json.btn_deal", 0, 0);
        // deal btn text
        this.dealBtnText = Com.addTextAt(this.dealBtn, 0, 3, 249, haveDealTimer ? 64: 90, haveDealTimer ? 42: 48, false, false);
        this.dealBtnText.fontFamily = "Righteous";
        this.dealBtnText.verticalAlign = "middle";
        this.dealBtnText.stroke = 2;
        this.dealBtnText.strokeColor = 0x800C68;
        this.dealBtnText.text = MuLang.getText("deal", MuLang.CASE_UPPER);
        // timer
        this.timeBg = Com.addBitmapAt(this.dealBtn, "lobby_json.time_base_lobby", 4, 64);
        this.timeBg.scale9Grid = new egret.Rectangle(16, 0, 12, 30);
        this.timeBg.width = 214;
        // overplus text
        this.dealTimeOverplus = Com.addTextAt(this.dealBtn, 4, 64, 214, 30, 28, false, false);
        this.dealTimeOverplus.fontFamily = "Righteous";
        this.dealTimeOverplus.verticalAlign = "middle";
        this.dealTimeOverplus.text = "00:00:00";
        this.timeBg.visible = this.dealTimeOverplus.visible = haveDealTimer;

        // user dinero area
        let dineroArea = new DineroBar();
        Com.addObjectAt(this, dineroArea, 1530, 31);

        // piggy bank
        this.piggyBank = Com.addDownButtonAt(this, "lobby_json.icon_piggybank", "lobby_json.icon_piggybank", 1940, 23, this.openPiggyBank.bind(this), true );
        this.piggyBank.visible = PiggyBankVo.enable;

        // setting btn
        let settingBtn = Com.addDownButtonAt(this, "lobby_json.btn_setting", "lobby_json.btn_setting", 2100, 17, this.showSetting.bind(this), true );

        this.cacheAsBitmap = true;
    }

    private showBank( event: egret.TouchEvent ): void {
        Trigger.instance.showBank();
    }

    /**
     * update overplus text
     * @param time 
     */
    public updateOverplusText(time: number): void {
        if (this.blockPurchase) return;
        if (this.timeBg.visible === false) {
			this.dealBtnText.height = 32;
			this.dealBtnText.size = 16;
			this.timeBg.visible = this.dealTimeOverplus.visible = true;
		}
		this.dealBtn.filters = [];
		this.dealTimeOverplus.text = Utils.secondToHour(time);
    }

    /**
	 * po overplus over
	 */
	public poOverplusOver(): void {
		if (this.blockPurchase) return;
		this.dealBtnText.height = 40;
		this.dealBtnText.size = 20;
		this.timeBg.visible = this.dealTimeOverplus.visible = false;
		this.dealBtn.filters = [MatrixTool.colorMatrix(0.33, 0.33, 1)];
	}

    /**
     * show po
     */
    private showPo(): void {
        if (this.blockPurchase) return;
		Trigger.showPo();
    }

    /**
     * unlock piggy bank
     */
    public unlockPiggyBank(): void {
        if (this.piggyBank) this.piggyBank.visible = true;
    }

    /**
     * open piggy bank
     */
    private openPiggyBank(): void {
        // Trigger.showPigBank();
    }

    /**
     * show setting
     */
    private showSetting(): void {
        Trigger.insertInstance( new GameSettingPopup );
    }
}
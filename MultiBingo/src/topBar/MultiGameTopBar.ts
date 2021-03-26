class MultiGameTopBar extends egret.DisplayObjectContainer {

    private backToLobbyBtn: TouchDownButton;
	private bankBtn: TouchDownButton;
	private menuBtn: TouchDownButton;
    private piggyBank: TouchDownButton;

    private blockPurchase: boolean;

    constructor() {
        super();

        this.blockPurchase = Boolean(PlayerConfig.player("is_block_purchase"));

        let bar_up: egret.Bitmap = Com.addBitmapAt(this, "multiTopbar_json.bar_up", 0, 0);
        bar_up.scaleX = bar_up.scaleY = 2;

        this.backToLobbyBtn = Com.addDownButtonAt( this, "multiTopbar_json.home", "multiTopbar_json.home", 0, 14, this.onButtonClick, true );
		this.menuBtn = Com.addDownButtonAt( this, "multiTopbar_json.btn_setting", "multiTopbar_json.btn_setting", 1908, 14, this.onButtonClick, true );

        // user level area
        let userLevelArea = new LevelBar();
        Com.addObjectAt(this, userLevelArea, 65, 2);

        // user coins area
        let userCoinsArea = new CoinsBar();
        Com.addObjectAt(this, userCoinsArea, 525, 22);

        this.bankBtn = Com.addDownButtonAt( this, "multiTopbar_json.btn_bank", "multiTopbar_json.btn_bank", 793, 5, this.onButtonClick, false );
        let txt: TextLabel = Com.addLabelAt( this, 10, 10, 390, 80, 48 );
		this.bankBtn.addChild(txt);
		txt.fontFamily = "Righteous";
		txt.stroke = 2;
		txt.strokeColor = 0;
		txt.setText( MuLang.getText("bank", MuLang.CASE_UPPER) );

        // user dinero area
        let dineroArea = new DineroBar();
        Com.addObjectAt(this, dineroArea, 1530, 31);

        // piggy bank
        this.piggyBank = Com.addDownButtonAt(this, "multiTopbar_json.icon_piggybank", "multiTopbar_json.icon_piggybank", 1940, 23, this.openPiggyBank.bind(this), true );
        this.piggyBank.visible = false;

        // setting btn
        let settingBtn = Com.addDownButtonAt(this, "multiTopbar_json.btn_setting", "multiTopbar_json.btn_setting", 2100, 17, this.showSetting.bind(this), true );

        this.cacheAsBitmap = true;
    }
    
	private onButtonClick( event: egret.TouchEvent ){
		if( event.target == this.backToLobbyBtn ){
			document.location.href = "../lobby";
		}
		else if( event.target == this.menuBtn ){
			MultiPlayerMachine.currentGame.dispatchEvent( new egret.Event("showGameSettings" ) );
		}
	}

    private showBank( event: egret.TouchEvent ): void {
        MultiPlayerMachine.currentGame.dispatchEvent( new egret.Event( "showBank" ) );
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
        MultiPlayerMachine.currentGame.dispatchEvent( new egret.Event( "showGameSettings" ) );
    }
}
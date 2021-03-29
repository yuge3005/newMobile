class MultiGameTopBar extends egret.DisplayObjectContainer {

    private backToLobbyBtn: TouchDownButton;
	private bankBtn: TouchDownButton;
	private menuBtn: TouchDownButton;
    private piggyBank: TouchDownButton;

    private blockPurchase: boolean;

    private coinsArea: CoinsBar;
    private levelArea: LevelBar;
    private dineroBar: DineroBar;

    constructor() {
        super();

        this.blockPurchase = Boolean(PlayerConfig.player("is_block_purchase"));

        let bar_up: egret.Bitmap = Com.addBitmapAt(this, "multiTopbar_json.bar_up", 0, 0);
        bar_up.width = 2000;
        bar_up.height = 117;

        this.backToLobbyBtn = Com.addDownButtonAt( this, "multiTopbar_json.home", "multiTopbar_json.home", 0, 14, this.onButtonClick, true );
		this.menuBtn = Com.addDownButtonAt( this, "multiTopbar_json.btn_setting", "multiTopbar_json.btn_setting", 1900, 14, this.onButtonClick, true );

        // user level area
        this.levelArea = new LevelBar();
        Com.addObjectAt(this, this.levelArea, 115, -5);

        // user coins area
        this.coinsArea = new CoinsBar();
        Com.addObjectAt(this, this.coinsArea, 580, 15);

        this.bankBtn = Com.addDownButtonAt( this, "multiTopbar_json.btn_bank", "multiTopbar_json.btn_bank", 1000, 5, this.onButtonClick, true );
        let txt: TextLabel = Com.addLabelAt( this, 10, 10, 390, 80, 48 );
		this.bankBtn.addChild(txt);
		txt.fontFamily = "Righteous";
		txt.stroke = 2;
		txt.strokeColor = 0;
		txt.setText( MuLang.getText("bank", MuLang.CASE_UPPER) );

        // user dinero area
        this.dineroBar = new DineroBar();
        Com.addObjectAt(this, this.dineroBar, 1530, 25);

        // piggy bank
        this.piggyBank = Com.addDownButtonAt(this, "multiTopbar_json.icon_piggybank", "multiTopbar_json.icon_piggybank", 1940, 23, this.openPiggyBank.bind(this), true );
        this.piggyBank.visible = false;

        this.cacheAsBitmap = true;

        this.updateCoinsDineroXp( PlayerConfig.player( "score.coins" ), PlayerConfig.player( "score.chips" ), PlayerConfig.player( "score.level" ) );
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

    public updateCoinsDineroXp( coins: number, dinero: number, xp: number ){
        if( coins != null )this.coinsArea.onCoinsChanged( coins );
        if( dinero != null )this.dineroBar.onDineroChanged( dinero );
        if( xp != null )this.levelArea.onXpChanged( xp );
    }
}
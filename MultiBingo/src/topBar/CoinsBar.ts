class CoinsBar extends egret.DisplayObjectContainer{

	private coinsText: TextLabel;

	public constructor() {
		super();

        Com.addBitmapAt(this, "lobby_json.number_bg", 5, 9);
        this.coinsText = Com.addLabelAt(this, 90, 14, 260, 72, 52, false, false);
        this.coinsText.fontFamily = "Righteous";
        this.coinsText.stroke = 2;
        this.coinsText.strokeColor = 0x9D7806;

        Com.addDownButtonAt(this, "lobby_json.icon_coin", "lobby_json.icon_coin", 0, 0, this.showBank.bind(this), true );

        this.onCoinsChanged(Number(UserVo.get("coins")));

        UserVo.onCoinsChanged = this.onCoinsChanged.bind(this);
	}

    private onCoinsChanged(coins: number): void {
		this.coinsText.setText( Utils.formatCoinsNumber(coins) );
    }

    private showBank( event: egret.TouchEvent ): void {
        MultiPlayerMachine.currentGame.dispatchEvent( new egret.Event( "showBank" ) );
    }
}
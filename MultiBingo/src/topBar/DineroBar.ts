class DineroBar extends egret.DisplayObjectContainer{

	private dineroText: TextLabel;

	public constructor() {
		super();

        Com.addBitmapAt(this, "multiTopbar_json.number_bg", 0, 0);

        this.dineroText = Com.addLabelAt(this, 10, 2, 210, 72, 52, false, false);
        this.dineroText.fontFamily = "Righteous";
        this.dineroText.stroke = 2;
        this.dineroText.strokeColor = 0x41A948;
        // this.onDineroChanged(Number(UserVo.get("dineros")));

        Com.addDownButtonAt(this, "multiTopbar_json.icon_dinero", "multiTopbar_json.icon_dinero", 224, 0, this.showBank.bind(this), true );

		// UserVo.onDineroChanged = this.onDineroChanged.bind(this);
	}

	private showBank( event: egret.TouchEvent ): void {
        let ev: egret.Event = new egret.Event( "showBank" );
        ev.data = 1;
        MultiPlayerMachine.currentGame.dispatchEvent( ev );
    }

    public onDineroChanged(dinero: number): void {
		this.dineroText.setText( Utils.formatCoinsNumber(dinero) );
    }
}
class FreeSpinButton extends TouchDownButton{

	private freeCountLeftTx: TextLabel;

	public constructor() {
		super( "bingoGameToolbar_json.FreeSpin", "bingoGameToolbar_json.FreeSpin" );

		this.addEventListener( egret.TouchEvent.TOUCH_TAP, this.freeSpinClick, this );
		this.enabled = true;

		Com.addBitmapAt( this, "bingoGameToolbar_json.FREE_" + MuLang.language, 17, 23 );
		Com.addBitmapAt( this, "bingoGameToolbar_json.free spin icon", 0, 108 );

		this.freeCountLeftTx = Com.addLabelAt( this, 120, 125, 135, 56, 56 );
	}

	private freeSpinClick( event: egret.TouchEvent ){
		SlotMachine.sendCommand( GameCommands.play );
		this.visible = false;
	}

	public setFreeCount( freeCount: number ){
		this.visible = Boolean( freeCount );
		this.freeCountLeftTx.setText( "X " + freeCount );
	}
}
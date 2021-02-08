class MissLockUI extends egret.DisplayObjectContainer{

	private missLockTip: egret.DisplayObjectContainer;

	public constructor( lockType: number ) {
		super();
		Com.addBitmapAt( this, "missionBar_json.btn_shadow", 0, 0 );
		Com.addBitmapAt( this, "missionBar_json.Locked", 146, 16 );

		this.touchEnabled = true;
		this.touchChildren = false;
		this.addEventListener( egret.TouchEvent.TOUCH_TAP, this.showMissionLockTip, this );

		this.buildTip( lockType );
	}

	private showMissionLockTip( event: egret.TouchEvent ){
		if( this.contains( this.missLockTip ) ) return;

		Com.addObjectAt( this, this.missLockTip, 154, -57 );
		this.missLockTip.scaleX = this.missLockTip.scaleY = 0.1;
		TweenerTool.tweenTo( this.missLockTip, { scaleX: 1, scaleY: 1 }, 300, 0, this.lockUIShowing.bind( this ) );
	}

	private buildTip( lockType: number ){
		this.missLockTip = new egret.DisplayObjectContainer;
		let tipBg: egret.Bitmap = Com.addBitmapAtMiddle( this.missLockTip, "missionBar_json.tips_bg", 0, 0 );
        // tip text
		let tipsArray = ["coming_soon", "from_level", "mission_updating_tip"];
        let tipText = Com.addLabelAt(this.missLockTip, -160, -55, 320, 85, 56, false, false);
		tipText.fontFamily = "Righteous";
		tipText.setText( MuLang.getText( tipsArray[lockType], MuLang.CASE_TYPE_CAPITALIZE ) );
		if (lockType === 1) tipText.setText( tipText.text.replace(":", ": " + PlayerConfig.player("mission.unlock_level") ) );
	}

	private lockUIShowing(){
		TweenerTool.tweenTo( this.missLockTip, { scaleX: 0.1, scaleY: 0.1 }, 300, 1500, MDS.removeSelf.bind( this, this.missLockTip ) );
	}
}
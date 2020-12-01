class BlackoutVsItem extends egret.DisplayObjectContainer{

	private isLeft: boolean;
	private headIcon: egret.Bitmap;
	private statusText: egret.TextField;

	public userId: string;

	private timer: egret.Timer;

	public constructor( isLeft: boolean, isTop: boolean, statusText: egret.TextField ) {
		super();

		this.isLeft = isLeft;
		this.x = isLeft ? 105 : 585;
		this.y = isTop ? 102 : 419;
		this.statusText = statusText;

		this.headIcon = Com.addBitmapAt(this, "blackout_vs_json.head", 0, 0);
		
		this.timer = new egret.Timer(200);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
		this.timer.start();

		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
	}

	public userInfo( userId: string, fbId: string, name: string) {
		let base: egret.Bitmap = Com.addBitmapAt(this, "blackout_vs_json.player_base", this.isLeft ? 212 : 150, 1);
		base.scaleX = -1;
		this.addChild(this.headIcon);
		this.headIcon.x -= this.isLeft ? 47 : 102;
		let headMask: egret.Bitmap = Com.addBitmapAt( this, "blackout_vs_json.head", this.headIcon.x, this.headIcon.y );
		this.headIcon.mask = headMask;
		if( fbId != "" ) Utils.downloadBitmapDataByFacebookID(fbId, 100, 100, MDS.onUserHeadLoaded.bind(this, this.headIcon, 75), this);
		
		this.statusText.text = "";
		this.userId = userId;
		let nameTx: egret.TextField = Com.addTextAt(this, this.headIcon.x + 90, 20 + BrowserInfo.textUp, 250, 30, 30);
		nameTx.textAlign = "left";
		nameTx.text = name;

		this.removeTimer();
	}

	private onTimer(event: egret.TimerEvent) {
		let texture: egret.Texture = RES.getRes( "blackout_vs_json.Avatar_0" + Math.floor( Math.random() * 6 + 1 ) );
		this.headIcon.texture = texture;
	}

	private onRemove(event: egret.Event) {
		this.removeTimer();
		if( this.statusText.parent ) this.statusText.parent.removeChild( this.statusText );
	}

	private removeTimer() {
		if (this.timer) {
			this.timer.reset();
			this.timer.stop();
			this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
			this.timer = null;
		}	
	}
}
class LevelBar extends egret.DisplayObjectContainer{

    private xpProgress: egret.Bitmap;
	private userHead: egret.Bitmap;
	private redPoint: RedPoint;
    private xpProgressText: egret.TextField;
	private levelText: TextLabel;

	public constructor() {
		super();

		this.addXp();
		this.addHead();
		this.addRedPoint();

        this.onXpChanged(UserVo.get("xpProgress"));
        this.onLevelChanged(UserVo.get("level"));

        UserVo.onLevelChanged = this.onLevelChanged.bind(this);
        UserVo.onXpChanged = this.onXpChanged.bind(this);
	}

	private addHead(){
		// user head icon
        this.userHead = Com.addBitmapAt(this, "lobby_json.avatar", 0, 17);
        this.userHead.touchEnabled = true;
        this.userHead.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showUserProfile, this);
		if (UserVo.get("fbId") !== "") FacebookBitmap.downloadBitmapDataByFacebookID(UserVo.get("fbId"), 100, 100, MDS.onUserHeadLoaded.bind( this, this.userHead, 95 ), this);

		// head mask
        let headMask: egret.Shape = new egret.Shape;
        GraphicTool.drawCircle( headMask, new egret.Point( 47, 47 ), 47, 0 );
        Com.addObjectAt(this, headMask, 0, 17);
        this.userHead.mask = headMask;
        Com.addBitmapAt(this, "lobby_json.btn_player_outline", 0, 17);
	}

	private addXp(){
		Com.addBitmapAt(this, "lobby_json.experience_bg", 39, 33);
		this.xpProgress = Com.addBitmapAt(this, "lobby_json.experience_progress_bar", 41, 33);
        this.xpProgress.mask = new egret.Rectangle(0, 0, 0, 67);
		// level star
        Com.addBitmapAt(this, "lobby_json.icon_experience", 321, 0);
        // xp progress text
        this.xpProgressText = Com.addTextAt(this, 108, 46, 212, 46, 32, false, false);
        this.xpProgressText.fontFamily = "Righteous";
        this.xpProgressText.verticalAlign = "middle";
        this.xpProgressText.textColor = 0xFFFFFF;
        this.xpProgressText.stroke = 2;
        this.xpProgressText.strokeColor = 0x00045F;
		// level text
        this.levelText = Com.addLabelAt(this, 338, 39, 88, 46, 40, false, false);
        this.levelText.fontFamily = "Righteous";
        this.levelText.stroke = 2;
        this.levelText.strokeColor = 0x00045F;
	}

	private addRedPoint(){
		// red point
        this.redPoint = new RedPoint();
        Com.addObjectAt(this, this.redPoint, 15, 30);
        this.redPointCheck();
	}

    public redPointCheck(): void {
        let preferencesData = PlayerConfig.player("user_info.preferences");
        let answersData = PlayerConfig.player("user_info.preferences_answer");
		let total = ((PlayerConfig.player("user_info.email_is_verified") || false) ? 0 : 1) + (((PlayerConfig.player("user_info.telephone_is_verified") || Number(PlayerConfig.player("loyalty.loyalty_level")) < 3) || false) ? 0 : 1) + (preferencesData.length - answersData.length);

        this.redPoint.check(total);
    }

    private showUserProfile(): void {
        this.parent.dispatchEvent(new egret.Event(Lobby.SHOW_USER_PROFILES));
    }

    private onXpChanged(progress: number): void {
        if (progress >= 1) progress = 1;
        this.xpProgressText.text = (progress * 100).toFixed(1) + "%";
        this.xpProgress.mask = new egret.Rectangle(0, 0, this.xpProgress.width * progress, 67);
    }

    private onLevelChanged(level: number): void {
		this.levelText.setText( "" + level );
    }
}
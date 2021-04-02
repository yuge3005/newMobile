class LevelBar extends egret.DisplayObjectContainer{

	public static LEVEL_UP_BONUS: string = "levelUpBonus";

    private xpProgress: egret.Bitmap;
	private userHead: egret.Bitmap;
	private redPoint: RedPoint;
    private xpProgressText: egret.TextField;
	private levelText: TextLabel;
	private level: number;
	private thisLevelXp: number;
	private nextLevelXp: number;
	private levelUpRecord: Object = {};

	public constructor() {
		super();

		this.addXp();
		this.addHead();
		this.addRedPoint();

		this.level = PlayerConfig.player( "score.level" );
		this.thisLevelXp = PlayerConfig.player( "score.this_level_xp" );
		this.nextLevelXp = PlayerConfig.player( "score.next_level_xp" );

        this.onLevelChanged(PlayerConfig.player( "score.level" ));
	}

	private addHead(){
		// user head icon
        this.userHead = Com.addBitmapAt(this, "multiTopbar_json.avatar", 0, 17);
        this.userHead.touchEnabled = true;
        this.userHead.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showUserProfile, this);
		if (PlayerConfig.player("facebook_id") !== "") FacebookBitmap.downloadBitmapDataByFacebookID(PlayerConfig.player("facebook.id"), 100, 100, MDS.onUserHeadLoaded.bind( this, this.userHead, 95 ), this);

		// head mask
        let headMask: egret.Shape = new egret.Shape;
        GraphicTool.drawCircle( headMask, new egret.Point( 47, 47 ), 47, 0 );
        Com.addObjectAt(this, headMask, 0, 17);
        this.userHead.mask = headMask;
        Com.addBitmapAt(this, "multiTopbar_json.btn_player_outline", 0, 17);
	}

	private addXp(){
		Com.addBitmapAt(this, "multiTopbar_json.experience_bg", 39, 33);
		this.xpProgress = Com.addBitmapAt(this, "multiTopbar_json.experience_progress_bar", 41, 33);
        this.xpProgress.mask = new egret.Rectangle(0, 0, 0, 67);
		// level star
        Com.addBitmapAt(this, "multiTopbar_json.icon_experience", 321, 0);
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
        // this.parent.dispatchEvent(new egret.Event(Lobby.SHOW_USER_PROFILES));
    }

    public onXpChanged(xp: number): void {
		let progress: number = ( xp - this.thisLevelXp ) / ( this.nextLevelXp - this.thisLevelXp );
        if (progress > 1){
			progress = 1;
			this.levelUp();
		}
        this.xpProgressText.text = (progress * 100).toFixed(1) + "%";
        this.xpProgress.mask = new egret.Rectangle(0, 0, this.xpProgress.width * progress, 67);
    }

    private onLevelChanged(level: number): void {
		this.level = level;
		this.levelText.setText( "" + level );
    }

    private levelUp(){
		if (!this.levelUpRecord[this.level + ""]) {
			this.levelUpRecord[this.level + ""] = true;
			// send level up request
			this.sendCollectBonusRequest( Number( MultiPlayerMachine.currentGame["connetKeys"]["sala"].replace( /\D/g, "" ) ), 50 );
			return true;
		}
	}

	private sendCollectBonusRequest(gameID: number, currentBet: number): void {
		egret.log( "gameID:" + gameID )
		let requestData = { json: JSON.stringify({ "bonus_type": "level_up", "seed": new Date().valueOf(), "debug": {}, "fb": PlayerConfig.player("facebook.id"), "current_bet": currentBet, "machineId": gameID, "level": this.level, "game_id": gameID }) };
		new DataServer().getDataFromUrl(PlayerConfig.config("http") + "://" + PlayerConfig.config("host") + "/cmd.php?action=update_user_bonus", this.collectRequestSuccess.bind(this), this, true, requestData, this.collectRequestFailed);
	}

	/**
	 * collect bonus request success
	 **/
	private collectRequestSuccess(data: any): void {
		if (typeof data === "undefined" || data === null) return;
		data = typeof (data) === "string" ? JSON.parse(data) : data;
		
		let level = Number(data["level"]);

		// refresh toolbar level and xp progress
		this.level = level;
		this.thisLevelXp = Number(data["this_level_xp"]);
		this.nextLevelXp = Number(data["next_level_xp"]);
		this.levelText.setText( "" + level );

		let loyalty: number = data["loyalty_point"] - Number( PlayerConfig.player( "loyalty.loyalty_point" ) );

		//playerData
		let datas: Array<IKeyValues> = <Array<IKeyValues>>[];
		datas[0] = <IKeyValues>{key:"score.level",value:level};
		datas[1] = <IKeyValues>{key:"score.this_level_xp",value:this.thisLevelXp};
		datas[2] = <IKeyValues>{key:"score.next_level_xp",value:this.nextLevelXp};
		datas[3] = <IKeyValues>{key:"levelMultiplier",value:data["levelMultiplier"]};
		datas[4] = <IKeyValues>{key:"chipsLevelMultiplier",value:data["chipsLevelMultiplier"]};
		datas[5] = <IKeyValues>{key:"levelMultiplierPuzzle",value:data["levelMultiplierPuzzle"]};
		datas[6] = <IKeyValues>{key:"loyalty.loyalty_point",value:data["loyalty_point"]};
		LocalDataManager.updatePlayerDatas( datas );

		this.onXpChanged( Number(data["xp"]) );

		// LevelUp.targetCoins = data["coins"];
		let bonuses = <Array<Object>>data["bonuses"];
		let bonus = 0;
		if (typeof bonuses !== "undefined" && bonuses !== null) {
			for (let i = 0; i < bonuses.length; i++) {
				bonus += Number(bonuses[i]["level_up_bonus"]);
			}
		}

		this.showBonusAndLoyalty( bonus, loyalty );

		// check have someone game unlock?
		// if (unlockedGameID.length > 0) {
		// 	UnlockGame.gameID = unlockedGameID[0];
		// 	Trigger.insertInstance(new UnlockGame());
		// }

		// data["reward_items"]
	}

	/**
	 * collect bonus request failed
	 **/
	private collectRequestFailed(data: any): void {
		console.log("collect bonus request failed!");
	}

	private showBonusAndLoyalty( bonus: number, loyalty: number ){
		let bt: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		let btContainer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		this.addChildAt( btContainer, 0 );
		Com.addObjectAt( btContainer, bt, 60, -150 );
		bt.touchEnabled = true;

		let bg: egret.Bitmap = Com.addBitmapAt( bt, "multiTopbar_json.BB_star_open_bg", 0, 0 );
		bg.width = 300;
		bg.height = 350;

		let wbg1: egret.Bitmap = Com.addBitmapAt( bt, "multiTopbar_json.BB_star_benefit_bg", 17, 60 );
		wbg1.height = 135;

		let wbg2: egret.Bitmap = Com.addBitmapAt( bt, "multiTopbar_json.BB_star_benefit_bg", 17, 196 );
		wbg2.height = 135;

		Com.addBitmapAt( bt, "multiTopbar_json.loyalty_points_icon", 60, 90 );
		let lp: egret.TextField = Com.addTextAt( bt, 135, 90, 140, 74, 52 );
		lp.verticalAlign = "middle";
		lp.textAlign = "left";
		lp.text = "+" + Math.round( loyalty );

		let tip: TextLabel = Com.addLabelAt( bt, 27, 220, 240, 28, 28 );
		tip.setText( MuLang.getText( "level_up_bonus" ) );

		let coins: TextLabel = Com.addLabelAt( bt, 17, 265, 260, 36, 36 );
		coins.setText( "" + Math.round( bonus ) );

		TweenerTool.tweenTo( bt, { y: 100 }, 600, 0, this.btBack.bind( this, bt, btContainer, bonus ) );

		btContainer.mask = new egret.Rectangle( 60, 100, 300, 350 );
	}

	private btBack( bt: egret.DisplayObjectContainer, btContainer: egret.DisplayObjectContainer, bonus: number ){
		TweenerTool.tweenTo( bt, { y: -150 }, 600, 1000, MDS.removeSelf.bind( this, btContainer ) );

		let ev: egret.Event = new egret.Event( LevelBar.LEVEL_UP_BONUS );
		ev.data = bonus;
		this.dispatchEvent( ev );

		if( this.stage ){
			let flyCoins: FlyingCoins = new FlyingCoins();
			flyCoins.fly( 15, new egret.Point( 100, 85 ), new egret.Point(350, 40), new egret.Point( 250, 500 ), 0.15, 0.1, 0.3 );
			this.stage.addChild( flyCoins );
		}
	}
}
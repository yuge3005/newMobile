class XpBar extends egret.DisplayObjectContainer{
	private xpProccessUI: egret.Bitmap;
	private starUI: egret.Bitmap;
	private levelTx: TextLabel;
	private xpProccessTx: TextLabel;

	private level: number;
	private thisLevelXp: number;
	private nextLevelXp: number;
	private currentXp: number;
	
	private _xpProccess: number;
	private get xpProccess(): number{
		return this._xpProccess;
	}
	private set xpProccess( value: number ){
		this._xpProccess = value;
		this.xpProccessTx.text = ( value * 100 ).toFixed(1) + "%";
		this.xpProccessUI.mask = new egret.Rectangle( 0, 0, value * this.xpProccessUI.width, this.xpProccessUI.height );
	}

	private levelUpRecord: Object = {};

	public constructor() {
		super();

		Com.addBitmapAt( this, "bingoGameToolbar_json.xp", 0, 0 );
		this.xpProccessUI = Com.addBitmapAt( this, "bingoGameToolbar_json.xp_filling", 17, 11 );
		this.starUI = Com.addBitmapAtMiddle( this, "bingoGameToolbar_json.Group-22", 21, 22 );

		this.levelTx = Com.addLabelAt( this, -5, 11, 50, 20, 20, true );
		this.levelTx.bold = true;
		this.levelTx.strokeColor = 0x888888;
		this.xpProccessTx = Com.addLabelAt( this, 75, 20, 225, 32, 32, true );
		this.xpProccessTx.bold = true;

		this.level = PlayerConfig.player( "score.level" );
		this.thisLevelXp = PlayerConfig.player( "score.this_level_xp" );
		this.nextLevelXp = PlayerConfig.player( "score.next_level_xp" );

		this.levelTx.setText( "" + this.level );
		this.xpProccess = 0;
		this.updateXp( PlayerConfig.player( "score.xp" ) );
	}

	public updateXp( xp: number ){
		this.currentXp = xp;
		let xpProccessNum: number = ( this.currentXp - this.thisLevelXp ) / ( this.nextLevelXp - this.thisLevelXp );

		if( xpProccessNum >= 1 ){
			this.levelUp();
			xpProccessNum = 1;
		}
		else if( xpProccessNum < 0 ) xpProccessNum = 0;

		TweenerTool.tweenTo( this, { xpProccess: xpProccessNum }, 330 );
	}

	private levelUp(){
		if (!this.levelUpRecord[this.level + ""]) {
			this.levelUpRecord[this.level + ""] = true;
			// send level up request
			this.sendCollectBonusRequest( BingoMachine.currentGameId, GameData.currentBet );
			return true;
		}
	}

	private sendCollectBonusRequest(gameID: number, currentBet: number): void {
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
		this.thisLevelXp = Number(data["this_level_xp"]);
		this.nextLevelXp = Number(data["next_level_xp"]);
		this.level = level;
		this.levelTx.setText( "" + level );
		this.updateXp( Number(data["xp"]) );

		// PlayerConfig.player("score.level", level);
		// if (data["levelMultiplier"]) PlayerConfig.player("levelMultiplier", data["levelMultiplier"]);
		// if (data["chipsLevelMultiplier"]) PlayerConfig.player("chipsLevelMultiplier", data["chipsLevelMultiplier"]);
		// if (data["levelMultiplierPuzzle"]) PlayerConfig.player("levelMultiplierPuzzle", data["levelMultiplierPuzzle"]);

		// if (Lobby.getInstance()) Lobby.getInstance().unlockMission();

		// // calculate total level up bonus
		// let bonuses = <Array<Object>>data["bonuses"];
		// let bonus = 0;
		// if (typeof bonuses !== "undefined" && bonuses !== null) {
		// 	for (let i = 0; i < bonuses.length; i++) {
		// 		bonus += Number(bonuses[i]["level_up_bonus"]);
		// 	}
		// }

		// // show level up popup
		// LevelUp.level = level;
		// LevelUp.maxBet = Number(data["user_max_bet"]);
		// LevelUp.coins = bonus === 0 ? PlayerConfig.player("bonus.level_up_bonus." + data["level"]) : bonus;
		// LevelUp.targetCoins = data["coins"];
		
		
		// check have someone game unlock?
		// if (unlockedGameID.length > 0) {
		// 	UnlockGame.gameID = unlockedGameID[0];
		// 	Trigger.insertInstance(new UnlockGame());
		// }

		// data["reward_items"]
		trace( data );
	}

	/**
	 * collect bonus request failed
	 **/
	private collectRequestFailed(data: any): void {
		console.log("collect bonus request failed!");
	}
}
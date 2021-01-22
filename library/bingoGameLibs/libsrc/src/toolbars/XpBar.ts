class XpBar extends egret.DisplayObjectContainer{

	public static LEVEL_UP_BONUS: string = "levelUpBonus";

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

		LocalDataManager.updatePlayerData( "score.xp", xp );
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

		//mexBet
		let maxBet: number = Number(data["user_max_bet"]);
		if( GameData.maxBet < maxBet ) GameData.bets.push( maxBet );

		// LevelUp.targetCoins = data["coins"];
		let bonuses = <Array<Object>>data["bonuses"];
		let bonus = 0;
		if (typeof bonuses !== "undefined" && bonuses !== null) {
			for (let i = 0; i < bonuses.length; i++) {
				bonus += Number(bonuses[i]["level_up_bonus"]);
			}
		}

		this.showBonusAndLoyalty( bonus, loyalty );
		
		// if (Lobby.getInstance()) Lobby.getInstance().unlockMission();
		
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
		Com.addObjectAt( btContainer, bt, 0, 0 );
		bt.touchEnabled = true;

		let bg: egret.Bitmap = Com.addBitmapAt( bt, "bingoGameToolbar_json.BB_star_open_bg", 0, 0 );
		bg.width = 300;
		bg.height = 350;

		let wbg1: egret.Bitmap = Com.addBitmapAt( bt, "bingoGameToolbar_json.BB_star_benefit_bg", 17, 60 );
		wbg1.height = 135;

		let wbg2: egret.Bitmap = Com.addBitmapAt( bt, "bingoGameToolbar_json.BB_star_benefit_bg", 17, 196 );
		wbg2.height = 135;

		Com.addBitmapAt( bt, "bingoGameToolbar_json.loyalty_points_icon", 60, 90 );
		let lp: egret.TextField = Com.addTextAt( bt, 135, 90, 140, 74, 52 );
		lp.verticalAlign = "middle";
		lp.textAlign = "left";
		lp.text = "+" + Math.round( loyalty );

		let tip: TextLabel = Com.addLabelAt( bt, 27, 220, 240, 28, 28 );
		tip.setText( MuLang.getText( "level_up_bonus" ) );

		let coins: TextLabel = Com.addLabelAt( bt, 17, 265, 260, 36, 36 );
		coins.setText( "" + Math.round( bonus ) );

		TweenerTool.tweenTo( bt, { y: - 350 }, 600, 0, this.btBack.bind( this, bt, btContainer, bonus ) );

		btContainer.mask = new egret.Rectangle( 0, -350, 300, 350 );
	}

	private btBack( bt: egret.DisplayObjectContainer, btContainer: egret.DisplayObjectContainer, bonus: number ){
		TweenerTool.tweenTo( bt, { y: 0 }, 600, 1000, MDS.removeSelf.bind( this, btContainer ) );

		let ev: egret.Event = new egret.Event( XpBar.LEVEL_UP_BONUS );
		ev.data = bonus;
		this.dispatchEvent( ev );

		if( this.stage ){
			let flyCoins: FlyingCoins = new FlyingCoins();
			flyCoins.fly( 10, new egret.Point( 730, 435 ), new egret.Point(350, 520), new egret.Point( 400, 300 ), 0.15, 0.1, 0.3 );
			this.stage.addChild( flyCoins );
		}
	}
}
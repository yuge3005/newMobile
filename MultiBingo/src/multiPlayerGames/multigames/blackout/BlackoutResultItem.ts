class BlackoutResultItem extends egret.DisplayObjectContainer{

	public userId: string;
	private isMe: boolean;
	private static myHeadIcon: egret.Bitmap;

	private nameTx: egret.TextField;
	private scoreTx: egret.TextField;

	public constructor( itemData: Object, index: number ) {
		super();

		this.userId = itemData["userId"];
		this.isMe = this.userId == PlayerConfig.player( "user.id" );
		let headIcon: egret.Bitmap;
		if( this.isMe ){
			Com.addBitmapAt( this, "blackout_rank_json.your_points", -14, 13 );
			if( BlackoutResultItem.myHeadIcon ){
				headIcon = BlackoutResultItem.myHeadIcon;
				Com.addObjectAt( this, headIcon, -13, 12 );
				Com.addObjectAt( this, headIcon.mask as egret.Bitmap, -13, 12 );
			}
			else{
				headIcon = Com.addBitmapAt( this, "blackout_vs_json.head", -13, 12 );
				headIcon.width = headIcon.height = 98;
				Utils.downloadBitmapDataByFacebookID( PlayerConfig.player( "facebook_id" ), 100, 100, MDS.onUserHeadLoaded.bind( this, headIcon, 98 ), this );
				let maskIcon: egret.Bitmap = Com.addBitmapAt( this, "blackout_vs_json.head", -13, 12 );
				maskIcon.width = maskIcon.height = 98;
				headIcon.mask = maskIcon;
				BlackoutResultItem.myHeadIcon = headIcon;
			}
			this.resultText( itemData["points"], 100, 50, 190, 50, PlayerConfig.player("facebook.name") );
		}
		else{
			Com.addBitmapAt( this, "blackout_rank_json.other_points", 0, 0 );
			headIcon = Com.addBitmapAt( this, "blackout_vs_json.head", 0, 0 );
			this.resultText( itemData["points"], 85, 23, 175, 23, itemData["name"], "", itemData["selfRoundOver"] );
			if( itemData["headUrl"] != "" ){
				Utils.downloadBitmapDataByFacebookID( itemData["headUrl"], 100, 100, MDS.onUserHeadLoaded.bind( this, headIcon, 75 ), this );
				let maskIcon: egret.Bitmap = Com.addBitmapAt( this, "blackout_vs_json.head", 0, 0 );
				maskIcon.width = maskIcon.height = 75;
				headIcon.mask = maskIcon;
			}
		}

		let orderTx: egret.TextField = Com.addTextAt( this, -55, this.isMe ? 45 : 15, 40, 40, 40, true, true );
		orderTx.stroke = 2;
		orderTx.strokeColor = 0xB05401;
		orderTx.text = "" + (index + 1);
		orderTx.italic = true;
	}

	private resultText( points: number, ltxX: number, ltxY: number, rtxX: number, rtxY: number, name: string, addtionString: string = "", selfRoundOver: boolean = true ){
		this.nameTx = MDS.addGameText( this, ltxX, ltxY + BrowserInfo.textUp, 25, 0xFFFFFF, name, false, 140, addtionString );
		let tx: egret.TextField = Com.addTextAt( this, rtxX, rtxY + BrowserInfo.textUp, 200, 25, 25 );
		tx.textAlign = "right";
		if( selfRoundOver ) tx.text = MuLang.getText( "score" ) + ":" + points;
		else tx.text = MuLang.getText( "waiting_for_result" );
		this.scoreTx = tx;
	}

	public showCrown( award: Object ){
		if( this.isMe ){
			Com.addBitmapAt( this, "blackout_rank_json.Crown", -34, -12 );
			this.nameTx.y -= 14;
			Com.addBitmapAt( this, "blackout_rank_json.icon_coins", 100, 75 );
			this.scoreTx.x = 125;
			this.scoreTx.y = 79 + BrowserInfo.textUp;
			this.scoreTx.size = 16;
			this.scoreTx.text = Utils.formatCoinsNumber( award["award"] );
			this.scoreTx.bold = true;
			this.scoreTx.textAlign = "left";

			Com.addDownButtonAt( this, "blackout_rank_json.collect_base", "blackout_rank_json.collect_base", 307, 67, this.collectCoins.bind(this), true );
			let btTxt: egret.TextField = Com.addTextAt( this, 230, 42 + BrowserInfo.textUp, 156, 43, 22 );
			btTxt.verticalAlign = "middle";
			btTxt.text = MuLang.getText( "collect" );
		}
		else{
			Com.addBitmapAt( this, "blackout_rank_json.Crown", -33, -35 );
		}
	}

	private collectCoins(event: egret.TouchEvent) {
		if( Blackout.joinedRoomData && Blackout.joinedRoomData["award"] > 0 && Blackout.joinedRoomData["award"] && Blackout.joinedRoomData["collected"] == false ){
			MultiServer.getBlackoutAward( Blackout.joinedRoomData["id"] );
			Blackout.joinedRoomData["collected"] = true;
			let startPt: egret.Point = MDS.getDisplayObjectGlobelPoint(event.target);
			Trigger.flyingCoins( 10, startPt, new egret.Point(600, 600), 0.1, 0.1, 0.7 );
		}
		( event.currentTarget as TouchDownButton ).touchEnabled = false;
		( event.currentTarget as TouchDownButton ).filters = [ MatrixTool.colorMatrix( 0.5, 0.1, 1 ) ];
	}
}
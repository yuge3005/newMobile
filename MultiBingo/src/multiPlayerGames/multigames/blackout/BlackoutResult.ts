class BlackoutResult extends MultiCoverBars{

	private playerList: Array<BlackoutResultItem>;
	private dataContaint: egret.DisplayObjectContainer;
	private myDataContaint: egret.DisplayObjectContainer;

	private otherPlayerInfo: Array<Object>;

	public constructor( otherPlayerInfo: Array<Object> ) {
		super();

		this.otherPlayerInfo = otherPlayerInfo;

		Com.addBitmapAt( this, "blackout_rank_json.bg", 0, 0 );
		Com.addBitmapAt( this, "blackout_rank_json.base", 8, 0 );

		Com.addBitmapAtMiddle( this, "blackout_rank_json.VICTORY_" + MuLang.language, 392, 63 );

		Com.addDownButtonAt( this, "blackout_rank_json.X", "blackout_rank_json.X", 723, 85, this.onClose.bind(this), true );

		this.dataContaint = new egret.DisplayObjectContainer;
		this.addChild( this.dataContaint );
	}

	public setList( playerList: Array<Object> ){
		this.dataContaint.removeChildren();
		this.playerList = [];
		let hasGotMe: boolean = false;
		this.combine(playerList);
		for( let i: number = 0; i < playerList.length; i++ ){
			this.playerList[i] = new BlackoutResultItem( playerList[i], i );
			Com.addObjectAt( this.dataContaint, this.playerList[i], 66, 140 + 90 * i + ( hasGotMe ? 50 : 0 ) );
			if( playerList[i]["userId"] == PlayerConfig.player( "user.id" ) ){
				hasGotMe = true;
				this.setMyScore( playerList[i] );
			}
		}
	}

	public setAward( award: Object ){
		for( let i: number = 0; i < this.playerList.length; i++ ){
			if( this.playerList[i].userId == award["userId"] ){
				this.playerList[i].showCrown( award );
				break;
			}
		}
	}

	private onClose( event: egret.TouchEvent ){
		this.dispatchEvent( new egret.Event( "closeResultBar" ) );
	}

	private setMyScore( myData: Object ){
		if( this.myDataContaint ) return;
		this.myDataContaint = new egret.DisplayObjectContainer;
		this.addChild( this.myDataContaint );
		this.setMyData( 155, myData["markNum"], "markNum" );
		this.setMyData( 207, myData["fastMarkBonus"], "fastMarkBonus" );
		this.setMyData( 259, myData["bingo"], "bingo" );
		this.setMyData( 311, myData["multiBingo"], "multiBingo" );
		this.setMyData( 363, myData["doubleBonus"], "doubleBonus" );
		this.setMyData( 415, myData["penalties"], "penalties" );
		this.setMyData( 490, myData["points"], "total", 30 );
	}

	private setMyData( itemY: number, itemData: number, itemName: string, size: number = 20 ){
		MDS.addGameText( this.myDataContaint, 480, itemY, size, 0xFFFFFF, itemName, false, 200, "", 1 );
		let scoreColor: number;
		if( itemData > 0 ) scoreColor = 0xFFF877;
		else if( itemData == 0 ) scoreColor = 0xFFFFFF;
		else scoreColor = 0x61AEE2;
		let scoreTx: egret.TextField = MDS.addGameText( this.myDataContaint, 600, itemY, size, scoreColor, itemName, false, 137, "", 1 );
		scoreTx.textAlign = "right";
		scoreTx.text = "" + itemData;
	}

	private combine(playerList: Array<Object>) {
		for (let i: number = 0; i < this.otherPlayerInfo.length; i++){
			let getData: boolean = false;
			for (let j: number = 0; j < playerList.length; j++) {
				if (this.otherPlayerInfo[i]["userId"] == playerList[j]["userId"]) {
					playerList[j]["headUrl"] = this.otherPlayerInfo[i]["headUrl"];
					playerList[j]["name"] = this.otherPlayerInfo[i]["name"];
					if( !playerList[j]["name"] ) playerList[j]["name"] = MuLang.getText( "guest" ) + playerList[j]["userId"].substring( playerList[j]["userId"].length - 4 );
					getData = true;
					break;
				}
			}

			if (!getData) {
				let ob: Object = { headUrl: this.otherPlayerInfo[i]["headUrl"], userId: this.otherPlayerInfo[i]["userId"], name: this.otherPlayerInfo[i]["name"], point: 0, selfRoundOver: false };
				if( !ob["name"] ) ob["name"] = MuLang.getText( "guest" ) + ob["userId"].substring( ob["userId"].length - 4 );
				playerList.push( ob );
			}
		}
	}
}
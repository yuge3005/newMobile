class BlackoutVs extends egret.DisplayObjectContainer{

	private players: Array<BlackoutVsItem>;

	public constructor() {
		super();

		Com.addBitmapAt( this, "blackout_vs_json.bg", 0, 0 );

		this.players = [];
		for( let i: number = 0; i < 4; i++ ){
			this.players[i] = this.buildBlackoutVsItemByIndex(i);
		}
		this.players[0].userInfo( PlayerConfig.player("user.id"), PlayerConfig.player("facebook_id"), PlayerConfig.player("facebook.name"));

		this.touchEnabled = true;
		this.touchChildren = false;
	}

	private buildBlackoutVsItemByIndex( index: number ): BlackoutVsItem{
		let isLeft: boolean = index < 2;
		let isTop: boolean = index % 2 == 0;
		let item: BlackoutVsItem = new BlackoutVsItem(isLeft, isTop, this.waitingText(isLeft, isTop));
		this.addChild(item);
		return item;
	}

	private waitingText( isLeft: boolean, isTop: boolean ): egret.TextField{
		let tx: egret.TextField = Com.addTextAt( this, isLeft ? 4 : 400, ( isTop ? 220 : 536 ) + BrowserInfo.textUp, 350, 20, 20 );
		tx.textAlign = isLeft ? "left" : "right";
		tx.textColor = 0xBCBCBC;
		tx.text = MuLang.getText( "wait_to_find_the_other_player" );
		return tx;
	}

	public gotPlayer( data: Object ){
		let userIds: Array<string> = data["userIds"];
		this.userHasGone( userIds );
		for( let i: number = 0; i < userIds.length; i++ ){
			let alreadyInRoom: boolean = false;
			for( let j: number = 0; j < 4; j++ ){
				if( !this.players[j].userId ) continue;
				if( this.players[j].userId == userIds[i] ){
					alreadyInRoom = true;
					break;
				}
			}
			if( !alreadyInRoom ){
				this.addNewPlayer( data["users"][userIds[i]] );
			}
		}		
	}

	private userHasGone( userIds: Array<string> ){
		for( let i: number = 0; i < 4; i++ ){
			if( this.players[i].userId && userIds.indexOf( this.players[i].userId ) < 0 ){
				trace( "userHasGone" );
				trace( userIds[i] );
				this.removeChild( this.players[i] );
				this.players[i] = this.buildBlackoutVsItemByIndex(i);
			}
		}
	}

	private addNewPlayer( userInfo: Object ){
		for( let i: number = 0; i < 4; i++ ){
			if( !this.players[i].userId ){
				if( userInfo ) this.players[i].userInfo( userInfo["userId"], userInfo["fbId"], userInfo["name"] );
				else this.players[i].userInfo( userInfo["userId"], "111", MuLang.getText( "Player" ) + ( i + 1 ) );
				break;
			}
		}
	}
}
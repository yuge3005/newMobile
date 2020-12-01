class BlackoutOtherPlayers extends egret.DisplayObjectContainer{

	private playerObject: Object;
	public otherPlayerInfo: Array<Object>;

	public constructor() {
		super();

		this.clearPlayers();
	}

	public clearPlayers(){
		this.removeChildren();
		this.playerObject = {};
	}

	public selectNumber( data: Object ){
		let playerItem = this.playerObject[data["userId"]];
		if( playerItem ){
			playerItem.getPoint( data["points"] );
		}
	}

	public callBingo( data: Object ){
		let playerItem = this.playerObject[data["userId"]];
		if( playerItem ){
			playerItem.getPoint( data["points"] );
		}
	}

	public powerUp( data: Object ){
		let playerItem = this.playerObject[data["userId"]];
		if( playerItem ){
			playerItem.getPowerUp( data["powerUpType"] );
		}
	}

	public getRoomMate(){
		let players: Array<Object> = MultiServer.getRoomMate();
		players = this.olderRoomMate( players );
		for( let i: number = 0; i < players.length; i++ ){
			let playerItem: BlackoutPlayerItem = new BlackoutPlayerItem( players[i] );
			Com.addObjectAt( this, playerItem, 0, 136 * i + 46 );
			this.playerObject[players[i]["userId"]] = playerItem;
			if( players[i]["userId"] == PlayerConfig.player( "user.id" ) ) playerItem.y += 50;
		}
		this.otherPlayerInfo = players;
	}

	public addUser( userName: string, fbId: string, userId: string ){
		if( !userId ) return;
		if( this.playerObject[userId] ) return;
		var count: number = 0;
		for( var ob in this.playerObject )count++;
		let player: Object = {}
		player["name"] = userName;
		player["headUrl"] = fbId;
		player["userId"] = userId;
		let playerItem: BlackoutPlayerItem = new BlackoutPlayerItem( player );
		Com.addObjectAt( this, playerItem, 0, 136 * count + 46 );
		this.playerObject[userId] = playerItem;
		this.otherPlayerInfo.push( player );
	}

	private olderRoomMate( players: Array<Object> ): Array<Object>{
		let newArr: Array<Object> = [];
		for( let i: number = 0; i < players.length; i++ ){
			if( players[i]["userId"] == PlayerConfig.player("user.id") ) newArr.unshift( players[i] );
			else newArr.push( players[i] );
		}
		return newArr;
	}
}
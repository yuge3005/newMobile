class TounamentDataFormat {

	public constructor() {
	}

	public static parse( cmd: string, data: any ): Object{
		let obj: Object;
		switch( cmd ){
			case "trm.start": obj = this.initTournamentData( data );
				break;
			case "trm.update": obj = this.updateTournamentData( data );
				break;
			case "trm.end": obj = this.tournamentOver( data );
				break;
			default: trace( "wrong tounament command" );
		}
		return obj;
	}

	private static initTournamentData(data): Object {
		let tmd: ITounamentInitData = <ITounamentInitData>{};
		tmd.isGold = data.getBool("isGold");
		tmd.fromLevel = Number( data.getInt("fromLevel") );
		tmd.toLevel = Number( data.getInt("toLevel") );
		tmd.gameIDs = data.getIntArray("gameIDs");
		tmd.threshold = Number( data.getDouble("threshold:") );
		tmd.currentTreshold = Number( data.getDouble("currentTreshold") );
		tmd.eligible = data.getBool( "eligible" );

		this.getUpdateData( tmd, data );
		return tmd;
	}

	private static getListDatas( tmd: ITounamentData, data: any ){
		let prizes = data.get("prizes");
		tmd.prizes = <Array<ITounamentPrize>>[];
		if( prizes ){
			for (let i = 0; i < prizes.size(); i++) {
				tmd.prizes[i] = this.getPrizeData( prizes.get(i) );
			}
		}

        let userList = data.get("user_list");
		tmd.userList = <Array<ITounamentUser>>[];
        if( userList ){
            for (let i = 0; i < userList.size(); i++) {
                tmd.userList[i] = this.getAUserData( userList.get(i) );
            }
        }

		let winners = data.get("winners");
		tmd.winners = <Array<ITounamentUser>>[];
		if( winners ){
			for (let i = 0; i < winners.size(); i++) {
                tmd.winners[i] = this.getAUserData( winners.get(i) );
            }
		}
	}

	private static getPrizeData( prize: any ): ITounamentPrize{
		let prizeData: ITounamentPrize = <ITounamentPrize>{};
		prizeData.fromRank = Number(prize.getInt("fromRank"));
		prizeData.toRank = Number(prize.getInt("toRank"));
		prizeData.winningPrize = Number(prize.getLong("winningPrize"));
		prizeData.winGoldPrize = Number(prize.getLong("winGoldPrize"));
		return prizeData;
	}

	private static getAUserData( user: any ): ITounamentUser{
		let userData: ITounamentUser = <ITounamentUser>{};
		userData.uid = user.getUtfString( "uid" );
		userData.isWinning = user.getBool( "isWinning" );
		userData.loyaltyLevel = user.getInt( "loyaltyLevel" );
		userData.minEnter = user.getLong( "winGoldPrize" );
		userData.coinsEarn = user.getLong( "coinsEarn" );
		userData.rank = user.getInt( "rank" );
		userData.winGoldPrize = user.getLong( "winGoldPrize" );
		userData.currentWinningPrize = user.getLong( "currentWinningPrize" );
		userData.networkLogins = <Array<ITounamentNetwordLogins>>[];
		let networkLoginsArr = user.get( "networkLogins" );
		for (let i = 0; i < networkLoginsArr.size(); i++) {
			let networkLoginData = networkLoginsArr.get(i)
			userData.networkLogins[i] = <ITounamentNetwordLogins>{};
			userData.networkLogins[i].id = networkLoginData.getUtfString( "id" );
			userData.networkLogins[i].pic = networkLoginData.getUtfString( "pic" );
			userData.networkLogins[i].network = networkLoginData.getUtfString( "network" );
		}
		return userData;
	}

	private static updateTournamentData(data): ITounamentData {
		let tmd: ITounamentData = <ITounamentData>{};
		this.getUpdateData( tmd, data );
		return tmd;
	}

	private static getUpdateData( tmd: ITounamentData, data: any ){
		tmd.totalDuration = Number(data.getInt("total_duration"));
        tmd.duration = Number(data.getInt("duration"));
		tmd.userCount = Number(data.getInt("userCount"));
		tmd.prize = Number(data.getLong("prize"));
		tmd.normalPrize = Number(data.getLong("normalPrize"));
		tmd.goldPrize = Number(data.getLong("goldPrize"));

		this.getListDatas( tmd, data );
	}

	private static tournamentOver(data: any): ITounamentWinInfo {
		// let missionValue = data.get("mission_value");

        let isWinning = data.getBool("isWinning");
        if (isWinning) {
			let winInfo: ITounamentWinInfo = <ITounamentWinInfo>{};
            winInfo.bonusId = data.getInt("pending_round_id");
            winInfo.rank = data.getInt("rank");
            winInfo.currentWinningPrize = data.getLong("currentWinningPrize");
            winInfo.goldPrize = data.getLong("winGoldPrize") || 0;
			return winInfo;
		}

		return null;
	}
}
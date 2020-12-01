class MaraPayForBingoDataFormat {
	public constructor() {
	}

	public static parseObject( data: any ): Object{
        var gameData: Object = {};
		gameData["success"] = data.getInt("statusCode") == 1;
		let items: Array<string> = data.getUtfStringArray("powerup_effects");
		gameData["effects"] = items;
		gameData["powerUp"] = data.getUtfString("powerUpType");
		for( let i: number = 0; i < items.length; i++ ){
			let effectItem: any = data.get( items[i] );
			gameData[items[i]] = this.parseItem( items[i], effectItem );
		}
		let availableFeatures = data.getSFSArray("available_features");
		if( availableFeatures ){
			gameData["availableFeatures"] = [];
			for( let i: number = 0; i < availableFeatures.size(); i++ ){
				gameData["availableFeatures"][i] = {};
				gameData["availableFeatures"][i]["name"] = availableFeatures.get(i).getUtfString("name");
				gameData["availableFeatures"][i]["type"] = availableFeatures.get(i).getUtfString("coinsType");
				gameData["availableFeatures"][i]["price"] = availableFeatures.get(i).getInt("price");
			}
		}
		return gameData;
	}

	private static parseItem( effectName: string, effectItem: any ): Object{
		let ob: Object;
		switch( effectName ){
			case "green_bait_luck_pos":
				ob = this.getDataByID( effectItem );
			break;
			case "red_bait_luck_pos":
				ob = this.getDataByID( effectItem );
			break;
			case "cylinder_ebs":
				ob = this.getExtraBalls( effectItem );
			break;
			case "jelly_luck_random_pos":
				ob = this.getNumberByID( effectItem );
			break;
			case "pearl_luck_main_pos":
				ob = this.getNumberByID( effectItem );
			break;
			case "pearl_luck_pos":
				ob = this.getDataByID( effectItem );
			break;
			case "orange_bait_luck_pos":
				ob = this.getDataByID( effectItem );
			break;
			case "luck_pos_per_card":
				ob = this.getDataByID( effectItem );
			break;
		}
		return ob;
	}

	private static getDataByID( effectItem: any ): Object{
		let cards: Array<MaraCard> = MultiPlayerMachine["currentGame"]["cardArea"]["cards"] as Array<MaraCard>;
		let obj: Object = {};
		for( let i: number = 0; i < cards.length; i++ ){
			obj[cards[i].uuid] = [];
			let sfsArr: any = effectItem.getSFSArray( cards[i].uuid );
			if( sfsArr ){
				for( let j: number = 0; j < sfsArr.size(); j++ ){
					obj[cards[i].uuid][j] = sfsArr.getInt(j);
				}
			}
		}
		return obj;
	}

	private static getNumberByID( effectItem: any ): Object{
		let cards: Array<MaraCard> = MultiPlayerMachine["currentGame"]["cardArea"]["cards"] as Array<MaraCard>;
		let obj: Object = {};
		for( let i: number = 0; i < cards.length; i++ ){
			obj[cards[i].uuid] = effectItem.getInt( cards[i].uuid );
		}
		return obj;
	}

	private static getExtraBalls( effectItem: any ): Array<Number>{
		let arr: Array<number> = [];
		for( let i: number = 0; i < effectItem.size(); i++ ){
				arr[i] = effectItem.getInt(i);
			}
		return arr;
	}

	public static pearlLuckPos( data: any, uuid: string ): Object{
		let obj: Object = {};
		let gridIds = data.getSFSArray(uuid);
		if( gridIds ){
			obj[uuid] = [];
			for( let j: number = 0; j < gridIds.size(); j++ ){
				obj[uuid][j] = gridIds.get(j);
			}
		}
		else console.error( "wrong uuid" );
		return obj;
	}

	public static resumeData( data: any ): Object{
		let statusEventsNames: Array<string> = data.getUtfStringArray( "powerup_effects" );
		if( !statusEventsNames.length ) return null;
		else if( statusEventsNames.indexOf( "luck_guess_nums" ) >= 0 ){
			let gessNumObj: Object = { status: "luck_guess_nums" };
			gessNumObj["luck_guess_nums"] = data.getIntArray( "luck_guess_nums" );
			gessNumObj["guess_num"] = data.getInt( "guess_num" );
			return gessNumObj;
		}
		else if( statusEventsNames.indexOf( "treasure_hunt_pattern_format") >= 0 ){
			let treasureHuntObj: Object = { status: "treasure_hunt" };
			treasureHuntObj["treasure_hunt_pattern_format"] = data.getUtfString( "treasure_hunt_pattern_format" );
			return treasureHuntObj;
		}
		else{
			let normalObj: Object = { status: "normal" };
			normalObj["data"] = data;
			return normalObj;
		}
	}

	public static getFeatureData( data: any ): Object{
		let statusEventsNames: Array<string> = data.getUtfStringArray( "powerup_effects" );
		let normalObj: Object = {};
		for( let i: number = 0; i < statusEventsNames.length; i++ ){
			let effectItem: any = data.get( statusEventsNames[i] );
			normalObj[statusEventsNames[i]] = this.parseItem( statusEventsNames[i], effectItem );
			if( !normalObj[statusEventsNames[i]] ) normalObj[statusEventsNames[i]] = this.parseHaveGetGrid( statusEventsNames[i], effectItem );
		}
		return normalObj;
	}

	public static parseHaveGetGrid( effectName: string, effectItem: any ): Object{
		let ob: Object;
		trace( effectItem );
		switch( effectName ){
			case "red_bait_have_got_pos":
				ob = this.getDataByID( effectItem );
			break;
			case "green_bait_have_got_pos":
				ob = this.getDataByID( effectItem );
			break;
			case "orange_bait_have_got_pos":
				ob = this.getDataByID( effectItem );
			break;
			case "pearl_have_got_luck_pos":
				ob = this.getDataByID( effectItem );
			break;
			case "shark_mark_card_uuid":
				ob = effectItem;
			break;
			case "shark_mark_pos":
				ob = effectItem;
			break;
		}
		return ob;
	}

	public static getTmocb( data: any ): Array<number>{
		if( !data ) return null;
		let value = data.value;
		let newArr: Array<number> = [];
		for( let i: number = 0; i < value.size(); i++ ){
			newArr[i] = value.get(i);
		}
		return newArr;
	}
}
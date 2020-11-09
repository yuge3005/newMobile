class PlayerConfig {

	public static serverVertion: number = 2;
	
	public constructor() {
	}

	private static playerConfig: Object = { "user.id": requestStr( "id" ), "score.level": 2538 };
	private static mission: Object = {};

	public static player( key: string ){
		let rs = this.playerConfig[key];
		if( key=="user.id" && !rs ) rs = "243972732";
		return rs;
	}
}

function requestStr( str ){
	var resItems: Array<string> = location.search.split( /[?&]/ );
	var items: Object = Object;
	for( var i = 0; i < resItems.length; i++ ){
		var item: Array<string> = resItems[i].split("=");
		if( item.length == 2 ) items[item[0]] = item[1];
	}
	return items[str];
}
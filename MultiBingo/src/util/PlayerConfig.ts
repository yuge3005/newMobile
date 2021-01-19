class PlayerConfig {

	public static serverVertion: number = 2;
	
	public constructor() {
	}

	private static _playerData: Object;
	private static get playerData(): Object{
		if( !this._playerData ){
			let playerStr: string = localStorage.getItem("player");
			if( playerStr ){
				try{
					this._playerData = JSON.parse( playerStr );
				}
				catch(e){
					this._playerData = null;
				}
			}
		}
		return this._playerData;
	} 

	private static playerConfig: Object = { "user.id": requestStr( "id" ), "score.level": 2538 };
	private static mission: Object = {};

	public static player( key: string ){
		try{
			let item: any = eval( "this.playerData." + key );
			return item;
		}
		catch(e){
			let rs = this.playerConfig[key];
			if( key=="user.id" && !rs ) rs = "243972732";
			return rs;
		}
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
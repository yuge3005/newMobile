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

	private static _configData: Object;
	private static get configData(): Object{
		if( !this._configData ){
			let configStr: string = localStorage.getItem("config");
			if( configStr ){
				try{
					this._configData = JSON.parse( configStr );
				}
				catch(e){
					this._configData = null;
				}
			}
		}
		return this._configData;
	}

	private static playerConfig: Object = { "user.id": requestStr( "id" ), "score.level": 2538, "score.this_level_xp": 2500, "score.next_level_xp": 3500, "score.xp": 3000,
		"mission": {"task_is_process":"0","unlock_level":10,"task":{"387285":{"is_active":"1","type":"1","current":"1","target":"2","id":"387285"},"387286":{"is_active":"0","type":"1","current":"1","target":"6","id":"387286"},"387287":{"is_active":"0","type":"1","current":"0","target":"15","id":"387287"}},"score_info":{"score_is_process":"0"}},"mission.unlock_level":3000,"loyalty.loyalty_level":4,"facebook.email":"a@b.com" };
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

	public static config( key: string ){
		try{
			let item: any = eval( "this.configData." + key );
			return item;
		}
		catch(e){
			let rs = this.playerConfig[key];
			if( key=="http" && !rs ) rs = "https";
			if( key=="host" && !rs ) rs = "staging.doutorbingo.com";
			if( key=="platform" && !rs ) rs = "com";
			return rs;
		}
	}

	public static get properties(): string {
		let properties: string = localStorage.getItem("user_account_info");
		if( properties.indexOf( "login_type=custom" ) >= 0 ){
			properties += "&network=custom";
			properties += "&uid=" + PlayerConfig.player( "user.id" );
		}
		return properties;
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
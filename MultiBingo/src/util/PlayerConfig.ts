class PlayerConfig {
	public constructor() {
	}

	private static playerConfig: Object = { "user.id": requestStr( "id" ), "score.level": 2538, "facebook_id": "115260495912054", "facebook.name": "Wayne Yu" };
	private static mission: Object = {};

	public static player( key: string ){
		let rs = this.playerConfig[key];
		if( key=="user.id" && !rs ) rs = "243972732";
		return rs;
	}
}
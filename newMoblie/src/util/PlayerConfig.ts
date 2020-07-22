class PlayerConfig {
	public constructor() {
	}

	private static playerConfig: Object = { "user.id": 243972732, "score.level": 2538 };
	private static mission: Object = {};

	public static player( key: string ){
		return this.playerConfig[key];
	}
}
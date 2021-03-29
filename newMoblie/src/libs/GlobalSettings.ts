class GlobelSettings {
	private static _playerInfo: any = null;
	public static serverVertion: number = 2;

	public static bankOpenType: number;
	public static bonusUI: CollectHourlyBonusBar;

	public constructor() {
	}

	public static get language(): string{
		return MuLang.language;
	}

    public static get isRightClick(): boolean{
        return document["isRightClick"];
    }

	public static get vertion(): string{
		return "v0.3.8";
	}

	public static bankPoVo: PoVo;
	public static pigBankPoVo: PoVo = null;

	// private static platform : String = "com";
	public static get isForCom():Boolean{
		return PlayerConfig.config("platform") == "com";
	}
	public static get isForFacebook(): Boolean {
		let data = eval("userData");
		return data["login_type"] === "facebook";
	}
	public static get playerInfo(): any {
		if (typeof GlobelSettings._playerInfo === "undefined" || GlobelSettings._playerInfo === null) {
			GlobelSettings._playerInfo = eval("searchData");
		}
		return GlobelSettings._playerInfo;
	}

	public static get currucyIsBRL(): boolean{
		return this.isForFacebook ? PlayerConfig.player( "facebook.currency.currency" ) == "BRL" : true;
	}
}
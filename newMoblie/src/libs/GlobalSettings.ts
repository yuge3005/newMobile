class GlobelSettings {
	public static bankOpenType: number;

	public static bank;
	public static chipBank;

	public static bonusUI;

	public constructor() {
	}

	public static get language(): string{
		return MuLang.language;
	}
}
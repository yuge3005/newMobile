class CardGridUISettings {

	public static defaultBgPicName: string;
	public static onEffBgPicName: string;
	public static blink1PicName: string;
	public static blink2PicName: string;
	public static linePicName: string;
	public static zeroUIName: string;

	public constructor() {
	}

	public static getSettingStrings( data: Object ){
		this.blink1PicName = data["blink1"];
        this.blink2PicName = data["blink2"];
        this.defaultBgPicName = data["defaultBg"];
        this.onEffBgPicName = data["onEffBg"];
        this.linePicName = data["line"];
	}
}
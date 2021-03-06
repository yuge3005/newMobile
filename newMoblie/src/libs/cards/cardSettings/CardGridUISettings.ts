class CardGridUISettings {

	public static defaultBgPicName: string;
	public static defaultBgPicTexture: egret.Bitmap;

	public static onEffBgPicName: string;
	public static onEffBgPicTexture: egret.Bitmap;
	
	public static blink1PicName: string;
	public static blink1PicTexture: egret.Bitmap;

	public static blink2PicName: string;
	public static blink2PicTexture: egret.Bitmap;

	public static linePicName: string;
	public static linePicTexture: egret.Bitmap;

	public static usefork: string;
	public static zeroUI: string;

	public constructor() {
	}

	public static getSettingStrings( data: Object ){
		this.blink1PicName = data["blink1"];
        this.blink2PicName = data["blink2"];
        this.defaultBgPicName = data["defaultBg"];
        this.onEffBgPicName = data["onEffBg"];
        this.linePicName = data["line"];
		this.usefork = data["usefork"];
	}

	public static initGridAssets(){
		this.defaultBgPicTexture = Com.createBitmapByName( BingoMachine.getAssetStr( this.defaultBgPicName ) );
		this.onEffBgPicTexture = Com.createBitmapByName( BingoMachine.getAssetStr( this.onEffBgPicName ) );
		this.blink1PicTexture = Com.createBitmapByName( BingoMachine.getAssetStr( this.blink1PicName ) );
		this.blink2PicTexture = Com.createBitmapByName( BingoMachine.getAssetStr( this.blink2PicName ) );
		this.linePicTexture = Com.createBitmapByName( BingoMachine.getAssetStr( this.linePicName ) );
	}
}
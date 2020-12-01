class MaraChatNextRound extends egret.DisplayObjectContainer{

	private nextRoundTxt: egret.Bitmap;
	private nextRoundNumTxt: egret.TextField;
	private coinIcon: egret.Bitmap;

	private iconSpace: number = 5;
	private roundTextScale: number = 0.7;

	public constructor() {
		super()

		Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "light" ), 1, 0 );

		this.nextRoundTxt = Com.addBitmapAt( this, "mara_" + MuLang.language + "_json.city_of_light", 30, 16 );

		this.nextRoundNumTxt = Com.addTextAt( this, 30, 16, 100, 16, 16, false, true );
		this.nextRoundNumTxt.textColor = 0xFFF690;
		this.nextRoundNumTxt.textAlign = "left";
		this.nextRoundNumTxt.scaleX = 0.7;
		this.nextRoundNumTxt.filters = [ new egret.DropShadowFilter( 4, 45, 0xc35c10 ) ];

		this.coinIcon = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "coin" ), 150, 11 );
	}

	public setPrize( prize: number ){
		this.coinIcon.x = this.nextRoundTxt.width + this.nextRoundTxt.x + this.iconSpace;
		this.nextRoundNumTxt.x = this.coinIcon.x + this.iconSpace + this.coinIcon.width;
		this.nextRoundNumTxt.text = "" + prize;
	}
}
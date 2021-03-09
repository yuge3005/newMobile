class RateBar extends egret.Sprite{

	private langResource: string;
	private bg: egret.Bitmap;
    private closeBtn: TouchDownButton;

	public constructor( size: egret.Point ) {
		super();

		GraphicTool.drawRect( this, new egret.Rectangle( - size.x >> 1, -size.y >> 1, size.x + 100, size.y ), 0, false, 0.0 );
		this.touchEnabled = true;

		this.langResource = "rate_us_json";

        this.bg = Com.addBitmapAtMiddle( this, this.langResource + ".M", 0, 0 );

		let title: TextLabel = MDS.addGameText( this, -370, -260, 48, 0x222222, "rate_us_now", false, 740, "", 1 );
		title.textAlign = "center";

		let tip: TextLabel = MDS.addGameText( this, -370, -180, 35, 0x555555, "how_to_rate", false, 740, "", 1 );
		tip.textAlign = "center";

		this.closeBtn = Com.addDownButtonAt( this, this.langResource + ".roomCloseButton", this.langResource + ".roomCloseButton", this.bg.width >> 1, -this.bg.height >> 1, this.closeThisBar.bind(this), true );
        this.closeBtn.x -= this.closeBtn.width;
	}


	// window.open("https://itunes.apple.com/app/doctor-bingo-free-bingo-slots/id1152226735");
        // window.open("https://play.google.com/store/apps/details?id=com.gamesmartltd.doctorbingo");

	private closeThisBar(): void {
		if( this.parent ) this.parent.removeChild( this );
	}
}
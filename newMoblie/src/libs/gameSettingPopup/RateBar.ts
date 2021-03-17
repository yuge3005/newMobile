class RateBar extends egret.Sprite{

	private langResource: string;
	private bg: egret.Bitmap;
    private closeBtn: TouchDownButton;

	private stars: Array<TouchDownButton>;
	private goldStars: Array<egret.Bitmap>;
	public static aa: egret.DisplayObject;

	public constructor( size: egret.Point ) {
		super();

		GraphicTool.drawRect( this, new egret.Rectangle( - size.x >> 1, -size.y >> 1, size.x + 100, size.y ), 0, false, 0.0 );
		this.touchEnabled = true;

		this.langResource = "rate_us_json";

        this.bg = Com.addBitmapAtMiddle( this, this.langResource + ".M", 0, 0 );

		let title: TextLabel = MDS.addGameText( this, -370, -260, 48, 0x222222, "rate_us_now", false, 740, "", 1 );
		title.textAlign = "center";
		title.text = title.text.toUpperCase();

		let tip: TextLabel = MDS.addGameText( this, -370, -180, 35, 0x555555, "how_to_rate", false, 740, "", 1 );
		tip.textAlign = "center";

		Com.addBitmapAt( this, this.langResource + ".doctor", 100, -130 );

		this.stars = [];
		this.goldStars = [];
		for( let i: number = 0; i < 5; i++ ){
			this.stars[i] = Com.addDownButtonAt( this, this.langResource + ".Star_b", this.langResource + ".Star_b", -290 + i * 115, -120, this.rate.bind(this), true );
			this.stars[i].name = "" + i;
			this.goldStars[i] = Com.addBitmapAt( this, this.langResource + ".Star", -290 + i * 115, -120 );
			this.goldStars[i].visible = false;
		}

		this.closeBtn = Com.addDownButtonAt( this, this.langResource + ".roomCloseButton", this.langResource + ".roomCloseButton", this.bg.width >> 1, -this.bg.height >> 1, this.closeThisBar.bind(this), true );
        this.closeBtn.x -= this.closeBtn.width;
	}

	private rate( event: egret.Event ){
		let currentBtn: TouchDownButton = event.target as TouchDownButton;
		let index: number = Number( currentBtn.name );
		for( let i: number = 0; i < 5; i++ ){
			this.stars[i].enabled = false;
			if( i <= index ) this.goldStars[i].visible = true;
		}

		this.dealWithIndex( index );
	}

	private closeThisBar(): void {
		if( this.parent ) this.parent.removeChild( this );
	}

	private dealWithIndex( index: number ){
		if( index < 3 ) this.showOkButton();
		else setTimeout( this.delayOpenWindow.bind(this), 300 );
	}

	private delayOpenWindow(){
		this.closeThisBar();
		if( Math.random() > 0.5 ) window.open("https://itunes.apple.com/app/doctor-bingo-free-bingo-slots/id1152226735");
		else window.open("https://play.google.com/store/apps/details?id=com.gamesmartltd.doctorbingo");
	}

	private showOkButton(){
		let btn: TouchDownButton = Com.addDownButtonAt( this, this.langResource + ".BUY COINS", this.langResource + ".BUY COINS", -132, 150, this.closeThisBar.bind(this), true );
		let btnTx: egret.TextField = Com.addTextAt( this, 0, 0, 40, 40, 50, false, true );
		btn.setButtonText( btnTx );
		btnTx.textColor = 0;
		btnTx.text = "OK";
	}
}
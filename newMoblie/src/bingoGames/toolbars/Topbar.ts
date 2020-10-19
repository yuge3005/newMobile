class Topbar extends egret.DisplayObjectContainer{

	private backToLobbyBtn: TouchDownButton;
	private bankBtn: TouchDownButton;
	private menuBtn: TouchDownButton;

	public constructor() {
		super();

		Com.addBitmapAt( this, "topbar_json.buy_bg", 742, 0 );

		this.backToLobbyBtn = Com.addDownButtonAt( this, "topbar_json.home", "topbar_json.home_press", 0, 14, this.onButtonClick, true );
		this.menuBtn = Com.addDownButtonAt( this, "topbar_json.hamburger", "topbar_json.hamburger", 1908, 14, this.onButtonClick, false );

		this.bankBtn = Com.addDownButtonAt( this, "topbar_json.buy-btn", "topbar_json.buy-btn", 793, 5, this.onButtonClick, false );
		let txt: TextLabel = Com.addLabelAt( this, 10, 10, 390, 80, 48 );
		this.bankBtn.addChild(txt);
		txt.fontFamily = "Righteous";
		txt.stroke = 2;
		txt.strokeColor = 0;
		txt.setText( MuLang.getText("bank", MuLang.CASE_UPPER) );

		this.cacheAsBitmap = true;
	}

	private onButtonClick( event: egret.TouchEvent ){
		if( event.target == this.backToLobbyBtn ){
			document.location.href = "../?id=" + PlayerConfig.player( "user.id" );
		}
	}
}
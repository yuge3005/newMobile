class GameSettingPopup extends GenericPo {

	protected scrollArea: egret.ScrollView;
	protected scrollBar: egret.DisplayObjectContainer;

	protected static get classAssetName() {
        return "gameSettings";
    }

	public constructor() {
		super();
	}

	protected init() {
        this.bgAssetName = "gameSettings_json.bg";

        super.init();

		this.bg.width = 620;
		this.bg.height = 495;
		this.anchorOffsetX = this.bg.width >> 1;
		this.anchorOffsetY = this.bg.height >> 1;

		this.addScrollArea( new egret.Rectangle( 62, 41, 1040, 910 ) );

		this.addItems();
	}

	protected addScrollArea( maskRect: egret.Rectangle ){
		this.scrollArea = new egret.ScrollView;
		this.scrollArea.width = maskRect.width;
		this.scrollArea.height = maskRect.height;
		Com.addObjectAt( this, this.scrollArea, maskRect.x, maskRect.y );
		this.scrollBar = new egret.DisplayObjectContainer;
		this.scrollArea.setContent( this.scrollBar );
	}

	protected addItem( index: number, icon: string, text: string, entity: egret.DisplayObject ){
		let settingsItem: GameSettingItem = new GameSettingItem( icon, text, entity );
		settingsItem.y = index * 150;
	}

	private addItems(){
		let button1: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 20, this.logout, true );
		this.addItem( 0, "avatar", "gustId:" + 1234567, button1 );
		let button2: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 20, this.logout, true );
		this.addItem( 1, "avatar", MuLang.getText( "language" ), button2 );

		this.addItem( 3, "avatar", MuLang.getText( "language" ), button2 );
		this.addItem( 4, "avatar", MuLang.getText( "language" ), button2 );
		this.addItem( 5, "avatar", MuLang.getText( "language" ), button2 );
	}

	private logout(){

	}
}
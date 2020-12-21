class GameSettingPopup extends GenericPo {

	protected scrollArea: egret.ScrollView;
	protected scrollBar: egret.DisplayObjectContainer;

	private soundEffectBtn: SettingsCheckbox;
	private MusicBtn: SettingsCheckbox;

	protected static get classAssetName() {
        return "gameSettings";
    }

	public constructor() {
		super();
	}

	protected init() {
        this.bgAssetName = "gameSettings_json.bg";

        super.init();

		this.bg.width = 1240;
		this.bg.height = 990;
		this.anchorOffsetX = this.bg.width >> 1;
		this.anchorOffsetY = this.bg.height >> 1;
		this.bg.visible = false;

		setTimeout( this.doutorGo.bind(this), 315 );
	}

	private doutorGo(){
		this.scaleX = this.scaleY = 0.1;
		this.bg.visible = true;

		this.addScrollArea( new egret.Rectangle( 62, 41, 1040, 910 ) );
		this.addItems();
		TweenerTool.tweenTo( this, { scaleX: 0.5, scaleY: 0.5 }, 300 );
	}

	protected addScrollArea( maskRect: egret.Rectangle ){
		this.scrollArea = new egret.ScrollView;
		this.scrollArea.width = maskRect.width;
		this.scrollArea.height = maskRect.height;
		Com.addObjectAt( this, this.scrollArea, maskRect.x, maskRect.y );
		this.scrollBar = new egret.DisplayObjectContainer;
		this.scrollArea.setContent( this.scrollBar );
	}

	protected addItem( index: number, icon: string, text: string, entity: egret.DisplayObject, offsetY: number = 0 ){
		let settingsItem: GameSettingItem = new GameSettingItem( icon, text, entity, offsetY );
		settingsItem.y = index * 150;
		this.scrollBar.addChild( settingsItem );
	}

	private addItems(){
		let button0: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.logout, true );
		this.addItem( 0, "avatar", "gustId:" + 1234567, button0 );
		let button1: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.showLangugeBar, true );
		this.addItem( 1, "language_icon", MuLang.getText( "language" ), button1, 5 );
		let bt2Container: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		let button2_1: TouchDownButton = Com.addDownButtonAt( bt2Container, "gameSettings_json.gl_bt_settings", "gameSettings_json.gl_bt_settings", 380, 18, this.showLangugeBar, true );
		let button2_2: TouchDownButton = Com.addDownButtonAt( bt2Container, "gameSettings_json.fb_bt_settings", "gameSettings_json.fb_bt_settings", 700, 18, this.showLangugeBar, true );
		this.addItem( 2, "icon_connect", MuLang.getText( "link", MuLang.CASE_UPPER ), bt2Container );
		let button3: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.logout, true );
		this.addItem( 3, "support_icon", MuLang.getText( "support" ), button3, 5 );
		let button4: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.logout, true );
		this.addItem( 4, "rate_icon", MuLang.getText( "rate us" ), button4, 5 );
		let button5: SettingsCheckbox = new SettingsCheckbox( this.soundEffectChange.bind(this) );
		this.addItem( 5, "sound_fx_icon", MuLang.getText( "language" ), button5, 5 );
		let button6: SettingsCheckbox = new SettingsCheckbox( this.musicChange.bind(this) );
		this.addItem( 6, "music_icon", MuLang.getText( "language" ), button6, 5 );
		let button7: SettingsCheckbox = new SettingsCheckbox( this.visualEffectChange.bind(this) );
		this.addItem( 7, "visual_fx_icon", MuLang.getText( "language" ), button7, 5 );
		let button8: SettingsCheckbox = new SettingsCheckbox( this.notificationChange.bind(this) );
		this.addItem( 8, "icon_notification", MuLang.getText( "language" ), button8, 5 );
	}

	private logout(){

	}

	private showLangugeBar(){

	}

	private soundEffectChange(){

	}

	private musicChange(){

	}

	private visualEffectChange(){

	}

	private notificationChange(){

	}
}
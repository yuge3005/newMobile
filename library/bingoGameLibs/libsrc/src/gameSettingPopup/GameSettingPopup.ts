class GameSettingPopup extends GenericPo {

	protected scrollArea: egret.ScrollView;
	protected scrollBar: egret.DisplayObjectContainer;

	private soundEffectBtn: SettingsCheckbox;
	private musicBtn: SettingsCheckbox;
	private visualEffectBtn: SettingsCheckbox;
	private notificationBtn: SettingsCheckbox;

	protected static get classAssetName() {
        return "gameSettings";
    }

	public constructor() {
		super();
	}

	protected init() {
        this.bgAssetName = "gameSettings_json.bg";
		this.closeButtonAssetName = "gameSettings_json.X_btn";

        super.init();

		this.bg.width = 1240;
		this.bg.height = 990;
		this.anchorOffsetX = this.bg.width >> 1;
		this.anchorOffsetY = this.bg.height >> 1;
		this.bg.visible = false;

		this.closeButton.x = this.bg.width;
		this.closeButton.visible = false;

		setTimeout( this.doutorGo.bind(this), 315 );
	}

	private doutorGo(){
		this.scaleX = this.scaleY = 0.1;
		this.closeButton.visible = this.bg.visible = true;

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

	protected addButtonText( button: TouchDownButton, offsetX: number, buttonText: string = null ){
		let tx: TextLabel = Com.addLabelAt( button, offsetX, 0, button.width - offsetX - 10, button.height, 48 );
		tx.fontFamily = "Righteous";
		tx.stroke = 2;
		tx.strokeColor = 0x03034B;
		tx.filters = [ new egret.DropShadowFilter( 5, 45, 0, 0.5, 4, 4, 2, 1 ) ];
		if( buttonText ) tx.setText( MuLang.getText( buttonText, MuLang.CASE_UPPER ) );
	}

	private addItems(){
		let button0: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.logout, true );
		this.addButtonText( button0, 0, "logout" );
		this.addItem( 0, "avatar", "gustId:" + 1234567, button0 );
		let button1: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.showLangugeBar, true );
		this.addItem( 1, "language_icon", "language", button1, 5 );
		let bt2Container: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		let button2_1: TouchDownButton = Com.addDownButtonAt( bt2Container, "gameSettings_json.gl_bt_settings", "gameSettings_json.gl_bt_settings", 380, 18, this.showLangugeBar, true );
		let button2_2: TouchDownButton = Com.addDownButtonAt( bt2Container, "gameSettings_json.fb_bt_settings", "gameSettings_json.fb_bt_settings", 700, 18, this.showLangugeBar, true );
		this.addButtonText( button2_1, 30, "login" );
		this.addButtonText( button2_2, 30, "login" );
		this.addItem( 2, "icon_connect", "link", bt2Container );
		let button3: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.logout, true );
		this.addButtonText( button3, 0, "contact" );
		this.addItem( 3, "support_icon", "support", button3, 5 );
		let button4: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.logout, true );
		this.addButtonText( button4, 0, "rate_us" );
		this.addItem( 4, "rate_icon", "rate_us", button4, 5 );
		this.soundEffectBtn = new SettingsCheckbox( this.soundEffectChange.bind(this) );
		this.soundEffectBtn.RadioOn = SoundManager.soundEfOn;
		this.addItem( 5, "sound_fx_icon", "sound_effect_on", this.soundEffectBtn, 5 );
		this.musicBtn = new SettingsCheckbox( this.musicChange.bind(this) );
		this.musicBtn.RadioOn = SoundManager.soundOn;
		this.addItem( 6, "music_icon", "music_on", this.musicBtn, 5 );
		this.visualEffectBtn = new SettingsCheckbox( this.visualEffectChange.bind(this) );
		this.visualEffectBtn.RadioOn = GameSettings.visualEffectOn;
		this.addItem( 7, "visual_fx_icon", "effect_on", this.visualEffectBtn, 5 );
		this.notificationBtn = new SettingsCheckbox( this.notificationChange.bind(this) );
		this.notificationBtn.RadioOn = GameSettings.notificationOn;
		this.addItem( 8, "icon_notification", MuLang.getText( "notification" ), this.notificationBtn, 5 );
	}

	private logout(){
		alert( "can not logout now" );
	}

	private showLangugeBar(){

	}

	private soundEffectChange(){
		this.soundEffectBtn.RadioOn = SoundManager.soundEfOn = !SoundManager.soundEfOn;
	}

	private musicChange(){
		this.musicBtn.RadioOn = SoundManager.soundOn = !SoundManager.soundOn;
	}

	private visualEffectChange(){
		this.visualEffectBtn.RadioOn = GameSettings.visualEffectOn = !GameSettings.visualEffectOn;
	}

	private notificationChange(){
		this.notificationBtn.RadioOn = GameSettings.notificationOn = !GameSettings.notificationOn;
	}
}
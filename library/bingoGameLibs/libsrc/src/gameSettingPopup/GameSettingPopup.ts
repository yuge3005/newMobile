class GameSettingPopup extends GenericPo {

	protected scrollArea: egret.ScrollView;
	protected scrollBar: egret.DisplayObjectContainer;
	protected scrollSlider: SettingSlider;

	private sliderDraging: boolean;

	private soundEffectBtn: SettingsCheckbox;
	private musicBtn: SettingsCheckbox;
	private visualEffectBtn: SettingsCheckbox;
	private notificationBtn: SettingsCheckbox;

	private languageBar: LanguageBar;

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

		this.closeButton.x = this.bg.width;

		this.addScrollArea( new egret.Rectangle( 62, 41, 1040, 910 ) );
		this.addItems();
		this.addTitleAndVertion();
		this.addLanguageBar();

		this.scrollSlider = new SettingSlider;
		Com.addObjectAt( this, this.scrollSlider, 1150, 70 );
		this.scrollSlider.addEventListener( "startDrag", this.onStartDrag, this );
		this.scrollSlider.addEventListener( "stopDrag", this.onStopDrag, this );

		this.addEventListener( egret.Event.REMOVED_FROM_STAGE, this.onRemove, this );
		this.addEventListener( egret.Event.ENTER_FRAME, this.onFrame, this );
	}

	private onRemove( event: egret.Event ){
		this.removeEventListener( egret.Event.REMOVED_FROM_STAGE, this.onRemove, this );
		this.removeEventListener( egret.Event.ENTER_FRAME, this.onFrame, this );
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

	protected addButtonText( button: TouchDownButton, buttonText: string = null ){
		let tx: TextLabel = Com.addLabelAt( button, 10, 0, button.width - 20, button.height, 48 );
		GameSettingItem.settingTextFormat( tx );
		if( buttonText ) tx.setText( MuLang.getText( buttonText, MuLang.CASE_UPPER ) );
	}

	protected addLoginButtonText( button: TouchDownButton, buttonText: string = null ){
		let tx: TextLabel = Com.addLabelAt( button, 90, 0, button.width - 100, button.height, 48 );
		GameSettingItem.settingTextFormat( tx );
		tx.textAlign = "left";
		if( buttonText ) tx.setText( MuLang.getText( buttonText, MuLang.CASE_UPPER ) );
	}

	private addItems(){
		let button0: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.logout, true );
		this.addButtonText( button0, "logout" );
		let playType: string = this.getPlayerType();
		this.addItem( 0, "avatar", MuLang.getText( playType, MuLang.CASE_UPPER ) + ":   " + PlayerConfig.player( playType == "user_id" ? "user.id" : playType ), button0 );
		let button1: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.showLangugeBar, true );
		Com.addBitmapAtMiddle( button1, "gameSettings_json.flag_" + MuLang.language, button1.width >> 1, button1.height >> 1 );
		Com.addBitmapAtMiddle( button1, "gameSettings_json.btn_arrow", button1.width - 45, button1.height >> 1 );
		this.addItem( 1, "language_icon", "language", button1, 5 );
		let bt2Container: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		let button2_1: TouchDownButton = Com.addDownButtonAt( bt2Container, "gameSettings_json.gl_bt_settings", "gameSettings_json.gl_bt_settings", 380, 18, this.gotoLoginPage, true );
		let button2_2: TouchDownButton = Com.addDownButtonAt( bt2Container, "gameSettings_json.fb_bt_settings", "gameSettings_json.fb_bt_settings", 700, 18, this.gotoLoginPage, true );
		this.addLoginButtonText( button2_1, "login" );
		this.addLoginButtonText( button2_2, "login" );
		this.addItem( 2, "icon_connect", "link", bt2Container );
		let button3: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.suport, true );
		this.addButtonText( button3, "contact" );
		this.addItem( 3, "support_icon", "support", button3, 5 );
		let button4: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.support_btn", "gameSettings_json.support_btn", 700, 18, this.rateStar, true );
		this.addButtonText( button4, "rate_us" );
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

	private getPlayerType(): string{
		let typeStr: string;
		if( PlayerConfig.player( "facebook_id" ) ) return "facebook_id";
		else if( PlayerConfig.player( "custom_id" ) ) return "custom_id";
		else if( PlayerConfig.player( "google_id" ) ) return "google_id";
		else if( PlayerConfig.player( "guest_id" ) ) return "guest_id";
		else return "user_id";
	}

	private addTitleAndVertion(){
		let tx: TextLabel = Com.addLabelAt( this, 0, -40, this.bg.width, 65, 50 );
		GameSettingItem.settingTextFormat( tx );
		tx.setText( MuLang.getText( "settings", MuLang.CASE_UPPER ) );
		let txVersion: TextLabel = MDS.addGameText( this, 100, 975, 40, 0xFFFFFF, "", true, 525, "", 1 );
		txVersion.height = 50;
		GameSettingItem.settingTextFormat( txVersion );
		txVersion.setText( MuLang.getText( "settings", MuLang.CASE_UPPER ) + ":     " + GameSettings.vertion );
		let txId: TextLabel = MDS.addGameText( this, 720, 975, 40, 0xFFFFFF, "", true, 650, "", 1 );
		txId.height = 50;
		GameSettingItem.settingTextFormat( txId );
		txId.setText( MuLang.getText( "user_id", MuLang.CASE_UPPER ) + ":     " + PlayerConfig.player( "user.id" ) );
	}

	private addLanguageBar(){
		this.languageBar = new LanguageBar;
		this.languageBar.visible = false;
		Com.addObjectAt( this.scrollBar, this.languageBar, 708, 280 );
	}

	private logout(){
		localStorage.removeItem("player");
        localStorage.removeItem("user_account_info");

        window.location.href = "/";
	}

	private showLangugeBar(){
		this.languageBar.visible = !this.languageBar.visible;
	}

	private gotoLoginPage(){
		this.logout();
	}

	private suport(){
		Com.addObjectAt( this, new SupportBar( new egret.Point( this.bg.width, this.bg.height ) ), this.bg.width >> 1, this.bg.height >> 1 );
	}

    private rateStar(): void {
		Com.addObjectAt( this, new RateBar( new egret.Point( this.bg.width, this.bg.height ) ), this.bg.width >> 1, this.bg.height >> 1 );
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

	private onFrame( event: egret.Event ){
		if( this.sliderDraging ) this.scrollArea.scrollTop = this.scrollSlider.scrollTop * this.scrollArea.getMaxScrollTop();
		else this.scrollSlider.setSliderPosition( this.scrollArea.getMaxScrollTop(), this.scrollArea.scrollTop );
	}

	private onStartDrag( event: egret.Event ){
		this.sliderDraging = true;
	}

	private onStopDrag( event: egret.Event ){
		this.sliderDraging = false;
	}
}
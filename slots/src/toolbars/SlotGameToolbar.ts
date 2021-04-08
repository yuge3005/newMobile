class SlotGameToolbar extends egret.DisplayObjectContainer{
	public static toolBarY: number = 900;

	private helpBtn: TouchDownButton;
	protected decreseBetBtn: TouchDownButton;
	protected increaseBetBtn: TouchDownButton;

	protected maxBetBtn: TouchDownButton;

	protected playBtn: LongPressButton;
	protected stopBtn: TouchDownButton;
	protected freeSpinBtn: FreeSpinButton;

	protected stopAutoBtn: TouchDownButton;
	private coinsText: TextLabel;
	private dineroText: TextLabel;
	private betText: TextLabel;
	private winText: TextLabel;

	protected allButtons: Array<TouchDownButton>;
	private enabledButtons: Array<TouchDownButton>;

	protected playContainer: egret.DisplayObjectContainer;

	private _autoPlaying: boolean = false;
	public get autoPlaying(): boolean{
		return this._autoPlaying;
	}
	public set autoPlaying( value: boolean ){
		this._autoPlaying = value;
		if( value ){
			this.enableAllButtons( false );
			this.stopAutoBtn.visible = true;
			SlotMachine.sendCommand( GameCommands.play );
		}
		else{
			this.stopAutoBtn.visible = false;
			this.playBtn.enabled = true;
		}
	}

	protected xpBar: XpBar;
	// protected missionBar: MissionBar;

	public constructor() {
		super();

		this.allButtons = [];
		Com.addBitmapAt( this, "bingoGameToolbar_json.back_panel", 0, 96 );
		this.buildPlayContainer();

		this.stopAutoBtn = this.addBtn( "auto_stop", 1724, 22, GameCommands.stopAuto, this, true );
		this.addButtonText( this.stopAutoBtn, 72, "auto", 15, 0, 0xFFFFFF, this.stopAutoBtn.width - 30, 125, 4, 0x000093 );
		this.addButtonText( this.stopAutoBtn, 35, "click to stop", 15, 100, 0xFFFFFF, this.stopAutoBtn.width - 30, 70, 1, 0x000093 );
		this.stopAutoBtn.visible = false;
		this.allButtons.pop();// stopAuto button dont need enabled
		
		Com.addBitmapAt( this, "bingoGameToolbar_json.middle_bar", 610, 22 );
		Com.addBitmapAt( this, "bingoGameToolbar_json.msg_bg", 694, 35 ).height = 86;
		let bl1: egret.Bitmap = Com.addBitmapAt( this, "bingoGameToolbar_json.ballance", 694, 128 );
		bl1.width = 355;
		bl1.height = 50;
		let bl2: egret.Bitmap = Com.addBitmapAt( this, "bingoGameToolbar_json.ballance", 1054, 128 );
		bl2.width = 225;
		bl2.height = 50;
		Com.addBitmapAt( this, "bingoGameToolbar_json.balance_coin", 655, 115 );
		Com.addBitmapAt( this, "bingoGameToolbar_json.balance_chip", 1217, 123 );

		this.createTexts();

		this.xpBar = new XpBar;
		Com.addObjectAt( this, this.xpBar, 1365, 38 );
		this.xpBar.addEventListener( XpBar.LEVEL_UP_BONUS, this.onLevelUpBonus, this );

		// this.missionBar = new MissionBar;
		// Com.addObjectAt( this, this.missionBar, 1357, 117 );

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onToolbarAdd, this);
		this.cacheAsBitmap = true;
	}

	protected onToolbarAdd( event: egret.Event ): void{
		//this.startHappyHour();
	}

	private buildPlayContainer(){
		this.playContainer = new egret.DisplayObjectContainer;
		this.addChild( this.playContainer );

		Com.addBitmapAt( this.playContainer, "play_bg", 1360, 0 );
		Com.addBitmapAt( this.playContainer, "bet_screen", 178, 122 );

		this.helpBtn = this.addBtn( "i", 12, 126, GameCommands.help, this.playContainer );
		this.decreseBetBtn = this.addBtn( "bet_down", 95, 116, GameCommands.decreseBet, this.playContainer );
		this.increaseBetBtn = this.addBtn( "bet_up", 411, 116, GameCommands.increaseBet, this.playContainer );
		this.maxBetBtn = this.addBtn( "max_btn", 509, 116, GameCommands.maxBet, this.playContainer );
		this.addButtonText( this.maxBetBtn, 48, "max", 0, 0, 0x343433, this.maxBetBtn.width - 10, this.maxBetBtn.height, 1 );

		this.stopBtn = this.addBtn( "play", 1724, 22, GameCommands.stop, this.playContainer );
		this.addButtonText( this.stopBtn, 72, "stop", 15, 0, 0xFFFFFF, this.stopBtn.width - 30, 186, 4, 0x000093 );

		this.addPlayButton();

		this.freeSpinBtn = new FreeSpinButton;
		this.freeSpinBtn.visible = false;
		Com.addObjectAt( this.playContainer, this.freeSpinBtn, 1724, 22 );

		let tb: TextLabel = this.addToolBarText( 198, 192, 192, 30, 30, 0, 0, this.playContainer );
		tb.setText( MuLang.getText("total bet") );
		tb.textColor = 0x343433;

		this.betText = this.addToolBarText( 185, 124, 220, 68, 45, 1, 0, this.playContainer );
	}

	private addPlayButton(){
		this.playBtn = new LongPressButton( SlotMachine.getAssetStr( "spin_btn" ), SlotMachine.getAssetStr( "spin_btn_LYD" ) );
		Com.addObjectAt( this.playContainer, this.playBtn, 1724, 22 );
		this.playBtn.addEventListener( egret.TouchEvent.TOUCH_TAP, this.sendCommand, this );
		this.playBtn.name = GameCommands.play;
		this.playBtn.disabledFilter = MatrixTool.colorMatrixLighter( 0.2 );
		this.playBtn.enabled = true;
		this.allButtons.push( this.playBtn );
		this.addButtonText( this.playBtn, 72, "play", 15, 0, 0xFFFFFF, this.playBtn.width - 30, 125, 4, 0x000093 );
		this.addButtonText( this.playBtn, 35, "hold for auto", 15, 100, 0xFFFFFF, this.playBtn.width - 30, 70, 1, 0x000093 );
		this.playBtn.longPressSetting( 1000, this.startAuto.bind( this ) );
	}

	private createTexts(){
		this.winText = this.addToolBarText( 720, 50, 565, 65, 60, 2, 0x2A1DB5 );
		this.coinsText = this.addToolBarText( 730, 135, 305, 40, 40, 3, 0xAC9418 );
		this.dineroText = this.addToolBarText( 1070, 135, 150, 40, 40, 3, 0x38AC3d );
	}

	private addToolBarText( x: number, y: number, textWidth: number, textHeight: number, textSize: number, stroke: number = 0, strokeColor: number = 0, target: egret.DisplayObjectContainer = null ): TextLabel{
		let tx: TextLabel = Com.addLabelAt( target ? target : this, x, y, textWidth, textHeight, textSize );
		tx.fontFamily = "Righteous";
		if( stroke ){
			tx.stroke = stroke;
			tx.strokeColor = strokeColor;
		}
		return tx;
	}

	protected addBtn( assets: string, x: number, y: number, name: string, container: egret.DisplayObjectContainer, donotHavePressUi: boolean = false ): TouchDownButton{
		let assetsName: string = "bingoGameToolbar_json." + assets;
		let pressUi: string = donotHavePressUi ? assetsName : assetsName + "_press";
		let btn: TouchDownButton = Com.addDownButtonAt( container, assetsName, pressUi, x, y, this.sendCommand.bind( this ), true );
		btn.name = name;
		btn.disabledFilter = MatrixTool.colorMatrixLighter( 0.2 );
		this.allButtons.push( btn );
		return btn;
	}

	protected addMaskBtn( assets: string, x: number, y: number, name: string, container: egret.DisplayObjectContainer, textColor: number = 0 ): GameToolbarMaskButton{
		let btn: GameToolbarMaskButton = new GameToolbarMaskButton( "bingoGameToolbar_json." + assets, textColor );
		Com.addObjectAt( container, btn, x, y );
		btn.addEventListener( egret.TouchEvent.TOUCH_TAP, this.sendCommand, this );
		btn.name = name;
		this.allButtons.push( btn );
		return btn;
	}

	protected sendCommand( event: egret.TouchEvent ): void{
		SlotMachine.sendCommand( event.target.name );
	}

	protected addButtonText( terget: TouchDownButton, size: number, text: string, offsetX: number = 0, offsetY: number = 0, color: number = 0xFFFFFF, width: number = 0, height: number = 0, stroke: number = 0, strokeColor: number = 0 ): TextLabel{
		let txt: TextLabel = Com.addLabelAt( this, offsetX, offsetY, width ? width : terget.width, height ? height : terget.height, size );
		terget.addChild(txt);
		txt.fontFamily = "Righteous";
		if( color != 0xFFFFFF ) txt.textColor = color;
		if( stroke ){
			txt.stroke = stroke;
			txt.strokeColor = strokeColor;
		}
		txt.setText( MuLang.getText(text, MuLang.CASE_UPPER) );
		return txt;
	}

	public setBet( bet: number, lineNumber: number, isMaxBet: boolean ){
		this.betNumber = bet * lineNumber;

		if( isMaxBet ){
			this.maxBetBtn.enabled = false;
			this.increaseBetBtn.enabled = false;
		}
		else{
			this.maxBetBtn.enabled = true;
			this.increaseBetBtn.enabled = true;
		}

		if( bet == GameData.minBet )this.decreseBetBtn.enabled = false;
		else this.decreseBetBtn.enabled = true;
	}

	private set betNumber( value: number ){
		let str: string = Utils.formatCoinsNumber( value );
		this.betText.setText( str );
	}

	public lockAllButtons(): void{
		if( this.autoPlaying )return;
		this.enabledButtons = [];
		for( let i: number = 0; i < this.allButtons.length; i++ ){
			if( this.allButtons[i].enabled ){
				this.allButtons[i].enabled = false;
				this.enabledButtons.push( this.allButtons[i] );
			}
		}
	}

	public unlockAllButtons(): void{
		if( this.autoPlaying )return;
		if( !this.enabledButtons )return;
		for( let i: number = 0; i < this.enabledButtons.length; i++ ){
			this.enabledButtons[i].enabled = true;
		}
		this.enabledButtons = [];
	}

	private enableAllButtons( enabled: boolean ):void{
		for( let i: number = 0; i < this.allButtons.length; i++ ){
			this.allButtons[i].enabled = enabled;
		}
	}

	public showTip( cmd: string, price: number = 0 ){
		let ev: egret.Event = new egret.Event( "tipStatus" );
		
		switch( cmd ){
			case GameCommands.play:
				ev["status"] = "play";
				this.dispatchEvent( ev );
			break;
			default:
				ev["status"] = "ready";
				this.dispatchEvent( ev );
			break;
		}
	}

	public showWinResult( winPrice: number ){
		if( winPrice ) TweenerTool.tweenTo( this, {win: winPrice}, 335 );
		else this.win = winPrice;
		let ev: egret.Event = new egret.Event( "winChange" );
		ev["winCoins"] = winPrice;
		this.dispatchEvent( ev );
	}

	public showStop( isStop: boolean ): void{
		this.playBtn.visible = !isStop;
		this.stopBtn.visible = isStop;
		this.stopBtn.enabled = isStop;
	}

	public unlockAllButtonsAfterOOC(): void{
		this.enableAllButtons( true );
		this.showStop( false );
	}

	private delayKeyboard: number = 500;
	private _enableKeyboard: boolean = true;
	private set enableKeyboard( value: boolean ){
		this._enableKeyboard = value;
		if( !value ){
			setTimeout( () => { this.enableKeyboard = true }, this.delayKeyboard );
		}
	}
	private get enableKeyboard(): boolean{
		return this._enableKeyboard;
	}

	public quickPlay():void{
		if( !this.enableKeyboard || this.autoPlaying )return;
		if( this.playBtn.enabled && this.playBtn.visible ){
			SlotMachine.sendCommand( GameCommands.play );
			this.enableKeyboard = false;
		}
		else if( this.playContainer.visible && this.stopBtn.enabled && this.stopBtn.visible ){
			SlotMachine.sendCommand( GameCommands.stop );
			this.enableKeyboard = false;
		}
	}

	public enabledStopButton(): void{
		this.stopBtn.enabled = false;
	}

	public updateCoinsAndDinero( coins: number, dinero: number ){
		TweenerTool.tweenTo( this, { coins: coins, dinero: dinero }, 335 );
	}

	public updateXp( xp: number ){
		this.xpBar.updateXp( xp );
	}

	private startAuto(){
		SlotMachine.sendCommand( GameCommands.startAuto );
	}

	private _coins: number = 0;
	private get coins(): number{
		return this._coins;
	}
	private set coins( value: number ){
		this._coins = value;
		this.coinsText.setText( Utils.formatCoinsNumber( Math.floor(value) ) );
	}

	private _dinero: number = 0;
	private get dinero(): number{
		return this._dinero;
	}
	private set dinero( value: number ){
		this._dinero = value;
		this.dineroText.setText( Utils.formatCoinsNumber( Math.floor(value) ) );
	}

	private _win: number = 0;
	private get win(): number{
		return this._win;
	}
	private set win( value: number ){
		this._win = value;
		if( value )	this.winText.setText( Utils.formatCoinsNumber( Math.floor(value) ) );
		else this.winText.setText("");
	}

	private onLevelUpBonus( event: egret.Event ){
		let bonus: number = event.data;
		let ev: egret.Event = new egret.Event( XpBar.LEVEL_UP_BONUS );
		ev.data = bonus;
		this.dispatchEvent( ev );
	}

	public updateFreeSpinCount( freeSpinCount: number ){
		this.freeSpinBtn.setFreeCount( freeSpinCount );
	}

	public updateMissionData( value: number, target: number, id: number ){
		// this.missionBar.updateMissionData( value, target, id );
	}
}
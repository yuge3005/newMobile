class GameToolBar extends egret.DisplayObjectContainer{

	public static toolBarY: number;

	private helpBtn: TouchDownButton;
	protected decreseBetBtn: TouchDownButton;
	protected increaseBetBtn: TouchDownButton;
	private closeCardBtn: TouchDownButton;
	private openCardBtn: TouchDownButton;

	private changeNumberBtn: TouchDownButton;

	protected maxBetBtn: TouchDownButton;
	private collectBtn: TouchDownButton;
	private onTurboBtn: TouchDownButton;
	private offTurboBtn: TouchDownButton;

	protected playBtn: TouchDownButton;
	protected stopBtn: TouchDownButton;
	protected startAutoBtn: TouchDownButton;

	protected bigExtraBtn: TouchDownButton;
	protected smallExtraBtn: TouchDownButton;
	protected stopAutoBtn: TouchDownButton;
	protected superExtraBtn: TouchDownButton;

	private betText: egret.TextField;
	private cardText: egret.TextField;

	private winText: egret.TextField;

	protected tipExtraText1: egret.TextField;
	protected tipExtraText2: egret.TextField;

	protected coinIcon: egret.Bitmap;
	protected dineroIcon: egret.Bitmap;

	private allButtons: Array<TouchDownButton>;
	private enabledButtons: Array<TouchDownButton>;

	public static languageText: Object;

	private _autoPlaying: boolean = false;
	public get autoPlaying(): boolean{
		return this._autoPlaying;
	}
	public set autoPlaying( value: boolean ){
		this._autoPlaying = value;
		if( value ){
			this.enableAllButtons( false );

			this.stopAutoBtn.enabled = true;
			this.stopAutoBtn.visible = true;
			BingoMachine.sendCommand( GameCommands.play );
		}
		else{

		}
	}

	private _minCardCount: number = 1;
	public set minCardCount( value: number ){
		this._minCardCount = value;
	}

	public constructor() {
		super();

		Com.addBitmapAt( this, "GameToolBar_json.bg", 0, 0 );

		this.createButtons();

		this.createTexts();

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onToolbarAdd, this);
	}

	protected onToolbarAdd( event: egret.Event ): void{
		//this.startHappyHour();
	}

	private createButtons(){
		this.allButtons = [];

		this.helpBtn = this.addBtn( "GameToolBar_json.help", -2, -5, GameCommands.help );
		this.decreseBetBtn = this.addBtn( "GameToolBar_json.decrease-bet", 61, 42, GameCommands.decreseBet );
		this.increaseBetBtn = this.addBtn( "GameToolBar_json.increase-bet", 191, 42, GameCommands.increaseBet );
		this.closeCardBtn = this.addBtn( "GameToolBar_json.close-card", 61, 82, GameCommands.closeCard );
		this.openCardBtn = this.addBtn( "GameToolBar_json.open-card", 191, 82, GameCommands.openCard );

		this.changeNumberBtn = this.addBtn( "GameToolBar_json.change-number", 108, 83, GameCommands.changeNumber );

		if( !GameToolBar.languageText )GameToolBar.languageText = GameLanguage.languageTextForGameToolbar();

		this.maxBetBtn = this.addBtn( "GameToolBar_json.max-bet", 472, 20, GameCommands.maxBet );
		this.addButtonText( this.maxBetBtn, GlobelSettings.language == "en" ? 20 : 16, "max bet", 0, -2 );

		this.collectBtn = this.addBtn( "GameToolBar_json.max-bet", 472, 22, GameCommands.collect );
		this.addButtonText( this.collectBtn, 20, "collect" );
		this.collectBtn.visible = false;

		this.playBtn = this.addBtn( "GameToolBar_json.play", 603, 23, GameCommands.play );
		this.addButtonText( this.playBtn, 32, "play", 0, -3 );

		this.stopBtn = this.addBtn( "GameToolBar_json.play", 603, 23, GameCommands.stop );
		this.addButtonText( this.stopBtn, 32, "stop", 0, -3 );
		this.stopBtn.visible = false;

		this.startAutoBtn = this.addBtn( "GameToolBar_json.start-auto", 603, 83, GameCommands.startAuto );
		this.addButtonText( this.startAutoBtn, 16, "start auto" );

		this.bigExtraBtn = this.addBtn( "GameToolBar_json.extra-ball-big", 603, 23, GameCommands.extra );
		let bigExtraBtnText = this.addButtonText( this.bigExtraBtn, 24, "extra" );
		this.bigExtraBtn.visible = false;
		bigExtraBtnText.lineSpacing = 4;

		this.smallExtraBtn = this.addBtn( "GameToolBar_json.extra-ball", 603, 23, GameCommands.extra );
		let smallExtraBtnText: egret.TextField = this.addButtonText( this.smallExtraBtn, 20, "extra" );
		smallExtraBtnText.lineSpacing = 2;
		this.smallExtraBtn.visible = false;

		this.superExtraBtn = this.addBtn( "GameToolBar_json.extra-ball-big", 603, 23, GameCommands.extra );
		this.addButtonText( this.superExtraBtn, GlobelSettings.language == "pt"? 15 : 18, "mega" );
		this.superExtraBtn.visible = false;

		this.stopAutoBtn = this.addBtn( "GameToolBar_json.savings", 603, 83, GameCommands.stopAuto );
		this.addButtonText( this.stopAutoBtn, 16, "stop auto" );
		this.stopAutoBtn.visible = false;

		this.buttonAddTip( this.playBtn );
		this.buttonAddTip( this.bigExtraBtn );
		this.buttonAddTip( this.collectBtn );
	}

	private buttonAddTip( button: TouchDownButton ): void{
		let bt: TouchDownButton = button;
		bt.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this );
	}

	private tip: egret.Sprite;

	private onTap( event: egret.TouchEvent ): void{
		let bt: egret.Bitmap = event.target;
		bt.removeEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this );

		if( this.tip && this.contains( this.tip ) )this.removeChild( this.tip );
		this.tip = null;
	}

	private createTexts(){
		this.betText = this.addToolBarText( 96, 48, 94, 20, 12 );
		this.cardText = this.addToolBarText( 125, 88, 36, 20, 18 );

		this.tipExtraText1 = this.addToolBarText( 40, 5, 415, 28, 16 );
		this.tipExtraText2 = this.addToolBarText( 40, 5, 415, 28, 16 );
		this.tipExtraText2.textAlign = "left";
		this.winText = this.addToolBarText( 245, 55, 200, 40, 22 );
		this.addToolBarText( 315, 100, 64, 12, 14 ).text = GameToolBar.languageText["win"][GlobelSettings.language];
		this.addToolBarText( 4, 45, 55, 25, 14 ).text = GameToolBar.languageText["total bet"][GlobelSettings.language];
		this.addToolBarText( 4, 95, 55, 10, GlobelSettings.language === "en"? 14: 12 ).text = GameToolBar.languageText["card"][GlobelSettings.language];

		this.coinIcon = Com.addBitmapAt( this, "GameToolBar_json.icon_coin", 0, 3 );
		this.coinIcon.visible = false;
		this.dineroIcon = Com.addBitmapAt( this, "GameToolBar_json.icon_dinero", 0, 5 );
		this.dineroIcon.visible = false;
	}

	private addToolBarText( x: number, y: number, textWidth: number, textHeight: number, textSize: number ): egret.TextField{
		let tx: egret.TextField = Com.addTextAt(this, x, y, textWidth, textHeight, textSize, true, true);
		tx.fontFamily = "Righteous";
		tx.verticalAlign = "middle";
		tx.stroke = 1;
		return tx;
	}

	protected addBtn( assets: string, x: number, y: number, name: string ): TouchDownButton{
		let btn: TouchDownButton = Com.addDownButtonAt( this, assets + "1", assets + "2", x, y, this.sendCommand, true );
		btn.name = name;
		btn.disabledFilter = MatrixTool.colorMatrixLighter( 0.2 );
		this.allButtons.push( btn );
		return btn;
	}

	protected sendCommand( event: egret.TouchEvent ): void{
		BingoMachine.sendCommand( event.target.name );
	}

	protected addButtonText( terget: TouchDownButton, size: number, text: string, offsetX: number = 0, offsetY: number = 0 ): egret.TextField{
		let txt: egret.TextField = Com.addTextAt(this, offsetX, offsetY, 10, 10, size, true, false);
		terget.setText(txt);
		txt.fontFamily = "Righteous";
		txt.stroke = 1;
		txt.text = GameToolBar.languageText[text][GlobelSettings.language];
		txt.lineSpacing = 10;
		return txt;
	}

	public setBet( bet: number, cardNumber: number, isMaxBet: boolean, isMaxCards: boolean ){
		this.betNumber = bet * cardNumber;
		this.cardText.text = "" + cardNumber;

		if( isMaxBet && isMaxCards )this.maxBetBtn.enabled = false;
		else this.maxBetBtn.enabled = true;

		if( cardNumber == this._minCardCount )this.closeCardBtn.enabled = false;
		else this.closeCardBtn.enabled = true;

		if( isMaxCards )this.openCardBtn.enabled = false;
		else this.openCardBtn.enabled = true;

		if( isMaxBet )this.increaseBetBtn.enabled = false;
		else this.increaseBetBtn.enabled = true;

		if( bet == GameData.minBet )this.decreseBetBtn.enabled = false;
		else this.decreseBetBtn.enabled = true;
	}

	private set betNumber( value: number ){
		let str: string = Utils.formatCoinsNumber( value );
		if( str.length <= 7 ) this.betText.size = 18;
		else if( str.length <= 9 ) this.betText.size = 14;
		else this.betText.size = 12;
		this.betText.text = str;
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

	public showTurboButton( show: boolean ): void{
		this.onTurboBtn.visible = show;
		this.offTurboBtn.visible = !show;
	}

	public showExtra( isShow: boolean, extraPrice: number = 0 ): void{
		if( isShow ){
			if( this.autoPlaying ){
				this.playBtn.visible = false;
			}
			else{
				this.enableAllButtons( false );
				this.showMaxBetButton( false );

				this.bigExtraBtn.enabled = true;
				this.collectBtn.enabled = true;

				this.playBtn.visible = false;
				this.startAutoBtn.visible = false;
				this.stopAutoBtn.visible = false;
			}
			this.showExtraButton( true );
			this.showTip( GameCommands.extra, extraPrice );
			this.betText.filters = [MatrixTool.colorMatrixLighter( 0.3 )];
			this.cardText.filters = [MatrixTool.colorMatrixLighter( 0.3 )];
		}
		else{
			if( this.autoPlaying ){
				this.playBtn.visible = true;
			}
			else{
				this.enableAllButtons( true );
				this.showMaxBetButton( true );

				this.playBtn.visible = true;
				this.startAutoBtn.visible = true;
				this.stopAutoBtn.visible = false;
			}
			this.showExtraButton( false );
			this.betText.filters = [];
			this.cardText.filters = [];
		}
	}

	private enableAllButtons( enabled: boolean ):void{
		for( let i: number = 0; i < this.allButtons.length; i++ ){
			this.allButtons[i].enabled = enabled;
		}
	}

	private showMaxBetButton( isShow: boolean ){
		this.maxBetBtn.visible = isShow;
		this.collectBtn.visible = !isShow;
	}

	private showExtraButton( isShow: boolean ){
		this.bigExtraBtn.visible = isShow;
		this.smallExtraBtn.visible = isShow;
		if( this.autoPlaying )this.bigExtraBtn.visible = false;
		else this.smallExtraBtn.visible = false;
		
		this.superExtraBtn.enabled = this.bigExtraBtn.enabled;
		this.superExtraBtn.visible = this.bigExtraBtn.visible;
	}

	public showTip( cmd: string, price: number = 0 ){
		this.hideIcon();
		
		let ev: egret.Event = new egret.Event( "tipStatus" );
		
		switch( cmd ){
			case GameCommands.play:
				ev["status"] = "play";
				this.dispatchEvent( ev );
			break;
			case GameCommands.extra:
				let extraStr1: string = GameToolBar.languageText["extra ball"][GlobelSettings.language] + ": ";
				let extraStr2: string;
				if( price ) extraStr2 = Utils.formatCoinsNumber( price );
				else extraStr1 += GameToolBar.languageText["free"][GlobelSettings.language];
				this.tipExtraText1.text = extraStr1;
				ev["status"] = "extra";
				ev["extraPrice"] = price;
				this.dispatchEvent( ev );
				if( price )	this.showCoinsIconAt( extraStr1, extraStr2 );
			break;
			default:
				ev["status"] = "ready";
				this.dispatchEvent( ev );
			break;
		}
	}

	protected hideIcon(): void{
		this.tipExtraText1.text = "";
		this.tipExtraText1.x = 40;
		this.tipExtraText2.text = "";
		this.coinIcon.visible = this.dineroIcon.visible = false;
	}

	protected showCoinsIconAt( str1: string, str2: string ): void{
		let icon: egret.Bitmap;
		if( this.getChildIndex( this.bigExtraBtn ) < this.getChildIndex( this.superExtraBtn ) ){
			this.tipExtraText1.text = GameToolBar.languageText["mega ball"][GlobelSettings.language] + ": ";
			icon = this.dineroIcon;
		}
		else {
			icon = this.coinIcon;
		}
		icon.visible = true;
		this.tipExtraText2.text = str2;
		let totalWidth: number = this.tipExtraText1.textWidth + this.tipExtraText2.textWidth + icon.width + 10;
		let lt: number = 495 - totalWidth >> 1;
		this.tipExtraText1.x = lt - ( this.tipExtraText1.width - this.tipExtraText1.textWidth ) * 0.5;
		icon.x = this.tipExtraText1.x + ( this.tipExtraText1.width + this.tipExtraText1.textWidth ) * 0.5;
		this.tipExtraText2.x = icon.x + icon.width + 5;
	}

	public showWinResult( winPrice: number ){
		this.winText.text = "" + ( winPrice ? Utils.formatCoinsNumber( winPrice ) : "" );
		let ev: egret.Event = new egret.Event( "winChange" );
		ev["winCoins"] = winPrice;
		this.dispatchEvent( ev );
	}

	public showStop( isStop: boolean ): void{
		this.playBtn.visible = !isStop;
		this.stopBtn.visible = isStop;
		this.stopBtn.enabled = isStop;
	}

	public showCollectButtonAfterOOC(): void{
		this.showMaxBetButton( false );
		this.bigExtraBtn.enabled = true;
		this.bigExtraBtn.visible = true;
		this.smallExtraBtn.visible = false;
		this.collectBtn.enabled = true;

		this.startAutoBtn.visible = false;
		this.stopAutoBtn.visible = false;
	}

	public unlockAllButtonsAfterOOC(): void{
		this.enableAllButtons( true );

		this.stopAutoBtn.enabled = false;
		this.stopAutoBtn.visible = false;
	}

	public unlockAllButtonsAfterOOCExtra(): void{
		this.enableAllButtons( true );

		this.startAutoBtn.visible = false;
		this.stopAutoBtn.visible = false;

		this.showMaxBetButton( false );
		this.collectBtn.enabled = true;

		this.bigExtraBtn.enabled = true;
		this.showExtraButton( true );
	}

	public collect():void{
		if( this.collectBtn.enabled && this.collectBtn.visible ){
			BingoMachine.sendCommand( GameCommands.collect );
		}
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
			BingoMachine.sendCommand( GameCommands.play );
			this.enableKeyboard = false;
		}
		else if( this.stopBtn.enabled && this.stopBtn.visible ){
			BingoMachine.sendCommand( GameCommands.stop );
			this.enableKeyboard = false;
		}
		else if( this.bigExtraBtn.enabled && this.bigExtraBtn.visible ){
			BingoMachine.sendCommand( GameCommands.extra );
			this.enableKeyboard = false;
		}
	}

	public enabledStopButton(): void{
		this.stopBtn.enabled = false;
	}

	public megeExtraOnTop( megaOnTop: boolean ): void{
		if( megaOnTop ){
			if( this.getChildIndex( this.bigExtraBtn ) > this.getChildIndex( this.superExtraBtn ) ){
				this.setChildIndex( this.bigExtraBtn, this.getChildIndex( this.superExtraBtn ) );
			}
		}
		else{
			if( this.getChildIndex( this.bigExtraBtn ) < this.getChildIndex( this.superExtraBtn ) ){
				this.setChildIndex( this.superExtraBtn, this.getChildIndex( this.bigExtraBtn ) );
			}
		}
	}
}
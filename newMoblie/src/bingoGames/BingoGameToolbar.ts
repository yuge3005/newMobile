class BingoGameToolbar extends egret.DisplayObjectContainer{
	public static toolBarY: number;
	private helpBtn: TouchDownButton;
	protected decreseBetBtn: TouchDownButton;
	protected increaseBetBtn: TouchDownButton;
	protected maxBetBtn: TouchDownButton;
	private collectBtn: TouchDownButton;
	protected playBtn: TouchDownButton;
	protected stopBtn: TouchDownButton;

	private betText: TextLabel;

	private winText: TextLabel;

	private allButtons: Array<TouchDownButton>;

	public constructor() {
		super();

		Com.addBitmapAt( this, "bingoGameToolbar_json.back_panel", 0, 96 );
		Com.addBitmapAt( this, "bingoGameToolbar_json.play_bg", 1360, 0 );
		Com.addBitmapAt( this, "bingoGameToolbar_json.bet_screen", 178, 122 );

		if( !GameToolBar.languageText )GameToolBar.languageText = GameLanguage.languageTextForGameToolbar();
		this.createButtons();
		this.createTexts();

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
	}
	
	private createButtons(){
		this.allButtons = [];

		this.helpBtn = this.addBtn( "bingoGameToolbar_json.i", 12, 126, GameCommands.help );
		this.decreseBetBtn = this.addBtn( "bingoGameToolbar_json.bet_down", 95, 116, GameCommands.decreseBet );
		this.increaseBetBtn = this.addBtn( "bingoGameToolbar_json.bet_up", 411, 116, GameCommands.increaseBet );
		this.maxBetBtn = this.addBtn( "bingoGameToolbar_json.max_btn", 509, 116, GameCommands.maxBet );
		let lb: TextLabel = this.addButtonText( this.maxBetBtn, 48, "max", 0, -2 );
		lb.textColor = 0x343433;
		lb.maxWidth = lb.width = this.maxBetBtn.width - 10;
		lb.setText( lb.text );
		this.collectBtn = this.addBtn( "bingoGameToolbar_json.max_btn", 472, 22, GameCommands.collect );
		this.stopBtn = this.addBtn( "bingoGameToolbar_json.play", 1724, 22, GameCommands.stop );
		this.playBtn = this.addBtn( "bingoGameToolbar_json.play", 1724, 22, GameCommands.play );
	}

	private createTexts(){
		this.betText = this.addToolBarText( 185, 124, 220, 68, 45 );

		// this.tipExtraText1 = this.addToolBarText( 40, 5, 415, 28, 16 );
		// this.tipExtraText2 = this.addToolBarText( 40, 5, 415, 28, 16 );
		// this.tipExtraText2.textAlign = "left";
		this.winText = this.addToolBarText( 245, 55, 200, 40, 22 );
		this.winText.textColor = 0xFEFFF5;
		// this.addToolBarText( 315, 100, 64, 12, 14 ).text = GameToolBar.languageText["win"][GlobelSettings.language];
		let tb: TextLabel = this.addToolBarText( 198, 191, 192, 30, 30 );
		tb.text = GameToolBar.languageText["total bet"][GlobelSettings.language];
		tb.textColor = 0x343433;
		// this.addToolBarText( 4, 95, 55, 10, GlobelSettings.language === "en"? 14: 12 ).text = GameToolBar.languageText["card"][GlobelSettings.language];

		// this.coinIcon = Com.addBitmapAt( this, "GameToolBar_json.icon_coin", 0, 3 );
		// this.coinIcon.visible = false;
		// this.dineroIcon = Com.addBitmapAt( this, "GameToolBar_json.icon_dinero", 0, 5 );
		// this.dineroIcon.visible = false;
	}

	private addToolBarText( x: number, y: number, textWidth: number, textHeight: number, textSize: number ): TextLabel{
		let tx: TextLabel = Com.addLabelAt(this, x, y, textWidth, textHeight, textSize, true, true);
		tx.fontFamily = "Righteous";
		return tx;
	}

	protected addBtn( assets: string, x: number, y: number, name: string ): TouchDownButton{
		let btn: TouchDownButton = Com.addDownButtonAt( this, assets, assets + "_press", x, y, this.sendCommand, true );
		btn.name = name;
		btn.disabledFilter = MatrixTool.colorMatrixLighter( 0.2 );
		this.allButtons.push( btn );
		return btn;
	}

	protected sendCommand( event: egret.TouchEvent ): void{
		BingoMachine.sendCommand( event.target.name );
	}

	protected addButtonText( terget: TouchDownButton, size: number, text: string, offsetX: number = 0, offsetY: number = 0 ): TextLabel{
		let txt: TextLabel = Com.addLabelAt(this, offsetX, offsetY, terget.width, terget.height, size, true, false);
		terget.setText(txt);
		txt.fontFamily = "Righteous";
		txt.stroke = 1;
		txt.text = GameToolBar.languageText[text][GlobelSettings.language];
		txt.lineSpacing = 10;
		return txt;
	}

	public setBet( bet: number, cardNumber: number, isMaxBet: boolean ){
		this.betNumber = bet * cardNumber;

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
		// if( this.autoPlaying )return;
		this.touchChildren = false;
	}

	public unlockAllButtons(): void{
		// if( this.autoPlaying )return;
		this.touchChildren = true;
	}

	public showExtra( isShow: boolean, extraPrice: number = 0 ): void{
		
	}
	public megeExtraOnTop( megaOnTop: boolean ): void{
		// if( megaOnTop ){
		// 	if( this.getChildIndex( this.bigExtraBtn ) > this.getChildIndex( this.superExtraBtn ) ){
		// 		this.setChildIndex( this.bigExtraBtn, this.getChildIndex( this.superExtraBtn ) );
		// 	}
		// }
		// else{
		// 	if( this.getChildIndex( this.bigExtraBtn ) < this.getChildIndex( this.superExtraBtn ) ){
		// 		this.setChildIndex( this.superExtraBtn, this.getChildIndex( this.bigExtraBtn ) );
		// 	}
		// }
	}
}
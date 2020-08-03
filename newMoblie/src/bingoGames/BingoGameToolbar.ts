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
	private coinsText: TextLabel;
	private dineroText: TextLabel;
	private winText: TextLabel;

	protected tipExtraText: egret.TextField;

	private allButtons: Array<TouchDownButton>;

	public constructor() {
		super();

		Com.addBitmapAt( this, "bingoGameToolbar_json.back_panel", 0, 96 );
		Com.addBitmapAt( this, "bingoGameToolbar_json.play_bg", 1360, 0 );
		Com.addBitmapAt( this, "bingoGameToolbar_json.bet_screen", 178, 122 );

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

		this.createButtons();
		this.createTexts();
	}
	
	private createButtons(){
		this.allButtons = [];

		this.helpBtn = this.addBtn( "bingoGameToolbar_json.i", 12, 126, GameCommands.help );
		this.decreseBetBtn = this.addBtn( "bingoGameToolbar_json.bet_down", 95, 116, GameCommands.decreseBet );
		this.increaseBetBtn = this.addBtn( "bingoGameToolbar_json.bet_up", 411, 116, GameCommands.increaseBet );
		this.maxBetBtn = this.addBtn( "bingoGameToolbar_json.max_btn", 509, 116, GameCommands.maxBet );
		this.addButtonText( this.maxBetBtn, 48, "max", 0, 0, 0x343433, this.maxBetBtn.width - 10, this.maxBetBtn.height, 1 );
		this.collectBtn = this.addBtn( "bingoGameToolbar_json.max_btn", 472, 22, GameCommands.collect );
		this.stopBtn = this.addBtn( "bingoGameToolbar_json.play", 1724, 22, GameCommands.stop );
		this.addButtonText( this.stopBtn, 72, "stop", 15, 0, 0xFFFFFF, this.stopBtn.width - 30, 186, 4, 0x000093 );
		this.playBtn = this.addBtn( "bingoGameToolbar_json.play", 1724, 22, GameCommands.play );
		this.addButtonText( this.playBtn, 72, "play", 15, 0, 0xFFFFFF, this.playBtn.width - 30, 125, 4, 0x000093 );
		this.addButtonText( this.playBtn, 35, "hold for auto", 15, 100, 0xFFFFFF, this.playBtn.width - 30, 70, 1, 0x000093 );
	}

	private createTexts(){
		this.betText = this.addToolBarText( 185, 124, 220, 68, 45, 1 );

		this.tipExtraText = this.addToolBarText( 40, 5, 415, 28, 16, 1 );
		this.winText = this.addToolBarText( 720, 50, 565, 65, 60, 2, 0x2A1DB5 );

		this.coinsText = this.addToolBarText( 730, 135, 305, 40, 40, 3, 0xAC9418 );
		this.dineroText = this.addToolBarText( 1070, 135, 150, 40, 40, 3, 0x38AC3d );
		let tb: TextLabel = this.addToolBarText( 198, 192, 192, 30, 30 );
		tb.setText( MuLang.getText("total bet") );
		tb.textColor = 0x343433;

		// this.coinIcon = Com.addBitmapAt( this, "GameToolBar_json.icon_coin", 0, 3 );
		// this.coinIcon.visible = false;
		// this.dineroIcon = Com.addBitmapAt( this, "GameToolBar_json.icon_dinero", 0, 5 );
		// this.dineroIcon.visible = false;
	}

	private addToolBarText( x: number, y: number, textWidth: number, textHeight: number, textSize: number, stroke: number = 0, strokeColor: number = 0 ): TextLabel{
		let tx: TextLabel = Com.addLabelAt(this, x, y, textWidth, textHeight, textSize );
		tx.fontFamily = "Righteous";
		if( stroke ){
			tx.stroke = stroke;
			tx.strokeColor = strokeColor;
		}
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

	protected addButtonText( terget: TouchDownButton, size: number, text: string, offsetX: number = 0, offsetY: number = 0, color: number = 0xFFFFFF, width: number = 0, height: number = 0, stroke: number = 0, strokeColor: number = 0 ): TextLabel{
		let txt: TextLabel = Com.addLabelAt( this, offsetX, offsetY, width ? width : terget.width, height ? height : terget.height, size );
		terget.addChild(txt);
		txt.fontFamily = "Righteous";
		// txt.lineSpacing = 10;
		if( color != 0xFFFFFF ) txt.textColor = color;
		if( stroke ){
			txt.stroke = stroke;
			txt.strokeColor = strokeColor;
		}
		txt.setText( MuLang.getText(text) );
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

	public showTip( cmd: string, price: number = 0 ){
		this.hideIcon();
		
		let ev: egret.Event = new egret.Event( "tipStatus" );
		
		switch( cmd ){
			case GameCommands.play:
				ev["status"] = "play";
				this.dispatchEvent( ev );
			break;
			case GameCommands.extra:
				ev["status"] = "extra";
				ev["extraPrice"] = price;
				this.dispatchEvent( ev );
				// if( price )	this.showCoinsIconAt( extraStr1, extraStr2 );
			break;
			default:
				ev["status"] = "ready";
				this.dispatchEvent( ev );
			break;
		}
	}

	protected hideIcon(): void{
		this.tipExtraText.text = "";
		this.tipExtraText.x = 40;
		// this.coinIcon.visible = this.dineroIcon.visible = false;
	}

	public showWinResult( winPrice: number ){
		this.winText.setText( winPrice ? Utils.formatCoinsNumber( winPrice ) : ""  );
		let ev: egret.Event = new egret.Event( "winChange" );
		ev["winCoins"] = winPrice;
		this.dispatchEvent( ev );
	}

	public showStop( isStop: boolean ): void{
		this.playBtn.visible = !isStop;
		this.stopBtn.visible = isStop;
		this.stopBtn.enabled = isStop;
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

	public updateCoinsAndXp( coins: number, dinero: number ){
		this.coinsText.setText( Utils.formatCoinsNumber( coins ) );
		this.dineroText.setText( Utils.formatCoinsNumber( dinero ) );
	}
}
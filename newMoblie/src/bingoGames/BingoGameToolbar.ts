class BingoGameToolbar extends egret.DisplayObjectContainer{
	public static toolBarY: number;
	private helpBtn: TouchDownButton;
	protected decreseBetBtn: TouchDownButton;
	protected increaseBetBtn: TouchDownButton;
	protected maxBetBtn: TouchDownButton;
	private collectBtn: TouchDownButton;
	protected playBtn: TouchDownButton;
	protected stopBtn: TouchDownButton;

	private allButtons: Array<TouchDownButton>;

	public constructor() {
		super();

		Com.addBitmapAt( this, "bingoGameToolbar_json.back_panel", 0, 96 );
		Com.addBitmapAt( this, "bingoGameToolbar_json.play_bg", 1360, 0 );

		this.createButtons();

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
		this.collectBtn = this.addBtn( "bingoGameToolbar_json.max_btn", 472, 22, GameCommands.collect );
		this.playBtn = this.addBtn( "bingoGameToolbar_json.play", 1724, 22, GameCommands.play );
		this.stopBtn = this.addBtn( "bingoGameToolbar_json.play", 603, 23, GameCommands.stop );
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

	public setBet( bet: number, cardNumber: number, isMaxBet: boolean ){
		// this.betNumber = bet * cardNumber;

		if( isMaxBet )this.maxBetBtn.enabled = false;
		else this.maxBetBtn.enabled = true;

		if( isMaxBet )this.increaseBetBtn.enabled = false;
		else this.increaseBetBtn.enabled = true;

		if( bet == GameData.minBet )this.decreseBetBtn.enabled = false;
		else this.decreseBetBtn.enabled = true;
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
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

		Com.addBitmapAt( this, "BingoGameToolBar_json.play_bg", 0, 0 );

		this.createButtons();
	}
	
	private createButtons(){
		this.helpBtn = this.addBtn( "BingoGameToolBar_json.i", -2, -5, GameCommands.help );
		this.decreseBetBtn = this.addBtn( "BingoGameToolBar_json.bet_down", 61, 42, GameCommands.decreseBet );
		this.increaseBetBtn = this.addBtn( "BingoGameToolBar_json.bet_up", 191, 42, GameCommands.increaseBet );
		this.maxBetBtn = this.addBtn( "GameToolBar_json.max-bet", 472, 20, GameCommands.maxBet );
		this.collectBtn = this.addBtn( "GameToolBar_json.max-bet", 472, 22, GameCommands.collect );
		this.playBtn = this.addBtn( "GameToolBar_json.play", 603, 23, GameCommands.play );
		this.stopBtn = this.addBtn( "GameToolBar_json.play", 603, 23, GameCommands.stop );
	}

	protected addBtn( assets: string, x: number, y: number, name: string ): TouchDownButton{
		let btn: TouchDownButton = Com.addDownButtonAt( this, assets, assets + "_pressed", x, y, this.sendCommand, true );
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
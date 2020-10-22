class BackGameToolBar extends BingoGameToolbar{
	
	private savingBtn: TouchDownButton;
	
	public savingNumber: number;

	public constructor() {
		super();

		this.savingBtn = Com.addDownButtonAt( this.extraContainer, BingoMachine.getAssetStr( "btn_savings" ), BingoMachine.getAssetStr( "btn_savings" ), this.buyAllBtn.x, this.buyAllBtn.y + 2, this.sendCommand, true );
		this.savingBtn.name = GameCommands.saving;
		this.savingBtn.disabledFilter = MatrixTool.colorMatrixLighter( 0.2 );
		this.allButtons.push( this.savingBtn );
		this.addButtonText( this.savingBtn, 50, "saving", 10, 0, 0, this.savingBtn.width - 20 );
	}

	public showExtra( isShow: boolean, extraPrice: number = 0 ): void{
		super.showExtra( isShow, extraPrice );

		if( isShow ){
			this.savingBtn.visible = extraPrice <= this.savingNumber;
			this.savingBtn.enabled = this.savingBtn.visible;
		}
	}
}
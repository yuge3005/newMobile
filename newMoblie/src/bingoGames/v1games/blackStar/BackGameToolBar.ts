class BackGameToolBar extends BingoGameToolbar{
	
	private savingBtn: TouchDownButton;
	
	public savingNumber: number;

	public constructor() {
		super();

		this.savingBtn = this.buyAllBtn;
		this.savingBtn.removeChildAt( this.savingBtn.numChildren - 1 );
		this.addButtonText( this.savingBtn, 16, "saving" );
		this.savingBtn.name = GameCommands.saving;
	}

	public showExtra( isShow: boolean, extraPrice: number = 0 ): void{
		super.showExtra( isShow, extraPrice );

		if( isShow ){
			this.savingBtn.enabled = extraPrice <= this.savingNumber;
		}
	}
}
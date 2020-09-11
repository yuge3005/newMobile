class DoubleManiaTipStatus extends egret.DisplayObjectContainer{
	public constructor() {
		super();
	}

	public clearTexts(){
		this.removeChildren();
	}

	public showStatus( extraPrice: number ){
		let extraStr: string = "";
		if( extraPrice ) extraStr += Utils.formatCoinsNumber( extraPrice );
		else extraStr += MuLang.getText("free");

		Com.addBitmapAt( this, BingoMachine.getAssetStr("Ball_machine"), 0, 0 );

		let tipStatusText: TextLabel = this.addTisText( 130, 40, 0xFFFFFF, "credit" );
		tipStatusText.setText( extraStr );
		let tipStatusTopText: egret.TextField = this.addTisText( 75, 32, 0xFFFD00, "extra ball" );
		let tipStatusBottomText: egret.TextField = this.addTisText( 200, 32, 0xFFFD00, "credit" );
	}

	private addTisText( yPos: number, size: number, color: number, tx: string ): TextLabel{
		let tl: TextLabel = MDS.addGameTextCenterShadow( this, 40, yPos, size, color, tx, false, 204 );
		tl.scaleX = 1;
		return tl;
	}
}
class ChampionCard extends GameCard{

	private winAnimationLayer: egret.DisplayObjectContainer;
	private winTx: TextLabel;

	public constructor(cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		super.onAdd( event );
		
		this.winAnimationLayer = new egret.DisplayObjectContainer;
		Com.addBitmapAt( this.winAnimationLayer, BingoMachine.getAssetStr( "won_bg" ), 0, 0 );

		let winTipTx: TextLabel = MDS.addGameTextCenterShadow( this.winAnimationLayer, 60, 30, 40, 0xFFFFFF, "win", false, 270, true, false );
		winTipTx.scaleX = 1;
		this.winTx = MDS.addGameTextCenterShadow( this.winAnimationLayer, 60, 90, 48, 0xFFFF00, "win", false, 270, true, false );
		this.winTx.scaleX = 1;
	}

	public showWinCount( winNumber: number ): void{
		if( winNumber > 0 ){
			Com.addObjectAt( this, this.winAnimationLayer, 82, 66 );
			this.winTx.setText( Utils.formatCoinsNumber( winNumber ) );
		}
	}

	public clearStatus(): void{
		super.clearStatus();
		if( this.contains( this.winAnimationLayer ) ) this.removeChild( this.winAnimationLayer );
	}
}
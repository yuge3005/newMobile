class EraDoGelo extends SlotMachine{
	protected static get classAssetName(){
			return "eraDoGelo";
	}

	protected static get animationAssetName(){
			return "eraDoGeloAnimation";
	}

	public constructor( assetsPath: string ) {
			super( "eraDoGelo.conf", assetsPath, 47 );

			LineManager.currentLines = LineManager.maxLines = 20;
			LineManager.lineStartPoint = new egret.Point( 218, 108 );
			LineManager.linePicPositions = [445,200,768,120,218,280,518,360,240,202,248,117,630,192,525,204,515,185,530,205];

			LineManager.layerType = EraDoGeloLineLayer;
			LineUI.textBold = true;
	}

	protected init(){
		super.init();

		this.mapItems();
		this.addChildAt( Com.createBitmapByName( "eraDoGelo_bg_jpg" ), 0 );
	}

	private mapItems(){
		let frameBg: egret.DisplayObject = this.getChildByName( SlotMachine.getAssetStr( "bg_frame" ) );
		let childIndex: number = this.getChildIndex( frameBg );
		this.setChildIndex( this.slotIconArea, childIndex );
	}

	protected addIcons(){
		this.slotIconArea = new EraDoGeloSlotIconLayer();
		this.addChild( this.slotIconArea );
		this.slotIconArea.showIcons( null );
	}

	protected showMiniGame(): void{
		alert( "paly mini game" );
		this.sendRoundOverRequest();
		if( 1 > 0 ) return;
		switch( this.tipoBonus ){
			case 1: break;
			case 2: break;
			default: throw new Error( "Server data error: mini game id" );
		}
		this.tipoBonus = 0;
	}

	protected startRunning( figuras: Array<number>, figlinhasPremiadas: Array<number>, figurasPremiadas: Array<number> ){
		this.slotIconArea.startRunning( figuras, figlinhasPremiadas, figurasPremiadas );
	}

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 218, 14 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 34, 10, 295, 65 ), 40, 0x112233 ) );
		this.jackpotArea.jackpotText.fontFamily = "Arial";
		this.jackpotArea.jackpotText.bold = true;
	}
}
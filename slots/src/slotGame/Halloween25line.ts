class Halloween25line extends SlotMachine{
	protected static get classAssetName(){
			return "halloween25line";
	}

	protected static get animationAssetName(){
			return "halloweenAnimation";
	}

	public constructor( assetsPath: string ) {
			super( "halloween25line.conf", assetsPath, 66 );

			LineManager.currentLines = LineManager.maxLines = 25;
			LineManager.lineStartPoint = new egret.Point( 403, 144 );
			LineManager.linePicPositions = [395,181,618,0,145,101,98,281,76,55,124,55,64,7,96,112,335,33,242,159,460,750,1040,1330,1620];

			LineManager.layerType = Halloween25LineLayer;
			LineUI.textBold = true;
	}

	protected init(){
		super.init();

		this.addChildAt( Com.createBitmapByName( "halloween25_bg_jpg" ), 0 );
	}

	protected addIcons(){
		this.slotIconArea = new HalloweenSlotIconLayer();
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
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1246, 34 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 270, 12, 260, 50 ), 40, 0xFFFFFF ) );
		this.jackpotArea.jackpotText.stroke = 2;
		this.jackpotArea.jackpotText.strokeColor = 0;
	}
}
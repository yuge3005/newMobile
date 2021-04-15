class HalloweenX extends SlotMachine{
	protected static get classAssetName(){
			return "halloweenX";
	}

	protected static get animationAssetName(){
			return "halloweenAnimation";
	}

	public constructor( assetsPath: string ) {
			super( "halloweenX.conf", assetsPath, 63 );

			LineManager.currentLines = LineManager.maxLines = 20;
			LineManager.lineStartPoint = new egret.Point( 244, 118 );
			LineManager.linePicPositions = [395,181,618,0,145,101,98,281,76,55,124,55,64,7,96,112,335,33,242,159];

			LineManager.layerType = HalloweenLineLayer;
			LineUI.textBold = true;
	}

	protected init(){
		super.init();

		this.addChildAt( Com.createBitmapByName( "halloweenX_bg_jpg" ), 0 );
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
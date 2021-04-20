class Halloween extends SlotMachine{
	protected static get classAssetName(){
			return "halloween";
	}

	protected static get animationAssetName(){
			return "halloweenAnimation";
	}

	private miniGameMCF: egret.MovieClipDataFactory;
    private cauldronContainer: HalloweenCauldron;
    private strawberryContainer: HalloweenStrawberry;

	public constructor( assetsPath: string ) {
			super( "halloween.conf", assetsPath, 46 );

			LineManager.currentLines = LineManager.maxLines = 20;
			LineManager.lineStartPoint = new egret.Point( 333, 124 );
			LineManager.linePicPositions = [395,181,618,0,145,101,98,281,76,55,124,55,64,7,96,112,335,33,242,159];

			LineManager.layerType = HalloweenLineLayer;
			LineUI.textBold = true;
	}

	protected init(){
		super.init();

		this.addChildAt( Com.createBitmapByName( "halloween_bg_jpg" ), 0 );

		let data = RES.getRes( "mini_game_mcf_json" );
		let tex = RES.getRes( "mini_game_mcf_png" );
		this.miniGameMCF = new egret.MovieClipDataFactory( data, tex );
	}

	protected addIcons(){
		this.slotIconArea = new HalloweenSlotIconLayer();
		this.addChild( this.slotIconArea );
		this.slotIconArea.showIcons( null );
	}

	protected showMiniGame(): void{
		switch( this.tipoBonus ){
			case 1:
				this.showMiniGameConfirmPopup( HalloweenCauldronPopup );
				break;
			case 2:
				this.showMiniGameConfirmPopup( HalloweenStrawberryPopup );
				break;
			default: throw new Error( "Server data error: mini game id" );
		}
	}

	public confirmedAndShowMini(){
		switch( this.tipoBonus ){
			case 1:
				this.cauldronContainer = new HalloweenCauldron(this.gameCoins, this.ganho, this.premiosPagosBonus, GameData.currentBet, 5, this.miniGameMCF);
				// this.cauldronContainer.addEventListener(SlotMachine.BONUS_GAME_WIN, this.showBonusGameWin, this);
				// this.cauldronContainer.once(SlotMachine.BONUS_GAME_OVER, this.bonusGameOver.bind(this, this.cauldronContainer), this);
				Com.addObjectAt(this, this.cauldronContainer, 0, 0);
				break;
			case 2:
				this.strawberryContainer = new HalloweenStrawberry(this.gameCoins, this.ganho, this.premiosPagosBonus, this.miniGameMCF);
				// this.strawberryContainer.addEventListener(SlotMachine.BONUS_GAME_WIN, this.showBonusGameWin, this);
				// this.strawberryContainer.once(SlotMachine.BONUS_GAME_OVER, this.bonusGameOver.bind(this, this.strawberryContainer), this);
				Com.addObjectAt(this, this.strawberryContainer, 0, 0); 
				break;
			default: throw new Error( "Server data error: mini game id" );
		}
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
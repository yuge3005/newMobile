class HalloweenX extends SlotMachine{
	protected static get classAssetName(){
			return "halloweenX";
	}

	protected static get animationAssetName(){
			return "halloweenAnimation";
	}

	private devilData: Object;

	public constructor( assetsPath: string ) {
			super( "halloweenX.conf", assetsPath, 63 );

			LineManager.currentLines = LineManager.maxLines = 20;
			LineManager.lineStartPoint = new egret.Point( 245, 119 );
			LineManager.linePicPositions = [395,181,618,0,145,101,98,281,76,55,124,55,64,7,96,112,335,33,242,159];

			LineManager.layerType = HalloweenXLineLayer;
			LineUI.textBold = true;
	}

	protected init(){
		super.init();

		this.addChildAt( Com.createBitmapByName( "halloweenX_bg_jpg" ), 0 );

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
			case 4:
				this.showMiniGameConfirmPopup( HalloweenXDevilPopup );
				break;
			default: throw new Error( "Server data error: mini game id" );
		}
	}

	public onPlay( data: Object ){
		super.onPlay( data );

		this.devilData = data["devil"];
	}

	public confirmedAndShowMini(){
		switch( this.tipoBonus ){
			case 1:
				this.miniGame = new HalloweenCauldron(this.gameCoins, this.ganho, this.premiosPagosBonus, GameData.currentBet, this.slotIconArea.maxIconNumber, this.miniGameMCF);
				this.miniGame.addEventListener(SlotMachine.BONUS_GAME_WIN, this.showBonusGameWin, this);
				this.miniGame.once(SlotMachine.BONUS_GAME_OVER, this.bonusGameOver.bind(this), this);
				Com.addObjectAt(this, this.miniGame, 0, 0);
				break;
			case 2:
				this.miniGame = new HalloweenStrawberry(this.gameCoins, this.ganho, this.premiosPagosBonus, this.miniGameMCF);
				this.miniGame.once(SlotMachine.BONUS_GAME_OVER, this.bonusGameOver.bind(this), this);
				Com.addObjectAt(this, this.miniGame, 0, 0);
				break;
			case 4:
				this.miniGame = new HalloweenXDevil(this.ganho, this.devilData["innerChange"], this.devilData["outerChange"], this.devilData["medalMultiple"], this.devilData["lineCount"], GameData.currentBet);
				this.miniGame.once(SlotMachine.BONUS_GAME_OVER, this.bonusGameOver.bind(this), this);
				Com.addObjectAt(this, this.miniGame, 0, 0);
				break;
			default: throw new Error( "Server data error: mini game id" );
		}
	}

	protected startRunning( figuras: Array<number>, figlinhasPremiadas: Array<number>, figurasPremiadas: Array<number> ){
		this.slotIconArea.startRunning( figuras, figlinhasPremiadas, figurasPremiadas );
	}

	protected bonusGameOver(e: egret.Event): void {
		HalloweenCollectBonus.bonus = Number(e.data["totalBonus"]);
		this.tipoBonus = 0;
		if( this.miniGame && this.contains( this.miniGame ) ) this.removeChild( this.miniGame );
		this.showMiniGameConfirmPopup( HalloweenCollectBonus, true );

		this.sendRoundOverRequest();
	}

	protected showBonusGameWin(){
		egret.log( "show halloween mini in mini" );
	}

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new HalloweenXJackpotLayer( new egret.Point( 1728, 400 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 20, -56 ), new egret.Rectangle( 0, 0, 225, 74 ), 48, 0xFFFFFF ) );
		this.jackpotArea.jackpotText.stroke = 2;
		this.jackpotArea.jackpotText.strokeColor = 0;
	}
}
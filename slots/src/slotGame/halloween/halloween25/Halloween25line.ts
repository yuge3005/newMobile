class Halloween25line extends SlotMachine{
	protected static get classAssetName(){
			return "halloween25line";
	}

	protected static get animationAssetName(){
			return "halloweenAnimation";
	}

	private posicoesArrayBonus: Array<number>;
	private ganhoBonus: number;

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

		let data = RES.getRes( "mini_game_mcf_json" );
		let tex = RES.getRes( "mini_game_mcf_png" );
		this.miniGameMCF = new egret.MovieClipDataFactory( data, tex );
	}

	protected addIcons(){
		this.slotIconArea = new HalloweenSlotIconLayer();
		this.slotIconArea.scaleX = this.slotIconArea.scaleY = 0.9;
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
			case 5:
				this.showMiniGameConfirmPopup( Halloween25WheelPopup );
				break;
			case 6:
				this.showMiniGameConfirmPopup( Halloween25DicePopup );
				break;
			default: throw new Error( "Server data error: mini game id" );
		}
	}

	public onPlay( data: Object ){
		super.onPlay( data );

		this.posicoesArrayBonus = data["posicoesArrayBonus"];
		this.ganhoBonus = data["ganhoBonus"] + this.ganho;
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
			case 5:
				this.miniGame = new Halloween25Wheel(this.posicoesArrayBonus[0], this.ganho, this.ganhoBonus, this.miniGameMCF);
				this.miniGame.once(SlotMachine.BONUS_GAME_OVER, this.bonusGameOver.bind(this), this);
				Com.addObjectAt(this, this.miniGame, 0, 0);
				break;
			case 6:
				this.miniGame = new Halloween25Dice(this.posicoesArrayBonus[0], this.ganho, this.ganhoBonus, this.miniGameMCF);
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
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1246, 34 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 270, 12, 260, 50 ), 40, 0xFFFFFF ) );
		this.jackpotArea.jackpotText.stroke = 2;
		this.jackpotArea.jackpotText.strokeColor = 0;
	}
}
class HalloweenSuper extends SlotMachine{
	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super( gameConfigFile, configUrl, gameId );
	}

	protected init(){
		super.init();

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
			default: throw new Error( "Server data error: mini game id" );
		}
	}

	protected startRunning( figuras: Array<number>, figlinhasPremiadas: Array<number>, figurasPremiadas: Array<number> ){
		this.slotIconArea.startRunning( figuras, figlinhasPremiadas, figurasPremiadas );
	}

	protected showBonusGameWin(){
		egret.log( "show halloween mini in mini" );
	}
}
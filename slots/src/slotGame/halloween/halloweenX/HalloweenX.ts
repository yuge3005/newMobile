class HalloweenX extends HalloweenSuper{
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
	}

	protected showMiniGame(): void{
		switch( this.tipoBonus ){
			case 1:
			case 2:
				super.showMiniGame();
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
			case 2:
				super.confirmedAndShowMini();
				break;
			case 4:
				this.miniGame = new HalloweenXDevil(this.ganho, this.devilData["innerChange"], this.devilData["outerChange"], this.devilData["medalMultiple"], this.devilData["lineCount"], GameData.currentBet);
				this.miniGame.once(SlotMachine.BONUS_GAME_OVER, this.bonusGameOver.bind(this), this);
				Com.addObjectAt(this, this.miniGame, 0, 0);
				break;
			default: throw new Error( "Server data error: mini game id" );
		}
	}

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new HalloweenXJackpotLayer( new egret.Point( 1728, 400 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 20, -56 ), new egret.Rectangle( 0, 0, 225, 74 ), 48, 0xFFFFFF ) );
		this.jackpotArea.jackpotText.stroke = 2;
		this.jackpotArea.jackpotText.strokeColor = 0;
	}
}
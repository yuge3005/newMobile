class Champion extends V1Game{

    protected static get classAssetName(){
		return "champion";
	}

    protected static get animationAssetName(){
		return "championAnimation";
	}

	private blinkSpArray: Array<egret.Sprite>;

	public constructor( assetsPath: string ) {
		super( "champion.conf", assetsPath, 19 );
		this.languageObjectName = "champion_tx";

		this.ballArea = new ChampionBallManager;

		this.blinkSpArray = new Array<egret.Sprite>();

		CardManager.cardType = ChampionCard;
		GameCard.gridOnTop = true;

        CardGrid.defaultNumberSize = 40;

		GameCard.useRedEffect = true;

        BallManager.normalBallInterval = 20;

		this.ballArea.needLightCheck = true;
	}

    protected init(){
        super.init();
		this.tileBg();

		// this.addGameText( 700, 74, 15, 0x46C8F5, "bingo",false, 200 );
        // this.addGameText( 700, 130, 15, 0x46C8F5, "4 lines",false, 200 );
        // this.addGameText( 700, 183, 15, 0x46C8F5, "perimeter",false, 200 );
        // this.addGameText( 700, 238, 15, 0x46C8F5, "3 lines",false, 200 );
		// this.addGameText( 700, 292, 15, 0x46C8F5, "letterXT",false, 200 );
		// this.addGameText( 700, 346, 15, 0x46C8F5, "2 lines",false, 200 );
		// this.addGameText( 700, 400, 15, 0x46C8F5, "4 corners",false, 200 );
		// this.addGameText( 700, 455, 15, 0x46C8F5, "diagonal",false, 200 );

		this.showNoBetAndCredit();

		if( this.extraUIObject ) this.championExtraUIBg();

		this.buildSuperEbArea( "mega_" + GlobelSettings.language, 702, 524 );

		this.ganhoCounter = new ChampionGanhoCounter( this.showWinAnimationAt.bind( this ) );
    }

	private championExtraUIBg(){
        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.runningBallContainer.x = this.extraUIObject.x;
        this.runningBallContainer.y = this.extraUIObject.y;
        this.addChildAt( this.runningBallContainer, this.getChildIndex( this.extraUIObject ) );
        Com.addObjectAt( this.runningBallContainer, this.extraUIObject, 0, 0 );
        this.extraUIObject = this.runningBallContainer;
	}

	public de_duplication( balls: Array<number> ){
		for( let i: number = 1; i < balls.length; ){
			if( balls[i] == balls[i-1] ){
				balls.splice( i, 1 );
			}
			else i++;
		}
		if( balls[0] == 0 )balls.shift();
	}

	protected changeNumberFromServer( num: number ){
		if( !num )num = 100;
		let card: number = Math.floor( ( num - 1 ) / 25 );
		let index: number = ( num - 1 ) % 25;
		return CardManager.cards[card].getNumberAt( index );
	}

	public createCardGroups(){
		this.Cartoes = RES.getRes( "ChampionCartoes_json" );
	}
/******************************************************************************************************************************************************************/

	protected paytableResultFilter( resultList: Array<Object> ): void{
		for( let i: number = 0; i < resultList.length; i++ ){
			let fitsArr: Array<boolean> = resultList[i]["2lines"].fits;
			if( fitsArr && fitsArr[6] ){
				resultList[i]["4corners"].fit = false;
			}
			let letterFitsArr : Array<boolean> = resultList[i]["letterTX"].fits;
			if( letterFitsArr && letterFitsArr[1] ){
				resultList[i]["4corners"].fit = false;
				resultList[i]["diagonal"].fits = null;
				delete resultList[i]["diagonal"].fits;
			}
		}
		super.paytableResultFilter( resultList );
	}
	
	protected afterCheck( resultList: Array<Object> ): void{
        super.afterCheck( resultList );

		this.ganhoCounter.countGanhoAndPlayAnimation(resultList);
	}

	protected showWinAnimationAt(cardId: number, win: number): void{
		( CardManager.cards[cardId] as ChampionCard ).showWinCount( win * GameData.currentBet );
    }

/******************************************************************************************************************************************************************/    

	protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
		this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 2, 125 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 16, 12 ), new egret.Rectangle( 16, 62, 245, 40 ), 40, 0xFFFF00, new egret.Rectangle( 16, 20, 245, 40 ), 40, 0xFF0000, true ) );
		this.jackpotArea.jackpotText.fontFamily = "Arial";
	}

	protected onBetChanged(event: egret.Event): void{
		super.onBetChanged(event);
		
		if (event.data["type"] !== 0) this.playSound("chp100_mp3");
	}

	protected hasExtraBallFit(): void {
		this.stopSound("chp97_mp3");

		if( this.isMegaBall ){
			this.superExtraBg.visible = true;
			this.gameToolBar.megeExtraOnTop( true );

			if( localStorage.getItem( "champion_mega" ) ) return;
			else{
				localStorage.setItem( "champion_mega", "true" );
				let ev: egret.Event = new egret.Event( "megaFirst" );
				ev.data = new egret.Rectangle( 842, 543, 53, 43 );
				this.dispatchEvent( ev );
			}
		}
	}

	protected roundOver(): void {
        super.roundOver();
        this.stopSound("chp97_mp3");
    }

	protected showLastBall(ballIndex: number): void {
		super.showLastBall(ballIndex);
		
		this.playSound("chp97_mp3");
	}

	protected getExtraBallFit(): void {
		this.playSound("chp97_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
		// override
	}

	protected startPlay(): void {
		super.startPlay();

		for (let i = 0; i < this.blinkSpArray.length; i++) {
            if (this.blinkSpArray[i]) {
                if (this.blinkSpArray[i].parent) {
                    this.blinkSpArray[i].parent.removeChild(this.blinkSpArray[i]);
                }
                this.blinkSpArray[i] = null;
            }
        }
        this.blinkSpArray = new Array<egret.Sprite>();
	}
}
class Champion extends V1Game{

    protected static get classAssetName(){
		return "champion";
	}

    protected static get animationAssetName(){
		return "championAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "champion.conf", assetsPath, 19 );
		this.languageObjectName = "champion_tx";
		this.megaName = "champion_mega";

		this.ballArea = new ChampionBallManager;

		PayTableManager.layerType = ChampionPaytableLayer;

		CardManager.cardType = ChampionCard;

        CardGridColorAndSizeSettings.defaultNumberSize = 40;

		GameCardUISettings.useRedEffect = true;

        BallManager.normalBallInterval = 20;

		this.ballArea.needLightCheck = true;
	}

    protected init(){
        super.init();
		this.tileBg();

		this.addHelpBtn();
		this.showNoBetAndCredit();

		if( this.extraUIObject ) this.championExtraUIBg();

		this.buildSuperEbArea( "mega_" + MuLang.language, 702, 524 );

		this.ganhoCounter = new ChampionGanhoCounter( this.showWinAnimationAt.bind( this ) );
    }

	private championExtraUIBg(){
        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.runningBallContainer.x = this.extraUIObject.x;
        this.runningBallContainer.y = this.extraUIObject.y;
        this.addChildAt( this.runningBallContainer, this.getChildIndex( this.extraUIObject ) );
		this.extraUIObject.visible = true;
        Com.addObjectAt( this.runningBallContainer, this.extraUIObject, 0, 0 );
		Com.addMovieClipAt( this.runningBallContainer, MDS.mcFactory, "championAnimation1", 7, 0 );
		Com.addMovieClipAt( this.runningBallContainer, MDS.mcFactory, "championAnimation2", 88, 0 );
		Com.addMovieClipAt( this.runningBallContainer, MDS.mcFactory, "championAnimation3", 169, 0 );
		this.runningBallContainer.visible = false;
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
		this.payTableArea.clearPaytableFgs();
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

			this.tryFirstMega( new egret.Rectangle( 842, 543, 53, 43 ) );
		}
	}

	protected roundOver(): void {
        super.roundOver();
        this.stopSound("chp97_mp3");

		for( let i: number = 0; i < 4; i++ ){
			( CardManager.cards[i] as ChampionCard ).showChampionWinCount();
		}
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
		this.payTableArea.clearPaytableFgs();
	}

	private addHelpBtn(){
		let helpBtn: TouchDownButton = Com.addDownButtonAt( this, this.assetStr( "btn_help" ), this.assetStr( "btn_help" ), 20, 336, this.onHelpButton, true );
		let txt: TextLabel = Com.addLabelAt( this, 0, 0, helpBtn.width, helpBtn.height, 36 );
		helpBtn.addChild(txt);
		txt.fontFamily = "Righteous";
		txt.textColor = 0xFFFFFF;

		txt.setText( MuLang.getText("help", MuLang.CASE_UPPER) );
	}

	private onHelpButton( event: egret.TouchEvent ){
		BingoMachine.sendCommand( GameCommands.help );
	}
}
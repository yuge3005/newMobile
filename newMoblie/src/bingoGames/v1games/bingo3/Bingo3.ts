class Bingo3 extends V1Game{

	protected static get classAssetName(){
		return "bingo3";
	}

	protected static get animationAssetName(){
		return "bingo3Animation";
	}

	public constructor( assetsPath: string ) {
		super( "bingo3.conf", assetsPath, 24 );

		CardGridUISettings.zeroUI = "middle_grid";

		CardGridColorAndSizeSettings.defaultNumberSize = 45;

		CardManager.cardType = Bingo3Card;
		GameCardUISettings.useRedEffect = true;

		PayTableManager.bingoPaytableName = "bingo3_flower";
	}

	protected init(){
		super.init();

		this.showNoBetAndCredit();

		this.runningBallContainer = new egret.DisplayObjectContainer;
		Com.addBitmapAt( this.runningBallContainer, this.assetStr( "img_boca_baixo" ), 0, 0 );
		this.coverRunningBall = Com.addBitmapAt( this.runningBallContainer, this.assetStr( "img_boca_cima" ), 0, 0 );

		Com.addBitmapAt( this, this.assetStr( "box" ), 1570, 151 );
		let tx: egret.TextField = Com.addTextAt( this, 1560, 151, 200, 88, 30 );
		tx.text = "x2500\n+" + MuLang.getText( "jackpot", MuLang.CASE_LOWER );
		tx.verticalAlign = "middle";
		tx.textAlign = "right";
		tx.textColor = 0xFFFF2D;
	}

	private doNotShowLastBall: boolean = false;

	protected showLastBall( ballIndex: number ): void{
		super.showLastBall( ballIndex );
		super.showLastBallAt( ballIndex, 45, -13 );
		Com.addObjectAt( this.runningBallContainer, this.coverRunningBall, 0, 0 );
		Com.addObjectAt( this, this.runningBallContainer, 194, 0 );
		if (this.doNotShowLastBall) this.runningBallUI.visible = false;
		
		this.playSound("b3_ball_mp3");
	}

	protected showExtraUI( show: boolean = true ){
		super.showExtraUI( show );
		this.doNotShowLastBall = show;
		this.getChildByName( this.assetStr( "bingo3Animation" ) ).visible = false;
	}

	protected clearRunningBallUI(): void{
		if( this.runningBallContainer && this.contains( this.runningBallContainer ) )this.removeChild( this.runningBallContainer );
		this.getChildByName( this.assetStr( "bingo3Animation" ) ).visible = true;
	}

	public de_duplication( balls: Array<number> ){
		for( let i: number = 1; i < balls.length; ){
			if( balls[i] == balls[i-1] ){
				balls.splice( i, 1 );
			}
			else if( balls[i] == 0 ){
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
		this.Cartoes = RES.getRes( "Bingo3Cartoes_json" );
	}

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
		this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1473, 26 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 43, 20, 257, 35 ), 25, 0xFFFF00, null, 0, 0, true ) );
		this.jackpotArea.jackpotText.fontFamily = "Arial";
	}

	protected afterCheck( resultList: Array<Object> ): void{
		super.afterCheck( resultList );

		if( !this.inLightCheck ){
			if( PaytableResultListOprator.missOneCounter( resultList, "bingo3_flower" ) ){
                this.playSound("b3_blink_mp3", -1);
			}
		}
	}

	protected onBetChanged( event: egret.Event ): void{
		super.onBetChanged(event);

		if (event.data["type"] !== 0) this.playSound("b3_bet_mp3");
	}

	protected hasExtraBallFit(): void {
		this.stopSound("b3_ball_mp3");
	}

	protected roundOver(): void {
        super.roundOver();
		this.stopSound("b3_ball_mp3");
		this.stopSound("b3_blink_mp3");

		let card: Array<GameCard> = CardManager.cards;
		for( let i: number = 0; i < card.length; i++ ){
			( card[i] as Bingo3Card ).showPaytablesGot();
		}
    }

	protected getExtraBallFit(): void {
		this.playSound("b3_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
		// override
	}

	protected startPlay(): void {
		super.startPlay();
	}
}
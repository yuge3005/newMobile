class CardManager{

	public static cards: Array<GameCard>;

	public static groupNumber: number;

	public static cardType: Function;
	public static gridType: Function;

	public constructor() {
	}

	public static cardDefaultSettings(): void{
		CardManager.cardType = GameCard;
		CardManager.gridType = CardGrid;
		GameCard.gridOnTop = false;
		GameCard.useRedEffect = false;
		GameCard.cardTexPosition = null;
		GameCard.betTexPosition = null;
		GameCard.fitEffectRedLine = true;
		GameCard.bgRound = 0;
		GameCard.showTitleShadow = null;
		GameCard.firstToUpperCase = false;
	}

	public static getCardData( data: Object, cardNumbers: number ){
		this.cards = new Array<GameCard>();
		GameCard.getCardData( data );
		for( let i: number = 0; i < cardNumbers; i++ ){
			this.cards[i] = eval( "new CardManager.cardType( i )" );
		}
	}

	public static get enabledCards(): number{
		let num: number = 0;
		for( let i: number = 0; i < this.cards.length; i++ ){
			if( this.cards[i].enabled )num ++;
		}
		return num;
	}

	public static setCardBet( bet: number ): number{
		for( let i: number = 0; i < this.cards.length; i++ ){
			this.cards[i].bet = bet;
		}
		return bet * this.enabledCards;
	}

	public static enabledAllCards(): void{
		for( let i: number = 0; i < this.cards.length; i++ ){
			this.cards[i].enabled = true;
		}
	}

	public static getBall( ballIndex: number ){
		for( let i: number = 0; i < this.cards.length; i++ ){
			if( !this.cards[i].enabled )break;
			this.cards[i].checkNumber( ballIndex );
		}
	}

	public static clearCardsStatus(){
		for( let i: number = 0; i < this.cards.length; i++ ){
			this.cards[i].clearStatus();
		}
	}

	public static getCheckingStrings(): Array<string>{
		let checkingString: Array<string> = [];
		for( let i: number = 0; i < this.cards.length; i++ ){
			checkingString.push( this.cards[i].getCheckString() );
		}
		return checkingString;
	}

	public static letCardBlink( blinkGridOnCard: Array<Array<number>> ): void{
		for( let i: number = 0; i < blinkGridOnCard.length; i++ ){
			for( let j: number = 0; j < blinkGridOnCard[i].length; j++ ){
				this.cards[i].blinkAt( blinkGridOnCard[i][j] );
			}
		}
	}

	public static stopAllBlink(): void{
		for( let i: number = 0; i < this.cards.length; i++ ){
			this.cards[i].stopBlink();
		}
	}

	public static changeCardsBgColor(){
		if( !GameCard.titleColors )return;
		GameCard.changeBgColor();
		for( let i: number = 0; i < this.cards.length; i++ ){
			this.cards[i].getBgColor();
		}
	}

	public static showPaytableResult( cardIndex: number, paytableName: string, fit: boolean, fitIndexArray: Array<boolean> ){
		if( fit )fitIndexArray = [];
		this.cards[cardIndex].showfitEffect( paytableName, fitIndexArray );
	}

/*****************************************************************************************************************/

	private static blinkTimer: egret.Timer;

	public static startBlinkTimer(){
		this.blinkTimer = new egret.Timer( 500, 0 );
		this.blinkTimer.addEventListener( egret.TimerEvent.TIMER, this.onBlinkTimer, this );
		this.blinkTimer.start();
	}

	private static onBlinkTimer( event: egret.TimerEvent ): void{
		for( let i: number = 0; i < this.cards.length; i++ ){
			this.cards[i].blink( ( event.target as egret.Timer ).currentCount & 1 );
		}
	}

	public static stopBlinkTimer(){
		this.blinkTimer.reset();
		this.blinkTimer.stop();
	}

	public static clearCardsEffect(){
		for( let i: number = 0; i < this.cards.length; i++ ){
			this.cards[i].clearFitEffect();
		}
	}

	public static setSmallWinTime( cardIndex: number, gridIndex: number, winTimes: number ){
		this.cards[cardIndex].setSmallWinTimeAt( gridIndex, winTimes );
	}

	public static setSmallWinIcon( cardIndex: number, gridIndex: number, winIcon: egret.DisplayObjectContainer ){
		this.cards[cardIndex].setSmallWinIconAt( gridIndex, winIcon );
	}
}
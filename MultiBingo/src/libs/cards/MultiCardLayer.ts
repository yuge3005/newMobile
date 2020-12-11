class MultiCardLayer extends egret.DisplayObjectContainer{

	public cards: Array<MultiPlayerCard>;

	private static currentCardLayer: MultiCardLayer;

	public static cardType: Function;
	public static gridType: Function;

	public constructor() {
		super();

		MultiCardLayer.currentCardLayer = this;
	}

	public getCardData( data: Object ){
		this.cards = new Array<MultiPlayerCard>();
		MultiPlayerCard.getCardData( data );
		let cardNumbers: number = GameCardUISettings.cardPositions.length;
		for( let i: number = 0; i < cardNumbers; i++ ){
			this.cards[i] = eval( "new MultiCardLayer.cardType( i )" );
			this.cards[i].x = GameCardUISettings.cardPositions[i]["x"];
			this.cards[i].y = GameCardUISettings.cardPositions[i]["y"];
		}
	}

	public get enabledCards(): number{
		let num: number = 0;
		for( let i: number = 0; i < this.cards.length; i++ ){
			if( this.cards[i].enabled )num ++;
		}
		return num;
	}

	public static getBall( ballIndex: number ){
		let cards: Array<MultiPlayerCard> = MultiCardLayer.currentCardLayer.cards;
		for( let i: number = 0; i < cards.length; i++ ){
			if( !cards[i].enabled )continue;
			cards[i].checkNumber( ballIndex );
		}
	}

	public clearCardsStatus(){
		for( let i: number = 0; i < this.cards.length; i++ ){
			this.cards[i].clearStatus();
		}
	}

	public getCheckingStrings(): Array<string>{
		let checkingString: Array<string> = [];
		for( let i: number = 0; i < this.cards.length; i++ ){
			checkingString.push( this.cards[i].getCheckString() );
		}
		return checkingString;
	}

	public letCardBlink( blinkGridOnCard: Array<Array<number>> ): void{
		for( let i: number = 0; i < blinkGridOnCard.length; i++ ){
			for( let j: number = 0; j < blinkGridOnCard[i].length; j++ ){
				this.cards[i].blinkAt( blinkGridOnCard[i][j] );
			}
		}
	}

	public showPaytableResult( cardIndex: number, paytableName: string, fit: boolean, fitIndexArray: Array<boolean> ){
		if( fit )fitIndexArray = [];
		this.cards[cardIndex].showfitEffect( paytableName, fitIndexArray );
	}

/*****************************************************************************************************************/

	private blinkTimer: egret.Timer;

	public startBlinkTimer(){
		this.blinkTimer = new egret.Timer( 500, 0 );
		this.blinkTimer.addEventListener( egret.TimerEvent.TIMER, this.onBlinkTimer, this );
		this.blinkTimer.start();
	}

	private onBlinkTimer( event: egret.TimerEvent ): void{
		for( let i: number = 0; i < this.cards.length; i++ ){
			this.cards[i].blink( ( event.target as egret.Timer ).currentCount & 1 );
		}
	}

	public stopBlinkTimer(){
		this.blinkTimer.reset();
		this.blinkTimer.stop();
	}

	public clearCardsEffect(){
		for( let i: number = 0; i < this.cards.length; i++ ){
			this.cards[i].clearFitEffect();
		}
	}

/*********************************************************************************************/

	public positionOnCard( cardIndex: number, gridIndex: number ): egret.Point{
		let pt: egret.Point = new egret.Point;
		let position: egret.Point = MultiPlayerCard.getGridPosition( gridIndex );
		pt.x = GameCardUISettings.cardPositions[cardIndex]["x"] + position.x;
		pt.y = GameCardUISettings.cardPositions[cardIndex]["y"] + position.y;
		return pt;
	}

	public getIndexByUUID( uuid: string ): number{
		let cardIndex: number = -1;
		for( let i: number = 0; i < 4; i++ ){
			if( this.cards[i].uuid == uuid ){
				cardIndex = i;
				break;
			}
		}
		return cardIndex;
	}
}
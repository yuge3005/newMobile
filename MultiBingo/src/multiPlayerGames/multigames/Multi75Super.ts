class Multi75Super extends MultiPlayerMachine{
	public constructor( configFile: string, assetsPath: string ) {
		super( configFile, assetsPath, 0 );
	}

	protected calledBingoNumbers( varValue: Array<Object> ): Array<number>{
		let balls: Array<number> = [];
		for( let i: number = 0; i < varValue.length; i++ ){
			balls.push( varValue[i]["lastBall"] );
		}
		return balls;
	}

/********************************************************************************************/

	protected get inPlayerRound():boolean{
		return this.waitingBar == null && this.roundEndBar == null;
	}

	protected resetCardsStatus(){
		for( let i: number = 0; i < this.cardArea.cards.length; i++ ){
			( this.cardArea.cards[i] as Multi75Card ).clearMultiStatus();
			this.cardArea.cards[i].visible = false;
			this.cardArea.cards[i].enabled = false;
		}
	}

	protected getFinalWinner(){
		if( this.chatBar )this.chatBar.roundOver();
	}

	protected removeWaitingBar(){
		if( this.waitingBar ){
			if( this.dailogLayer.contains( this.waitingBar ) )this.dailogLayer.removeChild( this.waitingBar );
			this.waitingBar.removeEventListener( "waitingBarBuyCard", this.onBuyCard, this );
			this.waitingBar = null;
		}
	}

	protected callBingo( data: Object ){
		if( this.chatBar ) this.chatBar.showBingoPlayerName( data["name"], data["fbId"] );
	}
	
	protected otherJoinRoom( userName: string, fbId: string, userId: string ){
		if( this.chatBar ) this.chatBar.otherJoin( userName, fbId, userId );
	}

	protected getMessage( userName: string, message: string, fbId: string ){
		if( this.chatBar ) this.chatBar.userMessage( userName, message, fbId );
	}
	
	protected cardsAndPlayersUpdate( data: Object ){
		if( this.bingoCounterBar ){
			this.bingoCounterBar.updateCardAndPlayerNumbers( data["cardCount"], data["buyCardPlayersAmount"] );//, data["players"]
		}
		else setTimeout( this.cardsAndPlayersUpdate.bind( this, data ), 100 );
	}
		
	protected checkMultiBingo( event: egret.Event ){
		let card: MultiPlayerBingoCard = event.target;
		let checkString: string = card.getCollectedString();
		for( let i: number = 0; i < this.currentPaytableRules.length; i++ ){
			let ptString: string = this.currentPaytableRules[i];
			let isFit: boolean = true;
			for( let j: number = 0; j < ptString.length; j++ ){
				if( ptString.charAt(j) == "1" && checkString.charAt(j) != "1" ){
					isFit = false;
					break;
				}
			}
			if( isFit ){
				card.showBingo();
				break;
			}
		}
	}

	protected quitInturnMode(){
		let cards: Array<MultiPlayerCard> = this.cardArea.cards;
		for( let i: number = 0; i < cards.length; i++ ){
			( cards[i] as Multi75Card ).quitInturnMode();
		}
	}
}
class V1Game extends BingoMachine{

	public Cartoes: Array<Array<number>>;

	public getCardsGroup( value: number ): Array<number>{
		if( !this.Cartoes )this.createCardGroups();

		let ar: Array<Array<number>> = this.Cartoes.slice( value * 4 - 3, value * 4 + 1 );

		let resultArray: Array<number> = [];
		for(let i: number = 0; i < ar.length; i++ ){
			resultArray = resultArray.concat( this.changeCardNumberOrder( ar[i] ) );
		}
		return resultArray;
	}

	protected changeCardNumberOrder( groupNumbers: Array<number> ): Array<number>{
		let newArray: Array<number> = [];
		groupNumbers = groupNumbers.concat();
		for( let i: number = 0; i < groupNumbers.length; i++ ){
			let line: number = i % GameCardUISettings.gridNumbers.y;
			let row: number = Math.floor( i / GameCardUISettings.gridNumbers.y );
			newArray[line*5+row] = groupNumbers[i];
		}
		return newArray;
	}

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super( gameConfigFile, configUrl, gameId );

		this.tokenObject["key"] = "login";
		this.tokenObject["value"]["token"] = "112411241124696911692424116969";
	}

	protected onServerData( data: Object ){
		data["numerosCartelas"] = this.getCardsGroup( data["cartela"] );
		super.onServerData( data );
	}

	protected sendRoundOverRequest(){
		IBingoServer.roundOverCallback = this.onRoundOver.bind( this );
		IBingoServer.libera();
	}

	protected sendPlayRequest(){
		IBingoServer.playCallback = this.onPlay.bind( this );
		IBingoServer.round( GameData.currentBet, CardManager.enabledCards, CardManager.groupNumber, GameData.currentBetIndex );
		BingoMachine.inRound = true;
	}

	protected sendExtraRequest( saving: boolean = false ){
		IBingoServer.extraCallback = this.onExtra.bind( this );
		IBingoServer.extra( true, saving );
	}

	protected sendCancelExtraReuqest(){
		IBingoServer.cancelExtraCallback = this.onCancelExtra.bind( this );
		IBingoServer.cancelExtra( true );
	}

	public createCardGroups(){
		this.Cartoes = RES.getRes( "v1gameDefault_json" );
	}

	public onPlay( data: Object ){
		if( data && data["bolas"] && data["bolas"].length ){
			let balls: Array<number> = data["bolas"];
			for( let i: number = 0; i < balls.length; i++ ){
				balls[i] = this.changeNumberFromServer( balls[i] );
			}
			if( this["de_duplication"] )this["de_duplication"]( balls );
		}
		else data = null;
		super.onPlay( data );
	}

	protected changeNumberFromServer( num: number ){
		let card: number = Math.floor( ( num - 1 ) / 15 );
		let index: number = ( num - 1 ) % 15;
		return CardManager.cards[card].getNumberAt( index );
	}

	public onExtra( data: Object ){
		if( data && data["extra"] != null ){
			if( this["de_duplication"] )data["extra"] = data["extra"] % 100;
			data["extra"] = this.changeNumberFromServer( data["extra"] );
		}
		else data = null;

		super.onExtra( data );
	}

	protected showMissExtraBall( balls: Array<number> ){
		if( !balls ) return;
		for( let i: number = 0; i < balls.length; i++ ){
			balls[i] = this.changeNumberFromServer( balls[i] );
		}
		super.showMissExtraBall( balls );
	}
}
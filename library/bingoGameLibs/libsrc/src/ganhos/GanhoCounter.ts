class GanhoCounter {

	protected ganhoArray: Array<number>;
	protected winCallback: Function;

	public constructor( winCallback: Function = null ) {
		this.ganhoArray = [];
		this.winCallback = winCallback;
	}

	public clearGanhoData(){
		this.ganhoArray = [];
	}

	public countGanhoAndPlayAnimation( resultList: Array<Object> ): void{
		let fitItemOnCard: Array<Array<Object>> = this.getFitItemOnCard( resultList );
		let ganhoArray: Array<number> = this.getGanhoArray( resultList, fitItemOnCard );

		this.showWinAnimationOnAllCards( ganhoArray );
    }

	private showWinAnimationOnAllCards( ganhoArray: Array<number> ): void{
		for( let i: number = 0; i < ganhoArray.length; i++ ){
            if( ganhoArray[i] ){
                if( !this.ganhoArray[i] || ganhoArray[i] > this.ganhoArray[i] ){
                    this.ganhoArray[i] = ganhoArray[i];
					if( this.winCallback )this.winCallback( i, ganhoArray[i] );
                }
            }
        }
	}

	protected getFitItemOnCard( resultList: Array<Object> ): Array<Array<Object>>{
		let fitItemOnCard: Array<Array<Object>> = [];
		for( let i: number = 0; i < resultList.length; i++ ){
			fitItemOnCard[i] = [];
			for( let ob in PayTableManager.payTablesDictionary ){
				let result: PaytableCheckResult = resultList[i][ob];
				if( result.fit || result.fits ){
					fitItemOnCard[i].push( { paytalbe:ob,fit:result.fit, fits: result.fits} );
				}
			}
		}

		if( PaytableFilter.filterObject ){
			for( let i: number = 0; i < fitItemOnCard.length; i++ )PaytableFilter.paytableConfixFilter( fitItemOnCard[i], true );
		}

		return fitItemOnCard;
	}

	private getGanhoArray( resultList: Array<Object>, fitItemOnCard: Array<Array<Object>> ): Array<number>{
		let ganhoArray: Array<number> = [];
		for( let i: number = 0; i < resultList.length; i++ ){
            ganhoArray[i] = 0;
			for( let ob in PayTableManager.payTablesDictionary ){
                let result: PaytableCheckResult = resultList[i][ob];
				if( result.fit || result.fits ){
					let inFitItem: boolean = false;
					for( let k: number = 0; k < fitItemOnCard[i].length; k++ ){
						if( fitItemOnCard[i][k]["paytalbe"] == ob ){
							inFitItem = true;
							break;
						}
					}
					if( !inFitItem )continue;
					this.countGanho( ganhoArray, i, ob, result );
				}
            }
        }

		return ganhoArray;
	}

	protected countGanho( ganhoArray: Array<number>, i: number, ob: string, result: PaytableCheckResult ): void{
		let winTimesTxt: string = PayTableManager.payTablesDictionary[ob].ui["tx"].text;
		ganhoArray[i] += parseFloat( winTimesTxt.replace( /\D/, "" ) );
	}
}
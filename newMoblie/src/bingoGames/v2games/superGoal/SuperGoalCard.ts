class SuperGoalCard extends ExtraBlinkCard{

	private winTipTx: TextLabel;
	private winTx: TextLabel;

	public constructor( cardId: number ) {
		super( cardId );
	}

	public set bet( value: number ){
		this.betText.setText( Utils.formatCoinsNumber( value ) );
    }

	protected onAdd(event: egret.Event) {
        super.onAdd(event);

		if (this.cardText) this.cardText.setText( MuLang.getText( "bet" ) + ":" );

		this.winTipTx = Com.addLabelAt( this, 245, GameCard.cardTextRect.y, GameCard.cardTextRect.width, GameCard.cardTextRect.height, GameCard.cardTextRect.height, false, true );
		this.winTipTx.textColor = GameCardUISettings.texColor;
		this.winTipTx.textAlign = "left";
		this.winTipTx.scaleX = 0.9;
		this.winTipTx.setText( MuLang.getText( "win" ) + ":" );
		this.winTx = Com.addLabelAt( this, 325, GameCard.betTextRect.y, 200, GameCard.betTextRect.height, GameCard.betTextRect.height, false, true );
		this.winTx.textAlign = "left";
		this.winTx.scaleX = 0.9;
		this.winTx.setText( MuLang.getText( "" ) + ": " );
		this.winTx.visible = this.winTipTx.visible = false;
    }

	public showWinCount( winNumber: number ): void{
		if( winNumber > 0 ){
			this.winTx.visible = this.winTipTx.visible = true;
			this.winTx.setText( Utils.formatCoinsNumber( winNumber ) );
		}
	}

	private redEffectKeys: Object = {};

	public showfitEffect( assetName: string, fitIndex: Array<boolean> ){
		if( GameCard.useRedEffect ){
			if( fitIndex.length ){
				for( let i: number = 0; i < fitIndex.length; i++ ){
					if( fitIndex[i] ){
						let ruleStr: string = PayTableManager.payTablesDictionary[assetName].rules[i];
						this.setGridsToRed( ruleStr );

						if( !this.redEffectKeys[ ruleStr ] ){
							this.gridsRedWave( ruleStr );
						}
					}
				}
			}
			else{
				let ruleStr: string = PayTableManager.payTablesDictionary[assetName].rule;
				this.setGridsToRed( ruleStr );

				if( !this.redEffectKeys[ ruleStr ] ){
					this.gridsRedWave( ruleStr );
				}
			}
		}
	}

	public clearStatus(){
		SuperGoalGrid.needClear = true;
		super.clearStatus();
		SuperGoalGrid.needClear = false;
		this.redEffectKeys = {};
		this.winTx.visible = this.winTipTx.visible = false;
	}

	protected gridsRedWave( str: string ): void{
		this.redEffectKeys[ str ] = true;
		trace( str );

		let first1: number = str.indexOf( "1" );

		if( str == "1000100000000000000010001" ){ // corner
			for( let j: number = 0; j < str.length; j++ ){
				if( str[j] == "1" ){
					( this.grids[j] as SuperGoalGrid ).showWaveEffect( 100 );
				}
			}
		}
		else if( str == "0000001110010100111000000" ){
			this.turnRedOrder( [ 6,7,8,13,18,17,16,11 ] );
		}
		else if( str == "0010000100110110010000100" ){
			this.turnRedOrder( [ 10,11,13,14,2,7,17,22 ] );
		}
		else if( str == "1010101010100010101010101" ){
			this.turnRedOrder( [ 0,6,18,24 ] );
			this.turnRedOrder( [ 2,8,14,4 ] );
			this.turnRedOrder( [ 10,16,22,20 ] );
		}
		else if( str == "0101011111010101111101010" ){
			this.turnRedOrder( [ 5,6,7,8,9,1,6,11,16,21 ] );
			this.turnRedOrder( [ 15,16,17,18,19,3,8,13,18,23 ] );
		}
		else if( str == "1111110001100011000111111" ){
			this.turnRedOrder( [ 0,1,2,3,4,9,14,19,24,23,22,21,20,15,10,5 ] );
		}
		else if( str == "1111111011100011101111111" ){
			this.turnRedOrder( [ 0,6,18,24,8,16 ] );
			this.turnRedOrder( [ 1,2,3,4,9,14,19 ] );
			this.turnRedOrder( [ 5,10,15,20,21,22,23 ] );
		}
		else if( str == "1111010000110100001011110" ){//s
			this.turnRedOrder( [ 3,2,1,0,5,10,11,13,18,23,22,21,20 ] );
		}
		else if( str == "1001010010100101001011110" ){//u
			this.turnRedOrder( [ 0,5,10,15,20,21,22,23,18,13,8,3 ] );
		}
		else if( str == "1111010010110101000010000" ){//p
			this.turnRedOrder( [ 1,2,3,8,13,11,0,5,10,15,20 ] );
		}
		else if( str == "1111010000110101000011110" ){//e
			this.turnRedOrder( [ 0,1,2,3,5,10,15,20,21,22,23,11,13 ] );
		}
		else if( str == "1111010010110101010010010" ){//r
			this.turnRedOrder( [ 0,5,10,15,20,1,2,3,8,13,11,17,23 ] );
		}
		else if( str == "1111010000100101001011110" ){//g
			this.turnRedOrder( [ 3,2,1,0,5,10,15,20,21,22,23,18,13 ] );
		}
		else if( str == "1111010010100101001011110" ){//o
			this.turnRedOrder( [ 0,5,10,15,20,21,22,23,18,13,8,3,2,1 ] );
		}
		else if( str == "1111010010110101001010010" ){//a
			this.turnRedOrder( [ 0,5,10,15,20,1,2,3,8,13,18,23,11 ] );
		}
		else if( str == "1000010000100001000011110" ){//l
			this.turnRedOrder( [ 0,5,10,15,20,21,22,23 ] );
		}
		else{
			let strArr: Array<string> = [];
			for( let i: number = 0; i < 5; i++ ){
				let startIndex: number = i * 5;
				strArr[i] = str.substr( startIndex, 5 );
				if( strArr[i] == "11111" ) this.turnRedOrder( [ startIndex, startIndex + 1, startIndex + 2, startIndex + 3, startIndex + 4 ] );
				else if( strArr[i] == "11011" ) this.turnRedOrder( [ startIndex, startIndex + 1, startIndex + 3, startIndex + 4 ] );
			}
		}
	}

	private turnRedOrder( order: Array<number> ): void{
		for( let i: number = 0; i < order.length; i++ ){
			( this.grids[order[i]] as SuperGoalGrid ).showWaveEffect( 100 + 100 * i );
		}
	}

	public stopBlink(){
		for( let i: number = 0; i < this.grids.length; i++ ){
			if( this.grids[i].blink )this.grids[i]["_blink"] = false;
		}
	}
}
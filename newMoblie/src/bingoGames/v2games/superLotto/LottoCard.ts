class LottoCard extends GameCard{

	public static prizeBallMulti: Array<number>;
	public static set prizeBallArray( value : Array<Object> ){
		if( value ){
			LottoCard.prizeBallMulti = [];
			for( let i: number = 0; i < value.length; i++ ){
				LottoCard.prizeBallMulti[value[i]["index"]] = value[i]["multi"];
			}
		}
		else LottoCard.prizeBallMulti = null;
	}

	public constructor( cardId: number ) {
		super( cardId );

		this.addBtn( "btn_orange", 0, 232, this.onIncreaceButtonClick.bind(this), this.cardId, "increase" );
		this.addBtn( "btn_orange", 363, 232, this.onShuffleButtonClick.bind(this), this.cardId, "shuffle" );
		this.addChangeNumberButtons();
	}

	public getCardNumbers(): Array<number>{
		let numbersOnCard: Array<number> = [];
		for( let i: number = 0; i < this.grids.length; i++ ){
			numbersOnCard[i] = this.getNumberAt( i );
		}
		return numbersOnCard;
	}

	public checkNumber( ballIndex: number ): number {
		if( this.grids[LottoBallManager.lottoBallIndex].gridNumber == ballIndex ){
			this.grids[LottoBallManager.lottoBallIndex].showEffect( true );
			return LottoBallManager.lottoBallIndex;
		}
		return -1;
	}

	public showfitEffect( assetName: string, fitIndex: Array<boolean> ){
		let isSequence: boolean = assetName.indexOf( "se" ) >= 0;
		if( isSequence ) super.showfitEffect( assetName, fitIndex );

		this.showLottoFitEffect( assetName, isSequence );

		if( LottoCard.prizeBallMulti ){
			let multi: number = this.getMultiTimes( assetName, fitIndex );
			this.addMultiTimeText( assetName, multi, isSequence );
		}

		let ev: egret.Event = new egret.Event( "cardFitPaytalbe" );
		ev.data = assetName;
		this.dispatchEvent( ev );
	}

	private getMultiTimes( assetName: string, fitIndex: Array<boolean> ): number{
		let multi: number;
		if( fitIndex.length ){
			for( let i: number = 0; i< fitIndex.length; i++ ){
				if( fitIndex[i] ){
					multi = this.countMulti( PayTableManager.payTablesDictionary[assetName].rules[i], assetName );
				}
			}
		}
		else{
			multi = this.countMulti( PayTableManager.payTablesDictionary[assetName].rule, assetName );
		}
		return multi;
	}

	private countMulti( ruleString: string, assetName: string ): number{
		let multi: number = 1;
		for( let i: number = 0; i < ruleString.length; i++ ){
			if( LottoCard.prizeBallMulti[i] && ruleString.charAt( i ) == "1" ){
				if( assetName.indexOf( "se" ) >= 0 ) multi *= LottoCard.prizeBallMulti[i];
				else multi *= LottoCard.prizeBallMulti[i];
			}
		}
		return multi;
	}

	private showLottoFitEffect( assetName: string, isSequence: boolean ){
		let tx: egret.TextField;
		if( isSequence ){
			Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( "bar_sequence" ), 0, 0 );
			tx = Com.addTextAt( this.fitEffectLayer, 15, 14 + BrowserInfo.textUp, 300, 38, 38, true );
			tx.text = assetName.replace( "se", ( GameUIItem.languageText["sequence"][GlobelSettings.language] as string ).toUpperCase() + "  ");
		}
		else{
			Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( "bar_any" ), 0, 165 );
			tx = Com.addTextAt( this.fitEffectLayer, 15, 179 + BrowserInfo.textUp, 300, 38, 38, true );
			tx.text = assetName.replace( "an", ( GameUIItem.languageText["any"][GlobelSettings.language] as string ).toUpperCase() + "  ");
		}
		this.lottoCardText( tx, 0xFDFF33 );
	}

    private addBtn( assets: string, x: number, y: number, callback: Function, index: number, buttonString: string = null ): TouchDownButton{
        let bt: TouchDownButton = Com.addDownButtonAt( this, BingoMachine.getAssetStr( assets ), BingoMachine.getAssetStr( assets + "_press" ), 0, 0, callback, true );
        bt.name = "" + index;
        bt.x = x;
        bt.y = y;

        if( buttonString ){
            let txt: egret.TextField = Com.addTextAt(this, 0, 0, bt.width, bt.height, 35, true, false);
            bt.setText(txt);
            txt.fontFamily = "Righteous";
            txt.stroke = 1;
            txt.text = ( GameUIItem.languageText[buttonString][GlobelSettings.language] as string ).toUpperCase();
        }
        return bt;
    }

	private addChangeNumberButtons(): void{
        let buildUpButton: boolean = true;
		for( let i: number = 0; i < 6; ){
			let sp: TouchDownButton;
			if( buildUpButton ) sp = this.addBtn( "btn_up", 121 * i, 0, this.onNumberUpButtonClick.bind(this), i );
			else sp = this.addBtn( "btn_down", 121 * i, 165, this.onNumberDownButtonClick.bind(this), i );
			if( !buildUpButton )i++;
			buildUpButton = !buildUpButton;
		}
    }
	
	private onIncreaceButtonClick( event: egret.TouchEvent ): void{
		let arr: Array<number> = this.getCardNumbers();
		let differrentNumber: number = arr[0];
		for( let i: number = 1; i < 6; i++ ){
			if( differrentNumber == arr[i] ){
				if( i == 5 ) differrentNumber++;
				else continue;
			}
			else break;
		}
		let num: number = differrentNumber <= 9 ? differrentNumber : 0;
		for( let i: number = 0; i < 6; i++ ){
			arr[i] = num;
		}
		this.getNumbers( arr );
		this.dispatchEvent( new egret.Event( "cardNumberChanged" ) );
	}

    private onShuffleButtonClick( event: egret.TouchEvent ): void{
        let arr: Array<number> = this.getCardNumbers();
        for( let i: number = 0; i < 6; i++ ){
            arr[i] = Math.floor( Math.random() * 10 );
        }
		this.getNumbers( arr );
        this.dispatchEvent( new egret.Event( "cardNumberChanged" ) );
    }

    private onNumberUpButtonClick( event: egret.TouchEvent ): void{
        let index: number = parseInt( event.target.name );
		let num: number = this.getNumberAt( index ) + 1;
		this.grids[index].gridNumber = num <= 9 ? num : 0;
		this.dispatchEvent( new egret.Event( "cardNumberChanged" ) );
    }

    private onNumberDownButtonClick( event: egret.TouchEvent ): void{
        let index: number = parseInt( event.target.name );
        let num: number = this.getNumberAt( index ) - 1;
		this.grids[index].gridNumber = num >= 0 ? num : 9;
		this.dispatchEvent( new egret.Event( "cardNumberChanged" ) );
    }

	private addMultiTimeText( assetName: string, multi: number, isSequence: boolean ){
		if( multi == 3 || multi == 6 ){
			Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( "icon_golden" ), 198, isSequence ? 4 : 94 );
			let tx3: egret.TextField = Com.addTextAt( this.fitEffectLayer, 228, BrowserInfo.textUp + ( isSequence ? 8 : 98 ), 36, 24, 22, true );
			this.lottoCardText( tx3, 0xFFFFFF, "x3" );
		}
		if( multi == 2 || multi == 6 ){
			Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( "icon_silver" ), multi == 6 ? 138 : 198, isSequence ? 4 : 94 );
			let tx2: egret.TextField = Com.addTextAt( this.fitEffectLayer, multi == 6 ? 168 : 228, BrowserInfo.textUp + ( isSequence ? 8 : 98 ), 36, 24, 22, true );
			this.lottoCardText( tx2, 0xFFFFFF, "x2" );
		}
	}

	private lottoCardText( tx: egret.TextField, textColor: number, text: string = null ){
		tx.textAlign = "left";
		tx.fontFamily = "Righteous";
		tx.textColor = textColor;
		tx.stroke = 1.5;
		if( text )tx.text = text;
	}
}
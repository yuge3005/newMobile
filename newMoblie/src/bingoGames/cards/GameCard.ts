class GameCard extends GameUIItem{

	protected bg: egret.Bitmap;

	protected cardText: TextLabel;
	protected betText: TextLabel;

	protected grids: Array<TowerGrid>;
	
	public static clickChangeNumber: boolean = true;

	protected fitEffectLayer: egret.DisplayObjectContainer;
	public static fitEffectNameList: Object;
	public static useRedEffect: boolean;

	protected cardId: number;
	protected numbers: Array<number>;

	public set bet( value: number ){
		if( !this.betText )return;
		this.betText.setText( MuLang.getText("bet") + ": " + Utils.formatCoinsNumber( value ) );
	}

	public constructor( cardId: number ) {
		super();

		this.cardId = cardId;
		this.cacheAsBitmap = true;
		
		this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );
	}

	protected onAdd( event: egret.Event ){
		if( !this.bg )this.bg = Com.addBitmapAt( this, BingoMachine.getAssetStr( GameCardUISettings.bgString ), 0, 0 );
		
		this.fitEffectLayer = new egret.DisplayObjectContainer;
		this.addChild( this.fitEffectLayer );
		
		this.getBgColor();

		if( GameCardUISettings.cardTextRect ){
			this.cardText = this.buildCardTitleText( GameCardUISettings.cardTextRect, GameCardUISettings.cardTextRect.height );
			this.cardText.setText( MuLang.getText( "card" ) + ": " + (this.cardId + 1) );
		}
		if( GameCardUISettings.betTextRect ){
			this.betText = this.buildCardTitleText( GameCardUISettings.betTextRect, GameCardUISettings.betTextRect.height );
			this.betText.setText( MuLang.getText( "bet" ) + ": " );
		}

		if( GameCard.clickChangeNumber ){
			this.touchChildren = false;
			this.touchEnabled = true;
			this.addEventListener( egret.TouchEvent.TOUCH_TAP, this.cardNumber, this );
		}
	}

	private buildCardTitleText( rect: egret.Rectangle, size: number ): TextLabel{
		let tx: TextLabel = Com.addLabelAt( this, rect.x, rect.y, rect.width, rect.height, size, false, true );
		tx.textColor = GameCardUISettings.texColor;
		tx.textAlign = "left";
		tx.scaleX = 0.9;
		if(GameCardUISettings.showTitleShadow) tx.filters = [GameCardUISettings.showTitleShadow];
		return tx;
	}

	public static changeingCard: boolean;

	protected cardNumber( event: egret.TouchEvent ){
		if( GameCard.changeingCard || BingoMachine.inRound ) return;
		BingoMachine.sendCommand( GameCommands.changeNumber );
	}

	public static getCardData( data: Object ){
		GameCardUISettings.dataSetting( data );
		CardGridUISettings.getSettingStrings( data );

		let colors: Object = data["colors"];
		CardGridColorAndSizeSettings.colorSetting( colors );
		GameCardUISettings.colorSetting( colors );

		let size: Object = data["size"];
		CardGridColorAndSizeSettings.sizeSetting( size );
		GameCardUISettings.sizeSetting( size );
	}

	public getBgColor(){
		if( GameCardUISettings.titleColors ){
			GraphicTool.drawRect( this, new egret.Rectangle( 0, 0, this.bg.width, this.bg.height ), GameCardUISettings.cardTitleColor, true, 1 );
		}
	}

	public getNumbers( numbers: Array<number> ){
		this.numbers = numbers;
		let i: number;
		if( !this.grids ){
			this.grids = [];
			for( i = 0; i < numbers.length; i++ ){
				this.grids[i] = this.createGrid( i );
			}
		}
		for( i = 0; i < this.grids.length; i++ ){
			this.grids[i].gridNumber = numbers[i];
		}
	}

	protected createGrid( gridIndex: number ): TowerGrid{
		let grid: TowerGrid = eval( "new CardManager.gridType()" );
		grid.x = GameCardUISettings.gridInitPosition.x + ( gridIndex % GameCardUISettings.gridNumbers.x ) * CardGridColorAndSizeSettings.gridSpace.x;
		grid.y = GameCardUISettings.gridInitPosition.y + Math.floor( gridIndex / GameCardUISettings.gridNumbers.x ) * CardGridColorAndSizeSettings.gridSpace.y;
		if( GameCardUISettings.gridOnTop )this.addChild( grid );
		else this.addChildAt( grid, 0 );
		return grid;
	}

	public checkNumber( ballIndex: number ): number {
		let index: number = this.numbers.indexOf( ballIndex );
		if( index >= 0 )this.grids[index].showEffect( true );
		return index;
	}

	public clearStatus(): void{
		this.clearFitEffect();
		for( let i: number = 0; i < this.grids.length; i++ ){
			this.grids[i].showEffect( false );
		}
		if( this.redEffectArray ) this.redEffectArray = null;
	}

	public getCheckString(): string{
		let str: string = "";
		for( let i: number = 0; i < this.grids.length; i++ ){
			if( this.grids[i].isChecked )str += "1";
			else str += "0";
		}
		return str;
	}

	public blinkAt( index: number ){
		if( this.grids[index].isChecked )throw new Error( "not posible blink grid" );
		this.grids[index].blink = true;
	}

	public stopBlink(){
		for( let i: number = 0; i < this.grids.length; i++ ){
			if( this.grids[i].blink )this.grids[i].blink = false;
		}
	}

	public blink( show: number ){
		if( !this.grids || !this.grids.length )return;
		let isShow: boolean = Boolean( show );
		for( let i: number = 0; i < this.grids.length; i++ ){
			if( this.grids[i].blink )this.grids[i].showBlink( isShow );
		}
	}

	public getNumberAt( index: number ){
		return this.grids[index].gridNumber;
	}

	public clearFitEffect(){
		if( this.fitEffectLayer ){
			this.fitEffectLayer.removeChildren();
			this.addChild( this.fitEffectLayer );
		}
		if( GameCard.useRedEffect ){
			if( this.redEffectArray ){
				for( let j: number = 0; j < this.redEffectArray.length; j++ ){
					if( this.redEffectArray[j] )this.grids[j].showEffect( true );
				}
				this.redEffectArray = null;
			}
		}
	}

	protected redEffectArray: Array<boolean>;

	protected setGridsToRed( str: string ): void{
		if( !this.redEffectArray )this.redEffectArray = [];
		for( let j: number = 0; j < str.length; j++ ){
			if( str[j] == "1" ){
				this.grids[j].showRedEffect();
				this.redEffectArray[j] = true;
			}
		}
	}

	public showfitEffect( assetName: string, fitIndex: Array<boolean> ){
		if( GameCard.useRedEffect ){
			if( fitIndex.length ){
				for( let i: number = 0; i < fitIndex.length; i++ ){
					if( fitIndex[i] ){
						this.setGridsToRed( PayTableManager.payTablesDictionary[assetName].rules[i] );
					}
				}
			}
			else{
				this.setGridsToRed( PayTableManager.payTablesDictionary[assetName].rule );
			}
		}
		
		if( !GameCard.fitEffectNameList )return;

		try{
			let effectImage: egret.Bitmap;
			if( fitIndex.length ){
				for( let i: number = 0; i< fitIndex.length; i++ ){
					if( fitIndex[i] ){
						effectImage = Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName][i] ), 0, 0 );
					}
				}
			}
			else{
				effectImage = Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName] ), 0, 0 );
			}
		}
		catch( e ){
			trace( "showfitEffect ignore:" + assetName );
		}
	}
}
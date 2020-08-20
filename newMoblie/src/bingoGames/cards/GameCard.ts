class GameCard extends GameUIItem{

	protected bg: egret.Bitmap;
	protected static bgString: string;

	protected cardText: TextLabel;
	protected betText: TextLabel;

	protected grids: Array<CardGrid>;

	public static gridNumbers: egret.Point;
	public static gapSize: egret.Point;
	public static gridInitPosition: egret.Point;

	public static titleColors: Array<number>;
	public static bgRound: number;
	public static currentBgColorIndex: number = 0;
	
	public static showTitleShadow: egret.Filter;
	public static cardTextRect: egret.Rectangle;
	public static betTextRect: egret.Rectangle;
	public static clickChangeNumber: boolean;
	public static texColor: number;
	public static firstToUpperCase: boolean = false;

	public static zeroUI: string;

	public static gridOnTop: boolean;
	public static usefork: string;

	protected fitEffectLayer: egret.DisplayObjectContainer;
	public static fitEffectNameList: Object;
	public static useRedEffect: boolean;
	public static fitEffectRedLine: boolean;

	protected cardId: number;
	protected numbers: Array<number>;

	public set bet( value: number ){
		if( !this.betText )return;
		let pre = MuLang.getText("bet");
		if (GameCard.firstToUpperCase) pre = Utils.toFirstUpperCase(pre);
		this.betText.setText( pre + ": " + Utils.formatCoinsNumber( value ) );
	}

	public constructor( cardId: number ) {
		super();

		this.cardId = cardId;
		
		this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );
	}

	protected onAdd( event: egret.Event ){
		if( !this.bg )this.bg = Com.addBitmapAt( this, BingoMachine.getAssetStr( GameCard.bgString ), 0, 0 );
		
		this.fitEffectLayer = new egret.DisplayObjectContainer;
		this.addChild( this.fitEffectLayer );
		
		this.getBgColor();

		if( GameCard.cardTextRect ){
			this.cardText = Com.addLabelAt( this, GameCard.cardTextRect.x, GameCard.cardTextRect.y, GameCard.cardTextRect.width, GameCard.cardTextRect.height, GameCard.cardTextRect.height, false, true );
			this.cardText.textColor = GameCard.texColor;
			this.cardText.textAlign = "left";
			this.cardText.scaleX = 0.9;
			this.cardText.setText( MuLang.getText( "card", GameCard.firstToUpperCase ? 3 : 0 ) + ": " + (this.cardId + 1) );
			
			if (GameCard.showTitleShadow) this.cardText.filters = [GameCard.showTitleShadow];
		}
		if( GameCard.betTextRect ){
			this.betText = Com.addLabelAt( this, GameCard.betTextRect.x, GameCard.betTextRect.y, GameCard.betTextRect.width, GameCard.betTextRect.height, GameCard.betTextRect.height, false, true );
			this.betText.textColor = GameCard.texColor;
			this.betText.textAlign = "left";
			this.betText.scaleX = 0.9;
			this.betText.setText( MuLang.getText( "bet" ) + ": " );

			if (GameCard.showTitleShadow) this.betText.filters = [GameCard.showTitleShadow];
		}

		if( GameCard.clickChangeNumber ){
			this.touchChildren = false;
			this.touchEnabled = true;
			this.addEventListener( egret.TouchEvent.TOUCH_TAP, this.cardNumber, this );
		}
	}

	public static changeingCard: boolean;

	private cardNumber( event: egret.TouchEvent ){
		if( GameCard.changeingCard || BingoMachine.inRound ) return;
		BingoMachine.sendCommand( GameCommands.changeNumber );
	}

	public static getCardData( data: Object ){
		this.titleColors = data["titleColors"];
		this.bgString = data["cardBg"];

		let colors: Object = data["colors"];
		let size: Object = data["size"];
		CardGrid.numberColor = colors["numberColor"];
		CardGrid.numberColorOnEffect = colors["numberColorOnEffect"];
		CardGrid.numberBackgroundColorOnEffect = colors["numberBackgroundColorOnEffect"];
		CardGrid.colorNumberOnEffect = colors["colorNumberOnEffect"];
		CardGrid.colorNumberBackgroundOnEffect = colors["colorNumberBackgroundOnEffect"];

		this.gridNumbers = new egret.Point( size["vertSize"], size["horzSize"] );
		this.gapSize = new egret.Point( size["vertGap"], size["horzGap"] );
		CardGrid.gridSize = new egret.Point( size["numberSizeX"], size["numberSizeY"] );
		CardGrid.gridSpace = new egret.Point( CardGrid.gridSize.x + this.gapSize.x, CardGrid.gridSize.y + this.gapSize.y );
		this.gridInitPosition = new egret.Point( size["numberInitialPositionX"], size["numberInitialPositionY"] );
	}

	public static changeBgColor(){
		this.currentBgColorIndex++;
		if( this.currentBgColorIndex >= this.titleColors.length )this.currentBgColorIndex = 0;
	}

	public getBgColor(){
		if( GameCard.titleColors ){
			GraphicTool.drawRect( this, new egret.Rectangle( 0, 0, this.bg.width, this.bg.height ), GameCard.titleColors[GameCard.currentBgColorIndex], true, 1, GameCard.bgRound );
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

	protected createGrid( gridIndex: number ): CardGrid{
		let grid: CardGrid = eval( "new CardManager.gridType()" );
		grid.x = GameCard.gridInitPosition.x + ( gridIndex % GameCard.gridNumbers.x ) * CardGrid.gridSpace.x;
		grid.y = GameCard.gridInitPosition.y + Math.floor( gridIndex / GameCard.gridNumbers.x ) * CardGrid.gridSpace.y;
		if( GameCard.gridOnTop )this.addChild( grid );
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

	private redEffectArray: Array<boolean>;

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
						if( GameCard.fitEffectRedLine )effectImage.filters = [ MatrixTool.colorMatrixPure( 0xFF0000 ) ];
					}
				}
			}
			else{
				effectImage = Com.addBitmapAt( this.fitEffectLayer, BingoMachine.getAssetStr( GameCard.fitEffectNameList[assetName] ), 0, 0 );
				if( GameCard.fitEffectRedLine )effectImage.filters = [ MatrixTool.colorMatrixPure( 0xFF0000 ) ];
			}
		}
		catch( e ){
			trace( "showfitEffect ignore:" + assetName );
		}
	}

	public setSmallWinTimeAt( gridIndex: number, winTimes: number ): void{
		this.grids[gridIndex].setSmallTime( winTimes );
	}

	public setSmallWinIconAt( gridIndex: number, winIcon: egret.DisplayObjectContainer ): void{
		this.grids[gridIndex].setSmallIcon( winIcon );
	}
}
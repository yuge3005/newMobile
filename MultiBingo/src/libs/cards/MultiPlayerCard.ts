class MultiPlayerCard extends egret.Sprite{

	public uuid: string;
	
	protected bg: egret.Bitmap;
	protected static bgString: string;

	protected grids: Array<MultiPlayerGrid>;

	public static gridNumbers: egret.Point;
	public static gapSize: egret.Point;
	public static gridInitPosition: egret.Point;

	public static useRedEffect: boolean;

	protected cardId: number;
	protected numbers: Array<number>;

	protected _enabled: boolean = true;
	public get enabled(): boolean{
		return this._enabled;
	}
	public set enabled( value: boolean ){
		this._enabled = value;
	}

	public constructor( cardId: number ) {
		super();

		this.cardId = cardId;
		this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );
	}

	protected onAdd( event: egret.Event ){
		if( !this.bg )this.bg = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( MultiPlayerCard.bgString ), 0, 0 );
	}

	public static getCardData( data: Object ){
		this.bgString = data["cardBg"];

		let colors: Object = data["colors"];
		let size: Object = data["size"];
		MultiPlayerGrid.numberColor = colors["numberColor"];
		MultiPlayerGrid.numberColorOnEffect = colors["numberColorOnEffect"];
		MultiPlayerGrid.colorNumberOnEffect = colors["colorNumberOnEffect"];

		this.gridNumbers = new egret.Point( size["vertSize"], size["horzSize"] );
		this.gapSize = new egret.Point( size["vertGap"], size["horzGap"] );
		CardGridColorAndSizeSettings.gridSize = new egret.Point( size["numberSizeX"], size["numberSizeY"] );
		CardGridColorAndSizeSettings.gridSpace = new egret.Point( CardGridColorAndSizeSettings.gridSize.x + this.gapSize.x, CardGridColorAndSizeSettings.gridSize.y + this.gapSize.y );
		this.gridInitPosition = new egret.Point( size["numberInitialPositionX"], size["numberInitialPositionY"] );
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

	protected createGrid( gridIndex: number ): MultiPlayerGrid{
		let grid: MultiPlayerGrid = eval( "new MultiCardLayer.gridType()" );
		let position: egret.Point = MultiPlayerCard.getGridPosition( gridIndex );
		grid.x = position.x;
		grid.y = position.y;
		this.addChild( grid );
		return grid;
	}

	public static getGridPosition( gridIndex: number ): egret.Point{
		let pt: egret.Point = new egret.Point;
		pt.x = MultiPlayerCard.gridInitPosition.x + ( gridIndex % MultiPlayerCard.gridNumbers.x ) * MultiPlayerGrid.gridSpace.x;
		pt.y = MultiPlayerCard.gridInitPosition.y + Math.floor( gridIndex / MultiPlayerCard.gridNumbers.x ) * MultiPlayerGrid.gridSpace.y;
		return pt;
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

	public clearFitEffect(){
		if( MultiPlayerCard.useRedEffect ){
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
		if( MultiPlayerCard.useRedEffect ){
			if( fitIndex.length ){
				for( let i: number = 0; i < fitIndex.length; i++ ){
					if( fitIndex[i] ){
						this.setGridsToRed( MultiPayTable.payTablesDictionary[assetName].rules[i] );
					}
				}
			}
			else{
				this.setGridsToRed( MultiPayTable.payTablesDictionary[assetName].rule );
			}
		}
	}
}
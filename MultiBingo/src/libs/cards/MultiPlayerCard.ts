class MultiPlayerCard extends egret.Sprite{

	public uuid: string;
	
	protected bg: egret.Bitmap;

	protected grids: Array<MultiPlayerGrid>;

	protected cardId: number;
	protected numbers: Array<number>;

	protected _enabled: boolean = true;
	public get enabled(): boolean{
		return this._enabled;
	}
	public set enabled( value: boolean ){
		this._enabled = value;
	}

	protected gridLayer: egret.DisplayObjectContainer;
	protected gridBlinkLayer: egret.DisplayObjectContainer;

	public inTurnMode: boolean;

	public constructor( cardId: number ) {
		super();

		this.cardId = cardId;
		this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );
	}

	protected onAdd( event: egret.Event ){
		if( !this.bg )this.bg = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( GameCardUISettings.bgString ), 0, 0 );
	}

	public static getCardData( data: Object ){
		GameCardUISettings.dataSetting( data );
		CardGridUISettings.getSettingStrings( data );
		let colors: Object = data["colors"];
		CardGridColorAndSizeSettings.colorSetting( colors );

		let size: Object = data["size"];
		CardGridColorAndSizeSettings.sizeSetting( size );
		GameCardUISettings.sizeSetting( size );
	}

	public getNumbers( numbers: Array<number> ){
		this.numbers = numbers;
		let i: number;
		if( !this.grids ){
			this.grids = [];
			this.gridLayer = new egret.DisplayObjectContainer;
			this.gridLayer.cacheAsBitmap = true;
			this.addChild( this.gridLayer );
			this.gridBlinkLayer = new egret.DisplayObjectContainer;
			this.addChild( this.gridBlinkLayer );
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
		this.gridLayer.addChild( grid );
		grid.defaultPosition = position;
		return grid;
	}

	public static getGridPosition( gridIndex: number ): egret.Point{
		let pt: egret.Point = new egret.Point;
		pt.x = GameCardUISettings.gridInitPosition.x + ( gridIndex % GameCardUISettings.gridNumbers.x ) * CardGridColorAndSizeSettings.gridSpace.x;
		pt.y = GameCardUISettings.gridInitPosition.y + Math.floor( gridIndex / GameCardUISettings.gridNumbers.x ) * CardGridColorAndSizeSettings.gridSpace.y;
		return pt;
	}

	public checkNumber( ballIndex: number ): number {
		let index: number = this.numbers.indexOf( ballIndex );
		if( index >= 0 ){
			this.grids[index].showEffect( true );
			this.addGridToCardLayer( this.grids[index] );
		}
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
		this.grids[index].blink = true;
	}

	public stopBlink(){
		for( let i: number = 0; i < this.grids.length; i++ ){
			if( this.grids[i].blink )this.grids[i].blink = false;
		}
	}

	public clearFitEffect(){
		if( GameCardUISettings.useRedEffect ){
			if( this.redEffectArray ){
				for( let j: number = 0; j < this.redEffectArray.length; j++ ){
					if( this.redEffectArray[j] )this.grids[j].showEffect( true );
				}
				this.redEffectArray = null;
			}
		}
	}

	protected addGridToCardLayer( grid: MultiPlayerGrid, toCardLayer: boolean = true ){
		if( toCardLayer ){
			if( this.inTurnMode && this.gridLayer.contains( grid ) ){
				this.gridBlinkLayer.addChild( grid );
			}
		}
		else{
			if( this.gridBlinkLayer.contains( grid ) ){
				this.gridLayer.addChild( grid );
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
		if( GameCardUISettings.useRedEffect ){
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
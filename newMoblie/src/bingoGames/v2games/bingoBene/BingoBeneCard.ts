class BingoBeneCard extends ExtraBlinkCard{

	private waveLayer: egret.DisplayObjectContainer;

	public constructor( cardId: number ) {
		super( cardId );
	}

	public getNumbers( numbers: Array<number> ){
		super.getNumbers( numbers );
		if( !this.waveLayer ){
			this.waveLayer = new egret.DisplayObjectContainer;
			this.addChild( this.waveLayer );
		}
	}

	private redEffectKeys: Object = {};

	public showfitEffect( assetName: string, fitIndex: Array<boolean> ){
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

	protected gridsRedWave( str: string ): void{
		this.redEffectKeys[ str ] = true;

		let firstIndex: number = str.indexOf( "11111" );
		let step: number = 0;
		while( firstIndex >= 0 ){
			str = str.replace( "11111", "" );
			let sp: egret.Sprite = new egret.Sprite;
			Com.addObjectAt( this.waveLayer, sp, GameCard.gridInitPosition.x, GameCard.gridInitPosition.y + CardGrid.gridSpace.y * (step + firstIndex * 0.2) );
			let shp: egret.Shape = new egret.Shape;
			let matrix: egret.Matrix = new egret.Matrix;
			matrix.createBox( 0.25, 1, 0, 100 );
			shp.graphics.beginGradientFill( egret.GradientType.LINEAR, [0xFFFFFF,0xFFFFFF,0xFFFFFF], [0,1,0], [0,128,255], matrix );
			shp.graphics.drawRect( 0, 0, 1300, 77 );
			shp.graphics.endFill();
			sp.addChild( shp );
			shp.x = -1300;
			TweenerTool.tweenTo( shp, { x: 611 }, 800, step * 500 );
			sp.mask = new egret.Rectangle( 0, 0, 611, 77 );
			step++;
			firstIndex = str.indexOf( "11111" );
		}
	}

	public clearStatus(): void{
		super.clearStatus();
		this.redEffectKeys = {};
		this.hasPlayBingoEffect = false;
		this.waveLayer.removeChildren();
	}

	public blink( show: number ){
		if( !this.grids || !this.grids.length )return;
		let isShow: boolean = Boolean( show );
		for( let i: number = 0; i < this.grids.length; i++ ){
			if (this.grids[i].blink) {
				this.grids[i].showBlink(isShow);
				this.addChild(this.grids[i]);
			}
		}
	}

	public showMissDoubline( missNumbers: Object ): void{
		let missNumArray: Array<number> = [];
		for( let line in missNumbers ){
			missNumArray.push( missNumbers[line] );
		}
		if( missNumArray.length == 1 ){
			this.addMissLine( missNumArray[0] );
		}
		else if( missNumArray.length == 2 ){
			if( missNumArray[0] != missNumArray[1] ){
				this.addMissLine( missNumArray[0] );
				this.addMissLine( missNumArray[1] );
			}
			else{
				trace( "miss one for bingo" );
			}
		}
		else{
			console.error( "missNumArray error double_line" );
			trace( missNumbers );
		}
	}

	public addMissLine( gridIndex: number ): void{
		if( this.hasMissColumns_4.indexOf( gridIndex ) < 0 && this.hasMissColumns_2_2 < 0 ) ( this.grids[gridIndex] as BingoBeneGrid ).blinkType = BingoBeneGrid.MISS_DOUBLE_LINE;
		Com.addBitmapAt( this.fitEffectLayer, "mentonGrid_json.purple_line", 15, 69 + CardGrid.gridSpace.y * Math.floor( gridIndex / 5 ) );
	}

	public showMissColumns_3( missNumbers: Object ): void{
		let missNumArray: Array<number> = [];
		let columsNum: number;
		let columsNumArr: Array<number> = [];
		for( let column in missNumbers ){
			if( this.hasMissColumns_4.indexOf( missNumbers[column] ) >= 0 ) continue;
			missNumArray.push( missNumbers[column] );
			columsNum = parseInt( column );
			columsNumArr.push( columsNum );
			( this.grids[missNumbers[column]] as BingoBeneGrid ).blinkType = BingoBeneGrid.MISS_COLUMNS_3;
		}
		if( missNumArray.length == 1 ){
			if( columsNum == 0 || columsNum == 1 || columsNum == 2 ) this.fitEffectLayer.addChildAt( this.addGridCover( "mentonGrid_json.card_green", new egret.Rectangle( GameCard.gridInitPosition.x + CardGrid.gridSpace.x * columsNum, GameCard.gridInitPosition.y, 365, 241 ) ), 0 );
			else{
				console.error( "columsNum error columns_3 columns" );
				trace( columsNum );
			}
		}
		else if( missNumArray.length == 2 ){
			if( columsNumArr[0] == 0 && columsNumArr[1] == 1 ) this.fitEffectLayer.addChildAt( this.addGridCover( "mentonGrid_json.card_green", new egret.Rectangle( GameCard.gridInitPosition.x, GameCard.gridInitPosition.y, 488, 241 ) ), 0 );
			else if( columsNumArr[0] == 0 && columsNumArr[1] == 2 ) this.fitEffectLayer.addChildAt( this.addGridCover( "mentonGrid_json.card_green", new egret.Rectangle( GameCard.gridInitPosition.x, GameCard.gridInitPosition.y, 611, 241 ) ), 0 );
			else if( columsNumArr[0] == 1 && columsNumArr[1] == 2 ) this.fitEffectLayer.addChildAt( this.addGridCover( "mentonGrid_json.card_green", new egret.Rectangle( GameCard.gridInitPosition.x + CardGrid.gridSpace.x, GameCard.gridInitPosition.y, 488, 241 ) ), 0 );
			else{
				console.error( "columsNum error columns_3 columns" );
				trace( columsNumArr );
			}
		}
		else if( missNumArray.length == 0 ){
			trace( "columns_3 and column_4:" );
			trace( missNumbers );
		}
		else{
			console.error( "missNumArray error columns_3" );
			trace( missNumbers );
		}
	}

	private hasMissColumns_4: Array<number> = [];
	private hasMissColumns_2_2: number = -1;

	public showMissColumns_4( missNumbers: Object ): void{
		let missNumArray: Array<number> = [];
		let columsNum: number;
		for( let column in missNumbers ){
			missNumArray.push( missNumbers[column] );
			this.hasMissColumns_4.push( missNumbers[column] );
			columsNum = parseInt( column );
			( this.grids[missNumbers[column]] as BingoBeneGrid ).blinkType = BingoBeneGrid.MISS_COLUMNS_4;
		}
		if( missNumArray.length == 1 ){
			if( columsNum == 0 || columsNum == 1 ) this.fitEffectLayer.addChild( this.addGridCover( "mentonGrid_json.card_pink", new egret.Rectangle( GameCard.gridInitPosition.x + CardGrid.gridSpace.x * columsNum, GameCard.gridInitPosition.y, 488, 241 ) ) );
			else{
				console.error( "columsNum error double_line" );
				trace( columsNum );
			}
		}
		else if( missNumArray.length == 2 ){
			this.fitEffectLayer.addChild( this.addGridCover( "mentonGrid_json.card_pink", new egret.Rectangle( GameCard.gridInitPosition.x, GameCard.gridInitPosition.y, 611, 241 ) ) );
		}
		else{
			console.error( "missNumArray error columns_4" );
			trace( missNumbers );
		}
	}

	public showMissColumns_2_2( missNumber: number ): void{
		this.hasMissColumns_2_2 = missNumber;
		( this.grids[missNumber] as BingoBeneGrid ).blinkType = BingoBeneGrid.MISS_COLUMNS_2_2;
		this.fitEffectLayer.addChild( this.addGridCover( "mentonGrid_json.card_red", new egret.Rectangle( GameCard.gridInitPosition.x, GameCard.gridInitPosition.y, 242, 241 ) ) );
		this.fitEffectLayer.addChild( this.addGridCover( "mentonGrid_json.card_red", new egret.Rectangle( GameCard.gridInitPosition.x + CardGrid.gridSpace.x * 3, GameCard.gridInitPosition.y, 242, 241 ) ) );
	}

	public showMissBingo( missNumber: number = -1 ): void{
		if( missNumber >= 0 )( this.grids[missNumber] as BingoBeneGrid ).blinkType = BingoBeneGrid.MISS_BINGO;
		this.fitEffectLayer.addChild( this.addGridCover( "mentonGrid_json.pizza", new egret.Rectangle( 0, 0, 669, 315 ), true ) );
	}

	private addGridCover( assetName: string, rect: egret.Rectangle, isBingo: boolean = false ): egret.DisplayObjectContainer{
		let sp: egret.Bitmap = new egret.Bitmap;
		sp.fillMode = egret.BitmapFillMode.REPEAT;
		sp.texture = RES.getRes( assetName );
		sp.width = rect.width;
		sp.height = rect.height;
		sp.x = rect.x;
		sp.y = rect.y;
		sp.filters = [ MatrixTool.colorMatrixLighter( 0.4 ) ];
		let cover: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		cover.addChild( sp );

		if( isBingo ){
			if( this.hasPlayBingoEffect ){
				sp.filters = [];
			}
			else{
				sp.filters = [ MatrixTool.colorMatrixLighter( 1 ) ];
				TweenerTool.tweenTo( sp, { alpha: 1 }, 200, 0, this.bingoShowOff.bind( this, sp ), { alpha: 0 } );
				this.hasPlayBingoEffect = true;
			}
			return cover;
		}

		for( let i: number = 0; i < Math.floor( rect.width / 119 ); i++ ){
			for( let j: number = 0; j < Math.floor( rect.height / 77 ); j++ ){
				let grid: egret.Bitmap = Com.addBitmapAt( cover, assetName, CardGrid.gridSpace.x * i + rect.x, CardGrid.gridSpace.y * j + rect.y );
				grid.fillMode = egret.BitmapFillMode.REPEAT;
				grid.width = CardGrid.gridSize.x;
				grid.height = CardGrid.gridSize.y;
			}
		}
		return cover;
	}

	private hasPlayBingoEffect: boolean;

	private bingoShowOff( sp: egret.Bitmap ){
		if( !sp.parent ) return;
		let maskSp: egret.Shape = new egret.Shape;
		sp.parent.addChild( maskSp );
		GraphicTool.drawRect( maskSp, new egret.Rectangle( sp.x, sp.y, sp.width, sp.height ), 0xFFFFFF );
		sp.filters = [];
		TweenerTool.tweenTo( maskSp, { alpha: 0 }, 200 );
	}

	public clearFitEffect(){
		super.clearFitEffect();
		this.hasMissColumns_4 = [];
		this.hasMissColumns_2_2 = -1;
	}
}
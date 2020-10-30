class TowerCard extends GameCard{

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		this.betText = new TextLabel;
		this.betText.visible = false;

		if( GameCard.clickChangeNumber ){
			this.touchChildren = false;
			this.touchEnabled = true;
			this.addEventListener( egret.TouchEvent.TOUCH_TAP, this.cardNumber, this );
		}
	}

	private static lineIndexCounter: Array<egret.Point>;

	private static countLineIndexs(): void{
		let line: number = 0;
		let lineCount: number = 1;
		let currentLineCount: number = 0;
		this.lineIndexCounter = [];
		for( let i: number = 0; i < 15; i++ ){
			this.lineIndexCounter.push( new egret.Point( currentLineCount++, line ) );
			if( currentLineCount >= lineCount ){
				line++;
				currentLineCount = 0;
				lineCount++;
			}
		}
	}

	protected createGrid( gridIndex: number ): TowerGrid{
		let grid: TowerGrid = new TowerGrid();
		if( !TowerCard.lineIndexCounter ) TowerCard.countLineIndexs();
		let indexPt: egret.Point = TowerCard.lineIndexCounter[gridIndex];
		let column: number = indexPt.x;
		let line: number = indexPt.y;
		grid.x = GameCardUISettings.gridInitPosition.x + ( ( 4 - line ) * 0.5 + column ) * CardGridColorAndSizeSettings.gridSpace.x;
		grid.y = GameCardUISettings.gridInitPosition.y + line * CardGridColorAndSizeSettings.gridSpace.y;
		if( GameCard.gridOnTop )this.addChild( grid );
		else this.addChildAt( grid, 0 );
		return grid;
	}

	public stopBlink(){
		for( let i: number = 0; i < this.grids.length; i++ ){
			if( this.grids[i].blink ){
				this.grids[i].blink = false;
				this.grids[i].showBlink( true );
			}
		}
	}
}
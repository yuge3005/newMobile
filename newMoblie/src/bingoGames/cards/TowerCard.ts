class TowerCard extends GameCard{

	public get enabled(): boolean{
		return this._enabled;
	}
	public set enabled( value: boolean ){
		this._enabled = value;
		if( value ){
			if( this.disabledBg && this.contains( this.disabledBg ) )this.removeChild( this.disabledBg );
			for( let i: number = 0; i < this.grids.length; i++ ){
				this.grids[i].visible = true;
			}
		}
		else{
			this.addChild( this.disabledBg );
			for( let i: number = 0; i < this.grids.length; i++ ){
				this.grids[i].visible = false;
			}
		}
	}

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		this.disabledBg = Com.createBitmapByName( GameCard.disabledBgString );
		this.betText = this.addGameText( GameCard.betTexPosition.x, GameCard.betTexPosition.y, GameCard.texSize, GameCard.texColor, "bet", false, 200, ": " );
		this.betText.visible = false;
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

	protected createGrid( gridIndex: number ): CardGrid{
		let grid: CardGrid = new TowerGrid();
		if( !TowerCard.lineIndexCounter ) TowerCard.countLineIndexs();
		let indexPt: egret.Point = TowerCard.lineIndexCounter[gridIndex];
		let column: number = indexPt.x;
		let line: number = indexPt.y;
		grid.x = GameCard.gridInitPosition.x + ( ( 4 - line ) * 0.5 + column ) * CardGrid.gridSpace.x;
		grid.y = GameCard.gridInitPosition.y + line * CardGrid.gridSpace.y;
		if( GameCard.gridOnTop )this.addChild( grid );
		else this.addChildAt( grid, 0 );
		return grid;
	}
}
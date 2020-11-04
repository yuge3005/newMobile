class CopaSquareBar extends egret.DisplayObjectContainer{

	private squareGridsOnCard: Array<egret.Shape>;
	private squareNumbers: Array<number>;
	
	public constructor() {
		super();

		this.squareGridsOnCard = [];

		for( let i: number = 0; i < 60; i++ ){
            let indexPt: egret.Point = GameCardUISettings.getIndexOnCard( i );
            let yIndex: number = indexPt.y % 5;
            if( yIndex > 3 || yIndex < 1 ){
                this.squareGridsOnCard[i] = null;
                continue;
            }
            this.squareGridsOnCard[i] = new egret.Shape;
            GraphicTool.drawRect( this.squareGridsOnCard[i], new egret.Rectangle( 0, 0, CardGridColorAndSizeSettings.gridSize.x, CardGridColorAndSizeSettings.gridSize.y ), 0xCCCC00 );
            this.addChild( this.squareGridsOnCard[i] );
            GameCardUISettings.setTargetToPositionOnCard( this.squareGridsOnCard[i], indexPt.x, indexPt.y );
        }

        this.alpha = 0.25;
		this.cacheAsBitmap = true;
	}

	public reShowSquareNumbers(): void{
        for( let i: number = 0; i < 60; i++ ){
            let indexPt: egret.Point = GameCardUISettings.getIndexOnCard( i );
            let yIndex: number = indexPt.y % 5;
            if( yIndex > 3 || yIndex < 1 ){
                continue;
            }
            this.squareGridsOnCard[i].visible = true;
        }
    }

	public getSquareNumbers(): void{
        this.squareNumbers = [];
        for( let i: number = 0; i < 60; i++ ){
            let indexPt: egret.Point = GameCardUISettings.getIndexOnCard( i );
            let yIndex: number = indexPt.y % 5;
            if( yIndex > 3 || yIndex < 1 ){
                this.squareNumbers[i] = 0;
                continue;
            }
            this.squareNumbers[i] = GameCardUISettings.numberAtCard( indexPt.x, indexPt.y );
        }
    }

	public showLastBall( ballIndex: number ): void{
		let squareIndex: number = this.squareNumbers.indexOf( ballIndex );
		if( squareIndex >= 0 ){
			this.squareGridsOnCard[squareIndex].visible = false;
		}
	}
}
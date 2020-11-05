class CopaBombBar extends egret.DisplayObjectContainer{

    public needBombOnCard: boolean;
    private bombNumbers: Array<number>;
    private bombs: Array<egret.DisplayObjectContainer>;
    private bombsTxts: Array<egret.BitmapText>;
	private bombExplode: Array<egret.MovieClip>;

	public constructor() {
		super();

		this.getBombNumbers();

		this.bombs = [];
        this.bombsTxts = [];
        this.bombExplode = [];
        for( let i: number = 0; i < GameCardUISettings.cardPositions.length; i++ ){
            this.bombs[i] = new egret.DisplayObjectContainer;
            Com.addObjectAt( this, this.bombs[i], GameCardUISettings.cardPositions[i]["x"], GameCardUISettings.cardPositions[i]["y"] );

            this.bombExplode[i] = Com.addMovieClipAt( this.bombs[i], MDS.mcFactory, "bomb_02", 78, - 55 );
            this.bombExplode[i].gotoAndStop(1);
        }
	}

	public getBombNumbers(): void{
        this.bombNumbers = [];
        for( let i: number = 0; i < 4; i++ ){
            this.bombNumbers[i] = GameCardUISettings.numberAtCard( i, 7 );
        }
    }

	public explode( cardId: number ){
		if( this.bombs[cardId].numChildren == 2 )this.bombs[cardId].removeChildAt( 1 );
        this.bombExplode[ cardId ].gotoAndPlay( 1, 1 );
	}

	public checkBomb( ballIndex: number ): number{
		return this.bombNumbers.indexOf( ballIndex );
	}

	public showBomb( isNeedBomb: boolean ): void{
		this.needBombOnCard = isNeedBomb;
		for( let i: number = 0; i < 4; i++ ){
			this.bombs[i].removeChildren();
		}

		if( isNeedBomb ){
			for( let i: number = 0; i < 4; i++ ){
				this.bombs[i].addChild( this.bombExplode[i] );
				this.bombsTxts[i] = MDS.addBitmapTextAt( this.bombs[i], "Arial Black_fnt", 235, 95 - CardGridColorAndSizeSettings.defaultNumberSize * 0.125, "center", CardGridColorAndSizeSettings.defaultNumberSize, CardGridColorAndSizeSettings.numberColor, CardGridColorAndSizeSettings.gridSize.x, CardGridColorAndSizeSettings.gridSize.y );
				this.bombsTxts[i].text = "" + this.bombNumbers[i];
				this.bombsTxts[i].verticalAlign = "middle";
				this.bombExplode[i].gotoAndStop(1);
			}
		}
	}
}
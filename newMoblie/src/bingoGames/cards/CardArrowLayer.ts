class CardArrowLayer extends egret.DisplayObjectContainer{
	private arrowMcs: Array<Array<egret.MovieClip>>;

	public constructor( mcf: egret.MovieClipDataFactory, assetName: string, cardPositions: Array<Object>, offsetPt: egret.Point, disY: number, scaleX: number = 1 ) {
		super();

		this.arrowMcs = [];
		for( let i: number = 0; i < cardPositions.length; i++ ){
			this.arrowMcs[i] = [];
			for( let j: number = 0; j < 3; j++ ){
				let arrowAnimation: egret.MovieClip = this.buildArrowByPoint( mcf, assetName, cardPositions[i], j, offsetPt, disY, scaleX );
				arrowAnimation.stop();
				arrowAnimation.visible = false;
				this.arrowMcs[i][j] = arrowAnimation;
			}
		}
	}

	protected buildArrowByPoint( mcf: egret.MovieClipDataFactory, assetName: string, cardPosition: Object, j: number, offsetPt: egret.Point, disY: number, scaleX: number ): egret.MovieClip{
		let arrowAnimation: egret.MovieClip = Com.addMovieClipAt( this, mcf, assetName, cardPosition["x"] + offsetPt.x, cardPosition["y"] + disY * j + offsetPt.y );
		if( scaleX != 1 ) arrowAnimation.scaleX = scaleX;
		return arrowAnimation;
	}

	public arrowBlink( resultList: Array<Object> ){
		this.clearArrow();
		for( let i: number = 0; i < 4; i++ ){
            if( resultList[i]["line"] && resultList[i]["line"]["unfitIndexs"] ){
                for( let line in resultList[i]["line"]["unfitIndexs"] ){
					let arrow: egret.MovieClip = this.arrowMcs[i][line];
					arrow.visible = true;
					arrow.gotoAndPlay(1);
                }
            }
        }
	}

	public clearArrow(): void{
        for( let i: number = 0; i < 4; i++ ){
            for( let j: number = 0; j < 3; j++ ){
                let arrow: egret.MovieClip = this.arrowMcs[i][j];
                arrow.visible = false;
                arrow.stop();
            }
        }
    }
}
class DoubleBingoCardArrowLayer extends CardArrowLayer{
	public constructor( mcf: egret.MovieClipDataFactory, assetName: string, offsetPt: egret.Point, disY: number ) {
		super( mcf, assetName, offsetPt, disY );
	}

	protected buildArrowByPoint( mcf: egret.MovieClipDataFactory, assetName: string, cardPosition: Object, j: number, offsetPt: egret.Point, disY: number, scaleX: number ): egret.MovieClip{
		let isLeft: boolean = cardPosition["x"] < 1000;
		let arrowAnimation: egret.MovieClip = Com.addMovieClipAt( this, mcf, isLeft ? "arrowAnimationDoubleBingo_left" : "arrowAnimationDoubleBingo_right", ( isLeft ? 170 : 1795 ), 1200 );
		if( scaleX != 1 ) arrowAnimation.scaleX = scaleX;
		arrowAnimation.name = cardPosition["y"] + disY * j + offsetPt.y + "";
		return arrowAnimation;
	}

	public arrowBlink( resultList: Array<Object> ){
		this.clearArrow();
		for( let i: number = 0; i < 4; i++ ){
            if( resultList[i]["line"] && resultList[i]["line"]["unfitIndexs"] ){
                for( let line in resultList[i]["line"]["unfitIndexs"] ){
					let arrow: egret.MovieClip = this.arrowMcs[i][line];
					egret.Tween.removeTweens( arrow );
					if( !arrow.visible )arrow.visible = true;
					TweenerTool.tweenTo( arrow, { y: Number(arrow.name) }, 300, 0, null, null, egret.Ease.bounceOut );
					arrow.gotoAndPlay(1);
                }
            }
        }
	}

	public clearArrow(): void{
        for( let i: number = 0; i < 4; i++ ){
            for( let j: number = 0; j < 3; j++ ){
                let arrow: egret.MovieClip = this.arrowMcs[i][j];
				TweenerTool.tweenTo( arrow, { y: 1200 }, 300, 0, null, null, egret.Ease.bounceIn );
				arrow.stop();
            }
        }
    }
}
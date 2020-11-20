class DoubleBingoCardArrowLayer extends CardArrowLayer{
	public constructor( mcf: egret.MovieClipDataFactory, assetName: string, offsetPt: egret.Point, disY: number ) {
		super( mcf, assetName, offsetPt, disY );
	}

	protected buildArrowByPoint( mcf: egret.MovieClipDataFactory, assetName: string, cardPosition: Object, j: number, offsetPt: egret.Point, disY: number, scaleX: number ): egret.MovieClip{
		let isLeft: boolean = cardPosition["x"] < 1000;
		let arrowAnimation: egret.MovieClip = Com.addMovieClipAt( this, mcf, isLeft ? "arrowAnimationDoubleBingo_left" : "arrowAnimationDoubleBingo_right", ( isLeft ? 170 : 1795 ), 200 );
		if( scaleX != 1 ) arrowAnimation.scaleX = scaleX;
		return arrowAnimation;
	}
}
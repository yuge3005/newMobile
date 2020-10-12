class BlackStarCardArrowLayer extends CardArrowLayer{
	
	public constructor( mcf: egret.MovieClipDataFactory, assetName: string, cardPositions: Array<Object>, offsetPt: egret.Point, disY: number ) {
		super( mcf, assetName, cardPositions, offsetPt, disY );
	}

	protected buildArrowByPoint( mcf: egret.MovieClipDataFactory, assetName: string, cardPosition: Object, j: number, offsetPt: egret.Point, disY: number, scaleX: number ): egret.MovieClip{
		let isLeft: boolean = cardPosition["x"] < 1000;
		let arrowAnimation: egret.MovieClip = Com.addMovieClipAt( this, mcf, isLeft ? "blackStar_arrow_left" : "blackStar_arrow_right", cardPosition["x"] + ( isLeft ? -25 : 688 ), cardPosition["y"] + disY * j + offsetPt.y );
		if( scaleX != 1 ) arrowAnimation.scaleX = scaleX;
		return arrowAnimation;
	}
}
class MaraBallLayer extends Multi75BallLayer{

	protected get ballMoveDuration(): number{
		return this.lafayetteDelay ? 250 : 930;
	}

	protected get ballStartScale(): number{
		return this.lafayetteDelay ? this.ballBigSize : 0.2;
	}
	
	public constructor() {
		super();
		this.ballOffsetY = 2;
		this.ballNormalSize = 110 / 120;
		this.ballBigSize = 110 / 120;
	}

	protected setBallNumber( ball: egret.Sprite, num: number, ballTextColor: number, offsetX: number = 0 ){
		super.setBallNumber( ball, num, ballTextColor, offsetX );
		this.setBallLetter( ball, num, 60, 25, 15 );
	}

	public getABall( index: number ): egret.Sprite{
		return this.buildBallWithIndex( index );
	}

	private lafayetteEbs: Array<number>;
	private lafayetteDelay: boolean;

	public lafayette( lafayetteEbs: Array<number> ){
		this.lafayetteEbs = lafayetteEbs;
	}

	public runExtra( extraBall: number ){
		if( this.lafayetteEbs && this.lafayetteEbs.length ) {
			this.lafayetteEbs.push( extraBall );
			this.lafayetteDelay = true;
			this.delayRunLafayetteEbs();
		}
		else{
			super.runExtra( extraBall );
		}
	}

	private nextDelayLafayetteId: number;

	private delayRunLafayetteEbs(): void{
		this.runLafayetteEb();
		if( this.lafayetteEbs.length )this.nextDelayLafayetteId = setTimeout( this.delayRunLafayetteEbs.bind(this), 300 );
		else{
			this.lafayetteDelay = false;
			clearTimeout( this.nextDelayLafayetteId );
		}
	}

	private runLafayetteEb(){
		let lastBall: egret.Sprite = this.getChildAt(0) as egret.Sprite;
		let pt: egret.Point = new egret.Point( lastBall["pts"][0].x, lastBall["pts"][0].y );
		lastBall["pts"].unshift( pt );
		var ballNumber: number = this.lafayetteEbs.shift();
		var ballInfo: Object = this["ballsData"][0];
		var path: Array<string> = ballInfo["path"];
		var pts: Array<egret.Point> = [];
		pts[0] = new egret.Point( 223, -40 );
		for( var i: number = 2; i < path.length; i++ ){
			pts[i-1] = new egret.Point( path[i]["x"], path[i]["y"] );
		}
		var sp: egret.Sprite = this.buildBallWithIndex( ballNumber );
		sp["pts"] = pts;
		if( this.lafayetteEbs.length ) sp.filters = [ new egret.GlowFilter( 0xFF0000, 0.5, 15, 15, 2, 1 ) ];
		Com.addObjectAt( this, sp, pts[0]["x"], pts[0]["y"] );
		this.addChildAt( sp, 0 );
		
		this.moveToNextPoint( lastBall, lastBall["pts"] );
		MultiCardLayer.getBall( ballNumber );
		MultiPlayerMachine.runningBall( ballNumber );
	}
}
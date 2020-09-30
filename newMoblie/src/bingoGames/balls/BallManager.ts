class BallManager extends egret.Sprite{

	private static balls: Array<Object>;
	private ballSize: number;
	private ballTextSize: number;
	public static textBold: boolean;

	private ballIndexs: Array<number>;
	private extraBalls: Array<number>;
	private ballOrder: number;

	public needLightCheck: boolean;

	public static normalBallInterval: number = 100;
	public static ballOffsetY: number = 0;
	public static rotateBall: boolean;

	private lightResult: Array<Object>;

	public constructor() {
		super();
	}

	public getBallSettings( balls: Array<Object>, ballSize: number, ballTextSize: number ): void{
		let newballs: Array<Object> = [];
		for( let i: number = 0; i < balls.length; i++ )	{
			newballs[i] = {}
			for( let ob in balls[i] ) newballs[i][ob] = balls[i][ob];
		}
		BallManager.balls = newballs;
		BingoBall.ballUIs = [];
		this.ballSize = ballSize;
		this.ballTextSize = ballTextSize;
	}

	public clearBalls(): void{
		this.removeChildren();
	}

	public onRemove(){
		clearTimeout( this.nextDelayId );
	}

	public runBalls( balls: Array<number> ):void{
		this.clearBalls();
		this.lightResult = null;
		this.ballIndexs = balls;
		this.extraBalls = [];
		this.ballOrder = 0;
		this.beginRun();
	}

	public runCutBalls( balls: Array<number> ): void{
		this.ballIndexs = this.ballIndexs.concat( balls );
		this.beginRun();
	}

	public runExtra( extraBall: number ){
		this.ballIndexs.push( extraBall );
		this.beginRun();
	}

	public runMissExtra( missExtra: Array<number> ){
		if( !missExtra )return;
		while( missExtra.length ) this.ballIndexs.push( missExtra.shift() );
		while( this.ballIndexs.length ){
			this.runMissExtraBall();
		}
	}

	private beginRun():void{
		if( !this.ballIndexs.length ){
			BingoMachine.endBallRunning();
			return;
		}
		this.runNextBall();

		let lightResult: Array<Object>;
		let newFit: boolean;
		let isLastBall: boolean = this.ballIndexs.length == 0;
		if( this.needLightCheck || isLastBall ) lightResult = BingoMachine.betweenBallRunning();
		if( lightResult ){
			newFit = this.recordlightResult( lightResult );
		}

		if( newFit ){
			BingoMachine.runningAnimation( this.delayRunNextBall.bind( this ), lightResult, isLastBall );
		}
		else this.delayRunNextBall();
	}

	public stopBallRunning(): void{
		while( this.ballIndexs.length > 1 ){
			this.runNextBall();
		}
	}

	private runNextBall(): void{
		var index: number = this.ballIndexs.shift();
		var ballInfo: Object = BallManager.balls[this.ballOrder++];
		var path: Array<string> = ballInfo["path"];
		var pts: Array<egret.Point> = [];
		for( var i: number = 0; i < path.length; i++ ){
			pts[i] = new egret.Point( path[i]["x"], path[i]["y"] );
		}
		var sp: BingoBall = this.buildBallWithIndex( index );
		this.addChild( sp );
		sp.startRun( pts );
		CardManager.getBall( index );
		BingoMachine.runningBall( index );
	}

	private runMissExtraBall(): void{
		var index: number = this.ballIndexs.shift();
		var ballInfo: Object = BallManager.balls[this.ballOrder++];
		var path: Array<string> = ballInfo["path"];
		var lstPtObj: Object = path[path.length-1];
		var ptLast: egret.Point = new egret.Point( lstPtObj["x"], lstPtObj["y"] );
		var sp: BingoBall = this.buildBallWithIndex( index );
		Com.addObjectAt( this, sp, ptLast.x, ptLast.y );
		let cross: egret.Shape = new egret.Shape;
		let a: number = this.ballSize / sp.scaleX;
		cross.graphics.lineStyle( Math.floor( a * 0.07 ), 0xFF0000 );
		let startOffset: number = ( 2 - Math.SQRT2 ) * 0.25 * a;
		cross.graphics.moveTo( startOffset, startOffset );
		cross.graphics.lineTo( sp.width - startOffset, sp.height - startOffset );
		cross.graphics.moveTo( sp.width - startOffset, startOffset );
		cross.graphics.lineTo( startOffset, sp.height - startOffset );
		sp.filters = [ MatrixTool.colorMatrixLighter( 0.5 ) ];
		sp.addChild( cross );
	}

	private nextDelayId: number;

	private delayRunNextBall(): void{
		this.nextDelayId = setTimeout( this.beginRun.bind(this), BallManager.normalBallInterval );
	}

	private recordlightResult( lightResult: Array<Object> ): boolean{
		if( !this.lightResult || this.lightResult.length == 0 ){
			this.lightResult = lightResult;
			return true;
		}
		for( let i: number = 0; i < lightResult.length; i++ ){
			for( let ob in lightResult[i] ){
				if( !this.lightResult[i][ob] || lightResult[i][ob].length != this.lightResult[i][ob].length ){
					this.lightResult = lightResult;
					return true;
				}
			}
		}

		return false;
	}

	protected setBallBg( ball: egret.Sprite, assetName: string ){
		Com.addBitmapAt( ball, BingoMachine.getAssetStr( assetName ), 0, 0 );
	}

	protected buildBallWithIndex( num : number = 0, scaleToGame: Boolean = true ): BingoBall{
		let index: number = num - 1;
		if( !BingoBall.ballUIs[index] ){
			BingoBall.ballUIs[index] = this.buildBallUIWithIndex( index, num );
		}
		return new BingoBall( index, scaleToGame ? this.ballSize : 0 );
	}

	private buildBallUIWithIndex( index : number, num : number = 0 ): egret.Sprite{
		var ballObj: Object = BallManager.balls[index];
		var ball: egret.Sprite = new egret.Sprite();
		this.setBallBg( ball, ballObj["ui"] );
		var tx: egret.TextField = new egret.TextField;
		tx.width = ball.width;
		tx.size = this.ballTextSize;
		tx.bold = true;
		tx.textAlign = "center";
		tx.textColor = Number( ballObj["color"] );
		tx.text = "" + ( num ? num : index + 1 );
		tx.y = ball.height - tx.textHeight >> 1;
		if( BallManager.textBold ){
			tx.fontFamily = "Arial Black";
		}
		if( ballObj["offsetX"] )tx.x = ballObj["offsetX"];
		if( BallManager.ballOffsetY )tx.y += BallManager.ballOffsetY;
		ball.addChild( tx );
		return ball;
	}

	public getABall( index: number ): BingoBall{
		return this.buildBallWithIndex( index );
	}

	public getABigBall( index: number ): BingoBall{
		return this.buildBallWithIndex( index, false );
	}

	public static getBallLastPosition( index: number ): egret.Point{
		let ballObject: Object = this.balls[ index ];
        let ballPath: Array<Object> = ballObject["path"];
        let ballPositionObject: Object = ballPath[ballPath.length-1];
		return new egret.Point( ballPositionObject["x"], ballPositionObject["y"] );
	}
}
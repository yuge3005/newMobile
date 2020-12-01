class MultiGameBallLayer extends egret.Sprite{

	private ballsData: Array<Object>;
	private ballSize: number;
	private ballTextSize: number;

	private ballIndexs: Array<number>;
	private ballOrder: number;

	protected ballOffsetY: number;

	public constructor() {
		super();
	}

	public getBallSettings( balls: Array<Object>, ballSize: number, ballTextSize: number ): void{
		let newballs: Array<Object> = [];
		for( let i: number = 0; i < balls.length; i++ )	{
			newballs[i] = {}
			for( let ob in balls[i] ) newballs[i][ob] = balls[i][ob];
		}
		this.ballsData = newballs;
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
		var numIndex: number;
		this.ballIndexs = balls;
		this.ballOrder = 0;
		this.beginRun();
	}

	public runExtra( extraBall: number ){
		this.ballIndexs.push( extraBall );
		this.beginRun();
	}

	private beginRun():void{
		if( !this.ballIndexs.length ){
			MultiPlayerMachine.endBallRunning();
			return;
		}
		this.runNextBall();
		this.delayRunNextBall();
	}

	public stopBallRunning(): void{
		while( this.ballIndexs.length > 1 ){
			this.runNextBall();
		}
	}

	private runNextBall(): void{ 
		var ballNumber: number = this.ballIndexs.shift();
		var ballInfo: Object = this.ballsData[this.ballOrder++];
		var path: Array<string> = ballInfo["path"];
		var pts: Array<egret.Point> = [];
		for( var i: number = 0; i < path.length; i++ ){
			pts[i] = new egret.Point( path[i]["x"], path[i]["y"] );
		}
		var sp: egret.Sprite = this.buildBallWithIndex( ballNumber );
		Com.addObjectAt( this, sp, pts[0]["x"], pts[0]["y"] );
		this.moveToNextPoint( sp, pts );
		MultiCardLayer.getBall( ballNumber );
		MultiPlayerMachine.runningBall( ballNumber );
	}

	private nextDelayId: number;

	private delayRunNextBall(): void{
		this.nextDelayId = setTimeout( this.beginRun.bind(this), 15 );
	}

	protected setBallBg( ball: egret.Sprite, assetName: string ){
		Com.addBitmapAt( ball, MultiPlayerMachine.getAssetStr( assetName ), 0, 0 );
	}

	protected setBallNumber( ball: egret.Sprite, num: number, ballTextColor: number, offsetX: number = 0 ){
		var tx: egret.TextField = new egret.TextField;
		tx.width = ball.width;
		tx.size = this.ballTextSize;
		tx.bold = true;
		tx.textAlign = "center";
		tx.textColor = Number( ballTextColor );
		tx.text = "" + num;
		tx.y = ball.height - tx.textHeight >> 1;
		if( offsetX )tx.x = offsetX;
		if( this.ballOffsetY )tx.y += this.ballOffsetY;
		ball.addChild( tx );
	}

	protected buildBallWithIndex( num : number = 0 ): egret.Sprite{
		let index: number = num - 1;
		var ballObj: Object = this.ballsData[index];
		var ball: egret.Sprite = new egret.Sprite();
		this.setBallBg( ball, ballObj["ui"] );
		ball.scaleX = ball.scaleY = this.ballSize / ball.height;
		this.setBallNumber( ball, num, ballObj["color"], ballObj["offsetX"] );
		return ball;
	}

	protected moveToNextPoint(sp:egret.Sprite, pts:Array<egret.Point>):void{

	}
}
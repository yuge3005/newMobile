class BlackoutBallLayer extends Multi75BallLayer{
	
	protected get ballStartScale(): number{
		return 0.05;
	}
	
	public constructor() {
		super();
		this.ballOffsetY = 22;
		this.ballNormalSize = 75 / 188;
		this.ballBigSize = 109 / 188;
	}

	protected setBallNumber( ball: egret.Sprite, num: number, ballTextColor: number, offsetX: number = 0 ){
		super.setBallNumber( ball, num, ballTextColor, offsetX );
		this.setBallLetter( ball, num, 94, 48, 30 );
	}

	public buildBigBallForGold( ballNumber: number ): egret.Sprite{
		let ball: egret.Sprite = this.buildBallWithIndex( ballNumber );
		ball.scaleX = ball.scaleY = 1;
		return ball
	}
}
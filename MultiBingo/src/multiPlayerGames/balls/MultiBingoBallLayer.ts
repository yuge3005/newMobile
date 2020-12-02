class MultiBingoBallLayer extends Multi75BallLayer{
	
	public constructor() {
		super();
		this.ballOffsetY = 12;
		this.ballNormalSize = 37/32;
		this.ballBigSize = 7/4;
	}

	protected setBallNumber( ball: egret.Sprite, num: number, ballTextColor: number, offsetX: number = 0 ){
		super.setBallNumber( ball, num, ballTextColor, offsetX );
		this.setBallLetter( ball, num, 64, 28, 30 );
	}
}
class MultiBingoBallLayer extends Multi75BallLayer{
	
	public constructor() {
		super();
		this.ballOffsetY = 12;
		this.ballNormalSize = 1;
		this.ballBigSize = 1.2;
	}

	protected setBallNumber( ball: egret.Sprite, num: number, ballTextColor: number, offsetX: number = 0 ){
		super.setBallNumber( ball, num, ballTextColor, offsetX );
		this.setBallLetter( ball, num, 38, 20, 15 );
	}
}
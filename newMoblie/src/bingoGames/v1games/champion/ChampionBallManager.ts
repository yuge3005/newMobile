class ChampionBallManager extends BallManager{
	public constructor() {
		super();
	}

	protected buildBallUIWithIndex( index : number, num : number = 0 ): egret.Sprite{
		var ball: egret.Sprite = super.buildBallUIWithIndex( index, num );
		var tx: egret.TextField = ball.getChildAt( ball.numChildren - 1 ) as egret.TextField;
		tx.textFlow = [{text:tx.text, style:{ underline: true }}];
		return ball;
	}
}
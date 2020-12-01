class MultiPlayerBingoGrid extends Multi75Grid{

	public static AWARDTYPE_COINSBOX = "coinsBox";
	public static AWARDTYPE_COINSBALL = "coinsBall";
	public static AWARDTYPE_COINSAWARDTHREE = "coinsAwardThree";
	public static AWARDTYPE_MARKNUMBER = "markNumber";

	public constructor() {
		super();

		this.blinkTextSizeMin = 19;
		this.blinkTextSizeMax = 22;
	}

	protected getBitmapByAwardType( awardType: string ): egret.Bitmap{
		let additionPic: egret.Bitmap;
		switch( awardType ){
			case MultiPlayerBingoGrid.AWARDTYPE_COINSBOX:
				additionPic = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "box1" ), 0, 0 );
				break;
			case MultiPlayerBingoGrid.AWARDTYPE_COINSBALL:
				additionPic = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "36" ), 0, 0 );
				break;
			case MultiPlayerBingoGrid.AWARDTYPE_COINSAWARDTHREE:
				additionPic = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "36" ), 0, 0 );
				break;
			case MultiPlayerBingoGrid.AWARDTYPE_MARKNUMBER:
				additionPic = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "box2" ), 0, 0 );
				break;
		}
		return additionPic;
	}

	public flyBox(): void{
		TweenerTool.tweenTo( this.additionPic, { x: this.additionPic.x, y: this.additionPic.y }, 400, 0, null, { x: this.additionPic.x + Math.random() * 50 - 25, y: this.additionPic.y - 600 }, egret.Ease.sineOut );
	}
}
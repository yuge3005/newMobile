class SuperGoalExtraBg extends egret.DisplayObjectContainer{
	public constructor() {
		super();

		let ball: Array<egret.Bitmap> = [];
		for( let i: number = 0; i < 10; i++ ){
			ball[i] = Com.addBitmapAt( this, BingoMachine.getAssetStr( "champion_extra" ), i % 5 * 56, i < 5 ? 0 : -56 );
			this.addChild( ball[i] );
		}
	}
}
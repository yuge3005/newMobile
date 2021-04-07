class MultiSetting {
	public static fakeArr( num: number ): Array<number>{
		let fakeArr: Array<number> = [];
		let numberCount: number = num;
		while( numberCount-- > 0 ){
			fakeArr.push( 1 );
		}
		return fakeArr;
	}

	public static dropCoinsAt( target: egret.DisplayObjectContainer, pos: egret.Point, coins: number ){
		let dropCoins: DropingCoins = new DropingCoins();
		dropCoins.drop( 10, pos, new egret.Point(0, 0), new egret.Point( 0, -4 ), new egret.Point( 5, 4 ), 1, 0.3, 0.3 );
		target.addChild( dropCoins );

		let coinsNumTxt: egret.TextField = Com.addTextAt( target, pos.x - 50, pos.y, 100, 30, 30, false, true );
		coinsNumTxt.textColor = 0xFFFF00;
		coinsNumTxt.text = "+" + coins;
		coinsNumTxt.filters = [ new egret.GlowFilter( 0, 1, 2, 2, 2, 2 ) ];
		TweenerTool.tweenTo( coinsNumTxt, { y: coinsNumTxt.y - 40 }, 500, 0, MDS.removeSelf.bind( target, coinsNumTxt ), null, egret.Ease.sineOut );
	}
	
	public static getDisplayObjectGlobelPoint(sp: egret.DisplayObject): egret.Point {
		let pt: egret.Point = new egret.Point;
		let spContainer: egret.DisplayObject = sp;
		while (spContainer) {
			pt.x += spContainer.x;
			pt.y += spContainer.y;
			if (spContainer instanceof GameCenter) break;
			spContainer = spContainer.parent;
		}
		return pt;
	}
}
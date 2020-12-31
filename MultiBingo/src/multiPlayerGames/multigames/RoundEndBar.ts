class RoundEndBar extends MultiCoverBars{

	private titleTxt: TextLabel;
	private totalWinNum: egret.TextField;
	private winCoinIcon: egret.Bitmap;

	public constructor() {
		super();

		Com.addBitmapAt( this, "roundOverTime_json.bg", 235, 62 );

		let btn: egret.Shape = new egret.Shape;
		Com.addObjectAt( this, btn, 865, 867 );
		GraphicTool.drawRect( btn, new egret.Rectangle( 0, 0, 267, 81 ), 0, false, 0.0 );
		btn.touchEnabled = true;
		btn.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onContinue, this );

		let continueTxt: TextLabel = Com.addLabelAt( this, 865, 867, 267, 81, 44, false, true );
		continueTxt.textColor = 0x0;
		continueTxt.setText( MuLang.getText( "continue" ) );

		this.titleTxt = Com.addLabelAt( this, 792, 225, 416, 50, 48, true, true );
		this.titleTxt.textColor = 0xFBE12D;
		this.titleTxt.setText( MuLang.getText( "rewardsFrom" ) );

		this.showItemBg( -270, this.bingoWin, 0 );
		this.showItemBg( 270, this.powerUpWin, 400 );
		this.showItemBg( 0, this.treasureWin, 800 );

		this.totalWinNum = Com.addTextAt( this, 595, 709, 850, 80, 80, false, true );
		this.totalWinNum.textColor = 0x3A1301;
		this.totalWinNum.filters = [ new egret.DropShadowFilter(2, 45, 0x8A410D, 1, 3, 3, 3, egret.BitmapFilterQuality.HIGH) ];
		this.totalWinNum.text = "" + Math.floor( MultyPlayerBingo.powerUpCoins + MultiPlayerMachine.oneCardPrize * MultyPlayerBingo.callBingoTimes );
		this.winCoinIcon = Com.addBitmapAt( this, "IdleTime_json.03", 0, 709 );
		this.winCoinIcon.x = 510 * 2 + this.totalWinNum.width - this.totalWinNum.textWidth >> 1;
	}

	private showItemBg( offsetX: number, callback: Function, delay: number ){
		let itemBg: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		itemBg.anchorOffsetX = 105;
		itemBg.anchorOffsetY = 140;
		itemBg.alpha = 0.0;
		Com.addObjectAt( this, itemBg, 893 + 105, 372 + 140 );
		Com.addBitmapAt( itemBg, "roundOverTime_json.x", 0, 0 );

		let whiteMask: egret.Shape = new egret.Shape;
		GraphicTool.drawRect( whiteMask, new egret.Rectangle( 3, 2, 204, 273 ), 0xFFFFFF, false, 1, 16 );
		Com.addObjectAt( itemBg, whiteMask, 0, 0 );

		let tw: egret.Tween = egret.Tween.get( itemBg );
		tw.wait( delay );
		tw.to( { scaleX: 1, scaleY: 1, alpha: 1 }, 300, egret.Ease.sineOut );
		tw.wait( 100 );
		tw.to( { x: itemBg.x + offsetX }, 200 );
		tw.call( callback.bind( this, itemBg ) );

		TweenerTool.tweenTo( whiteMask, { alpha: 0 }, 100, 300 + delay );
	}

	private bingoWin( itemBg: egret.DisplayObjectContainer ){
		this.itemText( itemBg, 25, "bingo" );
		let bingoNum: TextLabel  = this.itemText( itemBg, 227 );
		bingoNum.setText( "x" + MultyPlayerBingo.callBingoTimes );
		Com.addBitmapAtMiddle( itemBg, "roundOverTime_json.x1", 105, 140 );

		itemBg.cacheAsBitmap = true;
		if( MultyPlayerBingo.callBingoTimes )this.flyCoinsFrom( 270 );
	}

	private powerUpWin( itemBg: egret.DisplayObjectContainer ){
		this.itemText( itemBg, 25, "powerUp" );
		let powerUpNum: TextLabel = this.itemText( itemBg, 227 );
		powerUpNum.setText( "x" + MultyPlayerBingo.powerUpTimes );
		Com.addBitmapAtMiddle( itemBg, "roundOverTime_json.x3", 105, 140 );

		itemBg.cacheAsBitmap = true;
		if( MultyPlayerBingo.powerUpTimes )this.flyCoinsFrom( 476 );
	}

	private treasureWin( itemBg: egret.DisplayObjectContainer ){
		this.itemText( itemBg, 25, "treasure" );
		let treasureNum: TextLabel = this.itemText( itemBg, 227 );
		treasureNum.setText( "x" + MultyPlayerBingo.openBoxTimes );
		Com.addBitmapAtMiddle( itemBg, "roundOverTime_json.box2", 105, 140 );

		itemBg.cacheAsBitmap = true;
		if( MultyPlayerBingo.openBoxTimes )this.flyCoinsFrom( 373 );
	}

	private itemText( itemBg: egret.DisplayObjectContainer, y: number, tx: string = null ): TextLabel{
		let lb: TextLabel = Com.addLabelAt( itemBg, 10, y, 190, 36, 36 );
		lb.textColor = 0x0;
		if( tx )lb.setText( MuLang.getText( tx, MuLang.CASE_UPPER ) );
		return lb;
	}

	private flyCoinsFrom( startX: number ){
		let flyCoins: FlyingCoins = new FlyingCoins();
		flyCoins.fly( 10, new egret.Point( startX, 285 ), new egret.Point(385, 375), new egret.Point( 373, 300 ), 0.15, 0.1, 0.3 );
		this.addChild( flyCoins );
	}

	private onContinue( event: egret.TouchEvent ){
		this.dispatchEvent( new egret.Event( "roundEndBarContinue" ) );
	}
}
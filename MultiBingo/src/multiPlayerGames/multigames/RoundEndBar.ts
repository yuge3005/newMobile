class RoundEndBar extends MultiCoverBars{

	private titleTxt: egret.TextField;
	private bingoNum: egret.TextField;
	private treasureNum: egret.TextField;
	private powerUpNum: egret.TextField;
	private totalWinNum: egret.TextField;
	private winCoinIcon: egret.Bitmap;

	public constructor() {
		super();

		Com.addBitmapAt( this, "roundOverTime_json.bg", 55, 90 );

		let btn: egret.Shape = new egret.Shape;
		Com.addObjectAt( this, btn, 315, 430 );
		GraphicTool.drawRect( btn, new egret.Rectangle( 0, 0, 116, 37 ), 0, false, 0.0 );
		btn.touchEnabled = true;
		btn.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onContinue, this );

		let continueTxt: egret.TextField = Com.addTextAt( this, 319, 430, 112, 20, 20, false, true );
		continueTxt.textColor = 0x0;
		continueTxt.height = 36;
		continueTxt.verticalAlign = "middle";
		continueTxt.text = MuLang.getText( "continue" );

		this.titleTxt = Com.addTextAt( this, 180, 172, 385, 18, 18, true, true );
		this.titleTxt.textColor = 0xFBE12D;
		this.titleTxt.text = MuLang.getText( "rewardsFrom" );

		this.showItemBg( -105, this.bingoWin, 0 );
		this.showItemBg( 105, this.powerUpWin, 400 );
		this.showItemBg( 0, this.treasureWin, 800 );

		this.totalWinNum = Com.addTextAt( this, 200, 368, 385, 24, 24, false, true );
		this.totalWinNum.textColor = 0x3A1301;
		this.totalWinNum.filters = [ new egret.DropShadowFilter(2, 45, 0x8A410D, 1, 3, 3, 3, egret.BitmapFilterQuality.HIGH) ];
		this.totalWinNum.text = "" + Math.floor( MultyPlayerBingo.powerUpCoins + MultiPlayerMachine.oneCardPrize * MultyPlayerBingo.callBingoTimes );
		this.winCoinIcon = Com.addBitmapAt( this, "IdleTime_json.03", 0, 365 );
		this.winCoinIcon.scaleX = this.winCoinIcon.scaleY = 0.5;
		this.winCoinIcon.x = 320 + this.totalWinNum.width - this.totalWinNum.textWidth >> 1;
	}

	private showItemBg( offsetX: number, callback: Function, delay: number ){
		let itemBg: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		itemBg.anchorOffsetX = 43;
		itemBg.anchorOffsetY = 56;
		itemBg.scaleX = itemBg.scaleY = 1.4;
		itemBg.alpha = 0.0;
		Com.addObjectAt( this, itemBg, 275 + 43 + 55, 141 + 56 + 90 );
		Com.addBitmapAt( itemBg, "roundOverTime_json.x", 0, 0 );

		let whiteMask: egret.Shape = new egret.Shape;
		GraphicTool.drawRect( whiteMask, new egret.Rectangle( 0, 0, 85, 112 ), 0xFFFFFF, false, 1, 8 );
		Com.addObjectAt( itemBg, whiteMask, 0, 0 );

		let tw: egret.Tween = egret.Tween.get( itemBg );
		tw.wait( delay );
		tw.to( { scaleX: 1, scaleY: 1, alpha: 1 }, 300, egret.Ease.sineOut );
		tw.wait( 100 );
		tw.to( { x: itemBg.x + offsetX }, 200 );
		tw.call( callback.bind( this ) );

		TweenerTool.tweenTo( whiteMask, { alpha: 0 }, 100, 300 + delay );
	}

	private bingoWin(){
		let bingoTxt: egret.TextField = Com.addTextAt( this, 228, 240, 80, 14, 14 );
		bingoTxt.textColor = 0x0;
		bingoTxt.text = MuLang.getText( "bingo", MuLang.CASE_UPPER );
		this.bingoNum = Com.addTextAt( this, 228, 325, 80, 14, 14 );
		this.bingoNum.textColor = 0x0;
		this.bingoNum.text = "x" + MultyPlayerBingo.callBingoTimes;
		Com.addBitmapAt( this, "roundOverTime_json.x1", 240, 258 );

		if( MultyPlayerBingo.callBingoTimes )this.flyCoinsFrom( 270 );
	}

	private powerUpWin(){
		let powerUpTxt: egret.TextField = Com.addTextAt( this, 438, 240, 80, 14, 14 );
		powerUpTxt.textColor = 0x0;
		powerUpTxt.text = MuLang.getText( "powerUp", MuLang.CASE_UPPER );
		this.powerUpNum = Com.addTextAt( this, 438, 325, 80, 14, 14 );
		this.powerUpNum.textColor = 0x0;
		this.powerUpNum.text = "x" + MultyPlayerBingo.powerUpTimes;
		Com.addBitmapAt( this, "roundOverTime_json.x3", 455, 255 );

		if( MultyPlayerBingo.powerUpTimes )this.flyCoinsFrom( 476 );
	}

	private treasureWin(){
		let treasureTxt: egret.TextField = Com.addTextAt( this, 333, 240, 80, 14, 14 );
		treasureTxt.textColor = 0x0;
		treasureTxt.text = MuLang.getText( "treasure", MuLang.CASE_UPPER );
		this.treasureNum = Com.addTextAt( this, 333, 325, 80, 14, 14 );
		this.treasureNum.textColor = 0x0;
		this.treasureNum.text = "x" + MultyPlayerBingo.openBoxTimes;
		Com.addBitmapAt( this, "roundOverTime_json.box2", 330, 245 );

		if( MultyPlayerBingo.openBoxTimes )this.flyCoinsFrom( 373 );
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
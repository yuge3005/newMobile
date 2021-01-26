class MaraWaitingBar extends Multi75WaitingBar{
	private cardsBtnsContainer: egret.DisplayObjectContainer;
	private btnItem: Array<egret.DisplayObjectContainer>;
	private priceIcon: Array<egret.Bitmap>;

	public static cardPriceConfig: Array<Array<Object>>;

	private titleTxt: egret.Bitmap;
	private betTxt: egret.Bitmap;

	public constructor() {
		super();

		let cover: egret.Shape = this.getChildAt(0) as egret.Shape;
		cover.alpha = 0;
		Com.addBitmapAt( this, "mara_idle_json." + "menu", 0, 0 );

		let blueBg: egret.Shape = new egret.Shape;
		GraphicTool.drawRect( blueBg, new egret.Rectangle( 135, 28, 736, 102 ), 0x305050, false, 0.6, 20 );
		this.addChild( blueBg );

		this.cardsBtnsContainer = new egret.DisplayObjectContainer;
		this.addChild( this.cardsBtnsContainer );
		let nameLetter: Array<string> = ["A","B","C","D"];
		this.cardPriceTexts = [];
		this.btnItem = [];
		for( let i: number = 0; i < 4; i++ ){
			let pt: egret.Point = new egret.Point( 83 + (i&1) * 590, 349 + Math.floor(i*0.5) * 239 );
			this.btnItem[i] = new egret.DisplayObjectContainer;
			Com.addObjectAt( this.cardsBtnsContainer, this.btnItem[i], pt.x, pt.y );
			let assetsName: string = "mara_idle_json." + nameLetter[i];
			Com.addDownButtonAt( this.btnItem[i], assetsName, assetsName, 0, 0, this.onCardNumbersConfirm.bind(this), true ).name = "" + ( i + 1 );
			this.cardPriceTexts[i] = Com.addTextAt( this.btnItem[i], 70, 124, 157, 28, 28 );
			this.cardPriceTexts[i].bold = true;
			this.cardPriceTexts[i].textColor = 0xFFD77F;
		}

		this.leftButton = Com.addDownButtonAt( this, "mara_idle_json.-1", "mara_idle_json.-2", 310, 275, this.onBetIconStep.bind(this), true );
		this.rightButton = Com.addDownButtonAt( this, "mara_idle_json.+1", "mara_idle_json.+2", 630, 275, this.onBetIconStep.bind(this), true );
		this.betStep = 1;

		this.titleTxt = Com.addBitmapAtMiddle( this, "mara_" + MuLang.language + "_json.buy_next", 503, 85 );
		this.betTxt = Com.addBitmapAtMiddle( this, "mara_" + MuLang.language + "_json.bet", 503, 207 );

		setTimeout( this.initShowPrice.bind(this), 50 );

		this.freeCardUI = new MultiBIngoFreeCardUI;
	}

	protected initShowPrice(){
		if( MaraWaitingBar.cardPriceConfig ){
			this.resetCardPrice();
			this.resetCardPrize();
		}
		else{
			setTimeout( this.initShowPrice.bind(this), 50 );
		}
	}

	protected rebuiltBetIcon( value: number ): egret.Bitmap{
		Mara.betStep = value;
		return Com.addBitmapAt( this,  "mara_idle_json." + value, 385, 275 );
	}

	protected cardBought( amount: number ){
		MultiPlayerMachine.oneCardPrize = MultiPlayerMachine.cardPrize * MultiServer.userMultiplier * this.betStep;
		let i: number = amount - 1;
		let pt: egret.Point = new egret.Point( 310 + (i&1) * 158, 205 + 44 + Math.floor(i*0.5) * 123 );
	}

	public hideBottomBtns( amount: number = 0 ){
		this.cardsBtnsContainer.touchChildren = false;

		this.leftButton.enabled = false;
		this.rightButton.enabled = false;

		for( let i: number = 0; i < 4; i++ ) this.btnItem[i].visible = false;
		this.btnItem[amount-1].visible = true;
		TweenerTool.tweenTo( this.btnItem[amount-1], { x: 367, y: 465 }, 300, 50 );

		if( this.titleTxt && this.contains( this.titleTxt ) ) this.removeChild( this.titleTxt );
		this.titleTxt = Com.addBitmapAtMiddle( this, "mara_" + MuLang.language + "_json.wait", 503, 85 );
	}

	protected resetCardPrice(){
		let betArr: Array<Object> = MaraWaitingBar.cardPriceConfig[this.betStep-1];
		if( !this.priceIcon ) this.priceIcon = [];
		for( let i: number = 0; i < 4; i++ ){
			this.cardPriceTexts[i].text = "" + betArr[i]["price"];
			if( this.priceIcon[i] && this.priceIcon[i].parent ) this.priceIcon[i].parent.removeChild( this.priceIcon[i] );
			this.priceIcon[i] = Com.addBitmapAtMiddle( this.btnItem[i], "mara_idle_json." + ( betArr[i]["coinsType"] == 1 ? "coin" : "green" ), 50, 136 );
			this.priceIcon[i].scaleX = this.priceIcon[i].scaleY = 0.4;
		}
	}

	protected resetCardPrize(){
		super.resetCardPrize();
		this.dispatchEvent( new egret.Event( "prizeChanged" ) );
	}

	public get winPrize(): number{
		return MaraWaitingBar.cardPriceConfig[0][0]["price"] * this.betStep;
	}

	private countDownBar: egret.DisplayObjectContainer;

	public startWaiting(){
		this.countDownBar = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.countDownBar, -52, -194 );
		Com.addBitmapAt( this.countDownBar, "mara_" + MuLang.language + "_json.to_start", 0, 0 );

		this.waitingTxt = Com.addTextAt( this.countDownBar, 60, 23, 127, 50, 50 );
		this.waitingTxt.fontFamily = "Righteous";
		this.waitingTxt.scaleX = 0.8;
	}

	public showCountDown( countDown: number ){
		if( !this.countDownBar )this.startWaiting();
		this.waitingTxt.text = countDown + "S";
		if( countDown == 0 ) this.countDownBar.visible = false;
		else if( !this.countDownBar.visible ) this.countDownBar.visible = true;
	}

	public updateFreeCardCountText( freeCards: number ){
		//sub class override
	}
}
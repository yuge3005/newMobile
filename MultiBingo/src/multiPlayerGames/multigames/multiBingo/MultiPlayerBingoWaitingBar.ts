class MultiPlayerBingoWaitingBar extends Multi75WaitingBar{
	private bottomBtnsContainer: egret.DisplayObjectContainer;
	private cardsBtnsContainer: egret.DisplayObjectContainer;
	private countDonwContainer: egret.DisplayObjectContainer;

	private titleTxt: egret.TextField;
	private upToTxt: egret.TextField;
	private bingoCoin: egret.Bitmap;
	private bingoAwardTxt: egret.TextField;

	private cardPriceCoins: Array<egret.Bitmap>;

	public constructor() {
		super();

		this.bottomBtnsContainer = new egret.DisplayObjectContainer;
		this.addChild( this.bottomBtnsContainer );
		Com.addBitmapAt( this, "IdleTime_json.bg1", 397, 172 );
		this.cardsBtnsContainer = new egret.DisplayObjectContainer;
		this.addChild( this.cardsBtnsContainer );

		Com.addBitmapAt( this.bottomBtnsContainer, "IdleTime_json.bg2", 527, 757 );
		let nameLetter: Array<string> = ["A","B","C","D"];
		this.cardPriceTexts = [];
		this.cardPriceCoins = [];
		for( let i: number = 0; i < 4; i++ ){
			let assetsName: string = "IdleTime_json." + nameLetter[i];
			let itemX: number =  646 + i * 182;
			Com.addDownButtonAt( this.cardsBtnsContainer, assetsName, assetsName, itemX, 597, this.onCardNumbersConfirm.bind(this), true ).name = "" + ( i + 1 );
			this.cardPriceTexts[i] = Com.addTextAt( this.cardsBtnsContainer, itemX + 45, 597 + 132, 100, 25, 25 );
			this.cardPriceTexts[i].bold = true;
			this.cardPriceCoins[i] = Com.addBitmapAt( this.cardsBtnsContainer, MultiPlayerMachine.getAssetStr( "36" ), itemX + 12, 597 + 122 );
		}

		this.leftButton = Com.addDownButtonAt( this.bottomBtnsContainer, "IdleTime_json.-", "IdleTime_json.-", 706, 929, this.onBetIconStep.bind(this), true );
		this.rightButton = Com.addDownButtonAt( this.bottomBtnsContainer, "IdleTime_json.+", "IdleTime_json.+", 1206, 929, this.onBetIconStep.bind(this), true );

		this.freeCardUI = new MultiBingoFreeCardUI;
		Com.addObjectAt( this, this.freeCardUI, 812, 943 );

		this.betStep = 1;

		let titleSize: number = MuLang.language == "en" ? 45 : 35;
		this.titleTxt = Com.addTextAt( this, 540, 315, 940, 70, titleSize, true, true );
		this.titleTxt.textColor = 0xF8A626;
		this.titleTxt.verticalAlign = "middle";
		this.titleTxt.text = MuLang.getText( "Boost your cards for better rewards!" );
		this.upToTxt = Com.addTextAt( this, 100, 470, 400, 40, 40 );
		this.upToTxt.textColor = 0x843B1C;
		this.upToTxt.textAlign = "right";
		this.upToTxt.text = MuLang.getText( "Up to", MuLang.CASE_UPPER );
		this.bingoAwardTxt = Com.addTextAt( this, 970, 450, 440, 80, 80, false, true );
		this.bingoAwardTxt.textColor = 0x3A1301;
		this.bingoAwardTxt.textAlign = "left";
		this.bingoAwardTxt.filters = [ new egret.DropShadowFilter(2, 45, 0x8A410D, 1, 3, 3, 3, egret.BitmapFilterQuality.HIGH) ];
		this.bingoCoin = Com.addBitmapAt( this, "IdleTime_json.03" , 875, 450 );

		this.initShowPrice();
	}

	protected rebuiltBetIcon( value: number ): egret.Bitmap{
		return Com.addBitmapAt( this.bottomBtnsContainer,  "IdleTime_json." + value, 812, 943 );
	}

	protected cardBought( amount: number ){
		MultiPlayerMachine.oneCardPrize = MultiPlayerMachine.cardPrize * MultiServer.userMultiplier * this.betStep;
		this.bingoAwardTxt.text = "" + Math.floor( MultiPlayerMachine.oneCardPrize * amount );
	}

	public existCardIdle( betStep: number, amount: number ){
		super.existCardIdle( betStep, amount );
		if( this.bingoAwardTxt )this.bingoAwardTxt.text = "" + Math.floor( MultiPlayerMachine.oneCardPrize * amount );
	}

	protected cardPriceCoinPosition(){
		for( let i: number = 0; i < 4; i++ ){
			let itemX: number =  646 + i * 182;
			this.cardPriceCoins[i].x = ( itemX + 12 ) + ( this.cardPriceTexts[i].width - this.cardPriceTexts[i].textWidth >> 1 ) - 20;
		}
	}

	protected resetCardPrize(){
		super.resetCardPrize();
		this.bingoAwardTxt.text = "" + Math.floor( MultiPlayerMachine.oneCardPrize );

		let len: number = 120 + this.upToTxt.textWidth + this.bingoAwardTxt.textWidth;
		this.bingoAwardTxt.x = 972 + len * 0.5 - this.bingoAwardTxt.textWidth;
		this.bingoCoin.x = this.bingoAwardTxt.x - 100;
		this.upToTxt.x = this.bingoCoin.x - this.upToTxt.width - 20;
	}
	
	public hideBottomBtns( amount: number = 0 ){
		this.bottomBtnsContainer.touchChildren = false;
		TweenerTool.tweenTo( this.bottomBtnsContainer, { y: -208 }, 800 );
		this.cardsBtnsContainer.visible = false;

		this.buildCountDownButtons();
	}

	private buildCountDownButtons(){
		this.countDonwContainer = new egret.DisplayObjectContainer;
		this.addChild( this.countDonwContainer );

		Com.addBitmapAt( this.countDonwContainer, "IdleTime_json.!bg", 694, 596 );
		Com.addBitmapAt( this.countDonwContainer, "IdleTime_json.!", 641, 547 );

		this.waitingTxt = Com.addTextAt( this.countDonwContainer, 718, 624, 560, 160, 48 );
		this.waitingTxt.textColor = 0xE4AB23;
		this.waitingTxt.textAlign = "center";
		this.waitingTxt.verticalAlign = "middle";
		this.waitingTxt.text = MuLang.getText( "wait_round_start" );
	}

	public showCountDown( countDown: number ){
		if( this.waitingTxt ){
			this.waitingTxt.size = 80;
			this.waitingTxt.bold = true;
			this.waitingTxt.text = "" + countDown;
		}
	}
}
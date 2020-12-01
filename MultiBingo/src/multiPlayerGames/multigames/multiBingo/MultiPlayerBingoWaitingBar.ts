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
		Com.addBitmapAt( this, "IdleTime_json.bg1", 95, 90 );
		this.cardsBtnsContainer = new egret.DisplayObjectContainer;
		this.addChild( this.cardsBtnsContainer );

		Com.addBitmapAt( this.bottomBtnsContainer, "IdleTime_json.bg2", 180, 340 );
		let nameLetter: Array<string> = ["A","B","C","D"];
		this.cardPriceTexts = [];
		this.cardPriceCoins = [];
		for( let i: number = 0; i < 4; i++ ){
			let assetsName: string = "IdleTime_json." + nameLetter[i];
			Com.addDownButtonAt( this.cardsBtnsContainer, assetsName, assetsName, 230 + i * 90, 320, this.onCardNumbersConfirm.bind(this), true ).name = "" + ( i + 1 );
			this.cardPriceTexts[i] = Com.addTextAt( this.cardsBtnsContainer, 230 + i * 90 - 20, 339, 52, 11, 11 );
			this.cardPriceTexts[i].bold = true;
			this.cardPriceCoins[i] = Com.addBitmapAt( this.cardsBtnsContainer, MultiPlayerMachine.getAssetStr( "36" ), 230 + i * 90 - 35, 335 );
			this.cardPriceCoins[i].scaleX = this.cardPriceCoins[i].scaleY = 0.45;
		}

		this.leftButton = Com.addDownButtonAt( this.bottomBtnsContainer, "IdleTime_json.-", "IdleTime_json.-", 235, 410, this.onBetIconStep.bind(this), true );
		this.rightButton = Com.addDownButtonAt( this.bottomBtnsContainer, "IdleTime_json.+", "IdleTime_json.+", 455, 410, this.onBetIconStep.bind(this), true );
		this.betStep = 1;

		let titleSize: number = MuLang.language == "en" ? 20 : 16;
		this.titleTxt = Com.addTextAt( this, 180, 150, 400, 32, titleSize, true, true );
		this.titleTxt.textColor = 0xF8A626;
		this.titleTxt.verticalAlign = "middle";
		this.titleTxt.text = MuLang.getText( "Boost your cards for better rewards!" );
		this.upToTxt = Com.addTextAt( this, 100, 220, 385, 18, 18 );
		this.upToTxt.textColor = 0x843B1C;
		this.upToTxt.textAlign = "right";
		this.upToTxt.text = MuLang.getText( "Up to" );
		this.bingoAwardTxt = Com.addTextAt( this, 100, 217, 385, 24, 24, false, true );
		this.bingoAwardTxt.textColor = 0x3A1301;
		this.bingoAwardTxt.textAlign = "left";
		this.bingoAwardTxt.filters = [ new egret.DropShadowFilter(2, 45, 0x8A410D, 1, 3, 3, 3, egret.BitmapFilterQuality.HIGH) ];
		this.bingoCoin = Com.addBitmapAt( this, "IdleTime_json.03" , 280, 212 );
		this.bingoCoin.scaleX = this.bingoCoin.scaleY = 0.5;

		this.initShowPrice();
	}

	protected rebuiltBetIcon( value: number ): egret.Bitmap{
		return Com.addBitmapAt( this.bottomBtnsContainer,  "IdleTime_json." + value, 280, 415 );;
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
			this.cardPriceCoins[i].x = ( 230 + i * 90 - 20 ) + ( this.cardPriceTexts[i].width - this.cardPriceTexts[i].textWidth >> 1 ) - 20;
		}
	}

	protected resetCardPrize(){
		super.resetCardPrize();
		this.bingoAwardTxt.text = "" + Math.floor( MultiPlayerMachine.oneCardPrize );

		let len: number = 28 + this.upToTxt.textWidth + this.bingoAwardTxt.textWidth + 20;
		this.bingoAwardTxt.x = 360 + len * 0.5 - this.bingoAwardTxt.textWidth;
		this.bingoCoin.x = this.bingoAwardTxt.x - 38;
		this.upToTxt.x = this.bingoCoin.x - this.upToTxt.width - 10;
	}
	
	public hideBottomBtns( amount: number = 0 ){
		this.bottomBtnsContainer.touchChildren = false;
		TweenerTool.tweenTo( this.bottomBtnsContainer, { y: -100 }, 800 );
		this.cardsBtnsContainer.visible = false;

		this.buildCountDownButtons();
	}

	private buildCountDownButtons(){
		this.countDonwContainer = new egret.DisplayObjectContainer;
		this.addChild( this.countDonwContainer );

		Com.addBitmapAt( this.countDonwContainer, "IdleTime_json.!bg", 253, 272 );
		Com.addBitmapAt( this.countDonwContainer, "IdleTime_json.!", 233, 258 );

		this.waitingTxt = Com.addTextAt( this.countDonwContainer, 253, 272, 223, 82, 19 );
		this.waitingTxt.textColor = 0xE4AB23;
		this.waitingTxt.textAlign = "center";
		this.waitingTxt.verticalAlign = "middle";
		this.waitingTxt.text = MuLang.getText( "wait_round_start" );
	}

	public showCountDown( countDown: number ){
		if( this.waitingTxt ){
			this.waitingTxt.size = 32;
			this.waitingTxt.bold = true;
			this.waitingTxt.text = "" + countDown;
		}
	}
}
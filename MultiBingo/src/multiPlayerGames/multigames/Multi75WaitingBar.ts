class Multi75WaitingBar extends WaitingBar{
	private betIcon: egret.Bitmap;

	protected leftButton: TouchDownButton;
	protected rightButton: TouchDownButton;

	private _betStep: number;
	protected get betStep(): number{
		return this._betStep;
	}
	protected set betStep( value: number ){
		if( value == this._betStep )return;
		this._betStep = value;

		this.leftButton.enabled = value > 1;
		this.rightButton.enabled = value < 3;

		if( this.betIcon && this.betIcon.parent ) this.betIcon.parent.removeChild( this.betIcon );
		this.betIcon = this.rebuiltBetIcon( value );
		this.addChild( this.freeCardUI );
		this.showFreeCardUI( value );
	}

	protected cardPriceTexts: Array<egret.TextField>;
	protected waitingTxt: egret.TextField;

	protected freeCardUI: FreeCardUI;

	public constructor() {
		super();

		this.cacheAsBitmap = true;
	}

	protected initShowPrice(){
		if( MultiServer.userMultiplier ){
			this.resetCardPrice();
			this.resetCardPrize();
			this.checkFreeCard();
		}
		else{
			setTimeout( this.initShowPrice.bind(this), 50 );
		}
	}

	protected rebuiltBetIcon( value: number ): egret.Bitmap{
		return null;
	}

	protected onBetIconStep( event: egret.Event ){
		let currentBtn: TouchDownButton = event.target;
		if( currentBtn == this.leftButton ) this.betStep--;
		else if( currentBtn == this.rightButton ) this.betStep++;
		else alert( "currentBtn error" );

		this.resetCardPrice();
		this.checkFreeCard();
		this.cardPriceCoinPosition();
		this.resetCardPrize();
	}

	protected resetCardPrice(){
		let oneCardPrice: number = MultiPlayerMachine.cardPrice * MultiServer.userMultiplier * this.betStep;
		for( let i: number = 0; i < 4; i++ ){
			this.cardPriceTexts[i].text = "" + Math.floor( oneCardPrice * (i + 1) );
		}
	}

	protected checkFreeCard(){
		if( this.freeCardUI.visible ){
			for( let i: number = this.cardPriceTexts.length - 1; i >= 0; i-- ){
				if( i < FreeCardUI.freeCardCount ) this.cardPriceTexts[i].text = MuLang.getText( "free" );
				else this.cardPriceTexts[i].text = this.cardPriceTexts[i - FreeCardUI.freeCardCount].text;
			}
		}
	}

	protected resetCardPrize(){
		MultiPlayerMachine.oneCardPrize = MultiPlayerMachine.cardPrize * MultiServer.userMultiplier * this.betStep;
	}

	protected cardPriceCoinPosition(){
		//sub class override
	}

	protected onCardNumbersConfirm( event: egret.Event ){
		let amount: number = parseInt(event.target.name);
		let ev: egret.Event = new egret.Event( "waitingBarBuyCard" );
		ev.data = { amount: amount, multiple: this.betStep };
		this.dispatchEvent( ev );
		this.cardBought( amount );

		this.freeCardUI.visible = false;
	}

	protected cardBought( amount: number ){
		//sub class override
	}

	public existCard( betStep: number, amount: number ){
		this.betStep = betStep;
		this.cardBought( amount );
		this.hideBottomBtns( amount );
	}

	public existCardIdle( betStep: number, amount: number ){
		this.betStep = betStep;
		MultiPlayerMachine.oneCardPrize = MultiPlayerMachine.cardPrize * MultiServer.userMultiplier * this.betStep;
	}

	public updateFreeCardCountText( freeCards: number ){
		FreeCardUI.freeCardCount = freeCards;
		this.showFreeCardUI( this.betStep );
		this.freeCardUI.setFreeCardCount( freeCards );
		this.checkFreeCard();
	}

	public updateFreeCardAfterBuycard( freeCards: number ){
		FreeCardUI.freeCardCount = freeCards;
	}

	public showFreeCardUI( betStep: number ){
		this.freeCardUI.visible = betStep == 1 && FreeCardUI.freeCardCount > 0;
	}
}
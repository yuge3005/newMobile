class JackpotLayer extends egret.DisplayObjectContainer {
	public tip: egret.TextField;
    private jackpotText: egret.TextField;
	public jackpotMinBet: number;
	protected jackpotLock: egret.Bitmap;

	protected jackpotTooltip: egret.DisplayObjectContainer;

	public jackpotBonus: Boolean;
	public jackpotNumber: number;

	private betConfig: Array<Object>;

	public constructor( jackpotContainerPosition: egret.Point, jackpot: number, jackpotMinBet: number, betConfig: Array<Object>, lockPosition: egret.Point,
		jackpotTextRect: egret.Rectangle, jackpotTextSize: number, jackpotTextColor: number,
		tipRect: egret.Rectangle = null, tipTextSize: number = 0, tipTextColor: number = 0 ) {
		super();

		this.betConfig = betConfig;

		this.x = jackpotContainerPosition.x;
		this.y = jackpotContainerPosition.y;

		this.jackpotLock = Com.addBitmapAt(this, BingoMachine.getAssetStr("jackpot_lock"), lockPosition.x, lockPosition.y);
		this.jackpotLock.touchEnabled = true;

		if( tipRect ){
			this.tip = Com.addTextAt( this, tipRect.x, tipRect.y, tipRect.width, tipRect.height, tipTextSize, false, true );
        	this.tip.textColor = tipTextColor;
			this.tip.text = MuLang.getText("jackpot");
		}

		this.jackpotText = Com.addTextAt( this, jackpotTextRect.x, jackpotTextRect.y, jackpotTextRect.width, jackpotTextRect.height, jackpotTextSize, false, true );
        this.jackpotText.textColor = jackpotTextColor;
		this.jackpotText.verticalAlign = "middle";
		this.jackpotValue = this.countJackpotByRate( Math.round( jackpot ) );
        this.jackpotMinBet = jackpotMinBet;

		this.tryJackpotMinBet();
	}

	private createJackpotTooltipAt( x: number, y: number ){
		let typeRight: boolean = this.x + x > this.parent.width / 2;
		let type = typeRight ? "right" : "left";
		this.jackpotTooltip = new egret.DisplayObjectContainer();
		this.jackpotTooltip.width = 370;
		this.jackpotTooltip.height = 180;
		this.jackpotTooltip.anchorOffsetX = typeRight ? 310 : 64;
		this.jackpotTooltip.anchorOffsetY = 17;

		// background image
		Com.addBitmapAt(this.jackpotTooltip, ("jackpot_tooltip_json.tooltip_" + type), 0, 0);

		// tooltip text
		let tooltipText = Com.addTextAt(this.jackpotTooltip, 21, 42, 327, 120, 18, false, false);
		tooltipText.fontFamily = "Righteous";
		tooltipText.textColor = 0xFFFFFF;
		tooltipText.textAlign = "center";
		tooltipText.verticalAlign = "middle";
		let cardNumbers: number = CardManager.cards.length;
		tooltipText.text = MuLang.getText("jackpot_tooltip").replace("{1}", this.jackpotMinBet * cardNumbers + "").replace("{2}", cardNumbers + "");

		Com.addObjectAt(this, this.jackpotTooltip, x, y);
	}

	private jackpotCurrentTextValue: number;
	private set jackpotValue( value: number ){
		this.jackpotCurrentTextValue = value;
		this.jackpotText.text = Utils.formatCoinsNumber( Math.round( value ) );
	}

	private get jackpotValue(): number{
		return this.jackpotCurrentTextValue;
	}

	private currentJackpotPool: number;

	private countJackpotByRate( jackpot: number ): number{
		this.currentJackpotPool = jackpot;
		for( let i: number = 0; i < this.betConfig.length; i++ ){
			if( GameData.currentBet == this.betConfig[i]["bet"] ){
				return jackpot * this.betConfig[i]["jackpotRate"];
			}
		}
	}

	public changebet(){
		this.setJackpotNumber( { acumulado: this.currentJackpotPool }, true );
	}

	public setJackpotNumber( data: Object, isChangeBet: boolean = false ){
		egret.Tween.removeTweens( this );
		let jackPotValue: number = this.countJackpotByRate( data["acumulado"] );
		if( isChangeBet ) this.jackpotValue = jackPotValue;
		else egret.Tween.get( this ).to( { jackpotValue: jackPotValue }, 2000 );
	}

	public tryJackpotMinBet(): void{
		if( !this.jackpotMinBet || GameData.currentBet < this.jackpotMinBet || CardManager.enabledCards != CardManager.cards.length ){
			this.jackpotLock.visible = true;
		}
		else this.jackpotLock.visible = false;
	}

	public set textBold( bold: boolean ){
		this.jackpotText.fontFamily = bold ? "Arial Black": "Arial";
	}

	public jackpotWinCallback( data: Object ): void{
		if( data["id"] == Number( PlayerConfig.player("user.id") ) ){
			this.jackpotBonus = true;
			this.jackpotNumber = data["jackpot"];
		}
	}
}
class BlackStar extends V1Game{

    protected static get classAssetName(){
		return "blackStar";
	}

    protected static get animationAssetName(){
		return "showballAnimation";
	}

    private winText: egret.TextField;
    private saveText: TextLabel;

    private _saveNumber: number;
    private get saveNumber(): number{
        return this._saveNumber;
    }
    private set saveNumber( value: number ){
        this._saveNumber = value;
        ( this.gameToolBar as BackGameToolBar ).savingNumber = value;
        this.saveText.setText( Utils.formatCoinsNumber( value ) );
    }

    private extraPrice: number;

	public constructor( assetsPath: string ) {
		super( "blackStar.conf", assetsPath, 23 );
        this.languageObjectName = "blackStar_tx";

        GameCard.bgRound = 10;
        CardGrid.defaultNumberSize = 60;

        this.needSmallWinTimesOnCard = true;
        this.ballArea.needLightCheck = true;

        this.needListenToolbarStatus = true;
        this.tipStatusTextPosition = new egret.Rectangle( 12, 180, 258, 16 );
        this.tipStatusTextColor = 0xFEFE00;
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();

        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.runningBallContainer.scaleX = this.runningBallContainer.scaleY = 0.5;
    }

    protected onServerData( data: Object ){
        super.onServerData( data );

        if( data["save"] != null ) this.setSave( parseInt( data["save"] ) );

        this.gameToolBar.addEventListener( "winChange", this.winChange, this );
        this.gameToolBar.addEventListener( "tipStatus", this.tipStatus, this );
    }

    protected initToolbar(){
		this.gameToolBar = new BingoGameToolbar;
		Com.addObjectAt( this, this.gameToolBar, 0, BingoGameToolbar.toolBarY );
		this.gameToolBar.showTip( "" );

		this.topbar = new Topbar;
		this.addChild( this.topbar );
		
		this.topbar.scaleX = this.gameToolBar.scaleX = BingoBackGroundSetting.gameMask.width / 2000;
		this.topbar.scaleY = this.gameToolBar.scaleY = BingoBackGroundSetting.gameMask.height / 1125;
	}

    protected winChange( event: egret.Event ): void{
        this.winText.text = Utils.formatCoinsNumber( event["winCoins"] );
        this.winText.size = this.winText.text.length > 11 ? 11 : 14;
        super.winChange( event );
	}

    protected tipStatus( event: egret.Event ): void{
        super.tipStatus( event );
        this.extraPrice = event["extraPrice"];
	}

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 0, 0 );
        Com.addObjectAt(this, this.runningBallContainer, 75, 12);
        
        this.playSound("bs_ball_mp3");
    }

    private setSave( saveNumber: number ): void{
        this.addGameText( 562, 160, 14, 0xFFFFFF, "saving", false, 125 ).textAlign = "center";

        this.winText = this.addGameTextCenterShadow( 485, 194, 14, 0xFEFE00, "win", false, 100, true, false );
        this.winText.scaleX = 0.71;
        this.winText.text = "" + 0;

        this.saveText = this.addGameTextCenterShadow( 578, 194, 14, 0x04DF04, "saving", false, 100, true, false );
        this.saveText.scaleX = 0.71;
        this.saveNumber = saveNumber;
	}

    protected sendExtraRequest( saving: boolean = false ){
        super.sendExtraRequest( saving && this.saveNumber >= this.extraPrice );
    }

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 244, 160 ), jackpot, jackpotMinBet, betConfig, new egret.Point( -7, 10 ), new egret.Rectangle( 0, 32, 120, 12 ), 16, 0xFF0000, new egret.Rectangle( 0, 0, 120, 14 ), 14, 0xFFFFFF ) );
    }

    protected afterCheck( resultList: Array<Object> ): void{
		super.afterCheck( resultList );

        if( !this.inLightCheck ){
			if( PaytableResultListOprator.missOneCounter( resultList, "bing" ) ){
                this.playSound("bs140_mp3", -1);
			}
		}
    }

	protected onBetChanged( event: egret.Event ): void{
        super.onBetChanged(event);
	}

    protected hasExtraBallFit(): void {
        this.stopSound("bs_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("bs138_mp3");
        }
	}

    protected roundOver(): void {
        super.roundOver();
        this.stopSound("bs_ball_mp3");
        this.stopSound("bs140_mp3");
    }

	protected getExtraBallFit(): void {
		this.playSound("bs149_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
        this.playSound("bs_card_wav");
	}

    public onExtra( data: Object ){
        super.onExtra( data );
        if( data && data["extra"] )this.saveNumber = data["save"];
    }
}
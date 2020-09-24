class BlackStar extends V1Game{

    protected static get classAssetName(){
		return "blackStar";
	}

    protected static get animationAssetName(){
		return "showballAnimation";
	}

    private winText: egret.TextField;
    private saveText: egret.TextField;

    private _saveNumber: number;
    private get saveNumber(): number{
        return this._saveNumber;
    }
    private set saveNumber( value: number ){
        this._saveNumber = value;
        ( this.gameToolBar as BackGameToolBar ).savingNumber = value;
        this.saveText.text = Utils.formatCoinsNumber( value );
        this.saveText.size = this.saveText.text.length > 11 ? 11 : 14;
    }

    private extraPrice: number;

	public constructor( assetsPath: string ) {
		super( "blackStar.conf", assetsPath, 23 );
        this.languageObjectName = "blackStar_tx";

        GameCard.bgRound = 10;

        GameCard.cardTexPosition = new egret.Point( 10, -4 );
        GameCard.betTexPosition = new egret.Point( 130, -4 );
        GameCard.texSize = 18;
        GameCard.texColor = 0x1C0EB9;

        CardGrid.defaultBgColor = 0xFFFFFF;
        CardGrid.defaultNumberSize = 60;

        CardGrid.blinkColors1 = 0xFFFF00;
        CardGrid.blinkColors2 = 0xFF00FF;

        this.needSmallWinTimesOnCard = true;
        this.ballArea.needLightCheck = true;

        this.needListenToolbarStatus = true;
        this.tipStatusTextPosition = new egret.Rectangle( 12, 180, 258, 16 );
        this.tipStatusTextColor = 0xFEFE00;

        GameToolBar.toolBarY = 615;
	}

    protected init(){
        super.init();

        this.addGameTextCenterShadow( 400, 160, 14, 0xFFFFFF, "bet", false, 70, true, false );
        this.addGameTextCenterShadow( 675, 160, 14, 0xFFFFFF, "credit", false, 125, true, false );

        this.addGameTextCenterShadow( 176, 112, 18, 0x00FE00, "credit", false, 54, true, false ).text = "34";
        this.addGameTextCenterShadow( 10, 115, 20, 0xFEFE00, "credit", false, 200, true, false ).text = "0";

        this.betText = this.addGameTextCenterShadow( 391, 193, 14, 0xFEFE00, "bet", false, 92, true, false );
        this.creditText = this.addGameTextCenterShadow( 672, 189, 15, 0xFEFE00, "credit", false, 140, true, false );

        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.runningBallContainer.scaleX = this.runningBallContainer.scaleY = 0.5;
    }
    
    protected getFitEffectNameList(): Object{
        function combinString( str: string ){
            return "card_" + str;
        }

        let firList: Object = {}
        firList["line"] = [];
        firList["line"][0] = combinString( "line1" );
        firList["line"][1] = combinString( "line2" );
        firList["line"][2] = combinString( "line3" );
        firList["double_line"] = [];
        firList["double_line"][0] = combinString( "dbline1" );
        firList["double_line"][1] = combinString( "dbline2" );
        firList["double_line"][2] = combinString( "dbline3" );
        firList["trangle"] = [];
        firList["trangle"][0] = combinString( "trangle" );
        firList["trangle"][1] = combinString( "trangle2" );
        firList["mouse"] = combinString( "mouse" );
        firList["h"] = combinString( "h" );
        firList["ii"] = combinString( "ii" );
        firList["round"] = combinString( "round" );
        firList["bing"] = combinString( "bingo" );
        return firList;
    }

    protected onServerData( data: Object ){
        super.onServerData( data );

        this.removeChild( this.gameToolBar );
        this.gameToolBar = new BackGameToolBar;
		Com.addObjectAt( this, this.gameToolBar, 0, GameToolBar.toolBarY );
		this.gameToolBar.scaleX = 160 / 151;
		this.gameToolBar.scaleY = 1 / 0.77;
		this.gameToolBar.showTip( "" );
        this.addChild( this.pussleProcessBar );

        this.gameToolBar.addEventListener( "winChange", this.winChange, this );
        this.gameToolBar.addEventListener( "tipStatus", this.tipStatus, this );

        this.resetGameToolBarStatus();
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

    protected setSave( saveNumber: number ): void{
        this.addGameText( 493, 160, 14, 0xFFFFFF, "win", false, 70 ).textAlign = "center";
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
    
    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
        let soundName = "";
        switch (paytabledName) {
            case "round": soundName = "bs147_mp3";break;
            case "double_line": soundName = "bs141_mp3";break;
            case "ii": soundName = "bs154_mp3";break;
            case "h": soundName = "bs142_mp3";break;
            case "mouse": 
            case "trangle": 
            case "line": soundName = "bs_line_wav";break;
            case "bing": soundName = "bs143_mp3";break;
            default: break;
        }
        if (SoundManager.soundOn && soundName !== "") {
            this.playSound(soundName, 1, callback);
        } else {
            callback();
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
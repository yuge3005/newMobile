class VipManiaSuper extends V2Game{

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super( gameConfigFile, configUrl, gameId );
        this.ptFilterConfig = "turbomania_filt";

        GameCard.cardTexPosition = new egret.Point( 10, 7 );
        GameCard.betTexPosition = new egret.Point( 130, 7 );
        GameCard.texSize = 15;
        GameCard.texColor = 0xFFFFFF;

        CardGrid.defaultBgColor = 0xFFFFFF;
        CardGrid.defaultNumberSize = 25;

        CardGrid.blinkColors1 = 0xFFFF00;
        CardGrid.blinkColors2 = 0xFF0000;

        BallManager.textStroke = true;

        let languageText = GameUIItem.languageText;
        languageText["bingo"] = { en: "BINGO", es: "BINGO", pt: "BINGO" };
        languageText["double line"] = { en: "DOUBLE LINE", es: "DOBLE LÍNEA", pt: "LINHA DUPLA" };
        languageText["line"] = { en: "LINE", es: "LÍNEA", pt: "LINHA" };
        languageText["four corners"] = { en: "4 CORNERS", es: "4 ESQUINAS", pt: "4 ESQUINAS" };

        this.needListenToolbarStatus = true;
        this.tipStatusTextPosition = new egret.Rectangle( 310, 180, 230, 20 );
        this.tipStatusTextColor = 0xFEFE00;

        PayTableManager.bingoPaytableName = "vip_bingo";
	}

    protected getFitEffectNameList(): Object{
        let firList: Object = {}
        firList["vip_line"] = [];
        firList["vip_line"][0] = this.combinString( "line1" );
        firList["vip_line"][1] = this.combinString( "line2" );
        firList["vip_line"][2] = this.combinString( "line3" );
        firList["vip_double_line"] = [];
        firList["vip_double_line"][0] = this.combinString( "dbline1" );
        firList["vip_double_line"][1] = this.combinString( "dbline2" );
        firList["vip_double_line"][2] = this.combinString( "dbline3" );
        firList["vip_v"] = this.combinString( "v" );
        firList["vip_v2"] = this.combinString( "v2" );
        firList["vip_t"] = this.combinString( "t" );
        firList["vip_gun"] = this.combinString( "gun" );
        firList["vip_mouse"] = this.combinString( "mouse" );
        firList["vip_l"] = this.combinString( "l" );
        firList["vip_h"] = this.combinString( "h" );
        firList["vip_round"] = this.combinString( "round" );
        firList["vip_corner"] = this.combinString( "corner" );
        firList["vip_bingo"] = this.combinString( "bingo" );
		return firList;
	}

	protected combinString( str: string ){
        return "";
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 0, 0 );
        Com.addObjectAt( this, this.runningBallContainer, 336, 283 );
	}
	
    protected clearRunningBallUI(): void{
        if( this.runningBallContainer && this.contains( this.runningBallContainer ) )this.removeChild( this.runningBallContainer );
	}

    protected tipStatus( e: egret.Event ): void{
        super.tipStatus( e, false );
        if( e["status"] == GameCommands.extra ){
            let extraStr: string = "";
            if( e["extraPrice"] ) extraStr += Utils.formatCoinsNumber( e["extraPrice"] );
			else extraStr += GameToolBar.languageText["free"][GlobelSettings.language];
            this.tipStatusText.text = extraStr;
        }
    }

    protected winChange( e: egret.Event ): void{
        super.winChange( e );
        this.prizeText.text = "" + e["winCoins"];
    }

/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 540, 25 ), jackpot, jackpotMinBet, betConfig, new egret.Point( -60, -22 ), new egret.Rectangle( 0, 45, 200, 26 ), 22, 0xFFFF00, new egret.Rectangle( 0, 0, 200, 26 ), 26, 0x775a00 ) );
    }
}
class VipManiaSuper extends V2Game{

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super( gameConfigFile, configUrl, gameId );
        this.languageObjectName = "vipBingoAndTurboMania_tx";

        CardManager.cardType = VipManiaCard;
        CardGrid.defaultNumberSize = 50;
        GameCard.gridOnTop = true;

        this.needListenToolbarStatus = true;
        this.tipStatusTextPosition = new egret.Rectangle( 310, 180, 230, 20 );
        this.tipStatusTextColor = 0xFEFE00;

        PayTableManager.bingoPaytableName = "vip_bingo";
	}

	protected combinString( str: string ){
        return "";
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 0, 0 );
	}

    protected tipStatus( e: egret.Event ): void{
        super.tipStatus( e, false );
        if( e["status"] == GameCommands.extra ){
            let extraStr: string = "";
            if( e["extraPrice"] ) extraStr += Utils.formatCoinsNumber( e["extraPrice"] );
            else extraStr += MuLang.getText("free");
            this.tipStatusText.setText( extraStr );
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
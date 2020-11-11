class VipManiaSuper extends V2Game{

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super( gameConfigFile, configUrl, gameId );
        this.languageObjectName = "vipBingoAndTurboMania_tx";

        CardManager.cardType = VipManiaCard;
        CardManager.gridType = ForkGrid;
        CardGridColorAndSizeSettings.defaultNumberSize = 50;

        PayTableManager.bingoPaytableName = "vip_bingo";
	}

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 0, 0 );
	}

/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1331, 19 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 0, 100, 475, 40 ), 40, 0xFFFF00, new egret.Rectangle( 0, 20, 475, 40 ), 40, 0x3C0405, true ) );
    }
}
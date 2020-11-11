class VipManiaSuper extends V2Game{

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super( gameConfigFile, configUrl, gameId );
        this.languageObjectName = "vipBingoAndTurboMania_tx";

        CardManager.cardType = VipManiaCard;
        CardManager.gridType = ForkGrid;
        CardGridColorAndSizeSettings.defaultNumberSize = 50;

        PayTableManager.bingoPaytableName = "vip_bingo";
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 0, 0 );
	}

    protected afterCheck( resultList: Array<Object> ): void{
		super.afterCheck( resultList );

        if( !this.inLightCheck ){
            this.showUnfitEffect( resultList );
		}
    }

/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1331, 19 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 0, 100, 475, 40 ), 40, 0xFFFF00, new egret.Rectangle( 0, 20, 475, 40 ), 40, 0x3C0405, true ) );
    }

    private showUnfitEffect( resultList: Array<Object> ){
        let unfitGridOnCard: Array<Array<Object>> = [];

        for( let i: number = 0; i < resultList.length; i++ ){
			unfitGridOnCard[i] = [];
			for( let ob in PayTableManager.payTablesDictionary ){
				let result: PaytableCheckResult = resultList[i][ob];

				if( result.unfitIndex >= 0 ){
                    unfitGridOnCard[i].push( { paytalbe:ob, unfits:[result.unfitIndex] } );
				}
				else if( result.unfitIndexs ){
                    let unfitObj: Object = { paytalbe:ob, unfits:[], unfitRules: [] };
                    unfitGridOnCard[i].push( unfitObj );
					for( let unfitItem in result.unfitIndexs ){
                        unfitObj["unfits"].push( result.unfitIndexs[unfitItem] );
                        unfitObj["unfitRules"].push( unfitItem );
					}
				}
			}
		}

        if( PaytableFilter.filterObject ){
			for( let i: number = 0; i < unfitGridOnCard.length; i++ )PaytableFilter.paytableConfixFilter( unfitGridOnCard[i], true );
		}

        for( let i: number = 0; i < 4; i++ ){
            for( let j: number = 0; j < unfitGridOnCard[i].length; j++ ){
                ( CardManager.cards[i] as VipManiaCard ).showunfitEffect( unfitGridOnCard[i][j]["paytalbe"], unfitGridOnCard[i][j]["unfitRules"] );
            }
        }
    }
}
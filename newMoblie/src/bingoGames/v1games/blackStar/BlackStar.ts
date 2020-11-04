class BlackStar extends V1Game{

    protected static get classAssetName(){
		return "blackStar";
	}

    protected static get animationAssetName(){
		return "blackStarArrow";
	}

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

    private tipStatusUI: BlackStarTipStatus;

	public constructor( assetsPath: string ) {
		super( "blackStar.conf", assetsPath, 23 );
        this.languageObjectName = "blackStar_tx";

        CardManager.cardType = BlackStarCard;
        CardManager.gridType = BlackStarGrid;

        GameCardUISettings.showTitleShadow = new egret.GlowFilter(0, 1, 2, 2, 4, 4);
        CardGridColorAndSizeSettings.defaultNumberSize = 60;

        this.needSmallWinTimesOnCard = true;
        this.ballArea.needLightCheck = true;

        this.needListenToolbarStatus = true;
        // this.tipStatusTextPosition = new egret.Rectangle( 12, 180, 258, 16 );
        // this.tipStatusTextColor = 0xFEFE00;

        PayTableManager.paytableUIType = BlackStarPaytableUI;
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();
        if( this.extraUIObject )this.extraUIObject.visible = true;

        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt(this, this.runningBallContainer, 408, 155);

        this.arrowArea = new BlackStarCardArrowLayer( MDS.mcFactory, "", new egret.Point(0, 44), 73 );
        this.addChild( this.arrowArea );

        this.tipStatusUI = new BlackStarTipStatus;
        Com.addObjectAt( this, this.tipStatusUI, 300, 150 );

        this.ganhoCounter = new GanhoCounter( this.showWinAnimationAt.bind( this ) );
    }

    protected onServerData( data: Object ){
        super.onServerData( data );

        if( data["save"] != null ) this.setSave( parseInt( data["save"] ) );

        this.gameToolBar.addEventListener( "winChange", this.winChange, this );
        this.gameToolBar.addEventListener( "tipStatus", this.tipStatus, this );
    }

    protected initToolbar(){
		this.gameToolBar = new BackGameToolBar;
		Com.addObjectAt( this, this.gameToolBar, 0, BingoGameToolbar.toolBarY );
		this.gameToolBar.showTip( "" );

		this.topbar = new Topbar;
		this.addChild( this.topbar );
	}

    protected winChange( event: egret.Event ): void{
        // super.winChange( event );
	}

    protected tipStatus( event: egret.Event ): void{
        switch( event["status"] ){
			case GameCommands.play:
			    break;
			case GameCommands.extra:
                this.tipStatusUI.showExtra( event["extraPrice"] );
			    break;
			default:
				this.tipStatusUI.showPlay();
			    break;
		}
        this.extraPrice = event["extraPrice"];
	}

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 0, 0, 1.5 );
        
        this.playSound("bs_ball_mp3");

        this.tipStatusUI.visible = false;
        clearTimeout( this.timeoutId );
        this.timeoutId = setTimeout( this.clearRunningBallUI.bind( this ), 3000 );
	}

    private timeoutId: number;

    protected clearRunningBallUI(){
        super.clearRunningBallUI();
        this.tipStatusUI.visible = true;
    }

    protected showExtraUI( show: boolean = true ){
		if( this.extraUIObject )this.extraUIObject.visible = !show;
	}

    private setSave( saveNumber: number ): void{
        MDS.addGameText( this, 1568, 165, 36, 0xFFFFFF, "saving", false, 350 ).textAlign = "center";

        this.saveText = MDS.addGameTextCenterShadow( this, 1568, 240, 36, 0xFFFF45, "saving", false, 350, true, false );
        this.saveNumber = saveNumber;
	}

    protected sendExtraRequest( saving: boolean = false ){
        super.sendExtraRequest( saving && this.saveNumber >= this.extraPrice );
    }

    protected showWinAnimationAt(cardId: number, win: number): void{
        ( CardManager.cards[cardId] as BlackStarCard ).showWinCount( win * GameData.currentBet );
    }

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1485, 0 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 80, 40, 240, 30 ), 30, 0xFFFF00 ) );
        this.jackpotArea.jackpotText.textAlign = "left";
        this.jackpotArea.jackpotText.fontFamily = "Arial";
    }

    protected afterCheck( resultList: Array<Object> ): void{
		super.afterCheck( resultList );
        this.arrowArea.arrowBlink(resultList);

        this.ganhoCounter.countGanhoAndPlayAnimation(resultList);

        if( !this.inLightCheck ){
			if( PaytableResultListOprator.missOneCounter( resultList, "bing" ) ){
                this.playSound("bs140_mp3", -1);
			}

            this.showUnfitEffect( resultList );
		}
    }

     protected startPlay(): void {
        super.startPlay();
        this.arrowArea.clearArrow();
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

        ExtraBlinkGrid.extraBink = true;
	}

    protected roundOver(): void {
        super.roundOver();
        this.stopSound("bs_ball_mp3");
        this.stopSound("bs140_mp3");
        
        ExtraBlinkGrid.extraBink = false;
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
                ( CardManager.cards[i] as BlackStarCard ).showunfitEffect( unfitGridOnCard[i][j]["paytalbe"], unfitGridOnCard[i][j]["unfitRules"] );
            }
        }
    }
}
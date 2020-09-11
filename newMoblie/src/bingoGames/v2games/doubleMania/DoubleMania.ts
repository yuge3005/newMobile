class DoubleMania extends V2Game{

    protected static get classAssetName(){
		return "doublemania";
	}

    protected static get animationAssetName(){
		return "doublemaniaAnimation";
	}

	public constructor( assetsPath: string ) {
        super( "doublemania.conf", assetsPath, 62 );
        this.languageObjectName = "doublemania_tx";

        CardManager.cardType = DoubleManiaCard;
        CardManager.gridType = DoubleManiaGrid;
        GameCard.gridOnTop = true;
        CardGrid.defaultNumberSize = 55;

        this.needSmallWinTimesOnCard = true;
        this.ballArea.needLightCheck = true;

        PayTableManager.paytableUIType = DoubleManiaPaytableUI;
        BallManager.ballOffsetY = 10;
        this.needListenToolbarStatus = true;
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();

        let lotto: egret.DisplayObject = this.getChildByName( this.assetStr( "lotto" ) );
        lotto.scaleX = lotto.scaleY = 270 / 211;
        lotto.x -= 30;
        this.addChild( lotto );

        this.tipStatusContainer = new DoubleManiaTipStatus;
        Com.addObjectAt( this, this.tipStatusContainer, 861, 387 );
        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt(this, this.runningBallContainer, 874, 392 );
    }

    protected getFitEffectNameList(): Object{
        let firList: Object = {}
		firList["bingo"] = "WinEffect_bingo";
		firList["round"] = "WinEffect_perimeter";
		firList["ii"] = "WinEffect_twosides";
		firList["fly"] = "WinEffect_doubleH";
		firList["double_line"] = [];
		firList["double_line"][0] = "WinEffect_doubleline0";
        firList["double_line"][1] = "WinEffect_doubleline1";
        firList["double_line"][2] = "WinEffect_doubleline2";
		firList["tt"] = "WinEffect_doubleT";
		firList["xx"] = "WinEffect_doubleV";
		firList["v"] = "WinEffect_v";
        firList["trangle"] = "WinEffect_triangle";
        firList["bao"] = "WinEffect_y";
        firList["guo"] = "WinEffect_doubleZ";
        firList["line"] = [];
        firList["line"][0] = "WinEffect_line0";
        firList["line"][1] = "WinEffect_line1";
        firList["line"][2] = "WinEffect_line2";
		return firList;
	}

    protected winChange( event: egret.Event ): void{
	}

    private tipStatusContainer: DoubleManiaTipStatus;

    protected tipStatus( e: egret.Event ): void{
        this.tipStatusContainer.clearTexts();
        if( e["status"] == GameCommands.extra ){
            this.tipStatusContainer.showStatus( e["extraPrice"] );
        }
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 0, 0 );

        this.playSound("dm_ball_mp3");

        this.delayRemoveRunningBallUI();
	}

    private delayTimeoutId = 0;
    private delayRemoveRunningBallUI(){
        clearTimeout( this.delayTimeoutId );
        this.delayTimeoutId = setTimeout( this.removeRunningBallUI.bind(this), 2000 );
    }

    private removeRunningBallUI(){
        if( this.ebAnimation && this.contains( this.ebAnimation ) ){
            this.delayTimeoutId = setTimeout( this.removeRunningBallUI.bind(this), 3000 );
            return;
        }
        super.clearRunningBallUI();
    }

    private changeCardNumberFirstTime: boolean = true;

    public changeCardsBg(){
        super.changeCardsBg();
        
        if( this.changeCardNumberFirstTime )this.changeCardNumberFirstTime = false;
        else this.playSound("dm_change_card_mp3");
	}

    protected runningWinAnimation( callback: Function, lightResult: Array<Object>, isLastBall: boolean): void{
        let paytableName = "";
        let multiple = 0;
        let lastI: number = -1;
        for( let i = 0; i < lightResult.length; i++ ){
            for (let ob in lightResult[i]) {
                if (!this.lastLightResult[i] || !this.lastLightResult[i][ob] || this.lastLightResult[i][ob].length < lightResult[i][ob].length) {
                    if (multiple < PayTableManager.payTablesDictionary[ob].multiple) {
                        multiple = PayTableManager.payTablesDictionary[ob].multiple;
                        paytableName = PayTableManager.payTablesDictionary[ob].payTableName;
                        lastI = i;
                        if ( paytableName == PayTableManager.bingoPaytableName )this.dispatchEvent(new egret.Event("bingo"));
                    }
                }
            }
        }

        this.lastLightResult = lightResult;

        if( lastI >= 0 ){
            if( PaytableFilter.lightConfixFilter( paytableName, lightResult[lastI] ) ){
                if( callback )callback();
                return;
            }
        }

        if( multiple >= 200 ){
            this.showEb( 1 );
        }
        else if( multiple >= 100 ){
            this.showEb( 0 );
        }

        if(paytableName !== "") {
            if (!isLastBall) {
                this.getResultListToCheck( true );
                this.getPaytablesFit(paytableName, callback);
            } else {
                this.getPaytablesFit(paytableName);
                callback();
            }
        } else callback();

        if( paytableName == "round" || paytableName == "bingo" ){//miniGame
            this.showMiniGame();
        }
	}

    private ebAnimation: egret.MovieClip;

    private showEb( type: number ): void{
        this.removeEb()
        if( type ) this.ebAnimation = Com.addMovieClipAt( this, this._mcf, "doublemaniaDoctor", 825, 348 );
        else this.ebAnimation = Com.addMovieClipAt( this, this._mcf, "funnyFace", 822, 348 );
        setTimeout( this.removeEb.bind(this), 3000 );
    }

    private removeEb(){
        if( this.ebAnimation && this.contains( this.ebAnimation ) )this.removeChild( this.ebAnimation );
    }
/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1302, 0 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 0, 80, 454, 35 ), 35, 0xFFFFFF, null, 0, 0, true ) );
    }

    protected onBetChanged(event: egret.Event): void{
        super.onBetChanged(event);
	}

    protected hasExtraBallFit(): void {
        this.stopSound("dm_extra_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            //this.playSound("extra_mode_start_mp3");
        }

        ExtraBlinkGrid.extraBink = true;
    }

    private roundOverWaitingMiniGame: boolean;

    protected sendRoundOverRequest(){
        if( this.miniGame && this.contains( this.miniGame ) ){
            this.roundOverWaitingMiniGame = true;
        }
        else super.sendRoundOverRequest();
    }

    public onRoundOver( data: Object ){
        super.onRoundOver( data );

        if( data["ganho"] ) this.playSound( "dm_round_over_win_mp3" );
    }
    
    protected roundOver(): void {
        super.roundOver();

        this.tipStatusContainer.clearTexts();

        ExtraBlinkGrid.extraBink = false;
    }

	protected getExtraBallFit(): void {
		//this.playSound("t90_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		this.playSound("dm_collect_mp3");
	}

	protected changeNumberSound(): void {
		this.playSound("dm_change_num_mp3");
	}

    protected startPlay(): void {
        super.startPlay();
        this.removeEb();
    }

    private miniGame: MiniGameInDoubleMania;

    protected showMiniGame(){
        if( this.gameToolBar.autoPlaying ) this.gameToolBar.autoPlaying = false;
        this.miniGame = new MiniGameInDoubleMania;
        this.miniGame.addEventListener( egret.Event.REMOVED_FROM_STAGE, this.onMiniGameRemove, this );
        this.addChild( this.miniGame );
    }

    public quickPlay(): void {
        if( !this.miniGame )super.quickPlay();
	}

    private onMiniGameRemove( e: egret.Event ): void{
        this.miniGame.removeEventListener( egret.Event.REMOVED_FROM_STAGE, this.onMiniGameRemove, this );
        this.miniGame = null;
        if( this.roundOverWaitingMiniGame ){
            super.sendRoundOverRequest();
            this.roundOverWaitingMiniGame = false;
        }
    }
}
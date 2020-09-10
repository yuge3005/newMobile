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

        CardGrid.defaultNumberSize = 55;

        CardGrid.winTimesOffset = new egret.Point( -1, -1 );
        this.needSmallWinTimesOnCard = true;
        this.ballArea.needLightCheck = true;

        this.needListenToolbarStatus = true;
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();

        this.runningBallContainer = new egret.DisplayObjectContainer;
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

    private tipStatusContainer: egret.DisplayObjectContainer;

    protected tipStatus( e: egret.Event ): void{
        if( this.tipStatusContainer )this.tipStatusContainer.removeChildren();
        else this.tipStatusContainer = new egret.DisplayObjectContainer;
        if( e["status"] == GameCommands.extra ){
            let extraStr: string = "";
            if( e["extraPrice"] ) extraStr += Utils.formatCoinsNumber( e["extraPrice"] );
            else extraStr += MuLang.getText("free");
            Com.addBitmapAt( this.tipStatusContainer, this.assetStr("Ball_machine"), 0, 0 );
            Com.addObjectAt( this, this.tipStatusContainer, 320, 239 );
            let tipStatusText: egret.TextField = Com.addTextAt( this.tipStatusContainer, 0, 10, 154, 145, 20, false, true );
            tipStatusText.verticalAlign = "middle";
            tipStatusText.text = extraStr;
            let str: string = MuLang.getText("extra ball");
            let tipStatusTopText: egret.TextField = Com.addTextAt( this.tipStatusContainer, 0, 30, 154, 50, 17, false, true );
            tipStatusTopText.verticalAlign = "middle";
            tipStatusTopText.text = str.substr( 0, str.length - 2 );
            let tipStatusBottomText: egret.TextField = Com.addTextAt( this.tipStatusContainer, 0, 80, 154, 50, 18, false, true );
            tipStatusBottomText.verticalAlign = "middle";
            tipStatusBottomText.text = MuLang.getText("credit");
        }

        if( this.runningBallContainer && this.contains( this.runningBallContainer ) )this.addChild( this.runningBallContainer );
        this.readdObjOnTop();
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 0, 0 );
        Com.addObjectAt(this, this.runningBallContainer, 325, 240);

        this.playSound("dm_ball_mp3");

        this.delayRemoveRunningBallUI();
        this.readdObjOnTop();
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
        if( this.runningBallUI && this.runningBallContainer && ( this.runningBallContainer ).contains( this.runningBallUI ) ){
			( this.runningBallContainer ).removeChild( this.runningBallUI );
		}
    }

    protected clearRunningBallUI(): void{
	}

    private onAnimationComp( event: egret.Event ): void{
        let extraUI : egret.MovieClip = this.extraUIObject as egret.MovieClip;
        extraUI.gotoAndStop( extraUI.totalFrames );
        extraUI.removeEventListener( egret.Event.LOOP_COMPLETE, this.onAnimationComp, this );
    }

    private changeCardNumberFirstTime: boolean = true;

    public changeCardsBg(){
        super.changeCardsBg();
        
        if( this.changeCardNumberFirstTime )this.changeCardNumberFirstTime = false;
        else this.playSound("dm_change_card_mp3");
	}

    protected runningWinAnimation( callback: Function, lightResult: Array<Object> ): void{
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
                        if (paytableName.indexOf("bing") >= 0) this.dispatchEvent(new egret.Event("bingo"));
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

        if( SoundManager.soundOn && paytableName !== "" ){
            this.getResultListToCheck( true );
            this.getPaytablesFit(paytableName, callback);
        } else callback();

        if( paytableName == "round" || paytableName == "bingo" ){//miniGame
            this.showMiniGame();
        }
	}

    private ebAnimation: egret.MovieClip;

    private showEb( type: number ): void{
        this.removeEb()
        if( type ) this.ebAnimation = Com.addMovieClipAt( this, this._mcf, "doublemaniaDoctor", 318, 212 );
        else this.ebAnimation = Com.addMovieClipAt( this, this._mcf, "funnyFace", 324, 240 );
        setTimeout( this.removeEb.bind(this), 3000 );
    }

    private removeEb(){
        if( this.ebAnimation && this.contains( this.ebAnimation ) )this.removeChild( this.ebAnimation );
    }

    private readdObjOnTop(): void{
        if( this.ebAnimation && this.contains( this.ebAnimation ) ) this.addChild( this.ebAnimation );
        if( this.miniGame && this.contains( this.miniGame ) ) this.addChild( this.miniGame );
    }
/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 295, 40 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 1, -28 ), new egret.Rectangle( 0, 0, 215, 25 ), 20, 0xd6c576 ) );
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

        if( this.tipStatusContainer && this.contains( this.tipStatusContainer ) )this.removeChild( this.tipStatusContainer );
        // this.stopSound("t90_ball_mp3");
        // this.stopSound("t90_extra_loop_wav");
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
        this.canQuickPay = false;
        this.miniGame = new MiniGameInDoubleMania;
        this.miniGame.addEventListener( egret.Event.REMOVED_FROM_STAGE, this.onMiniGameRemove, this );
        this.addChild( this.miniGame );
    }

    private canQuickPay: boolean = true;

    public quickPlay(): void {
        if( this.canQuickPay )super.quickPlay();
	}

    private onMiniGameRemove( e: egret.Event ): void{
        this.miniGame.removeEventListener( egret.Event.REMOVED_FROM_STAGE, this.onMiniGameRemove, this );
        this.miniGame = null;
        this.canQuickPay = true;
        if( this.roundOverWaitingMiniGame ){
            super.sendRoundOverRequest();
            this.roundOverWaitingMiniGame = false;
        }
    }
}
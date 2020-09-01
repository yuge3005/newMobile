class Pachinko2 extends V2Game{

    protected static get classAssetName(){
		return "pachinko2";
	}

    protected static get animationAssetName(){
		return "pachinko2Animation";
	}

	public constructor( assetsPath: string ) {
        super( "pachinko2.conf", assetsPath, 61 );
        this.languageObjectName = "forAll_tx";

        CardManager.gridType = TowerGrid;
        GameCard.gridOnTop = true;
        CardGrid.defaultBgColor = 0xFFFFFF;
        CardGrid.defaultNumberSize = 55;

        CardGrid.winTimesOffset = new egret.Point( -1, -1 );

        PaytableUI.textLeft = true;

        this.needSmallWinTimesOnCard = true;
        BingoBackGroundSetting.gameMask = new egret.Rectangle( 0, 0, 2000, 1125 );
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();

        if( this.extraUIObject ) this.extraUIShowNumber();
    }

    protected getFitEffectNameList(): Object{        
        let firList: Object = {}
		firList["bingo"] = "pattern1";
		firList["round"] = "pattern2";
		firList["II"] = "pattern3";
		firList["fly"] = "pattern4";
		firList["double_line"] = [];
		firList["double_line"][0] = "pattern5_1";
        firList["double_line"][1] = "pattern5_2";
        firList["double_line"][2] = "pattern5_3";
		firList["m"] = [];
		firList["m"][0] = "pattern6_1";
        firList["m"][1] = "pattern6_2";
		firList["mouse"] = "pattern7";
		firList["xx"] = "pattern8";
		firList["trangle"] = [];
		firList["trangle"][0] = "pattern9_1";
		firList["trangle"][1] = "pattern9_2";
		firList["plus"] = "pattern10";
		firList["v"] = [];
		firList["v"][0] = "pattern11_1";
		firList["v"][1] = "pattern11_2";
        firList["line"] = [];
        firList["line"][0] = "pattern12_1";
        firList["line"][1] = "pattern12_2";
        firList["line"][2] = "pattern12_3";
		return firList;
	}

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 14, 267, 73 / 45 );

        this.playSound("ball_come_out_mp3");

        this.delayRemoveRunningBallUI();
	}

    private delayTimeoutId = 0;
    private delayRemoveRunningBallUI(){
        clearTimeout( this.delayTimeoutId );
        this.delayTimeoutId = setTimeout( this.removeRunningBallUI.bind(this), 3000 );
    }

    private removeRunningBallUI(){
        if( this.runningBallUI && this.runningBallContainer && ( this.runningBallContainer ).contains( this.runningBallUI ) ){
			( this.runningBallContainer ).removeChild( this.runningBallUI );
		}
    }

    protected clearRunningBallUI(): void{
	}

    protected extraUIShowNumber(){
        this.extraUIObject.visible = true;
        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.runningBallContainer.x = this.extraUIObject.x;
        this.runningBallContainer.y = this.extraUIObject.y;
        this.addChildAt( this.runningBallContainer, this.getChildIndex( this.extraUIObject ) );
        Com.addObjectAt( this.runningBallContainer, this.extraUIObject, 0, 0 );

        Com.addMovieClipAt( this.runningBallContainer, this._mcf, "pachinko2_cat", 25, 275 );
        this.extraUIObject = Com.addMovieClipAt( this, this._mcf, "pachinko2Extra", 287, 158 );
        this.extraUIObject.visible = false;
        this.addChildAt( this.extraUIObject, this.getChildIndex( this.ballArea ) );
    }

    protected showExtraUI( show: boolean = true ){
        if( this.extraUIObject ){
            let extraUI : egret.MovieClip = this.extraUIObject as egret.MovieClip;
            if( extraUI.visible != show ){
                extraUI.visible = show;
                if( show ){
                    extraUI.gotoAndPlay( 1 );
                    extraUI.addEventListener( egret.Event.LOOP_COMPLETE, this.onAnimationComp, this );
                    var tw: egret.Tween = egret.Tween.get( this.runningBallContainer );
                    tw.to( { y: -240 }, 500 );
                }
                else{
                    var tw: egret.Tween = egret.Tween.get( this.runningBallContainer );
                    tw.to( { y: -7 }, 500 );
                }
            }
        }
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
        else this.playSound("change_cards_mp3");
	}
/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 607, 25 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, -1 ), new egret.Rectangle( 0, 0, 160, 20 ), 20, 0xd6c576, new egret.Rectangle( 0, -22, 160, 18 ), 18, 0xFFFFFF ) );
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "bingo": soundName = "win_bingo_mp3";break;
            case "round": soundName = "win_perimeter_mp3";break;
            case "II": soundName = "win_double_triangle_mp3";break;
            case "fly": soundName = "win_mw_mp3";break;
            case "double_line": soundName = "win_double_line_mp3";break;
            case "m": soundName = "win_m_mp3";break;
            case "mouse": soundName = "win_square_mp3";break;
            case "xx": soundName = "win_double_v_mp3"; break;
            case "trangle": soundName = "win_triangle_mp3"; break;
            case "plus": soundName = "win_cross_mp3"; break;
            case "v": soundName = "win_v_mp3"; break;
            case "line": soundName = "win_line_mp3"; break;
            default: break;
        }
        if (SoundManager.soundOn && soundName !== "") {
            this.playSound(soundName, 1, callback);
        } else {
			if( callback )callback();
        }
	}

    protected onBetChanged(event: egret.Event): void{
        super.onBetChanged(event);
	}

    protected hasExtraBallFit(): void {
        this.stopSound("extra_ball_come_out_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("extra_mode_start_mp3");
        }
    }

    public onRoundOver( data: Object ){
        super.onRoundOver( data );

        if( data["ganho"] ) this.playSound( "CASH_Any_Win_End_of_Round_mp3" );
    }
    
    protected roundOver(): void {
        super.roundOver();
        // this.stopSound("t90_ball_mp3");
        // this.stopSound("t90_extra_loop_wav");
    }

	protected getExtraBallFit(): void {
		// this.playSound("t90_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		this.playSound("CASH_Any_Win_End_of_Round_mp3");
	}

	protected changeNumberSound(): void {
		// this.playSound("t90_card_mp3");
	}
}
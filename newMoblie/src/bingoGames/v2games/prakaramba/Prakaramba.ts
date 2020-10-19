class Prakaramba extends V2Game{

    protected static get classAssetName(){
		return "prakaramba";
	}

    protected static get animationAssetName(){
		return "showballAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "prakaramba.conf", assetsPath, 48 );
        this.ptFilterConfig = "prakaramba_filt";

        GameCard.cardTexPosition = new egret.Point( 10, 2 );
        GameCard.betTexPosition = new egret.Point( 110, 2 );
        GameCard.texSize = 15;
        GameCard.texColor = 0x0;

        GameCard.gridOnTop = true;

        CardGrid.defaultBgColor = 0xE7EEF2;
        CardGrid.defaultNumberSize = 22;

        CardGrid.blinkColors1 = 0xFFFF00;
        CardGrid.blinkColors2 = 0xFF00FF;
        GameCard.useRedEffect = true;

        this.needSmallWinTimesOnCard = true;
        this.ballArea.needLightCheck = true;

        this.needListenToolbarStatus = true;
        this.tipStatusTextPosition = new egret.Rectangle( 57, 225, 142, 14 );
        this.tipStatusTextColor = 0xFEFEFE;

        PayTableManager.bingoPaytableName = "pra_bingo";
	}

    protected init(){
        super.init();

        this.addGameTextCenterShadow( 57, 68, 17, 0xFEFE00, "bet", false, 140, true, false );
        this.addGameTextCenterShadow( 57, 113, 17, 0xFEFE00, "credit", false, 140, true, false );
        this.addGameTextCenterShadow( 57, 158, 17, 0xFEFE00, "prize", true, 140, true, false );

        this.betText = this.addGameTextCenterShadow( 57, 89, 17, 0xFEFEFE, "bet", false, 140, true, false );
        this.creditText = this.addGameTextCenterShadow( 57, 137, 16, 0xFEFEFE, "credit", false, 140, true, false );
        this.prizeText = this.addGameTextCenterShadow( 57, 184, 17, 0xFFFFFF, "prize", false, 140, true, false );
        this.prizeText.text = "0";

        this.gameUnderLine();

        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.runningBallContainer.scaleX = this.runningBallContainer.scaleY = 0.8;
    }

	protected getFitEffectNameList(): Object{
        function combinString( str: string ){
            return "fundo_pay_" + str;
        }

        let firList: Object = {}
        firList["pra_line"] = [];
        firList["pra_line"][0] = combinString( "line1" );
        firList["pra_line"][1] = combinString( "line2" );
        firList["pra_line"][2] = combinString( "line3" );
        firList["pra_v"] = [];
        firList["pra_v"][0] = combinString( "v1" );
        firList["pra_v"][1] = combinString( "v2" );
        firList["plus"] = combinString( "plus" );;
        firList["pra_trangle"] = [];
        firList["pra_trangle"][0] = combinString( "trangle1" );
        firList["pra_trangle"][1] = combinString( "trangle2" );
        firList["pra_x"] = combinString( "x" );;
        firList["pra_mouse"] = combinString( "mouse" );
        firList["pra_m"] = [];
        firList["pra_m"][0] = combinString( "m1" );
        firList["pra_m"][1] = combinString( "m2" );
        firList["pra_fly"] = combinString( "fly" );
        firList["pra_xx"] = combinString( "xx" );
        firList["pra_round"] = combinString( "round" );
        firList["pra_bing"] = combinString( "bingo" );
		return firList;
	}

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 0, 0 );
        Com.addObjectAt(this, this.runningBallContainer, 114, 272);
        
        this.playSound("prak3_wav");
	}

    protected clearRunningBallUI(): void{
        if( this.runningBallContainer && this.contains( this.runningBallContainer ) )this.removeChild( this.runningBallContainer );
	}

    protected listenToGameToolbarStatus(): void{
        super.listenToGameToolbarStatus();
        this.tipStatusText.verticalAlign = "middle";
        this.tipStatusText.height = 28;
    }

    protected tipStatus( e: egret.Event ): void{
        super.tipStatus( e, true );
    }

    protected winChange( e: egret.Event ): void{
        // super.winChange( e, true );
        this.prizeText.text = "" + e["winCoins"];
    }

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 53, 10 ), jackpot, jackpotMinBet, betConfig, new egret.Point( -6, 7 ), new egret.Rectangle( 0, 25, 120, 14 ), 14, 0xFEFEFE, new egret.Rectangle( 0, 0, 120, 14 ), 14, 0xFEFE00 ) );
    }

    protected getPaytablesFit(paytabledName: string, callback: Function = null): void{
		let soundName = "";
        switch (paytabledName) {
            case "pra_trangle": 
            case "pra_plus": 
            case "pra_v": 
            case "pra_line": 
            case "pra_x": 
            case "pra_mouse": soundName = "prak16_mp3"; break;
            case "pra_round": soundName = "prak15_mp3"; break;
            case "pra_xx": soundName = "prak24_mp3"; break;
            case "pra_bingo": soundName = "prak28_mp3"; break;
            case "pra_m": soundName = "prak22_mp3"; break;
            case "pra_double_line": soundName = "prak19_mp3"; break;
            case "pra_fly": soundName = "prak21_mp3"; break;
            default: break;    
        }
        if (SoundManager.soundOn && soundName !== "") {
            this.playSound(soundName, 1, callback);
        } else {
            callback();
        }
	}

    protected hasExtraBallFit(): void {
        this.stopSound("prak3_wav");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("prak29_mp3");
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("prak3_wav");
    }

	protected getExtraBallFit(): void {
		this.playSound("prak9_mp3");
	}

	protected collectExtraBall(): void {
		this.playSound("prak8_mp3");
	}
}
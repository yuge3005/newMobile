class DoubleTurbo90 extends V2Game{

    private paytableBg: DoubleTurbo90PTBG;
    private paytableTitles: Array<TextLabel>;

    protected static get classAssetName(){
		return "doubleTurbo90";
	}

    protected static get animationAssetName(){
		return "turbo90Animation";
	}

	public constructor( assetsPath: string ) {
		super( "doubleTurbo90.conf", assetsPath, 57 );
        this.languageObjectName = "doubleTurbo90_tx";

        PaytableUI.textBold = true;

		GameCard.gridOnTop = true;

        CardManager.cardType = DoubleTurbo90Card;
        CardManager.gridType = Turbo90Grid;
        
        CardGrid.defaultNumberSize = 32;
        GameCard.useRedEffect = true;

        this.ballArea.needLightCheck = true;
        BallManager.ballOffsetY = 3;
        BallManager.textBold = true;
    }

    protected init(){
        super.init();

        this.paytableTitles = [];
        this.paytableTitles[0] = this.addDouble90GameText( 34, "bingo");
        this.paytableTitles[1] = this.addDouble90GameText( 72, "double line");
        this.paytableTitles[2] = this.addDouble90GameText( 110, "line");
        this.paytableTitles[3] = this.addDouble90GameText( 148, "four corners");

        this.showNoBetAndCredit();

        let cardAreaBg: egret.Bitmap = Com.addBitmapAt( this, "cards_background_png", 814, 127 );
        this.setChildIndex( cardAreaBg, this.getChildIndex( this.cardArea ) );
        cardAreaBg.width = 968;
        cardAreaBg.height = 810;

        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.coverRunningBall = Com.addBitmapAt( this.runningBallContainer, this.assetStr( "ball_eject" ), 0, 0 );
        Com.addObjectAt(this, this.runningBallContainer, 401, 252);
    }

    private addDouble90GameText( yPos: number, textItem: string ): TextLabel{
        let tx: TextLabel = this.addGameText( 315, yPos, 30, 0x46C8F5, textItem, false, 200, "", 0.9 );
        tx.fontFamily = "Arial";
        tx.bold = true;
        return tx;
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt( ballIndex, 24, 5, 2.8 );
        Com.addObjectAt( this.runningBallContainer, this.coverRunningBall, 0, 0 );
        // Com.addObjectAt(this, this.runningBallContainer, 401, 252);
        
        this.playSound("t90_ball_mp3");
	}

    protected afterCheck( resultList: Array<Object> ): void{
        this.clearPaytableFgs();
        super.afterCheck( resultList );
    }

    protected startPlay(): void {
        super.startPlay();
        this.clearPaytableFgs();
    }

/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayerForDoubleTurbo90( new egret.Point( 1300, 0 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 76, 80, 320, 50 ), 40, 0xFFC123 ) );
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "line": soundName = "t90_line_mp3";
                this.dropCoinsAt( 516, 128, 1 );
                break;
            case "double line": soundName = "t90_double_line_mp3";
                this.dropCoinsAt( 516, 90, 2 );
                break;
            case "four corners": soundName = "t90_4corners_mp3";
                this.dropCoinsAt( 516, 168, 1 );
                break;
            case "bingo": soundName = "t90_bingo_mp3";
                this.dropCoinsAt( 516, 51, 3 );
                break;
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

        if (event.data["type"] !== 0) this.playSound("t90_bet_mp3");
	}

    protected hasExtraBallFit(): void {
        this.stopSound("t90_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("t90_extra_loop_mp3", -1);
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("t90_extra_loop_mp3");
    }

    protected getExtraBallFit(): void {
		this.playSound("t90_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
		this.playSound("t90_card_mp3");
	}

    protected addPayTables(){
        this.paytableBg = new DoubleTurbo90PTBG;
        Com.addObjectAt( this, this.paytableBg, 283, 16 );

        super.addPayTables();

        let pts: Object = PayTableManager.payTablesDictionary;
        for( let payTable in pts ){
            let pos: Object = pts[payTable].position;
            let y: number = pos["y"];
            y = Math.floor( y / 38 ) * 38 + 34;
            pts[payTable].UI.y = y;
            pts[payTable].UI.x = 600;
            pts[payTable].UI.addEventListener( "paytableFitEvent", this.payTableFit, this );
            let tx: egret.TextField = pts[payTable].UI["tx"];
            tx.width = 110;
            tx.textAlign = "right";
        }
	}

    private payTableFit( event: egret.Event ){
        let str: string = event.target["tx"].text;
        if( str == "x1000" ) this.paytableShow( 0 );
        else if( str == "x100" ) this.paytableShow( 1 );
        else if( str == "x4" ) this.paytableShow( 2 );
        else if( str == "x1" ) this.paytableShow( 3 );
    }

    private clearPaytableFgs(){
        this.paytableBg.clearPaytableFgs();
        for( let i: number = 0; i < 4; i++ ){
            this.paytableTitles[i].textColor = 0x46C8F5;
        }
    }

    private paytableShow( index: number ){
        this.paytableBg.showPt( index );
        this.paytableTitles[index].textColor = 0x0;
    }
}
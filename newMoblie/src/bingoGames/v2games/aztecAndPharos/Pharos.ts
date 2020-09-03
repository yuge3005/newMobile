class Pharos extends AztecPharosSuper{

	protected static get classAssetName(){
		return "pharos";
	}

    protected static get animationAssetName(){
		return "pharosAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "pharos.conf", assetsPath, 42 );
        this.megaName = "pharo_mega";

        CardGrid.defaultNumberSize = 50;

        BallManager.ballOffsetY = 8;
        BallManager.textBold = true;
	}

    protected init(){
        super.init();

        this.buildPattenText( ["bingo", "three side", "two side", "one side" ] );

        this.buildSuperEbArea( "mega_" + GlobelSettings.language, 427, 16 );
    }

    private buildPattenText( pattenNames: Array<string> ){
        this.pharosPattenTexts = [];
        for( let i: number = 0; i < pattenNames.length; i++ ){
            this.pharosPattenTexts[i] = MDS.addGameText( this, 295, 505 + i * 41, 35, 0xE8D4AF, pattenNames[i], false, 180, "", 0.9 );
            this.pharosPattenTexts[i].fontFamily = "Arial";
            this.pharosPattenTexts[i].stroke = 2;
            this.pharosPattenTexts[i].strokeColor = 0x6F5D2D;
        }
    }

    protected buildSuperEbArea( superEbBgName: string, superEbAreaX: number, superEbAreaY: number ): void{
        this.superExtraBg = Com.addBitmapAt( this.runningBallContainer, this.assetStr( superEbBgName ), superEbAreaX, superEbAreaY );
        this.superExtraBg.width = 174;
        this.superExtraBg.height = 174;
        this.superExtraBg.visible = false;
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt(ballIndex, 427, 16);
        
        if( !this.ballRunforStop )this.playSound("pr_ball_mp3");
        if (this.btExtra && (this.currentBallIndex === this.gratisNumber - 1)) this.playSound("pr_free_extra_ball_mp3");
	}

    protected getGratisUI(): egret.DisplayObject{
        return Com.addMovieClipAt( this, this._mcf, "pharos", 0, 0 );
    }

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 261, 374 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 70, 30, 260, 38 ), 30, 0xFFFFE3 ) );
        this.jackpotArea.textBold = false;
    }

    protected onBetChanged(event: egret.Event): void{
        super.onBetChanged(event);
        
        if (event.data["type"] !== 0) this.playSound("pr_bet_mp3");
	}

    protected hasExtraBallFit(): void {
        this.stopSound("pr_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("pr_have_extra_ball_mp3");
            this.showFreeExtraPosition();
        }

        if( this.isMegaBall ){
            this.superExtraBg.visible = true;
            this.gameToolBar.megeExtraOnTop( true );
            this.runningBallContainer.addChild( this.superExtraBg );

            this.tryFirstMega( new egret.Rectangle( 74, 85, 88, 88 ) );
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("pr_ball_mp3");

        CardManager.stopAllBlink();
    }

	protected getExtraBallFit(): void {
		this.playSound("pr_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		this.playSound("pr_collect_mp3");
	}

	protected changeNumberSound(): void {
		this.playSound("pr_card_mp3");
	}

    protected addPayTables(){
		super.addPayTables();

        let pts: Object = PayTableManager.payTablesDictionary;
        for( let payTable in pts ){
			let pos: Object = pts[payTable].position;
            let y: number = pos["y"];
            y = Math.floor( y / 41 ) * 41 + 15;
			pts[payTable].UI.y = y;
            pts[payTable].UI.x = 450;
            pts[payTable].UI.addEventListener( "paytableFitEvent", this.payTableFit, this );
            let tx: egret.TextField = pts[payTable].UI["tx"];
            tx.width = 136;
            tx.textAlign = "right";
		}
	}

    private payTableFit( event: egret.Event ){
        let str: string = event.target["tx"].text;
        if( !this.pharosPattenBlickCount ) this.pharosPattenBlickCount = [];
        if( str == "x1000" ) this.pharosPattenBlickCount[0] = 0;
        else if( str == "x200" ) this.pharosPattenBlickCount[1] = 0;
        else if( str == "x70" ) this.pharosPattenBlickCount[2] = 0;
        else if( str == "x3" ) this.pharosPattenBlickCount[3] = 0;
        this.addEventListener( egret.Event.ENTER_FRAME, this.onPaytableBlink, this );
    }

    protected onPaytableBlink( egret: egret.Event ){
        for( let i: number = 0; i < 4; i++ ){
            if( isNaN( this.pharosPattenBlickCount[i] ) ) continue;
            this.pharosPattenBlickCount[i] ++;
            if( (this.pharosPattenBlickCount[i]>>4) % 2 ){
                this.pharosPattenTexts[i].textColor = 0xE8D4AF;
            }
            else{
                this.pharosPattenTexts[i].textColor = 0xFF0000;
            }
        }
    }

    protected showFreeExtraPosition(){
        super.showFreeExtraPosition();
        this.addChildAt( this.gratisUI, this.getChildIndex( this.ballArea ) );
    }
}
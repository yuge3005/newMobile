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

        TowerGrid.blink1PicName = "Image-262-1";
        TowerGrid.blink2PicName = "Image-264-1";
        TowerGrid.defaultBgPicName = "Image-260-1";
        TowerGrid.onEffBgPicName = "Image-269-1";
        TowerGrid.linePicName = "Image-264-1";

        CardGrid.defaultBgColor = 0xFFFFFF;
        CardGrid.defaultNumberSize = 50;

        BingoBackGroundSetting.defaultScale = false;
        BingoBackGroundSetting.gameMask = new egret.Rectangle( 0, 0, 2000, 1125 );
	}

    protected init(){
        super.init();

        this.buildPattenText( ["bingo", "three side", "two side", "one side" ] );

        this.buildSuperEbArea( "mega_" + GlobelSettings.language, 427, 16 );
    }

    private buildPattenText( pattenNames: Array<string> ){
        this.pharosPattenTexts = [];
        for( let i: number = 0; i < pattenNames.length; i++ ){
            this.pharosPattenTexts[i] = this.addGameText( 295, 505 + i * 41, 35, 0xE8D4AF, pattenNames[i], false, 180, "", 0.9 );
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
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "one side": soundName = "pr_1side_mp3";
                break;
            case "two side": soundName = "pr_2side_mp3";
                break;
            case "bingo": soundName = "pr_bingo_mp3";
                break;
            case "three side": soundName = "pr_3side_mp3";
                break;
            default: break;
        }
        if (soundName !== "") {
            if( SoundManager.soundOn ){
                this.playSound(soundName, 1, callback);
            }
            else setTimeout( callback, 1000 );
        } else {
            callback();
        }
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
        if( str == "x1000" ) this.pharosPattenTexts[0].textColor = 0xFF0000;
        else if( str == "x200" ) this.pharosPattenTexts[1].textColor = 0xFF0000;
        else if( str == "x70" ) this.pharosPattenTexts[2].textColor = 0xFF0000;
        else if( str == "x3" ) this.pharosPattenTexts[3].textColor = 0xFF0000;
    }
}
class Turbo90 extends V2Game{

    protected static get classAssetName(){
		return "turbo90";
	}

    protected static get animationAssetName(){
		return "turbo90Animation";
	}

	public constructor( assetsPath: string ) {
		super( "turbo90.conf", assetsPath, 39 );
        this.languageObjectName = "turbo90_tx";
        this.megaName = "turbo90_mega";

        PaytableUI.textBold = true;
        PaytableUI.needBlick = false;

        CardManager.cardType = Turbo90Card;
        CardManager.gridType = Turbo90Grid;

        GameCard.showTitleShadow = new egret.GlowFilter(0, 1, 2, 2, 4 );
        CardGrid.defaultNumberSize = 55;

        BallManager.ballOffsetY = 2;
        BallManager.rotateBall = true;

        BingoBackGroundSetting.defaultScale = false;
        BingoBackGroundSetting.gameMask = new egret.Rectangle( 0, 0, 2000, 1125 );
	}

    protected init(){
        super.init();

        this.turbo90Text( "bingo", 395 );
        this.turbo90Text( "double line", 525 );
        this.turbo90Text( "line", 655 );
        this.turbo90Text( "four corners", 785 );

        this.showNoBetAndCredit();
        this.addChild( this.getChildByName( this.assetStr( "path_tip" ) ) );

        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.addChild( this.runningBallContainer );
        this.runningBallContainer.mask = new egret.Rectangle( 255, 68, 270, 270 );
        this.coverRunningBall = this.getChildByName( this.assetStr("wheel_eject") );

        this.buildSuperEbArea( "mega_" + GlobelSettings.language, 447, 222 );

        this.addLineArrows();
    }

    protected buildSuperEbArea( superEbBgName: string, superEbAreaX: number, superEbAreaY: number ): void{
        this.superExtraBg = Com.addBitmapAt( this.runningBallContainer, this.assetStr( superEbBgName ), superEbAreaX, superEbAreaY );
        this.superExtraBg.width = 68;
        this.superExtraBg.height = 68;
        this.superExtraBg.visible = false;
    }

    protected getFitEffectNameList(): Object{
        let firList: Object = {}
        firList["line"] = [];
        firList["line"][0] = "turbo90_1";
        firList["line"][1] = "turbo90_2";
        firList["line"][2] = "turbo90_3";
        firList["double line"] = [];
        firList["double line"][0] = "turbo90_D_1";
        firList["double line"][1] = "turbo90_D_2";
        firList["double line"][2] = "turbo90_D_3";
		return firList;
	}

    private turbo90Text( str: string, yPos: number ): egret.TextField{
        let tx: TextLabel = Com.addLabelAt( this, 957, yPos, 166, 35, 35, true, false );
        tx.textColor = 0xECFFAC;
        tx.bold = true;
        tx.stroke = 2;
        tx.strokeColor = 0x213510;
        tx.setText( MuLang.getText(str) );
        return tx;
    }

    private arrowMcs: Array<Array<egret.MovieClip>>;

    private addLineArrows(): void{
        this.arrowMcs = [];
        for( let i: number = 0; i < 4; i++ ){
            this.arrowMcs[i] = [];
            for( let j: number = 0; j < 3; j++ ){
                let arrowAnimation: egret.MovieClip = Com.addMovieClipAt( this, this._mcf, "arrowAnimationInT90", this.cardPositions[i]["x"] - 52, this.cardPositions[i]["y"] + 72 * ( j + 1 ) - 7 );
                arrowAnimation.stop();
                arrowAnimation.visible = false;
                this.arrowMcs[i][j] = arrowAnimation;
            }
        }
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        this.showLastBallAt( ballIndex, 289, 68 );

        if( !this.ballRunforStop )this.playSound("t90_ball_mp3");
	}

    protected showLastBallAt( ballIndex: number, x: number, y: number, scale: number = 1 ): void{
		this.clearRunningBallUI();
		this.runningBallUI = this.ballArea.getABall( ballIndex );
        this.runningBallUI.scaleX = this.runningBallUI.scaleY = 200 / 68;
		Com.addObjectAt( this.runningBallContainer, this.runningBallUI, x, y );

        this.runningBallContainer.addChild( this.coverRunningBall );

        clearTimeout( this.timeoutId );
        this.timeoutId = setTimeout( this.clearRunningBallUI.bind( this ), 3000 );
	}

    private timeoutId: number;

    protected afterCheck( resultList: Array<Object> ): void{
        this.clearPaytableFgs();
        super.afterCheck( resultList );
        this.clearArrow();
        for( let i: number = 0; i < 4; i++ ){
            if( resultList[i]["line"] && resultList[i]["line"]["unfitIndexs"] ){
                for( let line in resultList[i]["line"]["unfitIndexs"] ){
                    let arrow: egret.MovieClip = this.arrowMcs[i][line];
                    arrow.visible = true;
                    arrow.gotoAndPlay(1);
                }
            }
        }
    }

    private clearArrow(): void{
        for( let i: number = 0; i < 4; i++ ){
            for( let j: number = 0; j < 3; j++ ){
                let arrow: egret.MovieClip = this.arrowMcs[i][j];
                arrow.visible = false;
                arrow.stop();
            }
        }
    }

    protected startPlay(): void {
        super.startPlay();
        this.clearArrow();
        this.clearPaytableFgs();
    }

/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1318, -2 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 110, 50, 300, 40 ), 40, 0xFFC609 ) );
        this.jackpotArea.textBold = false;
        this.jackpotArea.jackpotText.textAlign = "left";
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "double line": soundName = "t90_double_line_mp3";
                this.dropCoinsAt( 1036, 560, 2 );
                break;
            case "four corners": soundName = "t90_4corners_mp3";
                this.dropCoinsAt( 1036, 815, 1 );
                break;
            case "bingo": soundName = "t90_bingo_mp3";
                this.dropCoinsAt( 1036, 428, 3 );
                break;
            case "line": soundName = "t90_line_mp3";
                this.dropCoinsAt( 1036, 685, 1 );
                break;
            default: break;
        }
        if (soundName !== "") {
            this.waitingForEffect = true;
            if( SoundManager.soundOn ){
                this.playSound(soundName, 1, this.waitForEffect.bind(this));
            }
            else{
                setTimeout( this.waitForEffect.bind(this), 1500 );
            }
        } else {
            callback();
        }
	}

    protected onBetChanged(event: egret.Event): void{
        super.onBetChanged(event);
        
        if (event.data["type"] !== 0) this.playSound("t90_bet_mp3");
	}

    protected hasExtraBallFit(): void {
        this.stopSound("t90_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("t90_extra_loop_mp3");
        }

        if( this.isMegaBall ){
            this.superExtraBg.visible = true;
            this.gameToolBar.megeExtraOnTop( true );

            this.tryFirstMega( new egret.Rectangle( 245, 226, 33, 33 ) );
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("t90_ball_mp3");
        this.stopSound("t90_extra_loop_wav");
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
        this.addPayTableWinBg();

		super.addPayTables();

        let pts: Object = PayTableManager.payTablesDictionary;
        for( let payTable in pts ){
			let pos: Object = pts[payTable].position;
            let y: number = pos["y"];
            y = Math.floor( y / 130 ) * 130 + 40;
			pts[payTable].UI.y = y;
            pts[payTable].UI.x = 957;
            pts[payTable].UI.addEventListener( "paytableFitEvent", this.payTableFit, this );
            let tx: egret.TextField = pts[payTable].UI["tx"];
            tx.width = 166;
            tx.textAlign = "center";
            tx.stroke = 1;
            tx.strokeColor = 0;
		}
	}

    private paytableFgs: Array<egret.Bitmap>;

    private addPayTableWinBg(){
        let winBg: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, winBg, 938, 364 );
        this.paytableFgs = [];
        for( let i: number = 0; i < 4; i++ ){
            this.paytableFgs[i] = Com.addBitmapAt( winBg, this.assetStr("paytable_fg"), 0, -8 + 130 * i );
            this.paytableFgs[i].visible = false;
        }
        let winBgMask: egret.Bitmap = Com.addBitmapAt( this, this.assetStr("paytable_bg"), 938, 364 );
        winBg.mask = winBgMask;
    }

    private payTableFit( event: egret.Event ){
        let str: string = event.target["tx"].text;
        if( str == "x1000" ) this.paytableFgs[0].visible = true;
        else if( str == "x100" ) this.paytableFgs[1].visible = true;
        else if( str == "x4" ) this.paytableFgs[2].visible = true;
        else if( str == "x1" ) this.paytableFgs[3].visible = true;
    }

    private clearPaytableFgs(){
        for( let i: number = 0; i < 4; i++ ){
            this.paytableFgs[i].visible = false;
        }
    }
}
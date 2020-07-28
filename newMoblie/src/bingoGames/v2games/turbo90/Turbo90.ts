class Turbo90 extends V2Game{

    protected static get classAssetName(){
		return "turbo90";
	}

    protected static get animationAssetName(){
		return "turbo90Animation";
	}

	public constructor( assetsPath: string ) {
		super( "turbo90.conf", assetsPath, 39 );
        this.ptFilterConfig = "turbo90_filt";

        PaytableUI.textBold = true;

        CardManager.cardType = Turbo90Card;

        GameCard.cardTexPosition = new egret.Point( 25, 12 );
        GameCard.betTexPosition = new egret.Point( 270, 12 );
        GameCard.texSize = 35;
        GameCard.texColor = 0xFFFFFF;
        GameCard.showTitleShadow = new egret.DropShadowFilter(1, 0, 0x000000, 1, 2, 2);

        CardGrid.defaultBgColor = 0xFFFFFF;
        CardGrid.defaultNumberSize = 55;

        CardGrid.blinkColors1 = 0xFFFF00;
	    CardGrid.blinkColors2 = 0xFF00FF;
        GameCard.useRedEffect = true;

        let languageText = GameUIItem.languageText;
        languageText["bingo"] = { en: "BINGO", es: "BINGO", pt: "BINGO" };
        languageText["double line"] = { en: "D.LINE", es: "D.LÍNEA", pt: "LINHA.D" };
        languageText["line"] = { en: "LINE", es: "LÍNEA", pt: "LINHA" };
        languageText["four corners"] = { en: "4 CORNERS", es: "4 ESQUINAS", pt: "4 ESQUINAS" };

        BallManager.ballOffsetY = 2;

        GameToolBar.toolBarY = 920;
        BingoBackGroundSetting.defaultScale = false;
        BingoBackGroundSetting.gameMask = new egret.Rectangle( 0, 0, 2000, 1125 );
	}

    protected init(){
        super.init();

        this.turbo90Text( "bingo", 405 );
        this.turbo90Text( "double line", 525 );
        this.turbo90Text( "line", 645 );
        this.turbo90Text( "four corners", 765 );

        this.showNoBetAndCredit();
        this.addChild( this.getChildByName( this.assetStr( "path_tip" ) ) );

        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.addChild( this.runningBallContainer );
        this.runningBallContainer.mask = new egret.Rectangle( 255, 68, 270, 270 );
        this.coverRunningBall = this.getChildByName( this.assetStr("wheel_eject") );

        this.buildSuperEbArea( "mega_" + GlobelSettings.language, 119, 58 );

        this.addLineArrows();
    }

    private turbo90Text( str: string, yPos: number ): egret.TextField{
        let tx: egret.TextField = Com.addTextAt( this, 945, yPos, 200, 30, 30, true, false );
        tx.textColor = 0xECFFAC;
        tx.bold = true;
        tx.stroke = 2;
        tx.strokeColor = 0x213510;
        tx.scaleX = 0.93;
        tx.text = GameUIItem.languageText[str][GlobelSettings.language];
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

        this.playSound("t90_ball_mp3");
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
    }

/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 540, 16 ), jackpot, jackpotMinBet, betConfig, new egret.Point( -15, -15 ), new egret.Rectangle( 0, 40, 200, 26 ), 26, 0xFFC609, new egret.Rectangle( 0, 0, 200, 26 ), 26, 0xd6c576 ) );
        this.jackpotArea.textBold = false;
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "double line": soundName = "t90_double_line_mp3";break;
            case "four corners": soundName = "t90_4corners_mp3";break;
            case "bingo": soundName = "t90_bingo_mp3";break;
            case "line": soundName = "t90_line_mp3"; break;
            default: break;
        }
        if (SoundManager.soundOn && soundName !== "") {
            this.playSound(soundName, 1, callback);
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
            this.playSound("t90_extra_loop_wav", -1);
        }

        if( this.isMegaBall ){
            this.superExtraBg.visible = true;
            this.gameToolBar.megeExtraOnTop( true );

            if( localStorage.getItem( "turbo90_mega" ) ) return;
            else{
                localStorage.setItem( "turbo90_mega", "true" );
                let ev: egret.Event = new egret.Event( "megaFirst" );
                ev.data = new egret.Rectangle( 287, 196, 45, 45 );
                this.dispatchEvent( ev );
            }
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

    protected onServerData( data: Object ){
        super.onServerData( data );
        if( localStorage.getItem( "turbo90_mega" ) ) return;
        else{
            try{
                // RES.loadGroup( "megaForFirst_" + GlobelSettings.language );
            }catch(e){}
        }
    }
}
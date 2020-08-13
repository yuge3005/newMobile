class Nineball extends V2Game{

    protected static get classAssetName(){
        return "nineball";
    }

    protected static get animationAssetName(){
        return "nineballAnimation";
    }

    public constructor( assetsPath: string ) {
        super( "nineball.conf", assetsPath, 38 );
        this.ptFilterConfig = "nineball_filt";
        this.languageObjectName = "nineball_tx";
        this.megaName = "nineball_mega";

        PaytableUI.textBold = true;

        CardManager.cardType = NineballCard;
        CardManager.gridType = NineballGrid;

        TowerGrid.blink1PicName = "card_number_fill_red";
        TowerGrid.blink2PicName = "card_number_fill_green";
        TowerGrid.defaultBgPicName = "card_number_fill_white";
        TowerGrid.onEffBgPicName = "card_number_fill_blue";
        TowerGrid.linePicName = "card_number_fill_red";

        GameCard.cardTextRect = new egret.Rectangle( 25, 17, 220, 35 );
        GameCard.betTextRect = new egret.Rectangle( 270, 17, 340, 35 );
        GameCard.texColor = 0xFFFFFF;
        GameCard.showTitleShadow = new egret.GlowFilter(0, 1, 2, 2, 4, 4);
        GameCard.clickChangeNumber = true;

        GameCard.gridOnTop = true;

        CardGrid.defaultBgColor = 0xFFFFFF;
        CardGrid.defaultNumberSize = 55;

        CardGrid.blinkColors1 = 0xFF0000;
	    CardGrid.blinkColors2 = 0x00FF00;
        GameCard.useRedEffect = true;

        BallManager.ballOffsetY = 8;

        BingoBackGroundSetting.defaultScale = false;
        BingoBackGroundSetting.gameMask = new egret.Rectangle( 0, 0, 2000, 1125 );
    }

    protected init(){
        super.init();

        this.nineballText( "bingo", 420 );
        this.nineballText( "double", 590 );
        this.nineballText( "line", 760 );

        this.showNoBetAndCredit();

        if( this.extraUIObject ) this.extraUIShowNumber();

        this.buildSuperEbArea( "mega_" + GlobelSettings.language, 54, 19 );

        this.addLineArrows();
    }

    protected buildSuperEbArea( superEbBgName: string, superEbAreaX: number, superEbAreaY: number ): void{
        this.superExtraBg = Com.addBitmapAt( this.runningBallContainer, this.assetStr( superEbBgName ), superEbAreaX, superEbAreaY );
        this.superExtraBg.width = 115;
        this.superExtraBg.height = 115;
        this.superExtraBg.visible = false;
    }

    private nineballText( str: string, yPos: number ): egret.TextField{
        let tx: TextLabel = Com.addLabelAt( this, 900, yPos, 200, 35, 35, true, false );
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
                let isLeft: boolean = ( i & 1 ) == 0;
                let arrowAnimation: egret.MovieClip = Com.addMovieClipAt( this, this._mcf, isLeft ? "nineball_arrow_right" : "nineball_arrow_left", this.cardPositions[i]["x"] + ( isLeft ? 600 : -45 ), this.cardPositions[i]["y"] + 70 * ( j + 1 ) + 5 );
                arrowAnimation.stop();
                arrowAnimation.visible = false;
                this.arrowMcs[i][j] = arrowAnimation;
            }
        }
    }

    protected showExtraUI( show: boolean = true ){
        if( this.extraUIObject ){
            let tw: egret.Tween = egret.Tween.get( this.extraUIObject );
            if( !show )tw.to( { x: 267 }, 500 );
            else{
                if( this.currentBallIndex == 36 )tw.to( { x: 518 }, 500 );
            }
        }
        if( !show )if( !show && this.gratisUI && this.contains( this.gratisUI ) )this.removeChild( this.gratisUI );
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        this.showLastBallAt(ballIndex, 46, 9);
        
        if( !this.ballRunforStop )this.playSound("nb_ball_mp3");
	}

    protected showLastBallAt( ballIndex: number, x: number, y: number, scale: number = 1 ): void{
        if( this.runningBallUI && ( this.runningBallContainer ).contains( this.runningBallUI ) ){
            ( this.runningBallContainer ).removeChild( this.runningBallUI );
        }
        this.runningBallUI = this.ballArea.getABall( ballIndex );
        this.runningBallUI.scaleX = this.runningBallUI.scaleY = scale;
        this.runningBallUI.x = x;
        this.runningBallUI.y = y;
        this.runningBallContainer.addChildAt( this.runningBallUI, 1 );
        if( this.currentBallIndex > 42 ) this.runningBallContainer.addChild( this.runningBallUI );//mega ball on top
    }

    protected showMissExtraBall( balls: Array<number> ){
        if( this.currentBallIndex == 42 ){
            if( balls && balls[0] ){
                super.showLastBall( balls[0] );
                this.showLastBallAt( balls[0], 46, 9 );

                let cross: egret.Shape = new egret.Shape;
                let a: number = this.runningBallUI.width;
                cross.graphics.lineStyle( Math.floor( a * 0.07 ), 0xFF0000 );
                let startOffset: number = ( 2 - Math.SQRT2 ) * 0.25 * a;
                cross.graphics.moveTo( startOffset, startOffset );
                cross.graphics.lineTo( this.runningBallUI.width - startOffset, this.runningBallUI.height - startOffset );
                cross.graphics.moveTo( this.runningBallUI.width - startOffset, startOffset );
                cross.graphics.lineTo( startOffset, this.runningBallUI.height - startOffset );
                this.runningBallUI.filters = [ MatrixTool.colorMatrixLighter( 0.5 ) ];
                this.runningBallUI.addChild( cross );
            }
        }
        else{
            super.showMissExtraBall( balls );
        }
        if( this.extraUIObject ){
            let tw: egret.Tween = egret.Tween.get( this.extraUIObject );
            tw.to( { x: 518 }, 200 );
        }
    }

    protected getGratisUI(): egret.DisplayObject{
		return Com.addMovieClipAt( this, this._mcf, "nineball_m", 0, 0 );
	}

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
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1276, 15 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 85, 42, 320, 40 ), 40, 0xFFFFFF ) );
        this.jackpotArea["jackpotText"].textAlign = "left";
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "double": soundName = "nb_2line_mp3";
                this.dropCoinsAt( 1000, 628 );
                break;
            case "bingo": soundName = "nb_bingo_mp3";
                this.dropCoinsAt( 1000, 455 );
                break;
            case "line": soundName = "nb_1line_mp3";
                this.dropCoinsAt( 1000, 792 );
                break;
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

        if (event.data["type"] !== 0) this.playSound("nb_bet_mp3");
	}

	protected hasExtraBallFit(): void {
		this.stopSound("nb_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.showFreeExtraPosition();
        }

        if( this.isMegaBall ){
            this.superExtraBg.visible = true;
            this.gameToolBar.megeExtraOnTop( true );

            this.tryFirstMega( new egret.Rectangle( 280, 102, 54, 54 ) );
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("nb_ball_mp3");
        this.stopSound("nb_1to_bingo_mp3");
    }

	protected getExtraBallFit(): void {
		this.playSound("nb_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		this.playSound("nb_collect_mp3");
	}

	protected changeNumberSound(): void {
		this.playSound("nb_card_mp3");
	}

    protected addPayTables(){
        this.addPayTableWinBg();

		super.addPayTables();

        let pts: Object = PayTableManager.payTablesDictionary;
        for( let payTable in pts ){
			let pos: Object = pts[payTable].position;
            let y: number = pos["y"];
            y = Math.floor( y / 170 ) * 170 + 120;
			pts[payTable].UI.y = y;
            pts[payTable].UI.x = 912;
            pts[payTable].UI.addEventListener( "paytableFitEvent", this.payTableFit, this );
            let tx: egret.TextField = pts[payTable].UI["tx"];
            tx.width = 172;
            tx.textAlign = "center";
            tx.stroke = 1;
            tx.strokeColor = 0;
		}
	}

    private paytableFgs: Array<egret.Bitmap>;

    private addPayTableWinBg(){
        let winBg: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, winBg, 896, 360 );
        this.paytableFgs = [];
        for( let i: number = 0; i < 3; i++ ){
            this.paytableFgs[i] = Com.addBitmapAt( winBg, this.assetStr("paytable_fg"), 5, 6 + 173 * i );
            this.paytableFgs[i].scaleX = this.paytableFgs[i].scaleY = 196 / 249;
            this.paytableFgs[i].visible = false;
        }
        let winBgMask: egret.Bitmap = Com.addBitmapAt( this, this.assetStr("paytable_bg"), 896, 360 );
        winBg.mask = winBgMask;
    }

    private payTableFit( event: egret.Event ){
        let str: string = event.target["tx"].text;
        if( str == "x1000" ) this.paytableFgs[0].visible = true;
        else if( str == "x100" ) this.paytableFgs[1].visible = true;
        else if( str == "x4" ) this.paytableFgs[2].visible = true;
    }

    private clearPaytableFgs(){
        for( let i: number = 0; i < this.paytableFgs.length; i++ ){
            this.paytableFgs[i].visible = false;
        }
    }
}
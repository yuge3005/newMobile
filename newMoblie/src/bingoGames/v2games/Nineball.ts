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

        PaytableUI.textBold = true;

        GameCard.cardTextRect = new egret.Rectangle( 20, 8, 200, 15 );
        GameCard.betTextRect = new egret.Rectangle( 130, 8, 300, 15 );
        GameCard.texColor = 0x0;

        GameCard.gridOnTop = true;

        CardGrid.defaultBgColor = 0xFFFFFF;
        CardGrid.defaultNumberSize = 26;

        CardGrid.blinkColors1 = 0xFF0000;
	    CardGrid.blinkColors2 = 0x00FF00;
        GameCard.useRedEffect = true;

        GameToolBar.toolBarY = 920;
        BingoBackGroundSetting.defaultScale = false;
        BingoBackGroundSetting.gameMask = new egret.Rectangle( 0, 0, 2000, 1125 );
    }

    protected init(){
        super.init();

        this.addGameText( 270, 8, 25, 0x585858, "bingo",false, 200 );
        this.addGameText( 270, 36, 25, 0x585858, "double",false, 200 );
        this.addGameText( 270, 64, 25, 0x585858, "line",false, 200 );

        this.showNoBetAndCredit();

        if( this.extraUIObject ) this.extraUIShowNumber();

        this.buildSuperEbArea( "mega_" + GlobelSettings.language, 26, 13 );

        this.addLineArrows();
    }

    protected buildSuperEbArea( superEbBgName: string, superEbAreaX: number, superEbAreaY: number ): void{
        this.superExtraBg = Com.addBitmapAt( this.runningBallContainer, this.assetStr( superEbBgName ), superEbAreaX, superEbAreaY );
        this.superExtraBg.visible = false;
    }

    private arrowMcs: Array<Array<egret.MovieClip>>;

    private addLineArrows(): void{
        this.arrowMcs = [];
        for( let i: number = 0; i < 4; i++ ){
            this.arrowMcs[i] = [];
            for( let j: number = 0; j < 3; j++ ){
                let isLeft: boolean = ( i & 1 ) == 0;
                let arrowAnimation: egret.MovieClip = Com.addMovieClipAt( this, this._mcf, isLeft ? "nineball_arrow_right" : "nineball_arrow_left", this.cardPositions[i]["x"] + ( isLeft ? 320 : -22 ), this.cardPositions[i]["y"] + 26 * ( j + 1 ) );
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
        
        this.playSound("nb_ball_mp3");
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
            tw.to( { x: 125 }, 200 );
        }
    }

    protected getGratisUI(): egret.DisplayObject{
		return Com.addMovieClipAt( this, this._mcf, "nineball_m", 0, 0 );
	}

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
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 532, 10 ), jackpot, jackpotMinBet, betConfig, new egret.Point( -2, 20 ), new egret.Rectangle( 0, 37, 190, 22 ), 22, 0xFFFFFF, new egret.Rectangle( 0, 0, 190, 20 ), 20, 0x585858 ) );
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "double": soundName = "nb_2line_mp3";break;
            case "bingo": soundName = "nb_bingo_mp3";break;
            case "line": soundName = "nb_1line_mp3";break;
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

            if( localStorage.getItem( "nineball_mega" ) ) return;
            else{
                localStorage.setItem( "nineball_mega", "true" );
                let ev: egret.Event = new egret.Event( "megaFirst" );
                ev.data = new egret.Rectangle( 318, 150, 67, 67 );
                this.dispatchEvent( ev );
            }
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
        
    protected onServerData( data: Object ){
        super.onServerData( data );
        if( localStorage.getItem( "nineball_mega" ) ) return;
        else{
            try{
                // RES.loadGroup( "megaForFirst_" + GlobelSettings.language );
            }catch(e){}
        }
    }
}
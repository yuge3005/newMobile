class Nineball extends V2Game{

    protected static get classAssetName(){
        return "nineball";
    }

    protected static get animationAssetName(){
        return "nineballAnimation";
    }

    public constructor( assetsPath: string ) {
        super( "nineball.conf", assetsPath, 38 );
        this.languageObjectName = "nineball_tx";
        this.megaName = "nineball_mega";

        PaytableUI.textBold = true;
        PaytableUI.needBlink = false;
        PayTableManager.layerType = NineballPaytableLayer;

        CardManager.cardType = NineballCard;

        GameCard.showTitleShadow = new egret.GlowFilter(0, 1, 2, 2, 4, 4);
        GameCard.gridOnTop = true;

        CardGrid.defaultNumberSize = 55;

        GameCard.useRedEffect = true;

        BallManager.ballOffsetY = 8;
    }

    protected init(){
        super.init();

        this.showNoBetAndCredit();

        if( this.extraUIObject ) this.extraUIShowNumber();

        this.buildSuperEbArea( "mega_" + GlobelSettings.language, 54, 19 );

        this.arrowArea = new NineballCardArrowLayer( this._mcf, "", this.cardPositions, new egret.Point(0, 75), 70 );
        this.addChild( this.arrowArea );
    }

    protected buildSuperEbArea( superEbBgName: string, superEbAreaX: number, superEbAreaY: number ): void{
        this.superExtraBg = Com.addBitmapAt( this.runningBallContainer, this.assetStr( superEbBgName ), superEbAreaX, superEbAreaY );
        this.superExtraBg.width = 115;
        this.superExtraBg.height = 115;
        this.superExtraBg.visible = false;
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
        this.payTableArea.clearPaytableFgs();
        super.afterCheck( resultList );
        this.arrowArea.clearArrow();
        for( let i: number = 0; i < 4; i++ ){
            if( resultList[i]["line"] && resultList[i]["line"]["unfitIndexs"] ){
                for( let line in resultList[i]["line"]["unfitIndexs"] ){
                    this.arrowArea.arrowBlink( i, Number(line) );
                }
            }
        }
    }

    protected startPlay(): void {
        super.startPlay();
        this.arrowArea.clearArrow();
        this.payTableArea.clearPaytableFgs();
    }

/******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1276, 15 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 85, 42, 320, 40 ), 40, 0xFFFFFF ) );
        this.jackpotArea.jackpotText.textAlign = "left";
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
        super.getPaytablesFit( paytabledName, callback );
        switch (paytabledName) {
            case "double": this.dropCoinsAt( 1000, 628, 2 ); break;
            case "bingo": this.dropCoinsAt( 1000, 455, 3 ); break;
            case "line": this.dropCoinsAt( 1000, 792, 1 ); break;
            default: break;    
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
}
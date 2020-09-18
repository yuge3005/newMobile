class Pachinko extends V2Game{

    protected static get classAssetName(){
        return "pachinko";
    }

    protected static get animationAssetName(){
        return "pachinkoAnimation";
    }

    private winText: egret.TextField;
    private blinkSpArray: Array<egret.Sprite>;

    public constructor( assetsPath: string ) {
        super("pachinko.conf", assetsPath, 41);
        this.languageObjectName = "pachinko_tx";
        this.megaName = "turbo90_mega";

        this.gratisUIIsOverExtraUI = true;
        
        this.blinkSpArray = new Array<egret.Sprite>();

        PayTableManager.layerType = PachinkoPaytableLayer;

        GameCard.zeroUI = "pachinko_cat";

        CardManager.cardType = PachinkoCard;
        CardManager.gridType = PachinkoGrid;
        GameCard.gridOnTop = true;
        CardGrid.defaultNumberSize = 55;

        PayTableManager.paytableUIType = PachinkoPaytableUI;
        BallManager.ballOffsetY = 5;

        this.needListenToolbarStatus = true;
        this.tipStatusTextPosition = new egret.Rectangle( 515, 56, 260, 14 );
        this.tipStatusTextColor = 0xFEFE00;

        this.needSmallWinTimesOnCard = true;
        this.ballArea.needLightCheck = true;

        PayTableManager.bingoPaytableName = "pachinko_bingo";
        BingoBackGroundSetting.gameMask = new egret.Rectangle( 0, 0, 2560, 1440 );
        BingoGameToolbar.toolBarY = 1152;
    }

    protected init(){
        super.init();

        this.tileBg();
        this.showNoBetAndCredit();

        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, this.runningBallContainer, 996, 154 );
        
        this.ballCountText = MDS.addGameTextCenterShadow( this, 1445, 204, 55, 0x88FF88, "", false, 100, true, false );
        this.ballCountText.fontFamily = "Arial";

        this.buildSuperEbArea( "mega_" + GlobelSettings.language, 457, 94 );

        this.letsPachinko();

        this.ganhoCounter = new GanhoCounter( this.showWinAnimationAt.bind( this ) );
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt(ballIndex, 0, 0, 17 / 7 );

        this.playSound("pck_ball_mp3");

        if (this.btExtra && (this.currentBallIndex === this.gratisNumber - 1)) this.playSound("pck_free_extra_mp3");
    }

    protected getGratisUI(): egret.DisplayObject{
		return Com.addMovieClipAt( this, this._mcf, "pachinkoCat", 0, 0 );;
	}

    protected clearRunningBallUI(): void{
        super.clearRunningBallUI();
        this.ballCountText.text = "";
    }

    protected showExtraUI( show: boolean = true ){
        super.showExtraUI( show );
        if( !show && this.gratisUI && this.contains( this.gratisUI ) )this.removeChild( this.gratisUI );
    }

	protected winChange( event: egret.Event ): void{
	}

	protected tipStatus( event: egret.Event ): void{
        super.tipStatus( event );
	}

    protected updateCredit( data: Object ): void{
        super.updateCredit( data );
	}

    /*********************************************************************************************************************************************************/

    public static pachinkoString: string = "pachinko";

    private pachinkoLetters1: PachinkoLetterLayer;
    private pachinkoLetters2: PachinkoLetterLayer;
    private currentPachinkoStr: string;
    private hasPachinkoLetter: boolean;

    private betProgress: Array<Object>;

    protected setLetras( letrasData: string ):void{
        let ar: Array<string> = letrasData.match( /\d+-\d/g );
        this.betProgress = [];
        if( ar && ar.length ){
            for( let i: number = 0; i < ar.length; i++ ){
                let tempArr: Array<string> = ar[i].split( "-" );
                this.betProgress[i] = { bet: tempArr[0], letterIndex: parseInt( tempArr[1] ) };
            }
        }

        this.setLettersByBet();
    }

    private letsPachinko():void{
        this.pachinkoLetters1 = new PachinkoLetterLayer;
        Com.addObjectAt( this, this.pachinkoLetters1, 1202, 203 );
        this.pachinkoLetters2 = new PachinkoLetterLayer;
        Com.addObjectAt( this, this.pachinkoLetters2, 372, 45 );
        this.pachinkoLetters2.scaleX = this.pachinkoLetters2.scaleY = 1.72;

        ExtraBlinkGrid.extraBink = true;
        PachinkoGrid.setGridMatrix();
    }

    private getPaytableIndex( bet: number ): number{
        let letterIndex: number = 0;
        for( let i: number = this.betProgress.length - 1; i >= 0; i-- ){
            if( bet - 1 == this.betProgress[i]["bet"] ){
                letterIndex = this.betProgress[i]["letterIndex"];
                break;
            }
        }
        return letterIndex;
    }

    private addPachinkoPaytable( index: number ): void{
        this.currentPachinkoStr = Pachinko.pachinkoString[index];
        ( this.payTableArea as PachinkoPaytableLayer ).addCurrentPaytable( index );
    }

    protected paytableResultFilter( resultList: Array<Object> ): void{
        PachinkoPtSettings.filtOneLineAndCorner( resultList );
        super.paytableResultFilter( resultList );
    }

    protected afterCheck( resultList: Array<Object> ): void{
        super.afterCheck( resultList );

        let pachinkoStr: string = Pachinko.pachinkoString;
        let hasPachinkoPaytable: boolean = false;
        for( let i: number = 0; i < resultList.length; i++ ){
            let result: PaytableCheckResult = resultList[i][pachinkoStr + "_" + this.currentPachinkoStr ];
            if( result.fit || result.fits ){
                hasPachinkoPaytable = true;
            }
        }

        if( hasPachinkoPaytable && !this.hasPachinkoLetter ){
            this.hasPachinkoLetter = true;
            this.showPachinkoLetterAnimation();
        }

        this.ganhoCounter.countGanhoAndPlayAnimation(resultList);
    }

    protected showWinAnimationAt(cardId: number, win: number): void{
        let blinkSp: egret.Sprite = new egret.Sprite;
        Com.addObjectAt( this, blinkSp, CardManager.cards[cardId].x, CardManager.cards[cardId].y );
        let tx: egret.TextField = Com.addTextAt( blinkSp, 5, 4, 220, 15, 15, false, true );
        tx.textAlign = "left";
        tx.text = MuLang.getText("win") + " " + ( win * GameData.currentBet );
        let outRect: egret.Rectangle = new egret.Rectangle( 0, 0, 203, 177 );
        let inRect: egret.Rectangle = new egret.Rectangle( 5, 21, 193, 151 );
        this.drawOutRect(blinkSp, 0xFFFF00, outRect, inRect);
        this.blinkSpArray.push(blinkSp);
        tx.textColor = 0;
        let tw: egret.Tween = egret.Tween.get( blinkSp );
        tw.wait( 500 );
        tw.call( () => { this.drawOutRect( blinkSp, 0xFF0000, outRect, inRect ); tx.textColor = 0xFFFFFF; } );
        tw.wait( 500 );
        tw.call( () => { this.drawOutRect( blinkSp, 0xFFFF00, outRect, inRect ); tx.textColor = 0; } );
        tw.wait( 500 );
        tw.call( () => { this.drawOutRect( blinkSp, 0xFF0000, outRect, inRect ); tx.textColor = 0xFFFFFF; } );
        tw.wait( 500 );
        tw.call( () => { this.drawOutRect( blinkSp, 0xFFFF00, outRect, inRect ); tx.textColor = 0; } );
        tw.wait( 500 );
        tw.call( () => { this.drawOutRect( blinkSp, 0xFF0000, outRect, inRect ); tx.textColor = 0xFFFFFF; } );
        tw.wait( 500 );
        tw.call( () => { this.drawOutRect( blinkSp, 0xFFFF00, outRect, inRect ); tx.textColor = 0; } );
        tw.wait( 500 );
        tw.call( () => { this.drawOutRect( blinkSp, 0xFF0000, outRect, inRect ); tx.textColor = 0xFFFFFF; } );
        tw.wait( 500 );
        tw.call( () => { this.drawOutRect( blinkSp, 0xFFFF00, outRect, inRect ); tx.textColor = 0; } );
        tw.wait( 500 );
        tw.call( () => { this.drawOutRect( blinkSp, 0xFF0000, outRect, inRect ); tx.textColor = 0xFFFFFF; } );
        tw.wait( 500 );
        tw.call( () => { blinkSp.parent.removeChild( blinkSp ) } );
    }

    private drawOutRect( sp: egret.Sprite, color: number, rectOut: egret.Rectangle, rectIn: egret.Rectangle ): void{
        let pts: Array<egret.Rectangle> = [];
        pts.push( new egret.Rectangle( rectOut.x, rectOut.y, rectOut.width, rectIn.y - rectOut.y ) );
        pts.push( new egret.Rectangle( rectOut.x, rectIn.y, rectIn.x - rectOut.x, rectIn.height ) );
        pts.push( new egret.Rectangle( rectIn.right, rectIn.y, rectOut.right - rectIn.right, rectIn.height ) );
        pts.push( new egret.Rectangle( rectOut.x, rectIn.bottom, rectOut.width, rectOut.bottom - rectIn.bottom ) );
        GraphicTool.drawRectangles( sp, pts, color, true );
    }

    private showPachinkoLetterAnimation(): void{
        let pachinkoStr: string = Pachinko.pachinkoString;
        let i: number = pachinkoStr.indexOf( this.currentPachinkoStr );
        this.pachinkoLetters1.showPachinkoLetterAnimation( i );
        this.pachinkoLetters2.showPachinkoLetterAnimation( i );
    }

    protected onBetChanged( event: egret.Event ): void{
        this.setLettersByBet();
        super.onBetChanged(event);
        
        if (event.data["type"] !== 0) this.playSound("pck_bet_mp3");
    }

    private setLettersByBet(): void{
        let pachinkoPaytableIndex: number = this.getPaytableIndex( GameData.currentBet );

        this.pachinkoLetters1.setPachinkoLetter( pachinkoPaytableIndex );
        this.pachinkoLetters2.setPachinkoLetter( pachinkoPaytableIndex );
        this.addPachinkoPaytable( pachinkoPaytableIndex );
    }

    private resetLetterIndex( letra: number ){
        if( this.hasPachinkoLetter ){
            this.hasPachinkoLetter = false;

            let index: number = NaN;
            for( let i: number = this.betProgress.length - 1; i >= 0; i-- ){
                if( GameData.currentBet - 1 == this.betProgress[i]["bet"] ){
                    index = this.betProgress[i]["letterIndex"];
                    index += 1;
                    if( index >= Pachinko.pachinkoString.length && letra == 0 ){
                        this.runPachinkoGetAllLetterAnimation( i );
                    }
                    else{
                        this.betProgress[i]["letterIndex"] = letra;
                        this.setLettersByBet();
                    }
                    break;
                }
            }

            if( isNaN( index ) ){
                this.betProgress.push( { bet: GameData.currentBet - 1, letterIndex: 1 } );
                this.setLettersByBet();
            }
        }
    }

    private runPachinkoGetAllLetterAnimation( betProgressIndex: number ){
        this.addChild( this.pachinkoLetters1 );
        this.playSound( "pck_pachinko_mp3" );
        this.pachinkoLetters1.runPachinkoGetAllLetterAnimation( this.afterGetAllLetters.bind(this, betProgressIndex) );
    }

    private afterGetAllLetters( betProgressIndex: number ){
        this.betProgress[betProgressIndex]["letterIndex"] = 0;
        this.setLettersByBet();
    }

    protected showSmallWinResult( cardIndex: number, blinkGrids: Object ): void{
        this.paytableRuleFilter( blinkGrids );

        for( let index in blinkGrids ){
            let winTimes: number = 0;
            for( let j: number = 0; j < blinkGrids[index].length; j++ ){
                let winTimesTxt: string = PayTableManager.payTablesDictionary[blinkGrids[index][j]].ui["tx"].text;
                winTimes += parseFloat( winTimesTxt.replace( /\D/, "" ) );
            }
            CardManager.setSmallWinTime( cardIndex, parseInt( index ), winTimes );
        }
    }

    protected paytableRuleFilter( blinkGrids ): void{
        for( let gridId in blinkGrids ){
            let blinkGridsArray: Array<string> = blinkGrids[gridId] as Array<string>;
            if( blinkGridsArray.length > 1 ){
                let newArr: Array<string> = [];
                let unNeedIndex: number = blinkGridsArray.indexOf( "pachinko_" + this.currentPachinkoStr );
                if( unNeedIndex >= 0 ){
                    newArr.push( blinkGridsArray[unNeedIndex] );
                    blinkGridsArray.splice( unNeedIndex, 1 );
                }
                let bingoIndex: number = blinkGridsArray.indexOf( "pachinko_bingo" );
                if( bingoIndex >= 0 ){
                    newArr.push( "pachinko_bingo" );
                    blinkGridsArray.length = 0;
                }
                let line1Index: number = blinkGridsArray.indexOf( "pachinko_1l" );
                if( line1Index >= 0 ){
                    blinkGridsArray.splice( line1Index, 1 );
                }

                if( blinkGridsArray.length > 1 ){
                    PaytableFilter.paytableConfixFilter( blinkGridsArray );
                }
                
                blinkGrids[gridId] = newArr.concat( blinkGridsArray );
            }
        }
    }

    public onRoundOver( data: Object ){
        super.onRoundOver( data );
        this.resetLetterIndex( data["letra"] );
    }

    public onCancelExtra( data: Object ){
        super.onCancelExtra( data );
        this.resetLetterIndex( data["letra"] );
	}

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 522, 16 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, -6 ), new egret.Rectangle( 0, 0, 197, 26 ), 22, 0xFFFF00 ) );
    }

    protected hasExtraBallFit(): void {
        this.stopSound("pck_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("pck_have_extra_ball_mp3");
            this.showFreeExtraPosition();
        }

        if( this.isMegaBall ){
            this.superExtraBg.visible = true;
            this.gameToolBar.megeExtraOnTop( true );

            this.tryFirstMega( new egret.Rectangle( 626, 233, 30, 30 ) );
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("pck_ball_mp3");
    }

	protected getExtraBallFit(): void {
		this.playSound("pck_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		this.playSound("pck_collect_mp3");
	}

	protected changeNumberSound(): void {
		this.playSound("pck_card_mp3");
	}

	protected startPlay(): void {
        super.startPlay();
        
        for (let i = 0; i < this.blinkSpArray.length; i++) {
            if (this.blinkSpArray[i]) {
                egret.Tween.removeTweens(this.blinkSpArray[i]);
                if (this.blinkSpArray[i].parent) {
                    this.blinkSpArray[i].parent.removeChild(this.blinkSpArray[i]);
                }
                this.blinkSpArray[i] = null;
            }
        }
        this.blinkSpArray = new Array<egret.Sprite>();
	}
}
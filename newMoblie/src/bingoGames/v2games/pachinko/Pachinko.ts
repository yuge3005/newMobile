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
        this.ptFilterConfig = "pachinko_filt";

        this.gratisUIIsOverExtraUI = true;
        
        this.blinkSpArray = new Array<egret.Sprite>();

        GameCard.bgRound = 4;

        GameCard.cardTexPosition = new egret.Point( 6, 2 );
        GameCard.betTexPosition = new egret.Point(75, 2);
        GameCard.texSize = 16;
        GameCard.texColor = 0xFFFFFF;
        GameCard.zeroUI = "pachinko_cat";

        CardManager.cardType = PachinkoCard;
        CardManager.gridType = PachinkoGrid;

        CardGrid.defaultBgColor = 0xFFFFFF;
        CardGrid.defaultNumberSize = 20;

        CardGrid.blinkColors1 = 0xFFFF00;
        CardGrid.blinkColors2 = 0xFF00FF;

        let languageText = GameUIItem.languageText;
        languageText["bingo"] = { en: "BINGO", es: "BINGO", pt: "BINGO" };
        languageText["double line"] = { en: "DOUBLE LINE", es: "DOBLE LÍNEA", pt: "LINHA DUPLA" };
        languageText["line"] = { en: "LINE", es: "LÍNEA", pt: "LINHA" };
        languageText["four corners"] = { en: "4 CORNERS", es: "4 ESQUINAS", pt: "4 ESQUINAS" };

        languageText["win"] = { en: "WIN", es: "CANADO", pt: "CANHO" };

        BallManager.ballOffsetY = 3;

        this.needListenToolbarStatus = true;
        this.tipStatusTextPosition = new egret.Rectangle( 515, 56, 260, 14 );
        this.tipStatusTextColor = 0xFEFE00;

        this.needSmallWinTimesOnCard = true;
        this.ballArea.needLightCheck = true;

        GameToolBar.toolBarY = 474;
        BingoBackGroundSetting.defaultScale = false;

        PayTableManager.bingoPaytableName = "pachinko_bingo";
    }

    protected init(){
        super.init();

        this.showNoBetAndCredit();

        this.addGameText( 46, 58, 17, 0xFFFFFF, "win", true, 100 );

        this.winText = this.addGameText( 85, 58, 17, 0xFEFE00, "win", false, 185 );
        this.winText.textAlign = "right";
        this.winText.text = "0";

        this.runningBallContainer = new egret.DisplayObjectContainer;
        
        this.ballCountText = this.addGameText( 455, 46, 15, 0x88FF88, "bet", false, 38 );
        this.ballCountText.textAlign = "center";
        this.ballCountText.text = "";

        let normalText: egret.TextField = Com.addTextAt( this, 335, 26 + BrowserInfo.textUp, 90, 13, 13, false, true );
        normalText.text = "NORMAL";
        normalText.textColor = 0;

        this.buildSuperEbArea( "mega_" + GlobelSettings.language, 457, 94 );

        this.letsPachinko();

        this.ganhoCounter = new GanhoCounter( this.showWinAnimationAt.bind( this ) );
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        this.showLastBallAt(ballIndex, 0, 0);
        Com.addObjectAt( this, this.runningBallContainer, 260, 15 );

        this.playSound("pck_ball_mp3");

        if (this.btExtra && (this.currentBallIndex === this.gratisNumber - 1)) this.playSound("pck_free_extra_mp3");
    }

    protected showLastBallAt( ballIndex: number, x: number, y: number, scale: number = 1 ): void{
		if( this.runningBallUI && ( this.runningBallContainer ).contains( this.runningBallUI ) ){
			( this.runningBallContainer ).removeChild( this.runningBallUI );
		}
		this.runningBallUI = this.ballArea.getABigBall( ballIndex, "_small", 36 );
		this.runningBallUI.scaleX = this.runningBallUI.scaleY = scale;
		Com.addObjectAt( this.runningBallContainer, this.runningBallUI, x, y );
	}

    protected getGratisUI(): egret.DisplayObject{
		return Com.addMovieClipAt( this, this._mcf, "pachinkoCat", 0, 0 );;
	}

    protected clearRunningBallUI(): void{
        if( this.runningBallContainer && this.contains( this.runningBallContainer ) )this.removeChild( this.runningBallContainer );

        this.ballCountText.text = "";
    }

    protected showExtraUI( show: boolean = true ){
        super.showExtraUI( show );
        if( !show && this.gratisUI && this.contains( this.gratisUI ) )this.removeChild( this.gratisUI );
    }

	protected winChange( event: egret.Event ): void{
		this.winText.text = Utils.formatCoinsNumber( event["winCoins"] );
        super.winChange( event );
	}

	protected tipStatus( event: egret.Event ): void{
        super.tipStatus( event );
	}

    protected updateCredit( data: Object ): void{
        super.updateCredit( data );
	}

    /*********************************************************************************************************************************************************/

    private static pachinkoString: string = "pachinko"
    private pachinkoLetters: Array<egret.Bitmap>;
    private pachinkoPaytableList: Object;
    private pachinkoLetterContainer: egret.DisplayObjectContainer;
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
        this.pachinkoLetters = [];
        this.pachinkoLetterContainer = new egret.DisplayObjectContainer;
        this.addChild( this.pachinkoLetterContainer );
        for( let i: number = 0; i < 8; i++ ){
            this.pachinkoLetters[i] = Com.addBitmapAt( this.pachinkoLetterContainer, this.assetStr( "pachinko_letter_" + ( i + 1 ) ), 350 + 11 * i, 38 );
        }
        this.useBetPaytable();
    }

    private useBetPaytable(): void{
        this.pachinkoPaytableList = {};
        let pachinkoStr: string = Pachinko.pachinkoString;
        for( let i: number = 0; i < pachinkoStr.length; i++ ){
            this.pachinkoPaytableList[pachinkoStr[i]] = PayTableManager.payTablesDictionary[ pachinkoStr + "_" + pachinkoStr[i] ];
            this.payTableArea.removeChild( this.pachinkoPaytableList[pachinkoStr[i]].ui );
            PayTableManager.payTablesDictionary[ pachinkoStr + "_" + pachinkoStr[i] ] = null;
            delete PayTableManager.payTablesDictionary[ pachinkoStr + "_" + pachinkoStr[i] ];
        }
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

    private setPachinkoLetter( index: number ): void{
        for( let i: number = 0; i < 8; i++ ){
            if( i < index )this.pachinkoLetters[i].filters = [MatrixTool.colorMatrixPure(0xFFFF00)];
            else if( i == index )this.pachinkoLetters[i].filters = [MatrixTool.colorMatrixPure(0xFF0000)];
            else this.pachinkoLetters[i].filters = [];
        }
    }

    private addPachinkoPaytable( index: number ): void{
        let pachinkoStr: string = Pachinko.pachinkoString;
        if( this.currentPachinkoStr ){
            let str: string = pachinkoStr + "_" + this.currentPachinkoStr;
            this.payTableArea.removeChild( PayTableManager.payTablesDictionary[ str ].ui );
            PayTableManager.payTablesDictionary[ str ] = null;
            delete PayTableManager.payTablesDictionary[ str ];
        }

        PayTableManager.payTablesDictionary[ pachinkoStr + "_" + pachinkoStr[index] ] = this.pachinkoPaytableList[pachinkoStr[index]];
        this.payTableArea.addChild( this.pachinkoPaytableList[pachinkoStr[index]].ui );
        this.currentPachinkoStr = pachinkoStr[index];
    }

    protected paytableResultFilter( resultList: Array<Object> ): void{
        for( let i: number = 0; i < resultList.length; i++ ){
            let fitsArr: Array<boolean> = resultList[i]["pachinko_1l"].fits;
            if( fitsArr ){
                let fitCount: number = 0;
                let firstlineFit: boolean = false;
                let lastlineFit: boolean = false;
                for( let j: number = 0; j < fitsArr.length; j++ ){
                    if( fitsArr[j] ){
                        fitCount ++;
                        if( j == 0 ) firstlineFit = true;
                        if( j == 4 ) lastlineFit = true;
                    }
                }
                if( fitCount <= 1 )resultList[i]["pachinko_1l"].fits = null;
                else{
                    if( firstlineFit && lastlineFit ){
                        resultList[i]["pachinko_corner"].fit = false;
                    }
                }
            }
        }
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
        tx.text = GameUIItem.languageText["win"][GlobelSettings.language] + " " + ( win * GameData.currentBet );
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
        this.pachinkoLetterContainer.removeChild( this.pachinkoLetters[i] );
        this.pachinkoLetters[i] = Com.addBitmapAt( this.pachinkoLetterContainer, this.assetStr( "pachinko_letter_" + ( i + 1 ) ), 350 + 11 * i, 38 );
        this.pachinkoLetters[i].scaleX = 5;
        this.pachinkoLetters[i].scaleY = 5;
        this.pachinkoLetters[i].filters = [MatrixTool.colorMatrixPure(0xFFFF00)];
        let tw: egret.Tween = egret.Tween.get( this.pachinkoLetters[i] );
        tw.to( { scaleX: 1, scaleY: 1 }, 1200 );
    }

    protected onBetChanged( event: egret.Event ): void{
        this.setLettersByBet();
        super.onBetChanged(event);
        
        if (event.data["type"] !== 0) this.playSound("pck_bet_mp3");
    }

    private setLettersByBet(): void{
        let pachinkoPaytableIndex: number = this.getPaytableIndex( GameData.currentBet );

        this.setPachinkoLetter( pachinkoPaytableIndex );
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
        this.addChild( this.pachinkoLetterContainer );
        this.pachinkoLetters[7].filters = [MatrixTool.colorMatrixPure(0xFFFF00)];
        this.playSound( "pck_pachinko_wav" );
        let tw: egret.Tween = egret.Tween.get( this.pachinkoLetterContainer );
        tw.to( { scaleX: 4, scaleY: 4, x: -1200, y: -160 }, 400 );
        tw.to( { scaleX: 1, scaleY: 1, x: 0, y: 0  }, 400 );
        tw.to( { scaleX: 4, scaleY: 4, x: -1200, y: -160  }, 400 );
        tw.to( { scaleX: 1, scaleY: 1, x: 0, y: 0  }, 400 );
        tw.to( { scaleX: 4, scaleY: 4, x: -1200, y: -160  }, 400 );
        tw.to( { scaleX: 1, scaleY: 1, x: 0, y: 0  }, 400 );
        tw.to( { scaleX: 4, scaleY: 4, x: -1200, y: -160  }, 400 );
        tw.to( { scaleX: 1, scaleY: 1, x: 0, y: 0  }, 400 );
        tw.wait(100);
        tw.call( () => { this.betProgress[betProgressIndex]["letterIndex"] = 0; this.setLettersByBet(); } );
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

    protected runningWinAnimation( callback: Function, lightResult: Array<Object> ): void{
        let paytableName = "";
        let multiple = 0;
        for( let i = 0; i < lightResult.length; i++ ){
            for (let ob in lightResult[i]) {
                if (!this.lastLightResult[i] || !this.lastLightResult[i][ob] || this.lastLightResult[i][ob].length < lightResult[i][ob].length) {
                    if (multiple < PayTableManager.payTablesDictionary[ob].multiple) {
                        multiple = PayTableManager.payTablesDictionary[ob].multiple;
                        paytableName = PayTableManager.payTablesDictionary[ob].payTableName;
                        if (paytableName.indexOf("bing") >= 0) this.dispatchEvent(new egret.Event("bingo"));
                    }
                }
            }
        }

        this.lastLightResult = lightResult;
        if( SoundManager.soundOn && paytableName !== "" ){
            this.getResultListToCheck( true );
            this.getPaytablesFit(paytableName, callback);
        } else callback();
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

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "pachinko_2l": soundName = "pck_2line_mp3";break;
            case "pachinko_a": soundName = "pck_a_mp3";break;
            case "pachinko_bingo": soundName = "pck_bingo_mp3";break;
            case "pachinko_flower": soundName = "pck_flower_wav"; break;
            // case "pachinko_1l": soundName = "";break;
            case "pachinko_round": soundName = "pck_round_wav";break;
            case "pachinko_mouse": soundName = ""; break;
            case "pachinko_flower2": soundName = "pck_flower_wav";break;
            case "pachinko_p": soundName = "pck_p_mp3";break;
            case "pachinko_c": soundName = "pck_c_mp3"; break;
            case "pachinko_h": soundName = "pck_h_mp3";break;
            case "pachinko_i": soundName = "pck_i_mp3";break;
            case "pachinko_n": soundName = "pck_n_mp3"; break;
            case "pachinko_k": soundName = "pck_k_mp3";break;
            case "pachinko_o": soundName = "pck_o_mp3";break;
            case "pachinko_plus": soundName = "pck_plus_wav"; break;
            case "pachinko_#": soundName = "";break;
            case "pachinko_4l": soundName = "pck_4line_mp3";break;
            case "pachinko_3l": soundName = "pck_3line_mp3"; break;
            case "pachinko_corner": soundName = "pck_4corners_mp3"; break;
            case "pachinko_pachinko": soundName = "pck_pachinko_wav"; break;
            default: break;
        }
        if (SoundManager.soundOn && soundName !== "") {
            this.playSound(soundName, 1, callback);
            soundName = "";
        } else {
            callback();
        }
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

            if( localStorage.getItem( "pachinko_mega" ) ) return;
            else{
                localStorage.setItem( "pachinko_mega", "true" );
                let ev: egret.Event = new egret.Event( "megaFirst" );
                ev.data = new egret.Rectangle( 626, 233, 30, 30 );
                this.dispatchEvent( ev );
            }
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
    
    protected onServerData( data: Object ){
        super.onServerData( data );
        if( localStorage.getItem( "pachinko_mega" ) ) return;
        else{
            try{
                RES.loadGroup( "megaForFirst_" + GlobelSettings.language );
            }catch(e){}
        }
    }
}
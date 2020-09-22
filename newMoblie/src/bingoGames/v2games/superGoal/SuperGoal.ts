class SuperGoal extends V2Game{

    protected static get classAssetName(){
        return "superGoal";
    }

    protected static get animationAssetName(){
        return "gridWavePachampionko";
    }

    public constructor( assetsPath: string ) {
        super("superGoal.conf", assetsPath, 70);
        this.languageObjectName = "superGoal_tx";
        this.megaName = "superGoal_mega";

        this.gratisUIIsOverExtraUI = true;

        GameCard.gridOnTop = true;
        GameCard.zeroUI = "champion_shose";
        GameCard.useRedEffect = true;

        PaytableUI.focusColor = 0xFFFF00;
        PayTableManager.paytableUIType = SuperGoalPaytableUI;

        CardManager.cardType = SuperGoalCard;
        CardManager.gridType = SuperGoalGrid;
        CardGrid.defaultNumberSize = 45;

        BallManager.ballOffsetY = 3;

        this.needSmallWinTimesOnCard = true;
        this.ballArea.needLightCheck = true;

        PayTableManager.bingoPaytableName = "pachinko_bingo";
    }

    protected init(){
        super.init();

        MDS.mcFactory = this._mcf;

        this.showNoBetAndCredit();

        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, this.runningBallContainer, 1105, 125 );

        this.buildSuperEbArea( "mega_" + GlobelSettings.language, 784, 172 );

        this.letsPachampionko();
        
        this.ganhoCounter = new GanhoCounter;

        let ptBg: egret.Bitmap = this.getChildByName( this.assetStr( "paytable_bg_02" ) ) as egret.Bitmap;
        ptBg.scale9Grid = new egret.Rectangle( 10, 10, 40, 40 );
        ptBg.width = 492;
        ptBg.height = 200;
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        this.showLastBallAt(ballIndex, 0, 0);

        this.playSound("pcpk_ball_mp3");

        if (this.btExtra && (this.currentBallIndex === this.gratisNumber - 1)) this.playSound("pcpk_free_eb_mp3");
    }

    protected showLastBallAt( ballIndex: number, x: number, y: number, scale: number = 1 ): void{
		if( this.runningBallUI && ( this.runningBallContainer ).contains( this.runningBallUI ) ){
			( this.runningBallContainer ).removeChild( this.runningBallUI );
		}
		this.runningBallUI = this.ballArea.getABigBall( ballIndex, "_small", 72 );
		Com.addObjectAt( this.runningBallContainer, this.runningBallUI, x, y );
	}

    protected getGratisUI(): egret.DisplayObject{
        return Com.addBitmapAt( this, this.assetStr( "extraball" ), 0, 0 );;
	}

    protected showExtraUI( show: boolean = true ){
        super.showExtraUI( show );
        if( !show && this.gratisUI && this.contains( this.gratisUI ) )this.removeChild( this.gratisUI );
    }

    protected onServerData( data: Object ){
        super.onServerData( data );
        // try{
        //     RES.loadGroup( "pachampionko_bingo" );
        // }catch(e){}
    }

    /*********************************************************************************************************************************************************/

    private static pachampionkoString: string = "supergoal"
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

    private letsPachampionko():void{
        this.pachinkoLetters = [];
        this.pachinkoLetterContainer = new egret.DisplayObjectContainer;
        this.addChild( this.pachinkoLetterContainer );

        ExtraBlinkGrid.extraBink = true;

        for( let i: number = 0; i < 9; i++ ){
            this.pachinkoLetters[i] = Com.addBitmapAt( this.pachinkoLetterContainer, this.assetStr( "champion_letter_" + ( i + 1 ) ), 44 * i + 295, 44 );
        }
        this.useBetPaytable();
    }

    private useBetPaytable(): void{
        this.pachinkoPaytableList = {};
        let pachinkoStr: string = SuperGoal.pachampionkoString;
        for( let i: number = 0; i < pachinkoStr.length; i++ ){
            this.pachinkoPaytableList[pachinkoStr[i]] = PayTableManager.payTablesDictionary[ "pachinko" + "_" + pachinkoStr[i] ];
            this.payTableArea.removeChild( this.pachinkoPaytableList[pachinkoStr[i]].ui );
            PayTableManager.payTablesDictionary[ "pachinko" + "_" + pachinkoStr[i] ] = null;
            delete PayTableManager.payTablesDictionary[ "pachinko" + "_" + pachinkoStr[i] ];
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
        for( let i: number = 0; i < 9; i++ ){
            if( i < index )this.pachinkoLetters[i].filters = [MatrixTool.colorMatrixPure(0xFFFF00)];
            else if( i == index )this.pachinkoLetters[i].filters = [MatrixTool.colorMatrixPure(0xFF0000)];
            else this.pachinkoLetters[i].filters = [];
        }
    }

    private addPachinkoPaytable( index: number ): void{
        let pachinkoStr: string = SuperGoal.pachampionkoString;
        if( this.currentPachinkoStr ){
            let str: string = "pachinko" + "_" + this.currentPachinkoStr;
            this.payTableArea.removeChild( PayTableManager.payTablesDictionary[ str ].ui );
            PayTableManager.payTablesDictionary[ str ] = null;
            delete PayTableManager.payTablesDictionary[ str ];
        }

        PayTableManager.payTablesDictionary[ "pachinko" + "_" + pachinkoStr[index] ] = this.pachinkoPaytableList[pachinkoStr[index]];
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

        let pachinkoStr: string = SuperGoal.pachampionkoString;
        let hasPachinkoPaytable: boolean = false;
        for( let i: number = 0; i < resultList.length; i++ ){
            let result: PaytableCheckResult = resultList[i]["pachinko" + "_" + this.currentPachinkoStr ];
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

    private playingLetterAnimation: boolean;

    private showPachinkoLetterAnimation(): void{
        let pachinkoStr: string = SuperGoal.pachampionkoString;
        let index: number = pachinkoStr.indexOf( this.currentPachinkoStr );

        this.playingLetterAnimation = true;

        let letterPaytable: egret.Bitmap = Com.addBitmapAt( this, this.assetStr( "champion_paytable_" + pachinkoStr[index] ), 475, 350 );
        TweenerTool.tweenTo( letterPaytable, { x: 241, y: 26 }, 800, 0, ( ( letterPaytable ) => { if( letterPaytable.parent ) letterPaytable.parent.removeChild( letterPaytable ) } ).bind( this, letterPaytable ) );

        for( let i: number = pachinkoStr.length - 1; i > index; i-- ){
            TweenerTool.tweenTo( this.pachinkoLetters[i], { alpha: 1 }, 0.01, ( pachinkoStr.length - 1 - i ) * 200 + 800, this.letterTurnYellow.bind( this, i, true ) );
            TweenerTool.tweenTo( this.pachinkoLetters[i], { alpha: 1 }, 0.01, ( pachinkoStr.length - 1 - i ) * 200 + 1000, this.letterTurnYellow.bind( this, i, false ) );
        }

        TweenerTool.tweenTo( this, { alpha: this.alpha }, 1, ( pachinkoStr.length - index - 2 ) * 200 + 1000, this.setPlayingLetterEsendPlayRequest.bind(this, index) );
    }

    private letterTurnYellow( i: number, isYellow: boolean ): void{
        this.pachinkoLetters[i].filters = isYellow ? [ MatrixTool.colorMatrixPure( 0xFFFF00 ) ] : [];
    }

    private setPlayingLetterEsendPlayRequest( index: number ){
        this.playingLetterAnimation = false;
        this.letterTurnYellow( index, true );
    }

    protected onBetChanged( event: egret.Event ): void{
        this.setLettersByBet();
        super.onBetChanged(event);
        
        // if (event.data["type"] !== 0) this.playSound("pck_bet_mp3");
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
                    if( index >= SuperGoal.pachampionkoString.length && letra == 0 ){
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
        this.playSound( "pcpk_supergoal_mp3" );
        let tw: egret.Tween = egret.Tween.get( this.pachinkoLetterContainer );
        this.pachinkoLetterContainer.filters = [ MatrixTool.colorMatrixPure( 0xFFFF00 ) ];
        tw.wait( 500 );
        tw.call( ( () => { this.pachinkoLetterContainer.filters = [ MatrixTool.colorMatrixPure( 0x5b6f0b ) ]; } ).bind(this) );
        tw.wait( 400 );
        tw.call( ( () => { this.pachinkoLetterContainer.filters = [ MatrixTool.colorMatrixPure( 0xFFFF00 ) ]; } ).bind(this) );
        tw.wait( 300 );
        tw.call( ( () => { this.pachinkoLetterContainer.filters = [ MatrixTool.colorMatrixPure( 0x5b6f0b ) ]; } ).bind(this) );
        tw.wait( 200 );
        tw.call( ( () => { this.pachinkoLetterContainer.filters = [ MatrixTool.colorMatrixPure( 0xFFFF00 ) ]; } ).bind(this) );
        tw.wait( 100 );
        tw.call( this.showAllLetters.bind(this) );
        tw.call( () => { this.betProgress[betProgressIndex]["letterIndex"] = 0; this.setLettersByBet(); } );
    }

    private showAllLetters(){
        let sp: egret.Shape = new egret.Shape;
        sp.anchorOffsetY = 45;
        sp.scaleY = 0.1;
        Com.addObjectAt( this, sp, 0, 250 );
        GraphicTool.drawRect( sp, new egret.Rectangle( 0, 0, 755, 90 ), 0, false, 0.7 );
        TweenerTool.tweenTo( sp, { scaleY: 1 }, 250 );
        TweenerTool.tweenTo( sp, { alpha: 0 }, 500, 1200 );

        let letters: egret.Bitmap = Com.addBitmapAt( this, "pachampionkoAnimation_json.title", 755 >> 1, 250 );
        letters.anchorOffsetX = letters.width >> 1;
        letters.anchorOffsetY = letters.height >> 1;
        letters.scaleX = 0.3;
        letters.scaleY = 0.3;
        letters.alpha = 0;
        let twLetters: egret.Tween = egret.Tween.get( letters );
        twLetters.to( { alpha: 1, scaleX: 1, scaleY: 1 }, 250 );
        twLetters.wait( 950 );
        twLetters.to( { alpha: 0 }, 500 );

        let snow: egret.Bitmap = Com.addBitmapAt( this, "pachampionkoAnimation_json.bg_point", 100, -600 );
        snow.alpha = 0;
        let twSnow: egret.Tween = egret.Tween.get( snow );
        twSnow.wait(250);
        twSnow.to( { alpha: 0.4 }, 10 );
        twSnow.to( { alpha: 1, y: -412 }, 600 );
        twSnow.to( { alpha: 0, y: -100 }, 1000 );
        twSnow.call( () => { sp.parent.removeChild(sp); letters.parent.removeChild( letters ); snow.parent.removeChild( snow ) } );
        twSnow.call( () => { this.pachinkoLetterContainer.filters = []; } );
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
        if( this.playingLetterAnimation ){
            setTimeout( this.onRoundOver.bind( this, data ), 100 );
            return;
        }

        super.onRoundOver( data );
        this.resetLetterIndex( data["letra"] ); 
    }

    public onCancelExtra( data: Object ){
        if( this.playingLetterAnimation ){
            setTimeout( this.onCancelExtra.bind( this, data ), 100 );
            return;
        }

        super.onCancelExtra( data );
        this.resetLetterIndex( data["letra"] );
    }

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ): void{
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1278, 30 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 178, -5 ), new egret.Rectangle( 240, 22, 230, 42 ), 42, 0,
            new egret.Rectangle( 12, 18, 210, 48 ), 48, 0xFFFFFF ) );
        this.jackpotArea.tip.stroke = 3;
        this.jackpotArea.tip.strokeColor = 0;
        this.jackpotArea.tip.scaleX = 0.82;
    }

    protected hasExtraBallFit(): void {
        this.stopSound("pcpk_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            // this.playSound("pck_have_extra_ball_mp3");
            this.showFreeExtraPosition();
        }

        if( this.isMegaBall ){
            this.superExtraBg.visible = true;
            this.gameToolBar.megeExtraOnTop( true );
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("pcpk_ball_mp3");
    }

	protected getExtraBallFit(): void {
		this.playSound("pcpk_eb_mp3");
	}

	protected collectExtraBall(): void {
		// this.playSound("pck_collect_mp3");
	}

	protected changeNumberSound(): void {
		// this.playSound("pck_card_mp3");
	}
}
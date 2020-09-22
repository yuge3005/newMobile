class SuperGoal extends V2Game{

    protected static get classAssetName(){
        return "superGoal";
    }

    protected static get animationAssetName(){
        return "gridWaveSuperGoal";
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
        PayTableManager.layerType = SuperGoalPaytableLayer;
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

        if( this.extraUIObject ) this.extraUIShowNumber();

        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, this.runningBallContainer, 1105, 125 );

        this.buildSuperEbArea( "mega_" + GlobelSettings.language, 784, 172 );

        this.letsSupergoal();
        
        this.ganhoCounter = new GanhoCounter;
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
        return Com.addBitmapAt( this, this.assetStr( "extraball" ), 0, 0 );
	}

    protected showExtraUI( show: boolean = true ){
        super.showExtraUI( show );
        if( !show && this.gratisUI && this.contains( this.gratisUI ) )this.removeChild( this.gratisUI );
    }

    protected extraUIShowNumber(){
        this.runningBallContainer = new SuperGoalExtraBg;
        this.runningBallContainer.x = this.extraUIObject.x;
        this.runningBallContainer.y = this.extraUIObject.y;
        this.addChildAt( this.runningBallContainer, this.getChildIndex( this.extraUIObject ) );
        this.removeChild( this.extraUIObject );
        this.extraUIObject = this.runningBallContainer;
        this.extraUIObject.visible = false;
    }

    /*********************************************************************************************************************************************************/

    public static supergoalString: string = "supergoal";

    private superGoalLetters: SuperGoalLetterLayer;
    private currentSupergoalStr: string;
    private hasSupergoalLetter: boolean;

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

    private letsSupergoal():void{
        this.superGoalLetters = new SuperGoalLetterLayer;
        Com.addObjectAt( this, this.superGoalLetters, 295, 44 );
        ExtraBlinkGrid.extraBink = true;
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
        this.currentSupergoalStr = SuperGoal.supergoalString[index];
        ( this.payTableArea as SuperGoalPaytableLayer ).addCurrentPaytable( index );
    }

    protected paytableResultFilter( resultList: Array<Object> ): void{
        PachinkoPtSettings.filtOneLineAndCorner( resultList );
        super.paytableResultFilter( resultList );
    }

    protected afterCheck( resultList: Array<Object> ): void{
        super.afterCheck( resultList );

        let pachinkoStr: string = SuperGoal.supergoalString;
        let hasPachinkoPaytable: boolean = false;
        for( let i: number = 0; i < resultList.length; i++ ){
            let result: PaytableCheckResult = resultList[i]["pachinko" + "_" + this.currentSupergoalStr ];
            if( result.fit || result.fits ){
                hasPachinkoPaytable = true;
            }
        }

        if( hasPachinkoPaytable && !this.hasSupergoalLetter ){
            this.hasSupergoalLetter = true;
            this.showPachinkoLetterAnimation();
        }

        this.ganhoCounter.countGanhoAndPlayAnimation(resultList);
    }

    private showPachinkoLetterAnimation(): void{
        let pachinkoStr: string = SuperGoal.supergoalString;
        let i: number = pachinkoStr.indexOf( this.currentSupergoalStr );
        this.superGoalLetters.showPachinkoLetterAnimation( i );
    }

    protected onBetChanged( event: egret.Event ): void{
        this.setLettersByBet();
        super.onBetChanged(event);
        
        // if (event.data["type"] !== 0) this.playSound("pck_bet_mp3");
    }

    private setLettersByBet(): void{
        let pachinkoPaytableIndex: number = this.getPaytableIndex( GameData.currentBet );

        this.superGoalLetters.setPachinkoLetter( pachinkoPaytableIndex );
        this.addPachinkoPaytable( pachinkoPaytableIndex );
    }

    private resetLetterIndex( letra: number ){
        if( this.hasSupergoalLetter ){
            this.hasSupergoalLetter = false;

            let index: number = NaN;
            for( let i: number = this.betProgress.length - 1; i >= 0; i-- ){
                if( GameData.currentBet - 1 == this.betProgress[i]["bet"] ){
                    index = this.betProgress[i]["letterIndex"];
                    index += 1;
                    if( index >= SuperGoal.supergoalString.length && letra == 0 ){
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
        this.addChild( this.superGoalLetters );
        this.playSound( "pcpk_supergoal_mp3" );
        let tw: egret.Tween = egret.Tween.get( this.superGoalLetters );
        this.superGoalLetters.filters = [ MatrixTool.colorMatrixPure( 0xFFFF00 ) ];
        tw.wait( 500 );
        tw.call( ( () => { this.superGoalLetters.filters = [ MatrixTool.colorMatrixPure( 0x5b6f0b ) ]; } ).bind(this) );
        tw.wait( 400 );
        tw.call( ( () => { this.superGoalLetters.filters = [ MatrixTool.colorMatrixPure( 0xFFFF00 ) ]; } ).bind(this) );
        tw.wait( 300 );
        tw.call( ( () => { this.superGoalLetters.filters = [ MatrixTool.colorMatrixPure( 0x5b6f0b ) ]; } ).bind(this) );
        tw.wait( 200 );
        tw.call( ( () => { this.superGoalLetters.filters = [ MatrixTool.colorMatrixPure( 0xFFFF00 ) ]; } ).bind(this) );
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
        twSnow.call( () => { this.superGoalLetters.filters = []; } );
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
                let unNeedIndex: number = blinkGridsArray.indexOf( "pachinko_" + this.currentSupergoalStr );
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
        if( this.superGoalLetters.playingLetterAnimation ){
            setTimeout( this.onRoundOver.bind( this, data ), 100 );
            return;
        }

        super.onRoundOver( data );
        this.resetLetterIndex( data["letra"] ); 
    }

    public onCancelExtra( data: Object ){
        if( this.superGoalLetters.playingLetterAnimation ){
            setTimeout( this.onCancelExtra.bind( this, data ), 100 );
            return;
        }

        super.onCancelExtra( data );
        this.resetLetterIndex( data["letra"] );
    }

    protected buildSuperEbArea( superEbBgName: string, superEbAreaX: number, superEbAreaY: number ): void{
		this.superExtraBg = Com.addBitmapAt( this, this.assetStr( superEbBgName ), superEbAreaX, superEbAreaY );
        this.superExtraBg.fillMode = egret.BitmapFillMode.REPEAT;
        this.superExtraBg.width = 56 * 5;
		this.superExtraBg.visible = false;
		this.setChildIndex( this.superExtraBg, this.getChildIndex( this.ballArea ) );
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
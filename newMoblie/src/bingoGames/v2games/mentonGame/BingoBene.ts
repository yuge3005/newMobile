class BingoBene extends V2Game{

    protected static get classAssetName(){
		return "menton";
	}

    protected static get animationAssetName(){
		return "mentonAnimation";
	}

    private freeEbList: Array<number>;
    private freeEbUI1: egret.Bitmap;
    private freeEbUI2: egret.Bitmap;

    public static bingoCardPosition: egret.Point;

	public constructor( assetsPath: string ) {
		super( "menton.conf", assetsPath, 69 );
        this.languageObjectName = "forAll_tx";

        PaytableUI.textBold = true;
        PaytableUI.effectForMenton = "hehe";

        GameCard.bgRound = 20;

        CardManager.cardType = MentonCard;
        CardManager.gridType = MentonGrid;

        CardGrid.defaultNumberSize = 22;

        GameCard.useRedEffect = true;

        BallManager.ballOffsetY = 1;
	}

    protected init(){
        super.init();

        this.showNoBetAndCredit();

        this.extraUIObject = new egret.Shape;
        this.addChildAt( this.extraUIObject, this.getChildIndex( this.ballArea ) );

        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.buildSuperEbArea( "megaball_bg", 119, 58 );

        if( GlobelSettings.language != "pt" ){
            let exBitmap: egret.Bitmap = this.getChildByName( this.assetStr("extra_ball_pt") ) as egret.Bitmap;
            let jpBitmap: egret.Bitmap = this.getChildByName( this.assetStr("jackpot_pt") ) as egret.Bitmap;

            let newEx: egret.Bitmap = Com.addBitmapAt( this, this.assetStr( "extra_ball_" + GlobelSettings.language ), exBitmap.x, exBitmap.y );
            this.setChildIndex( newEx, this.getChildIndex( exBitmap ) );
            this.removeChild( exBitmap );

            let newJp: egret.Bitmap = Com.addBitmapAt( this, this.assetStr( "jackpot_" + GlobelSettings.language ), jpBitmap.x, jpBitmap.y );
            this.setChildIndex( newJp, this.getChildIndex( jpBitmap ) );
            this.removeChild( jpBitmap );
        }

        MontonToolBar.bgmType = "menton_BGM_mp3";
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        this.showLastBallAt( ballIndex, 0, 0 );

        this.playSound("menton_ball_mp3");
	}

    protected showLastBallAt( ballIndex: number, x: number, y: number, scale: number = 1 ): void{
		if( this.runningBallUI && ( this.runningBallContainer ).contains( this.runningBallUI ) ){
			( this.runningBallContainer ).removeChild( this.runningBallUI );
		}
		this.runningBallUI = this.ballArea.getABigBall( ballIndex );
		Com.addObjectAt( this.runningBallContainer, this.runningBallUI, x, y );

        Com.addObjectAt( this, this.runningBallContainer, 143, 205 );
	}

    protected clearRunningBallUI(): void{
        if( this.runningBallContainer && this.contains( this.runningBallContainer ) )this.removeChild( this.runningBallContainer );
	}

    protected startPlay(): void {
        super.startPlay();

        for( let i: number = 0; i < this.tomatoArray.length; i++ ){
            if( this.tomatoArray[i] && this.contains( this.tomatoArray[i] ) ){
                this.removeChild( this.tomatoArray[i] );
            }
        }
        this.tomatoArray = [];
    }

    public onPlay( data: Object, hotData: any ){
        super.onPlay( data );
        
        this.freeEbList = data["free_eb"];

        this.checkBellWin( data );
    }

    public onExtra( data: Object ){
        super.onExtra( data );

        this.checkBellWin( data );
    }

    private addFreeEbIcons(): void{
        if( !this.freeEbUI1 ){
            this.freeEbUI1 = this.getGratisUI() as egret.Bitmap;
            this.freeEbUI2 = this.getGratisUI() as egret.Bitmap;
            let ebIndex: number = this.getChildIndex( this.ballArea );
            this.addChildAt( this.freeEbUI1, ebIndex );
            this.addChildAt( this.freeEbUI2, ebIndex );
        }
        if( this.freeEbList && this.freeEbList.length == 2 ){
            let pt1: Object = BallManager.getBallLastPosition( this.freeEbList[0] + 29 );
            let pt2: Object = BallManager.getBallLastPosition( this.freeEbList[1] + 29 );
            this.freeEbUI1.x = pt1["x"];
            this.freeEbUI1.y = pt1["y"];
            this.freeEbUI2.x = pt2["x"];
            this.freeEbUI2.y = pt2["y"];
            this.freeEbUI1.visible = this.freeEbUI2.visible = true;
        }
    }

    protected showExtraUI( show: boolean = true ){
		if( !show )if( !show && this.gratisUI && this.contains( this.gratisUI ) )this.removeChild( this.gratisUI );
	}

    protected onServerData( data: Object ){
        super.onServerData( data );

        this.letsMenton( data );

        try{
            RES.loadGroup( "menton_bingo" );
        }catch(e){}
    }

    protected initToolbar(){
        this.gameToolBar = new MontonToolBar;
		Com.addObjectAt( this, this.gameToolBar, 0, BingoGameToolbar.toolBarY );
        this.gameToolBar.showTip( "" );

		this.topbar = new Topbar;
		this.addChild( this.topbar );
		
		this.topbar.scaleX = this.gameToolBar.scaleX = BingoBackGroundSetting.gameMask.width / 2000;
		this.topbar.scaleY = this.gameToolBar.scaleY = BingoBackGroundSetting.gameMask.height / 1125;
	}

    protected paytableResultFilter( resultList: Array<Object> ): void{
        for( let i: number = 0; i < resultList.length; i++ ){
            let fitColumn_2_2: boolean = resultList[i]["columns_2_2"].fit;
            if( fitColumn_2_2 ){
                let fitColumn2_Array: Array<boolean> = resultList[i]["columns_2"].fits;
                fitColumn2_Array[0] = false;
                fitColumn2_Array[3] = false;
            }
        }
        super.paytableResultFilter( resultList );
    }

    protected afterCheck( resultList: Array<Object> ): void{
        super.afterCheck( resultList );
        for( let i: number = 0; i < 4; i++ ){
            if( resultList[i]["bingo"] && ( resultList[i]["bingo"]["unfitIndex"] >= 0 || resultList[i]["bingo"].fit ) ){
                ( CardManager.cards[i] as MentonCard ).showMissBingo( resultList[i]["bingo"]["unfitIndex"] );
                continue;
            }
            if( resultList[i]["columns_4"] && resultList[i]["columns_4"]["unfitIndexs"] ){
                ( CardManager.cards[i] as MentonCard ).showMissColumns_4( resultList[i]["columns_4"]["unfitIndexs"] );
            }
            if( resultList[i]["columns_3"] && resultList[i]["columns_3"]["unfitIndexs"] ){
                ( CardManager.cards[i] as MentonCard ).showMissColumns_3( resultList[i]["columns_3"]["unfitIndexs"] );
            }
            if( resultList[i]["columns_2_2"] && resultList[i]["columns_2_2"]["unfitIndex"] >= 0 ){
                ( CardManager.cards[i] as MentonCard ).showMissColumns_2_2( resultList[i]["columns_2_2"]["unfitIndex"] );
            }
            if( resultList[i]["line_2"] && resultList[i]["line_2"]["unfitIndexs"] ){
                ( CardManager.cards[i] as MentonCard ).showMissDoubline( resultList[i]["line_2"]["unfitIndexs"] );
            }
        }
    }

    public onCancelExtra( data: Object ){
        super.onCancelExtra( data );

        this.gameToolBar.showWinResult( data["ganho"] );
    }

/******************************************************************************************************************************************************************/

    private bellIndexs: Array<number>;
    private bellIndexIcons: Array<egret.Bitmap>;

    private lemonBuffInfo: Array<Object>;

    private lemonGame: LemonGame;
    private clickProtector: egret.Shape;

    private iconWheel: egret.Bitmap;
    private lemonWheel: LemonWheel;

    private letsMenton( data: Object ): void{
        this.setBellIndexs( data["bellIndexs"] );
        this.addChild( this.getChildByName( this.assetStr( "bg_bigball_export" ) ) );

        this.iconWheel = Com.addBitmapAt( this, "mentonWheel_json.icon_wheel", 200, 0 );

        this.lemonBuffInfo = data["lemonBuffs"];
        let hasBetData: boolean = this.getCurrentBetBuff();

        if( hasBetData || this.currentBuf == 3 ){
            this.startLemonGame();
        }
    }

    private startLemonGame( endToContinue: boolean = false ): void{
        this.showMouseMask();
        this.deleteCurrentBetBuff();
        this.lemonGame = new LemonGame( GameData.currentBet );
        this.lemonGame.addEventListener( "gameOver", this.lemonGameOver.bind( this, endToContinue ), this );
        this.lemonGame.addEventListener( "buttonClick", this.resetToolbarTimer, this );
        Com.addObjectAt( this, this.lemonGame, 0, 0 );

        MontonToolBar.bgmType = "lemon_BGM_mp3";
        ( this.gameToolBar as MontonToolBar ).resetBgMusicTimer();
    }

    private resetToolbarTimer( event: egret.Event ): void{
        ( this.gameToolBar as MontonToolBar ).resetBgMusicTimer();
    }

    private deleteCurrentBetBuff(){
        let buffIndex: number = this.getBuffInfoIndex( this.lemonBuffInfo );
        if( buffIndex >= 0 ){
            this.lemonBuffInfo.splice( buffIndex, 1 );
        }
        else{
            trace( "new buff" );
        }
    }

    private lemonGameOver( endToContinue: boolean, ev: egret.Event ){
        let data: Object = { credito: ev["rewardCoins"] + this.gameCoins };
        this.updateCredit( data );

        setTimeout( this.removeLemonGame.bind( this, endToContinue ), 4000 );
    }

    private removeLemonGame( endToContinue: boolean ){
        if( this.contains( this.clickProtector ) )this.removeChild( this.clickProtector );
        this.removeChild( this.lemonGame );
        this.lemonGame.removeEventListener( "gameOver", this.lemonGameOver, this );
        this.lemonGame.removeEventListener( "buttonClick", this.resetToolbarTimer, this );
        if( endToContinue )super.sendRoundOverRequest();

         MontonToolBar.bgmType = "menton_BGM_mp3";
         ( this.gameToolBar as MontonToolBar ).resetBgMusicTimer();
    }

    private showMouseMask(): void{
        if( !this.clickProtector ){
            this.clickProtector = new egret.Shape;
            GraphicTool.drawRect( this.clickProtector, new egret.Rectangle( 0, 0, 755, 462 ), 0, false, 0.0 );
            GraphicTool.drawRect( this.clickProtector, new egret.Rectangle( 0, 462, 755, 138 ), 0, false, 0.4 );
            this.clickProtector.touchEnabled = true;
        }
        Com.addObjectAt( this, this.clickProtector, 0, 0 );
    }

    private getCurrentBetBuff(): boolean {
        let buffIndex: number = this.getBuffInfoIndex( this.lemonBuffInfo );
        if( buffIndex >= 0 ){
            this.currentBuf = this.lemonBuffInfo[buffIndex]["buffID"];
            return true;
        }
        else this.currentBuf = 0;
        return false;
    }

    private setBellIndexs( bellIndexs: Array<number> ){
        this.bellIndexs = bellIndexs;
        if( !this.bellIndexIcons ){
            this.bellIndexIcons = [];
            for( let i: number = 0; i < bellIndexs.length; i++ ){
                this.bellIndexIcons[i] = Com.addBitmapAt( this, this.assetStr( "card_bell" ), 0, 0  );
            }
        }

        for( let i: number = 0; i < bellIndexs.length; i++ ){
            let pt: egret.Point = this.getIndexOnCard( bellIndexs[i] );
            this.setTargetToPositionOnCard( this.bellIndexIcons[i], pt.x, pt.y );
            this.bellIndexIcons[i].x += 7;
            this.bellIndexIcons[i].y += 3;
            this.bellIndexIcons[i].alpha = 0.4;
        }
    }

    public onChangeNumber( data: Object ){
        super.onChangeNumber( data );

        this.setBellIndexs( data["bellIndexs"] );
    }

    private hasWinBell: boolean;
    private hasShowBellEffect: boolean;
    private bombIndexs: Array<number>;
    private currentBuf: number;

    private checkBellWin( data: Object ){
        if( data["wonAllBells"] && !this.hasWinBell ){
            this.hasWinBell = true;
            this.bombIndexs = data["bombIndexs"];
            this.currentBuf = data["buffID"];
        }
    }

    private checkBellEffect(): boolean{
        if( this.hasWinBell && !this.hasShowBellEffect ){
            this.hasShowBellEffect = true;
            
            trace( "get all bells:" + this.currentBuf );
            return true;
        }
        return false;
    }

    private showLemonWheel( endToContinue: boolean = false ): void{
        if( this.gameToolBar.autoPlaying ) this.gameToolBar.autoPlaying = false;

        this.showMouseMask();
        this.lemonWheel = new LemonWheel( this.currentBuf );
        this.lemonWheel.addEventListener( "wheelEnd", this.wheelEnd.bind( this, endToContinue ), this );
        Com.addObjectAt( this, this.lemonWheel, this.iconWheel.x + this.lemonWheel.scaleX * 375 * 0.5, this.iconWheel.y + this.lemonWheel.scaleX * 375 * 0.5 );

        this.iconWheel.visible = false;
        this.lemonWheel.showOff( 755 >> 1, 462 >> 1 );

        this.playSound( "menton_bell_mp3" );
        TweenerTool.tweenTo( this.lemonWheel, { x: this.lemonWheel.x }, 2500, 0, this.playWheelSound.bind(this) );
    }

    private playWheelSound(): void{
        this.playSound( "menton_roulette_mp3" );
    }

    private wheelEnd( endToContinue: boolean ): void{
        if( this.contains( this.clickProtector ) )this.removeChild( this.clickProtector );
        if( this.contains( this.lemonWheel ) )this.removeChild( this.lemonWheel );
        this.iconWheel.visible = true;

        this.playSound( "menton_roulette_winner_mp3" );

        if( this.currentBuf == 0 )trace( "win nothing" );
        else if( this.currentBuf == 1 ){
            this.addChild( this.lemonWheel );
            this.lemonWheel.showDoubleBonus();
        }
        else if( this.currentBuf == 2 ){
            for( let i: number = 0; i < this.bombIndexs.length; i++ ){
                let indexPt: egret.Point = this.getIndexOnCard( this.bombIndexs[i] );
                this.getNumberOnCard( indexPt.x, indexPt.y );

                if( i % 4 == 0 )this.showTomatoAnimationAt( indexPt );

                this.getResultListToCheck();
            }
        }
        else if( this.currentBuf == 3 ){
            this.startLemonGame( endToContinue );
            return;
        }

        if( endToContinue )super.sendRoundOverRequest();
    }

    private tomatoArray: Array<MentonTomatoAnimation> = [];

    private showTomatoAnimationAt( indexPt: egret.Point ){
        let tomato: MentonTomatoAnimation = new MentonTomatoAnimation( new egret.Point );
        this.setTargetToPositionOnCard( tomato, indexPt.x, indexPt.y );
        this.addChild( tomato );

        this.tomatoArray.push( tomato );
    }

    protected winBingo(): void {
        this.recordBingoCardPosition();
        super.winBingo();
    }

    public static closeBingoPopup(): void{
        CardManager.cards.map( ( item ) => { item.visible = true } );
    }

    private recordBingoCardPosition(): void{
        let checkingString: Array<string> = CardManager.getCheckingStrings();
        let bingoCardIndex: number;
        for( let i: number = 0; i < 4; i++ ){
            if( checkingString[i] == PayTableManager.payTablesDictionary["bingo"].rule ){
                bingoCardIndex = i;
                break;
            }
        }
        let card: GameCard = CardManager.cards[bingoCardIndex];
        BingoBene.bingoCardPosition = new egret.Point( card.x, card.y );
        BingoBene.bingoCardIndex = bingoCardIndex;
    }

    private static bingoCardIndex: number;

    public static startBingoPopup(): void{
        CardManager.cards[BingoBene.bingoCardIndex].visible = false;
    }

/******************************************************************************************************************************************************************/
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 2, 12 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 13, 14 ), new egret.Rectangle( 0, 20, 160, 17 ), 17, 0xd6c576 ) );
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
        super.getPaytablesFit( paytabledName, callback );

        switch (paytabledName) {
            case "columns_3": Com.addObjectAt( this, new MentonWine( this.runningBallUI, paytabledName ), 222, 390 ); break;
            case "line_2": Com.addObjectAt( this, new MentonWine( this.runningBallUI, paytabledName ), 222, 390 ); break;
            case "columns_4": Com.addObjectAt( this, new MentonWine( this.runningBallUI, paytabledName ), 222, 390 );break;
            case "columns_2_2": Com.addObjectAt( this, new MentonWine( this.runningBallUI, paytabledName ), 222, 390 ); break;
            case "bingo": Com.addObjectAt( this, new MentonWine( this.runningBallUI, paytabledName ), 222, 390 ); break;
        }
    }

    protected runningWinAnimation(callback: Function, lightResult: Array<Object>): void{
        let paytableName = "";
        let multiple = 0;
        for( let i = 0; i < lightResult.length; i++ ){
            for (let ob in lightResult[i]) {
                if (!this.lastLightResult[i] || !this.lastLightResult[i][ob] || this.lastLightResult[i][ob].length < lightResult[i][ob].length) {
                    if (multiple < PayTableManager.payTablesDictionary[ob].multiple) {
                        multiple = PayTableManager.payTablesDictionary[ob].multiple;
                        paytableName = PayTableManager.payTablesDictionary[ob].payTableName;
                        if( paytableName.indexOf("bing") >= 0 ) this.dispatchEvent(new egret.Event("bingo"));
                    }
                }
            }
        }

        this.lastLightResult = lightResult;
        if (paytableName !== "") {
            this.getPaytablesFit(paytableName);
            callback();
        } else callback();
    }

    protected onBetChanged(event: egret.Event): void{
        super.onBetChanged(event);
        
        let hasBetData: boolean = this.getCurrentBetBuff();

        if( hasBetData || this.currentBuf == 3 ){
            this.startLemonGame();
        }
        // if (event.data["type"] !== 0) this.playSound("t90_bet_mp3");
	}

    protected hasExtraBallFit(): void {
        // this.stopSound("t90_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            // this.playSound("t90_extra_loop_wav", -1);

            this.showFreeExtraPosition();
            this.addFreeEbIcons();
        }

        if( this.isMegaBall ){
            this.superExtraBg.visible = true;
            this.gameToolBar.megeExtraOnTop( true );
        }

        let hasBellEffect: boolean = this.checkBellEffect();
        if( hasBellEffect )this.showLemonWheel();
    }

    protected sendRoundOverRequest(){
        let hasBellEffect: boolean = this.checkBellEffect();
        if( !hasBellEffect )super.sendRoundOverRequest();
        else{
            this.showLemonWheel( true );
        }
	}

    protected getGratisUI(): egret.DisplayObject{
        return Com.createBitmapByName( this.assetStr( "free_eb" ) );
    }
    
    protected roundOver(): void {
        super.roundOver();
        if( this.freeEbUI1 ){
            this.freeEbUI1.visible = this.freeEbUI2.visible = false;
        }

        if( this.currentBuf == 1 && this.contains( this.lemonWheel ) ){
            this.lemonWheel.endMove();
        }

        this.hasWinBell = false;
        this.hasShowBellEffect = false;
    }

	protected getExtraBallFit(): void {
		this.playSound("menton_extra_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
		// this.playSound("t90_card_mp3");
	}
}
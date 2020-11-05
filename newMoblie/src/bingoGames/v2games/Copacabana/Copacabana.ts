class Copacabana extends V2Game{
    public static PLAY_MINI_GAME_SOUND: string = "PLAY_MINI_GAME_SOUND";
    public static STOP_MINI_GAME_SOUND: string = "STOP_MINI_GAME_SOUND";
    private miniGame: CopaChess;
    private boatGame: CopaBoat;

    protected static get classAssetName(){
        return "pipa";
    }

    protected static get animationAssetName(){
        return "pipaAnimation";
    }

    public constructor( assetsPath: string ) {
        super( "pipa.conf", assetsPath, 68 );
        this.languageObjectName = "copacabana_tx";

        this.gratisUIIsOverExtraUI = true;
        PaytableUI.textBold = true;
        PayTableManager.layerType = CopaPaytalbeLayer;

        CardManager.cardType = CopacabanaCard;
        CardManager.gridType = CopacabanaGird;

        CardGridColorAndSizeSettings.defaultNumberSize = 44;

        GameCardUISettings.useRedEffect = true;

        BallManager.normalBallInterval = 40;
        BallManager.ballOffsetY = 8;
    }

    protected init(){
        super.init();

        this.stretchBg();
        this.horBallBg();

        this.showNoBetAndCredit();

        this.extraUIObject.visible = true;

        this.buildSuperEbArea( "big_ball_bg2", 875, 673 );

        this.ganhoCounter = new CopaGanhoCounter( this.showWinPopup.bind( this ) );
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        this.showLastBallAt( ballIndex, 0, 0 );

        if( this.markPenLayer.needMarkLine ){
            let columPt: egret.Point = this.markPenLayer.checkColumNumbers( ballIndex );
            if( columPt ){
                for( let i: number = 0; i < 3; i++ ){
                    this.getNumberOnCard( columPt.x, columPt.y + i * 5 );
                    this.getNumberOnCard( columPt.x + 2, columPt.y + i * 5 );
                }
                this.markPenLayer.getColumnNumbers( columPt.x, columPt.y );

                this.playSound( "pipa_mark_pen_mp3" );
            }
        }

        if( this.bombLayer.needBombOnCard ){
            let bombCardIndex: number = this.bombLayer.checkBomb( ballIndex );
            if( bombCardIndex >= 0 ) this.bombCard( bombCardIndex );
        }

        if( this.squareUIOnCard.visible ){
            this.squareUIOnCard.showLastBall( ballIndex );
        }

        if( this.currentBallIndex > 34 ){
            if( !this.buffBallBg1.visible || this.currentBallIndex > 36 ){
                let path: Array<Object> = BallManager["balls"][this.currentBallIndex-1]["path"];
                let pt: Object = path[path.length-1];
                let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "star", pt["x"] - 270, pt["y"] - 180 );
                mc.scaleX = mc.scaleY = 2;
                mc.gotoAndPlay( 1, 1 );
            }
        }

        clearTimeout( this.timeoutId );
        if( this.isMegaBall ){
            this.timeoutId = setTimeout( this.clearRunningBallUI.bind( this ), 1500 );
        }

        this.playSound("pipa_ball_mp3");
    }

    protected showLastBallAt( ballIndex: number, x: number, y: number, scale: number = 1 ): void{
        super.showLastBallAt( ballIndex, x, y, 245 / 177 );
    }

    private timeoutId: number;

    protected onServerData( data: Object ){
        super.onServerData( data );

        this.runningBallContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, this.runningBallContainer, 878, 676 );

        this.letsCopa( data );
        ( this.gameToolBar as CopaToolBar ).setMiniButton( this.bufLeftTurns == 0 );

        try{
            // RES.loadGroup( "bingoPipa" );
        }catch(e){}
    }

    protected initToolbar(){
        this.gameToolBar = new CopaToolBar;
		Com.addObjectAt( this, this.gameToolBar, 0, BingoGameToolbar.toolBarY );
        this.gameToolBar.showTip( "" );

		this.topbar = new Topbar;
		this.addChild( this.topbar );
	}

    /******************************************************************************************************************************************************************/

    private buffUI: CopaBuffUI;

    private buffBallPositions: Array<Array<Object>>;
    private buffBallBg1: egret.Bitmap;
    private buffBallBg2: egret.Bitmap;

    private peelMc: egret.Bitmap;
    private peelTop: egret.Bitmap;
    private peelLayer: egret.Sprite;

    private currentBuf: number;
    private bufLeftTurns: number;
    private bufMaxTurns: number;

    private bufPos: number;
    private buffWheel: any;
    private goKartRewards: any;
    private buffInfo: Array<Object>;

    private newBuffId: number;

    private squareUIOnCard: CopaSquareBar;

    private needShowFreeEb: boolean;
    private ebColorList: Array<number>;
    private freeEbList: Array<number>;
    private ebColorsSp: egret.DisplayObjectContainer;
    private superEbColorsSp: egret.DisplayObjectContainer;
    private freeEbUI1: egret.Bitmap;
    private freeEbUI2: egret.Bitmap;

    private needWaitForChoose: boolean;
    private cutBallsArray: Array<number>;
    private chooseBar: CopaChooseBar;

    private markPenLayer: CopaMarkPenBar;

    private markOnCard: Array<number>;
    private markUIs: Array<egret.Bitmap>;
    private needMarkOnCard: boolean;

    private bombLayer: CopaBombBar;

    private needRewardOnCard: boolean;
    private rewardUinit: egret.Bitmap;
    private rewardNumIndex: number;

    private letsCopa( data: Object ): void{

        this.getBuffBallPosition();
        this.deletesquare();
        this.buildBombs();
        this.buildMarkUI();
        this.buildMarkColumn();
        this.buildPeel();

        this.addChild( this.jackpotArea );

        this.buildChooseBar();

        this.buffWheel = data["buffWheel"];
        this.goKartRewards = data["goKartRewards"];

        this.buffUI = new CopaBuffUI;
        Com.addObjectAt( this, this.buffUI, 1320, 5 );

        this.rewardUinit = Com.addBitmapAt( this, this.assetStr( "free_extra_ball_star" ), 0, 0 );
        this.rewardUinit.visible = false;

        this.buffInfo = data["buffs"];
        let hasBetData: boolean = this.getCurrentBetBuff();

        if( !hasBetData || this.isCurrentBufNeedInit() ){
            trace( "valar morghulis" );
            this.getCurrentBuffFromServer();
        }
        else{
            trace( "valar dohaeris" );
            this.setCurrentBuffAfterInit();
        }

        this.firstTimePlayShowTutorail();
    }

    private getCurrentBetBuff(): boolean {
        let buffIndex: number = this.getBuffInfoIndex( this.buffInfo );
        if( buffIndex >= 0 ){
            this.bufPos = this.buffInfo[buffIndex]["buff_pos"];
            this.bufLeftTurns = this.buffInfo[buffIndex]["buffValue"];
            this.currentBuf = this.buffInfo[buffIndex]["buffID"];
            this.bufMaxTurns = this.buffInfo[buffIndex]["buffMaxValue"];
            if( this.miniGame )this.miniGame["currentPosition"] = this.bufPos;
            return true;
        }
        return false;
    }

    private setCurrentBuffAfterInit(){
        if( this.bufLeftTurns > 0 )this.getBuff( this.currentBuf );
        this.loadMiniGame( this.bufPos, this.buffWheel, this.goKartRewards );
        this.showCurrentBuff();
    }

    private setCurrentBuffAfterChangeBet(){
        if( this.bufLeftTurns > 0 ){
            this.getBuff( this.currentBuf );
        }
        else{
            ( this.gameToolBar as CopaToolBar ).setMiniButton( true );
        }
        this.showCurrentBuff();
    }

    private firstTimePlayShowTutorail(){
        if( localStorage.getItem( "CopaTT" ) ) return;
        else{
            localStorage.setItem( "CopaTT", "true" );
            this.dispatchEvent( new egret.Event( "new_game_tutorail" ) );
        }
    }

    private showCurrentBuff(): void{
        this.buffUI.setCurrentBuff( this.bufLeftTurns, this.bufMaxTurns, this.currentBuf );

        if( this.bufLeftTurns ){
            ( this.gameToolBar as CopaToolBar ).lockBet( false );
        }
        else{
            ( this.gameToolBar as CopaToolBar ).lockBet( true );
        }
        this.resetGameToolBarStatus();
    }

    private clickProtector: egret.Shape;

    private getCurrentBuffFromServer(): void{
        IBingoServer.buffHandlerCallback = this.onGetCurrentFromServer.bind( this );
        if( !this.clickProtector ){
            this.clickProtector = new egret.Shape;
            GraphicTool.drawRect( this.clickProtector, BingoBackGroundSetting.gameMask, 0, false, 0.0 );
            this.clickProtector.touchEnabled = true;
        }
        Com.addObjectAt( this, this.clickProtector, 0, 0 );
        IBingoServer.buffHandler( "init", GameData.currentBet );
    }

    private onGetCurrentFromServer( data: Object ): void{
        trace( data );

        this.bufPos = data["buff_pos"];
        this.bufLeftTurns = data["buffValue"];
        this.bufMaxTurns = data["buffMaxValue"];

        if( this.currentBuf == 7 ){
            this.markPenLayer.markColumn = data["mark_column"];
        }
        else if( this.currentBuf == 8 ){
            this.markOnCard = data["mark_on_card"];
        }
        else if( this.currentBuf == 10 ){
            this.rewardNumIndex = data["rewardNumIndex"];
        }

        if( !this.miniGame )this.loadMiniGame( this.bufPos, this.buffWheel, this.goKartRewards );
        this.miniGame.checkBuffBoat( this.bufPos )

        this.currentBuf = this.miniGame["config"][data["buff_pos"]];
        if( this.bufLeftTurns > 0 )this.getBuff( this.currentBuf );
        this.showCurrentBuff();
        this.saveBuffData();

        if( this.clickProtector && this.contains( this.clickProtector ) ) this.removeChild( this.clickProtector );
    }

    private saveBuffData(): void{
        let buffIndex: number = this.getBuffInfoIndex( this.buffInfo );

        if( buffIndex < 0 ){
            buffIndex = this.buffInfo.length;
            this.buffInfo[buffIndex] = {};
            this.buffInfo[buffIndex]["buffBet"] = GameData.currentBet;
        }
        this.buffInfo[buffIndex]["buff_pos"] = this.bufPos;
        this.buffInfo[buffIndex]["buffValue"] = this.bufLeftTurns;
        this.buffInfo[buffIndex]["buffID"] = this.currentBuf;
        this.buffInfo[buffIndex]["buffMaxValue"] = this.bufMaxTurns;
    }

    private getBuff( buffId: number ): void{
        switch( buffId ){
            case 1:
                this.showSquare( true );
                break;
            case 2:
                this.showFreeEb( true );
                break;
            case 3:
                this.showAditionBall( true );
                break;
            case 4:
                this.showEbColor( true );
                break;
            case 5:
                this.dblineDoubled( true );
                break;
            case 6:
                this.waitForChoose( true );
                break;
            case 7:
                this.markTwoNumbers( true );
                break;
            case 8:
                this.markNumberOnCard( true );
                break;
            case 9:
                this.needBomb( true );
                break;
            case 10:
                this.needReward( true );
                break;
            case 11:
                // this.startBoatGame();
                break;
        }
    }

    private getBuffBallPosition(): void{
        let balls = BallManager["balls"];
        this.buffBallPositions = [];
        this.buffBallPositions[0] = balls[34]["path"];
        this.buffBallPositions[1] = balls[35]["path"];
        this.buffBallBg1 = Com.addBitmapAt( this, this.assetStr("icon_add_ball"), 769, 673 );
        this.buffBallBg2 = Com.addBitmapAt( this, this.assetStr("icon_add_ball"), 1149, 673 );
        this.addChildAt( this.buffBallBg1, this.getChildIndex( this.ballArea ) );
        this.addChildAt( this.buffBallBg2, this.getChildIndex( this.ballArea ) );
        this.showAditionBall( false );
    }

    private showAditionBall( isShow: boolean ){
        let balls = BallManager["balls"];
        this.buffBallBg1.visible = isShow;
        this.buffBallBg2.visible = isShow;
        if( isShow ){
            if( this.buffBallPositions[0] == balls[34]["path"] ){
                return;
            }
            for( let i: number = balls.length - 1; i >= 36; i-- ){
                balls[i]["path"] = balls[i-2]["path"];
            }
            balls[34]["path"] = this.buffBallPositions[0];
            balls[35]["path"] = this.buffBallPositions[1];
        }        
        else{
            if( this.buffBallPositions[0] != balls[34]["path"] ){
                return;
            }
            for( let i: number = 34; i < balls.length - 2; i++ ){
                balls[i]["path"] = balls[i+2]["path"];
            }
        }
    }

    private dblineDoubled( isDoubled: boolean ): void{
        ( this.payTableArea as CopaPaytalbeLayer ).dblineDoubled( isDoubled );
    }

    private deletesquare(): void{
        this.squareUIOnCard = new CopaSquareBar();
        this.addChild( this.squareUIOnCard );

        this.squareUIOnCard.getSquareNumbers();
        this.showSquare( false );
    }

    private showSquare( isShow: boolean ): void{
        this.squareUIOnCard.visible = isShow;
        ( this.payTableArea as CopaPaytalbeLayer ).squareHappend( isShow );

        if( isShow ) this.squareUIOnCard.reShowSquareNumbers();
    }

    private showEbColor( isShow: boolean ): void{
        CopacabanaGird.showBinkColor = isShow;
    }

    private showFreeEb( isShow: boolean ): void{
        this.needShowFreeEb = isShow;
    }

    private buildChooseBar(): void{
        this.chooseBar = new CopaChooseBar( this.onNumberChoise.bind(this) );
        this.addChild( this.chooseBar );
        this.chooseBar.visible = false;
    }

    private onNumberChoise( event: egret.Event ): void{
        let numIndex: number = Math.floor( event.target.name );
        let indexPt: egret.Point = GameCardUISettings.getIndexOnCard( numIndex );
        let getNumber: number = GameCardUISettings.numberAtCard( indexPt.x, indexPt.y );
        let indexInCutArray: number = this.cutBallsArray.indexOf( getNumber );

        if( indexInCutArray >= 0 ){
            this.runCutNumbers( indexInCutArray );
        }
        else{
            this.sendSelectNumberRequest( getNumber );
        }
    }

    private runCutNumbers( indexInCutArray: number ): void{
        this.chooseBar.visible = false;
        let newAr: Array<number> = this.cutBallsArray.splice( indexInCutArray, 1 );
        this.cutBallsArray.unshift( newAr[0] );
        this.ballArea.runCutBalls( this.cutBallsArray );
    }

    private waitForChoose( isWait: boolean ): void{
        this.needWaitForChoose = isWait;
    }

    public getResultListToCheck(): boolean{
        if( this.needWaitForChoose && this.currentBallIndex <= 30 ){
            super.getResultListToCheck();
            this.showChooseBar();
            return true;
        }
        return super.getResultListToCheck();
    }

    private showChooseBar(): void{
        this.chooseBar.show();
    }

    private sendSelectNumberRequest( num: number ): void{
        IBingoServer.selectNumberCallback = this.onSelectnumberData.bind( this );
        IBingoServer.selectNumber( num );
    }

    private onSelectnumberData( data: Object ): void{
        this.chooseBar.visible = false;

        this.updateCredit( data );

        this.btExtra = data["btextra"];
        this.ganho = data["ganho"];
        this.valorextra = data["ebPrice"];

        let newCutBalls: Array<number> = data["bolas"];
        newCutBalls.splice( 0, newCutBalls.length - this.cutBallsArray.length );
        this.ballArea.runCutBalls( newCutBalls );
    }

    protected startPlay(): void {
        super.startPlay();
        
        if( this.squareUIOnCard.visible )this.squareUIOnCard.reShowSquareNumbers();

        if( this.markPenLayer.needMarkLine ){
            this.markPenLayer.start();
        }
        
        if( this.bombLayer.needBombOnCard ){
            this.needBomb( true );
        }
    }

    protected showMiniGame(): void{
        this.startMiniGame();
    }

    private countBuffLeft(): boolean{
        this.bufLeftTurns--;
        let bufEnd: boolean = false;
        if( this.bufLeftTurns <= 0 ){
            ( this.gameToolBar as CopaToolBar ).setMiniButton( true );
            if( this.bufLeftTurns == 0 ){
                this.cancelBuff();
                bufEnd = true;
            }
        }
        this.showCurrentBuff();
        this.saveBuffLeftTurnsChange();
        return bufEnd;
    }

    private saveBuffLeftTurnsChange(): void{
        let buffIndex: number = this.getBuffInfoIndex( this.buffInfo );
        if( buffIndex < 0 ) throw new Error( "#2049" );

        this.buffInfo[buffIndex]["buffValue"] = this.bufLeftTurns;
    }

    private cancelBuff(): void{
        switch( this.currentBuf ){
            case 1:
                this.showSquare( false );
                break;
            case 2:
                this.showFreeEb( false );
                break;
            case 3:
                this.showAditionBall( false );
                break;
            case 4:
                this.showEbColor( false );
                break;
            case 5:
                this.dblineDoubled( false );
                break;
            case 6:
                this.waitForChoose( false );
                break;
            case 7:
                this.markTwoNumbers( false );
                break;
            case 8:
                this.markNumberOnCard( false );
                break;
            case 9:
                this.needBomb( false );
                break;
            case 10:
                this.needReward( false );
                break;
        }
    }

    public onPlay( data: Object, hotData: any ){
        if( this.needWaitForChoose ){
            let cutIndex = data["cut_ball_position"];
            this.cutBallsArray = data["bolas"].splice( cutIndex, data["bolas"].length );
        }

        super.onPlay( data );

        if( this.needMarkOnCard ){
            this.addMarkNumbers();
        }
        
        if( CopacabanaGird.showBinkColor ) this.ebColorList = data["eb_colors"];
        if( this.needShowFreeEb ) this.freeEbList = data["free_eb"];
    }

    public onExtra( data: Object ){
        let hasPeel: boolean = this.peelIfMissOne( this.currentBallIndex + 1, data["extra"] );

        if( hasPeel ){
            this.missOneForBingoNumbers = [];
            this.missOneForAllNumbers = [];
            setTimeout( this.onExtra.bind( this, data ), 3890 );
            return;
        }

        super.onExtra( data );

        if( !CopacabanaGird.showBinkColor )return;
        let superEbColors: Array<number> = data["eb_colors"];
        if( superEbColors && superEbColors.length == 5 ){
            this.superEbColorsSp = new egret.DisplayObjectContainer;
            this.addChildAt( this.superEbColorsSp, this.getChildIndex( this.superExtraBg ) + 1 );
            for( let i: number = 0; i < superEbColors.length; i++ ){
                let ballPt: egret.Point = BallManager.getBallLastPosition( this.currentBallIndex + i );
                Com.addBitmapAt( this.superEbColorsSp, this.assetStr( "ball_bg_01" ), ballPt.x, ballPt.y ).filters = [ MatrixTool.colorMatrixPure( CopacabanaGird.rangeColors[superEbColors[i]] ) ];
            }
        }
    }

    private drawEbColors(): void{
        if( this.ebColorList ){
            this.ebColorsSp = new egret.DisplayObjectContainer;
            this.ebColorsSp.x = this.extraUIObject.x;
            this.ebColorsSp.y = this.extraUIObject.y;
            this.addChildAt( this.ebColorsSp, this.getChildIndex( this.extraUIObject ) + 1 );
            for( let i: number = 0; i < this.ebColorList.length; i++ ){
                Com.addBitmapAt( this.ebColorsSp, this.assetStr( "ball_bg_01" ), 15, 36 * i ).filters = [ MatrixTool.colorMatrixPure( CopacabanaGird.rangeColors[this.ebColorList[i]] ) ];
            }
            this.ebColorList = null;
        }
    }

    private addFreeEbIcons(): void{
        if( !this.freeEbUI1 ){
            this.freeEbUI1 = this.getGratisUI() as egret.Bitmap;
            this.freeEbUI2 = this.getGratisUI() as egret.Bitmap;
            let ebIndex: number = this.getChildIndex( this.extraUIObject );
            this.addChildAt( this.freeEbUI1, ebIndex + 1 );
            this.addChildAt( this.freeEbUI2, ebIndex + 1 );
        }
        if( this.freeEbList && this.freeEbList.length == 2 ){
            let pt1: Object = BallManager.getBallLastPosition( this.freeEbList[0] + 34 );
            let pt2: Object = BallManager.getBallLastPosition( this.freeEbList[1] + 34 );
            this.freeEbUI1.x = pt1["x"];
            this.freeEbUI1.y = pt1["y"];
            this.freeEbUI2.x = pt2["x"];
            this.freeEbUI2.y = pt2["y"];
            this.freeEbUI1.visible = this.freeEbUI2.visible = true;
        }
    }

    public quickPlay(): void {
        // forbid keyboard
    }

    private markTwoNumbers( isMark: boolean ): void{
        this.markPenLayer.showMarkPen( isMark );
    }

    public onChangeNumber( data: Object ){
        super.onChangeNumber( data );

        this.bombLayer.getBombNumbers();
        this.squareUIOnCard.getSquareNumbers();

        if( this.bufLeftTurns <= 0 )return;
        if( this.currentBuf == 7 ){
            this.markPenLayer.markColumn = data["mark_column"];
            this.markTwoNumbers( true );
        }
        else if( this.currentBuf == 8 ){
            this.markOnCard = data["mark_on_card"];
            if( this.needMarkOnCard ){
                this.markNumberOnCard( true );
            }
            else{
                throw new Error( "bomb error" );
            }
        }
        else if( this.currentBuf == 10 ){
            this.rewardNumIndex = data["rewardNumIndex"];
            this.needReward( true );
        }
        else if( this.currentBuf == 9 ){
            if( this.bombLayer.needBombOnCard ){
                this.needBomb( true );
            }
            else{
                throw new Error( "bomb error" );
            }
        }
    }

    private buildMarkUI(): void{
        this.markUIs = [];
        for( let i: number = 0; i < 4; i++ ){
            this.markUIs[i] = Com.addBitmapAt( this, this.assetStr( "cover_number" ), 0, 0 );
            this.markUIs[i].visible = false;
        }
    }

    private markNumberOnCard( isMark: boolean ): void{
        this.needMarkOnCard = isMark;

        if( isMark ){
            for( let i: number = 0; i < 4; i++ ){
                this.markUIs[i].visible = true;
                let pt: egret.Point = GameCardUISettings.getIndexOnCard( this.markOnCard[i] );
                GameCardUISettings.setTargetToPositionOnCard( this.markUIs[i], pt.x, pt.y );
            }
        }
        else{
            for( let i: number = 0; i < 4; i++ ){
                this.markUIs[i].visible = false;
            }
        }
    }

    private addMarkNumbers(): void{
        for( let i: number = 0; i < this.markOnCard.length; i++ ){
            let pt: egret.Point = GameCardUISettings.getIndexOnCard( this.markOnCard[i] );
            this.getNumberOnCard( pt.x, pt.y );
        }
    }

    private buildMarkColumn(): void{
        this.markPenLayer = new CopaMarkPenBar;
        this.addChild( this.markPenLayer );
    }

    private buildBombs(): void{
        this.bombLayer = new CopaBombBar;
        this.addChild( this.bombLayer );

        this.needBomb( false );
    }

    private needBomb( isNeedBomb: boolean ): void{
        this.bombLayer.showBomb( isNeedBomb );
    }

    private bombCard( cardId: number ): void{
        this.getNumberOnCard( cardId, 1 );
        this.getNumberOnCard( cardId, 3 );
        this.getNumberOnCard( cardId, 11 );
        this.getNumberOnCard( cardId, 13 );
        this.bombLayer.explode( cardId );
        this.playSound("pipa_bomb_mp3");
    }

    private needReward( isNeedReward: boolean ): void{
        this.needRewardOnCard = isNeedReward;

        if( isNeedReward ){
            this.rewardUinit.visible = true;
            let indexPt: egret.Point = GameCardUISettings.getIndexOnCard( this.rewardNumIndex );
            GameCardUISettings.setTargetToPositionOnCard( this.rewardUinit, indexPt.x, indexPt.y );
        }
        else{
            this.rewardUinit.visible = false;
        }
    }

    private buildPeel(): void{
        this.peelLayer = new egret.Sprite;
        Com.addObjectAt( this, this.peelLayer, 0, 0 );
        GraphicTool.drawRect( this.peelLayer, BingoBackGroundSetting.gameMask, 0, false, 0.01 );
        this.peelLayer.touchEnabled = true;
        this.peelLayer.visible = false;
        Com.addBitmapAt( this.peelLayer, this.assetStr( "peel_01" ), 853, 669 );
        let peel01: egret.Bitmap =  Com.addBitmapAt( this.peelLayer, this.assetStr( "peel_01" ), 1147, 669 );
        peel01.scaleX = -1;
        let peelContainer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this.peelLayer, peelContainer, 872, 672 );
        this.peelTop = Com.addBitmapAtMiddle( this.peelLayer, this.assetStr( "peel_02" ), 1000, 676 );

        peelContainer.mask = new egret.Rectangle( 0, 0, 256, 254 );
        this.peelMc = Com.addBitmapAt( peelContainer, this.assetStr( "peel_03" ), 0, 0 );
    }

    private showPeel(): void{
        this.peelLayer.visible = true;
        this.addChild( this.peelLayer );
        this.peelMc.y = 0;
        this.peelTop.scaleY = 0.2;
        let tw: egret.Tween = egret.Tween.get( this.peelMc );
        tw.to( { y: -250 }, 3900 );
        tw.call( () => { this.peelLayer.visible = false } );
        let tw2: egret.Tween = egret.Tween.get( this.peelTop );
        tw2.to( { scaleY: 1 }, 3800 );

        this.playSound( "pipa_peel_mp3" );
    }

    public checkDinero( num: number ): boolean{
        let isOOC: boolean = Number( this.dinero ) < num;
        if( isOOC ) this.dispatchEvent(new egret.Event("out_of_dinero"));
        return isOOC;
    }

    private stretchBg(){
        let bg: egret.Bitmap = this.getChildAt( 0 ) as egret.Bitmap;
        if( bg ){
            bg.fillMode = egret.BitmapFillMode.SCALE;
            bg.width = BingoBackGroundSetting.gameMask.width;
            bg.height = BingoBackGroundSetting.gameMask.height;
            return true;
        }
        return false;
    }

    private horBallBg(){
        let ballBg: egret.Bitmap = this.getChildByName( this.assetStr( "ball_library" ) ) as egret.Bitmap;
        let newBallBg: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
        this.addChildAt( newBallBg, this.getChildIndex( ballBg ) );
        newBallBg.addChild( ballBg );
        let hor: egret.Bitmap = Com.addBitmapAt( newBallBg, this.assetStr( "ball_library" ), ballBg.x + ballBg.width * 2 - 1, ballBg.y );
        hor.scaleX = -1;
    }

    /******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1411, 120 ), jackpot, jackpotMinBet, betConfig, new egret.Point( -15, -10 ), new egret.Rectangle( 0, 4, 250, 50 ), 30, 0xFFFFFF, null, 0, 0, true ) );
        let jkText: egret.Bitmap = Com.addBitmapAtMiddle( this, this.assetStr( "jackpot_" + GlobelSettings.language ), 1331, 148 );
    }

    protected afterCheck( resultList: Array<Object> ): void{
        super.afterCheck( resultList );

        this.ganhoCounter.countGanhoAndPlayAnimation(resultList);

        this.checkMissOne(resultList);
    }

    protected showWinPopup( cardId: number, paytableName: string ){
        if( paytableName == "double_line" || paytableName == "double_line2" ) this.dbLineAnimation();
        else if( paytableName == "square" ) this.squareAnimation();
    }

    private dbLineAnimation(): void{
        let pipaDbLineAnimation: CopaAnimation = new CopaAnimation( "pipaDoubleLine_json" );
        Com.addObjectAt( this, pipaDbLineAnimation, 0, 0 );
    }

    private squareAnimation(): void{
        let pipaDbLineAnimation: CopaAnimation = new CopaAnimation( "pipaSquare_json", true );
        Com.addObjectAt( this, pipaDbLineAnimation, 0, 0 );
    }

    private missOneForAllNumbers: Array<number>;
    private missOneForBingoNumbers: Array<number>;

    private checkMissOne( resultList: Array<Object> ): void{
        this.missOneForAllNumbers = [];
        this.missOneForBingoNumbers = [];
        for( let i: number = 0; i < resultList.length; i++ ){
            for( let ob in PayTableManager.payTablesDictionary ){
                let result: PaytableCheckResult = resultList[i][ob];
                if( result.unfitIndex >= 0 ){
                    this.pushMissOneNumber( this.missOneForAllNumbers, i, result.unfitIndex );
                    if( ob == "bingo" )this.pushMissOneNumber( this.missOneForBingoNumbers, i, result.unfitIndex );
                }
                if( result.unfitIndexs ){
                    for( let unfitOb in result.unfitIndexs ){
                        if( ob == "line" )continue;
                        this.pushMissOneNumber( this.missOneForAllNumbers, i, result.unfitIndexs[unfitOb] );
                    }
                }
            }
        }
    }

    private pushMissOneNumber( ar: Array<number>, cardIndex: number, gridIndex: number ): void{
        let missNumber: number = GameCardUISettings.numberAtCard( cardIndex, gridIndex );
        if( ar.indexOf( missNumber ) < 0 )ar.push( missNumber );
    }

    private peelIfMissOne( ballIndex: number, ballNumber: number ): boolean{
        let isSuperEb: boolean = false;
        if( ballIndex > 40 ){
            if( !this.buffBallBg1.visible || ( this.buffBallBg1.visible && ballIndex > 42 ) ){
                isSuperEb = true;
            }
        }

        if( isSuperEb ){
            if( this.missOneForBingoNumbers.length ){
                for( let i: number = 0; i < this.missOneForBingoNumbers.length; i++ ){
                    if( Math.abs( this.missOneForBingoNumbers[i] - ballNumber ) <= 1 ){
                        this.showLastBallAt( ballNumber, 0, 0 );
                        this.showPeel();
                        return true;
                    }
                }
            }
        }
        else{
            if( this.missOneForAllNumbers.length ){
                for( let i: number = 0; i < this.missOneForAllNumbers.length; i++ ){
                    if( Math.abs( this.missOneForAllNumbers[i] - ballNumber ) <= 1 ){
                        this.showLastBallAt( ballNumber, 0, 0 );
                        this.showPeel();
                        return true;
                    }
                }
            }
        }

        return false;
    }

    protected onBetChanged(event: egret.Event): void{
        super.onBetChanged(event);
        
        if( this.currentBuf && this.bufLeftTurns ){
            this.cancelBuff();
        }

        let hasBetData: boolean = this.getCurrentBetBuff();

        if( !hasBetData || this.isCurrentBufNeedInit() ){
            trace( "valar morghulis" );
            this.getCurrentBuffFromServer();
        }
        else{
            trace( "valar dohaeris" );
            this.setCurrentBuffAfterChangeBet();
        }
        // if (event.data["type"] !== 0) this.playSound("t90_bet_mp3");
    }

    private isCurrentBufNeedInit(): boolean{
        if( this.currentBuf == 7 || this.currentBuf == 8 || this.currentBuf == 10 || this.currentBuf == 11 ){
            if( this.bufLeftTurns > 0 ) return true;
        }
        return false;
    }

    protected hasExtraBallFit(): void {
        // this.stopSound("t90_ball_mp3");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            // this.playSound("t90_extra_loop_wav", -1);
            this.showFreeExtraPosition();

            if( CopacabanaGird.showBinkColor )this.drawEbColors();
            if( this.needShowFreeEb )this.addFreeEbIcons();
        }

        if( this.isMegaBall ){
            this.superExtraBg.visible = true;
            this.gameToolBar.megeExtraOnTop( true );
        }
    }

    protected getGratisUI(): egret.DisplayObject{
        return Com.createBitmapByName( this.assetStr( "free_extra_ball_star" ) );
    }

    protected showExtraUI( show: boolean = true ){
        if( !show && this.gratisUI && this.contains( this.gratisUI ) )this.removeChild( this.gratisUI );
    }

    protected roundOver(): void {
        super.roundOver();

        if( this.ebColorsSp && this.contains( this.ebColorsSp ) ){
            this.removeChild( this.ebColorsSp );
        }
        if( this.superEbColorsSp && this.contains( this.superEbColorsSp ) ){
            this.removeChild( this.superEbColorsSp );
        }
        if( this.freeEbUI1 ){
            this.freeEbUI1.visible = this.freeEbUI2.visible = false;
        }
        // this.stopSound("t90_ball_mp3");
        // this.stopSound("t90_extra_loop_wav");
    }

    public onRoundOver( data: Object ){
        IBingoServer.roundOverCallback = null;
        
        this.roundOver();

        this.gameToolBar.showStop( false );
        this.gameToolBar.unlockAllButtons();
        if( data["ganho"] != "unexpress" )this.gameToolBar.showWinResult( data["ganho"] );
        // else this.gameToolBar.showWinResult( this.ganho );

        this.updateCredit( data );

        let bufEnd: boolean = this.countBuffLeft();

        if( !bufEnd )this.checkAuto();
        else{
            if(this.gameToolBar.autoPlaying){
                ( this.gameToolBar as CopaToolBar ).roundOverWhenAuto();
            }
        }
    }

    public onCancelExtra( data: Object ){
        super.onCancelExtra( data );
        this.countBuffLeft();
    }

    protected getExtraBallFit(): void {
        // this.playSound("t90_extra_ball_mp3");
    }

    protected collectExtraBall(): void {
        // override
    }

    protected changeNumberSound(): void {
        // this.playSound("t90_card_mp3");
    }

    /**
     * load mini game
     */
    private loadMiniGame(currentPosition: number, chessArrayConfig: Array<number>, goKartRewards: any): void {
        this.miniGame = new CopaChess(currentPosition, chessArrayConfig);
        this.miniGame.addEventListener(CopaChess.REROLL_DICE, this.sendRerollCommand, this);
        this.miniGame.addEventListener(Copacabana.PLAY_MINI_GAME_SOUND, this.playMiniGameSound, this);
        this.miniGame.addEventListener(CopaChess.GET_BOAT_GAME, this.startBoatGame, this);
        this.miniGame.addEventListener(CopaChess.MINI_GAME_OVER, this.miniGameOver, this);
        Com.addObjectAt(this, this.miniGame, 0, 0);

        // load boat game
        this.boatGame = new CopaBoat( goKartRewards );
        this.boatGame.visible = false;
        this.boatGame.addEventListener(Copacabana.PLAY_MINI_GAME_SOUND, this.playMiniGameSound, this);
        this.boatGame.addEventListener(Copacabana.STOP_MINI_GAME_SOUND, this.stopMiniGameSound, this);
        this.boatGame.addEventListener(CopaBoat.GET_TURBO, this.sendGetTurboCommand, this);
        this.boatGame.addEventListener(CopaBoat.BOAT_GAME_OVER, this.boatGameOver, this);
        Com.addObjectAt(this, this.boatGame, 0, 0);
    }

    /**
     * start boat game
     */
    private startBoatGame(): void {
        this.miniGame.visible = false;
        this.boatGame.visible = true;
        this.boatGame.initGame(GameData.currentBet);
        this.addChild( this.boatGame );
    }

    /**
     * start mini game
     */
    private startMiniGame(): void {
        this.miniGame.startGame();
        this.addChild( this.miniGame );
        ( this.gameToolBar as CopaToolBar ).setMiniButton( false );
    }

    /**
     * send reroll command
     */
    private sendRerollCommand( event: egret.Event ): void {
        IBingoServer.buffHandler( event.data["action"], GameData.currentBet );
        if (event.data["action"] === "double") {
            IBingoServer.buffHandlerCallback = this.onDoublePower.bind(this);
        } else {
            IBingoServer.buffHandlerCallback = this.onRoll.bind(this);
        }
    }

    private onRoll( data: Object ): void{
        trace( data )
        if( data["add_buff_state"] == true ){
            this.newBuffId = this.miniGame.runDice( data["buff_dices"], data["buffValue"], data["buff_pos"], data["roll_again_price"], data["double_buff_rounds_price"] );
            this.bufLeftTurns = data["buffValue"];
            this.bufMaxTurns = this.bufLeftTurns;
            this.bufPos = data["buff_pos"];
            if( this.newBuffId == 7 ){
                this.markPenLayer.markColumn = data["mark_column"];
            }
            else if( this.newBuffId == 8 ){
                this.markOnCard = data["mark_on_card"];
            }
            else if( this.newBuffId == 10 ){
                this.rewardNumIndex = data["rewardNumIndex"];
            }

            if( this.dinero != data["secondCurrency"] )this.dispatchEvent(new egret.Event("updateCoinsAndXp", false, true, data));
        }
        else{
            console.log( data );
            throw new Error( "wrong server item" );
        }
    }

    private onDoublePower(data: Object): void {
        this.bufLeftTurns = data["buffValue"];
        this.miniGame.getDoublePowerCallback();
        this.saveBuffLeftTurnsChange();
        if( this.dinero != data["secondCurrency"] )this.dispatchEvent(new egret.Event("updateCoinsAndXp", false, true, data));
    }

    /**
     * send get turbo command
     */
    private sendGetTurboCommand(event: egret.Event): void {
        IBingoServer.goKartHandler(event.data["action"], typeof event.data["rewardType"] === "undefined" ? -1 : event.data["rewardType"]);
        IBingoServer.goKartHandlerCallback = this.onKartTurbo.bind(this);
    }

    /**
     * on kart turbo
     */
    private onKartTurbo(data: Object): void {
        if (data["isGetTurbo"] !== null) {
            this.boatGame.turbo(data["isGetTurbo"]);
        } else if (data["select_gokart_state"] !== null) {
            this.boatGame.choicePrizeCallback(data["select_gokart_state"]);
        } else {
            // boat game over
            this.boatGame.gameOver(data["buff_pos"], data["buffReward"]);
            this.bufLeftTurns = data["buffValue"];
            this.bufMaxTurns = this.bufLeftTurns;

            this.newBuffId = this.miniGame["config"][data["buff_pos"]];
            this.bufPos = data["buff_pos"];
        }

        if( this.dinero != data["secondCurrency"] )this.dispatchEvent(new egret.Event("updateCoinsAndXp", false, true, data));
    }

    /**
     * play mini game sound
     */
    private playMiniGameSound(event: egret.Event): void {
        let soundName = event.data["soundName"];
        let repeat = event.data["repeat"];
        this.playSound(soundName, repeat ? -1 : 1, null, this);
    }

    /**
     * stop mini game sound
     */
    private stopMiniGameSound(event: egret.Event): void {
        this.stopSound(event.data["soundName"]);
    }

    /**
     * mini game over
     */
    private miniGameOver(): void {
        this.miniGame.visible = false;

        this.currentBuf = this.newBuffId;
        this.getBuff( this.currentBuf );

        this.showCurrentBuff();
        this.saveBuffData();
    }

    /**
     * boat game over
     */
    private boatGameOver(event: egret.Event): void {
        this.miniGame.visible = true;
        this.boatGame.visible = false;

        egret.setTimeout(function (buffPos: number) {
            this.miniGame.kartGameOver(buffPos, this.bufLeftTurns);
        }.bind(this, event.data["buffPos"]), this, 1000);
    }

    public static resetBgMusicTimer(): void{
        let pipaGame: Copacabana = BingoMachine["currentGame"] as Copacabana;
        if( pipaGame ){
            ( pipaGame.gameToolBar as CopaToolBar ).resetBgMusicTimer();
        }
    }
}
class Pipa extends V2Game{
    public static PLAY_MINI_GAME_SOUND: string = "PLAY_MINI_GAME_SOUND";
    public static STOP_MINI_GAME_SOUND: string = "STOP_MINI_GAME_SOUND";
    private miniGame: PipaChess;
    private boatGame: PipaBoat;

    protected static get classAssetName(){
        return "pipa";
    }

    protected static get animationAssetName(){
        return "pipaAnimation";
    }

    public constructor( assetsPath: string ) {
        super( "pipa.conf", assetsPath, 68 );
        this.ptFilterConfig = "pipa_filt";

        this.gratisUIIsOverExtraUI = true;
        PaytableUI.textBold = true;

        CardManager.cardType = CopacabanaCard;
        CardManager.gridType = CopacabanaGird;

        TowerGrid.blink1PicName = "box_green";
        TowerGrid.blink2PicName = "box_green_blink";
        TowerGrid.defaultBgPicName = "box_white";
        TowerGrid.onEffBgPicName = "box_blue";
        TowerGrid.linePicName = "box_red";

        CardGrid.defaultBgColor = 0xFFFFFF;
        CardGrid.defaultNumberSize = 25;

        CardGrid.blinkColors1 = 0x19BF0E;
        CardGrid.blinkColors2 = 0x19BF0E;
        GameCard.useRedEffect = true;

        BallManager.normalBallInterval = 40;

        let languageText = GameUIItem.languageText;
        languageText["accept"] = { en: "Accept", es: "Aceptar", pt: "Aceitar" };
        languageText["rounds"] = { en: "rounds", es: "rondas", pt: "rodadas" };
        languageText["rollAgain"] = { en: "Roll the dice again", es: "Juega el dado de nuevo", pt: "Jogue o dado novamente" };
        languageText["doubleDuration"] = { en: "Double power duration", es: "Doblar el tiempo del poder", pt: "Dobre o tempo do poder" };
        languageText["RollDice"] = { en: "ROLL", es: "Juega", pt: "Jogue" };
        languageText["go"] = { en: "GO!", es: "¡VA!", pt: "VAI!" };
        languageText["choose"] = { en: "Choose", es: "Eligir", pt: "Escolher" };
        languageText["vip"] = { en: "vip", es: "vip", pt: "vip" };
        languageText["coming_soon"] = { en: "Coming soon...", es: "En Breve...", pt: "Em Breve..." };

        languageText["no_bonus"] = { en: "Better luck next time", es: "Buena suerte en la próxima", pt: "Boa Sorte na Próxima" };
        languageText["portuguese_stone"] = { en: "Portuguese Stone", es: "Piedra portuguesa", pt: "Pedra Portuguesa" };
        languageText["wiz_beach_soccer"] = { en: "Wiz beach Soccer", es: "Crack de la Arena", pt: "Craque da Areia" };
        languageText["divine_shell"] = { en: "Divine Shell", es: "Divina Concha", pt: "Divina Concha" };
        languageText["rainbow"] = { en: "Rainbow", es: "Arco iris", pt: "Arco íris" };
        languageText["cold_coconut"] = { en: "Cold coconut", es: "Coco helado", pt: "Coco Gelado" };
        languageText["magic_ball"] = { en: "Magic Ball", es: "Bola Mágica", pt: "Bola Mágica" };
        languageText["umbrella_beach"] = { en: "Sunscreen", es: "Protector solar", pt: "Protetor Solar" };
        languageText["ball_fish"] = { en: "Ball Fish", es: "Pez Bola", pt: "Peixe Bola" };
        languageText["seaquake"] = { en: "Water Ball", es: "Bola de agua", pt: "Bexiga de água" };
        languageText["currency"] = { en: "Currency name", es: "Currency name", pt: "Currency name" };
        languageText["jet_sprint"] = { en: "Jet Sprint", es: "Corrida de Lancha", pt: "Corrida de Lanchas" };

        languageText["change"] = { en: "Change", es: "Cambiar", pt: "Trocar" };
        languageText["don't change"] = { en: "Don't change", es: "No cambiar", pt: "Não trocar" };
        languageText["if want change"] = { en: "If you change your bet during spin without buff,\n the counter will return to the begin",
            es: "Si usted cambia la apuesta durante las partidas\n sin poderes, el marcador\n luminoso regresará al principio",
            pt: "Se você trocar a aposta durante as partidas\n sem poderes, o marcador\n luminoso retornará ao início" };
        languageText["cann't change"] = { en: "The bet can not be changed during the buff session",
            es: "Durante la utilización de cualquier beneficio,\n no podrás cambiar la apuesta",
            pt: "Durante a utilização de qualquer poder a aposta\n não poderá ser alterada" };
        languageText["click_to_continue"] = { en: "Click to continue", es: "Haga Clic para continuar", pt: "Clique para continuar" };

        GameToolBar.toolBarY = 474;
        BingoBackGroundSetting.defaultScale = false;
    }

    protected init(){
        super.init();

        CopacabanaGird.mcf = this._mcf;

        this.showNoBetAndCredit();

        this.extraUIObject.visible = true;

        this.runningBallContainer = new egret.DisplayObjectContainer;

        this.buildSuperEbArea( "big_ball_bg2", 331, 343 );
        CopacabanaGird.rangeColors = [ 0x0b5ff2, 0x27a00d, 0x8a0eaf, 0xbd0a0e, 0xc8800d, 0xE193B1 ];

        let lanArray: Array<string> = ["en", "es", "pt"];
        for( let i: number = 0; i < 3; i++ ){
            if( lanArray[i] == GlobelSettings.language )continue;
            this.getChildByName( this.assetStr( "arrow_l_" + lanArray[i] ) ).visible = false;
            this.getChildByName( this.assetStr( "arrow_r_" + lanArray[i] ) ).visible = false;
        }

        this.ganhoCounter = new PipaGanhoCounter( this.showWinPopup.bind( this ) );
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        this.showLastBallAt( ballIndex, 323, 339 );

        if( this.needMarkLine ){
            if( ballIndex == this.markNumber1 || ballIndex == this.markNumber2 ){
                let indexPt: egret.Point = this.getIndexOnCard( this.markColumn[ ballIndex == this.markNumber1 ? 0 : 1 ] );
                let gridIndexY: number = indexPt.y % 5;
                this.getColumnNumbers( indexPt.x, gridIndexY );
            }
        }

        if( this.needBombOnCard ){
            let bombCardIndex: number = this.bombNumbers.indexOf( ballIndex );
            if( bombCardIndex >= 0 ){
                this.bombCard( bombCardIndex );
            }
        }

        if( this.squareUIOnCard.visible ){
            let squareIndex: number = this.squareNumbers.indexOf( ballIndex );
            if( squareIndex >= 0 ){
                this.squareGridsOnCard[squareIndex].visible = false;
            }
        }

        if( this.currentBallIndex > 34 ){
            if( !this.buffBallBg1.visible || this.currentBallIndex > 36 ){
                let path: Array<Object> = BallManager["balls"][this.currentBallIndex-1]["path"];
                let pt: Object = path[path.length-1];
                let mc: egret.MovieClip = Com.addMovieClipAt( this, this._mcf, "star", pt["x"] - 132, pt["y"] - 102 );
                mc.gotoAndPlay( 1, 1 );
            }
        }

        this.playSound("pipa_ball_mp3");
    }

    protected showLastBallAt( ballIndex: number, x: number, y: number, scale: number = 1 ): void{
        if( this.runningBallUI && ( this.runningBallContainer ).contains( this.runningBallUI ) ){
            ( this.runningBallContainer ).removeChild( this.runningBallUI );
        }
        this.runningBallUI = this.ballArea.getABigBall( ballIndex, "_small", 60 );
        Com.addObjectAt( this.runningBallContainer, this.runningBallUI, x, y );

        clearTimeout( this.timeoutId );
        this.timeoutId = setTimeout( this.removeBigBall.bind( this ), 1000 * scale );
    }

    private timeoutId: number;

    private removeBigBall(){
        if( this.runningBallUI && ( this.runningBallContainer ).contains( this.runningBallUI ) ){
            ( this.runningBallContainer ).removeChild( this.runningBallUI );
        }
    }

    protected onServerData( data: Object ){
        super.onServerData( data );

        this.addChild( this.runningBallContainer );

        this.removeChild( this.gameToolBar );
        this.gameToolBar = new PipaToolBar;
        this.gameToolBar.minCardCount = 4;
        Com.addObjectAt( this, this.gameToolBar, 0, GameToolBar.toolBarY );
        this.gameToolBar.showTip( "" );
        this.resetGameToolBarStatus();
        this.addChild( this.pussleProcessBar );

        this.letsPipa( data );
        ( this.gameToolBar as PipaToolBar ).setMiniButton( this.bufLeftTurns == 0 );

        try{
            RES.loadGroup( "bingoPipa" );
        }catch(e){}
    }

    /******************************************************************************************************************************************************************/

    private buffLeftUI: egret.Shape;
    private buffIcon: egret.DisplayObjectContainer;

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

    private unUsingPaytable: Object;
    private squarePaytable: Object;
    private squareUIOnCard: egret.DisplayObjectContainer;
    private squareGridsOnCard: Array<egret.Shape>;
    private squareNumbers: Array<number>;

    private needShowEbColor: boolean;
    private needShowFreeEb: boolean;
    private ebColorList: Array<number>;
    private freeEbList: Array<number>;
    private ebColorsSp: egret.DisplayObjectContainer;
    private superEbColorsSp: egret.DisplayObjectContainer;
    private freeEbUI1: egret.Bitmap;
    private freeEbUI2: egret.Bitmap;

    private needWaitForChoose: boolean;
    private cutBallsArray: Array<number>;
    private chooseBar: egret.DisplayObjectContainer;
    private chooseGrids: Array<egret.Shape>;
    private chooseNotGrids: Array<egret.Shape>;

    private markColumn: Array<number>;
    private markNumber1: number;
    private markNumber2: number;
    private markPen1: egret.Bitmap;
    private markPen2: egret.Bitmap;
    private needMarkLine: boolean;
    private bigMarkPenContainer1: egret.DisplayObjectContainer;
    private bigMarkPenContainer2: egret.DisplayObjectContainer;
    private bigPen1: egret.Bitmap;
    private bigPen2: egret.Bitmap;

    private markOnCard: Array<number>;
    private markUIs: Array<egret.Bitmap>;
    private needMarkOnCard: boolean;

    private needBombOnCard: boolean;
    private bombNumbers: Array<number>;
    private bombs: Array<egret.DisplayObjectContainer>;
    private bombsTxts: Array<egret.TextField>;
    private bombExplode: Array<egret.MovieClip>;

    private needRewardOnCard: boolean;
    private rewardUinit: egret.Bitmap;
    private rewardNumIndex: number;

    private letsPipa( data: Object ): void{

        this.getBuffBallPosition();
        this.deleteDoubleLine2();
        this.deletesquare();
        this.buildBombs();
        this.buildMarkUI();
        this.buildMarkColumn();
        this.buildPeel();

        this.addChild( this.jackpotArea );

        this.buildChooseBar();

        this.buffWheel = data["buffWheel"];
        this.goKartRewards = data["goKartRewards"];

        this.buffLeftUI = new egret.Shape;
        Com.addObjectAt( this, this.buffLeftUI, 57, 17 );

        this.buffIcon = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, this.buffIcon, 12, 5 );

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
            ( this.gameToolBar as PipaToolBar ).setMiniButton( true );
        }
        this.showCurrentBuff();
    }

    private firstTimePlayShowTutorail(){
        if( localStorage.getItem( "PipaTT" ) ) return;
        else{
            localStorage.setItem( "PipaTT", "true" );
            this.dispatchEvent( new egret.Event( "new_game_tutorail" ) );
        }
    }

    private showCurrentBuff(): void{
        if( this.bufLeftTurns > this.bufMaxTurns ){
            GraphicTool.drawRect( this.buffLeftUI, new egret.Rectangle( 0, 0, 61, 14 ), 0x7EFC53, true );
            GraphicTool.drawRect( this.buffLeftUI, new egret.Rectangle( 0, 0, Math.floor( ( this.bufLeftTurns - this.bufMaxTurns ) / this.bufMaxTurns * 61 ), 14 ), 0xFF0000 );
        }
        else{
            GraphicTool.drawRect( this.buffLeftUI, new egret.Rectangle( 0, 0, Math.floor( this.bufLeftTurns / this.bufMaxTurns * 61 ), 14 ), 0x7EFC53, true );
        }

        this.buffIcon.removeChildren();
        Com.addBitmapAt( this.buffIcon, this.assetStr( "buff_" + this.currentBuf ), 0, 0 );

        if( this.bufLeftTurns ){
            ( this.gameToolBar as PipaToolBar ).lockBet( false );
        }
        else{
            ( this.gameToolBar as PipaToolBar ).lockBet( true );
        }
        this.resetGameToolBarStatus();
    }

    private clickProtector: egret.Shape;

    private getCurrentBuffFromServer(): void{
        IBingoServer.buffHandlerCallback = this.onGetCurrentFromServer.bind( this );
        if( !this.clickProtector ){
            this.clickProtector = new egret.Shape;
            GraphicTool.drawRect( this.clickProtector, new egret.Rectangle( 0, 0, 755, 600 ), 0, false, 0.0 );
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
            this.markColumn = data["mark_column"];
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
        this.buffBallBg1 = this.getChildByName( this.assetStr("icon_add_ball_01") ) as egret.Bitmap;
        this.buffBallBg2 = this.getChildByName( this.assetStr("icon_add_ball_02") ) as egret.Bitmap;
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

    private deleteDoubleLine2(): void{
        this.unUsePaytable( "double_line" );
        this.getChildByName( this.assetStr( "bg_db_line" ) ).visible = false;
    }

    private unUsePaytable( ptName: string ): void{
        this.unUsingPaytable = PayTableManager.payTablesDictionary[ ptName ];
        this.unUsingPaytable["ui"].visible = false;
        PayTableManager.payTablesDictionary[ ptName ] = null;
        delete PayTableManager.payTablesDictionary[ ptName ];
    }

    private dblineDoubled( isDoubled: boolean ): void{
        if( isDoubled ){
            PayTableManager.payTablesDictionary[ "double_line" ] = this.unUsingPaytable;
            this.unUsingPaytable["ui"].visible = true;
            this.getChildByName( this.assetStr( "bg_db_line" ) ).visible = true;

            this.unUsePaytable( "double_line2" );
        }
        else{
            PayTableManager.payTablesDictionary[ "double_line2" ] = this.unUsingPaytable;
            this.unUsingPaytable["ui"].visible = true;
            this.getChildByName( this.assetStr( "bg_db_line" ) ).visible = false;

            this.unUsePaytable( "double_line" );
        }
    }

    private deletesquare(): void{
        this.squarePaytable = PayTableManager.payTablesDictionary[ "square" ];

        this.squareUIOnCard = new egret.DisplayObjectContainer;
        this.squareGridsOnCard = [];
        this.addChild( this.squareUIOnCard );
        for( let i: number = 0; i < 60; i++ ){
            let indexPt: egret.Point = this.getIndexOnCard( i );
            let yIndex: number = indexPt.y % 5;
            if( yIndex > 3 || yIndex < 1 ){
                this.squareGridsOnCard[i] = null;
                continue;
            }
            this.squareGridsOnCard[i] = new egret.Shape;
            GraphicTool.drawRect( this.squareGridsOnCard[i], new egret.Rectangle( 0, 0, 52, 38 ), 0xCCCC00 );
            this.squareUIOnCard.addChild( this.squareGridsOnCard[i] );
            this.setTargetToPositionOnCard( this.squareGridsOnCard[i], indexPt.x, indexPt.y );
        }
        this.squareUIOnCard.alpha = 0.25;

        this.getSquareNumbers();
        this.showSquare( false );
    }

    private showSquare( isShow: boolean ): void{
        this.squareUIOnCard.visible = isShow;
        if( isShow ){
            PayTableManager.payTablesDictionary[ "square" ] = this.squarePaytable;
            this.squarePaytable["ui"].visible = true;
            this.getChildByName( this.assetStr( "ex_bar" ) ).visible = true;

            this.reShowSquareNumbers();
        }
        else{
            this.squarePaytable["ui"].visible = false;
            PayTableManager.payTablesDictionary[ "square" ] = null;
            delete PayTableManager.payTablesDictionary[ "square" ];
            this.getChildByName( this.assetStr( "ex_bar" ) ).visible = false;
        }
    }

    private getSquareNumbers(): void{
        this.squareNumbers = [];
        for( let i: number = 0; i < 60; i++ ){
            let indexPt: egret.Point = this.getIndexOnCard( i );
            let yIndex: number = indexPt.y % 5;
            if( yIndex > 3 || yIndex < 1 ){
                this.squareNumbers[i] = 0;
                continue;
            }
            this.squareNumbers[i] = this.numberAtCard( indexPt.x, indexPt.y );
        }
    }

    private reShowSquareNumbers(): void{
        for( let i: number = 0; i < 60; i++ ){
            let indexPt: egret.Point = this.getIndexOnCard( i );
            let yIndex: number = indexPt.y % 5;
            if( yIndex > 3 || yIndex < 1 ){
                continue;
            }
            this.squareGridsOnCard[i].visible = true;
        }
    }

    private showEbColor( isShow: boolean ): void{
        this.needShowEbColor = isShow;

        CopacabanaGird.showBinkColor = isShow;
    }

    private showFreeEb( isShow: boolean ): void{
        this.needShowFreeEb = isShow;
    }

    private buildChooseBar(): void{
        this.chooseBar = new egret.DisplayObjectContainer;
        this.chooseGrids = [];
        this.chooseNotGrids = [];
        this.addChild( this.chooseBar );
        let selectNumberContainer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
        let selectNumberMaskContainer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
        this.chooseBar.addChild( selectNumberContainer );
        this.chooseBar.addChild( selectNumberMaskContainer );
        for( let i: number = 0; i < 60; i++ ){
            let indexPt: egret.Point = this.getIndexOnCard( i );
            this.chooseGrids[i] = new egret.Shape;
            this.chooseNotGrids[i] = new egret.Shape;
            GraphicTool.drawRect( this.chooseGrids[i], new egret.Rectangle( 0, 0, 52, 37 ), 0xFFFFFF );
            GraphicTool.drawRect( this.chooseNotGrids[i], new egret.Rectangle( 0, 0, 52, 37 ), 0, false, 0.7 );
            this.chooseGrids[i].name = "" + i;
            this.chooseGrids[i].touchEnabled = true;
            this.chooseGrids[i].addEventListener( egret.TouchEvent.TOUCH_TAP, this.onNumberChoise, this );
            selectNumberContainer.addChild( this.chooseGrids[i] );
            selectNumberMaskContainer.addChild( this.chooseNotGrids[i] );
            this.setTargetToPositionOnCard( this.chooseGrids[i], indexPt.x, indexPt.y );
            this.setTargetToPositionOnCard( this.chooseNotGrids[i], indexPt.x, indexPt.y );
        }
        let toolBarMask: egret.Shape = new egret.Shape;
        GraphicTool.drawRect( toolBarMask, new egret.Rectangle( 0, 0, 755, 48 ) );
        GraphicTool.drawRect( toolBarMask, new egret.Rectangle( 0, 48, 68, 275 ) );
        GraphicTool.drawRect( toolBarMask, new egret.Rectangle( 345, 48, 66, 275 ) );
        GraphicTool.drawRect( toolBarMask, new egret.Rectangle( 689, 48, 66, 275 ) );
        GraphicTool.drawRect( toolBarMask, new egret.Rectangle( 0, 323, 755, 277 ) );
        toolBarMask.alpha = 0.5;
        toolBarMask.touchEnabled = true;
        Com.addObjectAt( this.chooseBar, toolBarMask, 0, 0 );

        Com.addBitmapAt( this.chooseBar, this.assetStr( "ball_silver" ), 323, 339 );
        Com.addMovieClipAt( this.chooseBar, this._mcf, "choose_" + GlobelSettings.language, 323, 340 );

        this.chooseBar.visible = false;

        selectNumberContainer.addEventListener( egret.Event.ENTER_FRAME, this.onSelectBarFrame, this );
    }

    private onSelectBarFrame( event: egret.Event ): void{
        if( !this.needWaitForChoose )return;
        let dt: Date = new Date;
        event.target.alpha = dt.getMilliseconds() > 500 ? 0.4 : 0.01;

        if( !this.stage ) event.target.removeEventListener( egret.Event.ENTER_FRAME, this.onSelectBarFrame, this );
    }

    private onNumberChoise( event: egret.Event ): void{
        let numIndex: number = Math.floor( event.target.name );
        let indexPt: egret.Point = this.getIndexOnCard( numIndex );
        let getNumber: number = this.numberAtCard( indexPt.x, indexPt.y );
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
        this.chooseBar.visible = true;
        let checkingString: Array<string> = CardManager.getCheckingStrings();
        for( let i: number = 0; i < checkingString.length; i++ ){
            for( let j: number = 0; j < checkingString[i].length ; j++ ){
                this.chooseGrids[i*15+j].visible = checkingString[i].charAt( j ) == "0";
                this.chooseNotGrids[i*15+j].visible = !this.chooseGrids[i*15+j].visible;
            }
        }
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
        
        if( this.squareUIOnCard.visible )this.reShowSquareNumbers();

        if( this.needMarkLine ){
            this.markPen1.visible = true;
            this.markPen2.visible = true;
            this.bigMarkPenContainer1.removeChildren();
            this.bigMarkPenContainer2.removeChildren();
        }
        
        if( this.needBombOnCard ){
            this.needBomb( true );
        }
    }

    protected showMiniGame(): void{
        this.startMiniGame();
    }

    private countBuffLeft(): void{
        this.bufLeftTurns--;
        if( this.bufLeftTurns <= 0 ){
            ( this.gameToolBar as PipaToolBar ).setMiniButton( true );
            if( this.bufLeftTurns == 0 ){
                this.cancelBuff();
            }
        }
        this.showCurrentBuff();
        this.saveBuffLeftTurnsChange();
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
        
        if( this.needShowEbColor ) this.ebColorList = data["eb_colors"];
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

        if( !this.needShowEbColor )return;
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
        this.needMarkLine = isMark;

        if( isMark ){
            let indexPt1: egret.Point = this.getIndexOnCard( this.markColumn[0] );
            this.markNumber1 = this.numberAtCard( indexPt1.x, indexPt1.y );
            this.setTargetToPositionOnCard( this.markPen1, indexPt1.x, indexPt1.y );

            let indexPt2: egret.Point = this.getIndexOnCard( this.markColumn[1] );
            this.markNumber2 = this.numberAtCard( indexPt2.x, indexPt2.y );
            this.setTargetToPositionOnCard( this.markPen2, indexPt2.x, indexPt2.y );
            this.markPen1.visible = this.markPen2.visible = true;
        }
        else{
            this.markPen1.visible = this.markPen2.visible = false;

            this.bigMarkPenContainer1.removeChildren();
            this.bigMarkPenContainer2.removeChildren();
        }
    }

    public onChangeNumber( data: Object ){
        super.onChangeNumber( data );

        this.getBombNumbers();
        this.getSquareNumbers();

        if( this.bufLeftTurns <= 0 )return;
        if( this.currentBuf == 7 ){
            this.markColumn = data["mark_column"];
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
            if( this.needBombOnCard ){
                this.needBomb( true );
            }
            else{
                throw new Error( "bomb error" );
            }
        }
    }

    private getColumnNumbers( card1: number, grid1: number ): void{
        for( let i: number = 0; i < 3; i++ ){
            this.getNumberOnCard( card1, grid1 + i * 5 );
            this.getNumberOnCard( card1 + 2, grid1 + i * 5 );
        }

        let pt: egret.Point = this.positionOnCard( card1, grid1 );
        let paper: egret.DisplayObjectContainer = card1 ? this.bigMarkPenContainer1 : this.bigMarkPenContainer2;
        let pen: egret.Bitmap = Com.addBitmapAt( paper, this.assetStr( "icon_mark_big" ), pt.x + 20, pt.y - 35 );
        pen.name = "pen";
        if( card1 ){
            this.bigPen2 = pen;
            this.markPen2.visible = false;
        }
        else{
            this.bigPen1 = pen;
            this.markPen1.visible = false;
        }
        let tw: egret.Tween = egret.Tween.get( pen );
        tw.to( { y: pen.y + 230 }, 600 );
        tw.wait( 500 );
        tw.call( () => { if( pen.parent )pen.parent.removeChildren() } );

        this.playSound( "pipa_mark_pen_mp3" );
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
                let pt: egret.Point = this.getIndexOnCard( this.markOnCard[i] );
                this.setTargetToPositionOnCard( this.markUIs[i], pt.x, pt.y );
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
            let pt: egret.Point = this.getIndexOnCard( this.markOnCard[i] );
            this.getNumberOnCard( pt.x, pt.y );
        }
    }

    private buildMarkColumn(): void{
        this.markPen1 = Com.addBitmapAt( this, this.assetStr( "icon_mark" ), 0, 0 );
        this.markPen2 = Com.addBitmapAt( this, this.assetStr( "icon_mark" ), 0, 0 );
        this.markPen1.visible = this.markPen2.visible = false;

        this.bigMarkPenContainer1 = new egret.DisplayObjectContainer;
        this.bigMarkPenContainer2 = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, this.bigMarkPenContainer1, 0, 0 );
        Com.addObjectAt( this, this.bigMarkPenContainer2, 0, 0 );

        this.addEventListener( egret.Event.ENTER_FRAME, this.markColumnEveryFrame, this );
    }

    private markColumnEveryFrame( event: egret.Event ): void{
        if( this.bigPen1 && this.bigPen1.parent ) this.addPenPoint( this.bigPen1 );
        if( this.bigPen2 && this.bigPen2.parent ) this.addPenPoint( this.bigPen2 );

        if( !this.stage )this.removeEventListener( egret.Event.ENTER_FRAME, this.markColumnEveryFrame, this );
    }

    private addPenPoint( pen: egret.Bitmap ): void{
        let pt: egret.Bitmap = Com.createBitmapByName( this.assetStr( "marker_lightball" ) );
        pt.x = pen.x + Math.random() * 4 - 2;
        pt.y = pen.y + 42;
        pen.parent.addChildAt( pt, 0 );
    }

    private buildBombs(): void{
        this.getBombNumbers();
        this.bombs = [];
        this.bombsTxts = [];
        this.bombExplode = [];
        for( let i: number = 0; i < this.cardPositions.length; i++ ){
            this.bombs[i] = new egret.DisplayObjectContainer;
            Com.addObjectAt( this, this.bombs[i], this.cardPositions[i]["x"] + 120, this.cardPositions[i]["y"] + 48 );

            this.bombExplode[i] = Com.addMovieClipAt( this.bombs[i], this._mcf, "bomb_02", -193, -158 );
            this.bombExplode[i].gotoAndStop(1);
        }
        this.needBomb( false );
    }

    private needBomb( isNeedBomb: boolean ): void{
        this.needBombOnCard = isNeedBomb;

        for( let i: number = 0; i < 4; i++ ){
            this.bombs[i].removeChildren();
        }

        if( isNeedBomb ){
            for( let i: number = 0; i < 4; i++ ){
                this.bombs[i].addChild( this.bombExplode[i] );
                this.bombsTxts[i] = Com.addTextAt( this.bombs[i], 0, 13, 37, 22, 22, false, true );
                this.bombsTxts[i].text = "" + this.bombNumbers[i];
                this.bombsTxts[i].textColor = 0;
                this.bombExplode[i].gotoAndStop(1);
            }
        }
    }

    private getBombNumbers(): void{
        this.bombNumbers = [];
        for( let i: number = 0; i < 4; i++ ){
            this.bombNumbers[i] = this.numberAtCard( i, 7 );
        }
    }

    private bombCard( cardId: number ): void{
        this.getNumberOnCard( cardId, 1 );
        this.getNumberOnCard( cardId, 3 );
        this.getNumberOnCard( cardId, 11 );
        this.getNumberOnCard( cardId, 13 );
        if( this.bombs[cardId].numChildren == 2 )this.bombs[cardId].removeChildAt( 1 );
        this.bombExplode[ cardId ].gotoAndPlay( 1, 1 );
        this.playSound("pipa_bomb_mp3");
    }

    private needReward( isNeedReward: boolean ): void{
        this.needRewardOnCard = isNeedReward;

        if( isNeedReward ){
            this.rewardUinit.visible = true;
            let indexPt: egret.Point = this.getIndexOnCard( this.rewardNumIndex );
            this.setTargetToPositionOnCard( this.rewardUinit, indexPt.x, indexPt.y );
        }
        else{
            this.rewardUinit.visible = false;
        }
    }

    private buildPeel(): void{
        this.peelLayer = new egret.Sprite;
        Com.addObjectAt( this, this.peelLayer, 0, 0 );
        GraphicTool.drawRect( this.peelLayer, new egret.Rectangle( 0, 0, 755, 600 ), 0, false, 0.01 );
        this.peelLayer.touchEnabled = true;
        this.peelLayer.visible = false;
        Com.addBitmapAt( this.peelLayer, this.assetStr( "peel_01" ), 309, 330 );
        let peel01: egret.Bitmap =  Com.addBitmapAt( this.peelLayer, this.assetStr( "peel_01" ), 451, 337 );
        peel01.rotation = 180;
        let peelContainer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
        Com.addObjectAt( this.peelLayer, peelContainer, 318, 332 );
        this.peelTop = Com.addBitmapAt( this.peelLayer, this.assetStr( "peel_02" ), 318, 334 );
        this.peelTop.anchorOffsetY = 9;

        peelContainer.mask = new egret.Rectangle( 0, 0, 124, 125 );
        this.peelMc = Com.addBitmapAt( peelContainer, this.assetStr( "peel_03" ), 0, 0 );
    }

    private showPeel(): void{
        this.peelLayer.visible = true;
        this.addChild( this.peelLayer );
        this.peelMc.y = 0;
        this.peelTop.scaleY = 0.5;
        let tw: egret.Tween = egret.Tween.get( this.peelMc );
        tw.to( { y: -125 }, 3900 );
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

    /******************************************************************************************************************************************************************/    
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 612, 16 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 16, -11 ), new egret.Rectangle( 0, 0, 145, 13 ), 14, 0xFFFFFF ) );
        let jkText: egret.Bitmap = Com.addBitmapAt( this, this.assetStr( "jackpot_" + GlobelSettings.language ), 551 + 35, 12 + 13 );
        jkText.anchorOffsetX = jkText.width >> 1;
        jkText.anchorOffsetY = jkText.height >> 1;
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
        let soundName = "";
        switch (paytabledName) {
            case "double_line": soundName = "pipa_double_line_mp3"; break;
            case "double_line2": soundName = "pipa_double_line_mp3"; break;
            case "square": soundName = "pipa_square_mp3"; break;
            case "bingo": soundName = "pipa_win_bingo_mp3"; break;
            case "line": soundName = "pipa_singe_line_mp3"; break;
            default: break;
        }
        if (SoundManager.soundOn && soundName !== "") {
            this.playSound(soundName, 1, callback);
        } else {
            callback();
        }
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
        let pipaDbLineAnimation: PipaAnimation = new PipaAnimation( "pipaDoubleLine_json" );
        Com.addObjectAt( this, pipaDbLineAnimation, 0, 0 );
    }

    private squareAnimation(): void{
        let pipaDbLineAnimation: PipaAnimation = new PipaAnimation( "pipaSquare_json", true );
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
        let missNumber: number = this.numberAtCard( cardIndex, gridIndex );
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
                        this.showLastBallAt( ballNumber, 323, 339, 3.5 );
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
                        this.showLastBallAt( ballNumber, 323, 339, 3.5 );
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

            if( this.needShowEbColor )this.drawEbColors();
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

        this.countBuffLeft();

        this.dealWithNewDatas( data );
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
        this.miniGame = new PipaChess(currentPosition, chessArrayConfig);
        this.miniGame.addEventListener(PipaChess.REROLL_DICE, this.sendRerollCommand, this);
        this.miniGame.addEventListener(Pipa.PLAY_MINI_GAME_SOUND, this.playMiniGameSound, this);
        this.miniGame.addEventListener(PipaChess.GET_BOAT_GAME, this.startBoatGame, this);
        this.miniGame.addEventListener(PipaChess.MINI_GAME_OVER, this.miniGameOver, this);
        Com.addObjectAt(this, this.miniGame, 0, 0);

        // load boat game
        this.boatGame = new PipaBoat( goKartRewards );
        this.boatGame.visible = false;
        this.boatGame.addEventListener(Pipa.PLAY_MINI_GAME_SOUND, this.playMiniGameSound, this);
        this.boatGame.addEventListener(Pipa.STOP_MINI_GAME_SOUND, this.stopMiniGameSound, this);
        this.boatGame.addEventListener(PipaBoat.GET_TURBO, this.sendGetTurboCommand, this);
        this.boatGame.addEventListener(PipaBoat.BOAT_GAME_OVER, this.boatGameOver, this);
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
        ( this.gameToolBar as PipaToolBar ).setMiniButton( false );
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
                this.markColumn = data["mark_column"];
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
        let pipaGame: Pipa = BingoMachine["currentGame"] as Pipa;
        if( pipaGame ){
            ( pipaGame.gameToolBar as PipaToolBar ).resetBgMusicTimer();
        }
    }
}
class SuperLotto extends V2Game{

    protected static get classAssetName(){
		return "superLotto";
	}

    protected static get animationAssetName(){
		return "turbo90Animation";
	}

	public constructor( assetsPath: string ) {
		super( "superLotto.conf", assetsPath, 71 );
        this.languageObjectName = "superLotto_tx";

        this.ballArea = new LottoBallManager;
        this.ballArea.mask = new egret.Rectangle( 342, 444, 1216, 159 );
        PaytableUI.textBold = true;
        PayTableManager.layerType = LottoPaytableLayer;

        GameCard.clickChangeNumber = false;
        CardGrid.defaultNumberSize = 65;

        CardManager.cardType = LottoCard;
        CardManager.gridType = LottoGrid;

        GameCard.useRedEffect = true;

        BallManager.normalBallInterval = 200;

        BallManager.ballOffsetY = BrowserInfo.textUp * 2;

        PayTableManager.bingoPaytableName = "se6";
	}

    protected init(){
        BallManager["balls"][-1] = BallManager["balls"][0];
        BingoBall["ballUIs"][-1] = null;

        super.init();
        this.tileBg();

        this.showNoBetAndCredit();

        let seText: egret.TextField = MDS.addGameTextCenterShadow( this, 560 + 1115, 150 + BrowserInfo.textUp, 35, 0x18A4FD, "sequence", true, 182, true, false );
        seText.scaleX = 1;
        seText.stroke = 1.5;
        seText.text = seText.text.toUpperCase();
        seText.fontFamily = "Righteous";
        let anText: egret.TextField = MDS.addGameTextCenterShadow( this, 560 + 1115, 580 + BrowserInfo.textUp, 35, 0xE518FD, "any", true, 182, true, false );
        anText.scaleX = 1;
        anText.stroke = 1.5;
        anText.text = anText.text.toUpperCase();
        anText.fontFamily = "Righteous";

        let x2Text: TextLabel = MDS.addGameTextCenterShadow( this, 1647, 863, 38, 0xFFFFFF, "sequence", false, 100, false, false );
        x2Text.setText( "x2" );
        let x3Text: TextLabel = MDS.addGameTextCenterShadow( this, 1835, 863, 38, 0xFFFFFF, "sequence", false, 100, false, false );
        x3Text.setText( "x3" );

        this.letsLotto();
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );

        if( !LottoCard.prizeBallMulti )this.playSound("lotto_ball_mp3");
        else{
            switch( LottoCard.prizeBallMulti[this.currentBallIndex-1] ){
                case 2: this.playSound("lotto_silver_mp3");
                    break;
                case 3: this.playSound("lotto_gold_mp3");
                    break;
                default: this.playSound("lotto_ball_mp3");
                    break;
            }
        }
	}

    protected sendPlayRequest() {
		IBingoServer.playCallback = this.onPlay.bind( this );
		IBingoServer.playWithCardNumbers( GameData.currentBet, CardManager.enabledCards, CardManager.groupNumber, GameData.currentBetIndex, this.getNumbersOnCards() );
	}

    public onPlay( data: Object, hotData: any = null ){
        this.lottoBallArray = ( data["bolas"] as Array<number> ).concat();
        LottoCard.prizeBallArray = data["prizeBalls"];
        ( this.ballArea as LottoBallManager ).setPrizeBalls( data["prizeBalls"] );
        data["btextra"] = data["btextra"] || data["isMegaBall"];
		super.onPlay( data );
        this.isMegaBall = data["isMegaBall"];
        this.ebPosition = data["ebPosition"];
    }

    public onExtra( data: Object ){
        let extra: number = data["extra"];
        data["extra"] = 0;
        super.onExtra( data );

		this.ballArea.runExtra( extra );
        Com.addObjectAt( this.lottoExtraBg, ( this.ballArea as LottoBallManager ).getLottoSmallBall( extra, this.ebPosition ), 25, 37 + BrowserInfo.textUp );

        this.ebPosition = data["ebPosition"];
    }

    protected startPlay(): void {
		super.startPlay();

        this.lockCards = false;
        this.clearLottoExtras();
        this.payTableArea.clearPaytableFgs();
	}

    private clearLottoExtras(): void{
        if( this.lottoExtraBgs ){
            for( let i: number = 0; i < this.lottoExtraBgs.length; i++ ){
                if( this.lottoExtraBgs[i] && this.contains( this.lottoExtraBgs[i] ) ) this.removeChild( this.lottoExtraBgs[i] );
            }
        }
        this.lottoExtraBgs = [];
    }

    private changePaytableRules(): void{
        let an4Rule: Array<string> = this.ramdonPositionString( 4, 6 );
        PayTableManager.payTablesDictionary["an4"].rules = this.filtSe( an4Rule, PayTableManager.payTablesDictionary["se4"].rule );
        let an3Rule: Array<string> = this.ramdonPositionString( 3, 6 );
        PayTableManager.payTablesDictionary["an3"].rules = this.filtSe( an3Rule, PayTableManager.payTablesDictionary["se3"].rule );
        let an2Rule: Array<string> = this.ramdonPositionString( 2, 6 );
        PayTableManager.payTablesDictionary["an2"].rules = this.filtSe( an2Rule, PayTableManager.payTablesDictionary["se2"].rule );

        let tx: string = PayTableManager.payTablesDictionary["se6"].UI.tx.text;
        tx = tx.replace( /\D/g, "" );
        PayTableManager.payTablesDictionary["se6"].UI.tx.text = "x" + tx + "+" + MuLang.getText("jp");
    }

    private ramdonPositionString( oneTimes: number, positions: number ): Array<string>{
        if( oneTimes < positions ){
            if( positions > 0 ){
                return this.combinePositionString( "0", this.ramdonPositionString( oneTimes, positions - 1 ) ).concat( this.combinePositionString( "1", this.ramdonPositionString( oneTimes - 1, positions - 1 ) ) );
            }
            else{
                return [];
            }
        }
        else if( oneTimes == positions ){
            let str: string = "";
            for( let i: number = 0; i < oneTimes; i++ ){
                str += "1";
            }
            return [str];
        }
        else throw new Error( "ramdonPositionString Error" );
    }

    private combinePositionString( str: string, arr: Array<string> ): Array<string>{
        for( let i: number = 0; i < arr.length; i++ ){
            arr[i] = str + arr[i];
        }
        return arr;
    }

    private filtSe( anArray: Array<string>, seString: string ): Array<string>{
        let index: number = anArray.indexOf( seString );
        anArray.splice( index, 1 );
        return anArray;
    }

    private set lockCards( value: boolean ){
        for( let i: number = 0; i < 4; i++ ){
            CardManager.cards[i].touchChildren = value;
        }
    }
/******************************************************************************************************************************************************************/
    
    private ebPosition: number;
    private lottoBallArray: Array<number>;
    private lottoExtraBg: egret.DisplayObjectContainer;
    private lottoExtraBgs: Array<egret.DisplayObjectContainer>;

    private letsLotto(){
        this.changePaytableRules();

        for( let i: number = 0; i < 4; i++ ){
            CardManager.cards[i].addEventListener( "cardNumberChanged", this.onCardNumberChange.bind(this), this );
            CardManager.cards[i].addEventListener( "cardFitPaytalbe", this.onCardFitPaytable.bind(this), this );
        }
    }

    protected winBingo(): void {
        let ev: egret.Event = new egret.Event( "winbingo" );
        ev.data = { coins: this.ganho };
        this.dispatchEvent( ev );
    }

/******************************************************************************************************************************************************************/
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 1345, 14 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 0, 0 ), new egret.Rectangle( 0, 60, 432, 48 ), 45, 0xFF7E00, new egret.Rectangle( 0, 10, 432, 45 ), 40, 0xF6FF00 ) );
        this.jackpotArea.tip.fontFamily = "Righteous";
        this.jackpotArea.jackpotText.fontFamily = "Righteous";
    }

    protected afterCheck( resultList: Array<Object> ): void{
        this.payTableArea.clearPaytableFgs();
		super.afterCheck( resultList );
	}

    protected onBetChanged(event: egret.Event): void{
        super.onBetChanged(event);
	}

    protected hasExtraBallFit(): void {
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
        }
        this.addEbBg();

        if( this.isMegaBall ){
            this.gameToolBar.megeExtraOnTop( true );
        }
    }

    private addEbBg(): void{
        this.lottoExtraBg = new egret.DisplayObjectContainer;
        this.lottoExtraBgs.push( this.lottoExtraBg );
        let positionPt: egret.Point = BallManager.getBallLastPosition( this.ebPosition );
        this.lottoExtraBg.x = positionPt.x;
        this.lottoExtraBg.y = positionPt.y;
        Com.addBitmapAt( this.lottoExtraBg, this.assetStr( this.lottoExtraBgName ), 0, 0 );
        this.addChild( this.lottoExtraBg );
        Com.addObjectAt( this.lottoExtraBg, ( this.ballArea as LottoBallManager ).getLottoSmallBall( this.lottoBallArray[this.ebPosition], this.ebPosition ), 15, 2 + BrowserInfo.textUp );
    }

    private get lottoExtraBgName(): string{
        let lastName: string = ( this.ballArea as LottoBallManager ).getUINameAt( this.ebPosition );
        lastName = lastName.replace( "ball_", "" );
        let firstName: string = this.isMegaBall ? "mega" : "extra";
        return firstName + "_" + lastName;
    }
    
    protected roundOver(): void {
        super.roundOver();

        this.lockCards = true;
    }

	protected getExtraBallFit(): void {
        this.playSound("lotto_eb_mp3");
    }

    protected onServerData( data: Object ){
        super.onServerData( data );

        let remdonNumbers: Array<number>;
        if( localStorage.getItem( "superLotto_numbers" ) ){
            this.resetCardNumbers( this.getNumberFromStorage() );
        }
        else{
            this.changeRamdonNumbers();
        }

        if( GameData.maxBet <= 250 ) {
            let betTip: egret.Bitmap = Com.addBitmapAt( this, this.assetStr( "tips_" + GlobelSettings.language ), 85, 460 );
            TweenerTool.tweenTo( betTip, { alpha: 0 }, 8000, 8000, () => { betTip.parent.removeChild( betTip ) } );
        }
    }

    private getNumbersOnCards(): Array<number>{
        let numbersOnCard: Array<number> = [];
        for( let i: number = 0; i < CardManager.cards.length; i++ ){
            numbersOnCard = numbersOnCard.concat( ( CardManager.cards[i] as LottoCard ).getCardNumbers() );
        }
        return numbersOnCard;
    }

    public changeRamdonNumbers( numberArr: Array<number> = null ): void{
        if( !numberArr ) numberArr = this.getRemdonLottoNumers();
        this.resetCardNumbers( numberArr );
        localStorage.setItem( "superLotto_numbers", numberArr.toString() );
    }

    private resetCardNumbers( numbersOnCards: Array<number> ): void{
		for( let i: number = 0; i < 4; i++ ){
			CardManager.cards[i].getNumbers( numbersOnCards.slice( i * 6, ( i+1 ) * 6 ) );
		}
	}

    private getNumberFromStorage(): Array<number>{
        let strArr: Array<string> = localStorage.getItem( "superLotto_numbers" ).split( "," );
        let remdonNumbers: Array<number> = [];
        for( let i: number = 0; i < strArr.length; i++ ) remdonNumbers[i] = parseInt( strArr[i] );
        return remdonNumbers;
    }

    private getRemdonLottoNumers(): Array<number>{
        let ar: Array<number> = [];
        for( let i: number = 0; i < 24; i++ ){
            ar[i] = Math.floor( Math.random() * 10 );
        }
        return ar;
    }

    private onCardNumberChange( event: egret.Event ): void{
        this.changeRamdonNumbers( this.getNumbersOnCards() );
    }

    private onCardFitPaytable( event: egret.Event ): void{
        let card: LottoCard = event.target as LottoCard;
        let assetName: string = event.data;
        let isSequence: boolean = assetName.indexOf( "se" ) >= 0;
        assetName = assetName.substr( 2 );
        let itemIndex: number = parseInt( assetName );
        ( this.payTableArea as LottoPaytableLayer ).showPaytableBg( isSequence, itemIndex );
    }
}
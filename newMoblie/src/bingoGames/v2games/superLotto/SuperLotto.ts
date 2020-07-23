class SuperLotto extends V2Game{

    protected static get classAssetName(){
		return "superLotto";
	}

    protected static get animationAssetName(){
		return "turbo90Animation";
	}

	public constructor( assetsPath: string ) {
		super( "superLotto.conf", assetsPath, 71 );
        this.ptFilterConfig = "superLotto_filt";

        this.ballArea = new LottoBallManager;
        PaytableUI.textBold = true;

        CardGrid.defaultBgColor = 0;
        CardGrid.defaultNumberSize = 28;

        CardManager.cardType = LottoCard;
        CardManager.gridType = LottoGrid;

        CardGrid.blinkColors1 = 0x0;
	    CardGrid.blinkColors2 = 0x0;
        GameCard.useRedEffect = true;

        BallManager.normalBallInterval = 200;

        let languageText = GameUIItem.languageText;
        languageText["increase"] = { en: "EQUAL", es: "IGUALES", pt: "IGUAIS" };
        languageText["shuffle"] = { en: "SHUFFLE", es: "BARAJAR", pt: "SORTEAR" };
        languageText["any"] = { en: "ANY", es: "CUALQUIER", pt: "QUALQUER" };
        languageText["sequence"] = { en: "SEQUENCE", es: "SECUENCIA", pt: "SEQUÊNCIA" };
        languageText["jp"] = { en: "JP", es: "JP", pt: "AC" };

        BallManager.ballOffsetY = BrowserInfo.textUp * 2;
        GameToolBar.toolBarY = 474;
        BingoBackGroundSetting.defaultScale = false;
        BingoBackGroundSetting.gameMask = new egret.Rectangle( 0, 0, 2000, 1125 );

        PayTableManager.bingoPaytableName = "se6";
	}

    protected init(){
        BallManager["balls"][-1] = BallManager["balls"][0];

        super.init();

        this.showNoBetAndCredit();

        let seText: egret.TextField = this.addGameTextCenterShadow( 560, 67, 21, 0x18A4FD, "sequence", true, 182, true, false );
        seText.scaleX = 1;
        seText.stroke = 1.5;
        seText.text = seText.text.toUpperCase();
        seText.fontFamily = "Righteous";
        let anText: egret.TextField = this.addGameTextCenterShadow( 560, 270, 21, 0xE518FD, "any", true, 182, true, false );
        anText.scaleX = 1;
        anText.stroke = 1.5;
        anText.text = anText.text.toUpperCase();
        anText.fontFamily = "Righteous";

        let x2Text: egret.TextField = this.addGameTextCenterShadow( 590, 414, 24, 0xFFFFFF, "sequence", false, 50, false, false );
        x2Text.text = "x2";
        let x3Text: egret.TextField = this.addGameTextCenterShadow( 685, 414, 24, 0xFFFFFF, "sequence", false, 50, false, false );
        x3Text.text = "x3";
        // let win1Text: egret.TextField = this.addGameTextCenterShadow( 615, 415, 22, 0xFF7E00, "win", false, 50, false, false );
        // win1Text.text = win1Text.text.toUpperCase();
        // win1Text.scaleX = 0.7;
        // let win2Text: egret.TextField = this.addGameTextCenterShadow( 710, 415, 22, 0xFF7E00, "win", false, 50, false, false );
        // win2Text.text = win2Text.text.toUpperCase();
        // win2Text.scaleX = 0.7;

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
        this.hideAllPaytableBg();
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
        PayTableManager.payTablesDictionary["se6"].UI.tx.text = "x" + tx + "+" + GameUIItem.languageText["jp"][GlobelSettings.language];
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

    private anNumbers: Array<egret.TextField>;
    private seNumbers: Array<egret.TextField>;
    private anBgs: Array<egret.Bitmap>;
    private seBgs: Array<egret.Bitmap>;

    private letsLotto(){
        this.changePaytableRules();

        for( let i: number = 0; i < 4; i++ ){
            CardManager.cards[i].addEventListener( "cardNumberChanged", this.onCardNumberChange.bind(this), this );
            CardManager.cards[i].addEventListener( "cardFitPaytalbe", this.onCardFitPaytable.bind(this), this );
        }

        this.addLottoPaytalbeNumbers();
        this.addPayTables();
    }

    private addLottoPaytalbeNumbers(){
        this.anNumbers = [];
        this.anBgs = [];
        for( let i: number = 0; i < 4; i++ ){
            this.anBgs[i] = Com.addBitmapAt( this, this.assetStr( "any_light" ), 558, 380 - 28 * i );
            this.anBgs[i].visible = false;
            this.anNumbers[i] = this.addGameTextCenterShadow( 573, 382 - 28 * i, 22, 0xE518FD, "sequence", false, 30, false, false );
            this.anNumbers[i].text = "" + ( i + 2 );
        }
        this.seNumbers = [];
        this.seBgs = [];
        for( let i: number = 0; i < 6; i++ ){
            this.seBgs[i] = Com.addBitmapAt( this, this.assetStr( "sequence_light" ), 558, 232 - 28 * i );
            this.seBgs[i].visible = false;
            this.seNumbers[i] = this.addGameTextCenterShadow( 573, 234 - 28 * i, 22, 0x18A4FD, "sequence", false, 30, false, false );
            this.seNumbers[i].text = "" + ( i + 1 );
        }
    }

    protected winBingo(): void {
        let ev: egret.Event = new egret.Event( "winbingo" );
        ev.data = { coins: this.ganho };
        this.dispatchEvent( ev );
    }

/******************************************************************************************************************************************************************/
    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 570, 16 ), jackpot, jackpotMinBet, betConfig, new egret.Point( -15, -1 ), new egret.Rectangle( 0, 20, 160, 20 ), 16, 0xFF7E00, new egret.Rectangle( 0, 5, 160, 20 ), 16, 0xF6FF00 ) );
        this.jackpotArea.tip.fontFamily = "Righteous";
        this.jackpotArea["jackpotText"].fontFamily = "Righteous";
    }

    protected afterCheck( resultList: Array<Object> ): void{
        this.hideAllPaytableBg();
		super.afterCheck( resultList );
	}

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "se6": 
            case "se5":
            case "an5": 
            case "an4":
            case "an3":
            case "se4":
            case "se3": 
            case "an2":
            case "se1":
            case "se2": soundName = "lotto_" + paytabledName +"_mp3";break;
            default: break;
        }
        if (SoundManager.soundOn && soundName !== "") {
            this.playSound(soundName, 1, callback);
        } else {
            //callback();
        }
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

        this.gameToolBar.minCardCount = 4;

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

    private getNumbersOnCards( needAll: boolean = false ): Array<number>{
        let numbersOnCard: Array<number> = [];
        for( let i: number = 0; i < CardManager.cards.length; i++ ){
            if( CardManager.cards[i].enabled || needAll ){
                numbersOnCard = numbersOnCard.concat( ( CardManager.cards[i] as LottoCard ).getCardNumbers() );
            }
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
        this.changeRamdonNumbers( this.getNumbersOnCards( true ) );
    }

    private onCardFitPaytable( event: egret.Event ): void{
        let card: LottoCard = event.target as LottoCard;
        let assetName: string = event.data;
        let isSequence: boolean = assetName.indexOf( "se" ) >= 0;
        assetName = assetName.substr( 2 );
        let itemIndex: number = parseInt( assetName );
        this.showPaytableBg( isSequence, itemIndex );
    }

    private showPaytableBg( isSequence, itemIndex ){
        let i: number = itemIndex - ( isSequence ? 1 : 2 );
        let bg: egret.Bitmap = isSequence ? this.seBgs[i] : this.anBgs[i];
        bg.visible = true;
        let tx: egret.TextField = isSequence ? this.seNumbers[i] : this.anNumbers[i];
        tx.textColor = isSequence ? 0xFAFF32 : 0xFAFF32;
        tx.stroke = 1.5;
    }

    private hideAllPaytableBg(){
        for( let i: number = 0; i < 4; i++ ){
            this.anBgs[i].visible = false;
            this.anNumbers[i].textColor = 0xE518FD;
            this.anNumbers[i].stroke = 0;
        }
        for( let i: number = 0; i < 6; i++ ){
            this.seBgs[i].visible = false;
            this.seNumbers[i].textColor = 0x18A4FD;
            this.seNumbers[i].stroke = 0;
        }
    }

    protected addPayTables(){
		super.addPayTables();

        let pts: Object = PayTableManager.payTablesDictionary;
        for( let payTable in pts ){
			let pos: Object = pts[payTable].position;
            let isSequence: boolean = payTable.indexOf( "se" ) >= 0;
            let y: number = pos["y"] - ( isSequence ? 234 : 382 );
            y = Math.floor( y / 28 );
            y = ( isSequence ? 234 : 382 ) + y * 28 + 2;
			pts[payTable].UI.y = y;
            pts[payTable].UI.x = 598;
            let tx: egret.TextField = pts[payTable].UI["tx"];
            tx.width = 142;
            tx.textAlign = "right";
		}
	}
}
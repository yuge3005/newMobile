class Champion extends V1Game{

    protected static get classAssetName(){
		return "champion";
	}

    protected static get animationAssetName(){
		return "showballAnimation";
	}

	private blinkSpArray: Array<egret.Sprite>;

	public constructor( assetsPath: string ) {
		super( "champion.conf", assetsPath, 19 );
		this.languageObjectName = "champion_tx";

		this.blinkSpArray = new Array<egret.Sprite>();

		GameCard.gridOnTop = true;

        CardGrid.defaultNumberSize = 40;

		GameCard.useRedEffect = true;

        BallManager.normalBallInterval = 20;

		this.ballArea.needLightCheck = true;
	}

    protected init(){
        super.init();
		this.tileBg();

		// this.addGameText( 700, 74, 15, 0x46C8F5, "bingo",false, 200 );
        // this.addGameText( 700, 130, 15, 0x46C8F5, "4 lines",false, 200 );
        // this.addGameText( 700, 183, 15, 0x46C8F5, "perimeter",false, 200 );
        // this.addGameText( 700, 238, 15, 0x46C8F5, "3 lines",false, 200 );
		// this.addGameText( 700, 292, 15, 0x46C8F5, "letterXT",false, 200 );
		// this.addGameText( 700, 346, 15, 0x46C8F5, "2 lines",false, 200 );
		// this.addGameText( 700, 400, 15, 0x46C8F5, "4 corners",false, 200 );
		// this.addGameText( 700, 455, 15, 0x46C8F5, "diagonal",false, 200 );

		this.showNoBetAndCredit();

		this.buildSuperEbArea( "mega_" + GlobelSettings.language, 702, 524 );

		this.ganhoCounter = new ChampionGanhoCounter( this.showWinAnimationAt.bind( this ) );
    }

	public de_duplication( balls: Array<number> ){
		for( let i: number = 1; i < balls.length; ){
			if( balls[i] == balls[i-1] ){
				balls.splice( i, 1 );
			}
			else i++;
		}
		if( balls[0] == 0 )balls.shift();
	}

	protected changeNumberFromServer( num: number ){
		if( !num )num = 100;
		let card: number = Math.floor( ( num - 1 ) / 25 );
		let index: number = ( num - 1 ) % 25;
		return CardManager.cards[card].getNumberAt( index );
	}

	public createCardGroups(){
		this.Cartoes = RES.getRes( "ChampionCartoes_json" );
	}
/******************************************************************************************************************************************************************/

	protected paytableResultFilter( resultList: Array<Object> ): void{
		for( let i: number = 0; i < resultList.length; i++ ){
			let fitsArr: Array<boolean> = resultList[i]["2lines"].fits;
			if( fitsArr && fitsArr[6] ){
				resultList[i]["4corners"].fit = false;
			}
			let letterFitsArr : Array<boolean> = resultList[i]["letterTX"].fits;
			if( letterFitsArr && letterFitsArr[1] ){
				resultList[i]["4corners"].fit = false;
				resultList[i]["diagonal"].fits = null;
				delete resultList[i]["diagonal"].fits;
			}
		}
		super.paytableResultFilter( resultList );
	}
	
	protected afterCheck( resultList: Array<Object> ): void{
        super.afterCheck( resultList );

		this.ganhoCounter.countGanhoAndPlayAnimation(resultList);
	}

	protected showWinAnimationAt(cardId: number, win: number): void{
        let blinkSp: egret.Sprite = new egret.Sprite;
        Com.addObjectAt( this, blinkSp, CardManager.cards[cardId].x, CardManager.cards[cardId].y );
        let tx: egret.TextField = Com.addTextAt( blinkSp, 42, 65, 180, 74, 22, false, true );
        tx.textAlign = "center";
		tx.verticalAlign = "middle";
		tx.text = MuLang.getText("win") + "\n" + Utils.formatCoinsNumber( win * GameData.currentBet );
        let outRect: egret.Rectangle = new egret.Rectangle( 35, 58, 194, 88 );
        let inRect: egret.Rectangle = new egret.Rectangle( 42, 65, 180, 74 );
        this.drawOutRect(blinkSp, 0x00FFFC, outRect, inRect);
        this.blinkSpArray.push(blinkSp);
        tx.textColor = 0xFFFFFF;
    }

	private drawOutRect( sp: egret.Sprite, color: number, rectOut: egret.Rectangle, rectIn: egret.Rectangle ): void{
		GraphicTool.drawRect( sp, new egret.Rectangle( rectOut.x, rectOut.y, rectOut.width, rectOut.height ), color, true );
		GraphicTool.drawRect( sp, new egret.Rectangle( rectIn.x, rectIn.y, rectIn.width, rectIn.height ) );
    }

/******************************************************************************************************************************************************************/    

	protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
		this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 2, 125 ), jackpot, jackpotMinBet, betConfig, new egret.Point( 16, 12 ), new egret.Rectangle( 16, 62, 245, 40 ), 40, 0xFFFF00, new egret.Rectangle( 16, 20, 245, 40 ), 40, 0xFF0000, true ) );
		this.jackpotArea.jackpotText.fontFamily = "Arial";
	}

	protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "round": soundName = "";break;
            case "4lines": soundName = "";break;
            case "bingo": soundName = "";break;
            case "letterTX": soundName = "chp_letterTX_wav";break;
            case "2lines": soundName = "chp104_mp3";break;
            case "4corners": soundName = "chp102_mp3";break;
            case "3lines": soundName = "chp103_mp3";break;
            case "diagonal": soundName = "chp101_mp3";break;
            default: break;    
        }
        if (SoundManager.soundOn && soundName !== "") {
            this.playSound(soundName, 1, callback);
        } else {
            callback();
        }
	}

	protected onBetChanged(event: egret.Event): void{
		super.onBetChanged(event);
		
		if (event.data["type"] !== 0) this.playSound("chp100_mp3");
	}

	protected hasExtraBallFit(): void {
		this.stopSound("chp97_mp3");

		if( this.isMegaBall ){
			this.superExtraBg.visible = true;
			this.gameToolBar.megeExtraOnTop( true );

			if( localStorage.getItem( "champion_mega" ) ) return;
			else{
				localStorage.setItem( "champion_mega", "true" );
				let ev: egret.Event = new egret.Event( "megaFirst" );
				ev.data = new egret.Rectangle( 842, 543, 53, 43 );
				this.dispatchEvent( ev );
			}
		}
	}

	protected roundOver(): void {
        super.roundOver();
        this.stopSound("chp97_mp3");
    }

	protected showLastBall(ballIndex: number): void {
		super.showLastBall(ballIndex);
		
		this.playSound("chp97_mp3");
	}

	protected getExtraBallFit(): void {
		this.playSound("chp97_mp3");
	}

	protected collectExtraBall(): void {
		// override
	}

	protected changeNumberSound(): void {
		// override
	}

	protected startPlay(): void {
		super.startPlay();

		for (let i = 0; i < this.blinkSpArray.length; i++) {
            if (this.blinkSpArray[i]) {
                if (this.blinkSpArray[i].parent) {
                    this.blinkSpArray[i].parent.removeChild(this.blinkSpArray[i]);
                }
                this.blinkSpArray[i] = null;
            }
        }
        this.blinkSpArray = new Array<egret.Sprite>();
	}
}
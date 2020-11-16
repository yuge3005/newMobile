class Bingo3 extends V1Game{

	protected static get classAssetName(){
		return "bingo3";
	}

	protected static get animationAssetName(){
		return "bingo3Animation";
	}

	private blinkSpArray: Array<egret.Sprite>;

	public constructor( assetsPath: string ) {
		super( "bingo3.conf", assetsPath, 24 );
		this.languageObjectName = "forAll_tx";

		this.blinkSpArray = new Array<egret.Sprite>();

		CardGridUISettings.zeroUI = "middle_grid";

		CardGridColorAndSizeSettings.defaultNumberSize = 22;

		CardManager.cardType = Bingo3Card;
		GameCardUISettings.useRedEffect = true;

		this.needListenToolbarStatus = true;
		this.tipStatusTextPosition = new egret.Rectangle( 15, 24, 225, 20 );
		this.tipStatusTextColor = 0xFE0000;

		PayTableManager.bingoPaytableName = "bingo3_flower";
	}

	protected init(){
		super.init();

		this.showNoBetAndCredit();

		this.runningBallContainer = new egret.DisplayObjectContainer;
		Com.addBitmapAt( this.runningBallContainer, this.assetStr( "img_boca_baixo" ), 0, 0 );
		this.coverRunningBall = Com.addBitmapAt( this.runningBallContainer, this.assetStr( "img_boca_cima" ), 0, 0 );

		this.ganhoCounter = new GanhoCounter( this.showWinAnimationAt.bind( this ) );
	}

	private doNotShowLastBall: boolean = false;

	protected showLastBall( ballIndex: number ): void{
		super.showLastBall( ballIndex );
		super.showLastBallAt( ballIndex, 25, 0 );
		Com.addObjectAt( this.runningBallContainer, this.coverRunningBall, 0, 0 );
		Com.addObjectAt( this, this.runningBallContainer, 220, -10 );
		if (this.doNotShowLastBall) this.runningBallUI.visible = false;
		
		this.playSound("b3_ball_mp3");
	}

	protected showExtraUI( show: boolean = true ){
		super.showExtraUI( show );
		this.doNotShowLastBall = show;
		this.getChildByName( this.assetStr( "bingo3Animation" ) ).visible = false;
	}

	protected clearRunningBallUI(): void{
		if( this.runningBallContainer && this.contains( this.runningBallContainer ) )this.removeChild( this.runningBallContainer );
		this.getChildByName( this.assetStr( "bingo3Animation" ) ).visible = true;
	}

	protected tipStatus( e: egret.Event ): void{
        this.tipStatusText.height = 45;
        super.tipStatus( e, true );
    }

	protected winChange( e: egret.Event ): void{
        super.winChange( e, true );
    }

	public de_duplication( balls: Array<number> ){
		for( let i: number = 1; i < balls.length; ){
			if( balls[i] == balls[i-1] ){
				balls.splice( i, 1 );
			}
			else if( balls[i] == 0 ){
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
		this.Cartoes = RES.getRes( "Bingo3Cartoes_json" );
	}

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
		this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 550, 15 ), jackpot, jackpotMinBet, betConfig, new egret.Point( -7, -4 ), new egret.Rectangle( 0, 35, 220, 22 ), 22, 0xFFFF00, new egret.Rectangle( 0, 0, 220, 24 ), 24, 0xd6c576 ) );
    }

	protected afterCheck( resultList: Array<Object> ): void{
		super.afterCheck( resultList );

		if( !this.inLightCheck ){
			if( PaytableResultListOprator.missOneCounter( resultList, "bingo3_flower" ) ){
                this.playSound("b3_blink_mp3", -1);
			}
		}

		this.ganhoCounter.countGanhoAndPlayAnimation(resultList);
	}

	protected showWinAnimationAt(cardId: number, win: number): void{
        let blinkSp: egret.Sprite = new egret.Sprite;
        Com.addObjectAt( this, blinkSp, CardManager.cards[cardId].x, CardManager.cards[cardId].y );
        let tx: egret.TextField = Com.addTextAt( blinkSp, 5, 188, 176, 14, 14, false, true );
        tx.textAlign = "left";
		tx.text = MuLang.getText( "win", MuLang.CASE_UPPER ) + " " + ( win * GameData.currentBet );
        let outRect: egret.Rectangle = new egret.Rectangle( 0, 0, 186, 206 );
        let inRect: egret.Rectangle = new egret.Rectangle( 6, 6, 173, 178 );
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

	protected onBetChanged( event: egret.Event ): void{
		super.onBetChanged(event);

		if (event.data["type"] !== 0) this.playSound("b3_bet_mp3");
	}

	protected hasExtraBallFit(): void {
		this.stopSound("b3_ball_mp3");
	}

	protected roundOver(): void {
        super.roundOver();
		this.stopSound("b3_ball_mp3");
		this.stopSound("b3_blink_mp3");
    }

	protected getExtraBallFit(): void {
		this.playSound("b3_extra_ball_mp3");
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
class MultyBingoInfoBar extends egret.DisplayObjectContainer{

	private paytableTimer: egret.Timer;
	private ptCurrentIndex: number;
	protected paytableUILayer: egret.Shape;

	public currentPaytableRules: Array<string>;
	protected bingoLeftTxt: egret.TextField;

	protected winTxt: egret.TextField;
	protected patternColor: number;

	public constructor() {
		super();

		this.addEventListener( egret.Event.REMOVED_FROM_STAGE, this.onRemove, this );

		this.paytableUILayer = new egret.Shape;
		Com.addObjectAt( this, this.paytableUILayer, 125, 11 );

		this.addFixText();
	}

	protected addFixText(){
		this.bingoLeftTxt = Com.addTextAt( this, 8, 10, 35, 22, 22, false, true );
		this.bingoLeftTxt.textColor = 0x5D4633;

		this.winTxt = Com.addTextAt( this, 55, 62, 100, 20, 20 );
		this.winTxt.bold = true;
	}

	private onRemove( event: egret.Event ): void{
		this.clearPaytableTimer();
	}

	private clearPaytableTimer(){
		if( !this.paytableTimer ) return;
		this.paytableTimer.reset();
		this.paytableTimer.removeEventListener( egret.TimerEvent.TIMER, this.onPaytableUITick, this );
		this.paytableTimer.stop();
	}

	private onPaytableUITick(){
		if( this.ptCurrentIndex >= this.currentPaytableRules.length ) this.ptCurrentIndex = 0;
		this.showCurrentPattern( this.ptCurrentIndex );
		this.ptCurrentIndex++;

		this.bingoLeftTxt.text = "" + Math.max( 0, MultiServer.totalWinCount );
	}

	protected showCurrentPattern( ptIndex: number ){
		let rule: string = this.currentPaytableRules[ptIndex];
		GraphicTool.drawRect( this.paytableUILayer, new egret.Rectangle( 0, 0, 38, 38 ), 0, true );
		for( let i: number = 0; i < rule.length; i++ ){
			let str: String = rule.charAt(i);
			if( str == "1" ){
				GraphicTool.drawRect( this.paytableUILayer, new egret.Rectangle( i % 5 * 8, Math.floor( i / 5 ) * 8, 6, 6 ), this.patternColor );
			}
		}
	}

	public resetWinText( enabledCards: number ){
		this.winTxt.text = Math.floor( MultiPlayerMachine.oneCardPrize ) + "X" + enabledCards;
	}

	public startShowPaytalbe(){
		this.clearPaytableTimer();

		this.ptCurrentIndex = 0;
		this.paytableTimer = new egret.Timer( 1000, 0 );
		this.paytableTimer.addEventListener( egret.TimerEvent.TIMER, this.onPaytableUITick, this );
		this.paytableTimer.start();
	}
}
class BingoBenePaytableUI extends PaytableUI {

	public static colorBgName = "pattern_color";
    public static frameBgName = "pattern_frame";
    public static halfBgName = "pattern_half";
	public static offsetPoint: egret.Point = new egret.Point( -15, -10 );

	public static normalColors: Object = { 4: 0x0d4590, 30: 0x14ae00, 80: 0x6f10ab, 120: 0xc71bbd, 250: 0xbb2f0f, 500: 0xdfbb14 } 

	private halfBg: egret.Bitmap;
	private frameBg: egret.Bitmap;
	private colorBg: egret.Bitmap;

	private rules: Array<string>;
	private ruleLayer: egret.Shape;
	private rulerTimer: egret.Timer;
	private rulesStep: number = 0;

	public constructor( useBg: boolean, rules: Array<string> ) {
		super( useBg );

		if( rules )this.rules = rules;
		if( !useBg )throw new Error( "PaytableUIWithAnimation useBg must be true" );
	}

	public initUI(){
		super.initUI();

		this.tx.y += 12;

		this.resetBgStatus();

		if( this.rules )this.showRules();
	}

	private showRules(){
		this.ruleLayer = new egret.Shape;
		this.addChild( this.ruleLayer );

		this.rulerTimer = new egret.Timer( 800 );
		this.rulerTimer.addEventListener( egret.TimerEvent.TIMER, this.onTimer, this );
		this.rulerTimer.start();

		this.onTimer( null );

		this.bg.visible = false;
		this.ruleLayer.addEventListener( egret.Event.REMOVED_FROM_STAGE, this.onRuleLayerRemoved, this );
	}

	private onTimer( event: egret.TimerEvent ): void{
		this.ruleLayer.graphics.clear();

		let rule: string = this.rules[ this.rulesStep++ % this.rules.length ];
		for( let i: number = 0; i < rule.length; i++ ){
			let str: string = rule.charAt( i );
			if( str == "1" ){
				GraphicTool.drawRect( this.ruleLayer, new egret.Rectangle( i % 5 * 8, Math.floor( i / 5 ) * 8, 7, 7 ), 0xFFFFFF );
			}
		}
	}

	private onRuleLayerRemoved( event: egret.Event ): void{
		this.rulerTimer.removeEventListener( egret.TimerEvent.TIMER, this.onTimer, this );
		this.rulerTimer.stop();

		this.bg.visible = true;
	}

	private addBitmapOnBottom( name: string ): egret.Bitmap{
		let bit: egret.Bitmap = Com.createBitmapByName( BingoMachine.getAssetStr( name ) );
		bit.x = BingoBenePaytableUI.offsetPoint.x;
		bit.y = BingoBenePaytableUI.offsetPoint.y;
		this.addChildAt( bit, 0 );
		return bit;
	}

	private normalStatus(): void{
		this.tx.textColor = 0xFFFFFF;
		this.colorBg.filters = [ MatrixTool.colorMatrixPure( 0 ) ];
		this.halfBg.filters = [ MatrixTool.colorMatrixPure( BingoBenePaytableUI.normalColors[ this._tx ] ) ];
	}

	public clearStatus(): void{
		super.clearStatus();
		this.resetBgStatus();
	}

	private resetBgStatus(): void{
		this.halfBg = this.addBitmapOnBottom( BingoBenePaytableUI.halfBgName );
		this.frameBg = this.addBitmapOnBottom( BingoBenePaytableUI.frameBgName );
		this.colorBg = this.addBitmapOnBottom( BingoBenePaytableUI.colorBgName );
		this.normalStatus();
	}

	public showFit(): void{
		this.colorBg.filters = [ MatrixTool.colorMatrixPure( 0xFFFF00 ) ];
		this.tx.textColor = 0;
		if( this.ruleLayer && this.contains( this.ruleLayer ) ) this.removeChild( this.ruleLayer );
	}
}
class BetbarPoint extends egret.DisplayObjectContainer {

	private pointUI: egret.Bitmap;
	private activeBet: number;
	public get currentActiveBet(): number{
		return this.activeBet;
	}

	private active: boolean;

	private activeBetUI: egret.DisplayObjectContainer;
	private activeBetTx: egret.TextField;
	private activeBetBg: egret.Bitmap;

	private betIcon: BetbarIcon;

	public constructor( bet: number, str: string ) {
		super();

		this.pointUI = Com.addBitmapAtMiddle( this, "betBar_json.point_bright", 0, 0 );
		this.resetActiveBet( bet );

		this.betIcon = new BetbarIcon( str );
		Com.addObjectAt( this, this.betIcon, 0, -68 );
	}

	public resetBet( bet: number ){
		let active: boolean;
		if( bet >= this.activeBet ) active = true;
		else active = false;

		if( active === this.active ) return;

		this.active = active;
		if( active ){
			this.pointUI.texture = RES.getRes( "betBar_json.point_bright" );
			this.betIcon.unlock();
			this.betIcon.scaleX = this.betIcon.scaleY = 1.2;
			TweenerTool.tweenTo( this.betIcon, { scaleX: 1, scaleY: 1 }, 500 );
		}
		else{
			this.pointUI.texture = RES.getRes( "betBar_json.point_gray" );
			this.betIcon.lock();
		}
	}

	public resetActiveBet( bet: number ){
		this.activeBet = bet;

		if( this.activeBet != GameData.maxBet ) this.showActiveBetUI();
		else this.hideActiveBetUI();
	}

	private hideActiveBetUI(){
		if( this.activeBetUI ) this.activeBetUI.visible = false;
	}

	private showActiveBetUI(){
		if( !this.activeBetUI ){
			this.activeBetUI = new egret.DisplayObjectContainer;
			Com.addObjectAt( this, this.activeBetUI, 0, 0 );
			this.activeBetBg = Com.addBitmapAt( this.activeBetUI, "betBar_json.number_bg", 0, 30 );
			this.activeBetBg.scale9Grid = new egret.Rectangle( 15, 15, 111, 19 );
			Com.addBitmapAtMiddle( this.activeBetUI, "betBar_json.number_bg_arrow", 0, 26 );
			this.activeBetTx = Com.addTextAt( this.activeBetUI, -200, 45, 400, 28, 28 );
			this.activeBetTx.bold = true;
		}

		this.activeBetTx.text = this.activeBet + "";
		this.activeBetBg.x = - this.activeBetTx.textWidth - 20 >> 1;
		this.activeBetBg.width = this.activeBetTx.textWidth + 22;
	}
}
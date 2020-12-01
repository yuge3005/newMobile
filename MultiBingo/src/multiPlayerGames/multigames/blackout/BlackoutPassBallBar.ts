class BlackoutPassBallBar extends egret.DisplayObjectContainer {

	private textLayer: egret.DisplayObjectContainer;
	private yellowLayer: egret.Shape;
	private numberTxs: Array<egret.TextField>;
	private numberGot: Array<boolean>;

	public constructor() {
		super();

		Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "pass_white" ), 0, 0 );
		this.yellowLayer = new egret.Shape;
		this.addChild( this.yellowLayer );
		this.yellowLayer.filters = [ new egret.DropShadowFilter( 2, 90, 0, 0.5 ) ];
		this.textLayer = new egret.DisplayObjectContainer;
		this.addChild( this.textLayer );

		this.numberTxs = [];
		this.numberGot = [];
		let colorArr: Array<number> = [0xF14E4E,0x7E4F15,0x26571B,0x04209B,0x480125];
		for( let i: number = 0; i < 75; i++ ){
			let line: number =  Math.floor( i / 15 );
			let row: number = i % 15;
			this.numberTxs[i] = Com.addTextAt( this.textLayer, 38 + row * 38, line * 22 + BrowserInfo.textUp, 38, 22, 16, false, true );
			this.numberTxs[i].verticalAlign = "middle";
			this.numberTxs[i].text = "" + ( i + 1 );
			this.numberTxs[i].textColor = colorArr[line];
			this.numberGot[i] = false;
		}
	}

	public clear(){
		for( let i: number = 0; i < 75; i++ ){
			this.numberGot[i] = false;
		}
		this.yellowLayer.graphics.clear();
	}

	public getBall( ball: number ){
		let i: number =	ball - 1;
		this.numberGot[i] = true;

		let line: number =  Math.floor( i / 15 );
		let row: number = i % 15;
		this.yellowLayer.graphics.beginFill( 0xFFF100 );
		this.yellowLayer.graphics.drawRoundRect( 43 + row * 38, line * 22 + 3, 28, 16, 16, 16 );
		this.yellowLayer.graphics.endFill();
	}

	public getBalls( balls: Array<number> ){
		for( let i: number = 0; i < balls.length; i++ ){
			this.getBall( balls[i] );
		}
	}
}
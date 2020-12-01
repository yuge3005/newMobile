class Coin extends egret.MovieClip {

	public startPosition: egret.Point;
	public endPosition: egret.Point;
	public middlePosition: egret.Point;
	public startScale: number;
	public endScale: number;
	public middleScale: number;

	private static _mcf: egret.MovieClipDataFactory;
	private static get mcf(){
		if( !this._mcf ){
			let coinsData = RES.getRes( "flyingCoins_json" );
			let coinsTex = RES.getRes( "flyingCoins_png" );
			this._mcf = new egret.MovieClipDataFactory( coinsData, coinsTex );
		}
		return this._mcf;
	}

	public constructor() {
		super( Coin.mcf.generateMovieClipData( "flyingCoins" ) );

		this.anchorOffsetX = this.width >> 1;
		this.anchorOffsetY = this.height >> 1;
	}

	public get factor():number {
        return 0;
    }
 
    public set factor(value:number) {
		let bar: number = 1 - value;
		let barSq: number = bar * bar;
		let valueSq: number = value * value;
		let valueTimesBar2: number = 2 * value * bar; 
        this.x = barSq * this.startPosition.x + valueTimesBar2 * this.middlePosition.x + valueSq * this.endPosition.x;
        this.y = barSq * this.startPosition.y + valueTimesBar2 * this.middlePosition.y + valueSq * this.endPosition.y;
		this.scaleX = this.scaleY = barSq * this.startScale + valueTimesBar2 * this.middleScale + valueSq * this.endScale;
    }

	public get vY():number {
		return this._vy;
	}

	public _vy: number;
	public set vY(value:number){
		this._vy = value;
		this.y += value;
	}
}
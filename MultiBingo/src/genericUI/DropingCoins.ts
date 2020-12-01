class DropingCoins extends egret.DisplayObjectContainer {

	private coinsMcs: Array<Coin>;
	private coinsDrop: Array<Coin>;

	private startPosition: egret.Point;
	private startRandomRange: egret.Point;
	private startV: egret.Point;
	private startRandomV: egret.Point;
	private startScale: number;
	private endScale: number;

	private g: number;

	public constructor() {
		super();

		this.coinsMcs = [];
	}

	public drop( coinsCount: number, startPosition: egret.Point, startRandomRange: egret.Point, startV: egret.Point, startRandomV: egret.Point, g: number, startScale: number, endScale: number ){
		while( this.coinsMcs.length < coinsCount )this.coinsMcs.push( new Coin() );
		this.coinsDrop = this.coinsMcs.concat();

		this.savePositions( startPosition, startRandomRange, startV, startRandomV, startScale, endScale );
		this.g = g;
		this.startDrop();

		SoundManager.play( "coinsDrop_mp3" );
	}

	private savePositions( startPosition: egret.Point, startRandomRange: egret.Point, startV: egret.Point, startRandomV: egret.Point, startScale: number, endScale: number ){
		this.startPosition = startPosition;
		this.startRandomRange = startRandomRange;
		this.startV = startV;
		this.startRandomV = startRandomV;
		this.startScale = startScale;
		this.endScale = endScale;
	}

	private startDrop(){
		if( !this.coinsDrop.length )return;
		let coin: Coin = this.coinsDrop.shift();
		coin.x = this.startPosition.x + ( Math.random() - 0.5 ) * this.startRandomRange.x;
		coin.y = this.startPosition.y + ( Math.random() - 0.5 ) * this.startRandomRange.y;
		let vx: number = this.startV.x + ( Math.random() - 0.5 ) * this.startRandomV.x;
		let vy: number = this.startV.y + ( Math.random() - 0.5 ) * this.startRandomV.y;
		let duration: number = 800;
		let moveTimes: number = duration / 33;
		let endX: number = coin.x + vx * moveTimes;
		let endVY: number = moveTimes * this.g + vy;
		coin.scaleX = coin.scaleY = this.startScale;
		coin.rotation = Math.random()*360;
		coin.vY = vy;
		coin.gotoAndPlay(Math.floor(Math.random()*coin.totalFrames));
		this.addChild( coin );
		coin.play(-1);
		let twX: egret.Tween = egret.Tween.get( coin );
		twX.wait( 33 );
		twX.call( this.startDrop, this );
		twX.to( { scaleX: this.endScale, scaleY: this.endScale, x: endX, vY: endVY }, duration );
		twX.call( this.endDrop, this, [coin] );
	}

	private endDrop( coin: Coin ){
		coin.parent.removeChild( coin );
		coin.stop();
		if( this.numChildren === 0 ){
			if( this.parent )this.parent.removeChild( this );
		}
	}
}
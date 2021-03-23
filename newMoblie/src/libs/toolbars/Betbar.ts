class Betbar extends egret.DisplayObjectContainer{

	private processBar: egret.Bitmap;
	private jackpotMinBet: number;

	private processStartX: number = 32;
	private processMax: number = 780;

	public constructor(jackpotMinBet:number) {
		super();

		let bg: egret.Bitmap = Com.addBitmapAt( this, "betBar_json.bar_bg", 0, 0 );
		bg.scale9Grid = new egret.Rectangle( 18, 10, 60, 29 );
		bg.width = 820;

		this.processBar = Com.addBitmapAt( this, "betBar_json.bar_progress", 4, 4 );
		this.processBar.scale9Grid = new egret.Rectangle( 16, 8, 56, 15 );
		this.processBar.width = this.processStartX;

		this.visible = false;
		this.jackpotMinBet = jackpotMinBet;
	}

	public setBet( bet: number ){
		egret.Tween.removeTweens( this );
		this.visible = true;
		TweenerTool.tweenTo( this, { alpha: 1 }, 500, 0, this.waitThis.bind(this) );

		this.checkLock( bet );
	}

	private waitThis(){
		TweenerTool.tweenTo( this, { alpha: 0 }, 500, 1500, this.waitThis.bind(this) );
	}

	private hideThis(){
		this.visible = false;
	}

	private checkLock( bet: number ){
		this.processBar.width =  GameData.bets.indexOf( bet ) / ( GameData.bets.length - 1 ) * this.processMax + this.processStartX;
	}
}
class BlackoutGold extends egret.DisplayObjectContainer{

	public powerUpId: string;

	public constructor( luckNumbers: Array<number>, bbl: BlackoutBallLayer, powerUpId: string ) {
		super();

		this.powerUpId = powerUpId;

		let bg: egret.Bitmap = Com.addBitmapAt( this, "blackout_gold_json.bg_choose", 0, 0 );
		bg.touchEnabled = true;

		Com.addBitmapAtMiddle( this, "blackout_gold_json.GOLDEN_BALL_" + MuLang.language, 367, 30 );

		for( let i: number = 0; i < luckNumbers.length; i++ ){
			let ball: egret.Sprite = bbl.buildBigBallForGold( luckNumbers[i] );
			Com.addObjectAt( this, ball, 133 + 94 + i % 2 * 302, 121 + 94 + Math.floor( i / 2 ) * 236 );
			ball.name = "" + luckNumbers[i];

			ball.touchEnabled = true;
			ball.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this );
		}
	}

	private onTap( event: egret.TouchEvent ){
		let ev: egret.Event = new egret.Event( "chooseBall" );
		let ball: egret.Sprite = event.currentTarget;
		ball.removeEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this ); 
		ev.data = ball;
		this.dispatchEvent( ev );
	}

	public showResult( ball: egret.Sprite, cardLayer: egret.DisplayObjectContainer ) {
		this.removeChildren();

		let bg: egret.Bitmap = Com.addBitmapAt( this, "blackout_gold_json.bg", 0, 0 );
		bg.touchEnabled = true;
		Com.addBitmapAt( this, "blackout_gold_json.dark_base", 617, 161 );
		Com.addBitmapAt( this, "blackout_gold_json.DAUB_NOW_" + MuLang.language, 535, 18 );
		this.addChild( cardLayer );

		ball.scaleX = ball.scaleY = 131 / 188;
		Com.addObjectAt( this, ball, 681, 127 );
	}
}
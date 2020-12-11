class MaraObserveBar extends egret.DisplayObjectContainer{

	private balls: Array<egret.Sprite>;
	private ballPositions: Array<number> = [ 53, 184, 315 ];
	private choosedNum: number;
	private ballNumbers: Array<number>;

	private gotNum: boolean;

	private tipBg: egret.Bitmap;

	public constructor() {
		super();

		Com.addBitmapAt( this, "mara_lucky_ball_json.title", 0, 0 );
		this.tipBg = Com.addBitmapAt( this, "mara_lucky_ball_json.not this time", 47, 297 );
		this.tipBg.visible = false;

		Com.addBitmapAtMiddle( this, "mara_" + MuLang.language + "_json.pick", 187, 128 );
		Com.addBitmapAtMiddle( this, "mara_" + MuLang.language + "_json.luck", 215, 52 );
	}

	public showLuckNums( balls: Array<egret.Sprite> ){
		this.balls = balls;
		this.ballNumbers = [];
		for( let i: number = 0; i < balls.length; i++ ){
			this.addChild( balls[i] );
			balls[i].x = this.ballPositions[i];
			balls[i].y = 213;
			balls[i].touchEnabled = true;
			balls[i].addEventListener( egret.TouchEvent.TOUCH_TAP, this.onBallChoose, this );

			this.ballNumbers[i] = parseInt( balls[i].name );
		}
	}

	private onBallChoose( event: egret.TouchEvent ){
		if( this.gotNum ) return;
		let index: number = this.balls.indexOf( event.target );
		this.choosedNum = parseInt( event.target.name );
		MultiServer.guessNum( this.choosedNum );
		this.showSelectedUI( index );
	}

	public getNumFromServer( num: number ){
		let index: number = this.ballNumbers.indexOf( num );
		this.choosedNum = num;
		this.showSelectedUI( index );
	}

	private showSelectedUI( index: number ){
		for( let i: number = 0; i < this.balls.length; i++ ){
			this.balls[i].removeEventListener( egret.TouchEvent.TOUCH_TAP, this.onBallChoose, this );
		}
		let sellectBit: egret.Bitmap = Com.addBitmapAtMiddle( this, "mara_lucky_ball_json.write light", this.balls[index].x, this.balls[index].y );
		sellectBit.y -= sellectBit.height - sellectBit.width >> 1;
	}

	public checkLuckNum( num: number ){
		if( this.gotNum )return;

		let ballIndex: number = this.ballNumbers.indexOf( num );
		if( ballIndex >= 0 ){
			this.gotNum = true;
			Com.addBitmapAtMiddle( this, "mara_lucky_ball_json.red light", this.balls[ballIndex].x, this.balls[ballIndex].y );
			let redArrow: egret.Bitmap = Com.addBitmapAtMiddle( this, "mara_lucky_ball_json.drawn", this.balls[ballIndex].x, this.balls[ballIndex].y );
			redArrow.y += this.balls[ballIndex].height + redArrow.height >> 1;
			this.tipBg.visible = true;

			if( this.choosedNum == num ){
				MultiServer.triggerPowerUp( "guessNum", "", 0 );
			}
			else{
				let tx: egret.TextField = Com.addTextAt( this, 47, 297, 282, 31, 22 );
				tx.verticalAlign = "middle";
				tx.text = MuLang.getText( "lost luck" );
			}
		}
	}

	public showLuckPrize( prize: number ){
		let tx: egret.TextField = Com.addTextAt( this, 60, 297, 282, 31, 22 );
		tx.verticalAlign = "middle";
		tx.text = Utils.formatCoinsNumber( prize );
		let coin: egret.Bitmap = Com.addBitmapAtMiddle( this, MultiPlayerMachine.getAssetStr( "coin" ), 60 + tx.width - tx.textWidth >> 1, 311 );
	}
}
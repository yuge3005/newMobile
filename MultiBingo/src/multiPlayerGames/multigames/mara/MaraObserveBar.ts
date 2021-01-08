class MaraObserveBar extends egret.DisplayObjectContainer{

	private balls: Array<egret.Sprite>;
	private ballPositions: Array<number> = [ 625, 940, 1255 ];
	private choosedNum: number;
	private ballNumbers: Array<number>;

	private gotNum: boolean;

	private tipBg: egret.Bitmap;

	public constructor() {
		super();

		let titleBg: egret.Bitmap = Com.addBitmapAt( this, "mara_lucky_ball_json.title", 510, 268 );
		titleBg.width = 865;
		titleBg.height = 235;
		this.tipBg = Com.addBitmapAt( this, "mara_lucky_ball_json.not this time", 625, 965 );
		this.tipBg.scaleX = this.tipBg.scaleY = 0.9;
		this.tipBg.visible = false;

		let pickTx: egret.Bitmap =  Com.addBitmapAtMiddle( this, "mara_" + MuLang.language + "_json.pick", 943, 534 );
		pickTx.scaleX = pickTx.scaleY = 0.9;
		let lickTx: egret.Bitmap = Com.addBitmapAtMiddle( this, "mara_" + MuLang.language + "_json.luck", 943, 377 );
		lickTx.scaleX = lickTx.scaleY = 0.9;
	}

	public showLuckNums( balls: Array<egret.Sprite> ){
		this.balls = balls;
		this.ballNumbers = [];
		for( let i: number = 0; i < balls.length; i++ ){
			this.addChild( balls[i] );
			balls[i].x = this.ballPositions[i];
			balls[i].y = 745;
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
		sellectBit.scaleX = sellectBit.scaleY = 186 / 276;
	}

	public checkLuckNum( num: number ){
		if( this.gotNum )return;

		let ballIndex: number = this.ballNumbers.indexOf( num );
		if( ballIndex >= 0 ){
			this.gotNum = true;
			let sellectBit: egret.Bitmap = Com.addBitmapAtMiddle( this, "mara_lucky_ball_json.red light", this.balls[ballIndex].x, this.balls[ballIndex].y );
			sellectBit.scaleX = sellectBit.scaleY = 0.72;
			let redArrow: egret.Bitmap = Com.addBitmapAtMiddle( this, "mara_lucky_ball_json.drawn", this.balls[ballIndex].x, this.balls[ballIndex].y );
			redArrow.y += this.balls[ballIndex].height + redArrow.height >> 1;
			this.tipBg.visible = true;

			if( this.choosedNum == num ){
				MultiServer.triggerPowerUp( "guessNum", "", 0 );
			}
			else{
				let tx: TextLabel = Com.addLabelAt( this, 675, 977, 530, 48, 48 );
				tx.text = MuLang.getText( "lost luck" );
			}
		}
	}

	public showLuckPrize( prize: number ){
		let tx: TextLabel = Com.addLabelAt( this, 675, 977, 530, 48, 48 );
		tx.text = Utils.formatCoinsNumber( prize );
		let coin: egret.Bitmap = Com.addBitmapAtMiddle( this, MultiPlayerMachine.getAssetStr( "coin" ), 60 + tx.width - tx.textWidth >> 1, 311 );
	}
}
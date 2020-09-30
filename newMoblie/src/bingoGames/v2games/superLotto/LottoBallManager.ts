class LottoBallManager extends BallManager{
	public constructor() {
		super();
	}

	protected setBallBg( ball: egret.Sprite, assetName: string ){
		Com.addBitmapAt( ball, BingoMachine.getAssetStr( this.getUINameAt( this.ballCounter++ ) ), 0, 0 );
	}

	private static _ballCounter: number;
	private set ballCounter(value: number){
		LottoBallManager._ballCounter = value;
	}
	private get ballCounter(): number{
		return LottoBallManager._ballCounter;
	}

	public static get lottoBallIndex(): number{
		return LottoBallManager._ballCounter - 1;
	}

	protected buildBallWithIndex( num : number = 0, scaleToGame: Boolean = true ): BingoBall{
		let index: number = num - 1;
		BingoBall.ballUIs[index] = null;
		return super.buildBallWithIndex( num, scaleToGame );
	}

	private ballUIs: Array<string>;

	public setPrizeBalls( prizeBalls: Array<Object> ){
		this.ballCounter = 0;
		this.ballUIs = [];
		if( !prizeBalls ) return;
		for( let i: number = 0; i < prizeBalls.length; i++ ){
			if( prizeBalls[i]["multi"] == 2 ){
				this.ballUIs[prizeBalls[i]["index"]] = "ball_silver";
			}
			else if( prizeBalls[i]["multi"] == 3 ){
				this.ballUIs[prizeBalls[i]["index"]] = "ball_golden";
			}
			else this.ballUIs[prizeBalls[i]["index"]] = null;
		}
	}

	public getUINameAt( index: number ): string{
		let uiName: string = this.ballUIs[index];
		return uiName ? uiName : "ball_blue";
	}

	public getLottoSmallBall( index: number, ebPosition: number ): egret.TextField{
		this.ballCounter = ebPosition;
		let smallBall: egret.DisplayObjectContainer = this.getABall( index );
		smallBall.scaleY = smallBall.scaleX = 35 / 75;
		this.ballCounter = ebPosition;//for extra position

		var tx: egret.TextField = new egret.TextField;
		tx.width = 35;
		tx.height = 35;
		tx.size = 25;
		tx.bold = true;
		tx.textAlign = "center";
		tx.verticalAlign = "middle";
		tx.textColor = 0;
		tx.text = "" + index;
		return tx;
	}
}
class BlackoutBallCountDown extends egret.DisplayObjectContainer{

	private countDownMask: egret.Shape;

	private _countProgress: number;
	public set countProgress( value: number ){
		this.countDownMask.graphics.clear();
		this.countDownMask.graphics.beginFill(0);
		this.countDownMask.graphics.moveTo(0,0);
		this.countDownMask.graphics.drawArc( 0, 0, 79, Math.PI * 0.5, Math.PI * 0.5 + Math.PI * 2 * value );
		this.countDownMask.graphics.lineTo(0,0);
		this.countDownMask.graphics.endFill();
		this._countProgress = value;
	}
	public get countProgress(){
		return this._countProgress;
	}

	public constructor( bit: egret.DisplayObject ) {
		super();

		let parent: egret.DisplayObjectContainer = bit.parent;
		let index: number = parent.getChildIndex( bit );
		this.x = bit.x;
		this.y = bit.y;
		parent.addChildAt( this, index );
		Com.addObjectAt( this, bit, 0, 0 );

		this.countDownMask = new egret.Shape;
		Com.addObjectAt( this, this.countDownMask, 78.5, 79 );
		bit.mask = this.countDownMask;
		this.countProgress = 1;
	}

	public count(){
		this.countProgress = 1;
		TweenerTool.tweenTo( this, { countProgress: 0 }, ( Blackout.ballSpeed - 1 ) * 1000, 930 );
	}

	public countDownText( value: number ){
		let coundDownText: egret.TextField = Com.addTextAt( this, 612 - this.x, 16 + BrowserInfo.textUp - this.y, 125, 125, 80, false, true );
		coundDownText.verticalAlign = "middle";
		coundDownText.text = "" + value;
		TweenerTool.tweenTo( coundDownText, { scaleX: 0.01, scaleY: 0.01, x: 612 + 62 - this.x, y: 16 + 62 - this.y }, 1100, 0, MDS.removeSelf.bind( this, coundDownText ) );
	}
}
class DoubleBingoExtraUIObject extends egret.DisplayObjectContainer{

	private bg: egret.Bitmap;
	private redBallBgs: Array<egret.Bitmap>;

	private currentExtraIndex: number;
	private animationPlaying: boolean;

	private extraBgMc: egret.MovieClip;

	public constructor( oldUI: egret.DisplayObject ) {
		super();

		oldUI.visible = true;
		this.bg = oldUI as egret.Bitmap;

        this.alpha = 0;

		let uiIndex: number = oldUI.parent.getChildIndex( this.bg );
		oldUI.parent.addChildAt( this, uiIndex );
		this.addChild( this.bg );

		this.redBallBgs = [];
		for( let i: number = 0; i < 12; i++ ){
			let pt: egret.Point = BallManager.getBallLastPosition( i + 31 );
			this.redBallBgs[i] = Com.addBitmapAt( this, BingoMachine.getAssetStr("red_ballpng"), pt.x + 2, pt.y + 2 );
		}

		this.extraBgMc = Com.addMovieClipAt( this, MDS.mcFactory, "effect_boom", 0, 0 );
		this.extraBgMc.alpha = 0.7;
		this.extraBgMc.anchorOffsetX = 100;
		this.extraBgMc.anchorOffsetY = 95;
	}

	public showExtraUI( show: boolean = true ){
		TweenerTool.tweenTo( this, { alpha: show ? 1 : 0 }, 300 );
	}

	public showRedBallsAnimation(){
		let interval: number = 100;
		this.animationPlaying = true;
		this.extraBgMc.visible = false;
		for( let i: number = 0; i < 12; i++ ){
			this.redBallBgs[i].alpha = 0;
			let tw: egret.Tween = egret.Tween.get( this.redBallBgs[i] );
			tw.wait( i * interval );
			tw.to( { alpha: 1 }, 33 );
			tw.wait( ( 12 - i ) * interval * 2 );
			tw.to( { alpha: 0 }, 33 );
			if( i == 0 )tw.call( this.endAnimation.bind(this) );
		}
	}

	public nextExtra( currentBallIndex: number ){
		this.currentExtraIndex = currentBallIndex - 31;
		if( !this.animationPlaying ) this.showCurrentExtra();
	}

	private endAnimation(){
		this.animationPlaying = false;
		this.showCurrentExtra();
	}

	private showCurrentExtra(){
		for( let i: number = 0; i < 12; i++ ){
			if( this.currentExtraIndex >= i ) this.redBallBgs[i].alpha = 1;
		}
		this.extraBgMc.visible = true;
		let pt: egret.Point = BallManager.getBallLastPosition( this.currentExtraIndex + 31 );
		this.extraBgMc.x = pt.x + 32;
		this.extraBgMc.y = pt.y + 32;
	}
}
class BlackoutFreezeUI extends egret.DisplayObjectContainer{

	private fztime1: egret.Bitmap;
	private fztime2: egret.Bitmap;
	private freezeBg: egret.Bitmap;

	private freezeBeginTime: number;

	public constructor( freezeBg: egret.Bitmap ) {
		super();

		this.freezeBg = freezeBg;

		this.fztime1 = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "freez_time" ), 606, 136 );
		this.fztime2 = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "freez_time" ), 606, 136 );

		this.allShow( false );
	}

	private allShow( show: boolean ){
		this.fztime2.visible = this.fztime1.visible = show;
		this.freezeBg.visible = show;
		if( show )this.fztime2.alpha = this.fztime1.alpha = 1;
	}

	public freeze(){
		this.freezeBeginTime = egret.getTimer();

		this.allShow( true );
		TweenerTool.tweenTo( this.freezeBg, { alpha: 1 }, 600, 0, this.freezeBgHide.bind( this ), { alpha: 0 } );
		this.freezeMask( 0 );
	}

	private freezeBgHide(){
		TweenerTool.tweenTo( this.freezeBg, { alpha: 0 }, 600, 3600 );
		TweenerTool.tweenTo( this.fztime1, { alpha: 0 }, 600, 3600 );
		TweenerTool.tweenTo( this.fztime2, { alpha: 0 }, 600, 3600 );
	}

	public checkFreeze(): boolean{
		if( this.freezeBg.visible ){
			let passTime: number = egret.getTimer() - this.freezeBeginTime;
			if( passTime > 5000 ){
				this.allShow( false );
				this.dispatchEvent( new egret.Event("endFreeze") );
			}
			else this.freezeMask( passTime / 600 );
			return true;
		}
		return false;
	}

	private freezeMask( percent: number ){
		if( percent <= 1 ){
			this.fztime1.mask = new egret.Rectangle( 0, 0, 80 * percent, 71 );
			this.fztime2.mask = new egret.Rectangle( 159 - 80 * percent, 0, 80 * percent, 71 );
		}
		else{
			if( this.fztime1.mask ){
				this.fztime1.mask = null;
				this.fztime2.mask = null;
				this.fztime2.visible = false;
			}
		}
	}
}
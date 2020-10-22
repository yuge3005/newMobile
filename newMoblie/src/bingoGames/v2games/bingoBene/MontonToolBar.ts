class MontonToolBar extends BingoGameToolbar{

	public static bgmType: string;

	public constructor() {
		super();
	}

	protected onToolbarAdd( event: egret.Event ): void{
		super.onToolbarAdd( event );
		
		this.soundTimerCount = new Date();
		this.bgmPlaying = false;
		this.addEventListener( egret.Event.ENTER_FRAME, this.onMontonBarFrame, this );
	}

	private onMontonBarFrame( event: egret.Event ): void{
		if( !this.bgmPlaying ){
			if( new Date().getTime() - this.soundTimerCount.getTime() >= 12000 ){
				SoundManager.play( MontonToolBar.bgmType, true );
				this.bgmPlaying = true;
			}
		}

		if( !this.stage )this.removeEventListener( egret.Event.ENTER_FRAME, this.onMontonBarFrame, this );
	}

	protected sendCommand( event: egret.TouchEvent ): void{
		super.sendCommand( event );

		this.resetBgMusicTimer();
	}

	private soundTimerCount: Date;
	private bgmPlaying: boolean;

	public resetBgMusicTimer(): void{
		this.soundTimerCount = new Date();

		if( this.bgmPlaying ){
			this.bgmPlaying = false;
			SoundManager.play( "blank_sound_mp3", true );
		}
	}
}
class PipaToolBar extends GameToolBar{

	private miniGameBtn: TouchDownButton;

	private betLocked: boolean;

	public constructor() {
		super();

		this.removeChild( this.startAutoBtn );
		this.removeChild( this.stopAutoBtn );
		this.removeChild( this.playBtn );
		this.removeChild( this.stopBtn );

		this.playBtn = this.addBtn( "GameToolBar_json.play_big", 603, 23, GameCommands.play );
		this.addButtonText( this.playBtn, 25, "play", 0, -3 );

		this.stopBtn = this.addBtn( "GameToolBar_json.play_big", 603, 23, GameCommands.stop );
		this.addButtonText( this.stopBtn, 25, "stop", 0, -3 );
		this.stopBtn.visible = false;

		this.miniGameBtn = this.addBtn( "GameToolBar_json.play_big", 603, 23, GameCommands.showMini );
		this.addButtonText( this.miniGameBtn, GlobelSettings.language == "pt"? 22 : 25, "board" );
	}

	public setMiniButton( isShow: boolean ): void{
		this.miniGameBtn.visible = isShow;
	}

	private soundTimerCount: Date;
	private bgmPlaying: boolean;

	protected sendCommand( event: egret.TouchEvent ): void{
		super.sendCommand( event );

		this.resetBgMusicTimer();
	}

	public resetBgMusicTimer(): void{
		this.soundTimerCount = new Date();

		if( this.bgmPlaying ){
			this.bgmPlaying = false;
			SoundManager.play( "blank_sound_mp3", true );
		}
	}

	protected onToolbarAdd( event: egret.Event ): void{
		super.onToolbarAdd( event );

		this.soundTimerCount = new Date();
		this.bgmPlaying = false;
		this.addEventListener( egret.Event.ENTER_FRAME, this.onPiPaBarFrame, this );
	}

	private onPiPaBarFrame( event: egret.Event ): void{
		if( !this.bgmPlaying ){
			if( new Date().getTime() - this.soundTimerCount.getTime() >= 12000 ){
				SoundManager.play( "pipa_bgm_mp3", true );
				this.bgmPlaying = true;
			}
		}

		if( !this.stage )this.removeEventListener( egret.Event.ENTER_FRAME, this.onPiPaBarFrame, this );
	}

	public lockBet( lock: boolean ): void{
		this.betLocked = lock;
		if( this.betLocked ){
			this.decreseBetBtn.enabled = false;
			this.increaseBetBtn.enabled = false;
		}
		else{
			this.decreseBetBtn.enabled = true;
			this.increaseBetBtn.enabled = true;
		}
	}

	public setBet( bet: number, cardNumber: number, isMaxBet: boolean, isMaxCards: boolean ){
		super.setBet( bet, cardNumber, isMaxBet, isMaxCards );

		if( this.betLocked ){
			this.maxBetBtn.enabled = false;
		}
	}
}
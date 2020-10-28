class CopaToolBar extends BingoGameToolbar{

	private miniGameBtn: TouchDownButton;

	private betLocked: boolean;

	public constructor() {
		super();

		this.miniGameBtn = this.addBtn( "btn_go", 1724, 22, GameCommands.showMini, this.playContainer, true );
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

	public setBet( bet: number, cardNumber: number, isMaxBet: boolean ){
		super.setBet( bet, cardNumber, isMaxBet );

		if( this.betLocked ){
			this.maxBetBtn.enabled = false;
		}
	}
}
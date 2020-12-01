class LongPressButton extends TouchDownButton {

	private longPressDuration: number;
	private longPressCallback: Function;
	private longPressTimer: egret.Timer;
	private longPressJustHappened: boolean;

	public constructor( upState: string, downState: string ) {
		super( upState, downState );
	}

	protected onTouchBegin(event:egret.TouchEvent){
		super.onTouchBegin(event);

		this.longPressJustHappened = false;
		if( this.longPressDuration ) this.addTimer();
	}

	private addTimer(){
		if( this.longPressTimer ) this.removeTimer();
		this.longPressTimer = new egret.Timer( this.longPressDuration, 1 );
		this.longPressTimer.addEventListener( egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this );
		this.longPressTimer.start();
	}

	private removeTimer(){
		if( !this.longPressTimer ) return;
		this.longPressTimer.removeEventListener( egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this );
		this.longPressTimer.stop();
		this.longPressTimer = null;
	}

	private onTimerComplete( event: egret.TimerEvent ){
		this.longPressJustHappened = true;
		this.removeTimer();
		if( this.longPressCallback ) this.longPressCallback();
	}

	protected onTouchTap(event:egret.TouchEvent){
		if( this.longPressJustHappened ){
			this.longPressJustHappened = false;
			event.stopImmediatePropagation();
			return;
		}
		if( this.longPressTimer ){
			this.removeTimer();
		}
		super.onTouchTap( event );
	}

	public longPressSetting( duration: number, callback: Function = null ){
		this.longPressDuration = duration;
		this.longPressCallback = callback;
	}
}
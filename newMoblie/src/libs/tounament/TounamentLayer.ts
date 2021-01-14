class TounamentLayer extends egret.DisplayObjectContainer{

	private innerBar: egret.DisplayObjectContainer;
	private outBar: egret.DisplayObjectContainer;

	private pressBar: egret.Bitmap;
	private timeTx: egret.TextField;
	private potTx: TextLabel;

	private duration: number;
	private totalDuration: number;
	private timer: egret.Timer;

	private _potCount: number;
	private set potCount( value: number ){
		this._potCount = Math.floor( value );
		this.potTx.setText( "$" + this._potCount );
	}
	private get potCount(): number{
		return this._potCount;
	}

	private usersUI: Array<TounamentUserItem>;

	public constructor( data: ITounamentData ) {
		super();

		this.buildInnerBar();
		this.buildOutBar();

		this.updateDuration( data.duration, data.totalDuration );
		this.updatePrize( data.prize );

		this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );

		this.updateUserList( data.userList, data.winners );
	}

	private onAdd( event: egret.Event ){
		this.removeEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );
		this.addEventListener( egret.Event.REMOVED_FROM_STAGE, this.onRemove, this );
		this.timer = new egret.Timer( 1000 );
		this.timer.addEventListener( egret.TimerEvent.TIMER, this.onTimer, this );
		this.timer.start();
	}

	private onRemove( event: egret.Event ){
		this.removeEventListener( egret.Event.REMOVED_FROM_STAGE, this.onRemove, this );
		this.timer.removeEventListener( egret.TimerEvent.TIMER, this.onTimer, this );
		this.timer.stop();
		this.timer = null;
	}

	public updata( data: ITounamentData ){
		this.updateDuration( data.duration, data.totalDuration );
		this.updatePrize( data.prize );
		this.updateUserList( data.userList, data.winners );
	}

	public buildInnerBar(){
		this.innerBar = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.innerBar, 0, 0 );

		let tmBg: egret.Bitmap = Com.addBitmapAt( this.innerBar, "tounament_json.ranking_bg", 0, 0 );
		tmBg.width = 235;
		tmBg.height = 385;
		Com.addBitmapAtMiddle( this.innerBar, "tounament_json.ranking_" + MuLang.language, 117, 36 );

		let titleTx: egret.TextField = Com.addTextAt( this.innerBar, 10, 80, 215, 30, 30 );
		titleTx.text = MuLang.getText( "play_enter" );

		let barBg: egret.Bitmap = Com.addBitmapAt( this.innerBar, "tounament_json.bar_bg", 10, 117 );
		barBg.scale9Grid = new egret.Rectangle( 10, 10, 182, 24 );
		barBg.width = 212;

		let prizeBg: egret.Bitmap = Com.addBitmapAt( this.innerBar, "tounament_json.bar_bg", 10, 175 );
		prizeBg.scale9Grid = new egret.Rectangle( 10, 10, 182, 24 );
		prizeBg.width = 212;
		prizeBg.height = 100;

		let potTx: egret.TextField = Com.addTextAt( this.innerBar, 10, 185, 215, 28, 28 );
		potTx.text = MuLang.getText( "prize_pot" );

		this.pressBar = Com.addBitmapAt( this.innerBar, "tounament_json.progress_bar", 12, 121 );
		this.pressBar.scale9Grid = new egret.Rectangle( 4, 4, 186, 28 );

		Com.addBitmapAt( this.innerBar, "tounament_json.deviding_line", 15, 287 );

		this.innerBar.cacheAsBitmap = true;

		this.potTx = Com.addLabelAt( this, 12, 225, 208, 48, 48, false, true );
		this.potCount = 0;

		this.timeTx = Com.addTextAt( this, 10, 125, 212, 36, 36, true );
		this.timeTx.stroke = 2;
		this.timeTx.bold = true;
		this.timeTx.verticalAlign = "middle";
	}

	public buildOutBar(){
		this.outBar = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.outBar, 0, 297 );

		let avBg: egret.Bitmap = Com.addBitmapAt( this.outBar, "tounament_json.mechanism_pending_bg", 0, 0 );
		avBg.width = 235;
		avBg.height = 530;
		let avt: egret.Bitmap = Com.addBitmapAtMiddle( this.outBar, "tounament_json.avatar", 117, 264 );
		let fbId: string = PlayerConfig.player( "facebook_id" );
		if( fbId ) FacebookBitmap.downloadBitmapDataByFacebookID( fbId, 100, 100, this.getHeadIcon.bind( this, avt, 166 ), this );

		let txUp: egret.TextField = Com.addTextAt( this.outBar, 5, 0, 215, 150, 28, true, true );
		txUp.textColor = 0xFFFF00;
		txUp.stroke = 2;
		txUp.strokeColor = 0;
		txUp.verticalAlign = "middle";
		txUp.text = MuLang.getText( "play_to_enter" );

		let txDown: egret.TextField = Com.addTextAt( this.outBar, 0, 405, 235, 30, 28, false, true );
		txDown.text = MuLang.getText( "win_to_enter" );
		this.outBar.cacheAsBitmap = true;
	}

	public getHeadIcon( userInfo: egret.Bitmap, size: number, event: egret.Event ){
		let loader:egret.ImageLoader = event.currentTarget;
        let bmd: egret.BitmapData = loader.data;
		let tx: egret.Texture = new egret.Texture;
		tx.bitmapData = bmd;
		userInfo.scaleX = userInfo.scaleY = 1;
        userInfo.texture = tx;
		userInfo.width = userInfo.height = size;
	}

	private updateDuration( duration: number, totalDuration: number ){
		this.duration = duration;
		this.totalDuration = totalDuration;

		this.pressBar.width = duration / this.totalDuration * 208;

		this.updataDurationUI( duration );

		if( this.timer ) {
			this.timer.reset();
			this.timer.start();
		}
	}

	private onTimer( event: egret.TimerEvent ){
		this.updataDurationUI( this.duration - ( event.target as egret.Timer ).currentCount );
	}

	private updataDurationUI( duration: number ){
		this.timeTx.text = Utils.secondToHour( duration );
	}

	private updatePrize( prize: number ){
		TweenerTool.tweenTo( this, { potCount: prize }, 500 );
	}

	private showingWinners: boolean;

	private updateUserList( users: Array<ITounamentUser>, winners: Array<ITounamentUser> ){
		if( !users.length ) return;
		TweenerTool.tweenTo( this.outBar, { x: -235 }, 500 );

		this.showingWinners = !this.showingWinners;
		this.hideUserUI();
		this.showUserUI( users, winners );
	}

	private hideUserUI(){
		if( this.usersUI ){
			for( let i: number = 0; i < this.usersUI.length; i++ ){
				TweenerTool.tweenTo( this.usersUI[i], { scaleX: 0 }, 500, 500 * i, MDS.removeSelf.bind( this, this.usersUI[i] ) );
			}
		}
	}

	private showUserUI( users: Array<ITounamentUser>, winners: Array<ITounamentUser> ){
		this.usersUI = [];
		for( let i: number = 0; i < Math.min(this.usersUI.length, 3 ) ; i++ ){
			this.usersUI[i] = new TounamentUserItem(  );
			TweenerTool.tweenTo( this.usersUI[i], { scaleX: 0 }, 500, 500 * i, MDS.removeSelf.bind( this, this.usersUI[i] ) );
		}
	}
}
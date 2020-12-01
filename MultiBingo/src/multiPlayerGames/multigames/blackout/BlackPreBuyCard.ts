class BlackPreBuyCard extends egret.DisplayObjectContainer{

	private roomConfigItems: Array<BlackoutRoomItem>;
	private lightBitmap: egret.Bitmap;

	protected historyArea: BlackoutHistory;

	public constructor( cardPriceConfig: Array<Array<Object>>, pastJoinedRooms: Array<Object> ) {
		super();

		Com.addBitmapAt( this, "blackout_rank_json.bg", 0, 0 );
		Com.addBitmapAt( this, "blackout_room_json.base", 0, 0 );

		this.roomConfigItems = [];
		for( let i: number = 0; i < cardPriceConfig.length; i++ ){
			this.roomConfigItems[i] = new BlackoutRoomItem( cardPriceConfig[i], i );
			this.addChild( this.roomConfigItems[i] );
			this.roomConfigItems[i].addEventListener( BlackoutRoomItem.CHOOSE_CARD, this.onChoose, this );
		}

		Com.addDownButtonAt( this, "blackout_room_json.i", "blackout_room_json.i", 38, 39, this.onInfoButton, true );

		Com.addBitmapAt( this, "blackout_room_json.light_bg", 461, 98 );
		this.lightBitmap = Com.addBitmapAt( this, "blackout_room_json.light", 438, 72 );
		Com.addBitmapAtMiddle( this, "blackout_room_json.CHOOSE_THE_PRICE_" + MuLang.language, 377, 55 );
		Com.addBitmapAt( this, "blackout_room_json.collect_panel", 481, 99 );
		let tx: egret.TextField = MDS.addGameText( this, 500, 100 + BrowserInfo.textUp, 33, 0xFFFFFF, "recording", false, 225, "", 1 );
		tx.textAlign = "center";
		tx.bold = true;
		tx.fontFamily = "Arial";

		this.historyArea = new BlackoutHistory;
		Com.addObjectAt( this, this.historyArea, 484, 146 );
		for( let i: number = 0; i < pastJoinedRooms.length; i++ ){
			this.historyArea.showUserHistory( pastJoinedRooms[i] );
		}

		this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAddToStage, this );
	}

	private onAddToStage( event: egret.Event ){
		this.moveLight();
	}

	private moveLight(){
		if( !this.stage ) return;
		TweenerTool.tweenTo( this.lightBitmap, { y: this.lightBitmap.y > 60 ? 45 : 120 }, 5000, 500, this.moveLight.bind( this ) );
	}

	private onChoose( event: egret.Event ){
		let ev: egret.Event = new egret.Event( BlackoutRoomItem.CHOOSE_CARD );
		ev.data = event.data;
		this.dispatchEvent( ev );
	}

	private onInfoButton( event: egret.TouchEvent ){
		this.parent.dispatchEvent( new egret.Event( "showHelp" ) );
	}

	public addLastRecord(){
		this.historyArea.addLastRecord();
	}
}
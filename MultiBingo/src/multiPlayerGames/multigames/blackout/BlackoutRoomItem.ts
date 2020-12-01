class BlackoutRoomItem extends egret.DisplayObjectContainer{

	public static CHOOSE_CARD: string = "chooseCard";
	public static championAwardBase: number;

	private price: number;
	private type: number;
	private roomIndex: number;

	public constructor( roomData: Array<Object>, roomIndex: number ) {
		super();

		this.price = roomData[0]["price"];
		this.type = roomData[0]["coinsType"];
		this.roomIndex = roomIndex;

		Com.addBitmapAt( this, "blackout_room_json.buy", 0, 0 );
		this.x = roomIndex % 2 * 220 + 10;
		this.y = Math.floor( roomIndex / 2 ) * 248 + 87;
		Com.addBitmapAtMiddle( this, "blackout_room_json." + ( roomIndex + 1 ) + ( this.type == 1 ? "_gear" : "_dinero" ), 111, 111 );
		Com.addBitmapAt( this, "blackout_room_json." + ( this.type == 1 ? "icon_coins" : "icon_dinero" ), 23, 172 );

		let price: egret.TextField = Com.addTextAt( this, 40, 180 + BrowserInfo.textUp, 172, 28, 28, false, true );
		price.text = Utils.formatCoinsNumber( this.price );
		price.filters = [new egret.DropShadowFilter( 5, 90, 0, 0.6, 5, 5 )];

		let win: egret.TextField = MDS.addGameText( this, 26, 26 + BrowserInfo.textUp, 25, 0xFFF100, "win", false, 200, "", 172 / 200 );
		win.textAlign = "center";
		win.text = Utils.formatCoinsNumber( this.price * BlackoutRoomItem.championAwardBase );
		win.filters = [new egret.DropShadowFilter( 5, 90, 0, 0.6, 5, 5 )];

		let tx: egret.TextField = MDS.addGameText( this, 26, 7 + BrowserInfo.textUp, 20, 0xFEAD00, "win", false, 172, "", 1 );
		tx.textAlign = "center";
		tx.filters = [new egret.DropShadowFilter( 5, 90, 0, 0.6, 5, 5 )];

		this.touchChildren = false;
		this.touchEnabled = true;
		this.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onRoomChoose, this );
	}

	private onRoomChoose( event: egret.TouchEvent ){
		let ev: egret.Event = new egret.Event( BlackoutRoomItem.CHOOSE_CARD );
		ev.data = { index: this.roomIndex, price: this.price, type: this.type };
		this.dispatchEvent( ev );
	}
}
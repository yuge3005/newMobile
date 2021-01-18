class TounamentChampoin extends egret.DisplayObjectContainer{

	public constructor() {
		super();
	}

	public clearUI(){
		this.removeChildren();
	}

	public show( user: ITounamentUser ){
		let headBg: egret.Bitmap = Com.addBitmapAt( this, "tounament_json.head_bg", 10, 0 );

		let headUI: egret.Bitmap = Com.addBitmapAt( this, "tounament_json.avatar", 11, 1 );
		headUI.width = 63;
		headUI.height = 63;

		if( user.networkLogins[0].network == "facebook" ){
			FacebookBitmap.downloadBitmapDataByFacebookID( user.networkLogins[0].id, 50, 50, MDS.onUserHeadLoaded.bind( this, headUI, 63 ), this );
		}

		let shieldBitmap: egret.Bitmap = Com.addBitmapAt( this, "tounament_json.Top3_1st_sheild", 90, 0 );
		shieldBitmap.width = 35;
		shieldBitmap.height = 35;

		let rankTx: TextLabel = Com.addLabelAt( this, 128, 0, 88, 30, 28 );
		rankTx.textAlign = "right";
		rankTx.text = "#1";
		rankTx.filters = [new egret.DropShadowFilter()];

		let ptsTx: TextLabel = Com.addLabelAt( this, 87, 48, 100, 20, 20 );
		ptsTx.textAlign = "left";
		ptsTx.text = "PTS:";

		let scoreTx: TextLabel = Com.addLabelAt( this, 87 + ptsTx.textWidth, 48, 129 - ptsTx.textWidth, 20, 20 );
		scoreTx.textAlign = "right";
		scoreTx.setText( Utils.formatCoinsNumber( user.coinsEarn ) );

		ptsTx.size = scoreTx.size;
	}
}
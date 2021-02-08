class TounamentUserItem extends egret.DisplayObjectContainer{
	public constructor( user: ITounamentUser, rank: number, isMe: boolean ) {
		super();

		this.anchorOffsetY = 70;

		let bg: egret.Bitmap =  Com.addBitmapAt( this, isMe ? "tounament_json.own_bg" : "tounament_json.player_bg", 0, 0 );
		bg.width = 235;
		bg.height = 140;

		let headBg: egret.Bitmap = Com.addBitmapAt( this, "tounament_json.head_bg", 10, 17 );
		headBg.width = 104;
		headBg.height = 104;

		let headUI: egret.Bitmap = Com.addBitmapAt( this, "tounament_json.avatar", 12, 19 );
		headUI.width = 100;
		headUI.height = 100;

		if( user.networkLogins[0].network == "facebook" ){
			FacebookBitmap.downloadBitmapDataByFacebookID( user.networkLogins[0].id, 100, 100, MDS.onUserHeadLoaded.bind( this, headUI, 100 ), this );
		}

		if( rank <= 3 ){
			let shieldName: string = this.addChildShield( rank );
			if( shieldName ){
				let shieldBitmap: egret.Bitmap = Com.addBitmapAt( this, "tounament_json." + shieldName, 152, 6 );
				shieldBitmap.width = 69;
				shieldBitmap.height = 73;
			}
		}
		else{
			let tx: TextLabel = Com.addLabelAt( this, 152, 28, 69, 40, 40 );
			tx.textAlign = "left";
			tx.setText( "#" + rank );
			tx.filters = [new egret.DropShadowFilter()];
		}

		let ptsTx: TextLabel = Com.addLabelAt( this, 120, 85, 100, 22, 22 );
		ptsTx.textAlign = "right";
		ptsTx.text = "PTS";

		let scoreTx: TextLabel = Com.addLabelAt( this, 120, 115, 100, 20, 20 );
		scoreTx.textAlign = "right";
		scoreTx.setText( Utils.formatCoinsNumber( user.coinsEarn ) );

		if( !isMe )this.cacheAsBitmap = true;
	}

	private addChildShield( rank: number ): string{
		switch( rank ){
			case 1: return "Top3_1st_sheild";
			case 2: return "Top3_2nd_sheild";
			case 3: return "Top3_3rd_sheild";
			default: return null;
		}
	}
}
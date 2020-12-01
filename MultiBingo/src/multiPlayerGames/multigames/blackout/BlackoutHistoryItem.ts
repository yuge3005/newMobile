class BlackoutHistoryItem extends egret.DisplayObjectContainer{

	private coinsType: number;
	private id: string;

	public constructor( award: number, coinsType: number, collected: boolean, id: string, time: string ) {
		super();

		let headIcon: egret.Bitmap;
		
		let sp: egret.Shape = new egret.Shape;
		this.addChild( sp );

		this.id = id;
		this.coinsType = coinsType;

		if( award > 0 ){
			let tipTxt: egret.TextField = MDS.addGameText( this, 65, 10 + BrowserInfo.textUp, 20, 0xFFFFFF, "You_win", false, 225, "", 175 / 225 );
			tipTxt.textAlign = "center";

			let awardTxt: egret.TextField = Com.addTextAt( this, 75, 40 + BrowserInfo.textUp, 165, 20, 20 );
			awardTxt.textColor = 0xFFF100;
			awardTxt.bold = true;
			awardTxt.text = Utils.formatCoinsNumber( award );

			Com.addBitmapAt( this, "blackout_rank_json.icon_coins", 265 - awardTxt.textWidth >> 1, 38 );

			if( !collected ){
				let bt: TouchDownButton = Com.addDownButtonAt( this, "blackout_room_json.collect", "blackout_room_json.collect", 152, 82, this.collectItem.bind( this ), true );
				headIcon = Com.addBitmapAt( this, "blackout_room_json.win_uncollected", 0, 5 );
			}
			else{
				let btBg: egret.Bitmap = Com.addBitmapAtMiddle( this, "blackout_room_json.collected_base", 152, 80 );
				headIcon = Com.addBitmapAt( this, "blackout_room_json.win_collected", 0, 5 );
			}
			let btTxt: egret.TextField = Com.addTextAt( this, 106, 70 + BrowserInfo.textUp, 94, 16, 16 );
			btTxt.text = MuLang.getText( "collect" );
		}
		else{
			headIcon = Com.addBitmapAt( this, "blackout_room_json.lose", 2, 2 );
			let notWinTxt: egret.TextField = MDS.addGameText( this, 65, 20 + BrowserInfo.textUp, 20, 0xFFFFFF, "You_not_win", false, 225, "", 175 / 225 );
			notWinTxt.textAlign = "center";
		}

		let timeBg: egret.Bitmap = Com.addBitmapAt( this, "blackout_room_json.rail", -2, 80 );
		if( award ) timeBg.y += 20;
		let timeTx: egret.TextField = Com.addTextAt( this, 0, timeBg.y + 8 + BrowserInfo.textUp, 242, 15, 15 );
		timeTx.textColor = 0x5C85C1;
		timeTx.text = MuLang.getText( "Time: " ) + this.getTimeString( time );

		GraphicTool.drawRect( sp, new egret.Rectangle( 0, 0, this.width, this.height ), 0x2D1255, false, 0.01 );
	}

	private collectItem( event: egret.TouchEvent ){
		MultiServer.getBlackoutAward( this.id );
		let btn: TouchDownButton = event.currentTarget as TouchDownButton;
		btn.touchEnabled = false;
		btn.filters = [ MatrixTool.colorMatrix( 0.5, 0.1, 1 ) ];
		let startPt: egret.Point = MDS.getDisplayObjectGlobelPoint(event.target);
		if( btn.parent && btn.parent.parent && btn.parent.parent.parent && btn.parent.parent.parent["scrollTop"] > 0 ) startPt.y -= btn.parent.parent.parent["scrollTop"];
		Trigger.flyingCoins(10, startPt, new egret.Point(600, 600), 0.1, 0.1, 0.7);
	}

	private getTimeString( time: string ){
		let timeStr: Array<string> = time.split( " " );
		let utcDay: string = timeStr[0];
		let localDay: string = timeStr[1];
		let utcTime: Date = new Date( utcDay );
		let timeArr: Array<string> = localDay.split(":");
		let hour: number = parseInt(timeArr[0]);
		let min: number = parseInt(timeArr[1]);
		let dMin: number = ( new Date().getTime() - utcTime.getTime() ) / 60000 - hour * 60 - min;
		let resultStr: string;
		if( dMin >= 1440 ){
			resultStr = Math.floor( dMin / 1440 ) + " " + MuLang.getText( "days" ) + " " + MuLang.getText( "ago" );
		}
		else if( dMin >= 60 ){
			resultStr = Math.floor( dMin / 60 ) + " " + MuLang.getText( "hours" ) + " " + MuLang.getText( "ago" );
		}
		else{
			resultStr = Math.floor( dMin ) + " " + MuLang.getText( "mins" ) + " " + MuLang.getText( "ago" );
		}
		return resultStr;
	}
}
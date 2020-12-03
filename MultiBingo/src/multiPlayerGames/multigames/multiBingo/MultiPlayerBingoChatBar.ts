class MultiPlayerBingoChatBar extends MultiChatBar{
	public constructor() {
		super();

		Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "3" ), 0, 0 );

		this.addScrollArea( new egret.Rectangle( 13, 0, 160, 205 ), new egret.Point( 0, 15 ) );
		this.addTextInput( new egret.Rectangle( 22, 240, 140, 18 ), 15 );

		this.cardCountTxt = MDS.addGameText( this, 35 - 1500, - 428, 48, 0xFFFFFF, "", false, 230 );
		this.playerCountTxt = MDS.addGameText( this, 230 - 1500, - 428, 48, 0xFFFFFF, "", false, 230 );

		this.avatarList = new MultiBingoAvatarArea;
		Com.addObjectAt( this, this.avatarList, 4, -50 );

		this.headSize = 36;
		this.lineGap = 5;
		this.tipPositionY = 22;
	}

	protected buildMessageItem( userName: string, message: string, tipBg: boolean, redBigTip: boolean ): egret.DisplayObjectContainer{
		let userInfo: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;

		let headIcon: egret.Bitmap = Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "head_icon" ), 0, 0 );
		headIcon.scaleX = headIcon.scaleY = 0.75;

		let nameTxt: egret.TextField = Com.addTextAt( userInfo, 40, 2 + BrowserInfo.textUp, 110, 11, 11 );
		nameTxt.textAlign = "left";
		nameTxt.textColor = 0;
		nameTxt.text = userName;

		if( tipBg ){
			Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "user_join" ), 40, 19 );
		}

		let tipTxt: egret.TextField = Com.addTextAt( userInfo, 42, this.tipPositionY + BrowserInfo.textUp, 110, 11, 11 );
		tipTxt.textAlign = "left";
		tipTxt.scaleX = 0.88;
		if( redBigTip ){
			tipTxt.textColor = 0xFF0000;
			tipTxt.height = 15;
			tipTxt.size = 15;
			tipTxt.bold = true;
		}
		else tipTxt.textColor = 0;
		tipTxt.text = message;
		if( tipTxt.textHeight > tipTxt.height ) tipTxt.height = tipTxt.textHeight;

		return userInfo;
	}
}
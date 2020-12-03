class MultiPlayerBingoChatBar extends MultiChatBar{
	public constructor() {
		super();

		Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "3" ), 0, 0 );

		this.addScrollArea( new egret.Rectangle( 28, 17, 385, 375 ), new egret.Point( 28, 17 ) );
		this.addTextInput( new egret.Rectangle( 50, 420, 340, 32 ), 32 );

		this.cardCountTxt = MDS.addGameText( this, 35 - 1500, - 428, 48, 0xFFFFFF, "", false, 230 );
		this.playerCountTxt = MDS.addGameText( this, 230 - 1500, - 428, 48, 0xFFFFFF, "", false, 230 );

		this.avatarList = new MultiBingoAvatarArea;
		Com.addObjectAt( this, this.avatarList, 6, -105 );

		this.headSize = 78;
		this.lineGap = 20;
		this.tipPositionY = 48;
	}

	protected buildMessageItem( userName: string, message: string, tipBg: boolean, redBigTip: boolean ): egret.DisplayObjectContainer{
		let userInfo: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;

		let headIcon: egret.Bitmap = Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "head_icon" ), 0, 0 );
		headIcon.scaleX = headIcon.scaleY = 78/166;

		let nameTxt: TextLabel = Com.addLabelAt( userInfo, 98, 0, 280, 25, 25 );
		nameTxt.textAlign = "left";
		nameTxt.textColor = 0;
		nameTxt.setText( userName );

		if( tipBg ){
			Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "user_join" ), 98, 38 );
		}

		let tipTxt: egret.TextField = Com.addTextAt( userInfo, 98, this.tipPositionY, 280, 25, 25 );
		tipTxt.textAlign = "left";
		tipTxt.scaleX = 0.88;
		if( redBigTip ){
			tipTxt.textColor = 0xFF0000;
			tipTxt.y = 36;
			tipTxt.height = 50;
			tipTxt.size = 50;
			tipTxt.bold = true;
		}
		else tipTxt.textColor = 0;
		tipTxt.text = message;
		if( tipTxt.textHeight > tipTxt.height ) tipTxt.height = tipTxt.textHeight;

		return userInfo;
	}
}
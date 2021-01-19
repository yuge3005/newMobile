class MultiPlayerBingoChatBar extends MultiChatBar{
	public constructor() {
		super();

		Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "3" ), 0, 0 );

		this.addScrollArea( new egret.Rectangle( 28, 17, 385, 375 ), new egret.Point( 28, 17 ) );
		this.addTextInput( new egret.Rectangle( 50, 420, 340, 32 ), 32 );

		this.avatarList = new MultiBingoAvatarArea;
		Com.addObjectAt( this, this.avatarList, 6, -105 );

		this.headSize = 78;
		this.lineGap = 20;
		this.tipPositionY = 48;
	}

	protected buildUserMessage( userName: string, message: string ): egret.DisplayObjectContainer{
		let userInfo: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		let headIcon: egret.Bitmap = this.getHead( userInfo );
		let nameTxt: TextLabel = this.getTitle( userInfo, userName );

		let tipTxt: egret.TextField = Com.addTextAt( userInfo, 98, this.tipPositionY, 280, 25, 25 );
		tipTxt.textAlign = "left";
		tipTxt.scaleX = 0.88;
		tipTxt.textColor = 0;
		tipTxt.text = message;
		if( tipTxt.textHeight > tipTxt.height ) tipTxt.height = tipTxt.textHeight;

		userInfo.cacheAsBitmap = true;
		return userInfo;
	}

	protected getHead( userInfo: egret.DisplayObjectContainer ): egret.Bitmap{
		let headIcon: egret.Bitmap = Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "head_icon" ), 0, 0 );
		headIcon.scaleX = headIcon.scaleY = 78/166;
		return headIcon;
	}

	protected getTitle( userInfo: egret.DisplayObjectContainer, userName: string ): TextLabel{
		let nameTxt: TextLabel = Com.addLabelAt( userInfo, 98, 0, 280, 25, 25 );
		nameTxt.textAlign = "left";
		nameTxt.textColor = 0;
		if( !userName ) userName = MuLang.getText( "guest" );
		nameTxt.setText( userName );
		return nameTxt;
	}

	protected buildJoinMessage( userName: string, joinInfo: string ): egret.DisplayObjectContainer{
		let userInfo: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		let headIcon: egret.Bitmap = this.getHead( userInfo );
		let nameTxt: TextLabel = this.getTitle( userInfo, userName );

		Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "user_join" ), 92, 38 );

		let tipTxt: TextLabel = Com.addLabelAt( userInfo, 102, 43, 130, 28, 28 );
		tipTxt.textColor = 0;
		tipTxt.setText( joinInfo );

		userInfo.cacheAsBitmap = true;
		return userInfo;
	}

	protected buildBingoMessage( userName: string, bingoTip: string ): egret.DisplayObjectContainer{
		let userInfo: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		let headIcon: egret.Bitmap = this.getHead( userInfo );
		let nameTxt: TextLabel = this.getTitle( userInfo, userName );

		let tipTxt: egret.TextField = Com.addTextAt( userInfo, 98, this.tipPositionY, 280, 25, 25 );
		tipTxt.textAlign = "left";
		tipTxt.scaleX = 0.88;
		tipTxt.textColor = 0xFF0000;
		tipTxt.y = 36;
		tipTxt.height = 50;
		tipTxt.size = 50;
		tipTxt.bold = true;
		tipTxt.text = bingoTip;

		userInfo.cacheAsBitmap = true;
		return userInfo;
	}

	public otherJoin( userName: string, fbId: string, userId: string ){
		super.otherJoin( userName, fbId, userId );

		( this.avatarList as MultiBingoAvatarArea ).userJoin( userId, fbId );
	}

	public updateCardAndPlayerNumbers( cardCount: number, playerCount: number, playerFbIds: Array<Object> ){
		super.updateCardAndPlayerNumbers( cardCount, playerCount, playerFbIds );

		this.cardCountTxt.setText( this.cardCountTxt.text + "  " + this.playerCountTxt.text );
		this.playerCountTxt.text = "";
	}
}
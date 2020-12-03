class MultiChatBar extends egret.DisplayObjectContainer{

	protected scrollArea: egret.ScrollView;
	protected scrollBar: egret.DisplayObjectContainer;

	protected enterText: eui.EditableText;

	protected leftMargin: number = 15;
	protected headSize: number;
	protected lineGap: number;
	protected tipPositionY: number;

	protected cardCountTxt: TextLabel;
	protected playerCountTxt: TextLabel;

	protected avatarList: AvatarContainer;

	public constructor() {
		super();
	}

	protected addScrollArea( maskRect: egret.Rectangle, startPoint: egret.Point ){
		this.scrollArea = new egret.ScrollView;
		this.scrollArea.width = maskRect.width;
		this.scrollArea.height = maskRect.height;
		Com.addObjectAt( this, this.scrollArea, startPoint.x, startPoint.y );
		this.scrollBar = new egret.DisplayObjectContainer;
		this.scrollArea.setContent( this.scrollBar );
	}

	protected addTextInput( textRect: egret.Rectangle, size: number ){
		this.enterText = new eui.EditableText;
		this.enterText.width = textRect.width;
		this.enterText.height = textRect.height;
		this.enterText.size = size;
		this.enterText.textAlign = "center";
		this.enterText.verticalAlign = "middle";
		this.enterText.multiline = true;
		this.enterText.prompt = MuLang.getText( "enter_text" );
		this.enterText.promptColor = 0xFFFFFF;
		Com.addObjectAt( this, this.enterText, textRect.x, textRect.y );
		this.enterText.addEventListener( egret.Event.CHANGE, this.onTxtChang, this);
	}

	protected onTxtChang( event: egret.Event ){
		let str: string = this.enterText.text;
		let multilineIndex: number = str.indexOf( "\n" );
		if( multilineIndex >= 0 ){
			this.enterText.text = "";
			str = str.substring( 0, multilineIndex );
			MultiServer.sendChatMessage( str );
		}
	}

	protected resetScroll(){
		if( this.scrollBar.height > this.scrollArea.height ) this.scrollArea.scrollTop = this.scrollBar.height - this.scrollArea.height;
	}

	protected get scrollHeight(): number{
		if( this.scrollBar.numChildren ) return this.scrollBar.height + this.lineGap;
		else return 0;
	}

	public roundOver(){
		let roundOverInfo: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		Com.addObjectAt( this.scrollBar, roundOverInfo, this.leftMargin, this.scrollHeight );
		let headIcon: egret.Bitmap = Com.addBitmapAt( roundOverInfo, MultiPlayerMachine.getAssetStr( "round_over" ), 0, 0 );
		let tipTxt: TextLabel = Com.addLabelAt( roundOverInfo, 70, 22, 160, 24, 24 );
		tipTxt.textColor = 0;
		tipTxt.setText( MuLang.getText( "round_over" ) );
		roundOverInfo.cacheAsBitmap = true;
		this.resetScroll();
	}

	public roundStart(){
		let roundStartInfo: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		Com.addObjectAt( this.scrollBar, roundStartInfo, this.leftMargin, this.scrollHeight );
		let headIcon: egret.Bitmap = Com.addBitmapAt( roundStartInfo, MultiPlayerMachine.getAssetStr( "round_start" ), 0, 0 );
		let tipTxt: TextLabel = Com.addLabelAt( roundStartInfo, 70, 22, 160, 24, 24 );
		tipTxt.textColor = 0;
		tipTxt.setText( MuLang.getText( "round_start" ) );
		roundStartInfo.cacheAsBitmap = true;
		this.resetScroll();
	}

	public otherJoin( userName: string, fbId: string ){
		trace( userName + "join game" );
		this.showUserMessage( userName, MuLang.getText( "join_game" ), fbId, true );
		this.resetScroll();
	}

	public userMessage( userName: string, message: string, fbId: string ){
		trace( userName + " says:" + message );
		this.showUserMessage( userName, message, fbId );
		this.resetScroll();
	}

	public showUserMessage( userName: string, message: string, fbId: string, tipBg: boolean = false, redBigTip: boolean = false ){
		let userInfo: egret.DisplayObjectContainer = this.buildMessageItem( userName, message, tipBg, redBigTip );
		Com.addObjectAt( this.scrollBar, userInfo, this.leftMargin, this.scrollHeight );

		if( fbId != "" ) Utils.downloadBitmapDataByFacebookID( fbId, 50, 50, MDS.onUserHeadLoaded.bind( this, userInfo.getChildAt( 0 ), this.headSize ), this );
	}

	protected buildMessageItem( userName: string, message: string, tipBg: boolean, redBigTip: boolean ): egret.DisplayObjectContainer{
		return  new egret.DisplayObjectContainer;
	}

	public updateCardAndPlayerNumbers( cardCount: number, playerCount: number, playerFbIds: Array<Object> ){
		this.cardCountTxt.setText( cardCount + " " + MuLang.getText( "cards", MuLang.CASE_UPPER ) );
		this.playerCountTxt.setText( playerCount + " " + MuLang.getText( "players", MuLang.CASE_UPPER ) );

		if( playerFbIds ){
			this.avatarList.updataList( playerFbIds );
		}
	}

	public showBingoPlayerName( userName: string, fbId: string ){
		this.showUserMessage( userName, "BINGO", fbId, false, true );
		this.resetScroll();
	}
}
class MaraChatBar extends MultiChatBar{

	private slider: MaraChatSlider;
	private sliderDraging: boolean;

	private nextRoundBar: MaraChatNextRound;

	public constructor() {
		super();

		Com.addBitmapAt( this, "mara_chat_box_json.frame", 0, 0 );

		this.addScrollArea( new egret.Rectangle( 0, 0, 381, 276 ), new egret.Point( 13, 65 ) );
		this.addTextInput( new egret.Rectangle( 30, 400, 250, 40 ), 28 );
		this.enterText.textColor = 0;
		this.enterText.promptColor = 0;
		this.enterText.textAlign = "left";

		let sendBtn: TouchDownButton = Com.addDownButtonAt( this, "mara_chat_box_json.Send out", "mara_chat_box_json.Send out", 300, 382, this.onSendOutButton.bind(this), true );
		let tx: TextLabel = Com.addLabelAt( sendBtn, 0, 0, 170, 82, 50 );
		sendBtn.addChild( tx );
		tx.bold = true;
		tx.scaleX = 0.81;
		tx.setText( MuLang.getText( "send", MuLang.CASE_UPPER ) );

		this.headSize = 60;
		this.lineGap = 2;
		this.tipPositionY = 45;
		this.leftMargin = 0;

		this.slider = new MaraChatSlider;
		Com.addObjectAt( this, this.slider, 397, 73 );
		this.slider.addEventListener( "startDrag", this.startDrag, this );
		this.slider.addEventListener( "stopDrag", this.stopDrag, this );
		this.slider.addEventListener( "sliderPosition", this.sliderScroll, this );

		this.nextRoundBar = new MaraChatNextRound;
		Com.addObjectAt( this, this.nextRoundBar, -36, -192 );

		let userInfo: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		Com.addBitmapAt( userInfo, "mara_" + MuLang.language + "_json.welcome", 0, 0 );
		Com.addObjectAt( this.scrollBar, userInfo, this.leftMargin, this.scrollHeight );
	}

	private startDrag( event: Event ){
		this.sliderDraging = true;
	}

	private stopDrag( event: Event ){
		this.sliderDraging = false;
	}

	private sliderScroll( event: Event ){
		if( this.scrollBar.height > this.scrollArea.height ){
			this.scrollArea.scrollTop = ( this.scrollBar.height - this.scrollArea.height ) * this.slider.sliderPosition;
		}
	}

	protected resetScroll(){
		if( this.sliderDraging ) return;
		super.resetScroll();
		this.slider.setScrollSlider( this.scrollBar.height, this.scrollArea.height );
	}

	private onSendOutButton( event: egret.TouchEvent ){
		if( this.enterText.text == this.enterText.prompt || this.enterText.text == "" ) return;
		this.enterText.text += "\n";
		this.onTxtChang( event );
	}

	protected buildUserMessage( userName: string, message: string ): egret.DisplayObjectContainer{
		let userInfo: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		let headIcon: egret.Bitmap = this.getHead( userInfo );
		let nameTxt: TextLabel = this.getTitle( userInfo, userName );

		let tipTxt: egret.TextField = Com.addTextAt( userInfo, 91, this.tipPositionY, 280, 25, 25 );
		tipTxt.textAlign = "left";
		tipTxt.scaleX = 0.88;
		tipTxt.textColor = 0;
		tipTxt.text = message;
		if( tipTxt.textHeight > tipTxt.height ) tipTxt.height = tipTxt.textHeight;

		userInfo.cacheAsBitmap = true;
		return userInfo;
	}

	protected getHead( userInfo: egret.DisplayObjectContainer ): egret.Bitmap{
		let headIcon: egret.Bitmap = Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "head_icon" ), 12, 13 );
		headIcon.width = 60
		headIcon.height = 55;
		Com.addBitmapAt( userInfo, "mara_chat_box_json.Head frame", 5, 0 );
		return headIcon;
	}

	protected getTitle( userInfo: egret.DisplayObjectContainer, userName: string ): TextLabel{
		let nameTxt: TextLabel = Com.addLabelAt( userInfo, 91, 10, 250, 30, 30, false, true );
		nameTxt.textAlign = "left";
		nameTxt.textColor = 0;
		if( !userName ) userName = MuLang.getText( "guest" ) + PlayerConfig.player( "user.id" ).substr(-4);
		nameTxt.setText( userName );
		return nameTxt;
	}

	protected buildJoinMessage( userName: string, joinInfo: string ): egret.DisplayObjectContainer{
		let userInfo: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		let headIcon: egret.Bitmap = this.getHead( userInfo );
		let nameTxt: TextLabel = this.getTitle( userInfo, userName );

		Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "user_join" ), 40, 19 );

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

		let tipTxt: egret.TextField = Com.addTextAt( userInfo, 91, this.tipPositionY, 280, 25, 25 );
		tipTxt.textAlign = "left";
		tipTxt.scaleX = 0.88;
		tipTxt.textColor = 0xFF0000;
		tipTxt.height = 15;
		tipTxt.size = 15;
		tipTxt.bold = true;
		tipTxt.text = bingoTip;

		userInfo.cacheAsBitmap = true;
		return userInfo;
	}

	public resetNextPrize( prize: number ){
		this.nextRoundBar.setPrize( prize );
	}

	public showBingoPlayerName( userName: string, fbId: string ){
		let userInfo: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		let headIcon: egret.Bitmap = Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "head_icon" ), 12, 13 );
		headIcon.width = 60
		headIcon.height = 55;
		Com.addBitmapAt( userInfo, "mara_chat_box_json.Head frame", 5, 0 );
		Com.addObjectAt( this.scrollBar, userInfo, this.leftMargin, this.scrollHeight );
		if( fbId != "" ) FacebookBitmap.downloadBitmapDataByFacebookID( fbId, 50, 50, MDS.onUserHeadLoaded.bind( this, headIcon, this.headSize ), this );

		let tipTxt: TextLabel = Com.addLabelAt( userInfo, 95, 22, 142, 32, 32 );
		tipTxt.textAlign = "left";
		tipTxt.bold = true;
		tipTxt.scaleX = 0.88;
		tipTxt.textColor = 0;
		tipTxt.setText( userName );

		this.resetScroll();

		let bingoBg: egret.Bitmap;
		if( Mara.durringSpecial ){
			bingoBg = Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "bingo_city_of_light" ), 0, 0 );
		}
		else{
			let isTopThree: boolean = ( this.avatarList as MaraAvatarArea ).showHead( fbId );
			if( isTopThree ) bingoBg = Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "bingo_1st-3rd" ), 0, 0 );
			else bingoBg = Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "player_bingo" ), 0, 0 );
		}
		userInfo.addChildAt( bingoBg, 0 );
		userInfo.cacheAsBitmap = true;
	}

	public otherJoin( userName: string, fbId: string, userId: string ){
	}

	public roundStart(){
		let headIcon: egret.Bitmap = Com.addBitmapAt( this.scrollBar, "mara_" + MuLang.language + "_json.round_start" , this.leftMargin, this.scrollHeight );
		this.resetScroll();
		( this.avatarList as MaraAvatarArea ).clearHead();
	}

	public roundOver(){
		let headIcon: egret.Bitmap = Com.addBitmapAt( this.scrollBar, "mara_" + MuLang.language + "_json.round_over" , this.leftMargin, this.scrollHeight );
		this.resetScroll();
	}

	public specialUI(){
		egret.Tween.removeTweens(this.nextRoundBar);
		TweenerTool.tweenTo( this.nextRoundBar, { x: 520 }, 800 );
	}

	public normalUI(){
		egret.Tween.removeTweens(this.nextRoundBar);
		TweenerTool.tweenTo( this.nextRoundBar, { x: 0 }, 800 );
	}
}
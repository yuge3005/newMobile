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

		this.cardCountTxt = Com.addLabelAt( this, -1329, -453, 225, 40, 40 );
		this.cardCountTxt.textAlign = "left";
		this.cardCountTxt.fontFamily = "Arial";
		this.cardCountTxt.bold = true;
		this.cardCountTxt.scaleX = 0.75;
		this.playerCountTxt = Com.addLabelAt( this, -1329, -410, 225, 40, 40 );
		this.playerCountTxt.textAlign = "left";
		this.playerCountTxt.fontFamily = "Arial";
		this.playerCountTxt.bold = true;
		this.playerCountTxt.scaleX = 0.75;

		this.avatarList = new MaraAvatarArea;
		Com.addObjectAt( this, this.avatarList, 4, -158 );

		this.headSize = 61;
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

	protected buildMessageItem( userName: string, message: string, tipBg: boolean, redBigTip: boolean ): egret.DisplayObjectContainer{
		let userInfo: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;

		let headIcon: egret.Bitmap = Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "head_icon" ), 11, 10 );
		headIcon.width = 61
		headIcon.height = 52;
		Com.addBitmapAt( userInfo, "mara_chat_box_json.Head frame", 5, 0 );

		let nameTxt: TextLabel = Com.addLabelAt( userInfo, 91, 10, 250, 30, 30, false, true );
		nameTxt.textAlign = "left";
		nameTxt.textColor = 0;
		nameTxt.setText( userName );

		if( tipBg ){
			Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "user_join" ), 40, 19 );
		}

		let tipTxt: egret.TextField = Com.addTextAt( userInfo, 91, this.tipPositionY, 280, 25, 25 );
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

		userInfo.cacheAsBitmap = true;
		return userInfo;
	}

	public resetNextPrize( prize: number ){
		this.nextRoundBar.setPrize( prize );
	}

	public showBingoPlayerName( userName: string, fbId: string ){
		let userInfo: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		let headIcon: egret.Bitmap = Com.addBitmapAt( userInfo, MultiPlayerMachine.getAssetStr( "head_icon" ), 5, 3 );
		headIcon.scaleX = 28/31;
		headIcon.scaleY = 28/36;
		Com.addBitmapAt( userInfo, "mara_chat_box_json.Head frame", 2, -2 );
		Com.addObjectAt( this.scrollBar, userInfo, this.leftMargin, this.scrollHeight );
		if( fbId != "" ) Utils.downloadBitmapDataByFacebookID( fbId, 50, 50, MDS.onUserHeadLoaded.bind( this, headIcon, this.headSize ), this );

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

	public otherJoin( userName: string, fbId: string ){

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
		TweenerTool.tweenTo( this.nextRoundBar, { x: 200 }, 800 );
		this.avatarList.visible = false;
	}

	public normalUI(){
		egret.Tween.removeTweens(this.nextRoundBar);
		TweenerTool.tweenTo( this.nextRoundBar, { x: 0 }, 800 );
		this.avatarList.visible = true;
	}

	public setTmocb( tmocb: Array<number> ){
		( this.avatarList as MaraAvatarArea ).setTmocb( tmocb );
	}
}
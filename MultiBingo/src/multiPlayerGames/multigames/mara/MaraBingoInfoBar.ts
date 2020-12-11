class MaraBingoInfoBar extends MultyBingoInfoBar{
	
	private bgLight: egret.Bitmap;
	private bgTip: egret.DisplayObjectContainer;

	private awardLayer: egret.DisplayObjectContainer;
	private awardText: egret.TextField;
	private bingoTxt: egret.TextField;
	private specialHead: egret.Bitmap;
	private specialHeadFrame: egret.Bitmap;

	public constructor() {
		super();

		this.bgLight = Com.addBitmapAt( this, "mara_chat_box_json.light", 60, 0 );
		this.bgTip = new egret.DisplayObjectContainer;
		Com.addBitmapAt( this.bgTip, "mara_chat_box_json.number of people", 102, 0 );
		let txCity: TextLabel = MDS.addGameText( this.bgTip, 132, 90, 60, 0xffb500, "City of Light", false, 400 );
		txCity.textAlign = "center";
		txCity.fontFamily = "Righteous";
		txCity.filters = [ new egret.DropShadowFilter( 3, 135, 0, 0.5, 4, 4, 2, 1 ) ];
		txCity.setText( txCity.text.toUpperCase() );
		this.addChildAt( this.bgLight, 0 );
		this.addChildAt( Com.addBitmapAt( this, "mara_chat_box_json.photo frame", 0, 0 ), 0 );
		this.addChildAt( this.bgTip, 0 );
		this.bgLight.alpha = 0;

		this.awardLayer = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.awardLayer, 0, 0 );
		let coin: egret.Bitmap = Com.addBitmapAtMiddle( this.awardLayer, MultiPlayerMachine.getAssetStr( "coin_big" ), 134, 100 );
		coin.scaleX = coin.scaleY = 1.6;
		this.awardText = Com.addTextAt( this.awardLayer, 180, 80, 200, 45, 45 );
		this.awardText.textAlign = "left";
		this.awardText.fontFamily = "Righteous";
		this.awardText.text = Utils.formatCoinsNumber( 1000 );
		this.awardText.filters = [ new egret.DropShadowFilter( 3, 45, 0, 0.5, 4, 4, 2, 1 ) ];

		this.patternColor = 0xFDBA2A;

		this.specialHead = Com.addBitmapAt( this,  "mara_chat_box_json.photo Head frame", 152, 45 );
		this.specialHeadFrame = Com.addBitmapAt( this,  "mara_chat_box_json.Head frame2", 118, 22 );
		this.specialHead.visible = this.specialHeadFrame.visible = false;

		this.paytableUILayer.x = 400;
		this.paytableUILayer.y = 22;
	}

	protected addFixText(){
		this.bingoTxt = Com.addTextAt( this, 143, 22, 170, 45, 45 );
		this.bingoTxt.textAlign = "left";
		this.bingoTxt.bold = true;
		this.bingoTxt.fontFamily = "Righteous";
		this.bingoTxt.text = "BINGO";
		this.bingoTxt.textColor = 0xEEFFFF;
		this.bingoTxt.filters = [ new egret.DropShadowFilter( 3, 45, 0, 0.5, 4, 4, 2, 1 ) ];

		this.bingoLeftTxt = Com.addTextAt( this, 90, 22, 40, 45, 45 );
		this.bingoLeftTxt.textAlign = "right";
		this.bingoLeftTxt.bold = true;
		this.bingoLeftTxt.fontFamily = "Righteous";
		this.bingoLeftTxt.textColor = 0xEEFFFF;
		this.bingoLeftTxt.filters = [ new egret.DropShadowFilter( 3, 45, 0, 0.5, 4, 4, 2, 1 ) ];
	}

	protected showCurrentPattern( ptIndex: number ){
		let rule: string = this.currentPaytableRules[ptIndex];
		GraphicTool.drawRect( this.paytableUILayer, new egret.Rectangle( 0, 0, 90, 90 ), 0x0C303B, true );
		for( let i: number = 0; i < rule.length; i++ ){
			let str: String = rule.charAt(i);
			if( str == "1" ){
				GraphicTool.drawRect( this.paytableUILayer, new egret.Rectangle( i % 5 * 18 + 1, Math.floor( i / 5 ) * 18 + 1, 16, 16 ), this.patternColor );
			}
			else{
				GraphicTool.drawRect( this.paytableUILayer, new egret.Rectangle( i % 5 * 18 + 1, Math.floor( i / 5 ) * 18 + 1, 16, 16 ), 0x1E3C47 );
			}
		}
	}

	public resetPrize( num: number, normal: boolean = true ){
		this.awardText.textColor = normal ? 0xFFFFFF : 0xEFE29D;
		this.awardText.text = Utils.formatCoinsNumber( num );
	}

	public specialUI(){
		egret.Tween.removeTweens(this.bgTip);
		TweenerTool.tweenTo( this.bgTip, { y: 184 }, 500, 100, null, { y: 0 } );
		egret.Tween.removeTweens(this.bgLight);
		TweenerTool.tweenTo( this.bgLight, { alpha: 1 }, 500, 100, null, { y: 0 } );
		this.awardLayer.y = 90;
		this.bingoTxt.visible = false;
		this.bingoLeftTxt.visible = false;

		this.specialHead.visible = true;
		this.specialHeadFrame.visible = true;
	}

	public normalUI(){
		egret.Tween.removeTweens(this.bgTip);
		TweenerTool.tweenTo( this.bgTip, { y: 0 }, 500, 100 );
		egret.Tween.removeTweens(this.bgLight);
		TweenerTool.tweenTo( this.bgLight, { alpha: 0 }, 500, 100 );
		this.awardLayer.y = 0;
		this.bingoTxt.visible = true;
		this.bingoLeftTxt.visible = true;

		this.specialHead.visible = false;
		this.specialHeadFrame.visible = false;
	}
}
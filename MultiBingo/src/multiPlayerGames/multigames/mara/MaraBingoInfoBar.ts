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

		this.bgLight = Com.addBitmapAt( this, "mara_chat_box_json.light", -18, -7 );
		this.bgTip = new egret.DisplayObjectContainer;
		Com.addBitmapAt( this.bgTip, "mara_chat_box_json.number of people", 3, 0 );
		Com.addBitmapAtMiddle( this.bgTip, "mara_" + MuLang.language + "_json.city_big", 90, 56 );
		this.addChildAt( this.bgLight, 0 );
		this.addChildAt( Com.addBitmapAt( this, "mara_chat_box_json.photo frame", -40, -8 ), 0 );
		this.addChildAt( this.bgTip, 0 );
		this.bgLight.alpha = 0;

		this.awardLayer = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.awardLayer, 0, 25 );
		Com.addBitmapAt( this.awardLayer, MultiPlayerMachine.getAssetStr( "coin" ), 0, 0 );
		this.awardText = Com.addTextAt( this.awardLayer, 35, 4, 200, 19, 19 );
		this.awardText.textAlign = "left";
		this.awardText.fontFamily = "Righteous";
		this.awardText.text = Utils.formatCoinsNumber( 1000 );
		this.awardText.filters = [ new egret.DropShadowFilter( 3, 45, 0, 0.5, 4, 4, 2, 1 ) ];

		this.patternColor = 0xFDBA2A;

		this.specialHead = Com.addBitmapAt( this,  "mara_chat_box_json.photo Head frame", 16, 12 );
		this.specialHeadFrame = Com.addBitmapAt( this,  "mara_chat_box_json.Head frame2", 0, 3 );
		this.specialHead.visible = this.specialHeadFrame.visible = false;

		this.paytableUILayer.y = 3;
	}

	protected addFixText(){
		this.bingoTxt = Com.addTextAt( this, 20, 5, 75, 18, 18 );
		this.bingoTxt.bold = true;
		this.bingoTxt.fontFamily = "Righteous";
		this.bingoTxt.text = "BINGO";
		this.bingoTxt.filters = [ new egret.DropShadowFilter( 3, 45, 0, 0.5, 4, 4, 2, 1 ) ];

		this.bingoLeftTxt = Com.addTextAt( this, 5, 5, 35, 18, 18 );
		this.bingoLeftTxt.textAlign = "left";
		this.bingoLeftTxt.bold = true;
		this.bingoLeftTxt.fontFamily = "Righteous";
		this.bingoLeftTxt.filters = [ new egret.DropShadowFilter( 3, 45, 0, 0.5, 4, 4, 2, 1 ) ];
	}

	protected showCurrentPattern( ptIndex: number ){
		let rule: string = this.currentPaytableRules[ptIndex];
		GraphicTool.drawRect( this.paytableUILayer, new egret.Rectangle( 0, 0, 56, 51 ), 0x0C303B, true );
		for( let i: number = 0; i < rule.length; i++ ){
			let str: String = rule.charAt(i);
			if( str == "1" ){
				GraphicTool.drawRect( this.paytableUILayer, new egret.Rectangle( i % 5 * 11 + 1, Math.floor( i / 5 ) * 10 + 1, 10, 9 ), this.patternColor );
			}
			else{
				GraphicTool.drawRect( this.paytableUILayer, new egret.Rectangle( i % 5 * 11 + 1, Math.floor( i / 5 ) * 10 + 1, 10, 9 ), 0x1E3C47 );
			}
		}
	}

	public resetPrize( num: number, normal: boolean = true ){
		this.awardText.textColor = normal ? 0xFFFFFF : 0xEFE29D;
		this.awardText.text = Utils.formatCoinsNumber( num );
	}

	public specialUI(){
		egret.Tween.removeTweens(this.bgTip);
		TweenerTool.tweenTo( this.bgTip, { y: 66 }, 500, 100, null, { y: 0 } );
		egret.Tween.removeTweens(this.bgLight);
		TweenerTool.tweenTo( this.bgLight, { alpha: 1 }, 500, 100, null, { y: 0 } );
		this.awardLayer.y = 65;
		this.bingoTxt.visible = false;
		this.bingoLeftTxt.visible = false;

		this.specialHead.visible = true;
		this.specialHead.width = this.specialHead.height = 44;
		this.specialHeadFrame.visible = true;
	}

	public normalUI(){
		egret.Tween.removeTweens(this.bgTip);
		TweenerTool.tweenTo( this.bgTip, { y: 0 }, 500, 100 );
		egret.Tween.removeTweens(this.bgLight);
		TweenerTool.tweenTo( this.bgLight, { alpha: 0 }, 500, 100 );
		this.awardLayer.y = 25;
		this.bingoTxt.visible = true;
		this.bingoLeftTxt.visible = true;

		this.specialHead.visible = false;
		this.specialHeadFrame.visible = false;
	}
}
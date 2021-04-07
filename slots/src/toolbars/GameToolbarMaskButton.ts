class GameToolbarMaskButton extends TouchDownButton{

	private maskBit: egret.Bitmap;
	private scrollLayer: egret.DisplayObjectContainer;
	private priceText: TextLabel;
	private freeText: TextLabel;
	private icon: egret.Bitmap;

	private stayTime: number = 2500;
	private moveTime: number = 800;

	private textColor: number;

	public constructor( assetsString: string, textColor: number ) {
		super( assetsString, assetsString );

		this.maskBit = Com.addBitmapAt( this, assetsString, 0, 0 );
		this.mask = this.maskBit;

		this.scrollLayer = new egret.DisplayObjectContainer;
		this.addChild( this.scrollLayer );

		this.textColor = textColor;
	}

	public addButtonBigText( size: number, text: string ){
		this.buildBigText( size, text );
		let txt: TextLabel = this.buildBigText( size, text );
		txt.y = - this.mask.height * 2;
	}

	private buildBigText( size: number, text: string ): TextLabel{
		let txt: TextLabel = Com.addLabelAt( this.scrollLayer, 10, 0, this.width - 20, this.mask.height, size );
		txt.fontFamily = "Righteous";
		txt.textColor = this.textColor;
		txt.setText( MuLang.getText(text, MuLang.CASE_UPPER) );
		return txt;
	}

	public addButtonSmallText( size: number ){
		this.priceText = this.buildBigText( size, "" );
		this.priceText.y = -150;
		this.freeText = this.buildBigText( size, "free" );
		this.freeText.y = -175;
		this.freeText.visible = false;
	}

	public setIcon( assetName: string ){
		this.icon = Com.addBitmapAt( this.scrollLayer, "bingoGameToolbar_json." + assetName, 0, 0 );
		this.icon.x = this.maskBit.width - this.icon.width >> 1;
		this.icon.y = -87 - this.icon.height;
	}

	public setPrice( price: number ){
		this.priceText.setText( price + "" );
		egret.Tween.removeTweens( this.scrollLayer );
		this.scrollLayer.y = 0;
		TweenerTool.tweenTo( this.scrollLayer, { y: this.maskBit.height }, this.moveTime, this.stayTime, this.extraStep1.bind(this), null, egret.Ease.backInOut );
		this.icon.visible = this.priceText.visible = price > 0;
		this.freeText.visible = !this.icon.visible;
	}

	private extraStep1(){
		TweenerTool.tweenTo( this.scrollLayer, { y: this.maskBit.height * 2 }, this.moveTime, this.stayTime, this.extraStep2.bind(this), null, egret.Ease.backInOut );
	}

	private extraStep2(){
		this.scrollLayer.y = 0;
		TweenerTool.tweenTo( this.scrollLayer, { y: this.maskBit.height }, this.moveTime, this.stayTime, this.extraStep1.bind(this), null, egret.Ease.backInOut );
	}
}
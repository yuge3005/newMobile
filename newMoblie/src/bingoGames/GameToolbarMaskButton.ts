class GameToolbarMaskButton extends TouchDownButton{

	private maskBit: egret.Bitmap;
	private scrollLayer: egret.DisplayObjectContainer;
	private priceText: TextLabel;

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
		txt.setText( MuLang.getText(text) );
		return txt;
	}

	public addButtonSmallText( size: number ){
		this.priceText = this.buildBigText( size, "" );
		this.priceText.y = -150;
	}

	public setIcon( assetName: string ){
		let icon: egret.Bitmap = Com.addBitmapAt( this.scrollLayer, "bingoGameToolbar_json." + assetName, 0, 0 );
		icon.x = this.maskBit.width - icon.width >> 1;
		icon.y = -87 - icon.height;
	}

	public setPrice( price: number ){
		this.priceText.setText( price + "" );
		egret.Tween.removeTweens( this.scrollLayer );
		this.scrollLayer.y = 0;
		TweenerTool.tweenTo( this.scrollLayer, { y: this.maskBit.height }, this.moveTime, this.stayTime, this.extraStep1.bind(this), null, egret.Ease.backInOut );
	}

	private extraStep1(){
		TweenerTool.tweenTo( this.scrollLayer, { y: this.maskBit.height * 2 }, this.moveTime, this.stayTime, this.extraStep2.bind(this), null, egret.Ease.backInOut );
	}

	private extraStep2(){
		this.scrollLayer.y = 0;
		TweenerTool.tweenTo( this.scrollLayer, { y: this.maskBit.height }, this.moveTime, this.stayTime, this.extraStep1.bind(this), null, egret.Ease.backInOut );
	}
}
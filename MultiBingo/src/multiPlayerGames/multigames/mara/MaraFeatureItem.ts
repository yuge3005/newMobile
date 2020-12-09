class MaraFeatureItem extends egret.DisplayObjectContainer{

	public featureName: string;
	private type: string;
	private price: number;

	public buyButton: TouchDownButton;
	private priceTx: egret.TextField;
	private priceIcon: egret.Bitmap;

	public constructor( obj: Object ) {
		super();

		this.featureName = obj["name"];
		Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "icon_" + this.featureName ), 53, -7 );

		Com.addDownButtonAt( this, MultiPlayerMachine.getAssetStr( "buySkill" ), MultiPlayerMachine.getAssetStr( "buySkill" ), 106, 81, this.onTap.bind(this), true );

		this.type = obj["type"];
		let typeIcon: string;
		if( this.type == "coins" ) typeIcon = "coin_big";
		else if( this.type == "hard_currency" ){
			 this.type = "dinero";
			 typeIcon = "dinero_big";
		}
		else{
			typeIcon = "dinero_big";
			console.error( "typeError" );
		}

		this.price = obj["price"];
		this.priceTx = Com.addTextAt( this, 176, 92, 55, 28, 28, false, true );
		this.priceTx.textColor = 0;
		this.priceTx.scaleX = 0.8;
		this.priceTx.text = "" + this.price * Mara.betStep;

		this.priceIcon = Com.addBitmapAtMiddle( this, MultiPlayerMachine.getAssetStr( typeIcon ), 150, 105 );
		if( this.type == "dinero" ) this.priceIcon.rotation = -20;

		let featureNameTxt: TextLabel = Com.addLabelAt( this, 160, 20, 140, 48, 36 );
		featureNameTxt.bold = true;
		featureNameTxt.verticalAlign = "middle";
		featureNameTxt.setText( MuLang.getText( this.featureName, MuLang.CASE_UPPER ).replace( " ", "\n" ) );

		this.buyButton = Com.addDownButtonAt( this, MultiPlayerMachine.getAssetStr( "tips" ), MultiPlayerMachine.getAssetStr( "tips" ), -3, 3, this.onTip.bind(this), true );
	}

	private onTap( event: egret.TouchEvent ){
		let ev: egret.Event = new egret.Event( "featureEvent" );
		ev.data = { name: this.featureName, type: this.type, price: this.price * Mara.betStep };
		this.dispatchEvent( ev );
	}

	private onTip( event: egret.TouchEvent ){
		let ev: egret.Event = new egret.Event( "featureTip" );
		ev.data = { name: this.featureName };
		this.dispatchEvent( ev );
	}

	public betStepPrice(){
		this.priceTx.text = "" + this.price * Mara.betStep;
		this.priceIcon.x = 45 + ( 45 - this.priceTx.textWidth ) * 0.4;
	}
}
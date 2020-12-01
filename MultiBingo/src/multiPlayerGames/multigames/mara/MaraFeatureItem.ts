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
		Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "icon_" + this.featureName ), 28, 6 );

		Com.addDownButtonAt( this, MultiPlayerMachine.getAssetStr( "buySkill" ), MultiPlayerMachine.getAssetStr( "buySkill" ), 45, 40, this.onTap.bind(this), true );

		this.type = obj["type"];
		let typeIcon: string;
		if( this.type == "coins" ) typeIcon = "coin";
		else if( this.type == "hard_currency" ){
			 this.type = "dinero";
			 typeIcon = "green";
		}
		else{
			typeIcon = "green";
			console.error( "typeError" );
		}

		this.price = obj["price"];
		this.priceTx = Com.addTextAt( this, 70, 44 + BrowserInfo.textUp, 45, 15, 15, false, true );
		this.priceTx.textColor = 0;
		this.priceTx.scaleX = 0.8;
		this.priceTx.text = "" + this.price * Mara.betStep;

		this.priceIcon = Com.addBitmapAt( this, "mara_idle_json." + typeIcon, 45 + ( 45 - this.priceTx.textWidth ) * 0.4, 45 );

		let featureNameTxt: egret.TextField = Com.addTextAt( this, 80, 12, 180, 25, 12 );
		featureNameTxt.bold = true;
		featureNameTxt.scaleX = 0.7;
		featureNameTxt.textAlign = "left";
		featureNameTxt.verticalAlign = "middle";
		featureNameTxt.text = MuLang.getText( this.featureName, MuLang.CASE_UPPER ).replace( " ", "\n" );

		this.buyButton = Com.addDownButtonAt( this, MultiPlayerMachine.getAssetStr( "tips" ), MultiPlayerMachine.getAssetStr( "tips" ), 0, 0, this.onTip.bind(this), true );
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
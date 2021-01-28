class MissionProcessUI extends egret.DisplayObjectContainer{

	private missionProcessBar: egret.Bitmap;
	private missionProcessTx: egret.TextField;

	private fullLight: egret.Bitmap;
	private bookOutlight: egret.Bitmap;
	
	public constructor() {
		super();

		this.missionProcessBar = Com.addBitmapAt( this, "missionBar_json.mission_bar", 41, 25 );
		this.missionProcessTx = Com.addLabelAt( this, 115, 27, 180, 40, 27, true, true );
		this.missionProcessTx.stroke = 2;
		this.missionProcessTx.fontFamily = "Righteous";
	}

	public setProcess( process: number ){
		this.missionProcessBar.mask = new egret.Rectangle( 0, 0, this.missionProcessBar.width * process, this.missionProcessBar.height );

		if( process == 1 ){
			this.missionProcessTx.text = MuLang.getText( "collect" );

			if( !this.fullLight ) {
				this.fullLight = Com.addBitmapAt( this, "missionBar_json.mission_btn_white", 0, 0 );
				this.bookOutlight = Com.addBitmapAt( this, "missionBar_json.mission_icon_outlight", 5, -9 );
				this.fullLight.alpha = 0;
				TweenerTool.tweenTo( this.fullLight, { alpha: 1 }, 1000, 0, this.alphaLight.bind( this ) );
			}
		}
		else{
			this.missionProcessTx.text = ( process * 100 ).toFixed( 1 ) + "%";
		}
	}

	private alphaLight(){
		TweenerTool.tweenTo( this.fullLight, { alpha: ( this.fullLight.alpha > 0.7 ? 0.5 : 1 ) }, 500, 0, this.alphaLight.bind( this ) );
	}
}
class TounamentLayer extends egret.DisplayObjectContainer{

	private outBar: egret.DisplayObjectContainer;

	public constructor( data: ITounamentData ) {
		super();

		let tmBg: egret.Bitmap = Com.addBitmapAt( this, "tounament_json.ranking_bg", 0, 0 );
		tmBg.width = 235;
		tmBg.height = 385;
		Com.addBitmapAtMiddle( this, "tounament_json.ranking_" + MuLang.language, 117, 36 );
		let barBg: egret.Bitmap = Com.addBitmapAt( this, "tounament_json.ranking_" + MuLang.language, 10, 235 );
		barBg.scale9Grid = new egret.Rectangle( 10, 10, 182, 24 );
		barBg.width = 212;

		let prizeBg: egret.Bitmap = Com.addBitmapAt( this, "tounament_json.ranking_" + MuLang.language, 10, 235 );
		prizeBg.scale9Grid = new egret.Rectangle( 10, 10, 182, 24 );
		prizeBg.width = 212;
		prizeBg.height = 100;

		this.buildOutBar();
	}

	public updata( data: ITounamentData ){

	}

	public buildOutBar(){
		this.outBar = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.outBar, 0, 297 );
		let avBg: egret.Bitmap = Com.addBitmapAt( this.outBar, "tounament_json.mechanism_pending_bg", 0, 0 );
		avBg.width = 235;
		avBg.height = 530;
		let avt: egret.Bitmap = Com.addBitmapAtMiddle( this.outBar, "tounament_json.avatar", 117, 264 );
		let fbId: string = PlayerConfig.player( "facebook_id" );
		if( fbId ) FacebookBitmap.downloadBitmapDataByFacebookID( fbId, 100, 100, this.getHeadIcon.bind( this, avt, 166 ), this );
	}

	public getHeadIcon( userInfo: egret.Bitmap, size: number, event: egret.Event ){
		let loader:egret.ImageLoader = event.currentTarget;
        let bmd: egret.BitmapData = loader.data;
		let tx: egret.Texture = new egret.Texture;
		tx.bitmapData = bmd;
		userInfo.scaleX = userInfo.scaleY = 1;
        userInfo.texture = tx;
		userInfo.width = userInfo.height = size;
	}
}
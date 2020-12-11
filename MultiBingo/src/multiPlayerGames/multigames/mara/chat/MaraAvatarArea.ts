class MaraAvatarArea extends AvatarContainer{
	
	private headList: Array<egret.Bitmap>;
	private headCount: number;
	private timeTxts: Array<egret.TextField>;
	
	public constructor() {
		super();

		this.headCount = 0;
		this.headList = [];
		this.timeTxts = [];
		let perX: number = 131;
		for( let i: number = 0; i < 3; i++ ){
			this.headList[i] = this.newHead();
			this.headList[i].x = perX * i + 1;
			this.headList[i].y = 8;
			let maskCircle: egret.Shape = new egret.Shape;
			maskCircle.graphics.beginFill(0);
			maskCircle.graphics.drawCircle( 30, 30, 30 );
			maskCircle.graphics.endFill();
			maskCircle.x = perX * i + 18;
			maskCircle.y = 21;
			this.avatarLayer.addChild( maskCircle );
			this.headList[i].mask = maskCircle;
			let tx: egret.TextField = Com.addTextAt( this.avatarLayer, perX * i + 90, 40, 50, 36, 36 );
			tx.scaleX = 0.82;
			tx.bold = true;
			tx.text = "X2";
			tx.textAlign = "left";
			this.timeTxts[i] = tx;
			Com.addBitmapAt( this.avatarLayer, "mara_chat_box_json." + ( i + 1 ), perX * i, 0 )
		}
	}

	protected setArea(){
		this.width = 393;
		this.height = 106;
	}

	public updataList( list: Array<Object> ){
		//do nothing;
	}

	protected newHead(): egret.Bitmap{
		let headIcon: egret.Bitmap = Com.addBitmapAt( this.avatarLayer, "mara_chat_box_json.photo Head frame", 0, 0 );
		return headIcon;
	}

	protected resetAvatarPositions(){
		//do nothing;
	}

	public showHead( fbId: string ): boolean{
		if( this.headCount < 3 ){
			if( fbId != "" ) FacebookBitmap.downloadBitmapDataByFacebookID( fbId, 100, 100, MDS.onUserHeadLoaded.bind( this, this.headList[this.headCount], 90 ), this );
			this.headCount++;
			return true;
		}
		return false;
	}

	public clearHead(){
		this.headCount = 0;
		let texture: egret.Texture = RES.getRes("mara_chat_box_json.photo Head frame");
		for( let i: number = 0; i < 3; i++ ){
			this.headList[i].texture = texture;
			this.headList[i].scaleX = this.headList[i].scaleY = 1;
		}
	}

	public setTmocb( tmocb: Array<number> ){
		for( let i: number = 0; i < 3; i++ ){
			this.timeTxts[i].text = "X" + tmocb[i];
		}
	}
}
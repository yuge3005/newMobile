class MaraAvatarArea extends AvatarContainer{
	
	private headList: Array<egret.Bitmap>;
	private headCount: number;
	private timeTxts: Array<egret.TextField>;
	
	public constructor() {
		super();

		this.headCount = 0;
		this.headList = [];
		this.timeTxts = [];
		for( let i: number = 0; i < 3; i++ ){
			this.headList[i] = this.newHead();
			this.headList[i].x = 58 * i + 6;
			this.headList[i].y = 8;
			let maskCircle: egret.Shape = new egret.Shape;
			maskCircle.graphics.beginFill(0);
			maskCircle.graphics.drawCircle( 15, 15, 15 );
			maskCircle.graphics.endFill();
			maskCircle.x = 58 * i + 6;
			maskCircle.y = 8;
			this.avatarLayer.addChild( maskCircle );
			this.headList[i].mask = maskCircle;
			let tx: egret.TextField = Com.addTextAt( this.avatarLayer, 58 * i + 32, 15, 35, 20, 20 );
			tx.scaleX = 0.8;
			tx.bold = true;
			tx.text = "X2";
			this.timeTxts[i] = tx;
			Com.addBitmapAt( this.avatarLayer, "mara_chat_box_json." + ( i + 1 ), 58 * i, 0 )
		}
	}

	protected setArea(){
		this.width = 170;
		this.height = 46;
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
			if( fbId != "" ) Utils.downloadBitmapDataByFacebookID( fbId, 50, 50, MDS.onUserHeadLoaded.bind( this, this.headList[this.headCount], 30 ), this );
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
			this.headList[i].width = 30;
			this.headList[i].height = 30;
		}
	}

	public setTmocb( tmocb: Array<number> ){
		for( let i: number = 0; i < 3; i++ ){
			this.timeTxts[i].text = "X" + tmocb[i];
		}
	}
}
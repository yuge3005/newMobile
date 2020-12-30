class MultiBingoAvatarArea extends AvatarContainer{
	public constructor() {
		super();
	}

	protected setArea(){
		this.width = 430;
		this.height = 100;
	}

	protected newHead(): egret.Bitmap{
		let headIcon: egret.Bitmap = Com.addBitmapAt( this.avatarLayer, MultiPlayerMachine.getAssetStr( "head_icon" ), 0, 0 );
		headIcon.width = 100;
		headIcon.height = 100;
		return headIcon;
	}

	protected resetAvatarPositions(){
		for( let i: number = 0; i < this.iconList.length; i++ ){
			this.iconList[i].x = 105 * i;
		}
	}

	public userJoin( fbId: string, userId: string ){
		if( this.userList.indexOf( userId ) < 0 ){
			this.userList.push( userId );
			let headIcon: egret.Bitmap = this.newHead();
			this.iconList.push( headIcon );

			if( fbId != "" ) FacebookBitmap.downloadBitmapDataByFacebookID( fbId, 100, 100, MDS.onUserHeadLoaded.bind( this, headIcon, 100 ), this );

			this.resetAvatarPositions();
		}
	}
}
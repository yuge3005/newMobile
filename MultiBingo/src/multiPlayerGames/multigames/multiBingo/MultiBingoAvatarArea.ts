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
}
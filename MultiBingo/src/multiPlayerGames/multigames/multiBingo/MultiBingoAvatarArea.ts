class MultiBingoAvatarArea extends AvatarContainer{
	public constructor() {
		super();
	}

	protected setArea(){
		this.width = 174;
		this.height = 45;
	}

	protected newHead(): egret.Bitmap{
		let headIcon: egret.Bitmap = Com.addBitmapAt( this.avatarLayer, MultiPlayerMachine.getAssetStr( "head_icon" ), 0, 0 );
		headIcon.width = 36;
		headIcon.height = 36;
		return headIcon;
	}

	protected resetAvatarPositions(){
		for( let i: number = 0; i < this.iconList.length; i++ ){
			this.iconList[i].x = 40 * i;
		}
	}
}
class SlotIcon extends egret.Bitmap{
	public constructor( textureName: string ) {
		if( textureName && textureName != "" ) super( RES.getRes( textureName ) );
		else super( null );

		this.setToMiddle();
	}

	public changeTexture( textureName: string ){
		this.texture = RES.getRes( textureName );

		this.setToMiddle();
	}

	protected setToMiddle(){
		this.anchorOffsetX = this.width >> 1;
		this.anchorOffsetY = this.height >> 1;
	}
}
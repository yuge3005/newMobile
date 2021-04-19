class EraDoGeloIcon extends SlotIcon{
	public constructor( assetName: string ) {
		super( assetName );
	}

	public changeTexture( textureName: string, iconIndex: number ){
		if( iconIndex > 9 ) textureName = SlotMachine.getAssetStr( "9" );

		super.changeTexture( textureName, iconIndex );
	}
}
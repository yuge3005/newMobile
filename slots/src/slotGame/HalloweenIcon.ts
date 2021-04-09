class HalloweenIcon extends SlotIcon{
	public constructor( assetName: string ) {
		super( assetName );
	}

	protected setToMiddle(){
		this.width = 256;
		this.height = 256;

		super.setToMiddle();
	}
}
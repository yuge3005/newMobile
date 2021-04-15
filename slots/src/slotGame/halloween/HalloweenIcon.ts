class HalloweenIcon extends SlotIcon{
	public constructor( assetName: string ) {
		super( assetName );
	}

	protected setToMiddle(){
		super.setToMiddle();

		this.scaleX = this.scaleY = 2;
	}
}
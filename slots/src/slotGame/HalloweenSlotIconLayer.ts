class HalloweenSlotIconLayer extends SlotIconLayer{
	public constructor() {
		super();

		this.x = LineManager.lineStartPoint.x;
		this.y = LineManager.lineStartPoint.y;
	}

	protected buildIcons(){
		this.icons = [];
		for( let i: number = 0; i < 15; i++ ){
			this.icons[i] = new HalloweenIcon( null );
			Com.addObjectAt( this, this.icons[i], 135 + i % 5 * 289, 263 * Math.floor( i / 5 ) + 128 );
		}
	}

	public showIcons( iconArray: Array<number> = null ){
		if( !this.icons ) this.buildIcons();

		if( !iconArray ){
			for( let i: number = 0; i < 15; i++ ){
				this.icons[i].changeTexture( SlotMachine.getAssetStr( "" + Math.floor( Math.random() * 10 ) ) );
			}
		}
		else{
			for( let i: number = 0; i < 15; i++ ){
				this.icons[i].changeTexture( SlotMachine.getAssetStr( "" + iconArray[i] ) );
			}
		}
	}
}
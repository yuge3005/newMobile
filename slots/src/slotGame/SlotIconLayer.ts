class SlotIconLayer extends egret.DisplayObjectContainer{

	protected icons: Array<SlotIcon>;
	protected figlinhas: Array<number>;
	protected figuras: Array<number>;

	protected blinkIcons: Array<egret.MovieClip>;
	protected blinkIconsLayer: egret.DisplayObjectContainer;

	public constructor() {
		super();
	}

	protected buildIcons(){
	}

	public showIcons( iconArray: Array<number> = null ){
	}

	public startRunning( figuras: Array<number>, figlinhasPremiadas: Array<number>, figurasPremiadas: Array<number> ){
		this.figlinhas = figlinhasPremiadas;
		this.figuras = figurasPremiadas;

		this.showIcons( figuras );
	}

	public showResult(){
		this.showBlinkIcons();
		SlotMachine.endSlotRunning( this.figlinhas );
	}

	protected showBlinkIcons(){
		if( this.figlinhas.length != this.figuras.length ) throw new Error( "Server data Error: figlinhas" );

		if( this.blinkIcons ) this.clearBlinkIcons();
		this.blinkIcons = [];
		if( !this.blinkIconsLayer ) this.blinkIconsLayer = new egret.DisplayObjectContainer;
		this.addChild( this.blinkIconsLayer );

		let pts: Object = LineManager.linesDictionary;
		for( let i: number = 0; i < this.figlinhas.length; i++ ){
			let ptIndex: number = this.figlinhas[i];
			let iconIdex: number = this.figuras[i];
			let line: LineUI = pts["p"+ptIndex];
			for( let j: number = 0; j < line.lineRule.length; j++ ){
				let slotIconNumberIndex: number = parseInt( line.lineRule.charAt(j), 16 );
				let slotIcon: SlotIcon = this.icons[ slotIconNumberIndex ];
				if( slotIcon.iconIndex == iconIdex ) {
					if( !this.blinkIcons[slotIconNumberIndex] ) this.blinkIcons[slotIconNumberIndex] = this.buildBlinkIcon( iconIdex, slotIcon.x, slotIcon.y );
				}
			}
		}
	}

	protected buildBlinkIcon( iconIndex: number, positionX: number, positionY: number ): egret.MovieClip{
		return null;
	}

	public clearIconStatus(){
		if( this.blinkIcons ) this.clearBlinkIcons();
	}

	protected clearBlinkIcons(){
		for( let i: number = 0; i < this.blinkIcons.length; i++ ){
			if( this.blinkIcons[i] ){
				this.blinkIcons[i].stop();
				if( this.blinkIcons[i].parent ) this.blinkIcons[i].parent.removeChild( this.blinkIcons[i] );
			}
		}
		this.blinkIcons = null;
	}

	public stopRunning(){
		// sub class
	}
}
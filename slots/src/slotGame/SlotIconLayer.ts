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
		//sub class override
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
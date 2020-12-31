class Multi75Card extends MultiPlayerCard{

	protected bingoMask: egret.Sprite;
	protected handPt: egret.MovieClip;

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd( event: egret.Event ){
		super.onAdd( event );

		this.bg.touchEnabled = true;
		this.bg.addEventListener( egret.TouchEvent.TOUCH_TAP, this.wrongGridClick, this );
	}

	protected wrongGridClick( event: egret.TouchEvent ): void{
		// sub class override
	}

	public setFree( gridIndex: number ){
		this.numbers[gridIndex] = 0;
		this.grids[gridIndex].gridNumber = 0;
	}

	protected createGrid( gridIndex: number ): MultiPlayerGrid{
		let grid: MultiPlayerGrid = super.createGrid( gridIndex );

		grid.touchChildren = false;
		grid.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onGridToutch, this );
		return grid;
	}

	protected onGridToutch( event: egret.TouchEvent ): void{
		// sub class override
	}

	public clearStatus(): void{
		super.clearStatus();

		for( let i: number = 0; i < this.grids.length; i++ ){
			this.grids[i].touchEnabled = false;
		}
		if( this.handPt ){
			this.removeHand();
		}
	}

	protected removeHand(){
		this.removeChild( this.handPt );
		this.handPt = null;
	}

	public clearMultiStatus(): void{
		this.clearStatus();
		if( this.bingoMask && this.contains( this.bingoMask ) ){
			this.removeChild( this.bingoMask );
		}
		for( let i: number = 0; i < this.grids.length; i++ ){
			( this.grids[i] as Multi75Grid ).clearCoinsAward();
			( this.grids[i] as Multi75Grid ).isCollected = false;
		}
	}

	public getCollectedString(): string{
		let str: string = "";
		for( let i: number = 0; i < this.grids.length; i++ ){
			if( ( this.grids[i] as Multi75Grid ).isCollected )str += "1";
			else str += "0";
		}
		return str;
	}

	public quitInturnMode(){
		this.inTurnMode = false;
		for( let i: number = 0; i < this.grids.length; i++ ){
			this.addGridToCardLayer( this.grids[i], false );
		}
		if( this.handPt ){
			this.removeHand();
		}
	}
}
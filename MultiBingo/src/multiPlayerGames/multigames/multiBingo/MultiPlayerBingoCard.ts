class MultiPlayerBingoCard extends Multi75Card{

	public constructor( cardId: number ) {
		super( cardId );

		this.scaleX = this.scaleY = 0.7;
	}

	protected wrongGridClick( event: egret.TouchEvent ): void{
		SoundManager.play( "mpb_wrong_number_clicked_mp3" );
	}

	protected onGridToutch( event: egret.TouchEvent ): void{
		let grid: MultiPlayerBingoGrid = event.target;
		trace( grid.gridNumber );
		trace( this.uuid );
		grid.touchEnabled = false;
		grid.showRedEffect();
		this.addGridToCardLayer( grid, false );
		let gridIndex: number = this.grids.indexOf( grid );
		MultiServer.numberSelect( this.uuid, gridIndex );
		if( grid.awardType ){
			setTimeout( MultiServer.triggerPowerUp.bind( MultiServer ), 30, grid.awardType, this.uuid, gridIndex );
			if( grid.awardType == MultiPlayerBingoGrid.AWARDTYPE_COINSBOX ) MultyPlayerBingo.openBoxTimes++;
		}

		let ev: egret.Event = new egret.Event( "checkMultiBingo" );
		ev.data = gridIndex;
		this.dispatchEvent( ev );
		if( this.handPt && this.handPt.name == "" + gridIndex ){
			this.removeHand();
		}
		SoundManager.play( "mpb_right_number_clicked_mp3" );
	}

	public setCoinBoxs( boxArr: Array<number> ): void{
		if( !boxArr || boxArr.length == 0 ) return;
		for( let i: number = 0; i < boxArr.length; i++ ){
			( this.grids[boxArr[i]] as MultiPlayerBingoGrid ).setCoinsAward( MultiPlayerBingoGrid.AWARDTYPE_COINSBOX );
		}
	}

	public setCoinsAward( boxArr: Array<number>, type: string ): void{
		if( !boxArr || boxArr.length == 0 ) return;
		for( let i: number = 0; i < boxArr.length; i++ ){
			if( type == MultiPlayerBingoGrid.AWARDTYPE_MARKNUMBER ) this.setFree( boxArr[i] );
			else if( type == MultiPlayerBingoGrid.AWARDTYPE_COINSAWARDTHREE ) ( this.grids[boxArr[i]] as MultiPlayerBingoGrid ).setCoinsAward( type );
			else console.error( "fuck error" );
		}
	}

	public showBingo(){
		this.bingoMask = new egret.Sprite;
		this.bingoMask.touchEnabled = true;
		this.addChild( this.bingoMask );
		Com.addBitmapAt( this.bingoMask, MultiPlayerMachine.getAssetStr( "BINGO-BG" ), 0, 0 );
		Com.addDownButtonAt( this.bingoMask, MultiPlayerMachine.getAssetStr( "BINGO" ), MultiPlayerMachine.getAssetStr( "BINGO" ), this.bg.width - 508 >> 1, this.bg.height >> 1, this.callBingo.bind(this), true );
		this.quitInturnMode();
	}

	private callBingo(){
		MultiServer.callBingo( this.uuid );
		this.bingoMask.removeChildren();
		Com.addBitmapAt( this.bingoMask, MultiPlayerMachine.getAssetStr( "BINGO-BG" ), 0, 0 );

		let mc: egret.MovieClip = Com.addMovieClipAt( this.bingoMask, MDS.mcFactory, "multiBingo", 0, 0 );
		mc.scaleX = mc.scaleY = 3.15;
		mc.play();

		MultyPlayerBingo.callBingoTimes++;
	}

	public checkNumber( ballIndex: number ): number {
		let index: number = super.checkNumber( ballIndex );
		if( index >= 0 && !this.handPt && this.inTurnMode ){
			let onCardPt: egret.Point = MultiPlayerCard.getGridPosition( index );
			this.handPt = Com.addMovieClipAt( this, MDS.mcFactory, index % 5 == 4 ? "hand2" : "hand1", onCardPt.x, onCardPt.y );
			this.handPt.name = "" + index;
		}
		return index;
	}

	public flyBox(): void{
		for( let i: number = 0; i < this.grids.length; i++ ){
			if( ( this.grids[i] as MultiPlayerBingoGrid ).awardType == MultiPlayerBingoGrid.AWARDTYPE_COINSBOX ) ( this.grids[i] as MultiPlayerBingoGrid ).flyBox();
		}
	}
}
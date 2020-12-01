class BlackoutCard extends Multi75Card{

	private coverOnCard: egret.Bitmap;

	public constructor( cardId: number ) {
		super( cardId );

		let cardMask: egret.Bitmap = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "card_mask" ), 0, 0 );
		this.mask = cardMask;
	}

	public getNumbers( numbers: Array<number> ){
		super.getNumbers( numbers );
		if( !this.coverOnCard ){
			this.bingoMask = new egret.Sprite;
			this.coverOnCard = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "card" ), 0, 0 );
			this.addChild( this.bingoMask );
		}
	}

	public clearStatus(): void{
		this.clearFitEffect();
		for( let i: number = 0; i < this.grids.length; i++ ){
			this.grids[i].showEffect( false );
			this.grids[i].touchEnabled = true;
		}
		this.bingoMask.removeChildren();
	}

	public clearMultiStatus(){
		for( let i: number = 0; i < this.grids.length; i++ ){
			( this.grids[i] as Multi75Grid ).isCollected = false;
		}
	}

	protected onGridToutch( event: egret.TouchEvent ): void{
		let grid: MultiPlayerGrid = event.target;
		trace( grid.gridNumber );
		trace( this.uuid );
		if( Blackout.markingState ){
			grid.showEffect( true );
			grid.touchEnabled = false;
			grid.showRedEffect();
			let gridIndex: number = this.grids.indexOf( grid );
			MultiServer.blackoutTriggerPowerUp( BlackoutEnergy.MANUAL_MARK, this.uuid, gridIndex, Blackout.markingState );
			Blackout.markingState = null;
			let ev: egret.Event = new egret.Event( "mark_grid" );
			ev.data = gridIndex;
			this.dispatchEvent( ev );
			let star: egret.Bitmap = Com.addBitmapAt( this.bingoMask, MultiPlayerMachine.getAssetStr( "star_on_card" ), grid.x, grid.y );
			star.alpha = 0;
			TweenerTool.tweenTo( star, { alpha: 1 }, 100, 1600 );
		}
		else{
			if( grid.isChecked ){
				grid.touchEnabled = false;
				grid.showRedEffect();
				SoundManager.play( "mpb_right_number_clicked_mp3" );
			}
			else{
				SoundManager.play( "mpb_wrong_number_clicked_mp3" );
			}
			let gridIndex: number = this.grids.indexOf( grid );
			MultiServer.numberSelect( this.uuid, gridIndex );
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
	}

	public checkNumber( ballIndex: number ): number {
		let index: number = super.checkNumber( ballIndex );

		if( index >= 0 && Blackout["autoCall"] && !MultiPlayerMachine["currentGame"]["gold"] ){
			let grid: MultiPlayerGrid = this.grids[index];
			trace( grid.gridNumber );
			trace( this.uuid );
			grid.touchEnabled = false;
			grid.showRedEffect();
			MultiServer.numberSelect( this.uuid, index );
		}

		return index;
	}

	public markCard( patterns: Array<string> ){
		for( let i: number = 0; i < patterns.length; i++ ){
			for( let j: number = 0; j < patterns[i].length; j++ ){
				if( patterns[i].charAt(j) == "1" ){
					Com.addBitmapAt( this.bingoMask, MultiPlayerMachine.getAssetStr( "yellow" ), this.grids[j].x, this.grids[j].y );
				}
			}
		}
	}

	public blink( show: number ){
	}
}
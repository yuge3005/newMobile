class MaraCard extends Multi75Card{

	private specialMode: boolean = false;

	public static cardClickMode: boolean = false;

	private static bingoFactory: egret.MovieClipDataFactory;
	private effectLayer: egret.DisplayObjectContainer;

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected wrongGridClick( event: egret.TouchEvent ): void{
		if( MaraCard.cardClickMode ){
			this.dispatchEvent( new egret.Event( "clickOnCard" ) );
			return;
		}
		if( this.isSharkChoosing && !this.specialMode ){
			let innerPosition: egret.Point = new egret.Point( event.localX - MultiPlayerCard.gridInitPosition.x, event.localY - MultiPlayerCard.gridInitPosition.y );
			let cow: number = Math.floor( innerPosition.x / MultiPlayerGrid.gridSpace.x );
			let line: number = Math.floor( innerPosition.y / MultiPlayerGrid.gridSpace.y );
			if( cow >= 0 && cow <= 5 && cow >= 0 && cow <= 5 ){
				let gridIndex: number = line * 5 + cow;
				let grid: MaraGrid = this.grids[gridIndex] as MaraGrid;
				if( !grid.isChecked ){
					grid.showEffect( true );
					grid.touchEnabled = false;
					grid.showRedEffect();

					MultiServer.triggerPowerUp( "shark", this.uuid, gridIndex );

					let ev: egret.Event = new egret.Event( "onShark" );
					ev.data = gridIndex;
					this.dispatchEvent( ev );

					this.testJellyBomb( gridIndex );

					return;
				}
			}
		}
		SoundManager.play( "mpb_wrong_number_clicked_mp3" );
	}

	protected onGridToutch( event: egret.TouchEvent ): void{
		if( MaraCard.cardClickMode ){
			this.dispatchEvent( new egret.Event( "clickOnCard" ) );
			return;
		}
		let grid: MaraGrid = event.target;
		trace( grid.gridNumber );
		trace( this.uuid );
		grid.touchEnabled = false;
		grid.showRedEffect();
		let gridIndex: number = this.grids.indexOf( grid );
		MultiServer.numberSelect( this.uuid, gridIndex );
		if( grid.awardType ){
			setTimeout( MultiServer.triggerPowerUp.bind( MultiServer ), 30, grid.awardType, this.uuid, gridIndex );
			if( grid.awardType == MaraGrid.AWARDTYPE_PEARL_MAIN ){
				let pev: egret.Event = new egret.Event( "onPearl" );
				pev.data = gridIndex;
				this.dispatchEvent( pev );
			}
		}

		let ev: egret.Event = new egret.Event( this.specialMode ? "checkSpecialBingo" : "checkMultiBingo" );
		ev.data = gridIndex;
		this.dispatchEvent( ev );
		if( this.handPt && this.handPt.name == "" + gridIndex ){
			this.removeHand();
		}
		SoundManager.play( "mpb_right_number_clicked_mp3" );

		this.testJellyBomb( gridIndex );
	}

	private testJellyBomb( gridIndex: number ){
		if( this.jellyBombPosition && this.jellyBombPosition.indexOf( gridIndex ) >= 0 ){
			setTimeout( MultiServer.triggerPowerUp.bind( MultiServer ), 30, "jellyFish", this.uuid, gridIndex );
			for( let i: number = 0; i < this.jellyBombPosition.length; i++ ){
				this.hardGetNumber( this.jellyBombPosition[i] );
				if( this.jellyBombPosition[i] != gridIndex ){
					let grid: MaraGrid = this.grids[this.jellyBombPosition[i]] as MaraGrid;
					if( grid.awardType == MaraGrid.AWARDTYPE_GREEN_BAIT || grid.awardType == MaraGrid.AWARDTYPE_ORANGE_BAIT || grid.awardType == MaraGrid.AWARDTYPE_RED_BAIT ){
						setTimeout( MultiServer.triggerPowerUp.bind( MultiServer ), 150, grid.awardType, this.uuid, this.jellyBombPosition[i] );
					}
				}
			}
			this.jellyBombLayer.removeChildren();
			let ev: egret.Event = new egret.Event("jellyFishPosion");
			ev.data = { jellyBombIndex: this.jellyBombIndex, cardId: this.cardId };
			this.dispatchEvent( ev );
			setTimeout( this.showCheese.bind(this), 1400 );
		}
	}

	public clearStatus(): void{
		super.clearStatus();
		this.specialMode = false;
		this.clearFeatureUI();

		if( this.contains( this.bingoMask ) ) this.removeChild( this.bingoMask );
		this.bingoMask = null;
	}

	private clearFeatureUI(){
		this.clearJellyBomb();
		if( this.effectLayer )this.effectLayer.removeChildren();
		if( this.specialCardBg && this.contains( this.specialCardBg ) ) this.removeChild( this.specialCardBg );
	}

	public setCoinsAward( boxArr: Array<number>, type: string ): void{
		if( !boxArr || boxArr.length == 0 ) return;
		for( let i: number = 0; i < boxArr.length; i++ ){
			if( type == MaraGrid.AWARDTYPE_CAMARA ) this.setCameraGrid( boxArr[i] );
			else if( type == MaraGrid.AWARDTYPE_RED_BAIT ) ( this.grids[boxArr[i]] as MaraGrid ).setCoinsAward( type );
			else if( type == MaraGrid.AWARDTYPE_GREEN_BAIT ) ( this.grids[boxArr[i]] as MaraGrid ).setCoinsAward( type );
			else if( type == MaraGrid.AWARDTYPE_ORANGE_BAIT ) ( this.grids[boxArr[i]] as MaraGrid ).setCoinsAward( type );
			else if( type == MaraGrid.AWARDTYPE_PEARL_MAIN ) ( this.grids[boxArr[i]] as MaraGrid ).setCoinsAward( type );
			else if( type == MaraGrid.AWARDTYPE_PEARL_PER ) ( this.grids[boxArr[i]] as MaraGrid ).setCoinsAward( type );
			else console.error( "fuck error" );
		}
	}

	public showBingo(){
		if( this.bingoMask )return;
		this.bingoMask = new egret.Sprite;
		this.bingoMask.touchEnabled = true;
		this.addChild( this.bingoMask );
		Com.addBitmapAt( this.bingoMask, MultiPlayerMachine.getAssetStr( "BINGO-BG" ), 0, 0 );
		Com.addDownButtonAt( this.bingoMask, MultiPlayerMachine.getAssetStr( "BINGO" ), MultiPlayerMachine.getAssetStr( "BINGO" ), this.bg.width - 174 >> 1, this.bg.height - 73 >> 1, this.callBingo.bind(this), true );
	}

	private callBingo( event: egret.Event ){
		MultiServer.callBingo( this.uuid );
		let sab: TouchDownButton = event.target as TouchDownButton;
		sab.touchEnabled = false;
	}

	public confirmBingo(){
		this.bingoMask.removeChildren();
		if( !MaraCard.bingoFactory ) {
			let data = RES.getRes( "maraBingo_json" );
			let tex = RES.getRes( "maraBingo_png" );
			MaraCard.bingoFactory = new egret.MovieClipDataFactory( data, tex );
		}
		let mc: egret.MovieClip = Com.addMovieClipAt( this.bingoMask, MaraCard.bingoFactory, "bingo", 0, 0 );
		mc.scaleX = 409 / 180;
		mc.scaleY = 393 / 175;
		TweenerTool.tweenTo( mc, { alpha: 0 }, 400, 3500, MDS.removeSelf.bind( this, mc ) );
		SoundManager.play( "mara_bingo_mp3" );
	}

	public blinkAt( index: number ){
		if( this.specialMode ) return;
		if( this.grids[index].isChecked )return;
		this.grids[index].blink = true;
	}

/********************************************************************************************************************************************/

	private jellyBombLayer: egret.DisplayObjectContainer;
	private jellyBombPosition: Array<number>;
	private jellyBombIndex: number;
	private specialCardBg: egret.Sprite;

	public changeMode( specialPattern: string ): boolean{
		if( this.bingoMask && this.contains( this.bingoMask ) ){
			this.removeChild( this.bingoMask );
			this.specialMode = true;

			if( this.handPt ){
				this.removeHand();
			}

			for( let i: number = 0; i < this.grids.length; i++ ){
				let grid: MaraGrid = this.grids[i] as MaraGrid;
				if( !grid.isCollected ) {
					if( grid.blink ) grid.blink = false;
					grid.clearCoinsAward();
					if( grid.isChecked ) grid.clearYellow();
				}
			}

			this.clearFeatureUI();
			if( !this.specialCardBg ){
				this.specialCardBg = new egret.Sprite;
				Com.addBitmapAt( this.specialCardBg, MultiPlayerMachine.getAssetStr("Card-bingo"), 0, 0 );
			}
			this.drawSpecialPattern( specialPattern );
			this.addChild( this.specialCardBg );
			return true;
		}
		else{
			this.visible = false;
			this.enabled = false;
			return false;
		}
	}

	public treatureBingo(){
		if( this.contains( this.bingoMask ) ) this.removeChild( this.bingoMask );
		this.bingoMask = null;

		this.showBingo();
		SoundManager.play( "city of light_mp3" );
	}

	public jellyBomb( cow: number, line: number ){
		if( !this.jellyBombLayer ){
			this.jellyBombLayer = new egret.DisplayObjectContainer;
			this.addChild( this.jellyBombLayer );
		}
		let pt: egret.Point = new egret.Point;
		pt.x = MultiPlayerCard.gridInitPosition.x + ( cow - 1 ) * MultiPlayerGrid.gridSpace.x;
		pt.y = MultiPlayerCard.gridInitPosition.y + ( line - 1 ) * MultiPlayerGrid.gridSpace.y;
		Com.addBitmapAt( this.jellyBombLayer, MultiPlayerMachine.getAssetStr( "cicon_jellyFish" ), pt.x, pt.y );
		
		this.jellyBombPosition = [];
		this.jellyBombIndex = line * 6 + cow;
		if( cow > 0 && line > 0 ) this.jellyBombPosition.push( cow - 1 + ( line - 1 ) * 5 );
		if( cow < 5 && line > 0 ) this.jellyBombPosition.push( cow + ( line - 1 ) * 5 );
		if( cow > 0 && line < 5 ) this.jellyBombPosition.push( cow - 1 + line * 5 );
		if( cow < 5 && line < 5 ) this.jellyBombPosition.push( cow + line * 5 );
	}

	public hardGetNumber( num: number ){
		let gridIndex: number = num;
		let grid: MaraGrid = this.grids[gridIndex] as MaraGrid;
		if( !grid.isChecked ){
			grid.showEffect( true );
		}
		if( !grid.isCollected ){
			grid.touchEnabled = false;
			grid.showRedEffect();

			let ev: egret.Event = new egret.Event( "checkMultiBingo" );
			ev.data = gridIndex;
			this.dispatchEvent( ev );

			return;
		}
	}

	public hardGetNumbers( nums: Array<number> ){
		for( let i: number = 0; i < nums.length; i++ ){
			this.hardGetNumber( nums[i] );
		}
	}

	private clearJellyBomb(){
		if( this.jellyBombLayer ){
			this.jellyBombLayer.removeChildren();
			this.jellyBombPosition = null;
		}
	}

	public overTimeCheck( num: number ){
		if( this.specialMode ) return;
		if( this.handPt ) this.removeHand();
		let index: number = this.numbers.indexOf( num );
		if( index < 0 ) return;
		let grid: MaraGrid = this.grids[index] as MaraGrid;
		if( !grid.isCollected ){
			this.handPt = Com.addMovieClipAt( this, MDS.mcFactory, index % 5 == 4 ? "hand2" : "hand1", ( index % 5 ) * MultiPlayerGrid.gridSpace.x + MultiPlayerCard.gridInitPosition.x, Math.floor( index / 5 ) * MultiPlayerGrid.gridSpace.y + MultiPlayerCard.gridInitPosition.y );
			this.handPt.name = "" + index;
			this.handPt.scaleX = this.handPt.scaleY = 2.25;
			grid.showYellowBg();
		}
	}

	public resumeBingo(){
		this.bingoMask = new egret.Sprite;
		this.bingoMask.touchEnabled = true;
		this.addChild( this.bingoMask );
		Com.addBitmapAt( this.bingoMask, MultiPlayerMachine.getAssetStr( "BINGO-BG" ), 0, 0 );
	}

	private showCheese(){
		for( let i: number = 0; i < this.jellyBombPosition.length; i++ ){
			if( this.jellyBombPosition[i] == 12 ) continue;
			let grid: MultiPlayerGrid = this.grids[this.jellyBombPosition[i]];
			if( !this.effectLayer ) this.addEffectLayer();
			let bit: egret.Bitmap = Com.addBitmapAt( this.effectLayer, MultiPlayerMachine.getAssetStr( "cheese_grid"), grid.x, grid.y );
			bit.alpha = 0;
			TweenerTool.tweenTo( bit, { alpha: 1 }, 300 );
		}
	}

	private choosingBit: egret.Bitmap;

	private get isSharkChoosing(): boolean{
		if( this.choosingBit && this.choosingBit.visible ) return true;
		return false;
	}

	public sharkChoosing( choosing: boolean ){
		if( !this.choosingBit ) this.choosingBit = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "glow" ), -45, -53 );
		this.choosingBit.visible = choosing;
	}

	public star(){
		if( !this.effectLayer ) this.addEffectLayer();
		let grid: MultiPlayerGrid = this.grids[12];
		Com.addBitmapAt( this.effectLayer, MultiPlayerMachine.getAssetStr( "pc_x3" ), grid.x, grid.y );
	}

	private addEffectLayer(){
		this.effectLayer = new egret.DisplayObjectContainer;
		this.addChild( this.effectLayer );
	}

	private setCameraGrid( index: number ){
		if( !this.effectLayer ) this.addEffectLayer();
		let grid: MultiPlayerGrid = this.grids[index];
		this.hardGetNumber( index );
		Com.addBitmapAt( this.effectLayer, MultiPlayerMachine.getAssetStr( "painting_grid" ), grid.x, grid.y );
		
		this.testJellyBomb( index );
	}

	private drawSpecialPattern( specialPattern: string ){
		this.specialCardBg.graphics.clear();
		this.specialCardBg.graphics.beginFill( 0x2EC8CE, 0.3 );
		for( let i: number = 0; i < specialPattern.length; i++ ){
			if( specialPattern.charAt( i ) == "1" ) this.specialCardBg.graphics.drawRect( MultiPlayerCard.gridInitPosition.x + i % 5 * MultiPlayerGrid.gridSpace.x, MultiPlayerCard.gridInitPosition.y + Math.floor( i / 5 ) * MultiPlayerGrid.gridSpace.y, MultiPlayerGrid.gridSize.x, MultiPlayerGrid.gridSize.y );
		}
		this.specialCardBg.graphics.endFill();
	}

	private cardChoosingBit: egret.Bitmap;

	public cardClickMode( isClickMode: boolean ){
		if( !this.cardChoosingBit ) this.cardChoosingBit = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "glow" ), -45, -53 );
		this.cardChoosingBit.visible = isClickMode;
	}

	public getMacaroonAt( type: string, gridIndex: number ){
		let grid: MultiPlayerGrid = this.grids[gridIndex];
		if( !this.effectLayer ) this.addEffectLayer();
		let bit: egret.Bitmap = Com.addBitmapAt( this.effectLayer, MultiPlayerMachine.getAssetStr( type + "_macaroon_grid" ), grid.x, grid.y );
		bit.alpha = 0;
		TweenerTool.tweenTo( bit, { alpha: 1 }, 100, 1000 );
	}

	public getCollectedNumbers(): Array<number>{
		let ar: Array<number> = [];
		for( let i: number = 0; i < this.grids.length; i++ ){
			if( ( this.grids[i] as Multi75Grid ).isCollected ) ar.push( this.grids[i].gridNumber );
		}
		return ar;
	}

	public swirlGotNumbers( hotNumbers: Array<number> ){
		for( let i: number = 0; i < hotNumbers.length; i++ ){
			for( let j: number = 0; j < this.grids.length; j++ ){
				if( this.grids[j].gridNumber == hotNumbers[i] ){
					this.hardGetNumber( j );
					break;
				}
			}
		}
	}
}
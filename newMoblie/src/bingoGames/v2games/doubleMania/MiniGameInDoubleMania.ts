class MiniGameInDoubleMania extends GameUIItem {

	private playBtn: TouchDownButton;
	private gettingPaytableBg: egret.Bitmap;
	private ptLayer: egret.DisplayObjectContainer;
	private miniTtems: Array<DoubleManiaMiniItem>;

	private prizeAwardPositions: Array<egret.Point>;

	private ganhoText1: egret.TextField;
	private ganhoText2: egret.TextField;

	public constructor() {
		super();

		GraphicTool.drawRect( this, new egret.Rectangle( 0, 0, BingoBackGroundSetting.gameMask.width, BingoBackGroundSetting.gameMask.height ), 0, false, 0.0 );
		this.touchEnabled = true;

		this.showBonusTip();

		DoubleManiaMiniItem.itemAssetList = [ this.getAsset("funny_face"), this.getAsset("triplebonus"), this.getAsset("dr_bingo"), this.getAsset("doctor"), this.getAsset("x") ];
		this.prizeAwardPositions = [new egret.Point( 43, 123 ),new egret.Point( 43, 153 ),new egret.Point( 43, 183 ),new egret.Point( 43, 213 ),new egret.Point( 43, 243 ),new egret.Point( 43, 273 ),
		new egret.Point( 222, 123 ),new egret.Point( 222, 153 ),new egret.Point( 222, 183 ),new egret.Point( 222, 213 ),new egret.Point( 222, 243 ),new egret.Point( 222, 273 )];
	}

	private getAsset( str: string ): string{
		let assetStr: string = BingoMachine.getAssetStr( str );
		let strArr: Array<string> = assetStr.split( "_json." );
		let nameArr: Array<string> = [];
		nameArr.push( strArr[0] );
		nameArr.push( "_mini" );
		nameArr.push( "_json." );
		nameArr.push( strArr[1] );
		return nameArr.join( "" );
	}

	private showBonusTip(): void{
		let bonusEffect: egret.Bitmap = Com.addBitmapAt( this, this.getAsset( "BonusEffect" ), 0, 0 );
		bonusEffect.anchorOffsetX = bonusEffect.width >> 1;
		bonusEffect.anchorOffsetY = bonusEffect.height >> 1;
		bonusEffect.x = BingoBackGroundSetting.gameAreaWidth >> 1;
		bonusEffect.y = BingoBackGroundSetting.gameAreaHeight >> 1;

		let tw: egret.Tween = egret.Tween.get( bonusEffect );
		tw.to( { scaleX: 1.5, scaleY: 1.5 }, 350);
		tw.to( { scaleX: 1, scaleY: 1 }, 350);
		tw.to( { scaleX: 1.5, scaleY: 1.5 }, 350);
		tw.to( { scaleX: 1, scaleY: 1 }, 350);
		tw.to( { scaleX: 1.5, scaleY: 1.5 }, 350);
		tw.to( { scaleX: 1, scaleY: 1 }, 350);
		tw.call( this.showMiniGame, this );
	}

	private showMiniGame(): void{
		this.removeChildren();

		let bg: egret.Bitmap = Com.addBitmapAt( this, this.getAsset( "background" ), 0, 0 );

		Com.addBitmapAt( this, this.getAsset( "background_machine" ), 28, 400 );

		this.playBtn = this.buildPlayBtn();

		this.addPaytableBg( "pt_bg", 28 );
		this.addPaytableBg( "bg", 655 );
		this.addPaytableBg( "prize_bg", 422 );

		Com.addBitmapAt( this, this.getAsset( "line_vertical" ), 218, 145 );

		this.gettingPaytableBg = Com.addBitmapAt( this, this.getAsset( "paytable_outline" ), 60, 400 );
		this.gettingPaytableBg.visible = false;

		this.buildTaytableLayer();

		this.miniTtems = [];
		this.miniTtems[0] = this.buildMiniItemAt( 1, 50, 435 );
		this.miniTtems[1] = this.buildMiniItemAt( 2, 225, 435 );
		this.miniTtems[2] = this.buildMiniItemAt( 3, 400, 435 );
		this.miniTtems[3] = this.buildMiniItemAt( 4, 570, 435 );
	}

	private buildMiniItemAt( type: number, xPos: number, yPos: number ): DoubleManiaMiniItem{
		let item: DoubleManiaMiniItem = new DoubleManiaMiniItem( this.getAsset( "" + type ) );
		Com.addObjectAt( this, item, xPos, yPos );
		return item;
	}

	private buildPlayBtn(): TouchDownButton{
		let playBtnAssetName: string = this.getAsset( "button" );
		let playBtn: TouchDownButton = Com.addDownButtonAt( this, playBtnAssetName, playBtnAssetName, 650, 660, this.miniSpin.bind( this ), true );
		let txt: TextLabel = Com.addLabelAt( this, 0, 0, playBtn.width, playBtn.height, 20, true, true );
		txt.stroke = 2;
		txt.setText( MuLang.getText( "play" ) );
		txt.lineSpacing = 10;
		playBtn.addChild( txt );
		playBtn.disabledFilter = MatrixTool.colorMatrixLighter( 0.5 );
		return playBtn;
	}

	private addPaytableBg( name: string, xPos: number ): void{
		let bgBitmap: egret.Bitmap = Com.addBitmapAt( this, this.getAsset( name ), xPos, 100 );
		let titleText: egret.TextField = MDS.addGameText( this, xPos, 90, 24, 0xFFEE00, name, true, bgBitmap.width, "", 1 );
		titleText.strokeColor = 0;
		titleText.stroke = 2;
		titleText.textAlign = "center";
		bgBitmap.scaleY = 1.25;
	}

	private buildTaytableLayer(): void{
		this.ptLayer = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.ptLayer, 28, 100 );

		this.addPaytableItems( "paytable_funnyface", 28, 25 );
		this.addPaytableItems( "paytable_triplebonus", 28, 115 );
		this.addPaytableItems( "paytable_drbingo", 210, 25 );
		this.addPaytableItems( "paytable_doctor", 210, 115 );

		this.intervalId = setInterval( this.changePTItemPos.bind( this ), 1000 );
	}

	private addPaytableItems( name: string, xPos: number, yPos: number ): void{
		let pt: egret.Point = new egret.Point( xPos, yPos );
		for( let i: number = 0; i < 12; i++ ){
			let ptItem: egret.Bitmap;
			if( i < 7 && i != 4 ) ptItem = Com.addBitmapAt( this.ptLayer, this.getAsset( name ), xPos + i % 4 * 40, yPos + Math.floor(i / 4) * 30 );
			else ptItem = Com.addBitmapAt( this.ptLayer, this.getAsset( "line_horizontal" ), xPos + 2 + i % 4 * 40, yPos + 10 + Math.floor(i / 4) * 30 );
		}
		let p1: egret.Bitmap = Com.addBitmapAt( this.ptLayer, this.getAsset( name ), xPos + 4 % 4 * 40, yPos + Math.floor(4 / 4) * 30 );
		this.getItemPosX( p1, xPos, 4, 7 );
		let p2: egret.Bitmap = Com.addBitmapAt( this.ptLayer, this.getAsset( name ), xPos + 8 % 4 * 40, yPos + Math.floor(8 / 4) * 30 );
		this.getItemPosX( p2, xPos, 8, 10 );
		let p3: egret.Bitmap = Com.addBitmapAt( this.ptLayer, this.getAsset( name ), xPos + 9 % 4 * 40, yPos + Math.floor(9 / 4) * 30 );
		this.getItemPosX( p3, xPos, 9, 11 );
	}

	private getItemPosX( item: egret.Bitmap, xPos: number, index1: number, index2: number ): void{
		item["pos0"] = xPos + index1 % 4 * 40;
		item["pos1"] = xPos + index2 % 4 * 40;
		this.changePosItems.push( item );
	}

	private changePosItems: Array<egret.Bitmap> = [];
	private changeTimesCounter: number = 0;
	private intervalId: number;

	private changePTItemPos() {
		if( !this.stage ){
			clearInterval( this.intervalId );
			return;
		}
		let counter: number = this.changeTimesCounter++;
		for( let i: number = 0; i < this.changePosItems.length; i++ ){
			this.changePosItems[i].x = this.changePosItems[i][(counter&1)?"pos0":"pos1"];
		}
	}

	private miniSpin(){
		IBingoServer.bonusGameSpinCallback = this.onBonusGame.bind( this );
		IBingoServer.bonusGameSpin( GameData.currentBet );
		this.playBtn.enabled = false;

		for( let i: number = 0; i < this.miniTtems.length; i++ ){
			this.miniTtems[i].runRandomBlur();
		}

		/*********************************/
		// this.onBonusGame( { iconIdx: [3,3,3,3], over: Math.random() < 0.2, prize: 500, prizeIconIdx: [3] } );
	}

	private spinData: Object;

	private onBonusGame( data: Object ): void{
		IBingoServer.bonusGameSpinCallback = null;

		this.spinData = data;
		if( data["prizeIconIdx"].length )this.coundPrizeIndex();
		this.delayDealData();
	}

	private coundPrizeIndex(): void{
		let data: Object = this.spinData;
		data["prizePositionIndex"] = [];
		let iconIdx: Array<number> = data["iconIdx"];
		for( let i: number = 0; i < data["prizeIconIdx"].length; i++ ){
			let index: number = data["prizeIconIdx"][i];
			if( iconIdx[0] == index && iconIdx[1] == index ){
				if( iconIdx[2] == index ){
					if( iconIdx[3] == index ) data["prizePositionIndex"][i] = 1;
					else data["prizePositionIndex"][i] = 2;
				}
				else data["prizePositionIndex"][i] = 3;
			}
			else if( iconIdx[3] == index && iconIdx[2] == index ){
				if( iconIdx[1] == index ){
					data["prizePositionIndex"][i] = 2;
				}
				else data["prizePositionIndex"][i] = 3;
			}
			else trace( "erro prizeIconIdx" );
		}
	}

	private delayDealData(): void{
		setTimeout( this.stopAnItem.bind( this ), 1000 );
	}

	private stopAnItem(): void{
		let data: Object = this.spinData;
		if( data["iconIdx"].length ){
			let i: number = data["iconIdx"].shift() - 1;
			let index: number = 3 - data["iconIdx"].length;
			this.miniTtems[index].shopOn(i);
			this.delayDealData();
		}
		else this.delayShowPrize();
	}

	private delayShowPrize(){
		setTimeout( this.showAnPrize.bind( this ), 2000 );
	}

	private showAnPrize(){
		let data: Object = this.spinData;
		if( data["prizeIconIdx"].length ){
			let i: number = data["prizeIconIdx"].shift() - 1;
			let j: number = data["prizePositionIndex"].shift() - 1;
			this.delayShowPrize();
			this.showPtBg( i, j );
		}
		else this.delayShowPrizeAwardNumber();
	}

	private showPtBg( index: number, prizeType: number ): void{
		index = index * 3 + prizeType;
		this.gettingPaytableBg.x = this.prizeAwardPositions[index].x;
		this.gettingPaytableBg.y = this.prizeAwardPositions[index].y;
		this.gettingPaytableBg.visible = true;
	}

	private _ganhoNumber1: number;
	private set ganhoNumber1( value: number ){
		this._ganhoNumber1 = value;
		this.ganhoText1.text = "" + Utils.formatCoinsNumber( Math.round( value ) );
	}
	private get ganhoNumber1(){
		return this._ganhoNumber1;
	}

	private _ganhoNumber2: number;
	private set ganhoNumber2( value: number ){
		this._ganhoNumber2 = value;
		this.ganhoText2.text = "" + Utils.formatCoinsNumber( Math.round( value ) );
	}
	private get ganhoNumber2(){
		return this._ganhoNumber2;
	}

	private delayShowPrizeAwardNumber(){
		this.gettingPaytableBg.visible = false;
		if( !this.ganhoText1 ){
			this.ganhoText1 = Com.addTextAt( this, 432, 140, 200, 40, 25, false, true );
			this.ganhoText2 = Com.addTextAt( this, 432, 220, 200, 40, 25, false, true );
			this.ganhoNumber1 = 0;
		}
		this.ganhoNumber2 = 0;

		let tw: egret.Tween = egret.Tween.get( this );
		tw.to( { ganhoNumber2: this.spinData["prize"], ganhoNumber1: this.ganhoNumber1 + this.spinData["prize"] }, 2000 );
		tw.call( this.ganhoOver.bind(this) );
	}

	private ganhoOver(): void{
		if( this.spinData["over"] === false ){
			this.playBtn.enabled = true;
			this.spinData = null;
		}
		else{
			if( this.stage ){
				this.parent.removeChild( this );
			}
		}
	}
}
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

		GraphicTool.drawRect( this, new egret.Rectangle( 0, 0, BingoBackGroundSetting.gameMask.width, BingoBackGroundSetting.gameMask.height ), 0, false, 0.4 );
		this.touchEnabled = true;

		this.showBonusTip();

		DoubleManiaMiniItem.itemAssetList = [ this.getAsset("funny_face"), this.getAsset("triplebonus"), this.getAsset("dr_bingo"), this.getAsset("doctor"), this.getAsset("x") ];
		let leftPosX: number = 270;
		let RightPosX: number = 670;
		let topUpY: number = 125;
		let topDownY: number = 280;
		let lineHeight: number = 56;
		this.prizeAwardPositions = [new egret.Point( leftPosX, topUpY ),new egret.Point( leftPosX, topUpY + lineHeight ),new egret.Point( leftPosX, topUpY + lineHeight * 2 ),new egret.Point( leftPosX, topDownY ),new egret.Point( leftPosX, topDownY + lineHeight ),new egret.Point( leftPosX, topDownY + lineHeight * 2 ),
		new egret.Point( RightPosX, topUpY ),new egret.Point( RightPosX, topUpY + lineHeight ),new egret.Point( RightPosX, topUpY + lineHeight * 2 ),new egret.Point( RightPosX, topDownY ),new egret.Point( RightPosX, topDownY + lineHeight ),new egret.Point( RightPosX, topDownY + lineHeight * 2 )];
	}

	private getAsset( str: string ): string{
		return "doublemania_mini_json." + str;
	}

	private showBonusTip(): void{
		let bonusEffect: egret.Bitmap = Com.addBitmapAtMiddle( this, this.getAsset( "BonusEffect" ), BingoBackGroundSetting.gameMask.width >> 1, BingoBackGroundSetting.gameMask.height >> 1 );

		let tw: egret.Tween = egret.Tween.get( bonusEffect );
		for( let i: number = 5; i >= 0; i -- ){
			tw.to( { scaleX: 1.5, scaleY: 1.5 }, 350);
			tw.to( { scaleX: 1, scaleY: 1 }, 350);
		}
		tw.call( this.showMiniGame, this );
	}

	private showMiniGame(): void{
		this.removeChildren();

		let bg: egret.Bitmap = Com.addBitmapAt( this, this.getAsset( "background" ), 0, 0 );

		Com.addBitmapAt( this, this.getAsset( "background_machine" ), 215, 499 );

		this.playBtn = this.buildPlayBtn();

		this.addPaytableBg( "pt_bg", 245 );
		this.addPaytableBg( "bg", 1545 );
		this.addPaytableBg( "prize_bg", 1070 );

		Com.addBitmapAt( this, this.getAsset( "line_vertical" ), 646, 160 );

		this.gettingPaytableBg = Com.addBitmapAt( this, this.getAsset( "paytable_outline" ), 60, 400 );
		this.gettingPaytableBg.visible = false;

		this.buildTaytableLayer();

		this.miniTtems = [];
		this.miniTtems[0] = this.buildMiniItemAt( 1, 272, 571 );
		this.miniTtems[1] = this.buildMiniItemAt( 2, 645, 571 );
		this.miniTtems[2] = this.buildMiniItemAt( 3, 1008, 571 );
		this.miniTtems[3] = this.buildMiniItemAt( 4, 1356, 571 );
	}

	private buildMiniItemAt( type: number, xPos: number, yPos: number ): DoubleManiaMiniItem{
		let item: DoubleManiaMiniItem = new DoubleManiaMiniItem( this.getAsset( "" + type ) );
		Com.addObjectAt( this, item, xPos, yPos );
		return item;
	}

	private buildPlayBtn(): TouchDownButton{
		let playBtnAssetName: string = this.getAsset( "button" );
		let playBtn: TouchDownButton = Com.addDownButtonAt( this, playBtnAssetName, playBtnAssetName, 1463, 988, this.miniSpin.bind( this ), true );
		let txt: TextLabel = Com.addLabelAt( this, 10, 0, playBtn.width - 20, playBtn.height, 40, true, true );
		txt.stroke = 2;
		txt.setText( MuLang.getText( "play" ) );
		txt.lineSpacing = 10;
		playBtn.addChild( txt );
		playBtn.disabledFilter = MatrixTool.colorMatrixLighter( 0.5 );
		return playBtn;
	}

	private addPaytableBg( name: string, xPos: number ): void{
		let bgBitmap: egret.Bitmap = Com.addBitmapAt( this, this.getAsset( name ), xPos, 106 );
		let titleText: egret.TextField = MDS.addGameText( this, xPos, 80, 48, 0xFFEE00, name, true, bgBitmap.width, "", 1 );
		titleText.strokeColor = 0;
		titleText.stroke = 3;
		titleText.textAlign = "center";
	}

	private buildTaytableLayer(): void{
		this.ptLayer = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.ptLayer, 270, 130 );

		this.addPaytableItems( "paytable_funnyface", 25, 25 );
		this.addPaytableItems( "paytable_triplebonus", 25, 180 );
		this.addPaytableItems( "paytable_drbingo", 425, 25 );
		this.addPaytableItems( "paytable_doctor", 425, 180 );

		this.intervalId = setInterval( this.changePTItemPos.bind( this ), 1000 );

		let timesArr: Array<number> = [ 500, 225, 40, 400, 150, 25, 325, 90, 15, 250, 60, 10 ];
		for( let i: number = 0; i < timesArr.length; i++ ){
			this.addTimesText( i, "x" + timesArr[i] );
		}
	}

	private addTimesText( i: number, str: string ){
		let tx: TextLabel = MDS.addGameText( this.ptLayer, i > 5 ? 680 : 280, 8 + 54 * (i % 6), 30, 0, str, false, 80, "", 1 );
		tx.bold = true;
		tx.textAlign = "right";
		tx.fontFamily = "Arial";
	}

	private addPaytableItems( name: string, xPos: number, yPos: number ): void{
		let pt: egret.Point = new egret.Point( xPos, yPos );
		for( let i: number = 0; i < 12; i++ ){
			let ptItem: egret.Bitmap;
			if( i < 7 && i != 4 ) ptItem = Com.addBitmapAtMiddle( this.ptLayer, this.getAsset( name ), xPos + i % 4 * 72, yPos + Math.floor(i / 4) * 56 );
			else ptItem = Com.addBitmapAtMiddle( this.ptLayer, this.getAsset( "line_horizontal" ), xPos + 2 + i % 4 * 72, yPos + 10 + Math.floor(i / 4) * 56 );
		}
		let p1: egret.Bitmap = Com.addBitmapAtMiddle( this.ptLayer, this.getAsset( name ), xPos + 4 % 4 * 72, yPos + Math.floor(4 / 4) * 56 );
		this.getItemPosX( p1, xPos, 4, 7 );
		let p2: egret.Bitmap = Com.addBitmapAtMiddle( this.ptLayer, this.getAsset( name ), xPos + 8 % 4 * 72, yPos + Math.floor(8 / 4) * 56 );
		this.getItemPosX( p2, xPos, 8, 10 );
		let p3: egret.Bitmap = Com.addBitmapAtMiddle( this.ptLayer, this.getAsset( name ), xPos + 9 % 4 * 72, yPos + Math.floor(9 / 4) * 56 );
		this.getItemPosX( p3, xPos, 9, 11 );
	}

	private getItemPosX( item: egret.Bitmap, xPos: number, index1: number, index2: number ): void{
		item["pos0"] = xPos + index1 % 4 * 72;
		item["pos1"] = xPos + index2 % 4 * 72;
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
		setTimeout( this.showAnPrize.bind( this ), 800 );
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

		let ev: egret.Event = new egret.Event( "miniGameCoins" );
		ev.data = this.prizeAwardPositions[index];
		this.dispatchEvent( ev );
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
		if( !this.ganhoText1 ){
			this.ganhoText1 = Com.addTextAt( this, 1205, 150, 200, 40, 25, false, true );
			this.ganhoText2 = Com.addTextAt( this, 1205, 220, 200, 40, 25, false, true );
			this.ganhoNumber1 = 0;
		}
		this.ganhoNumber2 = 0;

		let isOver: boolean = this.spinData["over"];
		if( !isOver )this.playBtn.enabled = true;

		let tw: egret.Tween = egret.Tween.get( this );
		tw.to( { ganhoNumber2: this.spinData["prize"], ganhoNumber1: this.ganhoNumber1 + this.spinData["prize"] }, 2000 );
		tw.call( this.ganhoOver.bind(this, isOver) );

	}

	private ganhoOver( isOver: boolean ): void{
		this.gettingPaytableBg.visible = false;
		if( isOver ){
			if( this.stage ){
				let ev: egret.Event = new egret.Event( "miniGameEnd" );
				ev.data = this.ganhoNumber1;
				this.dispatchEvent( ev );
			}
		}
	}
}
class LemonGame extends egret.DisplayObjectContainer {

	public static maxPlateCount: number = 5;
	public static boxNames: Array<string> = [ "ketchup", "cheese", "vegetable" ];

	private rightArea: egret.DisplayObjectContainer;
	private track: egret.Bitmap;

	private _trackY: number;
	private get trackY(): number{
		return this._trackY;
	}
	private set trackY( value: number ){
		this._trackY = value;
		while( value > 0 ) value -= 38;
		this.track.y = value;
		for( let i: number = 0; i < 3; i++ ){
			this.choseBoxes[i].y = 130 * i - 350 + this._trackY;
		}
	}

	private choseBoxes: Array<TouchDownButton>;
	private plate: Array<egret.Bitmap>;
	private plateButtons: Array<TouchDownButton>;

	private olderArray: Array<number>;
	private plateCount: number;

	private getPlateTxt: egret.TextField;
	private getRoundsTxt: egret.TextField;

	private type1Count: number = 0;
	private type2Count: number = 0;
	private roundCount: number = 0;

	private type0ToolLeft: number = 0;

	private type1Btn: TouchDownButton;
	private type2Btn: TouchDownButton;

	private openBoxType: number;

	private lemonAwards: Array<number> = [0,0,0];
	private rewardArea: egret.DisplayObjectContainer;
	private boxIndex: number;

	private hasLookin: boolean;//if used type2Btn

	private maxValue: number = 4;

	private animationType: number;

	private roundTx: egret.TextField;

	public constructor( bet: number ) {
		super();

		IBingoServer.lemonGameCallback = this.onLemonData.bind( this );
		IBingoServer.lemonGame( "join", bet );

		Com.addBitmapAt( this, this.assetStr( "bg" ), 0, 0 );

		this.plate = [];
		for( let i: number = 0; i < 15; i++ ){
			let line: number = Math.floor( i / 5 );
			let row: number = i % 5;
			this.plate[i] = Com.addBitmapAt( this, this.assetStr( "plate_back" ), this.plateX( row ), this.plateY( line ) );
			this.plate[i].anchorOffsetX = 130;
			this.plate[i].anchorOffsetY = 130;

			let tw: egret.Tween = egret.Tween.get( this.plate[i] );
			tw.wait( ( 2 - line ) * 500 + Math.random() * 300 );
			tw.to( { y: this.plateY( line ) }, 800, egret.Ease.bounceOut );
			if( i == 14 )tw.call( this.endPlateFull.bind(this) );
		}

		this.olderArray = [];

		this.getPlateTxt = Com.addTextAt(this, 500, 40, 1000, 50, 50, false, true );
        this.getPlateTxt.fontFamily = "LuckiestGuy";
        this.getPlateTxt.textColor = 0x531001;

		this.getRoundsTxt = Com.addTextAt(this, 500, 1050, 1000, 50, 50, false, true );
        this.getRoundsTxt.fontFamily = "LuckiestGuy";
        this.getRoundsTxt.textColor = 0x531001;

		this.plateCount = 0;
		this.showRoundChange();
	}

	private plateX( row: number ): number{
		return 186 + row * 337 + 130;
	}

	private plateY( line: number ): number{
		return 98 + line * 325 + 130;
	}

	private endPlateFull(){
		this.plateButtons = [];
		for( let i: number = 0; i < 15; i++ ){
			let line: number = Math.floor( i / 5 );
			let row: number = i % 5;
			this.plateButtons[i] = Com.addDownButtonAt( this, this.assetStr( "plate_back" ), this.assetStr( "plate_back" ), this.plateX( row ) - 130, this.plateY( line ) - 130, this.clickPlate.bind(this), true );
			this.plateButtons[i].name = "" + i;
			this.plateButtons[i].alpha = 0.05;
		}

		if( localStorage.getItem( "lemonTT" ) || !this.parent ) return;
		else{
			localStorage.setItem( "lemonTT", "true" );
			this.parent.dispatchEvent( new egret.Event( "new_game_tutorail" ) );
		}
	}

	private clickPlate( event: egret.TouchEvent ){
		let btn: TouchDownButton = event.target as TouchDownButton;
		btn.touchEnabled = false;

		let index: number = parseInt( btn.name );
		this.olderArray.push( index );

		IBingoServer.lemonGame( "select_cards" );

		this.countPlate();

		this.dispatchEvent( new egret.Event("buttonClick") );
	}

	private showPizza(){
		this.removeChildren();

		Com.addBitmapAt( this, this.assetStr( "bg_cake" ), 0, 0 );

		this.rightArea = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.rightArea, 584, 0 );
		this.rightArea.mask = new egret.Rectangle( 0, 0, 154, 462 );

		this.track = Com.addBitmapAt( this.rightArea, this.assetStr( "track" ), 0, 0 );
		Com.addBitmapAt( this, this.assetStr( "track_frame" ), 555, 0 );

		this.choseBoxes = [];
		for( let i: number = 0; i < 3; i++ ){
			this.choseBoxes[i] = Com.addDownButtonAt( this.rightArea, this.assetStr( "box_close" ), this.assetStr( "box_close" ), 77, - 500, this.chooseCard.bind(this), true );
			this.choseBoxes[i].name = "" + i;
		}

		this.trackY = 0;
		this.hasLookin = false;

		if( this.rewardArea )this.addChild( this.rewardArea );

		this.startMove();

		this.type1Btn = Com.addDownButtonAt( this, this.assetStr( "plate_knife" ), this.assetStr( "plate_knife" ), 80, 80, this.onType1Button.bind(this), true );
		this.type2Btn = Com.addDownButtonAt( this, this.assetStr( "plate_scissors" ), this.assetStr( "plate_scissors" ), 500, 80, this.onType2Button.bind(this), true );

		this.enablePizzaButton( false );

		this.roundTx = Com.addTextAt( this, 557, 150, 30, 165, 20, false, true );
		this.roundTx.verticalAlign = "middle";
		this.roundTx.text = this.getRoundString();
	}

	private getRoundString(): string{
		let str: string = "" + this.roundCount;
		let roundStr: string = "ROUND";
		let tempArr: Array<string> = roundStr.split("");
		roundStr = "\n" + tempArr.join("\n");
		return str + roundStr;
	}

	private enablePizzaButton( enable: boolean ): void{
		let boxEnable: boolean = enable && this.roundCount > 0;
		for( let i: number = 0; i < 3; i++ ){
			this.choseBoxes[i].touchEnabled = boxEnable;
		}
		this.setTypeButtonState( this.type1Btn, enable && this.type1Count > 0 );
		this.setTypeButtonState( this.type2Btn, enable && this.type2Count > 0 );
	}

	private setTypeButtonState( targetButton: TouchDownButton, enable: boolean ){
		targetButton.touchEnabled = enable;
		let filterArray: Array<egret.Filter> = [];
		if( !enable ) filterArray.push( MatrixTool.colorMatrixLighter( 0.5 ) );
		targetButton.filters = filterArray;
	}

	private assetStr( str: string ): string{
		return "lemonGame_json." + str;
	}

	private onLemonData( data: Object ){
		if( data["lemonCard"] ){
			let index: number = this.olderArray.shift();
			this.startPlateRotate( index, data["lemonCard"].type, data["lemonCard"].value );
		}
		else if( data["lemonBoxs"] ){
			this.showWhatInBox( data["lemonBoxs"] );
		}
		else if( data["lemonPizzaMaterials"] ){
			this.maxValue = data["lemonPizzaMaterials"].pop();
		}
		else if( data["lemonBuffsReward"] ){
			this.endReward( data["lemonBuffsReward"] );
		}
	}

	private startPlateRotate( index: number, type: number, round: number ): void{
		let plate: egret.Bitmap = this.plate[index];
		let tw: egret.Tween = egret.Tween.get( plate );
		tw.to( { scaleX: 0 }, 300 );
		tw.call( this.continuePlateRotate.bind( this, index, type, round ) );

		SoundManager.play( "lemon_choose_plate_mp3" );
	}

	private continuePlateRotate( index: number, type: number, round: number ): void{
		let plate: egret.Bitmap = this.plate[index];
		this.removeChild( plate );
		let newPlate: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		newPlate.anchorOffsetX = plate.anchorOffsetX;
		newPlate.anchorOffsetY = plate.anchorOffsetY;
		let assetName: string;
		if( type == 0 ){
			assetName = "plate_knife";
			this.type1Count++;
		}
		else if( type == 1 ){
			assetName = "plate_scissors";
			this.type2Count++;
		}
		else if( type == 2 ){
			assetName = round + "_rounds";
			this.roundCount += round;
		}
		this.showRoundChange();
		Com.addBitmapAt( newPlate, this.assetStr( assetName ), 0, 0 );
		Com.addObjectAt( this, newPlate, plate.x, plate.y );

		newPlate.scaleX = 0;
		let tw: egret.Tween = egret.Tween.get( newPlate );
		tw.to( { scaleX: 1 }, 300 );
	}

	private showRoundChange(){
		this.getRoundsTxt.text = "" + this.roundCount + "  ROUNDS" ;
		let str: string = "";
		let num: number = LemonGame.maxPlateCount - this.plateCount;
		switch( GlobelSettings.language ){
			case "en": str = "Choose  " + num + "  plates";
				break;
			case "es": str = "Elige  " + num + "  platos";
				break;
			case "pt": str = "Escolha  " + num + "  pratos";
				break;
			default: console.error( "language error" );
				break;
		}
		this.getPlateTxt.text = str;
	}

	private countPlate(){
		this.plateCount++;
		if( this.plateCount >= LemonGame.maxPlateCount ){
			for( let i: number = 0; i < 15; i++ ){
				this.removeChild( this.plateButtons[i] );
			}
			setTimeout( this.showPizza.bind( this ), 2000 );
		}
	}

	private startMove(){
		let tw: egret.Tween = egret.Tween.get( this );
		tw.to( { trackY: 450 }, 1000 );
		tw.call( this.letChoose );
	}

	private letChoose(): void{
		this.enablePizzaButton( true );
	}

	private chooseCard( event: egret.TouchEvent ){
		this.enablePizzaButton( false );
		let btn: TouchDownButton = event.target as TouchDownButton;

		this.boxIndex = parseInt( btn.name );
		switch( this.openBoxType ){
			case 0:	this.type0ToolLeft--;				
				break;
			case 1: if( this.hasLookin )this.roundCount--;
				break;
			default: this.openBoxType = 2;
			case 2:
				this.roundCount--;
				break;
		}

		IBingoServer.lemonGame( "open_box", 0, this.openBoxType, ( this.openBoxType != 1 || this.hasLookin ) ? this.boxIndex : -1 );

		this.dispatchEvent( new egret.Event("buttonClick") );
	}

	private onType1Button( event: egret.TouchEvent ): void{
		this.setTypeButtonState( this.type1Btn, false );
		this.setTypeButtonState( this.type2Btn, false );
		this.type1Count--;
		this.openBoxType = 0;
		this.type0ToolLeft = 2;
		for( let i: number = 0; i < 3; i++ ){
			this.choseBoxes[i].touchEnabled = true;
		}

		this.addOuterShadow();

		this.dispatchEvent( new egret.Event("buttonClick") );
	}

	private onType2Button( event: egret.TouchEvent ): void{
		this.setTypeButtonState( this.type2Btn, false );
		this.type2Count--;
		this.openBoxType = 1;

		this.addOuterShadow();

		this.dispatchEvent( new egret.Event("buttonClick") );
	}

	/**
	 * add outer shadow
	 */
	private addOuterShadow(): void {
		for( let i: number = 0; i < 3; i++ ){
			this.choseBoxes[i].filters = [new egret.DropShadowFilter(1, 45, 0xFFFF00, 1, 20, 20, 1, egret.BitmapFilterQuality.HIGH)];
		}
	}

	/**
	 * clear outer shadow
	 */
	private clearOuterShadow(): void {
		for( let i: number = 0; i < 3; i++ ){
			this.choseBoxes[i].filters = [];
		}
	}

	private showWhatInBox( inBoxArray: Array<Object> ){
		switch( this.openBoxType ){
			case 0:
				for( let i: number = 0; i < 3; i++ ){
					let inBoxName: string = LemonGame.boxNames[ inBoxArray[i]["type"] ];
					inBoxName += "_0" + inBoxArray[i]["value"];
					if( i == this.boxIndex ){
						let box: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
						Com.addBitmapAt( box, this.assetStr( "box_open" ), 0, 0 );
						Com.addObjectAt( this.rightArea, box, 4, i * 130 - 8 );
						let inBox: egret.Bitmap = Com.addBitmapAt( this.rightArea, this.assetStr( inBoxName ), 30, this.choseBoxes[i].y - 32 );
						this.lemonAwards[ inBoxArray[i]["type"] ] += inBoxArray[i]["value"];
						this.choseBoxes[this.boxIndex].filters = [];
					}
					this.animationType = inBoxArray[i]["type"];
				}
				break;
			case 1:
				for( let i: number = 0; i < 3; i++ ){
					let inBoxName: string = LemonGame.boxNames[ inBoxArray[i]["type"] ];
					inBoxName += "_0" + inBoxArray[i]["value"];
					if( i == this.boxIndex ){
						if( this.hasLookin ){
							let box: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
							Com.addBitmapAt( box, this.assetStr( "box_open" ), 0, 0 );
							Com.addObjectAt( this.rightArea, box, 4, i * 130 - 8 );
							let inBox: egret.Bitmap = Com.addBitmapAt( this.rightArea, this.assetStr( inBoxName ), 30, this.choseBoxes[i].y - 32 );
							this.lemonAwards[ inBoxArray[i]["type"] ] += inBoxArray[i]["value"];
							this.openBoxType = 2;
						}
						else{
							let inBox: egret.Bitmap = Com.addBitmapAt( this.rightArea, this.assetStr( inBoxName ), 30, this.choseBoxes[i].y - 32 );
							inBox.alpha = 0.5;
						}
					}
					this.animationType = inBoxArray[i]["type"];

					this.choseBoxes[i].filters = [];
				}
				break;
			case 2:
				for( let i: number = 0; i < 3; i++ ){
					let inBoxName: string = LemonGame.boxNames[ inBoxArray[i]["type"] ];
					inBoxName += "_0" + inBoxArray[i]["value"];
					let box: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
					Com.addBitmapAt( box, this.assetStr( "box_open" ), 0, 0 );
					Com.addObjectAt( this.rightArea, box, 4, i * 130 - 8 );
					let inBox: egret.Bitmap = Com.addBitmapAt( this.rightArea, this.assetStr( inBoxName ), 30, this.choseBoxes[i].y - 32 );
					if( i == this.boxIndex ){
						this.lemonAwards[ inBoxArray[i]["type"] ] += inBoxArray[i]["value"];
					}
					else{
						inBox.alpha = 0.5;
					}
					this.animationType = inBoxArray[i]["type"];

					this.choseBoxes[i].filters = [];
				}
				break;
			default:
				console.error( "openBoxTypeError" );
				break;
		}

		this.roundTx.text = this.getRoundString();

		if( this.roundCount > 0 && this.openBoxType == 1 ){
			for( let i: number = 0; i < 3; i++ ){
				this.choseBoxes[i].touchEnabled = true;
			}
			this.hasLookin = true;
			return;
		}

		if( this.type0ToolLeft > 0 ){
			for( let i: number = 0; i < 3; i++ ){
				if( i != this.boxIndex )this.choseBoxes[i].touchEnabled = true;
			}
			return;
		}

		if( this.openBoxType == 0 && this.type0ToolLeft <= 0 ){
			this.openBoxType = 2;

			this.clearOuterShadow();
		}

		this.showAwardResuilt();
	}

	private showAwardResuilt(){
		this.rewardArea = new egret.DisplayObjectContainer;
		this.rewardArea.x = 90;
		this.rewardArea.y = 100;
		this.addChild( this.rewardArea );

		this.showPizzaItems( 0, 3, 0, 0 );
		this.showPizzaItems( 1, 9, 22, 8 );
		this.showPizzaItems( 2, 12, 24, 8 );

		this.rewardAreaShowUp();
		this.showrewardAnimation();

		this.checkLemonOver();
	}

	private showPizzaItems( itemIndex: number, maxItemValue: number, offsetX: number, offsetY: number ): void{
		let itemNumbers: number = this.lemonAwards[itemIndex];
		if( itemNumbers == 0 )return;
		if( itemNumbers > maxItemValue )itemNumbers = maxItemValue;
		let rewardName: string = "pizza_" + LemonGame.boxNames[ itemIndex ] + "_" + ( itemNumbers > 9 ? itemNumbers : "0" + itemNumbers );
		Com.addBitmapAt( this.rewardArea, this.assetStr(rewardName), offsetX, offsetY );
	}

	private rewardAreaShowUp(): void{
		this.rewardArea.alpha = 0;
		let tw: egret.Tween = egret.Tween.get( this.rewardArea );
		tw.wait( 800 );
		tw.to( { alpha: 1 }, 300 );
		tw.to( { alpha: 0 }, 300 );
		tw.to( { alpha: 1 }, 300 );
	}

	private showrewardAnimation(): void{
		switch(this.animationType){
			case 0: this.amin0();
				break;
			case 1: this.amin1();
				break;
			case 2: this.amin2();
				break;
			default: trace( "error lemon type" );
		}
	}

	private checkLemonOver(){
		if( ( this.type1Count == 0 && this.roundCount == 0 ) || this.lemonAwards[2] >= this.maxValue ){
			setTimeout( this.gameOver.bind(this), 2000 );
		}
		else{
			if (this.type1Count > 0 && this.roundCount === 0) {
				this.type1Btn.filters = [new egret.DropShadowFilter(4, 45, 0xFFFF00, 1, 10, 10, 1, egret.BitmapFilterQuality.HIGH)];
			}

			setTimeout( this.showPizza.bind( this ), 2000 );
		}
	}

	private gameOver(){
		IBingoServer.lemonGame( "over" );
	}

	private endReward( rewardCoins: number ): void{
		IBingoServer.lemonGameCallback = null;
		this.showRewardCoins( rewardCoins );

		let ev: egret.Event = new egret.Event( "gameOver" );
		ev["rewardCoins"] = rewardCoins;
		this.dispatchEvent( ev );
	}

	private showRewardCoins( rewardCoins: number ): void{
		this.rightArea.removeChildren();
		this.track = Com.addBitmapAt( this.rightArea, this.assetStr( "track" ), 0, 0 );
		let tx: egret.TextField = Com.addTextAt( this.rightArea, 0, 110, 154, 230, 15, false, true );

		let str: string = "";
		switch( GlobelSettings.language ){
			case "en": str = "YOU WIN\n" + rewardCoins + "\ncoins";
				break;
			case "es": str = "TU GANAS\n" + rewardCoins + "\nmonedas";
				break;
			case "pt": str = "VOCÊ GANHOU\n" + rewardCoins + "\nmoedas";
				break;
			default: console.error( "language error" );
				break;
		}
		tx.text = str;
		tx.lineSpacing = 20;
		Com.addBitmapAt( this.rightArea, this.assetStr( "icon_end" ), 35, 230 );
	}

	private amin0(): void{
		let anim: egret.Bitmap = Com.addBitmapAt( this, this.assetStr( "ketchup_01" ), 500, 80 ); 
		anim.rotation = -125;
		anim.scaleX = anim.scaleY = 2;
		let tw: egret.Tween = egret.Tween.get( anim );
		tw.to( { x: 450, y: 100 }, 150 );
		tw.to( { x: 550, y: 60 }, 300 );
		tw.to( { x: 450, y: 100 }, 300 );
		tw.to( { x: 500, y: 80, alpha: 0 }, 150 );
		SoundManager.play( "lemon_ketchup_mp3" );
	}

	private amin1(): void{
		for( let i: number = 0; i < 15; i++ ){
			let anim: egret.Bitmap = Com.addBitmapAt( this, this.assetStr( "cheese_01" ), 100 + Math.random() * 340, 30 );
			anim.scaleX = anim.scaleY = Math.random() * 0.8 + 0.8;
			let tw: egret.Tween = egret.Tween.get( anim );
			tw.wait( Math.random() * 350 );
			tw.to( { y: 140 + Math.random() * 90 }, 400, egret.Ease.sineIn );
			tw.to( { alpha: 0 }, 150 );
		}
		SoundManager.play( "lemon_cheese_mp3" );
	}

	private static foodOnPizza: Array<string> = ["green_pepper","ham","tomato","mushroom"];

	private amin2(): void{
		for( let i: number = 0; i < 15; i++ ){
			let anim: egret.Bitmap = Com.addBitmapAt( this, this.assetStr( LemonGame.foodOnPizza[ Math.floor( Math.random() * 4 ) ] ), 100 + Math.random() * 300, 30 );
			let tw: egret.Tween = egret.Tween.get( anim );
			tw.wait( Math.random() * 350 );
			tw.to( { y: 140 + Math.random() * 90 }, 400, egret.Ease.sineIn );
			tw.to( { alpha: 0 }, 150 );
		}
		SoundManager.play( "lemon_vegetable_mp3" );
	}
}
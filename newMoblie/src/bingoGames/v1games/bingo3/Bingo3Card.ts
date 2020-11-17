class Bingo3Card extends GameCard{

	private fitPaytalbes: Array<string> = [];

	private ganhoLayer: egret.DisplayObjectContainer;
	private ganhoBg: egret.Bitmap;
	private ganhoTxtLeft: TextLabel;
	private ganhoTxtRight: TextLabel;
	private ganhoBlinkCounter: number = 0;

	public constructor( cardId: number ) {
		super( cardId );
	}

	protected onAdd(event: egret.Event) {
        super.onAdd(event);

		this.cardText.fontFamily = "Arial";
		this.cardText.bold = true;
		this.betText.fontFamily = "Arial";
		this.betText.bold = true;

		this.ganhoLayer = new egret.DisplayObjectContainer;
		this.addChild( this.ganhoLayer );

		setInterval( this.winGanhoblink.bind(this), 400 );
	}

	public getBgColor(){
		if( GameCardUISettings.titleColors ){
			this.bg.filters = [ MatrixTool.colorMatrixPure( GameCardUISettings.cardTitleColor ) ];
		}
	}

	public clearStatus(): void{
		super.clearStatus();
		this.ganhoLayer.removeChildren();
	}

	public clearFitEffect(){
		super.clearFitEffect();
		this.fitPaytalbes = [];
	}

	public showfitEffect( assetName: string, fitIndex: Array<boolean> ){
		super.showfitEffect( assetName, fitIndex );
		this.fitPaytalbes.push( assetName );
	}

	public showPaytablesGot(){
		if( !this.fitPaytalbes.length ) return;
		this.ganhoBg = Com.addBitmapAt( this.ganhoLayer, BingoMachine.getAssetStr( "fundo_cartela_blink" ), 0, 0 );
		this.ganhoBlinkCounter = 0;
		let rect: egret.Rectangle = GameCardUISettings.cardTextRect;
		this.ganhoTxtLeft = MDS.addGameText( this.ganhoLayer, rect.x, rect.y, rect.height, 0, "win", false, GameCardUISettings.betTextRect.width, "", 1 );
		let rect2: egret.Rectangle = GameCardUISettings.betTextRect;
		this.ganhoTxtRight = MDS.addGameText( this.ganhoLayer, rect2.x, rect2.y, rect2.height, 0, "", false, rect2.width, "", 1 );
		this.ganhoTxtRight.textAlign = "right";
		let winTimes: number = 0;
		for( let i: number = 0; i < this.fitPaytalbes.length; i++ ){
			winTimes += PayTableManager.payTablesDictionary[this.fitPaytalbes[i]].multiple;
		}
		this.ganhoTxtRight.text = GameData.currentBet * winTimes + "";
		this.winGanhoblink();
	}

	private winGanhoblink(){
		if( !this.ganhoBg.parent ) return;
		let per: number = this.ganhoBlinkCounter++ & 1;
		if( per ){
			this.ganhoBg.filters = [ MatrixTool.colorMatrixPure( 0xFFFF00 ) ];
			this.ganhoTxtRight.textColor = this.ganhoTxtLeft.textColor = 0xFF0000;
		}
		else{
			this.ganhoBg.filters = [ MatrixTool.colorMatrixPure( 0xFF0000 ) ];
			this.ganhoTxtRight.textColor = this.ganhoTxtLeft.textColor = 0xFFFF00;
		}
	}
}
class Pachinko2PaytableUI extends PaytableUI{

	private p2Grids: Array<egret.Bitmap>;

	public set blink(value:Boolean){
		this._blink = value;
		this.currentEffect = 0;
		if( value ){
			this.addEventListener( egret.Event.ENTER_FRAME, this.onFrame, this );
			for( var i: number = 0; i < this.blinkGridsIndexs.length; i++ ){
				this.addChild( this.p2Grids[this.blinkGridsIndexs[i]] );
			}
		}
		else{
			for( var i: number = 0; i < this.p2Grids.length; i++ ){
				if( this.contains( this.p2Grids[i] ) ) this.removeChild( this.p2Grids[i] );
			}
			this.removeEventListener( egret.Event.ENTER_FRAME, this.onFrame, this );
		}
	}

	public constructor( useBg: boolean ) {
		super( useBg );
		this.scaleX = this.scaleY = 0.8;
	}

	public initUI(){
		super.initUI();

		this.tx.x = this.bg.width + 10;
		this.tx.y = this.bg.height - this.tx.size >> 1;
		this.tx.bold = true;
		
		this.p2Grids = [];
		for( let i: number = 0; i < 15; i++ ){
			this.p2Grids[i] = Com.createBitmapByName( BingoMachine.getAssetStr( "Paytable_one_left" ) );
			this.p2Grids[i].x = i % 5 * 20 + 3;
			this.p2Grids[i].y = Math.floor( i / 5 ) * 19 + 2;
		}
	}

	public focus(){
		super.focus();
		this.tx.textColor = 0xFF0000;
	}

	public clearStatus(): void{
		super.clearStatus();
		this.tx.textColor = 0xFFFFFF;
	}

	protected onFrame(event:egret.Event):void{
		this.currentEffect++;
		let isShow: boolean = Boolean( (this.currentEffect>>4) & 1 );
		for( var i: number = 0; i < this.blinkGridsIndexs.length; i++ ){
			this.p2Grids[this.blinkGridsIndexs[i]].visible = isShow;
		}
	}
}
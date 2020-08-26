class ShowballPaytableUI extends PaytableUI{

	private focusBg: egret.Bitmap;

	public set blink(value:Boolean){
		this._blink = value;
		this.currentEffect = 0;
		if( value ){
			this.addEventListener( egret.Event.ENTER_FRAME, this.onFrame, this );
			for( var i: number = 0; i < this.blinkGridsIndexs.length; i++ ){
				this.addChild( this.grids[this.blinkGridsIndexs[i]] );
			}
		}
		else{
			for( var i: number = 0; i < this.grids.length; i++ ){
				if( this.contains( this.grids[i] ) ) this.removeChild( this.grids[i] );
			}
			this.removeEventListener( egret.Event.ENTER_FRAME, this.onFrame, this );
		}
	}

	public constructor( useBg: boolean ) {
		super( useBg );

		this.scaleX = this.scaleY = 0.75;
		this.focusBg = Com.addBitmapAt( this, BingoMachine.getAssetStr( "outline" ), -4, -4 );
		this.addChildAt( this.focusBg, 0 );
		this.focusBg.visible = false;
	}

	public initUI(){
		super.initUI();

		for( let i: number = 0; i < this.grids.length; i++ ){
			this.grids[i].x = i % 5 * 23 + 5;
			this.grids[i].y = Math.floor( i / 5 ) * 23 + 4;
			GraphicTool.drawRect( this.grids[i], new egret.Rectangle( 0, 0, 19, 20 ), 0xFF0000, true, 1, 8 );
		}
	}

	public clearStatus(): void{
		this.blink = false;
		this.focusBg.visible = false;
		this.tx.textColor = 0xFFFFFF;
	}

	public focus(){
		this.focusBg.visible = true;
		this.tx.textColor = 0xFF0000;
	}

	protected onFrame(event:egret.Event):void{
		this.currentEffect++;
		let isShow: boolean = Boolean( (this.currentEffect>>4) & 1 );
		for( var i: number = 0; i < this.blinkGridsIndexs.length; i++ ){
			this.grids[this.blinkGridsIndexs[i]].visible = isShow;
		}
	}
}
class DoubleTurbo90PTBG extends egret.DisplayObjectContainer{

	private rainbow: egret.Bitmap;

	private ptBgs: Array<egret.Bitmap>;
	private ptBgsLayer: egret.DisplayObjectContainer;

	public constructor() {
		super();

		Com.addBitmapAt( this, BingoMachine.getAssetStr( "paytable_frame" ), -20, 0 );
		this.rainbow = Com.addBitmapAtMiddle( this, BingoMachine.getAssetStr( "rainbow" ), 225, 88 );
		this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );
		let msk: egret.Bitmap = Com.addBitmapAt( this, BingoMachine.getAssetStr( "paytable_mask" ), 0, 0 );
		this.rainbow.mask = msk;
		Com.addBitmapAtMiddle( this, BingoMachine.getAssetStr( "paytable_bg" ), 225, 88 );

		this.addPtBgs();
	}

	private onAdd(event: egret.Event){
		this.rotateAgain();
	}

	private rotateAgain(){
		if( !this.stage )return;
		this.rainbow.rotation = 0;
		TweenerTool.tweenTo( this.rainbow, { rotation: -360 }, 5000, 0, this.rotateAgain.bind( this ) );
	}
	
	private addPtBgs(){
		this.ptBgsLayer = new egret.DisplayObjectContainer;
		this.addChild( this.ptBgsLayer );

		let msk: egret.Bitmap = Com.addBitmapAtMiddle( this, BingoMachine.getAssetStr( "paytable_bg" ), 225, 88 );
		this.ptBgsLayer.mask = msk;

		this.ptBgs = [];
		for( let i: number = 0; i < 4; i++ ){
			this.ptBgs[i] = Com.addBitmapAt( this.ptBgsLayer, BingoMachine.getAssetStr( "paytable_winline" ), 7, 17 + 35 * i );
			if( i == 0 ){
				this.ptBgs[i].height = 48;
				this.ptBgs[i].y = 4;
			}
			else if( i == 3 ){
				this.ptBgs[i].height = 48;
			}
			this.ptBgs[i].visible = false;
		}
	}

	public showPt( index: number ){
		this.ptBgs[index].visible = true;
	}

	public clearPaytableFgs(){
		for( let i: number = 0; i < 4; i++ ){
            this.ptBgs[i].visible = false;
        }
	}
}
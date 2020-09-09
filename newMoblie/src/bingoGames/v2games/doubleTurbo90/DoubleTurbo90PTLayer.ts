class DoubleTurbo90PTLayer extends PaytableLayer{

	private rainbow: egret.Bitmap;

	private paytableTitles: Array<TextLabel>;
	private ptBgsLayer: egret.DisplayObjectContainer;

	public constructor() {
		super();

		this.x = 284;
		this.y = 16;

		Com.addBitmapAt( this, BingoMachine.getAssetStr( "paytable_frame" ), -20, 0 );
		this.rainbow = Com.addBitmapAtMiddle( this, BingoMachine.getAssetStr( "rainbow" ), 225, 88 );
		this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );
		let msk: egret.Bitmap = Com.addBitmapAt( this, BingoMachine.getAssetStr( "paytable_mask" ), 0, 0 );
		this.rainbow.mask = msk;
		Com.addBitmapAtMiddle( this, BingoMachine.getAssetStr( "paytable_bg" ), 225, 88 );

		this.buildFgs();
		this.buildTitleText();
	}

	private onAdd(event: egret.Event){
		this.rotateAgain();
	}

	private rotateAgain(){
		if( !this.stage )return;
		this.rainbow.rotation = 0;
		TweenerTool.tweenTo( this.rainbow, { rotation: -360 }, 5000, 0, this.rotateAgain.bind( this ) );
	}
	
	protected buildFgs(){
		this.ptBgsLayer = new egret.DisplayObjectContainer;
		this.addChild( this.ptBgsLayer );

		let msk: egret.Bitmap = Com.addBitmapAtMiddle( this, BingoMachine.getAssetStr( "paytable_bg" ), 225, 88 );
		this.ptBgsLayer.mask = msk;

		this.paytableFgs = [];
		for( let i: number = 0; i < 4; i++ ){
			this.paytableFgs[i] = Com.addBitmapAt( this.ptBgsLayer, BingoMachine.getAssetStr( "paytable_winline" ), 7, 17 + 35 * i );
			if( i == 0 ){
				this.paytableFgs[i].height = 48;
				this.paytableFgs[i].y = 4;
			}
			else if( i == 3 ){
				this.paytableFgs[i].height = 48;
			}
			this.paytableFgs[i].visible = false;
		}
	}

	protected buildTitleText(){
		this.paytableTitles = [];
		this.paytableTitles[0] = this.addDouble90GameText( 34, "bingo");
        this.paytableTitles[1] = this.addDouble90GameText( 72, "double line");
        this.paytableTitles[2] = this.addDouble90GameText( 110, "line");
        this.paytableTitles[3] = this.addDouble90GameText( 148, "four corners");
	}

    private addDouble90GameText( yPos: number, textItem: string ): TextLabel{
        let tx: TextLabel = MDS.addGameText( this, 315 - this.x, yPos - this.y, 30, 0x46C8F5, textItem, false, 200, "", 0.9 );
        tx.fontFamily = "Arial";
        tx.bold = true;
        return tx;
    }

	public addPaytableUI(){
        super.addPaytableUI();

		let pts: Object = PayTableManager.payTablesDictionary;
        for( let payTable in pts ){
            let pos: Object = pts[payTable].position;
            let y: number = pos["y"];
            y = Math.floor( y / 38 ) * 38 + 34;
            pts[payTable].UI.y = y - this.y;
            pts[payTable].UI.x = 600 - this.x;
            pts[payTable].UI.addEventListener( "paytableFitEvent", this.payTableFit, this );
            let tx: egret.TextField = pts[payTable].UI["tx"];
            tx.width = 110;
            tx.textAlign = "right";
        }
	}

	protected payTableFit( event: egret.Event ){
        let str: string = event.target["tx"].text;
        if( str == "x1000" ) this.paytableShow( 0 );
        else if( str == "x100" ) this.paytableShow( 1 );
        else if( str == "x4" ) this.paytableShow( 2 );
        else if( str == "x1" ) this.paytableShow( 3 );
    }

	private paytableShow( index: number ){
		this.paytableFgs[index].visible = true;
        this.paytableTitles[index].textColor = 0x0;
    }

	public clearPaytableFgs(){
		for( let i: number = 0; i < 4; i++ ){
            this.paytableTitles[i].textColor = 0x46C8F5;
            this.paytableFgs[i].visible = false;
        }
	}
}
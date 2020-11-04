class CopaPaytalbeLayer extends PaytableLayer{

	private dbLine2Bg: egret.Bitmap;
	private squareBg: egret.DisplayObjectContainer;

	private unUsingPaytable: Object;
    private squarePaytable: Object;

	public constructor() {
		super();

		this.buildFgs();
		this.buildTitleText();
	}

	protected buildFgs(){
		let greenBg: egret.Bitmap = this.buildScaleBg( "bar_long", 327, 113, 70, 1000 );
		let orangeBg: egret.Bitmap = this.buildScaleBg( "bar_loyalty_point", 1248, 113, 70, 430 );
		let brownBg: egret.Bitmap = this.buildScaleBg( "bar_loyalty_point_write", 1411, 120, 55, 250, 52 );
		let lineBg: egret.Bitmap = this.buildScaleBg( "paytable_prize_bg", 434, 122, 55, 135, 50 );
		let DBLineBg: egret.Bitmap = this.buildScaleBg( "paytable_prize_bg", 707, 122, 55, 135, 50 );
		let bingoBg: egret.Bitmap = this.buildScaleBg( "paytable_prize_bg", 1052, 122, 55, 180, 50 );

		this.dbLine2Bg = this.buildScaleBg( "paytable_prize_bg", 707, 122, 55, 135, 50 );
		this.dbLine2Bg.filters = [ MatrixTool.colorMatrixPure( 0xDB7D2D ) ];
		this.dbLine2Bg.visible = false;

    }

	private buildScaleBg( assetsName: string, x: number, y: number, a: number, width: number, height: number = 0 ): egret.Bitmap{
		let bitmap: egret.Bitmap = Com.addBitmapAt( this, BingoMachine.getAssetStr( assetsName ), x, y );
		let len: number = a - 20;
		bitmap.scale9Grid = new egret.Rectangle( 10, 10, len, len );
		bitmap.width = width;
		if( height ) bitmap.height = height;
		return bitmap;
	}

	public addPaytableUI(){
        super.addPaytableUI();

		let pts: Object = PayTableManager.payTablesDictionary;
        for( let payTable in pts ){
            let tx: egret.TextField = pts[payTable].UI["tx"];
            tx.width = 135;
            tx.textAlign = "center";
			if( payTable == "bingo" ) tx.width = 180;
		}

		this.unUsePaytable( "double_line" );
	}

	protected buildTitleText(){
        let line: TextLabel = this.addCopaPtText( 327, "1L", 108 );
        let double: TextLabel = this.addCopaPtText( 598, "2L", 108 );
	    let bingo: TextLabel = this.addCopaPtText( 842, "bingo", 210 );
		bingo.text = bingo.text.toUpperCase();
	}

	private addCopaPtText( x: number, tex: string, width: number ): TextLabel{
		let tx: TextLabel = Com.addLabelAt( this, x, 130, width, 40, 40, false, false );
		tx.bold = true;
		tx.textColor = 0x083A00;
		tx.setText( MuLang.getText( tex ) );
		return tx;
	}

	private unUsePaytable( ptName: string ): void{
        this.unUsingPaytable = PayTableManager.payTablesDictionary[ ptName ];
        this.unUsingPaytable["ui"].visible = false;
        PayTableManager.payTablesDictionary[ ptName ] = null;
        delete PayTableManager.payTablesDictionary[ ptName ];
    }

	public dblineDoubled( isDoubled: boolean ): void{
		this.unUsingPaytable["ui"].visible = true;
		this.dbLine2Bg.visible = isDoubled;
		if( isDoubled ){
            PayTableManager.payTablesDictionary[ "double_line" ] = this.unUsingPaytable;
            this.unUsePaytable( "double_line2" );
        }
        else{
            PayTableManager.payTablesDictionary[ "double_line2" ] = this.unUsingPaytable;
            this.unUsePaytable( "double_line" );
        }
	}
}
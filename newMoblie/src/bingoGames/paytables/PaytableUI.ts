class PaytableUI extends egret.Sprite{

	public static textBold: boolean = false;
	public static textLeft: boolean = false;
	public static effectWithBg: string;
	public static effectForMenton: string;
	public static focusColor: number;
	public static needBlick: boolean = true;

	private useBg: boolean;

	private bgName: string;
	protected gridRuleString: string;

	protected tx: egret.TextField;
	public get _tx(): number{ 
		let txt = this.tx.text.replace( /\D/g, "" );
		return isNaN(Number(txt)) ? 1 : Number(txt);
	}
	protected bg: egret.Bitmap;
	
	protected grids: Array<egret.Shape>;

	private textColor: number;
	protected blinkGridsIndexs: Array<number>;

	private _winEffects: Array<egret.Filter>;
	protected currentEffect: number;

	protected _blink: Boolean;
	public set blink(value:Boolean){
		this._blink = value;
		this.currentEffect = 0;
		if( value ){
			this.addEventListener( egret.Event.ENTER_FRAME, this.onFrame, this );
			if( this.useBg ){
				for( var i: number = 0; i < this.blinkGridsIndexs.length; i++ ){
					this.addChild( this.grids[this.blinkGridsIndexs[i]] );
				}
			}
		}
		else{
			if( !this.useBg )this.tx.filters = [];
			else{
				this.removeChildren();
				this.addChild( this.bg );
				if( this.tx ){
					this.addChild( this.tx );
					this.tx.filters = [];
				}
			}
			this.removeEventListener( egret.Event.ENTER_FRAME, this.onFrame, this );
		}
	}

	public constructor( useBg: boolean ) {
		super();

		this.useBg = useBg;
		this.addEventListener( egret.Event.REMOVED_FROM_STAGE, this.onRemove, this );
	}

	protected onRemove(event:egret.Event):void{
		this.removeEventListener( egret.Event.ENTER_FRAME, this.onFrame, this );
	}

	public set winEffects( value: Array<egret.ColorMatrixFilter> ){
		this._winEffects = value;
	}

	protected onFrame(event:egret.Event):void{
		this.currentEffect++;
		if( !this.useBg ){
			if( PaytableUI.needBlick ) this.tx.filters = [ this._winEffects[(this.currentEffect>>4)%this._winEffects.length] ];
		}
		else{
			for( var i: number = 0; i < this.blinkGridsIndexs.length; i++ ){
				this.grids[this.blinkGridsIndexs[i]].filters = [ this._winEffects[(this.currentEffect>>4)%this._winEffects.length] ];
			}
			if( this.tx && this.blinkGridsIndexs.length )this.tx.filters = [ this._winEffects[(this.currentEffect>>4)%this._winEffects.length] ];
		}
	}

	public setText( text: string, color: number = 0, size: number ):void{
		if( !text )return;
		this.textColor = color;
		
		this.tx = new egret.TextField;
		this.tx.textColor = color;
		this.tx.size = size;
		this.tx.bold = PaytableUI.textBold;
		this.tx.text = text;
		if( !this.useBg )this.addChild( this.tx );
	}

	public setBackground( assetsName: string ):void{
		if( !this.useBg )return;
		this.bgName = assetsName;
	}

	public showFit(): void{
		this.blink = false;
		if( !this.useBg){
			this.blink = true;
		}
		else{
			this.focus();
		}
		this.dispatchEvent( new egret.Event( "paytableFitEvent" ) );
	}

	public clearStatus(): void{
		this.blink = false;
		if( this.bg )this.graphics.clear();
	}

	public setGrids( ruleString: string ):void{
		if( !ruleString )return;
		this.gridRuleString = ruleString;
	}
	
	public initUI(){
		if( !this.useBg )return;
		this.bg = Com.createBitmapByName( BingoMachine.getAssetStr( this.bgName ) );
		this.addChild( this.bg );

		let ar: Array<string> = this.gridRuleString.split( "*" );
		let row: number = parseInt( ar[0] );
		let line: number = parseInt( ar[1] );
		let num: number = row * line;
		let width: number = Math.ceil( this.bg.width / row );
		let height: number = Math.ceil( this.bg.height / line );
		this.grids = [];
		for( let i: number = 0; i < num; i++ ){
			this.grids[i] = new egret.Shape;
			this.grids[i].x = i % row * width;
			this.grids[i].y = Math.floor( i / row ) * height;
			GraphicTool.drawRect( this.grids[i], new egret.Rectangle( 0, 0, width - 1, height - 1 ) );
		}

		if( this.tx ){
			if( PaytableUI.textLeft ){
				this.tx.x = this.bg.width;
				this.tx.y = this.bg.height - this.tx.size >> 1;
				this.tx.width = this.bg.width - 10;
			}
			else{
				this.tx.width = this.bg.width;
				this.tx.y = this.bg.height + 3;
			}
			this.tx.textAlign = "center";
			this.addChild( this.tx );
		}
	}

	public focus(){
		if( this.useBg ){
			GraphicTool.drawRect( this, new egret.Rectangle( -2, -2, this.bg.width + 4, this.bg.height + 4 ), PaytableUI.focusColor, true, 0.0, 0, 2, PaytableUI.focusColor );
		}
	}

	public showBlinkAt( grids: Array<number> ){
		if( this.useBg ){
			this.blinkGridsIndexs = grids;
			this.blink = true;
		}
	}
}
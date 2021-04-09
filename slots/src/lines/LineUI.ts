class LineUI extends egret.Sprite{

	public static textBold: boolean = false;
	public static focusColor: number = 0xFFFF88;
	public static needBlink: boolean = true;

	private rule: string;

	private _payTableName: string;
	public get payTableName(): string{
		return this._payTableName;
	}

	private textColor: number;

	protected tx: egret.TextField;
	public get _tx(): number{ 
		let txt = this.tx.text.replace( /\D/g, "" );
		return isNaN(Number(txt)) ? 1 : Number(txt);
	}
	
	protected winEffects: Array<egret.Filter>;
	protected static currentEffect: number;

	protected blink: Boolean;

	public position: egret.Point;

	public constructor( paytableObject: Object, name: string ) {
		super();

		this._payTableName = name;

		let rule: Array<string> = paytableObject["rule"];
		this.rule = rule[0];
		if( rule.length > 1 ) throw new Error( "slot rule is wrong!" );

		this.setText( paytableObject["UItext"], paytableObject["textColor"], paytableObject["textSize"] );

		var effect1: egret.ColorMatrixFilter = null;
		var effect2: egret.ColorMatrixFilter = null;

		if( paytableObject["blinkAlpha1"] != null && paytableObject["blinkColor1"] != null ){
			effect1 = MatrixTool.colorMatrixPure( paytableObject["blinkColor1"], paytableObject["blinkAlpha1"] );
		}
		if( paytableObject["blinkAlpha1"] != null && paytableObject["blinkColor1"] != null ){
			effect2 = MatrixTool.colorMatrixPure( paytableObject["blinkColor2"], paytableObject["blinkAlpha2"] );
		}
		
		this.winEffects = [ effect1, effect2 ];

		let position: Object = paytableObject["position"];
		this.position = new egret.Point( position["x"], position["y"] );
	}

	public setText( text: string, color: number = 0, size: number ):void{
		if( !text )return;
		this.textColor = color;
		
		this.tx = new egret.TextField;
		this.tx.textColor = color;
		this.tx.size = size;
		this.tx.bold = LineUI.textBold;
		this.tx.text = text;
		this.addChild( this.tx );
	}

	public showFit(): void{
		this.blink = true;
		this.dispatchEvent( new egret.Event( "paytableFitEvent" ) );
	}

	public clearStatus(): void{
		this.blink = false;
		this.tx.textColor = this.textColor;
	}

	public onBlink( effectIndex: number ){
		if( LineUI.needBlink && this.blink ) this.tx.filters = [ this.winEffects[effectIndex] ];
	}

	public initUI(){
		
	}
}
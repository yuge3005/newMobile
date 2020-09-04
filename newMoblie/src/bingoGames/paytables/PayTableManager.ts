class PayTableManager extends egret.Sprite{

	public static payTablesDictionary: Object;

	public static bingoPaytableName: string = "bingo";

	public static paytableUIType: Function = PaytableUI;
	public static layerType: Function = PaytableLayer;

	private rule: string;
	private rules: Array<string>;

	private _payTableName: string;
	public get payTableName(): string{
		return this._payTableName;
	}

	private useBgPicture: boolean;
	private textColor: number;

	private ui: PaytableUI;
	public get multiple(): number {
		return this.ui._tx;
	}
	
	private gridRule: any;

	public position: egret.Point;

	public get UI(): egret.DisplayObject{
		return this.ui;
	}

	public constructor( paytableObject: Object, name: string ) {
		super();

		this._payTableName = name;

		let rule: Array<string> = paytableObject["rule"];
		if( rule.length == 1 )this.rule = rule[0];
		else if( rule.length > 1 )this.rules = rule;

		// if( PaytableUI.effectWithBg ) this.ui = new PaytableUIWithBg( paytableObject["useBckgroundPicture"] );
		// else if( PaytableUI.effectForMenton ) this.ui = new PaytableUIForMenton( paytableObject["useBckgroundPicture"], this.rules );
		// else this.ui = new PaytableUI( paytableObject["useBckgroundPicture"] );
		this.ui = this.createPaytableUI( paytableObject["useBckgroundPicture"] );
		this.ui.setText( paytableObject["UItext"], paytableObject["textColor"], paytableObject["textSize"] );
		this.ui.setBackground( paytableObject["bgPicture"] );

		var effect1: egret.ColorMatrixFilter = null;
		var effect2: egret.ColorMatrixFilter = null;

		if( paytableObject["blinkAlpha1"] != null && paytableObject["blinkColor1"] != null ){
			effect1 = MatrixTool.colorMatrixPure( paytableObject["blinkColor1"], paytableObject["blinkAlpha1"] );
		}
		if( paytableObject["blinkAlpha1"] != null && paytableObject["blinkColor1"] != null ){
			effect2 = MatrixTool.colorMatrixPure( paytableObject["blinkColor2"], paytableObject["blinkAlpha2"] );
		}
		
		this.ui.winEffects = [ effect1, effect2 ];
		this.ui.setGrids( paytableObject["gridRule"] );

		this.gridRule = paytableObject["gridRule"];

		let position: Object = paytableObject["position"];
		this.position = new egret.Point( position["x"], position["y"] );
	}

	public static getPayTableData( obj: Object ){
		this.payTablesDictionary = {};
		for( let payTableObj in obj ){
			let ptm: PayTableManager = new PayTableManager( obj[payTableObj], payTableObj );
			this.payTablesDictionary[payTableObj] = ptm;
		}
	}

	public static getPayTableUI(){
		for( let payTableObj in this.payTablesDictionary ){
			this.payTablesDictionary[payTableObj].ui.initUI();
		}
	}

	private createPaytableUI( useBg: boolean ): PaytableUI{
		let ptUI: PaytableUI;
		ptUI = eval( "new PayTableManager.paytableUIType(" + useBg + ")" );
		return ptUI;
	}

	public check( testRule: string ): PaytableCheckResult{
		var result: PaytableCheckResult = new PaytableCheckResult( this.payTableName );
		if( this.rule ){
			result.getCheckResult( testRule, this.rule );
		}
		else if( this.rules ){
			for( var i: number = 0; i< this.rules.length; i++ ){
				result.getCheckResult( testRule, this.rules[i], i );
			}
		}
		else throw Error( "ff" );
		return result;
	}

	public lightCheck( testRule: string ): Array<number>{
		var result: PaytableCheckResult = new PaytableCheckResult( this.payTableName );
		let fitArray: Array<number> = [];
		if( this.rule ){
			if( result.lightCheckResult( testRule, this.rule ) ) fitArray.push( -1 );
		}
		else if( this.rules ){
			for( var i: number = 0; i< this.rules.length; i++ ){
				if( result.lightCheckResult( testRule, this.rules[i], i ) ) fitArray.push( i );
			}
		}
		else throw Error( "ff" );
		return fitArray;
	}

	public static clearPaytablesStatus(){
		for( let ob in this.payTablesDictionary ){
			this.payTablesDictionary[ob].clearStatus( "0" );
		}
	}

	public focus(){
		this.ui.focus();
	}

	public clearStatus(){
		this.ui.clearStatus();
	}

	public showBlinkAt( grids: Array<number> ){
		this.ui.showBlinkAt( grids );
	}
}
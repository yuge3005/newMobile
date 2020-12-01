class MultiPayTable{

	public static payTablesDictionary: Object;

	private rule: string;
	private rules: Array<string>;

	private _payTableName: string;

	public constructor( paytableObject: Object, name: string ) {
		this._payTableName = name;

		let rule: Array<string> = paytableObject["rule"];
		if( rule.length == 1 )this.rule = rule[0];
		else if( rule.length > 1 )this.rules = rule;
	}

	public static getPayTableData( obj: Object ){
		this.payTablesDictionary = {};
		for( let payTableObj in obj ){
			let ptm: MultiPayTable = new MultiPayTable( obj[payTableObj], payTableObj );
			this.payTablesDictionary[payTableObj] = ptm;
		}
	}

	public check( testRule: string ): PaytableCheckResult{
		var result: PaytableCheckResult = new PaytableCheckResult( this._payTableName );
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
}
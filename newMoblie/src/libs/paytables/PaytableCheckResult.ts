class PaytableCheckResult {
	
	public fit: boolean;
	public fits: Array<boolean>;
	public unfitIndex: number;
	public unfitIndexs: Object;

	public fitIndex: Array<number>;

	public name: string;
	
	public constructor( name: string ) {
		this.fit = false;
		this.unfitIndex = -1;

		this.fitIndex = [];

		this.name = name;
	}
	
	public getCheckResult( testString: string, ruleString: string, ruleIndex: number = NaN ): void{
		let num: number = this.testCheckString( testString, ruleString );
		if( num == -1 ){
			if( isNaN( ruleIndex ) )this.fit = true;
			else{
				if( !this.fits )this.fits = [];
				this.fits[ruleIndex] = true;
			}
		}
		else if( num >= 0 ){
			if( isNaN( ruleIndex ) )this.unfitIndex = num;
			else{
				if( !this.unfitIndexs )this.unfitIndexs = {};
				this.unfitIndexs[ruleIndex] = num;
			}
		}
	}

	public lightCheckResult( testString: string, ruleString: string, ruleIndex: number = NaN ): boolean{
		let num: number = this.testCheckString( testString, ruleString );
		if( num == -1 )return true;
		return false;
	}
	
	public toString(): string{
		let str: string = this.name + ":";
		if( this.fit ){
			str += "fit = true";
		}
		else if( this.unfitIndex != -1 ){
			str+= "unfitIndex" + ":" + this.unfitIndex;
		}
		else{
			if( this.fits ){
				str += "fits:";
				for( let i: number = 0; i < this.fits.length; i++ ){
					if( this.fits[i] )str += "(" + i + "," + this.fits[i] + "),"; 
				}
				str = str.substr( 0, str.length - 1 );
			}
			if( this.unfitIndexs ){
				str += "unfitIndexs:"
				for( let ob in this.unfitIndexs ){
					str += "(" + ob + "," + this.unfitIndexs[ob] + "),"; 
				}
				str = str.substr( 0, str.length - 1 );
			}
		}
		return str;
	}

	private testCheckString(testString:String, checkGate:String): number{
		if( testString.length != checkGate.length )return NaN;
		var differentIndex: number = -1;
		for( var i: number = 0; i<testString.length; i++ ){
			var char: string = checkGate.charAt(i);
			if( char == "0" )continue;
			if( testString.charAt(i) != checkGate.charAt(i) ){
				if( differentIndex >= 0 )return NaN;
				else differentIndex = i;
			}
		}
		return differentIndex;
	}
}
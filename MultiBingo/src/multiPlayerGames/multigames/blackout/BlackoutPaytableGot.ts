class BlackoutPaytableGot {

	public static paytableGotten: Object;

	public constructor() {
	}

	public static clear(){
		this.paytableGotten = null;
	}

	public static getNew( patternsByUUID: Array<Object> ){
		if( !this.paytableGotten ) this.paytableGotten = {};
		for( let i: number = 0; i < patternsByUUID.length; i++ ){
			let patternItem: Object = patternsByUUID[i];
			let uuid: string = patternItem["uuid"];
			if( !this.paytableGotten[uuid] ) this.paytableGotten[uuid] = [];
			let patterns: Array<string> = patternItem["patterns"];
			for( let i: number = 0; i < patterns.length; i++ ){
				this.paytableGotten[uuid].push( patterns[i] );
			}
		}
	}

	public static check( uuid: string, patternName: string, fit: boolean, fits: Array<boolean> ): boolean{
		let pattern: MultiPayTable = MultiPayTable.payTablesDictionary[patternName];
		if( fit ){
			let str: string = pattern["rule"];
			trace( str );
			if( this.paytableGotten[uuid] ){
				if( this.paytableGotten[uuid].indexOf( str ) < 0 ){
					return true;
				}
			}
			else return true;
		}
		else{
			for( let i: number = 0; i < fits.length; i++ ){
				if( fits[i] ){
					let str: string = pattern["rules"][i];
					trace( str );
					if( this.paytableGotten[uuid] ){
						if( this.paytableGotten[uuid].indexOf( str ) < 0 ){
							return true;
						}
					}
					else return true;
				}
			}
		}
		return false;
	}
}
class PaytableFilter {

	public static filterObject: Object;
	public static soundObject: Object;

	public constructor() {
	}

	public static lightConfixFilter( paytableName: string, cardPaytableItems: Object ): boolean{
		for( let ob in cardPaytableItems ){
			if( ob == paytableName ) continue;
			if( this.testContain( ob, paytableName ) )return true;
		}
		return false;
	}

	public static paytableConfixFilter( fitPaytableItem: Array<any>, byObject: boolean = false ): void{
		for( let i: number = 0; i < fitPaytableItem.length - 1; i++ ){
			for( let j: number = i + 1; j < fitPaytableItem.length; j++ ){
				let contains: boolean;
				if( byObject ) contains = this.testContain( fitPaytableItem[i]["paytalbe"], fitPaytableItem[j]["paytalbe"] );
				else contains = this.testContain( fitPaytableItem[i], fitPaytableItem[j] );				
				if( contains ){
					fitPaytableItem.splice( j, 1 );
					j--;
					continue;
				}
				if( byObject ) contains = this.testContain( fitPaytableItem[j]["paytalbe"], fitPaytableItem[i]["paytalbe"] );
				else contains = contains = this.testContain( fitPaytableItem[j], fitPaytableItem[i] );
				if( contains ){
					fitPaytableItem.splice( i, 1 );
					i--
					break;
				}
			}
		}
	}

	private static testContain( ruleParent: string, ruleChild: string ): boolean{
		let parentArray: Array<string> = this.filterObject[ruleParent];
		if( !parentArray )return false;
		let index: number = parentArray.indexOf( ruleChild );
		if( index >= 0 )return true;

		for( let i: number = 0; i < parentArray.length; i++ ){
			if( this.testContain( parentArray[i], ruleChild ) )return true;
		}

		return false;
	}
}
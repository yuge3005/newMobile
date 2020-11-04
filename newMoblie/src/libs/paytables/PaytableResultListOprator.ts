class PaytableResultListOprator {
	public constructor() {
	}

	public static missOneCounter( resultList: Array<Object>, paytableName: string, needCount: boolean = false ): number{
		let missCount: number = 0;
		for( let i: number = 0; i < resultList.length; i++ ){
			if( resultList[i][paytableName] && resultList[i][paytableName].unfitIndex >= 0 ){
				missCount++;
				if( !needCount )break;
			}
		}
		return missCount;
	}
}
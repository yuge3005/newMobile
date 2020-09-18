class PachinkoPtSettings {
	public constructor() {
	}

	/**
	 * when got only one line, drop it
	 * when got first line and last line, we drop corner
	 */
	public static filtOneLineAndCorner( resultList: Array<Object> ){
		for( let i: number = 0; i < resultList.length; i++ ){
            let fitsArr: Array<boolean> = resultList[i]["pachinko_1l"].fits;
            if( fitsArr ){
                let fitCount: number = 0;
                let firstlineFit: boolean = false;
                let lastlineFit: boolean = false;
                for( let j: number = 0; j < fitsArr.length; j++ ){
                    if( fitsArr[j] ){
                        fitCount ++;
                        if( j == 0 ) firstlineFit = true;
                        if( j == 4 ) lastlineFit = true;
                    }
                }
                if( fitCount <= 1 )resultList[i]["pachinko_1l"].fits = null;
                else{
                    if( firstlineFit && lastlineFit ){
                        resultList[i]["pachinko_corner"].fit = false;
                    }
                }
            }
        }
	}
}
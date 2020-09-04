class SuperLineUI extends egret.DisplayObjectContainer{
	public constructor() {
		super();

		this.visible = false;
	}

	public gotoAndPlay( num: number ){

	}

	public gotoAndStop( num: number ){
		
	}

	public getLinePosition( checkingString: Array<string> ): egret.Point{
		let superLineCardIndex: number;
        let superLineLineIndex: number;
        for( let i: number = 0; i < checkingString.length; i++ ){
            superLineCardIndex = i;
            if( checkingString[i].substr( 0, 5 ) == "11111" ){
                superLineLineIndex = 0;
                break;
            }
            else if( checkingString[i].substr( 5, 5 ) == "11111" ){
                superLineLineIndex = 1;
                break;
            }
            else if( checkingString[i].substr( 10 ) == "11111" ){
                superLineLineIndex = 2;
                break;
            }
        }

		if( isNaN(superLineLineIndex) ) return null;
		return new egret.Point( superLineCardIndex, superLineLineIndex );
	}
}
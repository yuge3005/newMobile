class LineManager {

	public static linesDictionary: Object;

	public static soundObject: Object;
	public static fitEffectNameList: Object;

	public static paytableUIType: Function = LineUI;
	public static layerType: Function = PaytableLayer;

	public constructor() {
	}

	public static maxLines: number;
	public static currentLines: number;

	public static lineStartPoint: egret.Point;
	public static lineScale: egret.Point = new egret.Point( 3, 3 );
	public static linePicPositions: Array<number>;

	public static lineFormat(): string{
		return ( Math.pow( 2, this.maxLines + 1 ) - Math.pow( 2, this.maxLines - this.currentLines ) ).toString(16);
	}

	public static getPayTableData( obj: Object ){
		this.linesDictionary = {};
		for( let payTableObj in obj ){
			let ptm: LineUI = eval( "new LineManager.paytableUIType( obj[payTableObj] , payTableObj )" );
			this.linesDictionary[payTableObj] = ptm;
		}
	}

	public static getPayTableUI(){
		for( let payTableObj in this.linesDictionary ){
			this.linesDictionary[payTableObj].initUI();
		}
	}

	public static clearPaytablesStatus(){
		for( let ob in this.linesDictionary ){
			this.linesDictionary[ob].clearStatus();
		}
	}
}
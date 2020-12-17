class GameCardUISettings {

	public static bgString: string;
	public static cardPositions: Array<egret.Point>;

	public static gridNumbers: egret.Point;
	public static gridInitPosition: egret.Point;

	public static useRedEffect: boolean = false;
	
	public constructor() {
	}

	public static dataSetting( data: Object ){
		this.bgString = data["cardBg"];
		this.cardPositions = [];
		for( let i: number = 0; i < data["cardPositions"].length; i++ ){
			let ob: Object = data["cardPositions"];
			this.cardPositions[i] = new egret.Point( ob[i]["x"], ob[i]["y"] );
		}
	}

	public static sizeSetting( size: Object ){
		this.gridNumbers = new egret.Point( size["vertSize"], size["horzSize"] );
		this.gridInitPosition = new egret.Point( size["numberInitialPositionX"], size["numberInitialPositionY"] );
	}

	public static getIndexOnCard( index: number ): egret.Point{
		let gridPerCard: number = this.gridNumbers.x * this.gridNumbers.y;
        let cardIndex: number = Math.floor( index / gridPerCard );
        let gridIndex: number = index % gridPerCard;
        let pt: egret.Point = new egret.Point( cardIndex, gridIndex );
        return pt;
    }
}
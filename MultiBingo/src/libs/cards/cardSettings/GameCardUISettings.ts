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

    public static positionOnCard( cardIndex: number, gridIndex: number ): egret.Point{
        let pt: egret.Point = new egret.Point;
        pt.x = this.cardPositions[cardIndex]["x"] + this.gridInitPosition.x + ( gridIndex % this.gridNumbers.x ) * CardGridColorAndSizeSettings.gridSpace.x;
        pt.y = this.cardPositions[cardIndex]["y"] + this.gridInitPosition.y + Math.floor( gridIndex / this.gridNumbers.x ) * CardGridColorAndSizeSettings.gridSpace.y;
        return pt;
    }

	public static setTargetToPositionOnCard( target: egret.DisplayObject, cardIndex: number, gridIndex: number ){
        let pt: egret.Point = this.positionOnCard( cardIndex, gridIndex );
        target.x = pt.x;
        target.y = pt.y;
    }

	public static numberAtCard( cardIndex: number, gridIndex: number ): number{
        return CardManager.cards[cardIndex].getNumberAt(gridIndex);
    }
}
class V2Game extends BingoMachine{

    public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
        super( gameConfigFile, configUrl, gameId );

        this.tokenObject["key"] = "iniciar";
        this.tokenObject["value"]["token"] = "undefined";
    }

    protected extraUIShowNumber(){
        this.extraUIObject.visible = true;
        this.runningBallContainer = new egret.DisplayObjectContainer;
        this.runningBallContainer.x = this.extraUIObject.x;
        this.runningBallContainer.y = this.extraUIObject.y;
        this.addChildAt( this.runningBallContainer, this.getChildIndex( this.extraUIObject ) );
        Com.addObjectAt( this.runningBallContainer, this.extraUIObject, 0, 0 );
        this.extraUIObject = this.runningBallContainer;
    }

    protected showNoBetAndCredit(){
        this.creditText = new egret.TextField;
        this.betText = new egret.TextField;
    }

/*******************************************************************************************************/
    protected getIndexOnCard( index: number ): egret.Point{
        let cardIndex: number = Math.floor( index / 15 );
        let gridIndex: number = index % 15;
        let pt: egret.Point = new egret.Point( cardIndex, gridIndex );
        return pt;
    }
    
    protected setTargetToPositionOnCard( target: egret.DisplayObject, cardIndex: number, gridIndex: number ){
        let pt: egret.Point = this.positionOnCard( cardIndex, gridIndex );
        target.x = pt.x;
        target.y = pt.y;
    }

    protected positionOnCard( cardIndex: number, gridIndex: number ): egret.Point{
        let pt: egret.Point = new egret.Point;
        pt.x = this.cardPositions[cardIndex]["x"] + GameCard.gridInitPosition.x + ( gridIndex % 5 ) * CardGrid.gridSpace.x;
        pt.y = this.cardPositions[cardIndex]["y"] + GameCard.gridInitPosition.y + Math.floor( gridIndex / 5 ) * CardGrid.gridSpace.y;
        return pt;
    }

    protected numberAtCard( cardIndex: number, gridIndex: number ): number{
        return CardManager.cards[cardIndex].getNumberAt(gridIndex);
    }

    protected getNumberOnCard( cardIndex: number, gridIndex: number ): void{
        let num: number = this.numberAtCard( cardIndex, gridIndex );
        CardManager.getBall( num );
    }
    
    protected getBuffInfoIndex( buffInfo: Array<Object> ): number{
        for( let i: number = 0; i < buffInfo.length; i++ ){
            if( buffInfo[i]["buffBet"] == GameData.currentBet ){
                return i;
            }
        }
        return -1;
    }
}
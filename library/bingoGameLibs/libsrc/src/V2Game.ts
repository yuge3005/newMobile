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

/*******************************************************************************************************/
    protected getNumberOnCard( cardIndex: number, gridIndex: number ): void{
        let num: number = GameCardUISettings.numberAtCard( cardIndex, gridIndex );
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
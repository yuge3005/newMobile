class GameUIItem extends egret.Sprite{

    protected extraUIName: string;
	protected extraUIObject: egret.DisplayObject;

	public constructor() {
		super();
	}

/************************************************************************************************************************************************************/

    protected gratisUIIsOverExtraUI: boolean;

    protected gratisUI: egret.DisplayObject;
    protected gratisNumber: number;
	
    protected showFreeExtraPosition(): void{
        if( !this.gratisUI )this.gratisUI = this.getGratisUI();
        if( this.gratisNumber <= 0 ) return;
        let ballPositionObject: egret.Point = BallManager.getBallLastPosition( this.gratisNumber - 1 );
        this.gratisUI.x = ballPositionObject.x;
        this.gratisUI.y = ballPositionObject.y;
        this.addChildAt( this.gratisUI, this.getChildIndex( this.extraUIObject ) + ( this.gratisUIIsOverExtraUI ? 1 : 0 ) );
	}

	protected getGratisUI(): egret.DisplayObject{
		//sub class override
		return null;
	}
}
class CopaMarkPenBar extends egret.DisplayObjectContainer{

	private markPen1: egret.Bitmap;
    private markPen2: egret.Bitmap;

	private bigPen1: egret.Bitmap;
    private bigPen2: egret.Bitmap;

	private bigMarkPenContainer1: egret.DisplayObjectContainer;
    private bigMarkPenContainer2: egret.DisplayObjectContainer;

	public needMarkLine: boolean;

	public constructor() {
		super();

		this.markPen1 = Com.addBitmapAt( this, BingoMachine.getAssetStr( "icon_mark_big" ), 0, 0 );
        this.markPen2 = Com.addBitmapAt( this, BingoMachine.getAssetStr( "icon_mark_big" ), 0, 0 );
        this.markPen1.visible = this.markPen2.visible = false;

        this.bigMarkPenContainer1 = new egret.DisplayObjectContainer;
        this.bigMarkPenContainer2 = new egret.DisplayObjectContainer;
        Com.addObjectAt( this, this.bigMarkPenContainer1, 0, 0 );
        Com.addObjectAt( this, this.bigMarkPenContainer2, 0, 0 );

		this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );
	}

	private onAdd( event: egret.Event ){
		this.addEventListener( egret.Event.ENTER_FRAME, this.markColumnEveryFrame, this );
		this.removeEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );
	}

	public start(){
		this.markPen1.visible = true;
		this.markPen2.visible = true;
		this.bigMarkPenContainer1.removeChildren();
		this.bigMarkPenContainer2.removeChildren();
	}

	private markColumnEveryFrame( event: egret.Event ): void{
        if( this.bigPen1 && this.bigPen1.parent ) this.addPenPoint( this.bigPen1 );
        if( this.bigPen2 && this.bigPen2.parent ) this.addPenPoint( this.bigPen2 );

        if( !this.stage ) this.removeEventListener( egret.Event.ENTER_FRAME, this.markColumnEveryFrame, this );
    }

	private addPenPoint( pen: egret.Bitmap ): void{
        let pt: egret.Bitmap = Com.createBitmapByName( BingoMachine.getAssetStr( "marker_lightball" ) );
        pt.x = pen.x + Math.random() * 6 - 7;
        pt.y = pen.y + 31;
        pen.parent.addChildAt( pt, 0 );
    }

	public hideMarkPen(){
		this.markPen1.visible = this.markPen2.visible = false;

		this.bigMarkPenContainer1.removeChildren();
		this.bigMarkPenContainer2.removeChildren();
	}

	public showMarkPenAt( indexPt1: egret.Point, indexPt2: egret.Point ){
		GameCardUISettings.setTargetToPositionOnCard( this.markPen1, indexPt1.x, indexPt1.y );
		GameCardUISettings.setTargetToPositionOnCard( this.markPen2, indexPt2.x, indexPt2.y );
		this.markPen1.visible = this.markPen2.visible = true;
	}

	public getColumnNumbers( card1: number, grid1: number ): void{
        let pt: egret.Point = GameCardUISettings.positionOnCard( card1, grid1 );
        let paper: egret.DisplayObjectContainer = card1 ? this.bigMarkPenContainer1 : this.bigMarkPenContainer2;
        let pen: egret.Bitmap = Com.addBitmapAt( paper, BingoMachine.getAssetStr( "icon_mark_big" ), pt.x + 20, pt.y - 35 );
        pen.name = "pen";
        if( card1 ){
            this.bigPen2 = pen;
            this.markPen2.visible = false;
        }
        else{
            this.bigPen1 = pen;
            this.markPen1.visible = false;
        }
        let tw: egret.Tween = egret.Tween.get( pen );
        tw.to( { y: pen.y + 230 }, 600 );
        tw.wait( 500 );
        tw.call( () => { if( pen.parent )pen.parent.removeChildren() } );
    }
}
class CopaChooseBar extends egret.DisplayObjectContainer{

	private chooseGrids: Array<egret.Shape>;
    private chooseNotGrids: Array<egret.Shape>;

	public onNumberChoise: Function;

	public constructor( onNumberChoise: Function ) {
		super();

		this.chooseGrids = [];
        this.chooseNotGrids = [];

		this.onNumberChoise = onNumberChoise;

		let selectNumberContainer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
        let selectNumberMaskContainer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
        this.addChild( selectNumberContainer );
        this.addChild( selectNumberMaskContainer );

        for( let i: number = 0; i < 60; i++ ){
            let indexPt: egret.Point = GameCardUISettings.getIndexOnCard( i );
            this.chooseGrids[i] = new egret.Shape;
            this.chooseNotGrids[i] = new egret.Shape;
            GraphicTool.drawRect( this.chooseGrids[i], new egret.Rectangle( 0, 0, CardGridColorAndSizeSettings.gridSize.x, CardGridColorAndSizeSettings.gridSize.y ), 0xFFFFFF, false, 0.5 );
            GraphicTool.drawRect( this.chooseNotGrids[i], new egret.Rectangle( 0, 0, CardGridColorAndSizeSettings.gridSize.x, CardGridColorAndSizeSettings.gridSize.y ), 0, false, 0.5 );
            this.chooseGrids[i].name = "" + i;
            this.chooseGrids[i].touchEnabled = true;
            this.chooseGrids[i].addEventListener( egret.TouchEvent.TOUCH_TAP, this.onNumberChoise, this );
            selectNumberContainer.addChild( this.chooseGrids[i] );
            selectNumberMaskContainer.addChild( this.chooseNotGrids[i] );
            GameCardUISettings.setTargetToPositionOnCard( this.chooseGrids[i], indexPt.x, indexPt.y );
            GameCardUISettings.setTargetToPositionOnCard( this.chooseNotGrids[i], indexPt.x, indexPt.y );
        }

		let toolBarMask: egret.Shape = new egret.Shape;
		let wd: number = 2000;
		let fht: number = 183;
		let bht: number = 665;
		let cwd: number = 577;
		let lt: number = 327;
		let mt: number = 192;
		let mht: number = bht - fht;
		let lcd: number = lt + cwd + mt + cwd;
        GraphicTool.drawRect( toolBarMask, new egret.Rectangle( 0, 0, wd, fht ) );
        GraphicTool.drawRect( toolBarMask, new egret.Rectangle( 0, fht, lt, mht ) );
        GraphicTool.drawRect( toolBarMask, new egret.Rectangle( lt + cwd, fht, mt, mht ) );
        GraphicTool.drawRect( toolBarMask, new egret.Rectangle( lcd, fht, wd - lcd, mht ) );
        GraphicTool.drawRect( toolBarMask, new egret.Rectangle( 0, bht, wd, 1125 - fht - mht ) );
        toolBarMask.alpha = 0.5;
        toolBarMask.touchEnabled = true;
        Com.addObjectAt( this, toolBarMask, 0, 0 );

        let bit: egret.Bitmap = Com.addBitmapAt( this, BingoMachine.getAssetStr( "ball_silver" ), 878, 676 );
		bit.scaleX = bit.scaleY = 245 / 177;
        let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "choose_" + GlobelSettings.language, 878, 676 );
		mc.scaleX = mc.scaleY = 245 / 110;

		selectNumberContainer.addEventListener( egret.Event.ENTER_FRAME, this.onSelectBarFrame, this );
	}

	public show(){
		this.visible = true;
        let checkingString: Array<string> = CardManager.getCheckingStrings();
        for( let i: number = 0; i < checkingString.length; i++ ){
            for( let j: number = 0; j < checkingString[i].length ; j++ ){
                this.chooseGrids[i*15+j].visible = checkingString[i].charAt( j ) == "0";
                this.chooseNotGrids[i*15+j].visible = !this.chooseGrids[i*15+j].visible;
            }
        }
	}

	private onSelectBarFrame( event: egret.Event ): void{
        if( !this.stage ) event.target.removeEventListener( egret.Event.ENTER_FRAME, this.onSelectBarFrame, this );
		
        if( !this.visible )return;
        let dt: Date = new Date;
        event.target.alpha = dt.getMilliseconds() > 500 ? 0.4 : 0.01;
    }
}
class MaraFeatureTip extends egret.DisplayObjectContainer{
	
	private tipTxt: egret.TextField;
	private titleTxt: egret.TextField;
	private tipIcon: egret.Bitmap;

	private timer: egret.Timer;

	private featureNames: Array<string> = ["greenBait", "redBait", "orangeBait", "cylinder", "fishingNet", "jellyFish", "pearl", "shark", "star", "swirl", "camera"];
	private freeCount: number;
	private infoIndex: number;
	
	public constructor() {
		super();

		Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr("tips frame"), 0, 0 );

		this.tipTxt = MDS.addGameText( this, 20, 80, 14, 0xFFFFFF, "ball", false, 145 );
		this.tipTxt.height = 170;
		this.tipTxt.fontFamily = "Arial";
		this.tipTxt.bold = true;
		this.tipTxt.wordWrap = true;

		this.titleTxt = MDS.addGameText( this, 65, 30, 15, 0xFFFFFF, "ball", false, 145, null, 0.75 );
		this.titleTxt.height = 40;
		this.titleTxt.verticalAlign = "middle";

		this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );
	}

	private onAdd( event: egret.Event ){
		this.removeEventListener( egret.Event.ADDED_TO_STAGE, this.onAdd, this );
		this.addEventListener( egret.Event.REMOVED_FROM_STAGE, this.onRemove, this );
		this.infoIndex = 0;
		this.timer = new egret.Timer( 5000 );
		this.timer.addEventListener( egret.TimerEvent.TIMER, this.onTimer, this );
		this.timer.start();
		this.showFeatureInfo( this.featureNames[ this.infoIndex++ ] );
	}

	private onRemove( event: egret.Event ){
		this.removeEventListener( egret.Event.REMOVED_FROM_STAGE, this.onRemove, this );
		this.timer.stop();
	}

	public showTip( tipStr: string ){
		this.showFeatureInfo( tipStr );
		this.freeCount = 4;
	}

	private showFeatureInfo( tipStr: string ){
		this.tipTxt.text =  MuLang.getText( tipStr + "_tip" );
		this.titleTxt.text = MuLang.getText( tipStr, MuLang.CASE_UPPER ).replace( " ", "\n" );

		if( this.tipIcon ) this.removeChild( this.tipIcon );
		this.tipIcon = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "icon_" + tipStr ), 20, 30 );
	}

	private onTimer( event: egret.Event ){
		if( this.freeCount ){
			this.freeCount--;
			return;
		}
		this.showFeatureInfo( this.featureNames[ this.infoIndex++ ] );
		if( this.infoIndex >= this.featureNames.length ) this.infoIndex = 0;
	}
}
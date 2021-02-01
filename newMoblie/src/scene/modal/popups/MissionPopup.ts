class MissionPopup extends GenericPo {

	private taskListLayer: egret.DisplayObjectContainer;

	protected static get classAssetName() {
		return "bingoMissionPopup";
	}

	public constructor() {
		super();
	}

	protected init() {
        this.bgAssetName = "missionBingo_json.bg";
		this.closeButtonAssetName = "missionPopup_json.btn_close";

		this.closeButtonOffset = new egret.Point( 190, 18 );

        super.init();

		this.anchorOffsetX = 922;
		this.anchorOffsetY = 472;

		Com.addBitmapAtMiddle( this, "missionBingo_json.mission_" + MuLang.language, 797, 41 );
		Com.addBitmapAt( this, "missionBingo_json.card", 1080, -68 );

		this.taskListLayer = new egret.DisplayObjectContainer;
		this.addChild( this.taskListLayer );
		this.showListByData();

		Com.addBitmapAt( this, "missionPopup_json.doctor", 1475, 29 );
		this.addChild( this.closeButton );
	}

	private showListByData(){
		this.taskListLayer.removeChildren();

		let mission: Object = PlayerConfig.player( "mission" );
		
	}
}
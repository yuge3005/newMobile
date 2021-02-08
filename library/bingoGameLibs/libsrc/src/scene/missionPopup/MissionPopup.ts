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
		let tasks: Array<IMissionTask> = MissionDataManager.getMissionTasks( "1" );

		let taskUIs: Array<MissionTaskUIItem> = <Array<MissionTaskUIItem>>[];
		let hasFoundActive: boolean;
		let taskHeight: number;
		for( let i: number = 0; i < tasks.length; i++ ){
			let task: IMissionTask = tasks[i];
			let isActive: boolean = task.is_active == "1";
			taskUIs[i] = new MissionTaskUIItem( isActive, task.current / task.target, hasFoundActive );
			Com.addObjectAt( this.taskListLayer, taskUIs[i], 794, this.taskListLayer.height + ( i ? 16 : 0 ) + taskUIs[i].anchorOffsetY + 176 );
			if( !hasFoundActive && isActive ) hasFoundActive = true;
		}
	}
}
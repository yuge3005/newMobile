class MissionBar extends egret.DisplayObjectContainer {

	private missionBg: egret.Bitmap;
	private missionBook: egret.Bitmap;

	private missLock: MissLockUI;
	private missionProcessUI: MissionProcessUI;

	private missionData: IMissionTask;

	public constructor() {
		super();
		this.missionBg = Com.addBitmapAt( this, "missionBar_json.btn_mission_bg", 0, 0 );
		this.missionBook = Com.addBitmapAt( this, "missionBar_json.mission_icon", 18, 4 );

		let lockType: number = MissionDataManager.checkMissionLocked();
		if( lockType >= 0 ){
			this.missLock = new MissLockUI( lockType );
			this.addChild( this.missLock );
		}
		else{
			this.showMissionProcess();
		}
	}

	private showMissionProcess(){
		let currentBingoTask: IMissionTask = MissionDataManager.getActiveMissionTask( MissionDataManager.MISSION_TYPE_BINGO );
		this.showTaskUI( currentBingoTask );
	}

	private showTaskUI( currentBingoTask: IMissionTask ){
		this.missionData = currentBingoTask;

		this.missionProcessUI = new MissionProcessUI;
		Com.addObjectAt( this, this.missionProcessUI, 0, 0 );
		this.missionProcessUI.setProcess( currentBingoTask.current / currentBingoTask.target );

		this.addChild( this.missionBook );
	}

	public updateMissionData( value: number, target: number, id: number ){
		if( id.toString() != this.missionData.mission_id ){
			egret.error( "mission id error" );
			return;
		}
		if( this.missionData.target != target ){
			egret.error(  "mission target error" );
			return;
		}

		this.missionProcessUI.setProcess( value / target );

		this.missionData.current = value;
		LocalDataManager.updatePlayerData( "mission.task." + id + ".current", value.toString() );
	}
}
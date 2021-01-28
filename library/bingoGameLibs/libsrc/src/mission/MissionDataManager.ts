class MissionDataManager {

	public static MISSION_TYPE_BINGO: string = "1";
	public static MISSION_TYPE_SLOT: string = "2";

	public constructor() {
	}

	/**
     * check mission locked
     */
    public static checkMissionLocked(): number {
        let mission: Object = PlayerConfig.player("mission");
        if (mission["task_is_process"] === "1" || mission["score_info"]["score_is_process"] === "1") return 2;
		if (Number(PlayerConfig.player("score.level")) < Number(mission["unlock_level"])) return 1;
        
        for (let missionId in mission["task"]) {
			if (!isNaN(Number(missionId))) {
				return -1;
			}
		}

		return 0;
    }

	public static getMissionTasks( type: string ): Array<IMissionTask>{
		let mission: Object = PlayerConfig.player("mission");
		let task: Object = mission["task"];
		let taskArr: Array<IMissionTask> = <Array<IMissionTask>>[];
		for( let ob in task ){
			if( isNaN( Number(ob) ) ) continue;
			if( task[ob].type == type ){
				taskArr.push( this.getMissionTaskData( task[ob] ) );
			}
		}
		return taskArr;
	}

	private static getMissionTaskData( taskObject: Object ): IMissionTask{
		let taskData: IMissionTask = <IMissionTask>{};
		taskData.is_active = taskObject["is_active"];
		taskData.current = Number(taskObject["current"]);
		taskData.target = Number(taskObject["target"]);
		taskData.mission_id = taskObject["id"];
		return taskData;
	}

	public static getActiveMissionTask( type: string ): IMissionTask{
		let mission: Object = PlayerConfig.player("mission");
		let task: Object = mission["task"];
		for( let ob in task ){
			if( isNaN( Number(ob) ) ) continue;
			if( task[ob].type == type ){
				let taskData: IMissionTask = this.getMissionTaskData( task[ob] );
				if( taskData.is_active == "1" ) return taskData;
			}
		}
		return null;
	}
}
class MissionPopup extends GenericPo {

	protected static get classAssetName() {
		return "bingoMissionPopup";
	}

	public constructor() {
		super();
	}

	protected init() {
        this.bgAssetName = "missionBingo_json.bg";

        super.init();
	}
}
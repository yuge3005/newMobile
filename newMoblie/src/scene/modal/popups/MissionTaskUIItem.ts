class MissionTaskUIItem extends egret.DisplayObjectContainer{
	public constructor( isActive: boolean, process: number, hasActive: boolean ) {
		super();

		let bg: egret.Bitmap;
		if( isActive && process != 1 ){
			bg = Com.addBitmapAt( this, "missionBingo_json.bar2", 0, 0 );
			bg.scale9Grid = new egret.Rectangle( 60, 48, 119, 122 );
			bg.width = 1405;
		}
		else{
			bg = Com.addBitmapAt( this, "missionBingo_json.bar1", 12, 0 );
			bg.scale9Grid = new egret.Rectangle( 48, 48, 63, 63 );
			bg.width = 1393;
			if( isActive ){
				let tx: egret.TextField = MDS.addGameText( this, 120, 0, 52, 0xFFFFFF, "mission_complete", false, 790, "", 1 );
			}
			// Com.addBitmapAt( this,  )
		}
		this.anchorOffsetX = 700;
		this.anchorOffsetY = 110;
	}
}
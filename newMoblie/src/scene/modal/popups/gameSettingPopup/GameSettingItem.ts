class GameSettingItem extends egret.DisplayObjectContainer{
	public constructor( icon: string, text: string, entity: egret.DisplayObject, offsetY: number ) {
		super();

		let bg: egret.Bitmap = Com.addBitmapAt( this, "gameSettings_json.tab_bg", 0, 0 );
		bg.width = 1040;
		bg.height = 140;
		Com.addBitmapAtMiddle( this, "gameSettings_json." + icon, 90, 70 + offsetY );

		let tx: TextLabel = MDS.addGameText( this, 180, 55, 56, 0xFFFFFF, text, true, 525, "", 1 );
		tx.fontFamily = "Righteous";
		tx.stroke = 2;
		tx.strokeColor = 0x040121;

		this.addChild( entity );
	}
}
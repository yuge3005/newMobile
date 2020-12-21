class GameSettingItem extends egret.DisplayObjectContainer{
	public constructor( icon: string, text: string, entity: egret.DisplayObject, offsetY: number ) {
		super();

		let bg: egret.Bitmap = Com.addBitmapAt( this, "gameSettings_json.tab_bg", 0, 0 );
		bg.width = 1040;
		bg.height = 140;
		Com.addBitmapAtMiddle( this, "gameSettings_json." + icon, 90, 70 + offsetY );

		this.addChild( entity );
	}
}
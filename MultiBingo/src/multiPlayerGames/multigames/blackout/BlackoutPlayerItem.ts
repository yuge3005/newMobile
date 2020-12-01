class BlackoutPlayerItem extends egret.DisplayObjectContainer{

	private headIcon: egret.Bitmap;
	private pointTx: egret.TextField;

	private skillContainer: egret.DisplayObjectContainer;
	private isMe: boolean;

	public constructor( playerData: Object ) {
		super();

		let isMe: boolean = playerData["userId"] == PlayerConfig.player( "user.id" );
		this.isMe = isMe;
		Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "player_base" + ( isMe ? "_mine" : "" ) ), 0, -3 );
		if( !isMe ) Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "skill_base2" ), 0, 70 );

		this.headIcon = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "head" ), 2, 0 );
		let headMask: egret.Bitmap = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "head" ), 2, 0 );
		this.headIcon.mask = headMask;

		if( playerData["headUrl"] ) Utils.downloadBitmapDataByFacebookID( playerData["headUrl"], 50, 50, MDS.onUserHeadLoaded.bind( this, this.headIcon, 48 ), this );

		let playerNameTx: egret.TextField = Com.addTextAt( this, 54, 8, 80, 20, 20, isMe );
		if( isMe ){
			playerNameTx.stroke = 1.5;
			playerNameTx.filters = [ new egret.DropShadowFilter( 2, 90, 0, 0.5, 2, 2 ) ];
		}
		if( playerData["name"] ) playerNameTx.text = playerData["name"];
		else playerNameTx.text = MuLang.getText( "guest" ) + playerData["userId"].substring( playerData["userId"].length - 4 );

		this.pointTx = Com.addTextAt( this, 46, 40, 96, 20, 20, isMe );
		if( isMe ){
			this.pointTx.stroke = 1.5;
			this.pointTx.filters = [ new egret.DropShadowFilter( 2, 90, 0, 0.5, 2, 2 ) ];
		}
		this.pointTx.textColor = isMe ? 0xFFFFFF : 0xF4E700;
		this.pointTx.text = "0";

		this.skillContainer = new egret.DisplayObjectContainer;
		Com.addObjectAt( this, this.skillContainer, 7, 73 );
	}

	public getPoint( point: number ){
		this.pointTx.text = "" + point;
	}

	public getPowerUp( type: string ){
		if( this.isMe ) return;
		Com.addBitmapAt( this.skillContainer, MultiPlayerMachine.getAssetStr( "skill_" + BlackoutEnergy.skillNameObj[type] + "_x" ), 0, 0 );
		this.orderSkillIcons();
	}

	private orderSkillIcons(){
		let count: number = this.skillContainer.numChildren;
		for( let i: number = 0; i < count; i++ ){
			let bit: egret.Bitmap = this.skillContainer.getChildAt(i) as egret.Bitmap;
			bit.x = i * ( count <= 3 ? 41 : 82 / (count - 1) );
		}
	}
}
class AvatarContainer extends egret.ScrollView{

	private userList: Array<string>;
	protected iconList: Array<egret.Bitmap>;

	protected avatarLayer: egret.DisplayObjectContainer;

	public constructor() {
		super();

		this.userList = [];
		this.iconList = [];

		this.avatarLayer = new egret.DisplayObjectContainer;
		this.setContent( this.avatarLayer );

		this.setArea();
	}

	protected setArea(){
		this.width = 10;
		this.height = 10;
	}

	public updataList( list: Array<Object> ){
		let userNameList: Array<string> = [];
		for( let i: number = 0; i < list.length; i++ ){
			userNameList[i] = list[i]["userId"];
		}
		this.removeOld( userNameList );
		this.addNew( userNameList, list );
		this.resetAvatarPositions();
	}

	private removeOld( list: Array<string> ){
		for( let i: number = 0; i < this.userList.length; i++ ){
			if( list.indexOf( this.userList[i] ) < 0 ){
				this.userList.splice( i, 1 );
				let pa: egret.DisplayObjectContainer = this.iconList[i].parent;
				pa.removeChild( this.iconList[i] );
				this.iconList.splice( i, 1 );
				i--;
			}
		}
	}

	private addNew( list: Array<string>, headUrlList: Array<Object> ){
		for( let i: number = 0; i < list.length; i++ ){
			if( this.userList.indexOf( list[i] ) < 0 ){
				this.userList.push( list[i] );
				let headIcon: egret.Bitmap = this.newHead();
				this.iconList.push( headIcon );

				if( headUrlList[i]["headUrl"] != "" ) Utils.downloadBitmapDataByFacebookID( headUrlList[i]["headUrl"], 50, 50, MDS.onUserHeadLoaded.bind( this, headIcon, 100 ), this );
			}
		}
	}

	protected newHead(): egret.Bitmap{
		return null;
	}

	protected resetAvatarPositions(){
		//sub class override
	}
}
class GenericModal extends egret.Sprite {
	public enableKeyboard: boolean = false;
	public needZoomOut: boolean;

	protected static get classAssetName(){
		return "";//subclass must override
	}

	public static GENERIC_MODAL_LOADED: string = "modalLoaded";
	public static CLOSE_MODAL: string = "closeModal";
	public static MODAL_COMMAND: string = "modalCommand";

	protected assetName: string;
	protected static assetLoaded: Array<boolean> = new Array<boolean>();

	public inited: boolean = false;

	private configUrl: string;
	
	public constructor( configUrl: string = null ) {
		super();

		this.assetName = egret.getDefinitionByName(egret.getQualifiedClassName(this)).classAssetName;
		
		if( this.assetName === null || this.assetName === "" || GenericModal.assetLoaded[this.assetName] ) this.init();
		else{
			if( configUrl ){
				this.configUrl = configUrl;
				// RES.getResByUrl( configUrl, this.analyse, this );
				RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.analyse, this);
				RES.loadConfig( "../data.res.json", configUrl.replace("data.res.json", "resource/"));
			}
			else GenericModal.loadAsset( this.assetName, this );
		}
	}

	private analyse( event: egret.Event ){
		RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.analyse, this);
		GenericModal.loadAsset( this.assetName, this );
	}

	protected init(){
		//must be override
		this.inited = true;

		this.dispatchEvent( new egret.Event( GenericModal.GENERIC_MODAL_LOADED ) );
	}

	private static loadAsset( assetName: string, target: GenericModal ){
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loaded, target );
		RES.loadGroup( assetName );
	}

	private static loaded( event: RES.ResourceEvent ){
		if( event.groupName != this["assetName"] )return;
		GenericModal.assetLoaded[this["assetName"]] = true;
		this["init"]();
		RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, GenericModal.loaded, this );
	}

	protected onKeyUp(keyCode: number): void {}
}

class mouse{
	public constructor() {
	}
	
	public static setButtonMode( a: any ){

	}
}
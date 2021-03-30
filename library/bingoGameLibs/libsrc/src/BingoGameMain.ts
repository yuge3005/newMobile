class BingoGameMain extends egret.DisplayObjectContainer {

	protected currentGame: BingoMachine;
	protected currentPo: GenericPo;

	protected isMobile: boolean;

	private shadow: egret.Shape;
	private modalPreloader: egret.Bitmap;

	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	/**
	* need override
	*/
	protected onAddToStage(event: egret.Event) {}

	/**
	 * need override
	 */
	protected runGame() {}

	/**
	 * 创建游戏场景
	 * Create a game scene
	 */
	protected createGameScene() {
		this.buildGame();
		this.addGameLoaderAndEvents();
		IBingoServer.serverInit();
	}

	/**
	 * need override
	 */
	protected buildGame() {}

	protected addGameLoaderAndEvents(){
		const loadingView = new LoadingUI();
		this.currentGame.preLoader = loadingView;
		this.currentGame.addEventListener( BingoMachine.GENERIC_MODAL_LOADED, this.addGame, this );
		this.currentGame.addEventListener("showGameSettings", this.showGameSettings, this);
		this.currentGame.addEventListener("missionPopup", this.showMission, this );
		this.currentGame.addEventListener("showBank", this.showBank, this );
	}

	private addGame(){
		let stageW = this.stage.stageWidth;
		let stageH = this.stage.stageHeight;
		let isMobile: boolean = stageW < stageH;
		try{
			isMobile = eval( "isMobile()" );
		}catch(e){}
		this.isMobile = isMobile;

		this.addChild( this.currentGame );
		document.addEventListener("keydown", this.keyDown.bind(this) );
		var loadingBar = document.getElementById( "loading_bar" );
		if( loadingBar ) loadingBar.parentNode.removeChild( loadingBar );
	}
		
	/**
	 * key down
	 */
	private keyDown(event): void {
		if (this.currentGame) {
			if (event.keyCode === 32) {
				event.preventDefault();
				this.currentGame.quickPlay();
			} else if (event.keyCode === 67) {
				event.preventDefault();
				this.currentGame.collectCredit();
			}
		}
	}

	private showGameSettings( event: egret.Event ){
		this.showShadow();

		this.currentPo = new GameSettingPopup;
		if (this.currentPo.inited) this.addPhonePo();
		else this.currentPo.addEventListener( GenericModal.GENERIC_MODAL_LOADED, this.addPhonePo, this );
	}

	private showMission( event: egret.Event ){
		this.showShadow();

		this.currentPo = new MissionPopup;
		if (this.currentPo.inited) this.addPhonePo();
		else this.currentPo.addEventListener( GenericModal.GENERIC_MODAL_LOADED, this.addPhonePo, this );
	}

	protected showShadow(){
		if( !this.shadow ){
			this.shadow = new egret.Shape;
			GraphicTool.drawRect( this.shadow, new egret.Rectangle( 0, 0, BingoBackGroundSetting.gameSize.x, BingoBackGroundSetting.gameSize.y ), 0, false, 0.5 );
			this.shadow.touchEnabled = true;
		}
		this.addChild( this.shadow );

		if( !this.modalPreloader ){
			this.modalPreloader = Com.addBitmapAt( this, "modalGeneric_json.loader", BingoBackGroundSetting.gameSize.x >> 1, BingoBackGroundSetting.gameSize.y >> 1 );
			this.modalPreloader.anchorOffsetX = this.modalPreloader.width >> 1;
			this.modalPreloader.anchorOffsetY = this.modalPreloader.height >> 1;
		}
		this.addChild( this.modalPreloader );
		this.modalPreloader.addEventListener( egret.Event.ENTER_FRAME, this.onLoadingAnimation, this, false );
	}

	private onLoadingAnimation(event: egret.Event) {
		( event.currentTarget as egret.Bitmap ).rotation += 5;
	}
	
	protected addPo( event:egret.Event = null ){
		this.addPoFromTo( 0.2, 1 );
	}

	protected addPhonePo( event:egret.Event = null ){
		this.addPoFromTo( 0.1, 0.48 );
	}

	private addPoFromTo( fromScale: number, toScale: number ){
		this.currentPo.x = BingoBackGroundSetting.gameSize.x >> 1;
		this.currentPo.y = BingoBackGroundSetting.gameSize.y >> 1;
		this.currentPo.scaleX = fromScale;
		this.currentPo.scaleY = fromScale;
		this.currentPo.addEventListener( GenericModal.CLOSE_MODAL, this.closeCurrentPo, this );

		this.addChild( this.currentPo );
		let tw: egret.Tween = egret.Tween.get( this.currentPo );
		tw.to( {"scaleX": toScale, "scaleY" : toScale}, 300 );

		this.modalPreloader.removeEventListener( egret.Event.ENTER_FRAME, this.onLoadingAnimation, this, false );
		this.removeChild( this.modalPreloader );
	}

	public closeCurrentPo() {
		if (!this.currentPo) return;
		let tw: egret.Tween = egret.Tween.get( this.currentPo );
		tw.to( {"scaleX": 0.1, "scaleY" : 0.1}, 300 );
		tw.call(function() {
			this.removeChild( this.currentPo );
			this.removeChild( this.shadow );
		}, this);
		tw.wait(100);
		tw.call(function() {
			this.currentPo = null;
			// this.showFirstWaitingModal();
		}, this);
	}

	public showBank( event:egret.Event = null ){
		this.showShadow();

		let list = PlayerConfig.player( "external_contents" ).list;
		let className: string;
		let classUrl: string;
		let configUrl: string;
		for( let i: number = 0; i < list.length; i++ ){
			if( list[i].type == "bank" ){
				let poPath = list[i]["art"][0]["file"]["file_id_html5"];
				className = poPath.replace(/.*\/(.*)\//, "$1");
				classUrl = poPath + "load.js";
				configUrl = poPath + "data.res.json";
				GlobelSettings.bank = list[i].products;
			}
			if( list[i].type == "chipBank" ) GlobelSettings.chipBank = list[i].products;
		}
		
		this.loadDynamicClass( className, configUrl, classUrl );
	}

	private loadDynamicClass( className: string, assetConfigUrl: string, classUrl: string ){
		let cls: Function = egret.getDefinitionByName( className );
		if( cls ){
			this.showPoWithClassName( className, assetConfigUrl );
			return;
		}
        var s = document.createElement('script');
        s.async = false;
        s.src = classUrl;
		trace( "I am loading " + classUrl );
        s.addEventListener('load', function () {
            s.parentNode.removeChild(s);
			s.removeEventListener('load', eval("arguments.callee"), false);
			egret.getDefinitionByName( className )["needZoomOut"] = egret.getDefinitionByName( className )["needZoomOut"] == null ? true : false;
            this.showPoWithClassName( className, assetConfigUrl );
		}.bind(this), false);
        document.head.appendChild(s);
	}

	private showPoWithClassName( className: string, assetConfigUrl: string ){
		let cls: Function = egret.getDefinitionByName( className );
		this.showPoWithClass( cls, assetConfigUrl );
	}

	private showPoWithClass(myClass: Function, assetConfigUrl: string) {
		this.currentPo = eval("new myClass(assetConfigUrl)");
		this.currentPo.needZoomOut = eval( "myClass" )["needZoomOut"];
		if( this.currentPo.inited )this.addPo();
		else this.currentPo.addEventListener( GenericModal.GENERIC_MODAL_LOADED, this.addPo, this );
	}
}
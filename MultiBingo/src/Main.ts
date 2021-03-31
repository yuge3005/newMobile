class Main extends egret.DisplayObjectContainer {

    private currentGame: MultiPlayerMachine;
	private currentPo: GenericPo;

	private isMobile: boolean;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        egret.lifecycle.addLifecycleListener((context) => {
            context.onUpdate = () => {
            }
        })

        egret.lifecycle.onPause = () => {
			if( this.isMobile ) egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            if( this.isMobile ) egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await RES.loadConfig("resource/default.res.json", "resource/");
        this.createGameScene();
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this.showGame();
		MultiServer.serverInit();
    }

	private showGame(){
		this.currentGame = new MultyPlayerBingo("resource/default.res.json");

		const loadingView = new LoadingUI();
		this.currentGame.preLoader = loadingView;
		this.currentGame.addEventListener( MultiPlayerMachine.GENERIC_MODAL_LOADED, this.addGame, this );
		this.currentGame.addEventListener( "showBank", this.showBank, this );
		this.currentGame.addEventListener( "showGameSettings", this.showGameSettings, this );
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
        var loadingBar = document.getElementById( "loading_bar" );
        if( loadingBar ) loadingBar.parentNode.removeChild( loadingBar );
	}

    private shadow: egret.Shape;
    private modalPreloader: egret.Bitmap;

    private showShadow(){
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

	private addPo( event:egret.Event = null ){
		this.addPoFromTo( 0.2, 1 );
	}

	protected addPhonePo( event:egret.Event = null ){
		this.addPoFromTo( 0.1, 0.48 );
	}

	public closeCurrentPo() {
		if (!this.currentPo) return;
		let tw: egret.Tween = egret.Tween.get( this.currentPo );
		tw.to( {"scaleX": 0.2, "scaleY" : 0.2}, 300 );
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

	public showBank(){

	}

	private showGameSettings( event: egret.Event ){
		this.showShadow();

		this.currentPo = new GameSettingPopup;
		if (this.currentPo.inited) this.addPhonePo();
		else this.currentPo.addEventListener( GenericModal.GENERIC_MODAL_LOADED, this.addPhonePo, this );
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
}

var trace = function( a ){
	egret.log(a);
};
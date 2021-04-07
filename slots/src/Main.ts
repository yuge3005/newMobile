class Main extends SlotGameMain {
    public constructor() {
        super();
    }

	protected onAddToStage(event: egret.Event) {
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

    protected async runGame() {
        await RES.loadConfig("resource/game/turbo90/default.res.json", "resource/");
        await RES.loadConfig("resource/assets/default.res.json", "resource/");
        this.createGameScene();
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);
    }

	protected buildGame(){
		this.currentGame = new Turbo90("resource/game/turbo90/default.res.json");
	}

	protected addGameLoaderAndEvents(){
		super.addGameLoaderAndEvents();
		this.currentGame.addEventListener("megaFirst", this.showMegaFirst, this);
	}

    private showMegaFirst( event: egret.Event ){
		this.showShadow();

        MegaForFirstTime.lastRect = event.data;
        this.currentPo = new MegaForFirstTime;
		if (this.currentPo.inited) this.addPo();
		else this.currentPo.addEventListener( GenericModal.GENERIC_MODAL_LOADED, this.addPo, this );
    }
}
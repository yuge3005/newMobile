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
        await RES.loadConfig("resource/game/halloween25line/default.res.json", "resource/");
        await RES.loadConfig("resource/assets/default.res.json", "resource/");
        this.createGameScene();
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);
    }

	protected buildGame(){
		this.currentGame = new Halloween25line("resource/game/halloween25line/default.res.json");
	}
}
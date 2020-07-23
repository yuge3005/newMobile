class Main extends egret.DisplayObjectContainer {

    private currentGame: BingoMachine;

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
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource();
        this.createGameScene();
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("forAll", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this.showGame( "SuperLotto", "bin-debug/bingoGames/SuperLotto.js", "resource/default.res.json" );
		IBingoServer.serverInit();
    }

    public showGame( gameClassName: string, jsFilePath: string, assetsPath: string ){
		let fun: any = egret.getDefinitionByName( gameClassName );
		if( typeof(fun) == "function" ){
			this.showGameByClass( fun, assetsPath );
		}
		else{
			var s = document.createElement('script');
			s.async = false;
			s.src = jsFilePath;
			s.addEventListener('load', function () {
				s.parentNode.removeChild(s);
				s.removeEventListener('load', eval("arguments.callee"), false);
				console.log( "build game by classfile" );
				this.showGame( gameClassName, null, assetsPath );
			}.bind(this), false);
			document.head.appendChild(s);
		}
	}

	private showGameByClass( fun: Function, assetsPath: string ){
		this.currentGame = eval( "new fun(assetsPath)" );

		if( this.currentGame.inited )this.addGame();
		else{
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            this.currentGame.preLoader = loadingView;
            this.currentGame.addEventListener( BingoMachine.GENERIC_MODAL_LOADED, this.addGame, this );
        }
	}

	private addGame(){
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        let isMobile: boolean = stageW < stageH;
        if( isMobile ){
            this.currentGame.x = stageW;
            this.currentGame.rotation = 90;
        }
		this.addChild( this.currentGame );
		document.addEventListener("keydown", this.keyDown.bind(this) );
	}

	/**
	 * key down
	 */
	private keyDown(event): void {
		// if (Trigger.keyboard) return;
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
}
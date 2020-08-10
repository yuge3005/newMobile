class Main extends egret.DisplayObjectContainer {

    private currentGame: BingoMachine;
	private currentPo: GenericPo;

    public static gameSize: egret.Point = new egret.Point( 960, 540 );

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
        this.showGame( "Nineball", "bin-debug/bingoGames/Nineball.js", "resource/default.res.json" );
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
            this.addChild(loadingView);
            this.currentGame.preLoader = loadingView;
            this.currentGame.addEventListener( BingoMachine.GENERIC_MODAL_LOADED, this.addGame, this );
            this.currentGame.addEventListener("megaFirst", this.showMegaFirst, this);
        }
	}

	private addGame(){
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        let isMobile: boolean = stageW < stageH;
        if( isMobile ){
            this.x = stageW;
            this.rotation = 90;
        }
		this.addChild( this.currentGame );
		document.addEventListener("keydown", this.keyDown.bind(this) );
        var loadingBar = document.getElementById( "loading_bar" );
        if( loadingBar ) loadingBar.parentNode.removeChild( loadingBar );
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

    private showMegaFirst( event: egret.Event ){
		this.showShadow();

        MegaForFirstTime.lastRect = event.data;
        this.currentPo = new MegaForFirstTime;
		if (this.currentPo.inited) this.addPo();
		else this.currentPo.addEventListener( GenericModal.GENERIC_MODAL_LOADED, this.addPo, this );
    }

    private shadow: egret.Shape;
    private modalPreloader: egret.Bitmap;

    private showShadow(){
		if( !this.shadow ){
			this.shadow = new egret.Shape;
			GraphicTool.drawRect( this.shadow, new egret.Rectangle( 0, 0, Main.gameSize.x, Main.gameSize.y ), 0, false, 0.5 );
			this.shadow.touchEnabled = true;
		}
		this.addChild( this.shadow );

		if( !this.modalPreloader ){
			this.modalPreloader = Com.addBitmapAt( this, "modalGeneric_json.loader", Main.gameSize.x >> 1, Main.gameSize.y >> 1 );
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
		this.currentPo.x = Main.gameSize.x >> 1;
		this.currentPo.y = Main.gameSize.y >> 1;
		this.currentPo.scaleX = 0.2;
		this.currentPo.scaleY = 0.2;
		this.currentPo.addEventListener( GenericModal.CLOSE_MODAL, this.closeCurrentPo, this );
		// this.currentPo.addEventListener( GenericModal.MODAL_COMMAND, this.onModalCommand, this );

		this.addChild( this.currentPo );
		let tw: egret.Tween = egret.Tween.get( this.currentPo );
		tw.to( {"scaleX": 1, "scaleY" : 1}, 300 );

		this.modalPreloader.removeEventListener( egret.Event.ENTER_FRAME, this.onLoadingAnimation, this, false );
		this.removeChild( this.modalPreloader );
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
}
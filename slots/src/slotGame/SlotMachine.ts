class SlotMachine extends egret.DisplayObjectContainer {

	public static GENERIC_MODAL_LOADED: string = "gameLoaded";
	
	public preLoader: RES.PromiseTaskReporter;

	protected assetName: string;
	protected gameToolBar: SlotGameToolbar;
	protected topbar: Topbar;
	protected betBar: Betbar;
	protected dinero: number;
	protected gameCoins: number;
	protected freeSpin: number;

	private static currentGame: SlotMachine;
	public static currentGameId: number;

	protected soundManager: GameSoundManager;

	protected assetStr( str: string ): string{
		return this.assetName + "_json." + str;
	}

	public static getAssetStr( str: string ): string{
		return this.currentGame.assetStr( str );
	}

	public connectReady: boolean = false;
	public assetReady: boolean = false;
	public betListReady: boolean = false;

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super();
	}

	/**
	 * quick play
	 */
	public quickPlay(): void {
		this.gameToolBar.quickPlay();
	}
}
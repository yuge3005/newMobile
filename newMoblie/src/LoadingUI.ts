class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {

    public constructor() {
        super();
    }

    public onProgress(current: number, total: number): void {
        document.getElementById( "loading_progress_div" ).style.width = Math.floor( 639 * ( 0.18 + current / total * 0.72 + 0 ) ) + "px";
    }
}

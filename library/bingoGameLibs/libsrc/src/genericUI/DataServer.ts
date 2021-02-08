class DataServer {
	private callback: Function;
	private thisObject: any;
	private failedCallback: Function;

	public constructor() {
	}

	public getDataFromUrl( url: string, successCallback: Function, thisObject: any, postMethod: boolean = true, dataObejct: Object, failedCallbBack: Function = null ){
		let ld: egret.URLLoader = new egret.URLLoader;
		this.callback = successCallback;
		this.thisObject = thisObject;
		this.failedCallback = failedCallbBack;
		ld.addEventListener( egret.Event.COMPLETE, this.loadComplete, this );
		ld.addEventListener( egret.IOErrorEvent.IO_ERROR, this.loadFaild, this );
		ld.dataFormat = egret.URLLoaderDataFormat.TEXT;

		// add properties
		url = url.concat((url.indexOf("?") >= 0 ? "&" : "?").concat(PlayerConfig.properties));

		let urlRequest: egret.URLRequest = new egret.URLRequest(url);
		urlRequest.method = postMethod ? egret.URLRequestMethod.POST : egret.URLRequestMethod.GET;
		let variable: egret.URLVariables = new egret.URLVariables();
		variable.variables = dataObejct;
		urlRequest.data = variable;
		ld.load( urlRequest );
	}

	private loadComplete( event: egret.Event ){
		this.callback.call( this.thisObject, event.target.data );
	}

	private loadFaild( event: egret.IOErrorEvent ){
		if( this.failedCallback )this.failedCallback.call( this.thisObject, event.type );
	}
}
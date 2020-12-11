class FacebookBitmap {
	public constructor() {
	}

    public static downloadBitmapDataByFacebookID(facebookId: string, width: number, height: number, callback: Function, thisObject: any) {
        this.downloadBitmapDataByURL("https://graph.facebook.com/" + facebookId + "/picture?width=" + width + "&height=" + height, callback, thisObject);
    }

    public static downloadBitmapDataByURL(url: string, callback: Function, thisObject: any) {
        let imgLoader:egret.ImageLoader = new egret.ImageLoader;
		imgLoader.once(egret.Event.COMPLETE, callback, thisObject);
		imgLoader.crossOrigin = "anonymous";
		imgLoader.load(url);
    }
}
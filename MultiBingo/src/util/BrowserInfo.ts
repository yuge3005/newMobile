class BrowserInfo {
	public constructor() {
	}

	public static getBrowserInfo(): Object{
		var Sys = {};
		var ua = navigator.userAgent.toLowerCase();
		var re =/(msie|firefox|chrome|opera|version).*?([\d.]+)/;
		var m = ua.match(re);
		try{
			Sys["browser"] = m[1].replace(/version/, "'safari");
			Sys["ver"] = m[2];
		}
		catch(e){
			trace( "no browser info" );
		}
		return Sys;
	}

	public static textNeedUpInThisBrowser: number;
	public static textNeedUpHasTested: boolean;

	public static get textUp(): number{
		if( !this.textNeedUpHasTested ){
			var bs: Object = this.getBrowserInfo();
			this.textNeedUpInThisBrowser = 0;
			if( bs["browser"] == "chrome" ){
				var versionNumbers: Array<string> = bs["ver"].split(".");
				if( versionNumbers[0] && parseInt( versionNumbers[0] ) >= 71 ){
					if( versionNumbers[2] && parseInt( versionNumbers[2] ) >= 3550 ){
						this.textNeedUpInThisBrowser = 2;
					}
				}
			}
			this.textNeedUpHasTested = true;
		}
		return this.textNeedUpInThisBrowser;
	}
}
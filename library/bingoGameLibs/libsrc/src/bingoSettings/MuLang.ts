class MuLang {

	public static txt: Object = {};

	public static CASE_NORMAL: number = 0;
	public static CASE_UPPER: number = 1;
	public static CASE_LOWER: number = 2;
	public static CASE_TYPE_CAPITALIZE: number = 3;

	public constructor() {
	}

	public static getText( key: string, caseType: number = 0 ): string{
		if( !MuLang.txt ) return null;
		let lanObject: Object = MuLang.txt[key];
		if( !lanObject ) return key;
		let str: string = lanObject[MuLang.language];
		if( str ){
			switch( caseType ){
				default: return str;
				case 1: return str.toUpperCase();
				case 2: return str.toLowerCase();
				case 3: return str.substring(0, 1).toUpperCase() + str.substring(1, str.length).toLowerCase();
			}
		}
		else return key;
	}

	public static set language( value: string ){
		localStorage.setItem( "language", value );
	}
	public static get language(): string{
		if( localStorage && ["pt","en","es"].indexOf( localStorage["language"] ) >= 0 )return localStorage["language"];
		var resLan: string = requestStr( "lan" );
		if( ["pt","en","es"].indexOf(resLan ) >= 0 ) return resLan;
		return "pt";
	}
	public static lanuageNames: Object = {en:"english",es:"spanish",pt:"portuguese"};

	public static get languageName(){
		return this.lanuageNames[this.language];
	}
}
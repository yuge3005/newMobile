class GlobelSettings {

	public static serverVertion: number = 2;

	public constructor() {
	}

    public static get isRightClick(): boolean{
        return document["isRightClick"];
    }

	public static get language(): string{
		if( localStorage && ["pt","en","es"].indexOf( localStorage["language"] ) >= 0 )return localStorage["language"];
		var resLan: string = requestStr( "lan" );
		if( resLan ) return resLan;
		return "en";
	}
	public static lanuageNames: Object = {en:"english",es:"spanish",pt:"portuguese"};

	public static get languageName(){
		return this.lanuageNames[this.language];
	}
}

var trace = console.log;

function requestStr( str ){
	var resItems: Array<string> = location.search.split( /[?&]/ );
	var items: Object = Object;
	for( var i = 0; i < resItems.length; i++ ){
		var item: Array<string> = resItems[i].split("=");
		if( item.length == 2 ) items[item[0]] = item[1];
	}
	return items[str];
}
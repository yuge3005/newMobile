class GlobelSettings {

	public static serverVertion: number = 2;

	public constructor() {
	}
}

function requestStr( str ){
	var resItems: Array<string> = location.search.split( /[?&]/ );
	var items: Object = Object;
	for( var i = 0; i < resItems.length; i++ ){
		var item: Array<string> = resItems[i].split("=");
		if( item.length == 2 ) items[item[0]] = item[1];
	}
	return items[str];
}
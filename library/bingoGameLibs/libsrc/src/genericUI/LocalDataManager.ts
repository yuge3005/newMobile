class LocalDataManager {
	public constructor() {
	}

	public static updatePlayerData( key: string, value: any ){
		if( localStorage.getItem( "player" ) ){
			let str: string = localStorage.getItem( "player" );
			let ob: Object = JSON.parse(str);
			try{
				eval( "ob." + key + " = value" );
			}
			catch(e){
				return;
			}
			localStorage.setItem( "player", JSON.stringify( ob ) );
		}
	}

	public static updatePlayerDatas( items: Array<IKeyValues> ){
		if( localStorage.getItem( "player" ) ){
			let str: string = localStorage.getItem( "player" );
			let ob: Object = JSON.parse(str);
			for( let i: number = 0; i < items.length; i++ ){
				try{
					eval( "ob." + items[i].key + " = items[i].value" );
				}
				catch(e){
					return;
				}
			}
			localStorage.setItem( "player", JSON.stringify( ob ) );
		}
	}
}

interface IKeyValues{
	key: string;
	value: any;
}
class GameSettings {

	public static vertion: string = "2.6.2";

	public static set visualEffectOn( value: boolean ){
		if( this.visualEffectOn == value )return;
		egret.localStorage.setItem( "visualEffect", value ? "" : "false" );
	}
	public static get visualEffectOn(){
		if( egret.localStorage.getItem( "visualEffect" ) == "false" ) return false;
		return true;
	}

	public static set notificationOn( value: boolean ){
		if( this.notificationOn == value )return;
		egret.localStorage.setItem( "notification", value ? "" : "false" );
	}
	public static get notificationOn(){
		if( egret.localStorage.getItem( "notification" ) == "false" ) return false;
		return true;
	}

	public constructor() {
	}
}

var trace = function( a ){
	egret.log(a);
};
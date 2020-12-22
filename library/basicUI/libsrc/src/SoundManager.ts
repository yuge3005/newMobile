class SoundManager {

	private static currentBackgorundMusicChannel: egret.SoundChannel;
	private static currentBackgorundMusicSound: egret.Sound;

	public static set soundOn( value: boolean ){
		if( this.soundOn == value )return;
		egret.localStorage.setItem( "sound", value ? "" : "false" );
		if( value ){
			if( this.currentBackgorundMusicSound )this.startPlayGameMusic();
		}
		else{
			this.stopMusic();
		}
	}
	public static get soundOn(){
		if( egret.localStorage.getItem( "sound" ) == "false" ) return false;
		return true;
	}

	public constructor() {
	}
	
	public static set soundEfOn( value: boolean ){
		if( this.soundEfOn == value )return;
		egret.localStorage.setItem( "soundEf", value ? "" : "false" );
	}
	public static get soundEfOn(){
		if( egret.localStorage.getItem( "soundEf" ) == "false" ) return false;
		return true;
	}

	public static play( soundName: string, loop: boolean = false ): egret.SoundChannel{
		let sound: egret.Sound = RES.getRes( soundName );
		if( !sound ){
			egret.error( "can not fond sound resource:" + soundName );
			return null;
		}
		
		if( loop ){
			if( this.currentBackgorundMusicChannel )this.currentBackgorundMusicChannel.stop();
			this.currentBackgorundMusicSound = sound;
			if( this.soundOn ){
				this.startPlayGameMusic();
				return null;
			}
		}
		else{
			if( this.soundEfOn ){
				sound.type = egret.Sound.EFFECT;
				return sound.play( 0, 1 );
			}
		}
	}

	private static startPlayGameMusic(){
		this.currentBackgorundMusicSound.type = egret.Sound.MUSIC;
		this.currentBackgorundMusicChannel = this.currentBackgorundMusicSound.play( 0, 0 );
		this.currentBackgorundMusicChannel.volume = 0;
		let tween: egret.Tween = egret.Tween.get( this.currentBackgorundMusicChannel );
		tween.to( { volume: 1 }, 1000 );
	}

	public static stopMusic(){
		if( this.currentBackgorundMusicChannel ){
			egret.Tween.removeTweens( this.currentBackgorundMusicChannel );
			this.currentBackgorundMusicChannel.stop();
			this.currentBackgorundMusicChannel = null;
		}
	}
}
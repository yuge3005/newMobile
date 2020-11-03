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
			if( this.currentBackgorundMusicChannel ){
				egret.Tween.removeTweens( this.currentBackgorundMusicChannel );
				this.currentBackgorundMusicChannel.stop();
				this.currentBackgorundMusicChannel = null;
			}
		}
	}
	public static get soundOn(){
		if( egret.localStorage.getItem( "sound" ) == "false" ) return false;
		return true;
	}

	public constructor() {
	}

	public static play( soundName: string, loop: boolean = false ){
		if( !this.soundOn && !loop )return;

		let sound: egret.Sound = RES.getRes( soundName );
		if( !sound )return;//throw new Error( "can not fond sound resource" );
		
		if( loop ){
			if( this.currentBackgorundMusicChannel ){
				this.currentBackgorundMusicChannel.volume = 0;
				let musicChannel = this.currentBackgorundMusicChannel;
				let tween: egret.Tween = egret.Tween.get( musicChannel );
				tween.wait( 3000 );
				tween.call( () => { musicChannel.stop() } );
			}
			this.currentBackgorundMusicSound = sound;
			if( this.soundOn )this.startPlayGameMusic();
		}
		else{
			if( this.soundOn ){
				sound.type = egret.Sound.EFFECT;
				sound.play( 0, 1 );
			}
		}
	}

	private static startPlayGameMusic(){
		this.currentBackgorundMusicSound.type = egret.Sound.MUSIC;
		this.currentBackgorundMusicChannel = this.currentBackgorundMusicSound.play( 0, 0 );
		this.currentBackgorundMusicChannel.volume = 0;
		let tween: egret.Tween = egret.Tween.get( this.currentBackgorundMusicChannel );
		tween.to( { volume: 0.8 }, 3000 );
	}
}
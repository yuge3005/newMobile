class GameSoundManager {
    private playing: Array<egret.SoundChannel> = [];
    private static instance: GameSoundManager = null;

    constructor() {
        GameSoundManager.instance = this;
    }
    
    public play( soundAssetName: string, repeat: number = 1, callback: Function = null ): void {
        let soundChannel: egret.SoundChannel = SoundManager.play( soundAssetName, repeat === -1 );
        if (callback !== null && repeat !== -1) {
            soundChannel["soundCallback"] = callback;
            soundChannel["soundAssetName"] = soundAssetName;
            soundChannel.addEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this );
        }

        if( soundChannel ){
            this.playing.push(soundChannel);
        }

        if( !soundChannel && callback ){
            callback();
        }
    }

    private onSoundComplete( e: egret.Event ): void{
        let soundChannel: egret.SoundChannel = e.currentTarget;
        soundChannel.removeEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this );
        if( soundChannel["soundCallback"] ){
            soundChannel["soundCallback"]();
            soundChannel["soundCallback"] = null;
        }

        let index: number = this.playing.indexOf( soundChannel );
        this.playing.splice( index, 1 );
    }

    public stop(soundAssetName: string): void {
        for( let i: number = 0; i < this.playing.length; i++ ){
            let soundChannel: egret.SoundChannel = this.playing[i];
            if( soundChannel["soundAssetName"] == soundAssetName ){
                soundChannel.stop();
                if( soundChannel["soundCallback"] ){
                    soundChannel["soundCallback"]();
                    soundChannel["soundCallback"] = null;
                }
                this.playing.splice( i, 1 );
                i--;
            }
        }

        SoundManager.stopMusic();
    }

    public stopAll(): void {
        for (let i = 0; i < this.playing.length; i++) {
            let sound: egret.SoundChannel = this.playing[i];
            if (sound["soundCallback"]){
                sound.removeEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this );
                sound["soundCallback"]();
                sound["soundCallback"] = null;
            }
            sound.stop();
        }
        this.playing = [];
    }

    public static stopAll(): void {
        if (this.instance) this.instance.stopAll();
    }
}
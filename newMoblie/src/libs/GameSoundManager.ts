class GameSoundManager {
    private playing: Array<egret.SoundChannel> = [];
    private static instance: GameSoundManager = null;

    constructor() {
        GameSoundManager.instance = this;
    }
    
    /**
     * play sound
     * @param soundAssetName the name of sound asset
     * @param repeat repeat count
     * @param callback execute function after sound play completed
     * @param thisObject 'this' object of callback
     */
    public play(soundAssetName: string, repeat: number = 1, callback: Function = null, thisObject: Object = null): void {
        if (SoundManager.soundOn && this.sounds[soundAssetName]) {
            if (this.playing[soundAssetName] && this.playing[soundAssetName].length > 0 && repeat === -1) return;
            let sound = <egret.Sound>RES.getRes(soundAssetName);
            sound.type = repeat === -1 ? egret.Sound.MUSIC : egret.Sound.EFFECT;
            let channel = sound.play(0, repeat);
            if (callback !== null && repeat !== -1) {
                channel["soundCallback"] = callback;
                channel["soundAssetName"] = soundAssetName;
                channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this );
            }
            if (!this.playing[soundAssetName]) { 
                this.playing[soundAssetName] = [];
            }
            this.playing[soundAssetName].push(channel);
        } else if (callback) {
            callback();
        }
    }

    private onSoundComplete( e: egret.Event ): void{
        let channel: egret.SoundChannel = e.currentTarget;
        channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this );
        channel["soundCallback"]();
        channel["soundCallback"] = null;

        let soundAssetName: string = channel["soundAssetName"];
        let sounds = <Array<egret.SoundChannel>>this.playing[soundAssetName];
        let index: number = sounds.indexOf( channel );
        sounds.splice( index, 1 );
    }

    /**
     * stop sound
     * @param soundAssetName the name of sound asset
     */
    public stop(soundAssetName: string): void {
        if (this.playing[soundAssetName]) {
            let sounds = <Array<egret.SoundChannel>>this.playing[soundAssetName];
            for (let i = 0; i < sounds.length; i++) {
                sounds[i].stop();
                // if (sounds[i]["soundCallback"]) sounds[i]["soundCallback"]();
                sounds[i] = null;
            }
            this.playing[soundAssetName] = [];
        }
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
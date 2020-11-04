
class GameSoundManager {
    private sounds: Object = {};
    private playing: Object = {};
    private timer: egret.Timer;
    private static instance: GameSoundManager = null;

    constructor() {
        // timer  clean stopped sounds every 10 seconds
        this.timer = new egret.Timer(10000, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.cleanStoppedSounds, this);
        this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.cleanStoppedSounds, this);
        this.timer.start();

        GameSoundManager.instance = this;
    }

    /**
     * clean stopped sounds
     */
    private cleanStoppedSounds(): void {
        let soundChannel: egret.SoundChannel = null;
        for (let sound in this.playing) {
            if (this.playing[sound] && this.playing[sound].length > 0) {
                for (let i = 0; i < this.playing[sound].length; i++) {
                    soundChannel = <egret.SoundChannel>this.playing[sound][i];
                    if (soundChannel["isStopped"]) {
                        this.playing[sound][i] = null;
                        this.playing[sound].splice(i, 1);
                        i--;
                    }
                }
            }
        }
    }

    /**
     * load sounds
     */
    public loadSounds(sounds: Array<string>): void {
        for (let i = 0; i < sounds.length; i++) {
            if (this.sounds[sounds[i]]) continue;
            this.sounds[sounds[i]] = RES.getRes(sounds[i]);
        }
    }

    /**
     * push sound
     */
    public pushSound(sound: string): void {
        if (typeof this.sounds[sound] === "undefined" || this.sounds[sound] === null) {
            this.sounds[sound] = <egret.Sound>RES.getRes(sound);
        }
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

    /**
     * stop all sounds
     */
    public stopAll(): void {
        for (let sound in this.playing) {
            let sounds = <Array<egret.SoundChannel>>this.playing[sound];
            if (sounds) {
                for (let i = 0; i < sounds.length; i++) {
                    if (sounds[i]["soundCallback"]){
                        sounds[i].removeEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this );
                        sounds[i]["soundCallback"]();
                        sounds[i]["soundCallback"] = null;
                    }
                    sounds[i].stop();
                }
            }
        }
        this.playing = [];
    }

    /**
     * stop all sounds
     */
    public static stopAll(): void {
        if (this.instance) this.instance.stopAll();
    }
}
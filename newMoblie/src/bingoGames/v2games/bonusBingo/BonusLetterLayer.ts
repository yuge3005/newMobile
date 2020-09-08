class BonusLetterLayer extends egret.DisplayObjectContainer{

	private static bonusString: string = "BONUS";
	private bonusLetters: Array<egret.Bitmap>;
    private bonusLightLetters: Array<egret.Bitmap>;

	private curtains2: Array<egret.MovieClip>;

	public betProgress: Object;
	public betBonusRounds: Object;
	private betLuckMultis: Object;

	public get luckMultiTimes(){
        if( this.betLuckMultis[ GameData.currentBet ] )return this.betLuckMultis[ GameData.currentBet ];
        else return 0;
    }
    public set luckMultiTimes( value: number ){
        if( value )this.betLuckMultis[ GameData.currentBet ] = value;
        else this.betLuckMultis[ GameData.currentBet ] = 0;
    }

	private bonusCoverBgYellow: egret.Bitmap;
    private bonusCoverUpYellow: egret.Bitmap;
    private bonusCoverUpRed: egret.Bitmap;
    private bonusLightBg: egret.Bitmap;
    private bonusLight: egret.Bitmap;

	public constructor() {
		super();
	}

	public getBonusLetes(): void{
		if( !this.parent ) alert( "must on stage" );
        this.bonusLetters = [];
        this.bonusLightLetters = [];
        for( let i: number = 0; i < 5; i++ ){
            let bonusLetter: egret.Bitmap = this.parent.getChildByName( BingoMachine.getAssetStr( "light_" + BonusLetterLayer.bonusString[i] ) ) as egret.Bitmap;
            bonusLetter.visible = false;
            bonusLetter.anchorOffsetX = bonusLetter.width >> 1;
            bonusLetter.x += bonusLetter.width >> 1;
            bonusLetter.anchorOffsetY = bonusLetter.height >> 1;
            bonusLetter.y += bonusLetter.height >> 1;
            this.bonusLetters[i] = bonusLetter;
            let bonusLightLetter: egret.Bitmap = this.parent.getChildByName( BingoMachine.getAssetStr( "light_" + BonusLetterLayer.bonusString[i] + "_02" ) ) as egret.Bitmap;
            bonusLightLetter.visible = false;
            this.bonusLightLetters[i] = bonusLightLetter;
        }
    }

	public getCovers(){
		if( !this.parent ) alert( "must on stage" );
		this.bonusCoverBgYellow = this.parent.getChildByName( BingoMachine.getAssetStr( "fiveball_bg_special" ) ) as egret.Bitmap;
        this.bonusCoverUpRed = this.parent.getChildByName( BingoMachine.getAssetStr( "fiveball_bg_cover" ) ) as egret.Bitmap;
        this.addChild( this.bonusCoverUpRed );
        this.bonusCoverUpYellow = this.parent.getChildByName( BingoMachine.getAssetStr( "fiveball_bg_special_cover" ) ) as egret.Bitmap;
        this.addChild( this.bonusCoverUpYellow );
        this.bonusLightBg = this.parent.getChildByName( BingoMachine.getAssetStr( "light_bg" ) ) as egret.Bitmap;
        this.bonusLight = this.parent.getChildByName( BingoMachine.getAssetStr( "fiveball_light" ) ) as egret.Bitmap;
	}

	public getServerData( bonusBalls: string, bonusRounds: string, luckmultis: string ){
		this.betProgress = BonusDataSetting.getProgressData( bonusBalls );
		this.betBonusRounds = BonusDataSetting.getBonusRounds( bonusRounds );
        this.betLuckMultis = BonusDataSetting.getLuckMultis( luckmultis );
	}

	public superMode( status: boolean ){
		this.bonusLightBg.visible = status;
        this.bonusLight.visible = status;
        this.bonusCoverBgYellow.visible = status;
        this.bonusCoverUpYellow.visible = status;
	}

	public setBonusLetters( status: boolean, bonusRoundLeft: number ): void{
        if( status ){
            for( let i: number = 0; i < 5; i++ ){
                if( i < bonusRoundLeft )this.bonusLetters[i].visible = this.bonusLightLetters[i].visible = true;
                else this.bonusLetters[i].visible = this.bonusLightLetters[i].visible = false;
            }
        }
        else{
            let bonusPregress: Array<boolean> = this.betProgress[ GameData.currentBet ];
            if( !bonusPregress ) bonusPregress = [ false, false, false, false, false ];
            for( let j: number = 0; j < 5; j++ ){
                if( bonusPregress[j] )this.bonusLetters[j].visible = true;
                else this.bonusLetters[j].visible = false;
                this.bonusLightLetters[j].visible = false;
            }
        }
    }

	public letLetterBlink( bonusBallIndex: number ){
        this.addChild( this.bonusLetters[ bonusBallIndex ] );
        this.addChild( this.bonusLightLetters[ bonusBallIndex ] );
        let tw: egret.Tween = egret.Tween.get( this.bonusLetters[ bonusBallIndex ] );
        tw.to( { scaleX : 3, scaleY : 3 }, 300 );
        tw.to( { scaleX : 1, scaleY : 1 }, 300 );
        tw.to( { scaleX : 3, scaleY : 3 }, 300 );
        tw.to( { scaleX : 1, scaleY : 1 }, 300 );
    }

	public showLightLetters(): void{
        let tw: egret.Tween = egret.Tween.get( this );
        let letterDelay: number = 500;
        for( let i: number = 0; i < 5; i++ ){
            tw.wait( letterDelay );
            tw.call( () => { this.bonusLightLetters[i].visible = true } );
        }
        tw.wait( letterDelay );
        // tw.call( this.showCurtain2Animation.bind( this ) );
    }

	/*private showCurtain2Animation(): void{
        let curtains: Array<egret.MovieClip> = [];
        this.setbonusByBet();
        for( let i: number = 0; i < 4; i++ ){
            let offsetX: number = ( i & 1 ) ? 553 : 31;
            let offsetY: number = Math.floor( i / 2 ) ? 254 : 55;
            curtains[i] = Com.addMovieClipAt( this, this._mcf, "bonusBingo_curtains_02", offsetX, offsetY );
            curtains[i].gotoAndPlay(1);
            if( this.curtains1[i].parent ){
                this.curtains1[i].parent.removeChild( this.curtains1[i] );
            }
        }
        curtains[0].addEventListener( egret.Event.ENTER_FRAME, this.curtain2AnimationFrameCounter, this );
        this.curtains2 = curtains;
        this.waitForCurtain2Animation = true;
    }

	private curtain2AnimationFrameCounter( event: egret.Event ): void{
        let curtains2: egret.MovieClip = event.currentTarget as egret.MovieClip;
        if( curtains2.currentFrame == 25 && this.waitForCurtain2Animation ){
            this.waitForCurtain2Animation = false;
            for( let i: number = 0; i < 4; i++ ){
                if( this.curtains2[i].parent ){
                    this.curtains2[i].stop();
                    this.curtains2[i].parent.removeChild( this.curtains2[i] );
                }
            }
            curtains2.removeEventListener( egret.Event.ENTER_FRAME, this.curtain2AnimationFrameCounter, this );
            this.returnToNormalGame();
        }
    }*/
}
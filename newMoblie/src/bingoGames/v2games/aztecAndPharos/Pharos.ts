class Pharos extends AztecPharosSuper{

	protected static get classAssetName(){
		return "pharos";
	}

    protected static get animationAssetName(){
		return "pharosAnimation";
	}

	public constructor( assetsPath: string ) {
		super( "pharos.conf", assetsPath, 42 );

        TowerGrid.blink1PicName = "Image-262-1";
        TowerGrid.blink2PicName = "Image-264-1";
        TowerGrid.defaultBgPicName = "Image-260-1";
        TowerGrid.onEffBgPicName = "Image-269-1";
        TowerGrid.linePicName = "Image-264-1";

        CardGrid.defaultBgColor = 0xFFFFFF;
        CardGrid.defaultNumberSize = 25;
	}

    protected init(){
        super.init();

        this.addGameText( 35, 322, 16, 0xE8D4AF, "bingo",false, 200 );
        this.addGameText( 35, 349, 16, 0xE8D4AF, "three side",false, 200 );
        this.addGameText( 35, 376, 16, 0xE8D4AF, "two side",false, 200 );
        this.addGameText( 35, 403, 16, 0xE8D4AF, "one side",false, 200 );

        this.buildSuperEbArea( "mega_" + GlobelSettings.language, 142, 14 );

        this.gameUnderLine();
    }

    protected showLastBall( ballIndex: number ): void{
        super.showLastBall( ballIndex );
        super.showLastBallAt(ballIndex, 141, 13);
        
        this.playSound("pr_ball_wav");
        if (this.btExtra && (this.currentBallIndex === this.gratisNumber - 1)) this.playSound("pr_free_extra_ball_mp3");
	}

    protected getGratisUI(): egret.DisplayObject{
        return Com.addMovieClipAt( this, this._mcf, "pharos", 0, 0 );
    }

/******************************************************************************************************************************************************************/    

    protected showJackpot( jackpot: number, jackpotMinBet: number, betConfig: Array<Object> ){
        this.addChild( this.jackpotArea = new JackpotLayer( new egret.Point( 35, 220 ), jackpot, jackpotMinBet, betConfig, new egret.Point( -14, -15 ), new egret.Rectangle( 0, 30, 135, 16 ), 16, 0xd6c576, new egret.Rectangle( 0, 0, 135, 18 ), 18, 0xd6c576 ) );
    }

    protected getPaytablesFit( paytabledName: string, callback: Function = null ): void{
		let soundName = "";
        switch (paytabledName) {
            case "one side": soundName = "pr_1side_mp3";break;
            case "two side": soundName = "pr_2side_mp3";break;
            case "bingo": soundName = "pr_bingo_mp3";break;
            case "three side": soundName = "pr_3side_mp3";break;
            default: break;    
        }
        if (SoundManager.soundOn && soundName !== "") {
            this.playSound(soundName, 1, callback);
        } else {
            callback();
        }
	}

    protected onBetChanged(event: egret.Event): void{
        super.onBetChanged(event);
        
        if (event.data["type"] !== 0) this.playSound("pr_bet_mp3");
	}

    protected hasExtraBallFit(): void {
        this.stopSound("pr_ball_wav");
        if (this.firstHaveExtraBall) {
            this.firstHaveExtraBall = false;
            this.playSound("pr_have_extra_ball_mp3");
            this.showFreeExtraPosition();
        }

        if( this.isMegaBall ){
            this.superExtraBg.visible = true;
            this.gameToolBar.megeExtraOnTop( true );
            this.runningBallContainer.addChild( this.superExtraBg );

            if( localStorage.getItem( "pharo_mega" ) ) return;
            else{
                localStorage.setItem( "pharo_mega", "true" );
                let ev: egret.Event = new egret.Event( "megaFirst" );
                ev.data = new egret.Rectangle( 212, 157, 95, 77 );
                this.dispatchEvent( ev );
            }
        }
    }
    
    protected roundOver(): void {
        super.roundOver();
        this.stopSound("pr_ball_wav");
    }

	protected getExtraBallFit(): void {
		this.playSound("pr_extra_ball_mp3");
	}

	protected collectExtraBall(): void {
		this.playSound("pr_collect_mp3");
	}

	protected changeNumberSound(): void {
		this.playSound("pr_card_mp3");
	}
}
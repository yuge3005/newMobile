class AztecPharosSuper extends V2Game{

    protected pharosPattenTexts: Array<TextLabel>;
    protected pharosPattenBlickCount: Array<number>;

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super( gameConfigFile, configUrl, gameId );
        this.ptFilterConfig = "aztec_filt";
        this.languageObjectName = "pharos_tx";

        CardManager.cardType = TowerCard;
        GameCard.useRedEffect = true;

        // this.needListenToolbarStatus = true;
        // this.tipStatusTextPosition = new egret.Rectangle( 300, 156, 260, 18 );
        // this.tipStatusTextColor = 0x3b2800;

        this.ballArea.needLightCheck = true;
	}

	protected init(){
        super.init();

        let betTip: TextLabel = this.addGameText( 295, 678, 36, 0xE8D4AF, "bet", true, 150, "", 0.9 );
        betTip.fontFamily = "Arial";
        betTip.bold = true;

        this.betText = this.addGameTextCenterShadow( 425, 678, 36, 0xE8D4AF, "bet", true, 178, true, false );
        this.betText.textAlign = "right";
        this.betText.fontFamily = "Arial";
        this.betText.bold = true;
        this.betText.scaleX = 0.9;
        this.creditText = new TextLabel;

        if( this.extraUIObject ){
            this.extraUIShowNumber();
            this.addChild( this.extraUIObject );
        }
	}
	
	protected showExtraUI( show: boolean = true ){
        if( this.extraUIObject ){
            let tw: egret.Tween = egret.Tween.get( this.extraUIObject );
            if( !show )tw.to( { x: -24 }, 500 );
            else{
                if( this.currentBallIndex == 36 )tw.to( { x: -190 }, 500 );
            }
        }
        if( !show )if( !show && this.gratisUI && this.contains( this.gratisUI ) )this.removeChild( this.gratisUI );
    }

    protected showMissExtraBall( balls: Array<number> ){
        super.showMissExtraBall( balls );
        if( this.extraUIObject ){
            let tw: egret.Tween = egret.Tween.get( this.extraUIObject );
            tw.to( { x: -190 }, 200 );
        }
    }

    protected afterCheck( resultList: Array<Object> ): void{
        this.clearPaytableFgs();
        super.afterCheck( resultList );
    }

    protected startPlay(): void {
        super.startPlay();
        this.clearPaytableFgs();
    }

    private clearPaytableFgs(){
        for( let i: number = 0; i < 4; i++ ){
            this.pharosPattenTexts[i].textColor = 0xE8D4AF;
        }
        this.pharosPattenBlickCount = null;
        this.removeEventListener( egret.Event.ENTER_FRAME, this.onPaytableBlink, this );
    }

    protected onPaytableBlink( egret: egret.Event ){
    }
}
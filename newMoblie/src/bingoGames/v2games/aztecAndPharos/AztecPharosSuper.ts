class AztecPharosSuper extends V2Game{
	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super( gameConfigFile, configUrl, gameId );
        this.ptFilterConfig = "aztec_filt";
        this.languageObjectName = "pharos_tx";

        CardManager.cardType = TowerCard;
        GameCard.useRedEffect = true;

        this.needListenToolbarStatus = true;
        this.tipStatusTextPosition = new egret.Rectangle( 300, 156, 260, 18 );
        this.tipStatusTextColor = 0x3b2800;

        this.ballArea.needLightCheck = true;
	}

	protected init(){
        super.init();

        this.showNoBetAndCredit();

        if( this.extraUIObject ) this.extraUIShowNumber();
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
}
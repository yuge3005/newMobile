class AztecPharosSuper extends V2Game{

    protected pharosPattenTexts: Array<TextLabel>;
    protected pharosPattenBlickCount: Array<number>;

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super( gameConfigFile, configUrl, gameId );
        this.languageObjectName = "pharos_tx";

        CardManager.cardType = TowerCard;
        GameCard.useRedEffect = true;

        this.needListenToolbarStatus = true;
        this.tipStatusTextPosition = new egret.Rectangle( 430, 85, 169, 45 );
        this.tipStatusTextColor = 0x0;

        this.ballArea.needLightCheck = true;
	}

	protected init(){
        super.init();

        let betTip: TextLabel = MDS.addGameText( this, 295, 678, 36, 0xE8D4AF, "bet", true, 150, "", 0.9 );
        betTip.fontFamily = "Arial";
        betTip.bold = true;

        this.betText = MDS.addGameTextCenterShadow( this, 425, 678, 36, 0xE8D4AF, "bet", true, 178, true, false );
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

    private tipStatusCoinTypeText: TextLabel;

    protected listenToGameToolbarStatus(): void{
        this.gameToolBar.addEventListener( "tipStatus", this.tipStatus, this );

        let rect: egret.Rectangle = this.tipStatusTextPosition;
        this.tipStatusText = MDS.addGameText( this, rect.x, rect.y, rect.height, this.tipStatusTextColor, "bet", false, rect.width );
        this.tipStatusText.textAlign = "center";
        this.tipStatusText.verticalAlign = "middle";
        this.tipStatusText.scaleX = 1;
        this.tipStatusText.text = "";
        Com.addObjectAt( this.runningBallContainer, this.tipStatusText, rect.x, rect.y );

        this.tipStatusCoinTypeText = MDS.addGameText( this, 0, 0, 35, this.tipStatusTextColor, "bet", false, rect.width - 40 );
        this.tipStatusCoinTypeText.textAlign = "center";
        this.tipStatusCoinTypeText.verticalAlign = "middle";
        this.tipStatusCoinTypeText.scaleX = 1;
        this.tipStatusCoinTypeText.text = "";
        Com.addObjectAt( this.runningBallContainer, this.tipStatusCoinTypeText, rect.x + 20, rect.y + 45 );
	}

    protected tipStatus( e: egret.Event, textDoubleLine: boolean = false ): void{
        trace( "status:" + e["status"] );
        switch( e["status"] ){
			case GameCommands.extra:
				let extraStr: string = "";
                if( e["extraPrice"] ) extraStr += Utils.formatCoinsNumber( e["extraPrice"] );
				else extraStr += MuLang.getText("free");
				this.tipStatusText.setText( extraStr );
                this.tipStatusCoinTypeText.setText( MuLang.getText( "coins" ) );
			    break;
            case "ready":
                break;
			default:
				this.tipStatusText.text = "";
                this.tipStatusCoinTypeText.text = "";
			    break;
		}
    }
}
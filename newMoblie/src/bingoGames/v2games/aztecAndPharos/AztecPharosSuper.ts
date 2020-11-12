class AztecPharosSuper extends V2Game{

    protected extraPosition1: number;
    protected extraPosition2: number;

	public constructor( gameConfigFile: string, configUrl: string, gameId: number ) {
		super( gameConfigFile, configUrl, gameId );
        this.languageObjectName = "pharos_tx";

        CardManager.cardType = TowerCard;
        GameCardUISettings.useRedEffect = true;

        this.ballArea.needLightCheck = true;
	}

	protected init(){
        super.init();

        if( this.extraUIObject ){
            this.extraUIShowNumber();
            this.addChild( this.extraUIObject );
        }
	}
	
	protected showExtraUI( show: boolean = true ){
        if( this.extraUIObject ){
            let tw: egret.Tween = egret.Tween.get( this.extraUIObject );
            if( !show )tw.to( { x: this.extraPosition1 }, 500 );
            else{
                if( this.currentBallIndex == 36 )tw.to( { x: this.extraPosition2 }, 500 );
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
        this.payTableArea.clearPaytableFgs();
        super.afterCheck( resultList );
    }

    protected startPlay(): void {
        super.startPlay();
        this.payTableArea.clearPaytableFgs();
    }

    private tipStatusCoinTypeText: TextLabel;

    protected listenToGameToolbarStatus(): void{
        this.gameToolBar.addEventListener( "tipStatus", this.tipStatus, this );

        let rect: egret.Rectangle = this.tipStatusTextPosition;
        this.tipStatusText = MDS.addGameTextCenterShadow( this, rect.x, rect.y, rect.height, this.tipStatusTextColor, "bet", false, rect.width, true, false );
        this.tipStatusText.verticalAlign = "middle";
        this.tipStatusText.text = "";
        Com.addObjectAt( this.runningBallContainer, this.tipStatusText, rect.x, rect.y );

        this.tipStatusCoinTypeText = MDS.addGameTextCenterShadow( this, 0, 0, 35, this.tipStatusTextColor, "bet", false, rect.width - 40, true, false );
        this.tipStatusCoinTypeText.verticalAlign = "middle";
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
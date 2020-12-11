class MaraFeatureLayer extends egret.DisplayObjectContainer{

	private featureItems: Array<MaraFeatureItem>;
	private featureLocks: Array<egret.DisplayObject>;
	private locksPosition: Array<number> = [331, 481, 631];

	private static cardFeatureNames: Array<string> = ["fishingNet", "swirl"];

	public constructor() {
		super();

		this.featureLocks = [];
		this.cacheAsBitmap = true;
	}

	public getNewFeatureItems( features : Array<Object> ){
		this.clearItems();

		this.featureItems = [];
		for( let i: number = 0; i < features.length; i++ ){
			this.featureItems[i] = new MaraFeatureItem( features[i] );
			this.featureItems[i].y = i * 150 + 331;
			this.addChild( this.featureItems[i] );
			this.featureItems[i].addEventListener( "featureEvent", this.onFeatrue, this );
			this.featureItems[i].addEventListener( "featureTip", this.onFeatrue, this );
		}
	}

	private clearItems(){
		if( this.featureItems && this.featureItems.length ){
			for( let i: number = 0; i < this.featureItems.length; i++ ){
				this.featureItems[i].removeEventListener( "featureEvent", this.onFeatrue, this );
				this.featureItems[i].removeEventListener( "featureTip", this.onFeatrue, this );
			}
		}
		this.removeChildren();
		this.featureLocks = [];
	}

	private onFeatrue( event: egret.Event ){
		this.dispatchEvent( event );
	}

	public lockCardFeature( usedFeatureName: string ){
		if( this.cancelMaskBg && this.contains( this.cancelMaskBg ) )this.removeChild( this.cancelMaskBg );
		for( let i: number = 0; i < 3; i++ ){
			if( usedFeatureName == this.featureItems[i].featureName ){
				this.addSelfLock( i );
				continue;
			}
			let index: number = MaraFeatureLayer.cardFeatureNames.indexOf( this.featureItems[i].featureName );
			if( index >= 0 ) this.addComflixLock( i );
		}
	}

	public lockGridFeature( usedFeatureName: string ){
		if( this.cancelMaskBg && this.contains( this.cancelMaskBg ) )this.removeChild( this.cancelMaskBg );
		for( let i: number = 0; i < 3; i++ ){
			if( usedFeatureName == this.featureItems[i].featureName ){
				this.addSelfLock( i );
				continue;
			}
			else this.addComflixLock( i );
		}
	}

	private addComflixLock( lockNumber: number ){
		if( this.featureLocks[lockNumber] && this.contains( this.featureLocks[lockNumber] ) ) this.removeChild( this.featureLocks[lockNumber] );
		this.featureLocks[lockNumber] = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "next_base" ), 20, this.locksPosition[lockNumber] );
		this.featureLocks[lockNumber].touchEnabled = true;
		this.addChild( this.featureLocks[lockNumber] );
	}

	private addSelfLock( lockNumber: number ){
		if( this.featureLocks[lockNumber] && this.contains( this.featureLocks[lockNumber] ) ) this.removeChild( this.featureLocks[lockNumber] );
		this.featureLocks[lockNumber] = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "used" ), 20, this.locksPosition[lockNumber] );
		this.featureLocks[lockNumber].touchEnabled = true;
		this.addChild( this.featureLocks[lockNumber] );
	}

	public waitForChoose( data: Object ){
		for( let i: number = 0; i < 3; i++ ){
			if( data["name"] == this.featureItems[i].featureName ) this.addTempLock( i );
		}
	}

	private cancelMaskBg: egret.Bitmap;

	private addTempLock( lockNumber: number ){
		if( this.featureLocks[lockNumber] && this.contains( this.featureLocks[lockNumber] ) ){
			this.removeChild( this.featureLocks[lockNumber] );
			console.error( "cancel used feature" );
		}
		if( !this.cancelMaskBg ){
			this.cancelMaskBg = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "skill gray" ), -24, 238 );
			this.cancelMaskBg.touchEnabled = true;
		}
		this.addChild( this.cancelMaskBg );
		this.featureLocks[lockNumber] = Com.addDownButtonAt( this, "mara_" + MuLang.language + "_json.base", "mara_" + MuLang.language + "_json.base", 20, this.locksPosition[lockNumber], this.cencelSkill.bind(this), true );
	}

	private cencelSkill( event: egret.TouchEvent ){
		this.removeChild( event.target );
		this.removeChild( this.cancelMaskBg );
		this.dispatchEvent( new egret.Event( "featureCancel" ) );
	}

	public betStepPrice(){
		if( this.featureItems && this.featureItems.length ){
			for( let i: number = 0; i < this.featureItems.length; i++ ){
				this.featureItems[i].betStepPrice();
			}
		}
	}
}
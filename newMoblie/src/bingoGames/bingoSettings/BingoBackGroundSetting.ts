class BingoBackGroundSetting{

	public static gameAreaWidth: number = 800;
	public static gameAreaHeight: number = 680;
	private static bgColor: number;
	private static bgItems: Array<string>;

	public static gameScale: egret.Point;
	public static gameMask: egret.Rectangle;

	public static assetName: string;
	public static getAssetStr( str: string ): string{
		return this.assetName + "_json." + str;
	}

	public constructor() {
	}

	public static getBackgroundData( bgColor: number, bgItems: Array<string>, assetName: string ): void{
		this.bgColor = bgColor;
		this.bgItems = bgItems;
		this.assetName = assetName;
	}

	public static initBackground( target: egret.Sprite ): egret.MovieClipDataFactory{
		this.drawBackgroundOn( target );
		let movieClipDataFactory: egret.MovieClipDataFactory = this.getAnimationFactory( target );
		this.buildBGItemsByArray( target, movieClipDataFactory );
		return movieClipDataFactory;
	}
	
	private static getAnimationFactory( target: egret.Sprite ): egret.MovieClipDataFactory{
		let animationAssetsName: string = egret.getDefinitionByName( egret.getQualifiedClassName(target) ).animationAssetName;
		let data = RES.getRes( animationAssetsName + "_json" );
		let tex = RES.getRes( animationAssetsName + "_png" );
		return new egret.MovieClipDataFactory( data, tex );
	}

	private static drawBackgroundOn( target: egret.Sprite ):void{
		GraphicTool.drawRect( target, new egret.Rectangle( 0, 0, BingoBackGroundSetting.gameMask.width, BingoBackGroundSetting.gameMask.height ), this.bgColor );
	}

	private static buildBGItemsByArray( target: egret.Sprite, mcf: egret.MovieClipDataFactory ): Array<egret.DisplayObject>{
		let items: Array<egret.DisplayObject> = new Array<egret.DisplayObject>();
		let bgItemNames: Array<string> = this.bgItems;
		for( let i: number = 0; i < bgItemNames.length; i++ ){
			let sp: egret.DisplayObject;
			if( RES.getRes( this.getAssetStr( bgItemNames[i]["name"] ) ) ){
				sp = Com.addBitmapAt( target, this.getAssetStr( bgItemNames[i]["name"] ), bgItemNames[i]["x"], bgItemNames[i]["y"] );
				sp.name = this.getAssetStr(  bgItemNames[i]["name"] );
			}
			else{
				sp = Com.addMovieClipAt( target, mcf, bgItemNames[i]["name"], bgItemNames[i]["x"], bgItemNames[i]["y"] );
				sp.name = this.getAssetStr( bgItemNames[i]["name"] );
			}
			target.addChild( sp );
			items.push(sp);
		}
		return items;
	}

	public static set defaultScale( value: boolean ){
		if( value ){
			BingoBackGroundSetting.gameScale = new egret.Point( 151 / 160, 0.77 );
		}
		else{//unScale
			BingoBackGroundSetting.gameScale = new egret.Point( 1, 1 );
		}
	}
}
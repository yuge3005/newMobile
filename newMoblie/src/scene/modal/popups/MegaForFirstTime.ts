class MegaForFirstTime extends GenericPo {
	private langResource: string;
	private megaBg: egret.Bitmap;

	public static lastRect: egret.Rectangle = new egret.Rectangle( 318, 150, 67, 67 );

	protected static get classAssetName() {
        return "megaForFirst_" + MuLang.language;
    }

	public constructor() {
		super();
	}

	protected init() {
        this.langResource = "megaForFirst_" + MuLang.language + "_json";
        this.bgAssetName = this.langResource + ".firstMega_bg";

        super.init();

		setTimeout( this.doutorGo.bind(this), 315 );
	}

	private doutorGo(){
		let dt: egret.Bitmap = Com.addBitmapAt( this, this.langResource + ".doctor", -100, 210 );
		dt.alpha = 0.2;
		let tw: egret.Tween = egret.Tween.get( dt );
		tw.to( { alpha: 1, x: 200 }, 300, egret.Ease.backIn );
		tw.call( this.showBigMega.bind( this ) );
	}

	private showBigMega(){
		let star: egret.Bitmap = Com.addBitmapAt( this, this.langResource + ".light", 510, 300 );
		star.anchorOffsetX = star.width >> 1;
		star.anchorOffsetY = star.height >> 1;
		star.scaleX = star.scaleY = 0.2;

		let bigMegaBg: egret.Bitmap = Com.addBitmapAt( this, this.langResource + ".megaball_" + MuLang.language, 510, 300 );
		bigMegaBg.anchorOffsetX = bigMegaBg.width >> 1;
		bigMegaBg.anchorOffsetY = bigMegaBg.height >> 1;
		bigMegaBg.scaleX = bigMegaBg.scaleY = 0.2;
		this.megaBg = bigMegaBg;

		let tw: egret.Tween = egret.Tween.get( bigMegaBg );
		tw.to( { scaleX: 1, scaleY: 1 }, 600, egret.Ease.backIn );

		let twL: egret.Tween = egret.Tween.get( star );
		twL.to( { scaleX: 1, scaleY: 1 }, 400, egret.Ease.backIn );
		twL.to( { rotation: 1080 }, 2000 );
		twL.call( this.rotateStar.bind( this, star ) );
	}

	private rotateStar( star: egret.Bitmap ){
		if( this.contains( star ) ) this.removeChild( star );

		let rect: egret.Rectangle = MegaForFirstTime.lastRect;
		rect.width *= 1.17;//for some alpha part of the png
		rect.height *= 1.17;
		let tw: egret.Tween = egret.Tween.get( this.megaBg );
		tw.to( { x: rect.x + rect.width, y: rect.y + rect.height, width: rect.width, height: rect.height }, 600 );
		tw.call( this.showLight.bind( this ) );
	}

	private showLight(){
		this.showDailog();
	}

	private showDailog(){
		let dailog: egret.Bitmap = Com.addBitmapAt( this, this.langResource + ".dialog_" + MuLang.language, 100, 220 );
		this.setChildIndex( dailog, 1 );
		dailog.alpha = 0.2;

		let tw: egret.Tween = egret.Tween.get( dailog );
		tw.to( { x: 400, alpha: 1 }, 300, egret.Ease.backIn );
		tw.wait( 4000 );
		tw.call( this.onClose.bind( this ) );
	}
}